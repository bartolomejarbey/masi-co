"use client";

import { useState } from "react";
import type { SiteSetting } from "@/lib/types";

type Props = {
  settings: SiteSetting[];
  updateAction: (formData: FormData) => Promise<void>;
};

type SettingConfig = {
  key: string;
  label: string;
  fields: { name: string; label: string; type: "text" | "number" | "textarea" }[];
};

const settingConfigs: SettingConfig[] = [
  {
    key: "min_order_amount",
    label: "Minimální objednávka",
    fields: [{ name: "value", label: "Částka (Kč)", type: "number" }],
  },
  {
    key: "free_shipping_from",
    label: "Doprava zdarma od",
    fields: [{ name: "value", label: "Částka (Kč, 0 = vždy zdarma)", type: "number" }],
  },
  {
    key: "delivery_areas",
    label: "Oblasti rozvozu",
    fields: [{ name: "areas", label: "Oblasti (oddělené čárkou)", type: "textarea" }],
  },
  {
    key: "store_address",
    label: "Adresa prodejny",
    fields: [
      { name: "company", label: "Firma", type: "text" },
      { name: "street", label: "Ulice", type: "text" },
      { name: "zip", label: "PSČ", type: "text" },
      { name: "city", label: "Město", type: "text" },
      { name: "region", label: "Region", type: "text" },
    ],
  },
  {
    key: "contact",
    label: "Kontakt",
    fields: [
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Telefon", type: "text" },
    ],
  },
  {
    key: "social_links",
    label: "Sociální sítě",
    fields: [
      { name: "facebook", label: "Facebook URL", type: "text" },
      { name: "instagram", label: "Instagram URL", type: "text" },
      { name: "tiktok", label: "TikTok URL", type: "text" },
      { name: "website", label: "Web URL", type: "text" },
    ],
  },
  {
    key: "order_cutoff_time",
    label: "Uzávěrka objednávek",
    fields: [
      { name: "hour", label: "Hodina uzávěrky", type: "number" },
      { name: "note", label: "Poznámka", type: "text" },
    ],
  },
];

export function SettingsClient({ settings, updateAction }: Props) {
  const [saved, setSaved] = useState<string | null>(null);

  const settingMap: Record<string, unknown> = {};
  for (const s of settings) settingMap[s.key] = s.value;

  const getFieldValue = (key: string, fieldName: string): string => {
    const val = settingMap[key] as Record<string, unknown> | undefined;
    if (!val) return "";
    if (fieldName === "areas" && Array.isArray(val.areas)) {
      return (val.areas as string[]).join(", ");
    }
    return String(val[fieldName] ?? "");
  };

  const handleSubmit = async (key: string, formData: FormData) => {
    const config = settingConfigs.find((c) => c.key === key)!;
    const valueObj: Record<string, unknown> = {};

    for (const field of config.fields) {
      const raw = formData.get(field.name);
      if (field.name === "areas") {
        valueObj.areas = String(raw ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      } else if (field.type === "number") {
        valueObj[field.name] = parseFloat(String(raw ?? "0"));
      } else {
        valueObj[field.name] = String(raw ?? "");
      }
    }

    const submitData = new FormData();
    submitData.set("key", key);
    submitData.set("value", JSON.stringify(valueObj));
    await updateAction(submitData);
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display text-2xl font-bold text-gray-900">Nastavení</h1>
      <p className="mt-1 text-sm text-gray-500">Konfigurace e-shopu MASI-CO</p>

      <div className="mt-6 space-y-6">
        {settingConfigs.map((config) => (
          <div key={config.key} className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-display text-lg font-bold">{config.label}</h2>
            <form
              action={(fd) => handleSubmit(config.key, fd)}
              className="mt-4 space-y-3"
            >
              {config.fields.map((field) => (
                <div key={field.name}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      rows={2}
                      defaultValue={getFieldValue(config.key, field.name)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  ) : (
                    <input
                      name={field.name}
                      type={field.type}
                      defaultValue={getFieldValue(config.key, field.name)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  )}
                </div>
              ))}
              <div className="flex items-center gap-3">
                <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary">
                  Uložit
                </button>
                {saved === config.key && (
                  <span className="text-sm text-green-600">Uloženo ✓</span>
                )}
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
