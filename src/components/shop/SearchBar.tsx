"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SearchBarProps = {
  initialQuery?: string;
  placeholder?: string;
  variant?: "header" | "inline" | "hero";
  className?: string;
};

export function SearchBar({
  initialQuery = "",
  placeholder = "Hledat produkty, druh masa nebo hotová jídla",
  variant = "inline",
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      router.push("/sortiment");
      return;
    }

    router.push(`/sortiment?q=${encodeURIComponent(trimmedQuery)}`);
  }

  const variants = {
    header:
      "h-11 rounded-full border border-gray-200 bg-white/95 px-3 shadow-sm transition-all focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(204,25,57,0.12)] hover:border-gray-300",
    inline:
      "h-12 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm transition-all focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(204,25,57,0.12)] hover:border-gray-300",
    hero:
      "h-14 rounded-2xl border border-white/20 bg-white/10 px-4 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.25)] transition-all focus-within:border-white/50 focus-within:bg-white/14",
  } as const;

  const inputVariants = {
    header: "text-sm text-black placeholder:text-gray-400",
    inline: "text-sm text-black placeholder:text-gray-400",
    hero: "text-sm text-white placeholder:text-gray-300 sm:text-base",
  } as const;

  const iconVariants = {
    header: "text-primary",
    inline: "text-primary",
    hero: "text-white",
  } as const;

  const buttonVariants = {
    header: "h-8 rounded-full px-3 text-xs font-semibold",
    inline: "h-9 rounded-xl px-4 text-sm font-semibold",
    hero: "h-10 rounded-xl px-4 text-sm font-semibold",
  } as const;

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-3 ${variants[variant]} ${className}`}>
      <Search size={18} className={`shrink-0 ${iconVariants[variant]}`} />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className={`min-w-0 flex-1 bg-transparent outline-none ${inputVariants[variant]}`}
        aria-label="Vyhledat produkty"
      />
      <button
        type="submit"
        className={`inline-flex shrink-0 items-center justify-center bg-primary text-white transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${buttonVariants[variant]}`}
      >
        Hledat
      </button>
    </form>
  );
}
