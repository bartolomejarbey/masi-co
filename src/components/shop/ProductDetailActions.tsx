"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/types";

interface ProductDetailActionsProps {
  product: Product;
  isAvailable: boolean;
}

export function ProductDetailActions({ product, isAvailable }: ProductDetailActionsProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(product.unit === "kg" ? 0.5 : 1);

  const step = product.unit === "kg" ? 0.5 : 1;
  const min = product.unit === "kg" ? 0.5 : 1;

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Množství</p>
        <div className="flex w-fit items-center rounded-md border border-gray-200">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(min, current - step))}
            className="flex h-11 w-11 items-center justify-center text-gray-500 transition-colors hover:text-black"
            aria-label="Snížit množství"
          >
            <Minus size={16} />
          </button>
          <span className="min-w-16 px-3 text-center text-sm font-medium tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((current) => current + step)}
            className="flex h-11 w-11 items-center justify-center text-gray-500 transition-colors hover:text-black"
            aria-label="Zvýšit množství"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled={!isAvailable}
        onClick={() => addToCart(product, quantity)}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-black px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
      >
        <ShoppingCart size={16} />
        Do košíku
      </button>
    </div>
  );
}
