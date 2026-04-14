"use client";

import type { NewsletterSubscriber } from "@/lib/types";

type Props = {
  subscribers: NewsletterSubscriber[];
  toggleAction: (formData: FormData) => Promise<void>;
};

export function NewsletterClient({ subscribers, toggleAction }: Props) {
  const exportCSV = () => {
    const header = "Email,Datum přihlášení,Aktivní\n";
    const rows = subscribers.map((s) =>
      `${s.email},${new Date(s.subscribed_at).toLocaleDateString("cs-CZ")},${s.is_active ? "Ano" : "Ne"}`
    ).join("\n");

    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Newsletter</h1>
          <p className="mt-1 text-sm text-gray-500">
            Celkem {subscribers.length} odběratelů, {subscribers.filter((s) => s.is_active).length} aktivních
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
        >
          Exportovat CSV
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Datum přihlášení</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Stav</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Akce</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  Žádní odběratelé
                </td>
              </tr>
            )}
            {subscribers.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{sub.email}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(sub.subscribed_at).toLocaleDateString("cs-CZ")}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    sub.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {sub.is_active ? "Aktivní" : "Odhlášen"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <form action={toggleAction}>
                    <input type="hidden" name="id" value={sub.id} />
                    <input type="hidden" name="is_active" value={String(sub.is_active)} />
                    <button type="submit" className="text-sm font-medium text-[#CC1939] hover:underline">
                      {sub.is_active ? "Deaktivovat" : "Aktivovat"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
