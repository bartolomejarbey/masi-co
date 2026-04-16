"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
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

  return (
    <div className="absolute left-0 top-full z-50 rounded-2xl border border-gray-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
      <div className="flex">
        {/* Left column — root categories */}
        <div className="w-[260px] border-r border-gray-100 py-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onMouseEnter={() => setHoveredId(cat.id)}
              className="relative"
            >
              <Link
                href={`/produkty/${cat.slug}`}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  hoveredId === cat.id
                    ? "bg-gray-50 text-primary font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                }`}
              >
                {cat.image_url ? (
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                    <Image src={cat.image_url} alt="" fill sizes="32px" className="object-cover" />
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

          <div className="mt-2 border-t border-gray-100 px-4 pt-2">
            <Link
              href="/produkty"
              onClick={onClose}
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-red-50"
            >
              Všechny produkty
            </Link>
          </div>
        </div>

        {/* Right column — subcategories */}
        {hasChildren && (
          <div className="w-[260px] py-3">
            <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
              {hoveredCategory.name}
            </p>
            {hoveredCategory.children.map((sub) => (
              <Link
                key={sub.id}
                href={`/produkty/${sub.slug}`}
                onClick={onClose}
                className="block px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
