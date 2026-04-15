import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Truck, CreditCard, Scale, Phone, Clock, Shield, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jak nakupovat",
};

const steps = [
  {
    number: "01",
    icon: ShoppingCart,
    title: "Vyberte si z nabídky",
    description:
      "Procházejte náš katalog čerstvého masa, uzenin, hotových jídel a dalšího sortimentu. U každého produktu najdete cenu, popis a informaci o dostupnosti.",
    tip: "Tip: Využijte vyhledávání nebo filtr kategorií pro rychlejší orientaci.",
  },
  {
    number: "02",
    icon: Scale,
    title: "Nastavte množství a vložte do košíku",
    description:
      "U každé položky zvolíte požadované množství. Maso prodáváme na kilogramy — cena je orientační za 1 kg. Hotovky a uzeniny se prodávají na kusy.",
    tip: "Minimální hodnota objednávky je 1 000 Kč.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Vyplňte údaje a zvolte platbu",
    description:
      "V pokladně vyplníte kontaktní údaje a adresu doručení. Na výběr máte platbu dobírkou, bankovním převodem (s QR kódem), stravenkami nebo online kartou.",
    tip: "Nakupujete na firmu? Zaškrtněte \u201ENakupuji na firmu\u201C a vyplňte IČO/DIČ.",
  },
  {
    number: "04",
    icon: Truck,
    title: "Doručíme až k vám",
    description:
      "Objednávku doručíme vlastním chlazeným vozem po Praze a okolí. Termín rozvozu upřesníme telefonicky nebo e-mailem po potvrzení objednávky.",
    tip: "Rozvážíme: Praha, Praha-východ, Mladá Boleslav, Kladno, Mělník, Nymburk.",
  },
  {
    number: "05",
    icon: CheckCircle2,
    title: "Převezměte a zkontrolujte",
    description:
      "Při předání zkontrolujete zboží a obdržíte doklad. Konečná cena váženého zboží odpovídá skutečné hmotnosti — přesnou částku vám potvrdíme předem.",
    tip: "Cena se může mírně lišit od objednávky — vždy vám ji potvrdíme před doručením.",
  },
];

const benefits = [
  {
    icon: Truck,
    title: "Vlastní chlazený rozvoz",
    description: "Maso převážíme v chlazeném voze, aby k vám dorazilo čerstvé a v perfektním stavu.",
  },
  {
    icon: Shield,
    title: "Záruka kvality",
    description: "Spolupracujeme s ověřenými českými dodavateli. Za každým kusem masa stojíme.",
  },
  {
    icon: Clock,
    title: "Rychlé zpracování",
    description: "Objednávku zpracujeme co nejdříve a domluvíme s vámi ideální termín rozvozu.",
  },
  {
    icon: Phone,
    title: "Osobní přístup",
    description: "Máte dotaz? Zavolejte nám nebo napište. Rádi poradíme s výběrem i množstvím.",
  },
];

export default function JakNakupovatPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-black py-16 sm:py-24">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/assets/hero/hero-1.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        <div className="relative mx-auto max-w-4xl px-4 text-center text-white sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Průvodce nákupem</p>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
            Jak nakupovat v MASI-CO
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
            Nákup čerstvého masa online nemusí být složitý. Připravili jsme pro vás jednoduchý průvodce
            od výběru sortimentu až po doručení ke dveřím.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/produkty"
              className="inline-flex rounded-md bg-primary px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary-dark"
            >
              Začít nakupovat
            </Link>
            <a
              href="tel:+420222533001"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <Phone size={16} />
              Zavolat nám
            </a>
          </div>
        </div>
      </section>

      {/* Step by step */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3">Krok za krokem</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">5 jednoduchých kroků k objednávce</h2>
          </div>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="group relative grid grid-cols-1 gap-6 rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-primary/30 hover:shadow-lg sm:grid-cols-[80px_1fr] sm:p-8"
              >
                {/* Number + icon */}
                <div className="flex items-start gap-4 sm:flex-col sm:items-center sm:gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <step.icon size={24} />
                  </div>
                  <span className="font-display text-3xl font-bold text-gray-200 sm:text-center">{step.number}</span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-display text-xl font-bold sm:text-2xl">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">{step.description}</p>
                  <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3">
                    <span className="mt-0.5 text-amber-600 shrink-0">
                      <CheckCircle2 size={16} />
                    </span>
                    <p className="text-sm text-amber-900">{step.tip}</p>
                  </div>
                </div>

                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute -bottom-6 left-1/2 hidden h-6 w-px bg-gray-200 sm:left-[40px] sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proč nakupovat u nás */}
      <section className="bg-gray-50 py-16 sm:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3">Proč MASI-CO</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Proč nakupovat právě u nás</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <b.icon size={22} />
                </div>
                <h3 className="font-display text-lg font-bold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / Důležité informace */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3">Důležité informace</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Často kladené otázky</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Jaká je minimální objednávka?",
                a: "Minimální hodnota objednávky je 1 000 Kč. Doprava vlastním chlazeným rozvozem je zdarma.",
              },
              {
                q: "Kam rozvážíte?",
                a: "Rozvážíme po Praze a okolí — Praha, Praha-východ, Mladá Boleslav, Kladno, Mělník a Nymburk. Konkrétní termín domluvíme po potvrzení objednávky.",
              },
              {
                q: "Proč se cena může lišit od objednávky?",
                a: "Maso prodáváme na váhu. Cena v e-shopu je orientační za 1 kg. Konečná cena odpovídá skutečné navážené hmotnosti — přesnou částku vám potvrdíme před doručením.",
              },
              {
                q: "Jaké platební metody přijímáte?",
                a: "Platit můžete dobírkou (hotovost při převzetí), bankovním převodem (s QR kódem), stravenkami nebo online kartou přes bezpečnou platební bránu.",
              },
              {
                q: "Mohu nakoupit na firmu?",
                a: "Ano. V pokladně zaškrtněte \u201ENakupuji na firmu\u201C a vyplňte IČO a DIČ. Na dokladu budou uvedeny firemní údaje.",
              },
              {
                q: "Jak maso převážíte?",
                a: "Maso rozvážíme vlastním chlazeným vozem, aby k vám dorazilo v perfektní kvalitě. Dodržujeme přísné hygienické normy.",
              },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="font-display text-base font-bold sm:text-lg">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-16 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Připraveni na nákup?</h2>
          <p className="mt-4 text-base leading-relaxed text-gray-400">
            Prohlédněte si náš sortiment a objednejte si čerstvé maso s doručením až ke dveřím.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/produkty"
              className="inline-flex rounded-md bg-primary px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary-dark"
            >
              Prohlédnout sortiment
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex rounded-md border border-white/30 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Kontaktovat nás
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
