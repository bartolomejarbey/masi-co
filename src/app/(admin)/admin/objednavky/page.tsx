import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase-admin";
import { formatPrice } from "@/lib/utils";
import { getOrderStatusLabel } from "@/lib/shop";
import { updateOrderStatus } from "@/lib/admin-actions";
import type { Order } from "@/lib/types";

export default async function AdminOrdersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminSupabase = getAdminSupabase() as any;
  const { data, error } = await adminSupabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  const orders = (data ?? []) as Order[];

  const statusOptions: Order["order_status"][] = [
    "new", "confirmed", "processing", "ready", "delivering", "delivered", "cancelled",
  ];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display text-3xl font-bold">Objednávky</h1>
      <p className="mt-1 text-sm text-gray-500">Celkem {orders.length} objednávek</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Objednávka</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Zákazník</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Celkem</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Platba</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Stav</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Datum</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    Žádné objednávky
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/objednavky/${order.id}`} className="font-semibold text-[#CC1939] hover:underline">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {order.first_name} {order.last_name}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{order.email}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(order.final_total ?? order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      order.payment_status === "paid" ? "bg-green-100 text-green-700" :
                      order.payment_status === "failed" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {order.payment_status === "paid" ? "Zaplaceno" :
                       order.payment_status === "pending" ? "Čeká" :
                       order.payment_status === "failed" ? "Selhalo" : "Vráceno"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <form action={updateOrderStatus} className="flex items-center gap-1">
                      <input type="hidden" name="orderId" value={order.id} />
                      <select
                        name="status"
                        defaultValue={order.order_status}
                        className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-[#CC1939] focus:outline-none"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{getOrderStatusLabel(s)}</option>
                        ))}
                      </select>
                      <button type="submit" className="rounded bg-black px-2 py-1 text-xs text-white hover:bg-[#CC1939]">
                        ✓
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString("cs-CZ")}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/objednavky/${order.id}`} className="text-sm font-medium text-[#CC1939] hover:underline">
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
