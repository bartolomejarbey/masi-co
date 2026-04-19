"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Lock, Mail, ArrowRight } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "register";
  redirectTo?: string;
}

type FormState = {
  email: string;
  password: string;
};

const initialState: FormState = {
  email: "",
  password: "",
};

export function AuthForm({ mode, redirectTo = "/ucet" }: AuthFormProps) {
  const router = useRouter();
  const supabase = getBrowserSupabaseClient();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (mode === "login") {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (loginError) {
          throw loginError;
        }
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });

        if (signUpError) {
          throw signUpError;
        }

        if (!data.session) {
          const { error: signInError } =
            await supabase.auth.signInWithPassword({
              email: form.email,
              password: form.password,
            });

          if (signInError) {
            throw signInError;
          }
        }
      }

      router.push(redirectTo);
      router.refresh();
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Autentizace se nepodařila."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const loginPath = `/prihlaseni?redirectTo=${encodeURIComponent(redirectTo)}`;
  const registerPath = `/registrace?redirectTo=${encodeURIComponent(redirectTo)}`;

  return (
    <div className="mx-auto max-w-md">
      {/* Logo */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block font-display text-3xl font-bold">
          <span className="text-black">MASI</span>
          <span className="text-primary">-CO</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex rounded-xl border border-gray-200 bg-gray-100 p-1">
        <Link
          href={loginPath}
          className={`flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition-all ${
            mode === "login"
              ? "bg-white text-black shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Přihlášení
        </Link>
        <Link
          href={registerPath}
          className={`flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition-all ${
            mode === "register"
              ? "bg-white text-black shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Registrace
        </Link>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-2xl font-bold">
          {mode === "login" ? "Přihlaste se" : "Vytvořte si účet"}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {mode === "login"
            ? "Přístup k historii objednávek a rychlejšímu nákupu."
            : "Účet vám umožní sledovat objednávky a rychleji nakupovat."}
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
                value={form.email}
                onChange={(e) =>
                  setForm((c) => ({ ...c, email: e.target.value }))
                }
                placeholder="vas@email.cz"
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </label>

          <label className="block space-y-1.5 text-sm font-medium text-gray-700">
            <span>Heslo</span>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                required
                type="password"
                minLength={6}
                value={form.password}
                onChange={(e) =>
                  setForm((c) => ({ ...c, password: e.target.value }))
                }
                placeholder={
                  mode === "register" ? "Minimálně 6 znaků" : "Vaše heslo"
                }
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </label>

          {mode === "login" && (
            <div className="text-right">
              <Link
                href="/zapomenute-heslo"
                className="text-xs font-medium text-primary transition-colors hover:text-primary-dark"
              >
                Zapomenuté heslo?
              </Link>
            </div>
          )}

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
          >
            {submitting
              ? mode === "login"
                ? "Přihlašuji..."
                : "Registruji..."
              : mode === "login"
                ? "Přihlásit se"
                : "Vytvořit účet"}
            {!submitting && <ArrowRight size={14} />}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-gray-500">
        {mode === "register"
          ? "Vytvořením účtu souhlasíte s "
          : "Přihlášením souhlasíte s "}
        <Link
          href="/ochrana-udaju"
          className="text-primary underline"
        >
          ochranou osobních údajů
        </Link>
        .
      </p>
    </div>
  );
}
