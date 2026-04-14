import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase-admin";
import { formatPrice } from "@/lib/utils";
import { getOrderStatusLabel } from "@/lib/shop";
import type { Order } from "@/lib/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function admin(): any {
  return getAdminSupabase();
}

async function getDashboardData() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    { data: allOrders },
    { data: todayOrders },
    { data: weekOrders },
    { data: monthOrders },
    { data: recentOrders },
    { count: productCount },
    { count: customerCount },
    { data: stockData },
  ] = await Promise.all([
    admin().from("orders").select("total"),
    admin().from("orders").select("total").gte("created_at", todayStart),
    admin().from("orders").select("total").gte("created_at", weekStart),
    admin().from("orders").select("total").gte("created_at", monthStart),
    admin().from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    admin().from("products").select("*", { count: "exact", head: true }),
    admin().from("customers").select("*", { count: "exact", head: true }),
    admin().from("products").select("stock_status").eq("is_active", true),
  ]);

  const sum = (arr: { total: number }[] | null) => (arr ?? []).reduce((s, o) => s + o.total, 0);

  const stockItems = (stockData ?? []) as { stock_status: string }[];
  const outOfStockCount = stockItems.filter((p) => p.stock_status === "out_of_stock").length;
  const onOrderCount = stockItems.filter((p) => p.stock_status === "on_order").length;

  return {
    totalOrders: (allOrders ?? []).length,
    todayOrderCount: (todayOrders ?? []).length,
    todayRevenue: sum(todayOrders),
    weekRevenue: sum(weekOrders),
    monthRevenue: sum(monthOrders),
    totalRevenue: sum(allOrders),
    recentOrders: (recentOrders ?? []) as Order[],
    productCount: productCount ?? 0,
    customerCount: customerCount ?? 0,
    outOfStockCount,
    onOrderCount,
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const statCards = [
    { label: "Celkem objednávek", value: data.totalOrders },
    { label: "Dnešní objednávky", value: data.todayOrderCount },
    { label: "Produktů", value: data.productCount },
    { label: "Zákazníků", value: data.customerCount },
  ];

  const stockCards = [
    {
      label: "Vyprodáno",
      value: data.outOfStockCount,
      color: data.outOfStockCount > 0 ? "border-red-300 bg-red-50" : "",
      textColor: data.outOfStockCount > 0 ? "text-red-600" : "",
    },
    {
      label: "Na objednávku",
      value: data.onOrderCount,
      color: data.onOrderCount > 0 ? "border-orange-300 bg-orange-50" : "",
      textColor: data.onOrderCount > 0 ? "text-orange-600" : "",
    },
  ];

  const revenueCards = [
    { label: "Tržby dnes", value: formatPrice(data.todayRevenue) },
    { label: "Tržby tento týden", value: formatPrice(data.weekRevenue) },
    { label: "Tržby tento měsíc", value: formatPrice(data.monthRevenue) },
    { label: "Tržby celkem", value: formatPrice(data.totalRevenue) },
  ];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Přehled e-shopu MASI-CO</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Stock alert cards */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {stockCards.map((card) => (
          <Link
            key={card.label}
            href="/admin/produkty"
            className={`rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300 ${card.color}`}
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className={`mt-2 font-display text-3xl font-bold ${card.textColor}`}>{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {revenueCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-[#CC1939]">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Poslední objednávky</h2>
          <Link href="/admin/objednavky" className="text-sm font-medium text-[#CC1939] hover:underline">
            Všechny objednávky →
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Objednávka</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Zákazník</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Celkem</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Stav</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    Žádné objednávky
                  </td>
                </tr>
              )}
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/objednavky/${order.id}`} className="font-semibold text-[#CC1939] hover:underline">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {order.first_name} {order.last_name}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.order_status === "new" ? "bg-blue-100 text-blue-700" :
                      order.order_status === "delivered" ? "bg-green-100 text-green-700" :
                      order.order_status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {getOrderStatusLabel(order.order_status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("cs-CZ")}
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
