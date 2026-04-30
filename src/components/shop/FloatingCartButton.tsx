"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, X } from "lucide-react";
import { useCart } from "./CartProvider";

const HIDDEN_PATHS = ["/kosik", "/pokladna"];

function formatCZK(value: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

export function FloatingCartButton() {
  const pathname = usePathname();
  const { items, getTotal, getItemCount, removeFromCart, updateQuantity } = useCart();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemCount = getItemCount();
  const total = getTotal();

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (HIDDEN_PATHS.some((p) => pathname?.startsWith(p))) return null;
  if (itemCount === 0) return null;

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setOpen(false), 250);
  };

  return (
    <div
      ref={wrapperRef}
      className="fixed bottom-6 left-6 z-[9998]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {open && (
        <div className="absolute bottom-16 left-0 w-[340px] max-w-[calc(100vw-3rem)] rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 bg-gray-50">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-gray-900">
              Košík ({itemCount})
            </h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Zavřít"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {item.product.image_url ? (
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/produkt/${item.product.slug}`}
                    className="block text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors text-sm"
                        aria-label="Snížit"
                      >
                        −
                      </button>
                      <span className="text-xs font-medium text-gray-700 w-8 text-center">
                        {item.quantity} {item.product.unit}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors text-sm"
                        aria-label="Zvýšit"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCZK(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.product.id)}
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-gray-300 hover:text-primary transition-colors"
                  aria-label="Odebrat"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-gray-500">Mezisoučet</span>
              <span className="text-base font-bold text-gray-900">{formatCZK(total)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/kosik"
                className="flex items-center justify-center px-3 py-2 text-xs font-medium uppercase tracking-wider rounded-md border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                Košík
              </Link>
              <Link
                href="/pokladna"
                className="flex items-center justify-center px-3 py-2 text-xs font-medium uppercase tracking-wider rounded-md bg-primary text-white hover:bg-[#A81230] transition-colors"
              >
                K pokladně
              </Link>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#CC1939] text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label={`Otevřít košík (${itemCount} ${itemCount === 1 ? "položka" : "položky"})`}
        aria-expanded={open}
      >
        <ShoppingCart size={22} />
        <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-[#CC1939] shadow ring-2 ring-[#CC1939]">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      </button>
    </div>
  );
}
