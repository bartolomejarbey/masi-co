"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Product, Category } from "@/lib/types";
import { uploadProductImage } from "@/lib/storage";

type Props = {
  product?: Product | null;
  categories: Category[];
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

export function ProductModal({ product, categories, onClose, action }: Props) {
  const slugRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(product?.image_url ?? null);
  const [gallery, setGallery] = useState<string[]>(product?.gallery ?? []);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (slugRef.current && !product) {
      slugRef.current.value = generateSlug(e.target.value);
    }
  };

  const getSlug = (): string => {
    if (slugRef.current?.value) return slugRef.current.value;
    if (product?.slug) return product.slug;
    return "product";
  };

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const buffer = await file.arrayBuffer();
      const url = await uploadProductImage(buffer, file.name, file.type, getSlug());
      setImageUrl(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload selhal");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadError(null);
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const buffer = await file.arrayBuffer();
        const url = await uploadProductImage(buffer, file.name, file.type, getSlug());
        newUrls.push(url);
      }
      setGallery((prev) => [...prev, ...newUrls]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload selhal");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (formData: FormData) => {
    if (imageUrl) formData.set("image_url", imageUrl);
    if (gallery.length > 0) formData.set("gallery", JSON.stringify(gallery));
    await action(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">
            {product ? "Upravit produkt" : "Nový produkt"}
          </h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-black">&times;</button>
        </div>

        <form action={handleSubmit} className="mt-6 space-y-4">
          {product && <input type="hidden" name="id" value={product.id} />}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Název *</label>
              <input
                name="name"
                required
                defaultValue={product?.name ?? ""}
                onChange={handleNameChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Slug</label>
              <input
                name="slug"
                ref={slugRef}
                defaultValue={product?.slug ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Popis</label>
            <textarea
              name="description"
              rows={2}
              defaultValue={product?.description ?? ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Kategorie *</label>
              <select
                name="category_id"
                required
                defaultValue={product?.category_id ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
              >
                <option value="">Vyberte kategorii</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.parent_id ? "  └ " : ""}{cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Cena (Kč) *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                required
                defaultValue={product?.price ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Jednotka</label>
              <select
                name="unit"
                defaultValue={product?.unit ?? "kg"}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
              >
                <option value="kg">kg</option>
                <option value="ks">ks</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Stav skladu</label>
              <select
                name="stock_status"
                defaultValue={product?.stock_status ?? "in_stock"}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
              >
                <option value="in_stock">Skladem</option>
                <option value="out_of_stock">Vyprodáno</option>
                <option value="on_order">Na objednávku</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Hmotnost/info</label>
              <input
                name="weight_info"
                defaultValue={product?.weight_info ?? ""}
                placeholder="např. 900ml"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Badge</label>
              <input
                name="badge"
                defaultValue={product?.badge ?? ""}
                placeholder="např. Top, Novinka"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CC1939] focus:outline-none"
              />
            </div>
            <div className="flex items-end gap-6 pb-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="is_featured"
                  defaultChecked={product?.is_featured ?? false}
                  className="h-4 w-4 rounded border-gray-300 text-[#CC1939] focus:ring-[#CC1939]"
                />
                Doporučený
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={product?.is_active ?? true}
                  className="h-4 w-4 rounded border-gray-300 text-[#CC1939] focus:ring-[#CC1939]"
                />
                Aktivní
              </label>
            </div>
          </div>

          {/* Hlavní fotka */}
          <div className="border-t border-gray-200 pt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">Hlavní fotka</label>
            <div className="flex items-start gap-4">
              {imageUrl ? (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                  <Image src={imageUrl} alt="Hlavní fotka" fill className="object-cover" sizes="96px" />
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
                  onChange={handleMainImageChange}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
                />
                <p className="mt-1 text-xs text-gray-400">Max 5 MB, JPG/PNG/WebP</p>
              </div>
            </div>
          </div>

          {/* Galerie */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Galerie</label>
            {gallery.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {gallery.map((url, i) => (
                  <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                    <Image src={url} alt={`Galerie ${i + 1}`} fill className="object-cover" sizes="80px" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white hover:bg-red-600"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryChange}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
            />
          </div>

          {uploadError && (
            <p className="text-sm text-red-600">{uploadError}</p>
          )}

          {uploading && (
            <p className="text-sm text-gray-500">Nahrávám fotky...</p>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
              Zrušit
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-[#CC1939] px-6 py-2 text-sm font-medium text-white hover:bg-[#a81430] disabled:opacity-50"
            >
              {product ? "Uložit změny" : "Vytvořit produkt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
