import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseHref: string;
  searchParams?: Record<string, string>;
}

export function Pagination({ currentPage, totalPages, baseHref, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    return qs ? `${baseHref}?${qs}` : baseHref;
  }

  const pages: (number | "ellipsis")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return (
    <nav aria-label="Stránkování" className="mt-12 flex items-center justify-center gap-1.5">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="inline-flex h-10 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Předchozí</span>
        </Link>
      ) : (
        <span className="inline-flex h-10 items-center gap-1 rounded-lg border border-gray-100 px-3 text-sm font-medium text-gray-300 cursor-not-allowed">
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Předchozí</span>
        </span>
      )}

      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span key={`e${i}`} className="inline-flex h-10 w-10 items-center justify-center text-sm text-gray-400">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-primary text-white"
                : "border border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
            }`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="inline-flex h-10 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
        >
          <span className="hidden sm:inline">Další</span>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="inline-flex h-10 items-center gap-1 rounded-lg border border-gray-100 px-3 text-sm font-medium text-gray-300 cursor-not-allowed">
          <span className="hidden sm:inline">Další</span>
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}
