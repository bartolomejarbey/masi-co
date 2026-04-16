import Link from "next/link";
import {
  ShoppingCart,
  Scale,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
} from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Vyberte si",
    description:
      "Projděte náš sortiment a přidejte produkty do košíku. Ceny a skladovost vidíte přímo u produktu.",
    tip: "Využijte vyhledávání a filtry pro rychlejší orientaci.",
    icon: ShoppingCart,
  },
  {
    number: "2",
    title: "Nastavte množství",
    description:
      "U masa volíte hmotnost v kilogramech, u ostatního zboží počet kusů.",
    tip: "Minimální objednávka je 1 000 Kč.",
    icon: Scale,
  },
  {
    number: "3",
    title: "Zvolte platbu",
    description:
      "Vyplňte kontaktní a doručovací údaje. Vyberte si platbu online, hotově nebo stravenkami.",
    tip: "Nakupujete na firmu? Zaškrtněte příslušné pole a vyplňte IČO.",
    icon: CreditCard,
  },
  {
    number: "4",
    title: "Doručíme",
    description:
      "Objednávku doručíme vlastním chlazeným vozem přímo k vám domů.",
    tip: "Rozvážíme po Praze a okolí — Mladá Boleslav, Kladno, Mělník, Nymburk.",
    icon: Truck,
  },
  {
    number: "5",
    title: "Převezmete",
    description:
      "Zkontrolujte si zboží při převzetí. Obdržíte daňový doklad.",
    tip: "Konečná cena se může mírně lišit podle skutečné hmotnosti váženého zboží.",
    icon: CheckCircle2,
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-off-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-primary mb-3">
            Nákup krok za krokem
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            Jak to funguje
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
            Objednat čerstvé maso je jednoduché a přehledné.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number} className="relative flex flex-col">
                {/* Connecting dashed line between cards (desktop only) */}
                {!isLast && (
                  <div className="hidden lg:block absolute top-16 left-[calc(50%+40px)] right-[calc(-50%+40px)] z-0">
                    <div className="border-t-2 border-dashed border-gray-300 w-full" />
                  </div>
                )}

                {/* Card */}
                <div className="relative z-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center flex flex-col flex-1 lg:mx-2">
                  {/* Icon */}
                  <div className="flex justify-center mb-3">
                    <Icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
                  </div>

                  {/* Step number */}
                  <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                    <span className="font-display text-lg font-bold text-primary">
                      {step.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg font-bold mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">
                    {step.description}
                  </p>

                  {/* Amber tip box */}
                  <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg px-3 py-2.5 text-left">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs leading-relaxed text-amber-800">
                        {step.tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA button */}
        <div className="text-center mt-12">
          <Link
            href="/produkty"
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary"
          >
            Začít nakupovat
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
