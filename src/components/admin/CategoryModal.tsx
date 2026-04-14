"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Category } from "@/lib/types";
import { uploadCategoryImage } from "@/lib/storage";

type Props = {
  category?: Category | null;
  parentCategories: Category[];
  onClose: () => void;
  action: (formData: FormData) => Promise<void>;
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CategoryModal({ category, parentCategories, onClose, action }: Props) {
  const slugRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(category?.image_url ?? null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (slugRef.current && !category) {
      slugRef.current.value = generateSlug(e.target.value);
    }
  };

  const getSlug = (): string => {
    if (slugRef.current?.value) return slugRef.current.value;
    if (category?.slug) return category.slug;
    return "category";
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const buffer = await file.arrayBuffer();
      const url = await uploadCategoryImage(buffer, file.name, file.type, getSlug());
      setImageUrl(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload selhal");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (imageUrl) formData.set("image_url", imageUrl);
    await action(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">
            {category ? "Upravit kategorii" : "Nová kategorie"}
          </h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-black">&times;</button>
        </div>

        <form action={handleSubmit} className="mt-6 space-y-4">
          {category && <input type="hidden" name="id" value={category.id} />}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Název *</label>
            <input
              name="name"
              required
              defaultValue={category?.name ?? ""}
              onChange={handleNameChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Slug</label>
            <input
              name="slug"
              ref={slugRef}
              defaultValue={category?.slug ?? ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Popis</label>
            <textarea
              name="description"
              rows={2}
              defaultValue={category?.description ?? ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
            />
          </div>

          {/* Fotka kategorie */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Fotka kategorie</label>
            <div className="flex items-start gap-4">
              {imageUrl ? (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                  <Image src={imageUrl} alt="Fotka kategorie" fill className="object-cover" sizes="96px" />
                  <button
                    type="button"
                    onClick={() => setImageUrl(null)}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white hover:bg-red-600"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-xs text-gray-400">
                  Žádná
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
                />
                <p className="mt-1 text-xs text-gray-400">Max 5 MB, JPG/PNG/WebP</p>
              </div>
            </div>
            {uploadError && <p className="mt-1 text-sm text-red-600">{uploadError}</p>}
            {uploading && <p className="mt-1 text-sm text-gray-500">Nahrávám...</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nadřazená kategorie</label>
              <select
                name="parent_id"
                defaultValue={category?.parent_id ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
              >
                <option value="">Žádná (hlavní kategorie)</option>
                {parentCategories
                  .filter((c) => c.id !== category?.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Pořadí</label>
              <input
                name="sort_order"
                type="number"
                defaultValue={category?.sort_order ?? 0}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={category?.is_active ?? true}
              className="h-4 w-4 rounded border-gray-300 text-[#CC1939] focus:ring-[#CC1939]"
            />
            Aktivní
          </label>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
              Zrušit
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-[#CC1939] px-6 py-2 text-sm font-medium text-white hover:bg-[#a81430] disabled:opacity-50"
            >
              {category ? "Uložit změny" : "Vytvořit kategorii"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
