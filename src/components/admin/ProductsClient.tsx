"use client";

import { useState } from "react";
import { ProductModal } from "./ProductModal";
import { formatPrice } from "@/lib/utils";
import { Search, ImageOff } from "lucide-react";
import type { Product, Category } from "@/lib/types";

type Props = {
  products: Product[];
  categories: Category[];
  createAction: (formData: FormData) => Promise<void>;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  bulkStockAction: (formData: FormData) => Promise<void>;
};

const stockLabels: Record<string, string> = {
  in_stock: "Skladem",
  out_of_stock: "Vyprodáno",
  on_order: "Na objednávku",
};

const stockColors: Record<string, string> = {
  in_stock: "bg-green-100 text-green-700",
  out_of_stock: "bg-red-100 text-red-700",
  on_order: "bg-yellow-100 text-yellow-700",
};

export function ProductsClient({ products, categories, createAction, updateAction, deleteAction, bulkStockAction }: Props) {
  const [modal, setModal] = useState<"create" | Product | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filterCat, setFilterCat] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [search, setSearch] = useState("");

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const stockCounts = {
    all: products.length,
    in_stock: products.filter((p) => p.stock_status === "in_stock").length,
    out_of_stock: products.filter((p) => p.stock_status === "out_of_stock").length,
    on_order: products.filter((p) => p.stock_status === "on_order").length,
  };

  const filtered = products.filter((p) => {
    if (filterCat && p.category_id !== filterCat) return false;
    if (filterStock && p.stock_status !== filterStock) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p.id)));
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Produkty</h1>
          <p className="mt-1 text-sm text-gray-500">Celkem {products.length} produktů</p>
        </div>
        <button
          onClick={() => setModal("create")}
          className="rounded-lg bg-[#CC1939] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#a81430]"
        >
          + Přidat produkt
        </button>
      </div>

      {/* Search */}
      <div className="relative mt-4 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Hledat produkt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-[#CC1939] focus:outline-none"
        />
      </div>

      {/* Quick stock filter buttons */}
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          { key: "", label: "Vše", count: stockCounts.all },
          { key: "in_stock", label: "Skladem", count: stockCounts.in_stock },
          { key: "out_of_stock", label: "Vyprodáno", count: stockCounts.out_of_stock },
          { key: "on_order", label: "Na obj.", count: stockCounts.on_order },
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilterStock(btn.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filterStock === btn.key
                ? "bg-[#CC1939] text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:border-[#CC1939] hover:text-[#CC1939]"
            }`}
          >
            {btn.label} ({btn.count})
          </button>
        ))}
      </div>

      {/* Category filter + bulk actions */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
        >
          <option value="">Všechny kategorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.parent_id ? "  └ " : ""}{c.name}
            </option>
          ))}
        </select>

        {selected.size > 0 && (
          <form action={bulkStockAction} className="flex items-center gap-2">
            <input type="hidden" name="ids" value={Array.from(selected).join(",")} />
            <select name="stock_status" className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="in_stock">Skladem</option>
              <option value="out_of_stock">Vyprodáno</option>
              <option value="on_order">Na objednávku</option>
            </select>
            <button type="submit" className="rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-[#CC1939]">
              Změnit ({selected.size})
            </button>
          </form>
        )}
      </div>

      {/* Tabulka */}
      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Název</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Kategorie</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Cena</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Jednotka</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Sklad</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Aktivní</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    Žádné produkty
                  </td>
                </tr>
              )}
              {filtered.map((product) => (
                <tr key={product.id} className={`hover:bg-gray-50 ${product.stock_status === "out_of_stock" ? "bg-red-50/50" : ""}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.name}</span>
                      {!product.image_url && (
                        <ImageOff size={14} className="text-gray-300" />
                      )}
                    </div>
                    {product.badge && (
                      <span className="mt-0.5 inline-block rounded bg-[#CC1939] px-1.5 py-0.5 text-xs text-white">
                        {product.badge}
                      </span>
                    )}
                    {product.is_featured && (
                      <span className="ml-1 mt-0.5 inline-block rounded bg-yellow-100 px-1.5 py-0.5 text-xs text-yellow-700">
                        Doporučený
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{catMap[product.category_id] ?? "—"}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">{product.unit}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${stockColors[product.stock_status] ?? ""}`}>
                      {stockLabels[product.stock_status] ?? product.stock_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {product.is_active ? (
                      <span className="text-green-600">Ano</span>
                    ) : (
                      <span className="text-red-500">Ne</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModal(product)}
                        className="text-sm font-medium text-[#CC1939] hover:underline"
                      >
                        Upravit
                      </button>
                      <form
                        action={deleteAction}
                        onSubmit={(e) => {
                          if (!confirm(`Opravdu smazat "${product.name}"?`)) e.preventDefault();
                        }}
                      >
                        <input type="hidden" name="id" value={product.id} />
                        <button type="submit" className="text-sm text-red-500 hover:underline">
                          Smazat
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <ProductModal
          product={modal === "create" ? null : modal}
          categories={categories}
          onClose={() => setModal(null)}
          action={modal === "create" ? createAction : updateAction}
        />
      )}
    </div>
  );
}
