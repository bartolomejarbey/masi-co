"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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

  return (
    <section className="relative min-h-[84vh] overflow-hidden bg-black lg:min-h-[780px]">
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-700 ${activeIndex === index ? "opacity-100" : "opacity-0"}`}
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

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78),rgba(0,0,0,0.46)_48%,rgba(0,0,0,0.64)),linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.38))]" />

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
            Čerstvé hovězí, vepřové, uzeniny i hotová jídla. Pečlivě připravený sortiment s vlastním rozvozem po Praze
            a okolí.
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
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
            >
              Prohlédnout produkty
            </Link>
            <Link
              href="/jak-nakupovat"
              className="inline-flex w-full items-center justify-center rounded-md border border-white/35 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:border-white hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
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
                <p className="mt-0.5 text-xs uppercase tracking-wider text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
