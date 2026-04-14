-- ============================================================
-- MASI-CO E-shop — kompletni databazove schema
-- PostgreSQL / Supabase
-- ============================================================

-- ===================
-- 1. CATEGORIES (s podporou podkategorii)
-- ===================
CREATE TABLE categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  description text,
  image_url   text,
  parent_id   uuid REFERENCES categories (id) ON DELETE SET NULL,
  sort_order  int NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_slug ON categories (slug);
CREATE INDEX idx_categories_parent_id ON categories (parent_id);
CREATE INDEX idx_categories_is_active ON categories (is_active) WHERE is_active = true;

-- ===================
-- 2. PRODUCTS (s full-text search)
-- ===================
CREATE TABLE products (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  slug              text NOT NULL UNIQUE,
  description       text,
  category_id       uuid NOT NULL REFERENCES categories (id) ON DELETE RESTRICT,
  price             decimal(10,2) NOT NULL,
  unit              text NOT NULL DEFAULT 'kg',
  weight_info       text,
  image_url         text,
  gallery           text[],
  stock_status      text NOT NULL DEFAULT 'in_stock'
                      CHECK (stock_status IN ('in_stock', 'out_of_stock', 'on_order')),
  is_active         boolean NOT NULL DEFAULT true,
  is_featured       boolean NOT NULL DEFAULT false,
  badge             text,
  sort_order        int NOT NULL DEFAULT 0,
  search_vector     tsvector,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_slug ON products (slug);
CREATE INDEX idx_products_category_id ON products (category_id);
CREATE INDEX idx_products_stock_status ON products (stock_status);
CREATE INDEX idx_products_is_active ON products (is_active) WHERE is_active = true;
CREATE INDEX idx_products_is_featured ON products (is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_search ON products USING GIN (search_vector);

-- Full-text search trigger
CREATE OR REPLACE FUNCTION products_search_vector_update()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple', coalesce(NEW.name, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_search_vector
  BEFORE INSERT OR UPDATE OF name ON products
  FOR EACH ROW EXECUTE FUNCTION products_search_vector_update();

-- Search funkce
CREATE OR REPLACE FUNCTION search_products(search_query text)
RETURNS SETOF products AS $$
BEGIN
  RETURN QUERY
    SELECT *
    FROM products
    WHERE search_vector @@ plainto_tsquery('simple', search_query)
      AND is_active = true
    ORDER BY ts_rank(search_vector, plainto_tsquery('simple', search_query)) DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ===================
-- 3. CUSTOMERS
-- ===================
CREATE TABLE customers (
  id            uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email         text NOT NULL UNIQUE,
  first_name    text,
  last_name     text,
  phone         text,
  company_name  text,
  ico           text,
  dic           text,
  newsletter    boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ===================
-- 4. CUSTOMER_ADDRESSES
-- ===================
CREATE TABLE customer_addresses (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   uuid NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  type          text NOT NULL DEFAULT 'shipping'
                  CHECK (type IN ('shipping', 'billing')),
  first_name    text,
  last_name     text,
  company_name  text,
  street        text NOT NULL,
  city          text NOT NULL,
  zip           text NOT NULL,
  phone         text,
  is_default    boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_customer_addresses_customer_id ON customer_addresses (customer_id);

-- ===================
-- 5. ORDERS
-- ===================

-- Sekvence pro cisla objednavek
CREATE SEQUENCE order_number_seq START WITH 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  seq_val int;
BEGIN
  seq_val := nextval('order_number_seq');
  RETURN 'MC-' || extract(year FROM now())::text || lpad(seq_val::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE TABLE orders (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number             text NOT NULL UNIQUE DEFAULT generate_order_number(),
  customer_id              uuid REFERENCES customers (id) ON DELETE SET NULL,
  email                    text NOT NULL,
  first_name               text NOT NULL,
  last_name                text NOT NULL,
  phone                    text NOT NULL,
  shipping_street          text NOT NULL,
  shipping_city            text NOT NULL,
  shipping_zip             text NOT NULL,
  billing_same_as_shipping boolean NOT NULL DEFAULT true,
  billing_street           text,
  billing_city             text,
  billing_zip              text,
  billing_company_name     text,
  billing_ico              text,
  billing_dic              text,
  is_company               boolean NOT NULL DEFAULT false,
  shipping_method          text NOT NULL DEFAULT 'own_delivery'
                             CHECK (shipping_method IN ('own_delivery', 'zasilkovna', 'ppl')),
  payment_method           text NOT NULL
                             CHECK (payment_method IN ('cash_on_delivery', 'meal_vouchers', 'online_card', 'apple_pay', 'google_pay')),
  payment_status           text NOT NULL DEFAULT 'pending'
                             CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status             text NOT NULL DEFAULT 'new'
                             CHECK (order_status IN ('new', 'confirmed', 'processing', 'ready', 'delivering', 'delivered', 'cancelled')),
  subtotal                 decimal(10,2) NOT NULL,
  shipping_price           decimal(10,2) NOT NULL DEFAULT 0,
  total                    decimal(10,2) NOT NULL,
  final_total              decimal(10,2),
  note                     text,
  admin_note               text,
  delivered_at             timestamptz,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_customer_id ON orders (customer_id);
CREATE INDEX idx_orders_order_status ON orders (order_status);
CREATE INDEX idx_orders_payment_status ON orders (payment_status);
CREATE INDEX idx_orders_order_number ON orders (order_number);
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);

-- ===================
-- 6. ORDER_ITEMS
-- ===================
CREATE TABLE order_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        uuid NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id      uuid REFERENCES products (id) ON DELETE SET NULL,
  product_name    text NOT NULL,
  quantity        decimal(10,3) NOT NULL,
  unit            text NOT NULL,
  unit_price      decimal(10,2) NOT NULL,
  estimated_total decimal(10,2) NOT NULL,
  final_total     decimal(10,2)
);

CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_items_product_id ON order_items (product_id);

-- ===================
-- 7. NEWSLETTER_SUBSCRIBERS
-- ===================
CREATE TABLE newsletter_subscribers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email           text NOT NULL UNIQUE,
  is_active       boolean NOT NULL DEFAULT true,
  subscribed_at   timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at timestamptz
);

-- ===================
-- 8. SITE_SETTINGS
-- ===================
CREATE TABLE site_settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- categories: SELECT pro vsechny
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_select" ON categories FOR SELECT USING (true);

-- products: SELECT pro vsechny
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_select" ON products FOR SELECT USING (true);

-- customers: jen vlastnik
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "customers_select_own" ON customers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "customers_update_own" ON customers FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "customers_insert_own" ON customers FOR INSERT WITH CHECK (auth.uid() = id);

-- customer_addresses: jen vlastnik
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "addresses_select_own" ON customer_addresses FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "addresses_insert_own" ON customer_addresses FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "addresses_update_own" ON customer_addresses FOR UPDATE USING (auth.uid() = customer_id) WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "addresses_delete_own" ON customer_addresses FOR DELETE USING (auth.uid() = customer_id);

-- orders: SELECT vlastnik, INSERT vsichni
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "orders_insert_all" ON orders FOR INSERT WITH CHECK (true);

-- order_items: SELECT pres orders vlastnik, INSERT vsichni
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_select_own" ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid()));
CREATE POLICY "order_items_insert_all" ON order_items FOR INSERT WITH CHECK (true);

-- newsletter_subscribers: INSERT vsichni
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "newsletter_insert_all" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- site_settings: SELECT vsichni
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_settings_select" ON site_settings FOR SELECT USING (true);
