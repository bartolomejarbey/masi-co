"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/utils";

interface CartPageClientProps {
  minOrderAmount: number;
}

export function CartPageClient({ minOrderAmount }: CartPageClientProps) {
  const { items, removeFromCart, updateQuantity, getTotal } = useCart();
  const subtotal = getTotal();
  const checkoutAllowed = subtotal >= minOrderAmount;
  const missingAmount = Math.max(0, minOrderAmount - subtotal);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
        <h1 className="font-display text-3xl font-bold">Košík je zatím prázdný</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Vyberte si produkty z katalogu a vraťte se sem k pohodlnému dokončení objednávky.
        </p>
        <Link
          href="/produkty"
          className="mt-6 inline-flex rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary"
        >
          Přejít do katalogu
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        {items.map(({ product, quantity }) => {
          const step = product.unit === "kg" ? 0.5 : 1;
          const min = product.unit === "kg" ? 0.5 : 1;
          const total = product.price * quantity;
          const stockMax = product.manage_stock && product.stock_quantity !== null && product.allow_backorders === "no"
            ? product.stock_quantity : Infinity;
          const orderMax = product.max_per_order ?? Infinity;
          const maxQty = Math.min(stockMax, orderMax);
          const atMax = quantity >= maxQty;

          return (
            <div
              key={product.id}
              className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-[120px_minmax(0,1fr)]"
            >
              <div className="relative aspect-square rounded-xl bg-[linear-gradient(135deg,#f5f5f5,#d4d4d8)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(204,25,57,0.16),transparent_30%)]" />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Link
                      href={`/produkt/${product.slug}`}
                      className="font-display text-xl font-bold transition-colors hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatPrice(product.price)} / {product.unit}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-black">{formatPrice(total)}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center rounded-md border border-gray-200">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, Math.max(min, quantity - step))}
                      className="flex h-10 w-10 items-center justify-center text-gray-500 transition-colors hover:text-black"
                      aria-label="Snížit množství"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="min-w-14 px-2 text-center text-sm font-medium tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + step)}
                      disabled={atMax}
                      className="flex h-10 w-10 items-center justify-center text-gray-500 transition-colors hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Zvýšit množství"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-red-600"
                  >
                    <Trash2 size={16} />
                    Odebrat
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <aside className="h-fit rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="font-display text-2xl font-bold">Souhrn košíku</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Orientační cena objednávky před potvrzením rozvozu.
        </p>

        <div className="mt-6 space-y-3 border-b border-gray-200 pb-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Mezisoučet</span>
            <span className="font-semibold text-black">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Doprava</span>
            <span className="font-semibold text-black">Vlastní rozvoz</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-base font-medium text-gray-700">Celková cena</span>
          <span className="font-display text-2xl font-bold">{formatPrice(subtotal)}</span>
        </div>

        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          Cena je orientační – konečná cena odpovídá skutečné hmotnosti.
        </p>

        {!checkoutAllowed && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            Minimální hodnota objednávky je {formatPrice(minOrderAmount)}. Do limitu zbývá{" "}
            {formatPrice(missingAmount)}.
          </p>
        )}

        <Link
          href={checkoutAllowed ? "/pokladna" : "/kosik"}
          aria-disabled={!checkoutAllowed}
          className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary aria-disabled:cursor-not-allowed aria-disabled:bg-gray-200 aria-disabled:text-gray-500 aria-disabled:hover:bg-gray-200"
        >
          Pokračovat do pokladny
        </Link>
      </aside>
    </div>
  );
}
