import { NextResponse } from "next/server";
import { fetchMinOrderAmount } from "@/lib/shop";
import { createServerClient } from "@supabase/ssr";
import { getAdminSupabase, isAdminSupabaseConfigured } from "@/lib/supabase-admin";
import { createComgatePayment, isComgateConfigured } from "@/lib/comgate";
import { generateSPDString, getQRCodeUrl } from "@/lib/qr-payment";
import { sendOrderConfirmation } from "@/lib/email";
import type { CartItem, Database, PaymentMethod } from "@/lib/types";
import { ensureCustomerProfile } from "@/lib/shop";

type OrderPayload = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  shipping_street?: string;
  shipping_city?: string;
  shipping_zip?: string;
  is_company?: boolean;
  billing_company_name?: string;
  billing_ico?: string;
  billing_dic?: string;
  shipping_method?: "own_delivery";
  payment_method?: PaymentMethod;
  note?: string;
  items?: CartItem[];
};

const allowedPaymentMethods: PaymentMethod[] = ["cash_on_delivery", "bank_transfer", "meal_vouchers", "online_card"];

export async function POST(request: Request) {
  try {
    if (!isAdminSupabaseConfigured()) {
      return NextResponse.json({ error: "Server není připravený pro ukládání objednávek." }, { status: 500 });
    }

    const body = (await request.json()) as OrderPayload;
    const items = Array.isArray(body.items) ? body.items : [];
    const response = NextResponse.next();
    const supabaseServer = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          get(name: string) {
            return request.headers.get("cookie")
              ?.split("; ")
              .find((cookie) => cookie.startsWith(`${name}=`))
              ?.split("=")[1];
          },
          set(name: string, value: string, options) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options) {
            response.cookies.set({ name, value: "", ...options, maxAge: 0 });
          },
        },
      }
    );
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    if (
      !body.first_name ||
      !body.last_name ||
      !body.email ||
      !body.phone ||
      !body.shipping_street ||
      !body.shipping_city ||
      !body.shipping_zip ||
      items.length === 0
    ) {
      return NextResponse.json({ error: "Chybí povinné údaje objednávky." }, { status: 400 });
    }

    if (!body.payment_method || !allowedPaymentMethods.includes(body.payment_method)) {
      return NextResponse.json({ error: "Neplatný způsob platby." }, { status: 400 });
    }

    const minOrderAmount = await fetchMinOrderAmount();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminSupabase = getAdminSupabase() as any;
    const productIds = items.map((item) => item.product.id);
    const { data: currentProducts, error: productsError } = await adminSupabase
      .from("products")
      .select("id, name, unit, price")
      .in("id", productIds)
      .eq("is_active", true);

    if (productsError) {
      return NextResponse.json({ error: productsError.message }, { status: 500 });
    }

    const typedProducts = (currentProducts ?? []) as Array<{
      id: string;
      name: string;
      unit: "kg" | "ks";
      price: number;
    }>;
    const productsById = new Map(typedProducts.map((product) => [product.id, product]));
    const normalizedItems = items.map((item) => {
      const product = productsById.get(item.product.id);

      if (!product) {
        throw new Error(`Produkt ${item.product.name} už není dostupný.`);
      }

      return {
        productId: product.id,
        productName: product.name,
        unit: product.unit,
        unitPrice: product.price,
        quantity: item.quantity,
        estimatedTotal: product.price * item.quantity,
      };
    });

    const normalizedSubtotal = normalizedItems.reduce((sum, item) => sum + item.estimatedTotal, 0);

    if (normalizedSubtotal < minOrderAmount) {
      return NextResponse.json(
        { error: `Minimální hodnota objednávky je ${minOrderAmount} Kč.` },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await adminSupabase
      .from("orders")
      .insert({
        customer_id: user?.id ?? null,
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
        phone: body.phone,
        shipping_street: body.shipping_street,
        shipping_city: body.shipping_city,
        shipping_zip: body.shipping_zip,
        billing_same_as_shipping: true,
        billing_company_name: body.is_company ? body.billing_company_name || null : null,
        billing_ico: body.is_company ? body.billing_ico || null : null,
        billing_dic: body.is_company ? body.billing_dic || null : null,
        is_company: Boolean(body.is_company),
        shipping_method: "own_delivery",
        payment_method: body.payment_method,
        payment_status: "pending",
        order_status: "new",
        subtotal: normalizedSubtotal,
        shipping_price: 0,
        total: normalizedSubtotal,
        final_total: null,
        note: body.note || null,
        admin_note: null,
        delivered_at: null,
      })
      .select("id, order_number")
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: orderError?.message || "Objednávku se nepodařilo vytvořit." }, { status: 500 });
    }

    if (user) {
      await ensureCustomerProfile(user, {
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
        phone: body.phone,
        company_name: body.is_company ? body.billing_company_name || null : null,
        ico: body.is_company ? body.billing_ico || null : null,
        dic: body.is_company ? body.billing_dic || null : null,
        address: {
          street: body.shipping_street,
          city: body.shipping_city,
          zip: body.shipping_zip,
        },
      });
    }

    const { error: itemsError } = await adminSupabase.from("order_items").insert(
      normalizedItems.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unitPrice,
        estimated_total: item.estimatedTotal,
        final_total: null,
      }))
    );

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    // Generate QR payment data for bank transfer
    const spdString = generateSPDString({
      amount: normalizedSubtotal,
      orderNumber: order.order_number,
    });
    const qrCodeUrl = getQRCodeUrl(spdString);

    // Send confirmation email (non-blocking)
    sendOrderConfirmation({
      to: body.email!,
      orderNumber: order.order_number,
      firstName: body.first_name!,
      items: normalizedItems.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        unit: item.unit,
      })),
      total: normalizedSubtotal,
      paymentMethod: body.payment_method!,
      shippingAddress: `${body.shipping_street}, ${body.shipping_city} ${body.shipping_zip}`,
      bankTransferSPD: spdString,
      qrCodeUrl,
    }).catch((err) => console.error("[EMAIL] Failed to send:", err));

    // For online payment, create Comgate transaction
    if (body.payment_method === "online_card" && isComgateConfigured()) {
      const comgateResult = await createComgatePayment({
        orderId: order.id,
        orderNumber: order.order_number,
        totalCZK: normalizedSubtotal,
        email: body.email!,
      });

      if (comgateResult.ok) {
        return NextResponse.json({
          orderNumber: order.order_number,
          redirectUrl: comgateResult.redirectUrl,
        });
      }

      // Comgate failed — order still created, just no redirect
      console.error("[Comgate] Payment creation failed:", comgateResult.error);
    }

    return NextResponse.json({
      orderNumber: order.order_number,
      qrCodeUrl: body.payment_method === "bank_transfer" ? qrCodeUrl : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Neočekávaná chyba při vytváření objednávky." },
      { status: 500 }
    );
  }
}
