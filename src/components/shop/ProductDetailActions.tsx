"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
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

  const stockMax = product.manage_stock && product.stock_quantity !== null && product.allow_backorders === "no"
    ? product.stock_quantity : Infinity;
  const orderMax = product.max_per_order ?? Infinity;
  const maxQty = Math.min(stockMax, orderMax);

  const isLowStock = product.manage_stock && product.stock_quantity !== null
    && product.low_stock_threshold !== null
    && product.stock_quantity <= product.low_stock_threshold
    && product.stock_quantity > 0;

  return (
    <div className="space-y-4">
      {isLowStock && (
        <p className="text-sm font-medium text-amber-600">
          Posledn{product.stock_quantity === 1 ? "í kus" : `ích ${Math.floor(product.stock_quantity!)} ${product.unit}`} skladem
        </p>
      )}
      {product.stock_status === "on_order" && product.allow_backorders === "notify" && (
        <p className="text-sm text-orange-500">Tento produkt je momentálně na objednávku — dodací lhůta může být delší.</p>
      )}
      {maxQty < Infinity && (
        <p className="text-xs text-gray-500">Max {maxQty} {product.unit} na objednávku</p>
      )}
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
            onClick={() => setQuantity((current) => Math.min(maxQty, current + step))}
            disabled={quantity >= maxQty}
            className="flex h-11 w-11 items-center justify-center text-gray-500 transition-colors hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Zvýšit množství"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled={!isAvailable}
        onClick={() => {
          addToCart(product, quantity);
          toast.success(`${product.name} přidáno do košíku`, {
            description: `${quantity} ${product.unit}`,
          });
        }}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-black px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
      >
        <ShoppingCart size={16} />
        Do košíku
      </button>
    </div>
  );
}
