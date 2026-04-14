import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { getOrderStatusLabel } from "@/lib/shop";
import type { Customer, CustomerAddress, Order, OrderItem } from "@/lib/types";

interface AccountDashboardProps {
  customer: Customer;
  address: CustomerAddress | null;
  orders: Array<Order & { items?: OrderItem[] }>;
}

export function AccountDashboard({ customer, address, orders }: AccountDashboardProps) {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-display text-2xl font-bold">Základní údaje</h2>
          <div className="mt-5 space-y-3 text-sm leading-6 text-gray-700">
            <p>
              <strong>Jméno:</strong> {customer.first_name || "Nezadáno"} {customer.last_name || ""}
            </p>
            <p>
              <strong>E-mail:</strong> {customer.email}
            </p>
            <p>
              <strong>Telefon:</strong> {customer.phone || "Nezadáno"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-display text-2xl font-bold">Výchozí adresa</h2>
          <div className="mt-5 text-sm leading-6 text-gray-700">
            {address ? (
              <p>
                {address.street}
                <br />
                {address.zip} {address.city}
              </p>
            ) : (
              <p>Adresa zatím není uložená. Doplní se po první objednávce v přihlášeném stavu.</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Historie objednávek</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">Přehled vašich objednávek uložených pod tímto účtem.</p>
          </div>
          <Link
            href="/odhlaseni"
            className="inline-flex rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
          >
            Odhlásit se
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-gray-50 px-5 py-8 text-sm leading-6 text-gray-600">
            Zatím tu není žádná objednávka přiřazená k vašemu účtu. Jakmile vytvoříte objednávku v přihlášeném stavu, zobrazí se zde automaticky.
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {orders.map((order) => (
              <article key={order.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold">{order.order_number}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString("cs-CZ")} • {getOrderStatusLabel(order.order_status)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-black">{formatPrice(order.final_total ?? order.total)}</p>
                    <p className="text-xs text-gray-500">včetně DPH</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {(order.items ?? []).map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-4 text-sm">
                      <div>
                        <p className="font-medium text-black">{item.product_name}</p>
                        <p className="text-gray-500">
                          {item.quantity} {item.unit} × {formatPrice(item.unit_price)}
                        </p>
                      </div>
                      <p className="font-medium text-black">{formatPrice(item.final_total ?? item.estimated_total)}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
