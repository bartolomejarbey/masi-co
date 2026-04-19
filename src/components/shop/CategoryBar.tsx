"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Beef,
  Flame,
  UtensilsCrossed,
  Drumstick,
  Fish,
  Salad,
  ShoppingBasket,
  Sparkles,
} from "lucide-react";
import type { CategoryWithChildren } from "@/lib/types";

const categoryIcons: Record<string, React.ReactNode> = {
  hotovky: <UtensilsCrossed size={22} />,
  maso: <Beef size={22} />,
  "uzene-maso": <Flame size={22} />,
  "ostatni-maso": <Drumstick size={22} />,
  zverina: <Sparkles size={22} />,
  ryby: <Fish size={22} />,
  uzeniny: <Salad size={22} />,
  "ostatni-sortiment": <ShoppingBasket size={22} />,
};

interface CategoryBarProps {
  categories: CategoryWithChildren[];
}

export function CategoryBar({ categories }: CategoryBarProps) {
  const pathname = usePathname();

  // Hide on homepage
  if (pathname === "/") return null;

  return (
    <div className="border-t border-gray-100 bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="scrollbar-hide flex gap-1 overflow-x-auto py-2">
          {categories.map((cat) => {
            const isActive =
              pathname === `/sortiment/${cat.slug}` ||
              pathname.startsWith(`/sortiment/${cat.slug}/`);
            const icon = categoryIcons[cat.slug] || <ShoppingBasket size={22} />;

            return (
              <Link
                key={cat.id}
                href={`/sortiment/${cat.slug}`}
                className={`group flex shrink-0 flex-col items-center gap-1.5 rounded-xl px-4 py-2.5 text-center transition-all hover:bg-white hover:shadow-sm ${
                  isActive
                    ? "bg-white shadow-sm"
                    : ""
                }`}
              >
                <span
                  className={`transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-gray-500 group-hover:text-primary"
                  }`}
                >
                  {icon}
                </span>
                <span
                  className={`whitespace-nowrap text-xs font-medium transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-gray-600 group-hover:text-gray-900"
                  }`}
                >
                  {cat.name}
                </span>
                {isActive && (
                  <span className="h-0.5 w-6 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
