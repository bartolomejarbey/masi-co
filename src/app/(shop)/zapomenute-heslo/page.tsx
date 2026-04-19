"use client";

import Link from "next/link";
import { useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ZapomenuteHesloPage() {
  const supabase = getBrowserSupabaseClient();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setError("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/reset-hesla` }
      );

      if (resetError) throw resetError;
      setStatus("success");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nepodařilo se odeslat e-mail."
      );
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      {/* Logo */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block font-display text-3xl font-bold">
          <span className="text-black">MASI</span>
          <span className="text-primary">-CO</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        {status === "success" ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 size={28} className="text-green-600" />
            </div>
            <h1 className="font-display text-2xl font-bold">E-mail odeslán</h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Na adresu <strong>{email}</strong> jsme odeslali odkaz pro
              obnovení hesla. Zkontrolujte svou e-mailovou schránku.
            </p>
            <Link
              href="/prihlaseni"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary"
            >
              Zpět na přihlášení
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold">
              Zapomenuté heslo
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Zadejte svůj e-mail a my vám pošleme odkaz pro nastavení nového
              hesla.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block space-y-1.5 text-sm font-medium text-gray-700">
                <span>E-mail</span>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vas@email.cz"
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </label>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex w-full items-center justify-center rounded-lg bg-black px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
              >
                {status === "loading"
                  ? "Odesílám..."
                  : "Obnovit heslo"}
              </button>
            </form>
          </>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/prihlaseni"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
        >
          <ArrowLeft size={14} />
          Zpět na přihlášení
        </Link>
      </div>
    </div>
  );
}
