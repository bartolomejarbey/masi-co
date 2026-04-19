import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { getOrderStatusLabel } from "@/lib/shop";
import type { Customer, CustomerAddress, Order, OrderItem } from "@/lib/types";
import {
  User,
  MapPin,
  Package,
  LogOut,
  ShoppingBag,
} from "lucide-react";

interface AccountDashboardProps {
  customer: Customer;
  address: CustomerAddress | null;
  orders: Array<Order & { items?: OrderItem[] }>;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-cyan-100 text-cyan-700",
  processing: "bg-yellow-100 text-yellow-700",
  ready: "bg-orange-100 text-orange-700",
  delivering: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export function AccountDashboard({
  customer,
  address,
  orders,
}: AccountDashboardProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      {/* Sidebar */}
      <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        {/* User card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User size={20} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold">
                {customer.first_name || customer.email.split("@")[0]}{" "}
                {customer.last_name || ""}
              </p>
              <p className="truncate text-xs text-gray-500">
                {customer.email}
              </p>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
            <p className="font-display text-2xl font-bold text-primary">
              {orders.length}
            </p>
            <p className="text-xs text-gray-500">Objednávky</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
            <p className="font-display text-2xl font-bold text-primary">
              {formatPrice(
                orders.reduce(
                  (sum, o) => sum + (o.final_total ?? o.total),
                  0
                )
              )}
            </p>
            <p className="text-xs text-gray-500">Celkem</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-1">
          <Link
            href="/sortiment"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary"
          >
            <ShoppingBag size={16} />
            Pokračovat v nákupu
          </Link>
          <Link
            href="/odhlaseni"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Odhlásit se
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="space-y-6">
        {/* Info cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <User size={16} className="text-primary" />
              <h2 className="font-display text-lg font-bold">Osobní údaje</h2>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-900">Jméno:</span>{" "}
                {customer.first_name || "Nezadáno"} {customer.last_name || ""}
              </p>
              <p>
                <span className="font-medium text-gray-900">E-mail:</span>{" "}
                {customer.email}
              </p>
              <p>
                <span className="font-medium text-gray-900">Telefon:</span>{" "}
                {customer.phone || "Nezadáno"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              <h2 className="font-display text-lg font-bold">
                Doručovací adresa
              </h2>
            </div>
            <div className="text-sm text-gray-600">
              {address ? (
                <p>
                  {address.street}
                  <br />
                  {address.zip} {address.city}
                </p>
              ) : (
                <p className="text-gray-400">
                  Adresa se doplní po první objednávce.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Package size={16} className="text-primary" />
            <h2 className="font-display text-lg font-bold">
              Historie objednávek
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="mt-6 rounded-xl bg-gray-50 px-5 py-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <Package size={20} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Zatím žádné objednávky
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Jakmile vytvoříte objednávku v přihlášeném stavu, zobrazí se
                zde.
              </p>
              <Link
                href="/sortiment"
                className="mt-4 inline-flex rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary"
              >
                Začít nakupovat
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {orders.map((order) => {
                const statusClass =
                  statusColors[order.order_status] ??
                  "bg-gray-100 text-gray-700";
                return (
                  <article
                    key={order.id}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <p className="font-display text-base font-bold">
                          {order.order_number}
                        </p>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass}`}
                        >
                          {getOrderStatusLabel(order.order_status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">
                          {new Date(order.created_at).toLocaleDateString(
                            "cs-CZ"
                          )}
                        </span>
                        <span className="font-bold text-black">
                          {formatPrice(order.final_total ?? order.total)}
                        </span>
                      </div>
                    </div>

                    {(order.items ?? []).length > 0 && (
                      <div className="mt-3 space-y-1.5 border-t border-gray-200 pt-3">
                        {(order.items ?? []).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-700">
                              {item.product_name}{" "}
                              <span className="text-gray-400">
                                ({item.quantity} {item.unit})
                              </span>
                            </span>
                            <span className="font-medium text-gray-900">
                              {formatPrice(
                                item.final_total ?? item.estimated_total
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
