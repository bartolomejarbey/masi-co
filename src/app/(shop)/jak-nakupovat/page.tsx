import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jak nakupovat",
};

export default function JakNakupovatPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Informace</p>
      <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Jak nakupovat</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600">
        Připravili jsme jednoduchý přehled celého nákupu od výběru sortimentu až po doručení.
      </p>

      <div className="mt-8 space-y-8 text-sm leading-7 text-gray-700">
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-display text-2xl font-bold text-black">1. Vyberte si sortiment</h2>
          <p className="mt-3">
            V katalogu si zvolte maso, hotová jídla i další sortiment. U produktů prodávaných na kilogram je cena
            uvedena orientačně za 1 kg.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-display text-2xl font-bold text-black">2. Vložte produkty do košíku</h2>
          <p className="mt-3">
            U každé položky nastavte požadované množství a přidejte ji do košíku. Minimální hodnota objednávky je
            1 000 Kč.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-display text-2xl font-bold text-black">3. Vyplňte doručovací údaje</h2>
          <p className="mt-3">
            V pokladně doplníte kontaktní údaje, adresu a zvolíte způsob platby. Doručení zajišťujeme vlastním rozvozem.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-display text-2xl font-bold text-black">4. Počítejte s upřesněním ceny</h2>
          <p className="mt-3">
            U váženého zboží se konečná cena může mírně lišit podle skutečné navážené hmotnosti. Při zpracování
            objednávky proto potvrzujeme finální částku podle reálně připraveného zboží.
          </p>
        </section>
      </div>
    </div>
  );
}
