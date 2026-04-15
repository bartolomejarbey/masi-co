"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

const stockLabels: Record<string, { text: string; className: string }> = {
  in_stock: { text: "Skladem", className: "bg-green-50 text-green-700" },
  out_of_stock: { text: "Vyprodáno", className: "bg-gray-100 text-gray-400" },
  on_order: { text: "Na objednávku", className: "bg-orange-50 text-orange-600" },
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(product.unit === "kg" ? 1 : 1);
  const stock = stockLabels[product.stock_status] || stockLabels.in_stock;
  const isAvailable = product.stock_status !== "out_of_stock";
  const step = product.unit === "kg" ? 0.5 : 1;
  const min = product.unit === "kg" ? 0.5 : 1;

  const stockMax =
    product.manage_stock && product.stock_quantity !== null && product.allow_backorders === "no"
      ? product.stock_quantity
      : Infinity;
  const orderMax = product.max_per_order ?? Infinity;
  const maxQty = Math.min(stockMax, orderMax);

  const isLowStock =
    product.manage_stock &&
    product.stock_quantity !== null &&
    product.low_stock_threshold !== null &&
    product.stock_quantity <= product.low_stock_threshold &&
    product.stock_quantity > 0;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image with hover overlay (desktop) */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,#f4f4f5,#d4d4d8)]">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(204,25,57,0.16),transparent_30%)]" />
            <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white backdrop-blur-sm">
              MASI-CO
            </div>
          </>
        )}

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 rounded-md bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Stock tag */}
        <span className={`absolute top-3 right-3 z-10 rounded-md px-2 py-0.5 text-[10px] font-semibold ${stock.className}`}>
          {stock.text}
        </span>

        {/* Hover overlay — desktop only */}
        {isAvailable && (
          <div className="absolute inset-0 hidden items-center justify-center gap-3 bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 md:flex md:flex-col">
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product, qty);
              }}
              className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg transition-transform hover:scale-105"
            >
              <ShoppingCart size={16} />
              Do košíku
            </button>
            <Link
              href={`/produkt/${product.slug}`}
              className="flex items-center gap-1.5 text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              <Eye size={14} />
              Detail
            </Link>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/produkt/${product.slug}`}>
          <h3 className="font-display text-sm font-bold leading-snug line-clamp-2 min-h-[2.5rem] transition-colors hover:text-primary sm:text-base">
            {product.name}
          </h3>
        </Link>

        {product.weight_info && (
          <p className="mt-1 text-xs text-gray-400">{product.weight_info}</p>
        )}

        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
          <span className="text-xs text-gray-400">/{product.unit}</span>
        </div>

        {isLowStock && (
          <p className="mt-1 text-[10px] text-amber-600">
            Posledn{product.stock_quantity === 1 ? "í kus" : `ích ${Math.floor(product.stock_quantity!)} ${product.unit}`}
          </p>
        )}
        {product.stock_status === "on_order" && product.allow_backorders === "notify" && (
          <p className="mt-1 text-[10px] text-orange-500">Delší dodací lhůta</p>
        )}

        {/* Mobile-only: always-visible add to cart */}
        <div className="mt-auto pt-3 md:hidden">
          {isAvailable ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-gray-200">
                <button
                  onClick={() => setQty(Math.max(min, qty - step))}
                  className="flex h-9 w-8 items-center justify-center text-gray-500 transition-colors hover:text-black"
                  aria-label="Snížit množství"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(maxQty, qty + step))}
                  disabled={qty >= maxQty}
                  className="flex h-9 w-8 items-center justify-center text-gray-500 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Zvýšit množství"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, qty)}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary"
              >
                <ShoppingCart size={14} />
                Do košíku
              </button>
            </div>
          ) : (
            <button
              disabled
              className="flex h-9 w-full items-center justify-center rounded-lg bg-gray-100 px-3 text-xs font-medium uppercase tracking-wider text-gray-400 cursor-not-allowed"
            >
              Vyprodáno
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
