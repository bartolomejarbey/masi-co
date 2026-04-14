"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase-browser";

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
          const { error: signInError } = await supabase.auth.signInWithPassword({
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
      setError(authError instanceof Error ? authError.message : "Autentizace se nepodařila.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs uppercase tracking-[0.2em] font-medium text-primary">
        {mode === "login" ? "Zákaznický účet" : "Vytvoření účtu"}
      </p>
      <h1 className="font-display text-4xl font-bold">
        {mode === "login" ? "Přihlášení" : "Registrace"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-gray-600">
        {mode === "login"
          ? "Přihlaste se ke svému účtu a zobrazte historii objednávek."
          : "Vytvořte si účet pro rychlejší nákup a přehled svých objednávek."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block space-y-2 text-sm font-medium text-gray-700">
          <span>E-mail</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="např. jan.novak@email.cz"
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
          />
        </label>

        <label className="block space-y-2 text-sm font-medium text-gray-700">
          <span>Heslo</span>
          <input
            required
            type="password"
            minLength={6}
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Minimálně 6 znaků"
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
          />
        </label>

        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
        >
          {submitting
            ? mode === "login"
              ? "Přihlašuji..."
              : "Registruji..."
            : mode === "login"
              ? "Přihlásit se"
              : "Vytvořit účet"}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        {mode === "login" ? "Ještě nemáte účet?" : "Už účet máte?"}{" "}
        <Link
          href={mode === "login" ? `/registrace?redirectTo=${encodeURIComponent(redirectTo)}` : `/prihlaseni?redirectTo=${encodeURIComponent(redirectTo)}`}
          className="font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          {mode === "login" ? "Registrovat se" : "Přihlásit se"}
        </Link>
      </p>
      {mode === "login" ? (
        <p className="mt-3 text-xs leading-5 text-gray-500">
          Účet slouží pro přehled objednávek a rychlejší dokončení dalších nákupů.
        </p>
      ) : null}
    </div>
  );
}
