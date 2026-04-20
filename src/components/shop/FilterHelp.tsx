"use client";

import { useState, useRef, useEffect } from "react";
import { HelpCircle, X } from "lucide-react";

export function FilterHelp() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:border-primary hover:text-primary"
        aria-label="Jak nakupovat"
      >
        <HelpCircle size={16} />
        <span className="hidden sm:inline">Jak vybírat?</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-[320px] rounded-2xl border border-gray-200 bg-white p-5 shadow-xl animate-[fadeSlideIn_0.2s_ease-out]">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={14} />
          </button>

          <p className="text-sm font-bold text-gray-900">
            Navigace pro labuzniky
          </p>

          <div className="mt-3 space-y-3 text-[13px] leading-relaxed text-gray-600">
            <div className="flex gap-2.5">
              <span className="mt-0.5 shrink-0 rounded-full border border-primary bg-red-50 px-2 py-0.5 text-[11px] font-medium text-primary">
                Maso
              </span>
              <span>
                <strong className="text-gray-800">Barevne pilulky nahore</strong> = kategorie.
                Klikni a preskoc rovnou k hovezaku, veprku nebo rybam.
              </span>
            </div>

            <div className="flex gap-2.5">
              <span className="mt-0.5 shrink-0 rounded-full border border-gray-900 bg-gray-900 px-2 py-0.5 text-[11px] font-medium text-white">
                Vse
              </span>
              <span>
                <strong className="text-gray-800">Tmave pilulky</strong> = podkategorie.
                Treba u masa si zvolis jestli chces krkovicku nebo kolinka.
              </span>
            </div>

            <div className="flex gap-2.5">
              <span className="mt-1 shrink-0 text-base">&#x1F50D;</span>
              <span>
                <strong className="text-gray-800">Razeni</strong> = serad si to podle ceny
                (od nejlevnejsiho pro sporaky, od nejdrazsiho pro flejsaky).
              </span>
            </div>

            <div className="flex gap-2.5">
              <span className="mt-1 shrink-0 text-base">&#x2705;</span>
              <span>
                <strong className="text-gray-800">Jen skladem</strong> = schova vyprodane.
                Co vidis, to dostanes.
              </span>
            </div>
          </div>

          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-primary">
            Tip: Nevis si rady? Klikni na robota vpravo dole a nech se poradit.
          </p>
        </div>
      )}
    </div>
  );
}
