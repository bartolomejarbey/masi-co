import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/types";

interface CategoriesSectionProps {
  categories: Category[];
}

function CategoryCard({ cat, isHighlighted }: { cat: Category; isHighlighted: boolean }) {
  return (
    <Link
      href={`/produkty/${cat.slug}`}
      className={`group relative overflow-hidden rounded-2xl bg-gray-200 flex flex-col items-center justify-end text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        isHighlighted
          ? "sm:col-span-2 sm:row-span-2 min-h-[280px] sm:min-h-[400px]"
          : "min-h-[200px] sm:min-h-[220px]"
      }`}
    >
      {cat.image_url ? (
        <Image
          src={cat.image_url}
          alt={cat.name}
          fill
          sizes={isHighlighted ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, 25vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f3f4f6,#d1d5db)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(204,25,57,0.18),transparent_30%)]" />
          <div className="absolute bottom-6 left-6 right-6 h-px bg-white/50" />
          <div className="absolute left-6 top-6 rounded-full border border-white/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white/90">
            MASI-CO
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all" />
      <div className="relative z-10 p-5 sm:p-6 w-full">
        <h3
          className={`font-display font-bold text-white mb-1 ${
            isHighlighted ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
          }`}
        >
          {cat.name}
        </h3>
        {cat.description && (
          <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 mb-2">
            {cat.description}
          </p>
        )}
        <span className="inline-flex items-center text-xs font-medium text-white uppercase tracking-wider group-hover:text-primary transition-colors">
          Prohlédnout kategorii
          <svg
            className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  // Split categories: the main grid gets the ones that fit neatly into the 4-col layout
  // (maso takes 2x2 = 4 slots, so first 4 non-maso + maso = fills 2 rows of 4)
  // Remaining categories go into a centered bottom row
  const highlighted = categories.find((c) => c.slug === "maso");
  const others = categories.filter((c) => c.slug !== "maso");

  // maso (2x2) + 4 others = fills 2 full rows in the 4-col grid
  const gridCategories = others.slice(0, 4);
  const bottomCategories = others.slice(4);

  // Build the main grid items in order: first 2 small, then maso, then next 2 small
  const mainItems: Category[] = [];
  if (gridCategories[0]) mainItems.push(gridCategories[0]);
  if (highlighted) mainItems.push(highlighted);
  if (gridCategories[1]) mainItems.push(gridCategories[1]);
  if (gridCategories[2]) mainItems.push(gridCategories[2]);
  if (gridCategories[3]) mainItems.push(gridCategories[3]);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-primary mb-3">
            Produkty
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            Naše produkty
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
            Vybírejte z široké nabídky čerstvého masa, hotových jídel a dalších specialit.
          </p>
        </div>

        {/* Main grid — 2 rows of 4 cols (maso spans 2x2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {mainItems.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} isHighlighted={cat.slug === "maso"} />
          ))}
        </div>

        {/* Bottom row — centered */}
        {bottomCategories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 mt-4 sm:mt-5">
            {bottomCategories.map((cat) => (
              <div key={cat.id} className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
                <CategoryCard cat={cat} isHighlighted={false} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
