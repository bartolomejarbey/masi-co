import { getAdminSupabase } from "@/lib/supabase-admin";
import { createCategory, updateCategory, deleteCategory } from "@/lib/admin-actions";
import { CategoriesClient } from "@/components/admin/CategoriesClient";
import type { Category, Product } from "@/lib/types";

export default async function AdminCategoriesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = getAdminSupabase() as any;

  const [{ data: categories }, { data: products }] = await Promise.all([
    db.from("categories").select("*").order("sort_order"),
    db.from("products").select("id, category_id"),
  ]);

  const typedCategories = (categories ?? []) as Category[];
  const typedProducts = (products ?? []) as Pick<Product, "id" | "category_id">[];

  const productCounts: Record<string, number> = {};
  for (const p of typedProducts) {
    productCounts[p.category_id] = (productCounts[p.category_id] ?? 0) + 1;
  }

  return (
    <CategoriesClient
      categories={typedCategories}
      productCounts={productCounts}
      createAction={createCategory}
      updateAction={updateCategory}
      deleteAction={deleteCategory}
    />
  );
}
