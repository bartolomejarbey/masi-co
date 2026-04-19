"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Lock, CheckCircle2 } from "lucide-react";

export default function ResetHeslaPage() {
  const router = useRouter();
  const supabase = getBrowserSupabaseClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      setError("Heslo musí mít alespoň 6 znaků.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Hesla se neshodují.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;
      setStatus("success");

      setTimeout(() => {
        router.push("/ucet");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nepodařilo se nastavit nové heslo."
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
            <h1 className="font-display text-2xl font-bold">Heslo změněno</h1>
            <p className="mt-3 text-sm text-gray-600">
              Vaše heslo bylo úspěšně aktualizováno. Přesměrujeme vás na váš
              účet.
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold">Nové heslo</h1>
            <p className="mt-2 text-sm text-gray-500">
              Zadejte nové heslo pro svůj účet.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block space-y-1.5 text-sm font-medium text-gray-700">
                <span>Nové heslo</span>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    required
                    type="password"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimálně 6 znaků"
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </label>

              <label className="block space-y-1.5 text-sm font-medium text-gray-700">
                <span>Potvrzení hesla</span>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    required
                    type="password"
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Zopakujte heslo"
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
                {status === "loading" ? "Ukládám..." : "Nastavit nové heslo"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
