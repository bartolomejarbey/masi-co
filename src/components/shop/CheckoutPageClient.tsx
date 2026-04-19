"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/utils";
import {
  Banknote,
  CreditCard,
  Building2,
  UtensilsCrossed,
  Truck,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

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

type FieldErrors = Partial<Record<keyof FormState, string>>;

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

const paymentOptions = [
  {
    value: "cash_on_delivery" as const,
    label: "Dobírka",
    desc: "Platba hotově při převzetí",
    icon: Banknote,
  },
  {
    value: "online_card" as const,
    label: "Online kartou",
    desc: "Bezpečná platba přes Comgate",
    icon: CreditCard,
  },
  {
    value: "bank_transfer" as const,
    label: "Převodem",
    desc: "QR kód pro rychlou platbu",
    icon: Building2,
  },
  {
    value: "meal_vouchers" as const,
    label: "Stravenky",
    desc: "Edenred, Sodexo a další",
    icon: UtensilsCrossed,
  },
];

function validateForm(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!form.first_name.trim()) errors.first_name = "Vyplňte jméno";
  if (!form.last_name.trim()) errors.last_name = "Vyplňte příjmení";

  if (!form.email.trim()) {
    errors.email = "Vyplňte e-mail";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Neplatný formát e-mailu";
  }

  if (!form.phone.trim()) {
    errors.phone = "Vyplňte telefon";
  } else if (!/^(\+420\s?)?\d[\d\s]{7,}$/.test(form.phone.replace(/\s/g, " ").trim())) {
    errors.phone = "Neplatný formát telefonu";
  }

  if (!form.shipping_street.trim()) errors.shipping_street = "Vyplňte ulici a číslo";
  if (!form.shipping_city.trim()) errors.shipping_city = "Vyplňte město";
  if (!form.shipping_zip.trim()) {
    errors.shipping_zip = "Vyplňte PSČ";
  } else if (!/^\d{3}\s?\d{2}$/.test(form.shipping_zip.trim())) {
    errors.shipping_zip = "PSČ musí mít 5 číslic";
  }

  if (!form.termsAccepted) errors.termsAccepted = "Musíte souhlasit s podmínkami";

  return errors;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";
const inputErrorClass =
  "w-full rounded-lg border border-red-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100";

export function CheckoutPageClient({ minOrderAmount }: CheckoutPageClientProps) {
  const router = useRouter();
  const { items, clearCart, getTotal } = useCart();
  const [form, setForm] = useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = getTotal();
  const belowMin = items.length > 0 && subtotal < minOrderAmount;

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Prosím opravte zvýrazněná pole.");
      return;
    }

    if (items.length === 0 || belowMin) {
      setError(
        "Objednávku zatím nelze odeslat. Zkontrolujte minimální hodnotu."
      );
      return;
    }

    setSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        throw new Error(
          payload.error || "Objednávku se nepodařilo uložit."
        );
      }

      clearCart();

      if (payload.redirectUrl) {
        window.location.href = payload.redirectUrl;
        return;
      }

      const params = new URLSearchParams({ order: payload.orderNumber });
      if (payload.qrCodeUrl) {
        params.set("qr", payload.qrCodeUrl);
      }
      router.push(`/pokladna/potvrzeni?${params.toString()}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Objednávku se nepodařilo uložit."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
        <h2 className="font-display text-2xl font-bold">
          V pokladně zatím nic není
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
          Nejprve vložte produkty do košíku a poté dokončete objednávku.
        </p>
        <Link
          href="/sortiment"
          className="mt-6 inline-flex rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary"
        >
          Zpět do katalogu
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"
    >
      <div className="space-y-6">
        {/* Contact */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-display text-xl font-bold">Kontaktní údaje</h2>
          <p className="mt-1 text-sm text-gray-500">
            Na tyto údaje vám pošleme potvrzení objednávky.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium text-gray-700">
              <span>
                Jméno <span className="text-red-500">*</span>
              </span>
              <input
                value={form.first_name}
                onChange={(e) => updateField("first_name", e.target.value)}
                className={fieldErrors.first_name ? inputErrorClass : inputClass}
              />
              {fieldErrors.first_name && (
                <p className="text-xs text-red-500">{fieldErrors.first_name}</p>
              )}
            </label>
            <label className="space-y-1.5 text-sm font-medium text-gray-700">
              <span>
                Příjmení <span className="text-red-500">*</span>
              </span>
              <input
                value={form.last_name}
                onChange={(e) => updateField("last_name", e.target.value)}
                className={fieldErrors.last_name ? inputErrorClass : inputClass}
              />
              {fieldErrors.last_name && (
                <p className="text-xs text-red-500">{fieldErrors.last_name}</p>
              )}
            </label>
            <label className="space-y-1.5 text-sm font-medium text-gray-700">
              <span>
                E-mail <span className="text-red-500">*</span>
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="vas@email.cz"
                className={fieldErrors.email ? inputErrorClass : inputClass}
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </label>
            <label className="space-y-1.5 text-sm font-medium text-gray-700">
              <span>
                Telefon <span className="text-red-500">*</span>
              </span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+420 xxx xxx xxx"
                className={fieldErrors.phone ? inputErrorClass : inputClass}
              />
              {fieldErrors.phone && (
                <p className="text-xs text-red-500">{fieldErrors.phone}</p>
              )}
            </label>
          </div>
        </section>

        {/* Shipping */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-display text-xl font-bold">Adresa doručení</h2>
          <p className="mt-1 text-sm text-gray-500">
            Rozvážíme vlastním chlazeným vozem po Praze a okolí.
          </p>

          <div className="mt-5 grid gap-4">
            <label className="space-y-1.5 text-sm font-medium text-gray-700">
              <span>
                Ulice a číslo popisné <span className="text-red-500">*</span>
              </span>
              <input
                value={form.shipping_street}
                onChange={(e) =>
                  updateField("shipping_street", e.target.value)
                }
                className={
                  fieldErrors.shipping_street ? inputErrorClass : inputClass
                }
              />
              {fieldErrors.shipping_street && (
                <p className="text-xs text-red-500">
                  {fieldErrors.shipping_street}
                </p>
              )}
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm font-medium text-gray-700">
                <span>
                  Město <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.shipping_city}
                  onChange={(e) =>
                    updateField("shipping_city", e.target.value)
                  }
                  className={
                    fieldErrors.shipping_city ? inputErrorClass : inputClass
                  }
                />
                {fieldErrors.shipping_city && (
                  <p className="text-xs text-red-500">
                    {fieldErrors.shipping_city}
                  </p>
                )}
              </label>
              <label className="space-y-1.5 text-sm font-medium text-gray-700">
                <span>
                  PSČ <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.shipping_zip}
                  onChange={(e) =>
                    updateField("shipping_zip", e.target.value)
                  }
                  placeholder="100 00"
                  className={
                    fieldErrors.shipping_zip ? inputErrorClass : inputClass
                  }
                />
                {fieldErrors.shipping_zip && (
                  <p className="text-xs text-red-500">
                    {fieldErrors.shipping_zip}
                  </p>
                )}
              </label>
            </div>
          </div>

          <label className="mt-5 flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.is_company}
              onChange={(e) => updateField("is_company", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>Nakupuji na firmu</span>
          </label>

          {form.is_company && (
            <div className="mt-4 grid gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:grid-cols-3">
              <label className="space-y-1.5 text-sm font-medium text-gray-700 sm:col-span-3">
                <span>Název firmy</span>
                <input
                  value={form.billing_company_name}
                  onChange={(e) =>
                    updateField("billing_company_name", e.target.value)
                  }
                  className={inputClass}
                />
              </label>
              <label className="space-y-1.5 text-sm font-medium text-gray-700">
                <span>IČO</span>
                <input
                  value={form.billing_ico}
                  onChange={(e) => updateField("billing_ico", e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="space-y-1.5 text-sm font-medium text-gray-700">
                <span>DIČ</span>
                <input
                  value={form.billing_dic}
                  onChange={(e) => updateField("billing_dic", e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
          )}
        </section>

        {/* Payment */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-display text-xl font-bold">Doprava a platba</h2>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <Truck size={20} className="shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-black">Vlastní rozvoz</p>
              <p className="text-xs text-gray-500">
                Doručíme chlazeným vozem po Praze a okolí
              </p>
            </div>
            <span className="ml-auto text-sm font-semibold text-green-600">
              Zdarma
            </span>
          </div>

          <fieldset className="mt-5">
            <legend className="text-sm font-medium text-gray-700">
              Způsob platby
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                const selected = form.payment_method === option.value;
                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition ${
                      selected
                        ? "border-primary bg-red-50 ring-1 ring-primary/20"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      className="sr-only"
                      checked={selected}
                      onChange={() => updateField("payment_method", option.value)}
                    />
                    <Icon
                      size={20}
                      className={`mt-0.5 shrink-0 ${
                        selected ? "text-primary" : "text-gray-400"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          selected ? "text-primary" : "text-gray-900"
                        }`}
                      >
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500">{option.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label className="mt-5 block space-y-1.5 text-sm font-medium text-gray-700">
            <span>Poznámka k objednávce</span>
            <textarea
              rows={3}
              value={form.note}
              onChange={(e) => updateField("note", e.target.value)}
              placeholder="Speciální požadavky, čas doručení apod."
              className={inputClass}
            />
          </label>

          <label className="mt-5 flex items-start gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.termsAccepted}
              onChange={(e) => updateField("termsAccepted", e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>
              Souhlasím s{" "}
              <Link
                href="/obchodni-podminky"
                target="_blank"
                className="text-primary underline"
              >
                obchodními podmínkami
              </Link>{" "}
              a beru na vědomí, že výsledná cena se může upravit podle skutečné
              navážené hmotnosti.{" "}
              <span className="text-red-500">*</span>
            </span>
          </label>
          {fieldErrors.termsAccepted && (
            <p className="mt-1 ml-7 text-xs text-red-500">
              {fieldErrors.termsAccepted}
            </p>
          )}
        </section>

        <Link
          href="/kosik"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
        >
          <ArrowLeft size={14} />
          Zpět do košíku
        </Link>
      </div>

      {/* Sticky summary sidebar */}
      <aside className="lg:sticky lg:top-28 h-fit rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="font-display text-xl font-bold">Shrnutí objednávky</h2>

        <div className="mt-5 space-y-3">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex items-start justify-between gap-3 text-sm"
            >
              <div>
                <p className="font-medium text-black">{product.name}</p>
                <p className="text-xs text-gray-500">
                  {quantity} × {formatPrice(product.price)} / {product.unit}
                </p>
              </div>
              <p className="shrink-0 font-semibold text-black">
                {formatPrice(product.price * quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Mezisoučet</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Doprava</span>
            <span className="text-sm font-medium text-green-600">Zdarma</span>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="text-base font-medium text-gray-700">Celkem</span>
            <span className="font-display text-2xl font-bold text-primary">
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>

        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
          Cena je orientační — konečná cena odpovídá skutečné navážené hmotnosti.
        </p>

        {belowMin && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
            Minimální objednávka je {formatPrice(minOrderAmount)}.
          </p>
        )}

        {error && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={belowMin || submitting}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
        >
          <ShieldCheck size={16} />
          {submitting ? "Odesílám objednávku..." : "Odeslat objednávku"}
        </button>
      </aside>
    </form>
  );
}
