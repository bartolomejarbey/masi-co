"use server";

import { revalidatePath } from "next/cache";
import { getAdminSupabase } from "./supabase-admin";
import type { Order, OrderItem } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function admin(): any {
  return getAdminSupabase();
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── PRODUCTS ──

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") || "");
  const slug = formData.get("slug") ? String(formData.get("slug")) : generateSlug(name);
  const description = formData.get("description") ? String(formData.get("description")) : null;
  const category_id = String(formData.get("category_id") || "");
  const price = parseFloat(String(formData.get("price") || "0"));
  const unit = String(formData.get("unit") || "kg");
  const weight_info = formData.get("weight_info") ? String(formData.get("weight_info")) : null;
  const stock_status = String(formData.get("stock_status") || "in_stock");
  const badge = formData.get("badge") ? String(formData.get("badge")) : null;
  const is_featured = formData.get("is_featured") === "on";
  const is_active = formData.get("is_active") !== "off";

  const image_url = formData.get("image_url") ? String(formData.get("image_url")) : null;
  const galleryRaw = formData.get("gallery") ? String(formData.get("gallery")) : null;
  const gallery = galleryRaw ? JSON.parse(galleryRaw) as string[] : null;

  const { error } = await admin().from("products").insert({
    name, slug, description, category_id, price, unit, weight_info,
    stock_status, badge, is_featured, is_active, sort_order: 0,
    image_url, gallery,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/produkty");
  revalidatePath("/");
}

export async function updateProduct(formData: FormData) {
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "");
  const slug = formData.get("slug") ? String(formData.get("slug")) : generateSlug(name);
  const description = formData.get("description") ? String(formData.get("description")) : null;
  const category_id = String(formData.get("category_id") || "");
  const price = parseFloat(String(formData.get("price") || "0"));
  const unit = String(formData.get("unit") || "kg");
  const weight_info = formData.get("weight_info") ? String(formData.get("weight_info")) : null;
  const stock_status = String(formData.get("stock_status") || "in_stock");
  const badge = formData.get("badge") ? String(formData.get("badge")) : null;
  const is_featured = formData.get("is_featured") === "on";
  const is_active = formData.get("is_active") !== "off";

  const image_url = formData.get("image_url") ? String(formData.get("image_url")) : null;
  const galleryRaw = formData.get("gallery") ? String(formData.get("gallery")) : null;
  const gallery = galleryRaw ? JSON.parse(galleryRaw) as string[] : null;

  const { error } = await admin().from("products").update({
    name, slug, description, category_id, price, unit, weight_info,
    stock_status, badge, is_featured, is_active,
    image_url, gallery,
  }).eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/produkty");
  revalidatePath("/");
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") || "");
  const { error } = await admin().from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/produkty");
  revalidatePath("/");
}

export async function bulkUpdateStockStatus(formData: FormData) {
  const ids = String(formData.get("ids") || "").split(",").filter(Boolean);
  const stock_status = String(formData.get("stock_status") || "in_stock");
  if (ids.length === 0) return;

  const { error } = await admin().from("products").update({ stock_status }).in("id", ids);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/produkty");
  revalidatePath("/");
}

// ── CATEGORIES ──

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") || "");
  const slug = formData.get("slug") ? String(formData.get("slug")) : generateSlug(name);
  const description = formData.get("description") ? String(formData.get("description")) : null;
  const parent_id = formData.get("parent_id") ? String(formData.get("parent_id")) : null;
  const sort_order = parseInt(String(formData.get("sort_order") || "0"), 10);
  const is_active = formData.get("is_active") !== "off";

  const image_url = formData.get("image_url") ? String(formData.get("image_url")) : null;

  const { error } = await admin().from("categories").insert({
    name, slug, description, parent_id, sort_order, is_active, image_url,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/kategorie");
  revalidatePath("/");
}

export async function updateCategory(formData: FormData) {
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "");
  const slug = formData.get("slug") ? String(formData.get("slug")) : generateSlug(name);
  const description = formData.get("description") ? String(formData.get("description")) : null;
  const parent_id = formData.get("parent_id") ? String(formData.get("parent_id")) : null;
  const sort_order = parseInt(String(formData.get("sort_order") || "0"), 10);
  const is_active = formData.get("is_active") !== "off";

  const image_url = formData.get("image_url") ? String(formData.get("image_url")) : null;

  const { error } = await admin().from("categories").update({
    name, slug, description, parent_id, sort_order, is_active, image_url,
  }).eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/kategorie");
  revalidatePath("/");
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id") || "");
  const { error } = await admin().from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/kategorie");
  revalidatePath("/");
}

// ── ORDERS ──

export async function updateOrderStatus(formData: FormData) {
  const orderId = String(formData.get("orderId") || "");
  const status = String(formData.get("status") || "") as Order["order_status"];
  if (!orderId || !status) return;

  const { error } = await admin().from("orders").update({ order_status: status }).eq("id", orderId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/objednavky");
  revalidatePath(`/admin/objednavky/${orderId}`);
}

export async function updateOrderAdminNote(formData: FormData) {
  const orderId = String(formData.get("orderId") || "");
  const admin_note = String(formData.get("admin_note") || "");

  const { error } = await admin().from("orders").update({ admin_note }).eq("id", orderId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/objednavky/${orderId}`);
}

export async function updateOrderItemFinal(formData: FormData) {
  const itemId = String(formData.get("itemId") || "");
  const orderId = String(formData.get("orderId") || "");
  const final_total = parseFloat(String(formData.get("final_total") || "0"));

  const { error } = await admin().from("order_items").update({ final_total }).eq("id", itemId);
  if (error) throw new Error(error.message);

  // Recalculate order final_total
  const { data: items } = await admin().from("order_items").select("final_total, estimated_total").eq("order_id", orderId);
  if (items) {
    const orderFinalTotal = (items as Pick<OrderItem, "final_total" | "estimated_total">[]).reduce(
      (sum: number, item: Pick<OrderItem, "final_total" | "estimated_total">) => sum + (item.final_total ?? item.estimated_total), 0
    );
    await admin().from("orders").update({ final_total: orderFinalTotal }).eq("id", orderId);
  }

  revalidatePath(`/admin/objednavky/${orderId}`);
}

// ── SETTINGS ──

export async function updateSiteSetting(formData: FormData) {
  const key = String(formData.get("key") || "");
  const valueStr = String(formData.get("value") || "{}");

  let value: unknown;
  try {
    value = JSON.parse(valueStr);
  } catch {
    value = { value: valueStr };
  }

  const { error } = await admin().from("site_settings").upsert({ key, value });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/nastaveni");
}

// ── NEWSLETTER ──

export async function toggleNewsletterSubscriber(formData: FormData) {
  const id = String(formData.get("id") || "");
  const is_active = formData.get("is_active") === "true";

  const update: Record<string, unknown> = { is_active: !is_active };
  if (is_active) {
    update.unsubscribed_at = new Date().toISOString();
  } else {
    update.unsubscribed_at = null;
  }

  const { error } = await admin().from("newsletter_subscribers").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/newsletter");
}
