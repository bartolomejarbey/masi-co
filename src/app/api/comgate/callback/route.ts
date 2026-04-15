import { NextResponse } from "next/server";
import { getComgateStatus } from "@/lib/comgate";
import { getAdminSupabase } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.formData();
    const transId = body.get("id") as string;

    if (!transId) {
      return NextResponse.json({ error: "Missing transId" }, { status: 400 });
    }

    const result = await getComgateStatus(transId);
    if (!result.ok) {
      console.error("[Comgate callback] Status error:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminSupabase = getAdminSupabase() as any;

    const paymentStatusMap: Record<string, string> = {
      PAID: "paid",
      CANCELLED: "cancelled",
      PENDING: "pending",
      AUTHORIZED: "pending",
    };

    const newPaymentStatus = paymentStatusMap[result.status] || "pending";

    await adminSupabase
      .from("orders")
      .update({
        payment_status: newPaymentStatus,
        ...(newPaymentStatus === "paid" ? { order_status: "confirmed" } : {}),
      })
      .eq("id", result.refId);

    console.log(`[Comgate callback] Order ${result.refId}: ${result.status} -> ${newPaymentStatus}`);

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("[Comgate callback] Error:", error);
    return NextResponse.json({ error: "Callback processing failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const transId = url.searchParams.get("id");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!transId) {
    return NextResponse.redirect(`${siteUrl}/pokladna/potvrzeni`);
  }

  const result = await getComgateStatus(transId);

  if (result.ok) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adminSupabase = getAdminSupabase() as any;
    const { data: order } = await adminSupabase
      .from("orders")
      .select("order_number")
      .eq("id", result.refId)
      .single();

    const orderNumber = order?.order_number || "";
    return NextResponse.redirect(
      `${siteUrl}/pokladna/potvrzeni?order=${encodeURIComponent(orderNumber)}&status=${result.status}`
    );
  }

  return NextResponse.redirect(`${siteUrl}/pokladna/potvrzeni`);
}
