import Link from "next/link";
import type { Metadata } from "next";
import { Heart, Shield, Scale, Users, ArrowRight, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "O nás",
};

const values = [
  {
    icon: Heart,
    title: "Kvalita",
    description:
      "Každý kus masa prochází přísnou kontrolou. Spolupracujeme jen s dodavateli, kterým věříme a jejichž práci známe osobně.",
  },
  {
    icon: Shield,
    title: "Férovost",
    description:
      "Žádné skryté poplatky, žádné triky s váhou. Cena, kterou vidíte, odpovídá tomu, co dostanete — účtujeme skutečnou hmotnost.",
  },
  {
    icon: Scale,
    title: "Čerstvost",
    description:
      "Od porážky k vám domů v co nejkratším čase. Vlastní chlazený rozvoz zajistí, že maso dorazí přesně tak čerstvé, jak má být.",
  },
  {
    icon: Users,
    title: "Osobní přístup",
    description:
      "Nejsme anonymní e-shop. Za každou objednávkou stojí konkrétní lidé — poradíme s výběrem, přizpůsobíme se vašim potřebám.",
  },
];

export default function ONasPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(204,25,57,0.06),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            O nás
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Poctivé řeznictví,
            <br />
            moderní přístup
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            MASI-CO je rodinné řeznictví s vlastním rozvozem po Praze a okolí.
            Spojujeme tradiční řemeslo s pohodlím online nákupu — čerstvé maso
            objednáte z domova a my ho dovezeme v chlazeném voze přímo ke dveřím.
          </p>
        </div>
      </section>

      {/* Příběh */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Náš příběh
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Od řeznického pultu k vám domů
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-600 sm:text-base">
              <p>
                Začínali jsme jako klasické řeznictví v Měšicích u Prahy.
                Postupem času jsme zjistili, že naši zákazníci oceňují nejen
                kvalitu masa, ale i osobní přístup a spolehlivost.
              </p>
              <p>
                Proto jsme vytvořili e-shop, kde si můžete vybrat čerstvé maso,
                uzeniny i hotová jídla a nechat si je dovézt vlastním chlazeným
                rozvozem. Žádní prostředníci, žádné sklady — od nás přímo k vám.
              </p>
              <p>
                Každý den zpracováváme maso od ověřených českých dodavatelů.
                Ručně porcujeme, pečlivě balíme a osobně doručujeme. Protože
                věříme, že dobré maso si zaslouží poctivý přístup od začátku do
                konce.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
              <p className="font-display text-4xl font-bold text-primary">
                250+
              </p>
              <p className="mt-2 text-sm text-gray-500">Produktů v nabídce</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
              <p className="font-display text-4xl font-bold text-primary">
                100%
              </p>
              <p className="mt-2 text-sm text-gray-500">Český původ</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
              <p className="font-display text-4xl font-bold text-primary">
                0 Kč
              </p>
              <p className="mt-2 text-sm text-gray-500">Doprava od 1 000 Kč</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
              <p className="font-display text-4xl font-bold text-primary">
                24h
              </p>
              <p className="mt-2 text-sm text-gray-500">Expedice do 12:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hodnoty */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Naše hodnoty
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Na čem nám záleží
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kontakt info */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Kde nás najdete
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Provozovna Měšice
            </h2>
            <div className="mt-6 space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-gray-900">Adresa</p>
                  <p>Zahradní 466, 250 64 Měšice, Praha-východ</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-gray-900">Telefon</p>
                  <a
                    href="tel:+420222533001"
                    className="text-primary hover:text-primary-dark"
                  >
                    +420 222 533 001
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2554.5!2d14.4347!3d50.1686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDEwJzA3LjAiTiAxNMKwMjYnMDUuMCJF!5e0!3m2!1scs!2scz!4v1"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa provozovny MASI-CO"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Vyzkoušejte naše produkty
          </h2>
          <p className="mt-4 text-gray-400">
            Prohlédněte si sortiment a objednejte čerstvé maso s doručením až ke
            dveřím.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sortiment"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Prohlédnout sortiment
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex rounded-lg border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Kontaktovat nás
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
