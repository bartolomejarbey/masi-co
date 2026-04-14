import { getAdminSupabase } from "@/lib/supabase-admin";
import { createProduct, updateProduct, deleteProduct, bulkUpdateStockStatus } from "@/lib/admin-actions";
import { ProductsClient } from "@/components/admin/ProductsClient";
import type { Product, Category } from "@/lib/types";

export default async function AdminProductsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = getAdminSupabase() as any;

  const [{ data: products }, { data: categories }] = await Promise.all([
    db.from("products").select("*").order("sort_order"),
    db.from("categories").select("*").order("sort_order"),
  ]);

  return (
    <ProductsClient
      products={(products ?? []) as Product[]}
      categories={(categories ?? []) as Category[]}
      createAction={createProduct}
      updateAction={updateProduct}
      deleteAction={deleteProduct}
      bulkStockAction={bulkUpdateStockStatus}
    />
  );
}
