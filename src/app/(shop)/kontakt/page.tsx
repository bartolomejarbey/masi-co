import type { Metadata } from "next";
import { ContactForm } from "@/components/shop/ContactForm";
import { MapPin, Phone, Mail, Building2, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontakt",
};

const contactCards = [
  {
    icon: Phone,
    title: "Telefon",
    value: "+420 222 533 001",
    href: "tel:+420222533001",
  },
  {
    icon: Mail,
    title: "E-mail",
    value: "objednavky@masi-co.com",
    href: "mailto:objednavky@masi-co.com",
  },
  {
    icon: Clock,
    title: "Objednávky",
    value: "Po–Pá 7:00–15:00",
    href: null,
  },
];

export default function KontaktPage() {
  return (
    <div>
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:pt-14">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Kontakt
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          Jsme vám k dispozici
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600">
          Ať už řešíte výběr masa, termín rozvozu nebo konkrétní objednávku,
          ozvěte se nám.
        </p>
      </div>

      {/* Quick contact cards */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {contactCards.map((card) => {
            const Icon = card.icon;
            const inner = (
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    {card.title}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {card.value}
                  </p>
                </div>
              </div>
            );
            return card.href ? (
              <a key={card.title} href={card.href}>
                {inner}
              </a>
            ) : (
              <div key={card.title}>{inner}</div>
            );
          })}
        </div>
      </div>

      {/* Form + info */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <ContactForm />

          <div className="space-y-6">
            {/* Sídlo */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                <h2 className="font-display text-lg font-bold">Sídlo</h2>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-900">Masi-co s.r.o.</p>
                <p>Jana Zajíce 563/20</p>
                <p>170 00 Praha 7</p>
                <p className="mt-2 text-xs text-gray-400">
                  IČ: 28402979 | DIČ: CZ28402979
                </p>
                <p className="text-xs text-gray-400">Jednatel: Miroslav Slezák</p>
              </div>
            </div>

            {/* Provozovna */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <h2 className="font-display text-lg font-bold">Provozovna</h2>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Zahradní 466</p>
                <p>250 64 Měšice, Praha-východ</p>
              </div>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2554.5!2d14.4347!3d50.1686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDEwJzA3LjAiTiAxNMKwMjYnMDUuMCJF!5e0!3m2!1scs!2scz!4v1"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa provozovny MASI-CO"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
