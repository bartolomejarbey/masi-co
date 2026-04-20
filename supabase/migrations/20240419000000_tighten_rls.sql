-- Tighten RLS INSERT policies for orders and order_items.
-- Previously allowed unauthenticated inserts via anon key.
-- Now: orders can only be inserted via service role (API route),
-- and order_items only for orders owned by the inserting user or via service role.

-- Drop overly permissive INSERT policies
DROP POLICY IF EXISTS "orders_insert_all" ON orders;
DROP POLICY IF EXISTS "order_items_insert_all" ON order_items;

-- Orders: no direct client inserts allowed.
-- All order creation goes through /api/orders which uses service role key (bypasses RLS).
-- This prevents anyone from inserting orders directly via the anon key.
CREATE POLICY "orders_insert_none" ON orders FOR INSERT WITH CHECK (false);

-- Order items: same — only via service role.
CREATE POLICY "order_items_insert_none" ON order_items FOR INSERT WITH CHECK (false);

-- Newsletter: keep allowing inserts but only with a valid email (non-empty)
DROP POLICY IF EXISTS "newsletter_insert_all" ON newsletter_subscribers;
CREATE POLICY "newsletter_insert_validated" ON newsletter_subscribers FOR INSERT
  WITH CHECK (email IS NOT NULL AND email <> '');
