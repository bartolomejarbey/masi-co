"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Truck } from "lucide-react";
import type { CategoryWithChildren } from "@/lib/types";

interface MegaMenuProps {
  categories: CategoryWithChildren[];
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ categories, isOpen, onClose }: MegaMenuProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!isOpen) return null;

  const hoveredCategory = categories.find((c) => c.id === hoveredId);
  const hasChildren = hoveredCategory && hoveredCategory.children.length > 0;

  // Split categories into two columns
  const midpoint = Math.ceil(categories.length / 2);
  const leftCategories = categories.slice(0, midpoint);
  const rightCategories = categories.slice(midpoint);

  return (
    <div className="absolute left-1/2 top-full z-50 w-[720px] -translate-x-1/2 rounded-b-2xl border border-t-[3px] border-gray-200 border-t-primary bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
      <div className="flex">
        {/* Column 1 — first half of categories */}
        <div className="w-[240px] border-r border-gray-100 py-3">
          <p className="mb-1 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Kategorie
          </p>
          {leftCategories.map((cat) => (
            <div
              key={cat.id}
              onMouseEnter={() => setHoveredId(cat.id)}
            >
              <Link
                href={`/sortiment/${cat.slug}`}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  hoveredId === cat.id
                    ? "bg-red-50/70 font-medium text-primary"
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                }`}
              >
                {cat.image_url ? (
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                    <Image src={cat.image_url} alt={cat.name} fill sizes="32px" className="object-cover" />
                  </div>
                ) : (
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-gray-100" />
                )}
                <span className="flex-1">{cat.name}</span>
                {cat.children.length > 0 && (
                  <ChevronRight size={14} className="shrink-0 text-gray-400" />
                )}
              </Link>
            </div>
          ))}
        </div>

        {/* Column 2 — second half of categories */}
        <div className="w-[240px] border-r border-gray-100 py-3">
          <p className="mb-1 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            &nbsp;
          </p>
          {rightCategories.map((cat) => (
            <div
              key={cat.id}
              onMouseEnter={() => setHoveredId(cat.id)}
            >
              <Link
                href={`/sortiment/${cat.slug}`}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  hoveredId === cat.id
                    ? "bg-red-50/70 font-medium text-primary"
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                }`}
              >
                {cat.image_url ? (
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                    <Image src={cat.image_url} alt={cat.name} fill sizes="32px" className="object-cover" />
                  </div>
                ) : (
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-gray-100" />
                )}
                <span className="flex-1">{cat.name}</span>
                {cat.children.length > 0 && (
                  <ChevronRight size={14} className="shrink-0 text-gray-400" />
                )}
              </Link>
            </div>
          ))}
        </div>

        {/* Column 3 — dynamic subcategories */}
        <div className="w-[240px] py-3">
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
                Doporučujeme
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
