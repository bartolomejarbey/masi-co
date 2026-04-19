"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/utils";

interface CheckoutPageClientProps {
  minOrderAmount: number;
}

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  shipping_street: string;
  shipping_city: string;
  shipping_zip: string;
  is_company: boolean;
  billing_company_name: string;
  billing_ico: string;
  billing_dic: string;
  payment_method: "cash_on_delivery" | "meal_vouchers" | "online_card" | "bank_transfer";
  note: string;
  termsAccepted: boolean;
};

const initialState: FormState = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  shipping_street: "",
  shipping_city: "",
  shipping_zip: "",
  is_company: false,
  billing_company_name: "",
  billing_ico: "",
  billing_dic: "",
  payment_method: "cash_on_delivery",
  note: "",
  termsAccepted: false,
};

export function CheckoutPageClient({ minOrderAmount }: CheckoutPageClientProps) {
  const router = useRouter();
  const { items, clearCart, getTotal } = useCart();
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = getTotal();
  const checkoutAllowed = items.length > 0 && subtotal >= minOrderAmount && form.termsAccepted;

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!checkoutAllowed) {
      setError("Objednávku zatím nelze odeslat. Zkontrolujte minimální hodnotu a povinný souhlas.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          shipping_method: "own_delivery",
          items,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        orderNumber?: string;
        redirectUrl?: string;
        qrCodeUrl?: string;
      };

      if (!response.ok || !payload.orderNumber) {
        throw new Error(payload.error || "Objednávku se nepodařilo uložit.");
      }

      clearCart();

      // Comgate online payment — redirect to payment gateway
      if (payload.redirectUrl) {
        window.location.href = payload.redirectUrl;
        return;
      }

      // Bank transfer — pass QR code URL to confirmation page
      const params = new URLSearchParams({ order: payload.orderNumber });
      if (payload.qrCodeUrl) {
        params.set("qr", payload.qrCodeUrl);
      }
      router.push(`/pokladna/potvrzeni?${params.toString()}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Objednávku se nepodařilo uložit.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
        <h1 className="font-display text-3xl font-bold">V pokladně zatím nic není</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Nejprve vložte produkty do košíku a poté dokončete objednávku.
        </p>
        <Link
          href="/sortiment"
          className="mt-6 inline-flex rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary"
        >
          Zpět do katalogu
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-8">
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-display text-2xl font-bold">Kontaktní údaje</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Vyplňte údaje, na které vám pošleme potvrzení objednávky a informace k rozvozu.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Jméno</span>
              <input
                required
                value={form.first_name}
                onChange={(event) => updateField("first_name", event.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Příjmení</span>
              <input
                required
                value={form.last_name}
                onChange={(event) => updateField("last_name", event.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>E-mail</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Telefon</span>
              <input
                required
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-display text-2xl font-bold">Adresa doručení</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Rozvážíme vlastním chlazeným vozem po Praze a okolí.
          </p>

          <div className="mt-6 grid gap-4">
            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Ulice a číslo popisné</span>
              <input
                required
                value={form.shipping_street}
                onChange={(event) => updateField("shipping_street", event.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span>Město</span>
                <input
                  required
                  value={form.shipping_city}
                  onChange={(event) => updateField("shipping_city", event.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span>PSČ</span>
                <input
                  required
                  value={form.shipping_zip}
                  onChange={(event) => updateField("shipping_zip", event.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
                />
              </label>
            </div>
          </div>

          <label className="mt-6 flex items-start gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.is_company}
              onChange={(event) => updateField("is_company", event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>Nakupuji na firmu</span>
          </label>

          {form.is_company && (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="space-y-2 text-sm font-medium text-gray-700 md:col-span-3">
                <span>Název firmy</span>
                <input
                  value={form.billing_company_name}
                  onChange={(event) => updateField("billing_company_name", event.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span>IČO</span>
                <input
                  value={form.billing_ico}
                  onChange={(event) => updateField("billing_ico", event.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700">
                <span>DIČ</span>
                <input
                  value={form.billing_dic}
                  onChange={(event) => updateField("billing_dic", event.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
                />
              </label>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-display text-2xl font-bold">Doprava a platba</h2>

          <div className="mt-6 grid gap-6">
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
              <p className="text-sm font-semibold text-black">Doprava: Vlastní rozvoz</p>
              <p className="mt-1 text-sm text-gray-600">Objednávku doručíme v rámci rozvozových tras MASI-CO.</p>
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-gray-700">Platba</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {[
                  { value: "cash_on_delivery", label: "Dobírka" },
                  { value: "bank_transfer", label: "Převodem" },
                  { value: "meal_vouchers", label: "Stravenky" },
                  { value: "online_card", label: "Online kartou" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`rounded-xl border px-4 py-4 text-sm font-medium transition ${
                      form.payment_method === option.value
                        ? "border-primary bg-red-50 text-primary"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      className="sr-only"
                      checked={form.payment_method === option.value}
                      onChange={() =>
                        updateField("payment_method", option.value as FormState["payment_method"])
                      }
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              <span>Poznámka k objednávce</span>
              <textarea
                rows={4}
                value={form.note}
                onChange={(event) => updateField("note", event.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-primary"
              />
            </label>

            <label className="flex items-start gap-3 text-sm text-gray-700">
              <input
                required
                type="checkbox"
                checked={form.termsAccepted}
                onChange={(event) => updateField("termsAccepted", event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span>
                Souhlasím s obchodními podmínkami a beru na vědomí, že výsledná cena se může upravit podle
                skutečné navážené hmotnosti.
              </span>
            </label>
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="font-display text-2xl font-bold">Shrnutí objednávky</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Před odesláním si zkontrolujte položky i orientační cenu.
        </p>

        <div className="mt-6 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-start justify-between gap-4 text-sm">
              <div>
                <p className="font-medium text-black">{product.name}</p>
                <p className="text-gray-500">
                  {quantity} × {formatPrice(product.price)} / {product.unit}
                </p>
              </div>
              <p className="font-semibold text-black">{formatPrice(product.price * quantity)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 border-t border-gray-200 pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Mezisoučet</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Doprava</span>
            <span className="font-semibold">Vlastní rozvoz</span>
          </div>
          <div className="flex items-center justify-between text-base">
            <span className="font-medium text-gray-700">Celková cena</span>
            <span className="font-display text-2xl font-bold">{formatPrice(subtotal)}</span>
          </div>
        </div>

        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          Cena je orientační – konečná cena odpovídá skutečné hmotnosti.
        </p>

        {subtotal < minOrderAmount && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            Minimální hodnota objednávky je {formatPrice(minOrderAmount)}. Přidejte ještě pár položek a objednávku půjde pohodlně odeslat.
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={!checkoutAllowed || submitting}
          className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
        >
          {submitting ? "Odesílám objednávku..." : "Odeslat objednávku"}
        </button>
      </aside>
    </form>
  );
}
