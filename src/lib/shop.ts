import { supabase } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { User } from "@supabase/supabase-js";
import type { Category, CategoryWithChildren, Customer, CustomerAddress, Order, OrderItem, Product } from "@/lib/types";
import { getAdminSupabase, isAdminSupabaseConfigured } from "./supabase-admin";

export type ProductSort = "default" | "name" | "price_asc" | "price_desc";
export type AvailabilityFilter = "all" | "in_stock";
export type CustomerOrderWithItems = Order & { items: OrderItem[] };

type ProductFilters = {
  query?: string;
  sort?: ProductSort;
  availability?: AvailabilityFilter;
};

type ContactSettings = {
  email: string;
  phone: string;
  company: string;
  street: string;
  zip: string;
  city: string;
};

// The project uses hand-written Supabase types, so narrow local casts keep the data layer workable.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

function sortProducts(products: Product[], sort: ProductSort = "default") {
  const items = [...products];

  switch (sort) {
    case "name":
      return items.sort((a, b) => a.name.localeCompare(b.name, "cs"));
    case "price_asc":
      return items.sort((a, b) => a.price - b.price);
    case "price_desc":
      return items.sort((a, b) => b.price - a.price);
    default:
      return items.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name, "cs"));
  }
}

function filterProducts(products: Product[], availability: AvailabilityFilter = "all") {
  const activeProducts = products.filter((product) => product.is_active);

  if (availability === "in_stock") {
    return activeProducts.filter((product) => product.stock_status === "in_stock");
  }

  return activeProducts;
}

export function getStockLabel(stockStatus: Product["stock_status"]) {
  switch (stockStatus) {
    case "in_stock":
      return "Skladem";
    case "out_of_stock":
      return "Vyprodáno";
    case "on_order":
      return "Na objednávku";
    default:
      return "Dostupnost na dotaz";
  }
}

export async function fetchRootCategories() {
  const { data, error } = await db
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .is("parent_id", null)
    .order("sort_order");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

function splitUserName(fullName?: string | null) {
  if (!fullName) {
    return { firstName: null, lastName: null };
  }

  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: null };
  }

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.at(-1) ?? null,
  };
}

export async function getCurrentUser() {
  const supabaseServer = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  return user;
}

