import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase-admin";
import { formatPrice } from "@/lib/utils";
import { getOrderStatusLabel } from "@/lib/shop";
import type { Order } from "@/lib/types";
import {
  ShoppingCart,
  TrendingUp,
  Package,
  AlertTriangle,
  ImageOff,
  ArrowRight,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function admin(): any {
  return getAdminSupabase();
}

const orderStatusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-cyan-100 text-cyan-700",
  processing: "bg-yellow-100 text-yellow-700",
  ready: "bg-orange-100 text-orange-700",
  delivering: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

async function getDashboardData() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

  const [
    { data: todayOrders },
    { data: monthOrders },
    { data: lastMonthOrders },
    { data: recentOrders },
    { count: activeProductCount },
    { data: stockData },
    { count: noImageCount },
  ] = await Promise.all([
    admin().from("orders").select("total").gte("created_at", todayStart),
    admin().from("orders").select("total").gte("created_at", monthStart),
    admin().from("orders").select("total").gte("created_at", lastMonthStart).lte("created_at", lastMonthEnd),
    admin().from("orders").select("*").order("created_at", { ascending: false }).limit(10),
    admin().from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    admin().from("products").select("stock_status").eq("is_active", true),
    admin().from("products").select("id", { count: "exact", head: true }).is("image_url", null).eq("is_active", true),
  ]);

  const sum = (arr: { total: number }[] | null) => (arr ?? []).reduce((s, o) => s + o.total, 0);
  const monthRevenue = sum(monthOrders);
  const lastMonthRevenue = sum(lastMonthOrders);
  const revenueChange = lastMonthRevenue > 0 ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

  const stockItems = (stockData ?? []) as { stock_status: string }[];
  const outOfStockCount = stockItems.filter((p) => p.stock_status === "out_of_stock").length;

  return {
    todayOrderCount: (todayOrders ?? []).length,
    monthRevenue,
    revenueChange,
    activeProductCount: activeProductCount ?? 0,
    outOfStockCount,
    recentOrders: (recentOrders ?? []) as Order[],
    noImageCount: noImageCount ?? 0,
  };
}

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
  if (diffD < 7) return `před ${diffD} dny`;
  return date.toLocaleDateString("cs-CZ");
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const kpiCards = [
    {
      label: "Nové objednávky dnes",
      value: data.todayOrderCount.toString(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Tržby tento měsíc",
      value: formatPrice(data.monthRevenue),
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
      trend: data.revenueChange,
    },
    {
      label: "Aktivní produkty",
      value: data.activeProductCount.toString(),
      icon: Package,
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
    {
      label: "Vyprodané produkty",
      value: data.outOfStockCount.toString(),
      icon: AlertTriangle,
      color: data.outOfStockCount > 0 ? "text-red-600" : "text-gray-600",
      bg: data.outOfStockCount > 0 ? "bg-red-50" : "bg-gray-50",
    },
  ];

  // Build alerts
  const alerts: { message: string; href: string; type: "warning" | "error" }[] = [];
  if (data.outOfStockCount > 0) {
    alerts.push({
      message: `${data.outOfStockCount} produktů vyprodáno`,
      href: "/admin/produkty",
      type: "error",
    });
  }
  if (data.noImageCount > 0) {
    alerts.push({
      message: `${data.noImageCount} produktů nemá fotku`,
      href: "/admin/produkty",
      type: "warning",
    });
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Přehled e-shopu MASI-CO</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {card.label}
              </p>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}>
                <card.icon size={16} className={card.color} />
              </div>
            </div>
            <p className={`mt-3 font-display text-3xl font-bold ${card.color}`}>
              {card.value}
            </p>
            {card.trend !== undefined && card.trend !== 0 && (
              <p className={`mt-1 text-xs font-medium ${card.trend > 0 ? "text-green-600" : "text-red-600"}`}>
                {card.trend > 0 ? "+" : ""}
                {card.trend.toFixed(1)}% oproti minulému měsíci
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mt-6 space-y-3">
          {alerts.map((alert, i) => (
            <Link
              key={i}
              href={alert.href}
              className={`flex items-center justify-between rounded-xl border px-5 py-3.5 transition-colors hover:shadow-sm ${
                alert.type === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-yellow-200 bg-yellow-50 text-yellow-700"
              }`}
            >
              <div className="flex items-center gap-3">
                {alert.type === "error" ? (
                  <AlertTriangle size={16} />
                ) : (
                  <ImageOff size={16} />
                )}
                <span className="text-sm font-medium">{alert.message}</span>
              </div>
              <ArrowRight size={16} className="opacity-50" />
            </Link>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-gray-900">
            Poslední objednávky
          </h2>
          <Link
            href="/admin/objednavky"
            className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            Všechny objednávky &rarr;
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Objednávka
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Zákazník
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:table-cell">
                  Datum
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Celkem
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Stav
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    Zatím žádné objednávky
                  </td>
                </tr>
              ) : (
                data.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/objednavky/${order.id}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {order.first_name} {order.last_name}
                    </td>
                    <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">
                      {relativeTime(order.created_at)}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatPrice(order.total)}
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
