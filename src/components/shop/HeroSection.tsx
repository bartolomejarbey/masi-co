"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { SearchBar } from "./SearchBar";

const heroImages = [
  "/assets/hero/hero-1.jpg",
  "/assets/hero/hero-2.jpg",
  "/assets/hero/hero-3.jpg",
];

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroImages.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);

  const goTo = (index: number) => setActiveIndex(index);
  const goPrev = () => setActiveIndex((i) => (i - 1 + heroImages.length) % heroImages.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % heroImages.length);

  return (
    <section className="relative min-h-[84vh] overflow-hidden bg-black lg:min-h-[780px]">
      {/* Background images with fade */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeIndex === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78),rgba(0,0,0,0.46)_48%,rgba(0,0,0,0.64)),linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.38))]" />

      {/* Arrows — desktop only */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 lg:flex"
        aria-label="Předchozí"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 lg:flex"
        aria-label="Následující"
      >
        <ChevronRight size={20} />
      </button>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[84vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:min-h-[780px] lg:py-20">
        <div className="max-w-3xl text-white">
          <div className="mb-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-300 sm:text-sm">
              MASI-CO maso s respektem
            </span>
          </div>

          <h1 className="text-balance font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Poctivé maso z rodinné firmy s tradicí
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-200 sm:text-lg">
            Čerstvé hovězí, vepřové, uzeniny i hotová jídla. Pečlivě připravený sortiment s
            vlastním rozvozem po Praze a okolí.
          </p>

          <div className="mt-8 max-w-2xl">
            <SearchBar
              variant="hero"
              placeholder="Vyhledejte produkt, kategorii nebo oblíbenou hotovku"
              className="w-full"
            />
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/sortiment"
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary-dark sm:w-auto"
            >
              Prohlédnout sortiment
            </Link>
            <Link
              href="/jak-nakupovat"
              className="inline-flex w-full items-center justify-center rounded-md border border-white/35 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:border-white hover:bg-white/5 sm:w-auto"
            >
              Jak nakupovat
            </Link>
          </div>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
            {[
              { value: "20 let", label: "tradice" },
              { value: "Rozvoz", label: "po Praze a okolí" },
              { value: "Min. obj.", label: "1 000 Kč" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-lg font-bold text-white sm:text-xl">{stat.value}</p>
                <p className="mt-0.5 text-xs uppercase tracking-wider text-gray-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`h-2 rounded-full transition-all ${
              activeIndex === index
                ? "w-6 bg-primary"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 animate-bounce">
        <ChevronDown size={20} className="text-white/50" />
      </div>
    </section>
  );
}
