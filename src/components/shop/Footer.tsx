import Link from "next/link";
import { Phone, Mail, MapPin, Truck } from "lucide-react";

const sortimentLinks = [
  { href: "/sortiment/maso", label: "Maso" },
  { href: "/sortiment/hotovky", label: "Hotová jídla" },
  { href: "/sortiment/uzene-maso", label: "Uzené speciality" },
  { href: "/sortiment/uzeniny", label: "Uzeniny" },
  { href: "/sortiment/zverina", label: "Zvěřina" },
  { href: "/sortiment/ryby", label: "Ryby" },
  { href: "/sortiment/ostatni-sortiment", label: "Ostatní sortiment" },
];

const infoLinks = [
  { href: "/jak-nakupovat", label: "Jak nakupovat" },
  { href: "/o-nas", label: "O nás" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/obchodni-podminky", label: "Obchodní podmínky" },
  { href: "/ochrana-udaju", label: "Ochrana osobních údajů" },
  { href: "/prihlaseni", label: "Přihlášení / Registrace" },
];

export function Footer() {
  return (
    <footer className="bg-[#111] text-white">
      {/* Delivery banner */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-3.5 text-sm sm:px-6">
          <Truck size={16} className="shrink-0 text-primary" />
          <span className="text-gray-300">
            Doprava zdarma od 1 000 Kč — vlastní chlazený rozvoz po Praze a okolí
          </span>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1 — Brand */}
          <div>
            <Link
              href="/"
              className="inline-block font-display text-2xl font-bold"
            >
              <span className="text-white">MASI</span>
              <span className="text-primary">-CO</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Poctivé řeznictví s vlastním rozvozem. Čerstvé maso od českých
              dodavatelů přímo k vám domů.
            </p>
            <div className="mt-5 space-y-2.5 text-sm text-gray-500">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-gray-600" />
                <span>Zahradní 466, 250 64 Měšice</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-gray-600" />
                <a
                  href="tel:+420222533001"
                  className="transition-colors hover:text-white"
                >
                  +420 222 533 001
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-gray-600" />
                <a
                  href="mailto:objednavky@masi-co.com"
                  className="transition-colors hover:text-white"
                >
                  objednavky@masi-co.com
                </a>
              </div>
            </div>
          </div>

          {/* Col 2 — Sortiment */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
              Sortiment
            </h3>
            <ul className="space-y-2.5">
              {sortimentLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Informace */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
              Informace
            </h3>
            <ul className="space-y-2.5">
              {infoLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Kontakt & Legal */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
              Fakturační údaje
            </h3>
            <div className="space-y-1.5 text-sm text-gray-500">
              <p className="font-medium text-gray-300">Masi-co s.r.o.</p>
              <p>Jana Zajíce 563/20</p>
              <p>170 00 Praha 7</p>
              <p className="mt-2">IČ: 28402979</p>
              <p>DIČ: CZ28402979</p>
              <p className="mt-2 text-xs">Č. účtu: 43-2367040227/0100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Masi-co s.r.o. Všechny ceny jsou
            uvedeny včetně DPH.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <Link
              href="/obchodni-podminky"
              className="transition-colors hover:text-gray-300"
            >
              Podmínky
            </Link>
            <Link
              href="/ochrana-udaju"
              className="transition-colors hover:text-gray-300"
            >
              GDPR
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
