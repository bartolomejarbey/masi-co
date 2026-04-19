import Link from "next/link";
import { ShoppingCart, CreditCard, Truck, CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Vyberte si",
    description:
      "Projděte sortiment a přidejte produkty do košíku. Ceny vidíte přímo u produktu.",
    icon: ShoppingCart,
  },
  {
    number: "2",
    title: "Objednejte",
    description:
      "Vyplňte doručovací údaje. Minimální objednávka je 1 000 Kč.",
    icon: CreditCard,
  },
  {
    number: "3",
    title: "Doručíme",
    description:
      "Objednávku doručíme vlastním chlazeným vozem přímo k vám domů.",
    icon: Truck,
  },
  {
    number: "4",
    title: "Převezmete",
    description:
      "Zkontrolujte zboží při převzetí. Konečná cena odpovídá skutečné hmotnosti.",
    icon: CheckCircle2,
  },
];

export function HowItWorks() {
  return (
    <section className="bg-[#FAFAFA] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Nákup krok za krokem
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Jak to funguje</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-gray-500 sm:text-base">
            Objednat čerstvé maso je jednoduché a přehledné.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-center"
              >
                {/* Watermark number */}
                <span className="pointer-events-none absolute -right-2 -top-4 font-display text-[120px] font-bold leading-none text-gray-100">
                  {step.number}
                </span>

                <div className="relative">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/sortiment"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary"
          >
            Začít nakupovat
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
