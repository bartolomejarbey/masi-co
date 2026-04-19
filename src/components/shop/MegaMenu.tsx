"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, Truck, Beef, Flame, UtensilsCrossed, Drumstick, Fish, Salad, ShoppingBasket, Sparkles } from "lucide-react";
import type { CategoryWithChildren } from "@/lib/types";
import type { LucideIcon } from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  hotovky: UtensilsCrossed,
  maso: Beef,
  "uzene-maso": Flame,
  "ostatni-maso": Drumstick,
  zverina: Sparkles,
  ryby: Fish,
  uzeniny: Salad,
  "ostatni-sortiment": ShoppingBasket,
};

interface MegaMenuProps {
  categories: CategoryWithChildren[];
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ categories, isOpen, onClose }: MegaMenuProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const intentTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hover intent: wait 150ms before switching category.
  // If user is just passing through (on the way to column 3), it won't trigger.
  const handleMouseEnter = useCallback((catId: string) => {
    if (intentTimeout.current) clearTimeout(intentTimeout.current);
    intentTimeout.current = setTimeout(() => {
      setHoveredId(catId);
    }, 150);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (intentTimeout.current) clearTimeout(intentTimeout.current);
  }, []);

  // Keep subcategories stable when hovering column 3
  const handleSubcategoryEnter = useCallback(() => {
    if (intentTimeout.current) clearTimeout(intentTimeout.current);
  }, []);

  if (!isOpen) return null;

  const hoveredCategory = categories.find((c) => c.id === hoveredId);
  const hasChildren = hoveredCategory && hoveredCategory.children.length > 0;

  // Split categories into two columns
  const midpoint = Math.ceil(categories.length / 2);
  const leftCategories = categories.slice(0, midpoint);
  const rightCategories = categories.slice(midpoint);

  function renderCategoryItem(cat: CategoryWithChildren) {
    const Icon = categoryIcons[cat.slug] || ShoppingBasket;
    const isActive = hoveredId === cat.id;

    return (
      <div
        key={cat.id}
        onMouseEnter={() => handleMouseEnter(cat.id)}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href={`/sortiment/${cat.slug}`}
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
            isActive
              ? "bg-red-50/70 font-medium text-primary"
              : "text-gray-700 hover:bg-gray-50 hover:text-primary"
          }`}
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
              isActive ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
            }`}
          >
            <Icon size={18} />
          </div>
          <span className="flex-1">{cat.name}</span>
          {cat.children.length > 0 && (
            <ChevronRight size={14} className="shrink-0 text-gray-400" />
          )}
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute left-1/2 top-full z-50 w-[720px] -translate-x-1/2 rounded-b-2xl border border-t-[3px] border-gray-200 border-t-primary bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
      <div className="flex">
        {/* Column 1 — first half of categories */}
        <div className="w-[240px] border-r border-gray-100 py-3">
          <p className="mb-1 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Kategorie
          </p>
          {leftCategories.map(renderCategoryItem)}
        </div>

        {/* Column 2 — second half of categories */}
        <div className="w-[240px] border-r border-gray-100 py-3">
          <p className="mb-1 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            &nbsp;
          </p>
          {rightCategories.map(renderCategoryItem)}
        </div>

        {/* Column 3 — dynamic subcategories */}
        <div
          className="w-[240px] py-3"
          onMouseEnter={handleSubcategoryEnter}
          onMouseLeave={handleMouseLeave}
        >
          {hasChildren ? (
            <>
              <p className="mb-1 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                {hoveredCategory.name}
              </p>
              {hoveredCategory.children.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/sortiment/${sub.slug}`}
                  onClick={onClose}
                  className="block px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary"
                >
                  {sub.name}
                </Link>
              ))}
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Podkategorie
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Najeďte na kategorii pro zobrazení podkategorií
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA banner */}
      <div className="flex items-center justify-center gap-2 rounded-b-2xl border-t border-gray-100 bg-gray-50 px-4 py-3">
        <Truck size={18} className="text-primary" />
        <span className="text-sm font-medium text-gray-700">
          Doprava zdarma od 1 000 Kč
        </span>
        <Link
          href="/jak-nakupovat"
          onClick={onClose}
          className="ml-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          Více info &rarr;
        </Link>
      </div>
    </div>
  );
}
