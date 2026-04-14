"use client";

import { useState } from "react";
import { CategoryModal } from "./CategoryModal";
import type { Category } from "@/lib/types";

type Props = {
  categories: Category[];
  productCounts: Record<string, number>;
  createAction: (formData: FormData) => Promise<void>;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
};

export function CategoriesClient({ categories, productCounts, createAction, updateAction, deleteAction }: Props) {
  const [modal, setModal] = useState<"create" | Category | null>(null);

  const mainCats = categories.filter((c) => !c.parent_id).sort((a, b) => a.sort_order - b.sort_order);
  const subCats = categories.filter((c) => c.parent_id);

  const getChildren = (parentId: string) =>
    subCats.filter((c) => c.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order);

  const parentCategories = categories.filter((c) => !c.parent_id);

  const renderRow = (cat: Category, indent = false) => (
    <tr key={cat.id} className="hover:bg-gray-50">
      <td className="px-4 py-3 font-medium">
        {indent && <span className="mr-2 text-gray-400">└</span>}
        {cat.name}
      </td>
      <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
      <td className="px-4 py-3 text-center">{productCounts[cat.id] ?? 0}</td>
      <td className="px-4 py-3 text-center">{cat.sort_order}</td>
      <td className="px-4 py-3">
        {cat.is_active ? (
          <span className="text-green-600">Ano</span>
        ) : (
          <span className="text-red-500">Ne</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={() => setModal(cat)} className="text-sm font-medium text-[#CC1939] hover:underline">
            Upravit
          </button>
          <form
            action={deleteAction}
            onSubmit={(e) => {
              if (!confirm(`Opravdu smazat kategorii "${cat.name}"?`)) e.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={cat.id} />
            <button type="submit" className="text-sm text-red-500 hover:underline">
              Smazat
            </button>
          </form>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Kategorie</h1>
          <p className="mt-1 text-sm text-gray-500">Celkem {categories.length} kategorií</p>
        </div>
        <button
          onClick={() => setModal("create")}
          className="rounded-lg bg-[#CC1939] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#a81430]"
        >
          + Přidat kategorii
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Název</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Slug</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">Produktů</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">Pořadí</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Aktivní</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Akce</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mainCats.map((cat) => (
              <>
                {renderRow(cat)}
                {getChildren(cat.id).map((child) => renderRow(child, true))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <CategoryModal
          category={modal === "create" ? null : modal}
          parentCategories={parentCategories}
          onClose={() => setModal(null)}
          action={modal === "create" ? createAction : updateAction}
        />
      )}
    </div>
  );
}
