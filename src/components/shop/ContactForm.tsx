"use client";

import { useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-8 text-sm leading-6 text-green-800">
        Děkujeme za zprávu. Ozveme se vám co nejdříve na uvedený kontakt.
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="font-display text-2xl font-bold">Napište nám</h2>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        Máte dotaz k sortimentu, rozvozu nebo objednávce? Ozvěte se nám.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-gray-700">
          <span>Jméno</span>
          <input required placeholder="Vaše jméno" className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary" />
        </label>
        <label className="space-y-2 text-sm font-medium text-gray-700">
          <span>E-mail</span>
          <input required type="email" placeholder="např. novak@email.cz" className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary" />
        </label>
        <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">
          <span>Předmět</span>
          <input required placeholder="S čím vám můžeme pomoci?" className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary" />
        </label>
        <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-2">
          <span>Zpráva</span>
          <textarea required rows={5} placeholder="Napište nám svůj dotaz nebo přání." className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary" />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary"
      >
        Odeslat zprávu
      </button>
    </form>
  );
}
