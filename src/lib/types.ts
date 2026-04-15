// ============================================================
// MASI-CO E-shop — TypeScript typy
// ============================================================

// --- Enum typy ---

export type StockStatus = "in_stock" | "out_of_stock" | "on_order";

export type ShippingMethod = "own_delivery" | "zasilkovna" | "ppl";

export type PaymentMethod =
  | "cash_on_delivery"
  | "bank_transfer"
  | "meal_vouchers"
  | "online_card"
  | "apple_pay"
  | "google_pay";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderStatus =
  | "new"
  | "confirmed"
  | "processing"
  | "ready"
  | "delivering"
  | "delivered"
  | "cancelled";

export type AddressType = "shipping" | "billing";

// --- Databazove entity ---

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CategoryWithChildren extends Category {
  children: Category[];
}

export type BackorderMode = "no" | "notify" | "yes";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string;
  price: number;
  unit: "kg" | "ks";
  weight_info: string | null;
  image_url: string | null;
  gallery: string[] | null;
  stock_status: StockStatus;
  manage_stock: boolean;
  stock_quantity: number | null;
  low_stock_threshold: number | null;
  max_per_order: number | null;
  allow_backorders: BackorderMode;
  is_active: boolean;
  is_featured: boolean;
  badge: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export interface Customer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  company_name: string | null;
  ico: string | null;
  dic: string | null;
  newsletter: boolean;
  created_at: string;
}

export interface CustomerAddress {
  id: string;
  customer_id: string;
  type: AddressType;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  street: string;
  city: string;
  zip: string;
  phone: string | null;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  shipping_street: string;
  shipping_city: string;
  shipping_zip: string;
  billing_same_as_shipping: boolean;
  billing_street: string | null;
  billing_city: string | null;
  billing_zip: string | null;
  billing_company_name: string | null;
  billing_ico: string | null;
  billing_dic: string | null;
  is_company: boolean;
  shipping_method: ShippingMethod;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  subtotal: number;
  shipping_price: number;
  total: number;
  final_total: number | null;
  note: string | null;
  admin_note: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  estimated_total: number;
  final_total: number | null;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export interface SiteSetting {
  key: string;
  value: unknown;
  updated_at: string;
}

// --- Frontend typy ---

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutFormData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  shipping_street: string;
  shipping_city: string;
  shipping_zip: string;
  billing_same_as_shipping: boolean;
  billing_street?: string;
  billing_city?: string;
  billing_zip?: string;
  billing_company_name?: string;
  billing_ico?: string;
  billing_dic?: string;
  is_company: boolean;
  shipping_method: ShippingMethod;
  payment_method: PaymentMethod;
  note?: string;
}

// --- Supabase Database type ---

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Category, "id">>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Product, "id">>;
      };
      customers: {
        Row: Customer;
        Insert: Omit<Customer, "created_at"> & { created_at?: string };
        Update: Partial<Omit<Customer, "id">>;
      };
      customer_addresses: {
        Row: CustomerAddress;
        Insert: Omit<CustomerAddress, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<CustomerAddress, "id">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "order_number" | "created_at" | "updated_at"> & { id?: string; order_number?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Order, "id" | "order_number">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id"> & { id?: string };
        Update: Partial<Omit<OrderItem, "id">>;
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriber;
        Insert: Omit<NewsletterSubscriber, "id" | "subscribed_at"> & { id?: string; subscribed_at?: string };
        Update: Partial<Omit<NewsletterSubscriber, "id">>;
      };
      site_settings: {
        Row: SiteSetting;
        Insert: Omit<SiteSetting, "updated_at"> & { updated_at?: string };
        Update: Partial<SiteSetting>;
      };
    };
    Functions: {
      search_products: {
        Args: { search_query: string };
        Returns: Product[];
      };
      generate_order_number: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
  };
}
