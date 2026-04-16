import Link from "next/link";
import {
  Truck,
  Clock,
  MapPin,
  Package,
  ThermometerSnowflake,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const highlights = [
  {
    icon: Truck,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "Vlastní chlazený rozvoz",
    description: "Bez překladišť a zprostředkovatelů",
  },
  {
    icon: ShieldCheck,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "Doprava zdarma",
    description: "Ke každé objednávce nad 1 000 Kč",
  },
  {
    icon: Clock,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Expedice tentýž den",
    description: "Objednávky do 12:00 expedujeme ještě dnes",
  },
] as const;

const steps = [
  { icon: Clock, label: "Objednáte do 12:00" },
  { icon: Package, label: "Připravíme a zabalíme" },
  { icon: ThermometerSnowflake, label: "Naložíme do chlazeného vozu" },
  { icon: MapPin, label: "Doručíme k vám domů" },
] as const;

const areas = [
  "Praha a okolí",
  "Praha-východ",
  "Mladá Boleslav",
  "Kladno",
  "Mělník",
  "Nymburk",
];

const faq = [
  {
    question: "Jaká je minimální objednávka?",
    answer:
      "Minimální hodnota objednávky je 1 000 Kč. Doprava je vždy zdarma.",
  },
  {
    question: "Jak maso převážíte?",
    answer:
      "Veškeré zboží převážíme vlastním chlazeným vozem s dodržením hygienických standardů. Žádné překladiště, žádný zprostředkovatel.",
  },
  {
    question: "Mohu změnit adresu doručení?",
    answer:
      "Ano, kontaktujte nás telefonicky na +420 222 533 001 co nejdříve po objednání.",
  },
] as const;

export function DeliverySection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-off-white">
      <div className="max-w-7xl mx-auto">
        {/* ── Section header ── */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block text-xs uppercase tracking-[0.15em] font-medium text-primary mb-3 bg-primary/10 px-3 py-1 rounded-full">
            Doručení
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Rozvoz po Praze a okolí
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Rozvážíme vlastním chlazeným vozem přímo k vám domů. Doprava je
            vždy zdarma a zboží zůstává po celou dobu v řízeném chladu.
          </p>
        </div>

        {/* ── Highlight cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {highlights.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <div
                className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center mb-4`}
              >
                <card.icon size={22} className={card.iconColor} />
              </div>
              <h3 className="font-display text-lg font-bold mb-1">
                {card.title}
              </h3>
              <p className="text-sm text-gray-500">{card.description}</p>
            </div>
          ))}
        </div>

        {/* ── Timeline / process ── */}
        <div className="mb-16">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-center mb-10">
            Jak to funguje
          </h3>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 sm:gap-0">
            {/* Connecting line — vertical on mobile, horizontal on desktop */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-primary/20 sm:left-0 sm:right-0 sm:top-1/2 sm:bottom-auto sm:w-auto sm:h-px sm:-translate-y-1/2" />

            {steps.map((step, i) => (
              <div
                key={step.label}
                className="relative z-10 flex items-center gap-4 sm:flex-col sm:items-center sm:text-center sm:flex-1"
              >
                {/* Dot / icon circle */}
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
                  <step.icon size={18} />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-primary uppercase tracking-wider sm:mt-3 sm:block">
                    Krok {i + 1}
                  </span>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">
                    {step.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Delivery areas ── */}
        <div className="mb-16 text-center">
          <h3 className="font-display text-xl sm:text-2xl font-bold mb-6">
            Kam rozvážíme
          </h3>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {areas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-sm font-medium text-gray-700 rounded-full border border-gray-200 shadow-sm"
              >
                <MapPin size={14} className="text-primary" />
                {area}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 max-w-xl mx-auto">
            Všechny ceny jsou uvedené s DPH. U váženého zboží se konečná cena
            může lišit podle skutečné hmotnosti.
          </p>
        </div>

        {/* ── FAQ accordion ── */}
        <div className="max-w-2xl mx-auto mb-16">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-center mb-8">
            Časté dotazy
          </h3>
          <div className="space-y-3">
            {faq.map((item) => (
              <details
                key={item.question}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-sm sm:text-base font-medium text-gray-800 select-none list-none [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <ChevronRight
                    size={18}
                    className="text-gray-400 transition-transform duration-200 group-open:rotate-90 shrink-0 ml-4"
                  />
                </summary>
                <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* ── CTAs ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/produkty"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-lg text-sm font-semibold transition-colors hover:bg-primary-dark"
          >
            Objednat nyní
            <ChevronRight size={16} />
          </Link>
          <Link
            href="/jak-nakupovat"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 px-8 py-3.5 rounded-lg text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
          >
            Jak nakupovat
          </Link>
        </div>
      </div>
    </section>
  );
}
