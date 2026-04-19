"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
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
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
          <ShoppingBag size={28} className="text-gray-400" />
        </div>
        <h2 className="font-display text-2xl font-bold">Košík je zatím prázdný</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
          Vyberte si produkty z katalogu a vraťte se sem k pohodlnému dokončení objednávky.
        </p>
        <Link
          href="/sortiment"
          className="mt-6 inline-flex rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary"
        >
          Přejít do katalogu
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      {/* Items */}
      <div className="space-y-4">
        {items.map(({ product, quantity }) => {
          const step = product.unit === "kg" ? 0.5 : 1;
          const min = product.unit === "kg" ? 0.5 : 1;
          const total = product.price * quantity;
          const stockMax =
            product.manage_stock &&
            product.stock_quantity !== null &&
            product.allow_backorders === "no"
              ? product.stock_quantity
              : Infinity;
          const orderMax = product.max_per_order ?? Infinity;
          const maxQty = Math.min(stockMax, orderMax);
          const atMax = quantity >= maxQty;

          return (
            <div
              key={product.id}
              className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-[100px_minmax(0,1fr)]"
            >
              {/* Product image */}
              <Link
                href={`/produkt/${product.slug}`}
                className="relative aspect-square overflow-hidden rounded-xl bg-gray-100"
              >
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="100px"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                      Foto
                    </span>
                  </div>
                )}
              </Link>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Link
                      href={`/produkt/${product.slug}`}
                      className="font-display text-lg font-bold transition-colors hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {formatPrice(product.price)} / {product.unit}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-black">{formatPrice(total)}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center rounded-lg border border-gray-200">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(product.id, Math.max(min, quantity - step))
                      }
                      className="flex h-9 w-9 items-center justify-center text-gray-500 transition-colors hover:text-black"
                      aria-label="Snížit množství"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="min-w-12 px-1 text-center text-sm font-semibold tabular-nums">
                      {quantity} {product.unit}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + step)}
                      disabled={atMax}
                      className="flex h-9 w-9 items-center justify-center text-gray-500 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Zvýšit množství"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-red-600"
                  >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline">Odebrat</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky summary sidebar */}
      <aside className="lg:sticky lg:top-28 h-fit rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="font-display text-xl font-bold">Souhrn košíku</h2>

        <div className="mt-5 space-y-3 border-b border-gray-200 pb-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              Položky ({items.reduce((s, i) => s + i.quantity, 0)})
            </span>
            <span className="font-semibold text-black">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Doprava</span>
            <span className="text-sm font-medium text-green-600">Zdarma</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-base font-medium text-gray-700">Celkem</span>
          <span className="font-display text-2xl font-bold text-primary">
            {formatPrice(subtotal)}
          </span>
        </div>

        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
          Cena je orientační — konečná cena odpovídá skutečné navážené hmotnosti.
        </p>

        {!checkoutAllowed && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
            Minimální objednávka je {formatPrice(minOrderAmount)}. Zbývá{" "}
            {formatPrice(missingAmount)}.
          </p>
        )}

        <Link
          href={checkoutAllowed ? "/pokladna" : "/kosik"}
          aria-disabled={!checkoutAllowed}
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-black px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary aria-disabled:cursor-not-allowed aria-disabled:bg-gray-200 aria-disabled:text-gray-500 aria-disabled:hover:bg-gray-200"
        >
          Pokračovat do pokladny
        </Link>

        <Link
          href="/sortiment"
          className="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
        >
          Pokračovat v nákupu
        </Link>
      </aside>
    </div>
  );
}
