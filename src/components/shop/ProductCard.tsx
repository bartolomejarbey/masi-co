"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

const stockLabels: Record<string, { text: string; className: string }> = {
  in_stock: { text: "Skladem", className: "text-green-600" },
  out_of_stock: { text: "Vyprodáno", className: "text-gray-400" },
  on_order: { text: "Na objednávku", className: "text-orange-500" },
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(product.unit === "kg" ? 1 : 1);
  const stock = stockLabels[product.stock_status] || stockLabels.in_stock;
  const isAvailable = product.stock_status !== "out_of_stock";
  const step = product.unit === "kg" ? 0.5 : 1;
  const min = product.unit === "kg" ? 0.5 : 1;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-[linear-gradient(135deg,#f4f4f5,#d4d4d8)]">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(204,25,57,0.16),transparent_30%)]" />
            <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white backdrop-blur-sm">
              MASI-CO
            </div>
          </>
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-sm sm:text-base font-bold leading-snug mb-1 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {product.weight_info && (
          <p className="text-xs text-gray-400 mb-2">{product.weight_info}</p>
        )}

        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-gray-400">
            /{product.unit}
          </span>
        </div>

        <p className={`text-xs font-medium mb-3 ${stock.className}`}>
          {stock.text}
        </p>

        <div className="mt-auto">
          {isAvailable ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-200 rounded-sm">
                <button
                  onClick={() => setQty(Math.max(min, qty - step))}
                  className="w-8 h-9 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                  aria-label="Snížit množství"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium tabular-nums">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + step)}
                  className="w-8 h-9 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                  aria-label="Zvýšit množství"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, qty)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-md bg-black hover:bg-primary text-white text-xs font-medium uppercase tracking-wider h-9 px-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <ShoppingCart size={14} />
                Do košíku
              </button>
            </div>
          ) : (
            <button
              disabled
              className="w-full flex items-center justify-center rounded-md bg-gray-100 text-gray-400 text-xs font-medium uppercase tracking-wider h-9 px-3 cursor-not-allowed"
            >
              Vyprodáno
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
