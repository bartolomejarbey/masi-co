import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminSupabase } from "@/lib/supabase-admin";
import { formatPrice } from "@/lib/utils";
import { getOrderStatusLabel } from "@/lib/shop";
import { updateOrderStatus, updateOrderAdminNote, updateOrderItemFinal } from "@/lib/admin-actions";
import type { Order, OrderItem } from "@/lib/types";
import { ArrowLeft, Check } from "lucide-react";

type Props = { params: { id: string } };

const orderStatusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-cyan-100 text-cyan-700",
  processing: "bg-yellow-100 text-yellow-700",
  ready: "bg-orange-100 text-orange-700",
  delivering: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const timelineStatuses: Order["order_status"][] = [
  "new", "confirmed", "processing", "ready", "delivering", "delivered",
];

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
    bank_transfer: "Bankovní převod",
  };

  const currentStatusIndex = timelineStatuses.indexOf(typedOrder.order_status);
  const isCancelled = typedOrder.order_status === "cancelled";

  return (
    <div className="p-6 lg:p-8">
      <Link
        href="/admin/objednavky"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
      >
        <ArrowLeft size={14} />
        Zpět na objednávky
      </Link>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold text-gray-900">
            {typedOrder.order_number}
          </h1>
          <span
            className={`rounded-full px-3 py-0.5 text-xs font-medium ${
              orderStatusColors[typedOrder.order_status] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {getOrderStatusLabel(typedOrder.order_status)}
          </span>
        </div>

        <form action={updateOrderStatus} className="flex items-center gap-2">
          <input type="hidden" name="orderId" value={typedOrder.id} />
          <select
            name="status"
            defaultValue={typedOrder.order_status}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{getOrderStatusLabel(s)}</option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Uložit stav
          </button>
        </form>
      </div>

      {/* Status Timeline */}
      {!isCancelled && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            {timelineStatuses.map((status, i) => {
              const isPast = i <= currentStatusIndex;
              const isCurrent = i === currentStatusIndex;
              return (
                <div key={status} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                        isCurrent
                          ? "bg-primary text-white ring-4 ring-primary/20"
                          : isPast
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isPast ? <Check size={14} /> : i + 1}
                    </div>
                    <span
                      className={`mt-1.5 text-[10px] font-medium ${
                        isCurrent ? "text-primary" : isPast ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      {getOrderStatusLabel(status)}
                    </span>
                  </div>
                  {i < timelineStatuses.length - 1 && (
                    <div
                      className={`mx-1 h-0.5 flex-1 ${
                        i < currentStatusIndex ? "bg-primary" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4">
          <p className="text-sm font-medium text-red-700">
            Tato objednávka byla zrušena.
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Items */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-display text-lg font-bold text-gray-900">
              Položky objednávky
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Produkt
                    </th>
                    <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Množství
                    </th>
                    <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Cena/j.
                    </th>
                    <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Odhad
                    </th>
                    <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Skutečná cena
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {typedItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-medium text-gray-900">{item.product_name}</td>
                      <td className="py-3 text-gray-600">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-3 text-gray-600">{formatPrice(item.unit_price)}</td>
                      <td className="py-3 text-gray-600">{formatPrice(item.estimated_total)}</td>
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
                            className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-primary focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="rounded-lg bg-gray-900 px-2 py-1 text-xs text-white transition-colors hover:bg-primary"
                          >
                            <Check size={12} />
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
                <p className="text-sm text-gray-500">
                  Orientační: {formatPrice(typedOrder.total)}
                </p>
                {typedOrder.final_total && (
                  <p className="mt-1 font-display text-xl font-bold text-primary">
                    Konečná: {formatPrice(typedOrder.final_total)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Admin note */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-display text-lg font-bold text-gray-900">
              Admin poznámka
            </h2>
            <form action={updateOrderAdminNote} className="mt-3">
              <input type="hidden" name="orderId" value={typedOrder.id} />
              <textarea
                name="admin_note"
                rows={3}
                defaultValue={typedOrder.admin_note ?? ""}
                placeholder="Interní poznámka k objednávce..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="mt-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary"
              >
                Uložit poznámku
              </button>
            </form>
          </div>

          {typedOrder.note && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
              <h2 className="text-sm font-semibold text-yellow-800">
                Poznámka zákazníka
              </h2>
              <p className="mt-2 text-sm text-gray-700">{typedOrder.note}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Zákazník
            </h3>
            <div className="mt-3 space-y-1 text-sm">
              <p className="font-semibold text-gray-900">
                {typedOrder.first_name} {typedOrder.last_name}
              </p>
              <p className="text-gray-600">{typedOrder.email}</p>
              <p className="text-gray-600">{typedOrder.phone}</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Doručovací adresa
            </h3>
            <div className="mt-3 space-y-0.5 text-sm text-gray-700">
              <p>{typedOrder.shipping_street}</p>
              <p>
                {typedOrder.shipping_zip} {typedOrder.shipping_city}
              </p>
            </div>
          </div>

          {typedOrder.is_company && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Fakturační údaje
              </h3>
              <div className="mt-3 space-y-0.5 text-sm text-gray-700">
                {typedOrder.billing_company_name && (
                  <p className="font-semibold">{typedOrder.billing_company_name}</p>
                )}
                {typedOrder.billing_ico && <p>IČO: {typedOrder.billing_ico}</p>}
                {typedOrder.billing_dic && <p>DIČ: {typedOrder.billing_dic}</p>}
                {!typedOrder.billing_same_as_shipping && (
                  <>
                    <p>{typedOrder.billing_street}</p>
                    <p>
                      {typedOrder.billing_zip} {typedOrder.billing_city}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Platba a doprava
            </h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Způsob platby</span>
                <span className="font-medium text-gray-900">
                  {paymentLabel[typedOrder.payment_method] ?? typedOrder.payment_method}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Stav platby</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    typedOrder.payment_status === "paid"
                      ? "bg-green-100 text-green-700"
                      : typedOrder.payment_status === "failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {typedOrder.payment_status === "paid"
                    ? "Zaplaceno"
                    : typedOrder.payment_status === "pending"
                    ? "Čeká"
                    : typedOrder.payment_status === "failed"
                    ? "Selhalo"
                    : "Vráceno"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Doprava</span>
                <span className="font-medium text-gray-900">Vlastní rozvoz</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Souhrn ceny
            </h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Mezisoučet</span>
                <span className="text-gray-900">{formatPrice(typedOrder.total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Doprava</span>
                <span className="font-medium text-green-600">Zdarma</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Celkem</span>
                  <span className="font-display text-xl font-bold text-primary">
                    {formatPrice(typedOrder.final_total ?? typedOrder.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400">
            Vytvořeno {new Date(typedOrder.created_at).toLocaleString("cs-CZ")}
          </p>
        </aside>
      </div>
    </div>
  );
}
