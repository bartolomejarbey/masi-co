"use server";

import { getAdminSupabase } from "./supabase-admin";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const PRODUCT_BUCKET = "products";
const CATEGORY_BUCKET = "categories";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function getPublicUrl(bucket: string, path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export async function uploadProductImage(
  fileBuffer: ArrayBuffer,
  fileName: string,
  contentType: string,
  productSlug: string,
): Promise<string> {
  if (fileBuffer.byteLength > MAX_FILE_SIZE) {
    throw new Error("Soubor je příliš velký (max 5 MB).");
  }

  const timestamp = Date.now();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${productSlug}/${timestamp}-${safeName}`;

  const supabase = getAdminSupabase();
  const { error } = await supabase.storage
    .from(PRODUCT_BUCKET)
    .upload(path, fileBuffer, { contentType, upsert: false });

  if (error) throw new Error(`Upload selhal: ${error.message}`);

  return getPublicUrl(PRODUCT_BUCKET, path);
}

export async function uploadCategoryImage(
  fileBuffer: ArrayBuffer,
  fileName: string,
  contentType: string,
  categorySlug: string,
): Promise<string> {
  if (fileBuffer.byteLength > MAX_FILE_SIZE) {
    throw new Error("Soubor je příliš velký (max 5 MB).");
  }

  const timestamp = Date.now();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${categorySlug}/${timestamp}-${safeName}`;

  const supabase = getAdminSupabase();
  const { error } = await supabase.storage
    .from(CATEGORY_BUCKET)
    .upload(path, fileBuffer, { contentType, upsert: false });

  if (error) throw new Error(`Upload selhal: ${error.message}`);

  return getPublicUrl(CATEGORY_BUCKET, path);
}

export async function deleteStorageFile(publicUrl: string): Promise<void> {
  if (!publicUrl || !publicUrl.includes("/storage/v1/object/public/")) return;

  const match = publicUrl.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (!match) return;

  const [, bucket, path] = match;
  const supabase = getAdminSupabase();
  await supabase.storage.from(bucket).remove([path]);
}
