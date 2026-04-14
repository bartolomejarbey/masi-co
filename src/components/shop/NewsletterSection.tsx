"use client";

import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
          Novinky a akce
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mb-8">
          Přihlaste se k odběru novinek a nenechte si ujít žádnou akci.
        </p>

        {status === "success" ? (
          <div className="bg-green-600/10 border border-green-600/30 text-green-400 text-sm py-4 px-6 rounded-2xl">
            Děkujeme, odběr novinek je potvrzený.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Váš e-mail"
              required
              className="flex-1 rounded-md px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm outline-none focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-md bg-primary hover:bg-primary-dark text-white font-medium text-sm uppercase tracking-wider px-6 py-3 transition-colors disabled:opacity-50 shrink-0"
            >
              {status === "loading" ? "Odesílám..." : "Odebírat"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-red-400 text-xs mt-3">
            Došlo k chybě. Zkuste to prosím znovu.
          </p>
        )}
      </div>
    </section>
  );
}
