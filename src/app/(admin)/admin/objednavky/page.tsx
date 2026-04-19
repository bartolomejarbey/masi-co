import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase-admin";
import { formatPrice } from "@/lib/utils";
import { getOrderStatusLabel } from "@/lib/shop";
import type { Order } from "@/lib/types";

const orderStatusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-cyan-100 text-cyan-700",
  processing: "bg-yellow-100 text-yellow-700",
  ready: "bg-orange-100 text-orange-700",
  delivering: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentStatusColors: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-gray-100 text-gray-600",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-yellow-100 text-yellow-700",
};

const paymentStatusLabels: Record<string, string> = {
  paid: "Zaplaceno",
  pending: "Čeká",
  failed: "Selhalo",
  refunded: "Vráceno",
};

function relativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "právě teď";
  if (diffMin < 60) return `před ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `před ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `před ${diffD} d`;
  return date.toLocaleDateString("cs-CZ");
}

export default async function AdminOrdersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminSupabase = getAdminSupabase() as any;
  const { data, error } = await adminSupabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  const orders = (data ?? []) as Order[];

  // KPI counts
  const newCount = orders.filter((o) => o.order_status === "new").length;
  const processingCount = orders.filter((o) => ["confirmed", "processing"].includes(o.order_status)).length;
  const deliveredCount = orders.filter((o) => o.order_status === "delivered").length;
  const todayRevenue = orders
    .filter((o) => {
      const d = new Date(o.created_at);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    })
    .reduce((s, o) => s + (o.final_total ?? o.total), 0);

  const miniCards = [
    { label: "Nové", value: newCount.toString(), color: "text-blue-600" },
    { label: "Zpracovávané", value: processingCount.toString(), color: "text-yellow-600" },
    { label: "Doručené", value: deliveredCount.toString(), color: "text-green-600" },
    { label: "Tržby dnes", value: formatPrice(todayRevenue), color: "text-primary" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Objednávky</h1>
          <p className="mt-1 text-sm text-gray-500">Celkem {orders.length} objednávek</p>
        </div>
      </div>

      {/* KPI mini cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {miniCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className={`mt-1 font-display text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Objednávka
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Zákazník
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 md:table-cell">
                  Datum
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Celkem
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Stav
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 md:table-cell">
                  Platba
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    Zatím žádné objednávky
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/objednavky/${order.id}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {order.first_name} {order.last_name}
                      </p>
                      <p className="text-xs text-gray-500 md:hidden">
                        {relativeTime(order.created_at)}
                      </p>
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-gray-500 md:table-cell">
                      {relativeTime(order.created_at)}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatPrice(order.final_total ?? order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          orderStatusColors[order.order_status] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {getOrderStatusLabel(order.order_status)}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          paymentStatusColors[order.payment_status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {paymentStatusLabels[order.payment_status] ?? order.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/objednavky/${order.id}`}
                        className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
