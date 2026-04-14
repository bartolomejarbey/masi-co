import { getAdminSupabase } from "@/lib/supabase-admin";
import { formatPrice } from "@/lib/utils";
import type { Customer, Order } from "@/lib/types";

export default async function AdminCustomersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = getAdminSupabase() as any;

  const [{ data: customers }, { data: orders }] = await Promise.all([
    db.from("customers").select("*").order("created_at", { ascending: false }),
    db.from("orders").select("customer_id, total"),
  ]);

  const typedCustomers = (customers ?? []) as Customer[];
  const typedOrders = (orders ?? []) as Pick<Order, "customer_id" | "total">[];

  const orderStats: Record<string, { count: number; total: number }> = {};
  for (const o of typedOrders) {
    if (!o.customer_id) continue;
    if (!orderStats[o.customer_id]) orderStats[o.customer_id] = { count: 0, total: 0 };
    orderStats[o.customer_id].count++;
    orderStats[o.customer_id].total += o.total;
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display text-3xl font-bold">Zákazníci</h1>
      <p className="mt-1 text-sm text-gray-500">Celkem {typedCustomers.length} registrovaných zákazníků</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Jméno</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Telefon</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Firma</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Objednávek</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Celková útrata</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Registrace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {typedCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    Žádní zákazníci
                  </td>
                </tr>
              )}
              {typedCustomers.map((customer) => {
                const stats = orderStats[customer.id] ?? { count: 0, total: 0 };
                return (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      {customer.first_name ?? ""} {customer.last_name ?? ""}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                    <td className="px-4 py-3 text-gray-600">{customer.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {customer.company_name ? (
                        <span>
                          {customer.company_name}
                          {customer.ico && <span className="ml-1 text-xs text-gray-400">IČO: {customer.ico}</span>}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">{stats.count}</td>
                    <td className="px-4 py-3 font-medium">{formatPrice(stats.total)}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(customer.created_at).toLocaleDateString("cs-CZ")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
