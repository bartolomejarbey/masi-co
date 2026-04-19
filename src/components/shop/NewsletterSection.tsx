"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

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
    <section className="bg-black px-4 py-16 text-white sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail size={22} className="text-primary" />
        </div>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Buďte v obraze
        </h2>
        <p className="mt-3 text-sm text-gray-400 sm:text-base">
          Odběratelé se dozví o akcích, novinkách a speciálních nabídkách jako první.
        </p>

        {status === "success" ? (
          <div className="mt-8 rounded-xl border border-green-600/30 bg-green-600/10 px-6 py-4 text-sm text-green-400">
            Děkujeme, odběr novinek je potvrzený.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Váš e-mail"
              required
              className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 transition-colors focus:border-primary"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 rounded-lg bg-primary px-6 py-3 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {status === "loading" ? "Odesílám..." : "Odebírat"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-3 text-xs text-red-400">
            Došlo k chybě. Zkuste to prosím znovu.
          </p>
        )}
        <p className="mt-4 text-[11px] text-gray-600">
          Souhlasem přijímáte, že vám můžeme zasílat marketingová sdělení. Můžete se
          kdykoliv odhlásit.
        </p>
      </div>
    </section>
  );
}
