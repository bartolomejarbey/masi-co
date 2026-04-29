"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  Phone,
  Mail,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { MegaMenu } from "./MegaMenu";
import type { CategoryWithChildren } from "@/lib/types";

const navLinks = [
  { href: "/sortiment", label: "Sortiment" },
  { href: "/jak-nakupovat", label: "Jak nakupovat" },
  { href: "/o-nas", label: "O nás" },
  { href: "/kontakt", label: "Kontakt" },
];

interface HeaderProps {
  authEmail?: string | null;
  categories?: CategoryWithChildren[];
}

export function Header({ authEmail, categories = [] }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sortimentOpen, setSortimentOpen] = useState(false);
  const [sortimentLocked, setSortimentLocked] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const isAuthenticated = Boolean(authEmail);
  const sortimentRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Scroll detection for shadow
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 100);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cmd+K / Ctrl+K keyboard shortcut for search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus search input when overlay opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close mega menu on click outside
  useEffect(() => {
    if (!sortimentLocked) return;
    function handleClickOutside(e: MouseEvent) {
      if (sortimentRef.current && !sortimentRef.current.contains(e.target as Node)) {
        setSortimentLocked(false);
        setSortimentOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortimentLocked]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleMobileCategory = useCallback((catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/sortiment?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/sortiment");
    }
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        {/* Main Navbar */}
        <div className="border-b border-gray-100">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/assets/brand/masico-logo.png"
                alt="MASI-CO"
                width={320}
                height={120}
                className="h-20 w-auto lg:h-24"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 lg:flex">
              {/* Sortiment with mega menu */}
              <div
                ref={sortimentRef}
                className="relative"
                onMouseEnter={() => {
                  if (!sortimentLocked) setSortimentOpen(true);
                }}
                onMouseLeave={() => {
                  if (!sortimentLocked) setSortimentOpen(false);
                }}
              >
                <button
                  onClick={() => {
                    if (sortimentLocked) {
                      setSortimentLocked(false);
                      setSortimentOpen(false);
                    } else {
                      setSortimentLocked(true);
                      setSortimentOpen(true);
                    }
                  }}
                  className={`flex items-center gap-1 py-2 text-[15px] font-medium uppercase tracking-[0.08em] transition-colors hover:text-primary ${
                    sortimentOpen ? "text-primary" : "text-black"
                  }`}
                >
                  Sortiment
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${sortimentOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <MegaMenu
                  categories={categories}
                  isOpen={sortimentOpen}
                  onClose={() => {
                    setSortimentOpen(false);
                    setSortimentLocked(false);
                  }}
                />
              </div>

              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[15px] font-medium uppercase tracking-[0.08em] transition-colors hover:text-primary ${
                    pathname === link.href ? "text-primary" : "text-black"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center gap-3">
              {/* Search button — desktop */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden items-center gap-1.5 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary lg:flex"
                aria-label="Vyhledávání (Ctrl+K)"
                title="Ctrl+K"
              >
                <Search size={20} />
              </button>

              {/* Account — desktop */}
              <Link
                href={isAuthenticated ? "/ucet" : "/prihlaseni"}
                className="hidden items-center gap-1.5 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary lg:flex"
                aria-label={isAuthenticated ? "Můj účet" : "Přihlásit se"}
              >
                <User size={20} />
              </Link>

              {/* Cart */}
              <Link
                href="/kosik"
                className="relative flex items-center gap-1.5 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary"
                aria-label="Košík"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Phone — mobile */}
              <a
                href="tel:+420222533001"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark lg:hidden"
                aria-label="Zavolat"
              >
                <Phone size={16} />
              </a>

              {/* Hamburger — mobile */}
              <button
                className="flex items-center justify-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative mx-auto mt-[64px] max-w-2xl px-4 lg:mt-[80px]">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-2xl"
            >
              <Search size={20} className="shrink-0 text-gray-400" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hledat produkty..."
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-gray-400"
              />
              <kbd className="hidden rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-400 sm:inline-block">
                ESC
              </kbd>
              <button
                type="submit"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Hledat
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu — full-screen overlay */}
      <div
        className={`fixed inset-0 z-[55] transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute inset-0 bg-white overflow-y-auto">
          {/* Mobile menu header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="shrink-0">
              <Image
                src="/assets/brand/masico-logo.png"
                alt="MASI-CO"
                width={120}
                height={45}
                className="h-8 w-auto"
              />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
              aria-label="Zavřít menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile search */}
          <div className="px-4 pt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = searchQuery.trim();
                router.push(q ? `/sortiment?q=${encodeURIComponent(q)}` : "/sortiment");
                setMobileMenuOpen(false);
                setSearchQuery("");
              }}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5"
            >
              <Search size={18} className="shrink-0 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hledat produkty..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </form>
          </div>

          {/* Mobile navigation */}
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Úvod
            </Link>

            {/* Sortiment accordion */}
            <div>
              <button
                onClick={() => toggleMobileCategory("sortiment-root")}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span>Sortiment</span>
                <ChevronRight
                  size={16}
                  className={`text-gray-400 transition-transform ${
                    expandedCategories.has("sortiment-root") ? "rotate-90" : ""
                  }`}
                />
              </button>

              {expandedCategories.has("sortiment-root") && (
                <div className="ml-2 space-y-0.5 border-l-2 border-gray-100 pl-3">
                  {categories.map((cat) => {
                    const hasChildren = cat.children.length > 0;
                    const isExpanded = expandedCategories.has(cat.id);

                    if (!hasChildren) {
                      return (
                        <Link
                          key={cat.id}
                          href={`/sortiment/${cat.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block min-h-[44px] rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary"
                        >
                          {cat.name}
                        </Link>
                      );
                    }

                    return (
                      <div key={cat.id}>
                        <button
                          type="button"
                          onClick={() => toggleMobileCategory(cat.id)}
                          aria-expanded={isExpanded}
                          className="flex min-h-[44px] w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary"
                        >
                          <span>{cat.name}</span>
                          <ChevronRight
                            size={16}
                            className={`shrink-0 text-gray-400 transition-transform ${
                              isExpanded ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="ml-3 space-y-0.5 border-l border-gray-100 pl-3">
                            <Link
                              href={`/sortiment/${cat.slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block min-h-[40px] rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-gray-50"
                            >
                              Všechny produkty
                            </Link>
                            {cat.children.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/sortiment/${sub.slug}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block min-h-[40px] rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:text-primary"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href={isAuthenticated ? "/ucet" : "/prihlaseni"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <User size={16} />
              {isAuthenticated ? "Můj účet" : "Přihlásit se"}
            </Link>

            {isAuthenticated && (
              <Link
                href="/odhlaseni"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Odhlásit se
              </Link>
            )}
          </div>

          {/* Mobile menu footer */}
          <div className="border-t border-gray-100 px-4 py-4 space-y-3">
            <a
              href="tel:+420222533001"
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <Phone size={14} />
              +420 222 533 001
            </a>
            <a
              href="mailto:objednavky@masi-co.com"
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <Mail size={14} />
              objednavky@masi-co.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
