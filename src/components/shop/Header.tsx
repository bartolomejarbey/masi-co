"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, Menu, Phone, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { SearchBar } from "./SearchBar";
import { MegaMenu } from "./MegaMenu";
import type { CategoryWithChildren } from "@/lib/types";

const navLinks = [
  { href: "/jak-nakupovat", label: "Jak nakupovat" },
  { href: "/obchodni-podminky", label: "Obchodní podmínky" },
  { href: "/kontakt", label: "Kontakt" },
];

interface HeaderProps {
  authEmail?: string | null;
  categories?: CategoryWithChildren[];
}

export function Header({ authEmail, categories = [] }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sortimentOpen, setSortimentOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const isAuthenticated = Boolean(authEmail);

  const toggleMobileCategory = (catId: string) => {
    setExpandedCategory((prev) => (prev === catId ? null : catId));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-[100px]">
        <div className="flex h-16 items-center gap-8 lg:h-[100px]">
          <Link href="/" className="relative block h-24 w-[300px] shrink-0 sm:h-28 sm:w-[350px]">
            <Image
              src="/assets/brand/masico-logo.png"
              alt="MASI-CO"
              fill
              sizes="350px"
              className="object-contain object-left"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setSortimentOpen(true)}
              onMouseLeave={() => setSortimentOpen(false)}
            >
              <button className="flex items-center gap-1 py-2 text-sm font-medium text-black transition-colors hover:text-primary">
                Sortiment
                <ChevronDown size={14} className={`transition-transform ${sortimentOpen ? "rotate-180" : ""}`} />
              </button>

              <MegaMenu
                categories={categories}
                isOpen={sortimentOpen}
                onClose={() => setSortimentOpen(false)}
              />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-black transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden max-w-[360px] flex-1 xl:block">
          <SearchBar variant="header" className="w-full" />
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="tel:+420222533001"
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-red-50 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            <Phone size={16} />
            <span>+420 222 533 001</span>
          </a>

          <Link
            href="/ucet"
            className="hidden items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary sm:flex"
          >
            <User size={18} strokeWidth={2} />
            <span className="hidden md:inline">{isAuthenticated ? "Můj účet" : "Přihlásit se"}</span>
          </Link>

          <Link
            href="/kosik"
            className="relative flex items-center gap-1.5 transition-colors hover:text-primary"
            aria-label="Košík"
          >
            <ShoppingCart size={20} strokeWidth={2} />
            {itemCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <a
            href="tel:+420222533001"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark"
            aria-label="Zavolat na MASI-CO"
          >
            <Phone size={18} />
          </a>

          <Link
            href="/kosik"
            className="relative flex items-center gap-1.5 transition-colors hover:text-primary"
            aria-label="Košík"
          >
            <ShoppingCart size={20} strokeWidth={2} />
            {itemCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>

          <button
            className="ml-1 transition-colors hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <nav className="border-t border-gray-200 bg-white lg:hidden">
          <div className="space-y-5 px-4 py-5">
            <SearchBar variant="inline" className="w-full" />

            <a
              href="tel:+420222533001"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <Phone size={16} />
              Zavolat: +420 222 533 001
            </a>

            <div className="rounded-2xl border border-gray-200 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Sortiment</p>
              <div className="mt-3 space-y-1">
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <div className="flex items-center">
                      <Link
                        href={`/produkty/${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary"
                      >
                        {cat.name}
                      </Link>
                      {cat.children.length > 0 && (
                        <button
                          onClick={() => toggleMobileCategory(cat.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary"
                          aria-label={`Rozbalit ${cat.name}`}
                        >
                          <ChevronRight
                            size={16}
                            className={`transition-transform ${expandedCategory === cat.id ? "rotate-90" : ""}`}
                          />
                        </button>
                      )}
                    </div>
                    {expandedCategory === cat.id && cat.children.length > 0 && (
                      <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-3">
                        {cat.children.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/produkty/${sub.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-black transition-colors hover:border-primary hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link
              href="/ucet"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-black transition-colors hover:border-primary hover:text-primary"
            >
              <User size={16} />
              {isAuthenticated ? "Můj účet" : "Přihlásit se"}
            </Link>

            {isAuthenticated ? (
              <Link
                href="/odhlaseni"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-black transition-colors hover:border-primary hover:text-primary"
              >
                Odhlásit se
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
