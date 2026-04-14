import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminSupabase } from "@/lib/supabase-admin";
import { formatPrice } from "@/lib/utils";
import { getOrderStatusLabel } from "@/lib/shop";
import { updateOrderStatus, updateOrderAdminNote, updateOrderItemFinal } from "@/lib/admin-actions";
import type { Order, OrderItem } from "@/lib/types";

type Props = { params: { id: string } };

export default async function AdminOrderDetailPage({ params }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminSupabase = getAdminSupabase() as any;

  const [{ data: order, error: orderErr }, { data: items, error: itemsErr }] = await Promise.all([
    adminSupabase.from("orders").select("*").eq("id", params.id).maybeSingle(),
    adminSupabase.from("order_items").select("*").eq("order_id", params.id),
  ]);

  if (orderErr) throw new Error(orderErr.message);
  if (itemsErr) throw new Error(itemsErr.message);
  if (!order) notFound();

  const typedOrder = order as Order;
  const typedItems = (items ?? []) as OrderItem[];
  const statusOptions: Order["order_status"][] = [
    "new", "confirmed", "processing", "ready", "delivering", "delivered", "cancelled",
  ];

  const paymentLabel: Record<string, string> = {
    cash_on_delivery: "Hotově při převzetí",
    meal_vouchers: "Stravenky",
    online_card: "Online kartou",
    apple_pay: "Apple Pay",
    google_pay: "Google Pay",
  };

  return (
    <div className="p-6 lg:p-8">
      <Link href="/admin/objednavky" className="text-sm font-medium text-[#CC1939] hover:underline">
        ← Zpět na objednávky
      </Link>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">{typedOrder.order_number}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {new Date(typedOrder.created_at).toLocaleString("cs-CZ")}
          </p>
        </div>

        <form action={updateOrderStatus} className="flex items-center gap-2">
          <input type="hidden" name="orderId" value={typedOrder.id} />
          <select
            name="status"
            defaultValue={typedOrder.order_status}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{getOrderStatusLabel(s)}</option>
            ))}
          </select>
          <button type="submit" className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#CC1939]">
            Uložit stav
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Položky */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-display text-xl font-bold">Položky objednávky</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="pb-2 font-medium">Produkt</th>
                    <th className="pb-2 font-medium">Množství</th>
                    <th className="pb-2 font-medium">Cena/j.</th>
                    <th className="pb-2 font-medium">Odhad</th>
                    <th className="pb-2 font-medium">Skutečná cena</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {typedItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-medium">{item.product_name}</td>
                      <td className="py-3">{item.quantity} {item.unit}</td>
                      <td className="py-3">{formatPrice(item.unit_price)}</td>
                      <td className="py-3">{formatPrice(item.estimated_total)}</td>
                      <td className="py-3">
                        <form action={updateOrderItemFinal} className="flex items-center gap-1">
                          <input type="hidden" name="itemId" value={item.id} />
                          <input type="hidden" name="orderId" value={typedOrder.id} />
                          <input
                            type="number"
                            name="final_total"
                            step="0.01"
                            defaultValue={item.final_total ?? ""}
                            placeholder={String(item.estimated_total)}
                            className="w-24 rounded border border-gray-300 px-2 py-1 text-sm focus:border-[#CC1939] focus:outline-none"
                          />
                          <button type="submit" className="rounded bg-black px-2 py-1 text-xs text-white hover:bg-[#CC1939]">
                            ✓
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end border-t border-gray-200 pt-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Odhadovaná cena: {formatPrice(typedOrder.total)}</p>
                {typedOrder.final_total && (
                  <p className="mt-1 font-display text-xl font-bold text-[#CC1939]">
                    Konečná cena: {formatPrice(typedOrder.final_total)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Admin poznámka */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-display text-xl font-bold">Admin poznámka</h2>
            <form action={updateOrderAdminNote} className="mt-4">
              <input type="hidden" name="orderId" value={typedOrder.id} />
              <textarea
                name="admin_note"
                rows={3}
                defaultValue={typedOrder.admin_note ?? ""}
                placeholder="Interní poznámka k objednávce..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
              />
              <button type="submit" className="mt-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#CC1939]">
                Uložit poznámku
              </button>
            </form>
          </div>

          {/* Poznámka zákazníka */}
          {typedOrder.note && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
              <h2 className="font-display text-xl font-bold">Poznámka zákazníka</h2>
              <p className="mt-2 text-sm text-gray-700">{typedOrder.note}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="font-display text-lg font-bold">Zákazník</h3>
            <div className="mt-3 space-y-1 text-sm text-gray-700">
              <p className="font-semibold text-black">{typedOrder.first_name} {typedOrder.last_name}</p>
              <p>{typedOrder.email}</p>
              <p>{typedOrder.phone}</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="font-display text-lg font-bold">Doručovací adresa</h3>
            <div className="mt-3 space-y-1 text-sm text-gray-700">
              <p>{typedOrder.shipping_street}</p>
              <p>{typedOrder.shipping_zip} {typedOrder.shipping_city}</p>
            </div>
          </div>

          {typedOrder.is_company && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-display text-lg font-bold">Fakturační údaje</h3>
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                {typedOrder.billing_company_name && <p className="font-semibold">{typedOrder.billing_company_name}</p>}
                {typedOrder.billing_ico && <p>IČO: {typedOrder.billing_ico}</p>}
                {typedOrder.billing_dic && <p>DIČ: {typedOrder.billing_dic}</p>}
                {!typedOrder.billing_same_as_shipping && (
                  <>
                    <p>{typedOrder.billing_street}</p>
                    <p>{typedOrder.billing_zip} {typedOrder.billing_city}</p>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="font-display text-lg font-bold">Platba</h3>
            <div className="mt-3 space-y-1 text-sm text-gray-700">
              <p>{paymentLabel[typedOrder.payment_method] ?? typedOrder.payment_method}</p>
              <p>Stav: {
                typedOrder.payment_status === "paid" ? "Zaplaceno" :
                typedOrder.payment_status === "pending" ? "Čeká na platbu" :
                typedOrder.payment_status === "failed" ? "Platba selhala" : "Vráceno"
              }</p>
              <p className="!mt-3 border-t border-gray-100 pt-3 font-display text-lg font-bold">
                {formatPrice(typedOrder.final_total ?? typedOrder.total)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="font-display text-lg font-bold">Stav objednávky</h3>
            <p className="mt-3">
              <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                typedOrder.order_status === "new" ? "bg-blue-100 text-blue-700" :
                typedOrder.order_status === "delivered" ? "bg-green-100 text-green-700" :
                typedOrder.order_status === "cancelled" ? "bg-red-100 text-red-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {getOrderStatusLabel(typedOrder.order_status)}
              </span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
