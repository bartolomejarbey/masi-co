import Image from "next/image";
import Link from "next/link";
import { Facebook, Globe, Instagram, Music2 } from "lucide-react";

export function Footer() {
  const socialLinks = [
    { href: "https://masi-co.cz", label: "Facebook", icon: Facebook },
    { href: "https://masi-co.cz", label: "Instagram", icon: Instagram },
    { href: "https://masi-co.cz", label: "TikTok", icon: Music2 },
    { href: "https://masi-co.cz", label: "Web", icon: Globe },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 — Logo & info */}
          <div>
            <Link href="/" className="relative block h-24 w-[296px]">
              <Image
                src="/assets/brand/masico-logo.png"
                alt="MASI-CO"
                fill
                sizes="296px"
                className="object-contain object-left brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              Řeznictví s tradicí. Maso s respektem.
            </p>
            <div className="text-gray-500 text-sm mt-4 space-y-1">
              <p>Masi-co s.r.o.</p>
              <p>Zahradní 466</p>
              <p>250 64 Měšice, Praha-východ</p>
            </div>
          </div>

          {/* Col 2 — Sortiment */}
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
              Sortiment
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/produkty/hotovky", label: "Hotovky" },
                { href: "/produkty/maso", label: "Maso" },
                { href: "/produkty/uzene-maso", label: "Uzené maso" },
                { href: "/produkty/ostatni-maso", label: "Ostatní maso" },
                { href: "/produkty/zverina", label: "Zvěřina" },
                { href: "/produkty/uzeniny", label: "Uzeniny" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Informace */}
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
              Informace
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/jak-nakupovat", label: "Jak nakupovat" },
                { href: "/obchodni-podminky", label: "Obchodní podmínky" },
                { href: "/ochrana-udaju", label: "Ochrana osobních údajů" },
                { href: "/prihlaseni", label: "Přihlášení" },
                { href: "/kontakt", label: "Kontakt" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Kontakt */}
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
              Kontakt
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="mailto:info@masi-co.cz"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  info@masi-co.cz
                </a>
              </li>
              <li>
                <a
                  href="tel:+420123456789"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  +420 123 456 789
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-gray-500 transition-colors hover:border-gray-400 hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            2026 Masi-co s.r.o. | Ceny s DPH
          </p>
          <a
            href="https://masi-co.cz"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            masi-co.cz
          </a>
        </div>
      </div>
    </footer>
  );
}
