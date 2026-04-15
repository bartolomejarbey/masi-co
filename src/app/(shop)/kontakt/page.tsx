import type { Metadata } from "next";
import { ContactForm } from "@/components/shop/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt",
};

export default function KontaktPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Kontakt</p>
      <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Jsme vám k dispozici</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600">
        Ať už řešíte výběr masa, termín rozvozu nebo konkrétní objednávku, ozvěte se nám.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="font-display text-2xl font-bold">Kontaktní údaje</h2>
          <div className="mt-6 space-y-5 text-sm leading-7 text-gray-700">
            <div>
              <p className="font-semibold text-black">Sídlo</p>
              <p>
                Masi-co s.r.o.
                <br />
                Jana Zajíce 563/20
                <br />
                170 00 Praha 7
              </p>
              <p className="mt-1">IČ: 28402979 | DIČ: CZ28402979</p>
            </div>
            <div>
              <p className="font-semibold text-black">Provozovna</p>
              <p>
                Zahradní 466
                <br />
                250 64 Měšice, Praha-východ
              </p>
            </div>
            <div>
              <p className="font-semibold text-black">E-mail</p>
              <a href="mailto:objednavky@masi-co.com" className="text-primary transition-colors hover:text-primary-dark">
                objednavky@masi-co.com
              </a>
            </div>
            <div>
              <p className="font-semibold text-black">Telefon</p>
              <a href="tel:+420222533001" className="text-primary transition-colors hover:text-primary-dark">
                +420 222 533 001
              </a>
            </div>
            <div>
              <p className="font-semibold text-black">Jednatel</p>
              <p>Miroslav Slezák</p>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