export async function ensureCustomerProfile(user: User, defaults?: Partial<Customer> & { address?: Partial<CustomerAddress> | null }) {
  if (!isAdminSupabaseConfigured()) {
    return;
  }

  const { firstName, lastName } = splitUserName(
    typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminSupabase = getAdminSupabase() as any;

  await adminSupabase.from("customers").upsert({
    id: user.id,
    email: user.email ?? defaults?.email ?? "",
    first_name: defaults?.first_name ?? firstName,
    last_name: defaults?.last_name ?? lastName,
    phone: defaults?.phone ?? null,
    company_name: defaults?.company_name ?? null,
    ico: defaults?.ico ?? null,
    dic: defaults?.dic ?? null,
    newsletter: defaults?.newsletter ?? false,
  });

  const address = defaults?.address;
  if (address?.street && address.city && address.zip) {
    const { data: existingAddresses } = await adminSupabase
      .from("customer_addresses")
      .select("id")
      .eq("customer_id", user.id)
      .eq("type", "shipping")
      .eq("is_default", true)
      .limit(1);

    const payload = {
      customer_id: user.id,
      type: "shipping",
      first_name: defaults?.first_name ?? firstName,
      last_name: defaults?.last_name ?? lastName,
      company_name: defaults?.company_name ?? null,
      street: address.street,
      city: address.city,
      zip: address.zip,
      phone: defaults?.phone ?? null,
      is_default: true,
    };

    if (existingAddresses?.[0]?.id) {
      await adminSupabase.from("customer_addresses").update(payload).eq("id", existingAddresses[0].id);
    } else {
      await adminSupabase.from("customer_addresses").insert(payload);
    }
  }
}

export async function getCustomerProfile(userId?: string) {
  const currentUserId = userId ?? (await getCurrentUser())?.id;

  if (!currentUserId) {
    return null;
  }

  const supabaseServer = createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serverDb = supabaseServer as any;

  const [{ data: customer, error: customerError }, { data: addresses, error: addressesError }] = await Promise.all([
    serverDb.from("customers").select("*").eq("id", currentUserId).maybeSingle(),
    serverDb
      .from("customer_addresses")
      .select("*")
      .eq("customer_id", currentUserId)
      .eq("type", "shipping")
      .order("is_default", { ascending: false })
      .limit(1),
  ]);

  if (customerError) {
    throw new Error(customerError.message);
  }

  if (addressesError) {
    throw new Error(addressesError.message);
  }

  return {
    customer: (customer as Customer | null) ?? null,
    address: ((addresses as CustomerAddress[] | null) ?? [])[0] ?? null,
  };
}

export async function getCustomerOrders(userId?: string): Promise<CustomerOrderWithItems[]> {
  const currentUserId = userId ?? (await getCurrentUser())?.id;

  if (!currentUserId) {
    return [];
  }

  const supabaseServer = createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serverDb = supabaseServer as any;

  const { data: orders, error: ordersError } = await serverDb
    .from("orders")
    .select("*")
    .eq("customer_id", currentUserId)
    .order("created_at", { ascending: false });

  if (ordersError) {
    throw new Error(ordersError.message);
  }

  const typedOrders = (orders ?? []) as Order[];
  if (typedOrders.length === 0) {
    return [];
  }

  const orderIds = typedOrders.map((order) => order.id);
  const { data: items, error: itemsError } = await serverDb
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  const itemsByOrderId = new Map<string, OrderItem[]>();
  ((items ?? []) as OrderItem[]).forEach((item) => {
    const current = itemsByOrderId.get(item.order_id) ?? [];
    current.push(item);
    itemsByOrderId.set(item.order_id, current);
  });

  return typedOrders.map((order) => ({
    ...order,
    items: itemsByOrderId.get(order.id) ?? [],
  }));
}

export async function fetchCategoryTree(): Promise<CategoryWithChildren[]> {
  const allCategories = (await fetchAllCategories()) as Category[];
  const roots: CategoryWithChildren[] = [];
  const childrenMap = new Map<string, Category[]>();

  for (const cat of allCategories) {
    if (cat.parent_id) {
      const siblings = childrenMap.get(cat.parent_id) ?? [];
      siblings.push(cat);
      childrenMap.set(cat.parent_id, siblings);
    }
  }

  for (const cat of allCategories) {
    if (!cat.parent_id) {
      roots.push({ ...cat, children: childrenMap.get(cat.id) ?? [] });
    }
  }

  return roots;
}

export async function fetchAllCategories() {
  const { data, error } = await db
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function fetchCategoryBySlug(slug: string) {
  const { data, error } = await db
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function fetchCategoriesByParent(parentId: string) {
  const { data, error } = await db
    .from("categories")
    .select("*")
    .eq("parent_id", parentId)
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function fetchAllProducts(filters: ProductFilters = {}) {
  const query = filters.query?.trim();
  const sort = filters.sort ?? "default";
  const availability = filters.availability ?? "all";

  if (query) {
    const { data, error } = await db.rpc("search_products", {
      search_query: query,
    });

    if (error) {
      throw new Error(error.message);
    }

    return sortProducts(filterProducts(data ?? [], availability), sort);
  }

  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    throw new Error(error.message);
  }

  return sortProducts(filterProducts(data ?? [], availability), sort);
}

export async function fetchProductsByCategoryIds(categoryIds: string[], filters: ProductFilters = {}) {
  if (categoryIds.length === 0) {
    return [];
  }

  const { data, error } = await db
    .from("products")
    .select("*")
    .in("category_id", categoryIds)
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    throw new Error(error.message);
  }

  return sortProducts(filterProducts(data ?? [], filters.availability ?? "all"), filters.sort ?? "default");
}

export async function fetchProductsByCategoryIdsPaginated(
  categoryIds: string[],
  filters: ProductFilters & { page?: number; perPage?: number } = {}
): Promise<{ products: Product[]; total: number }> {
  if (categoryIds.length === 0) {
    return { products: [], total: 0 };
  }

  const page = filters.page ?? 1;
  const perPage = filters.perPage ?? 18;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  // Get total count
  const { count, error: countError } = await db
    .from("products")
    .select("id", { count: "exact", head: true })
    .in("category_id", categoryIds)
    .eq("is_active", true);

  if (countError) {
    throw new Error(countError.message);
  }

  // Get paginated products
  const { data, error } = await db
    .from("products")
    .select("*")
    .in("category_id", categoryIds)
    .eq("is_active", true)
    .order("sort_order")
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const filtered = filterProducts(data ?? [], filters.availability ?? "all");
  const sorted = sortProducts(filtered, filters.sort ?? "default");

  return { products: sorted, total: count ?? 0 };
}

export async function fetchProductBySlug(slug: string) {
  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function fetchRelatedProducts(product: Product, limit = 4) {
  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("category_id", product.category_id)
    .eq("is_active", true)
    .neq("id", product.id)
    .order("sort_order")
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function fetchMinOrderAmount() {
  const { data, error } = await db
    .from("site_settings")
    .select("value")
    .eq("key", "min_order_amount")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const value = (data?.value as { value?: number } | null)?.value;
  return typeof value === "number" ? value : 1000;
}

export async function fetchContactSettings(): Promise<ContactSettings> {
  const [{ data: contactData, error: contactError }, { data: addressData, error: addressError }] = await Promise.all([
    db.from("site_settings").select("value").eq("key", "contact").maybeSingle(),
    db.from("site_settings").select("value").eq("key", "store_address").maybeSingle(),
  ]);

  if (contactError) {
    throw new Error(contactError.message);
  }

  if (addressError) {
    throw new Error(addressError.message);
  }

  const contact = (contactData?.value as { email?: string; phone?: string } | null) ?? {};
  const address =
    (addressData?.value as { company?: string; street?: string; zip?: string; city?: string } | null) ?? {};

  return {
    email: contact.email ?? "objednavky@masi-co.com",
    phone: contact.phone ?? "+420 222 533 001",
    company: address.company ?? "Masi-co s.r.o.",
    street: address.street ?? "Zahradní 466",
    zip: address.zip ?? "250 64",
    city: address.city ?? "Měšice",
  };
}

export async function fetchAdminOrders(limit = 50): Promise<Order[]> {
  if (!isAdminSupabaseConfigured()) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminSupabase = getAdminSupabase() as any;
  const { data, error } = await adminSupabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function fetchAdminOrderDetail(orderId: string): Promise<{ order: Order | null; items: OrderItem[] }> {
  if (!isAdminSupabaseConfigured()) {
    return { order: null, items: [] };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminSupabase = getAdminSupabase() as any;
  const [{ data: order, error: orderError }, { data: items, error: itemsError }] = await Promise.all([
    adminSupabase.from("orders").select("*").eq("id", orderId).maybeSingle(),
    adminSupabase.from("order_items").select("*").eq("order_id", orderId),
  ]);

  if (orderError) {
    throw new Error(orderError.message);
  }

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return { order, items: items ?? [] };
}

export async function updateAdminOrderStatus(orderId: string, orderStatus: Order["order_status"]) {
  if (!isAdminSupabaseConfigured()) {
    throw new Error("Supabase service role není nakonfigurovaná.");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminSupabase = getAdminSupabase() as any;
  const { error } = await adminSupabase
    .from("orders")
    .update({ order_status: orderStatus })
    .eq("id", orderId);

  if (error) {
    throw new Error(error.message);
  }
}

export function getOrderStatusLabel(status: Order["order_status"]) {
  switch (status) {
    case "new":
      return "Nová";
    case "confirmed":
      return "Potvrzená";
    case "processing":
      return "Zpracovává se";
    case "ready":
      return "Připravená";
    case "delivering":
      return "Na rozvozu";
    case "delivered":
      return "Doručená";
    case "cancelled":
      return "Zrušená";
    default:
      return status;
  }
}
