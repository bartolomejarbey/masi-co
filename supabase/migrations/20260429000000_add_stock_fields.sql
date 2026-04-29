-- ============================================================
-- MASI-CO: Add stock management fields to products
-- Fixes: column products.manage_stock does not exist (orders crash)
-- ============================================================

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS manage_stock boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS stock_quantity decimal(10,3),
  ADD COLUMN IF NOT EXISTS low_stock_threshold int DEFAULT 3,
  ADD COLUMN IF NOT EXISTS max_per_order int,
  ADD COLUMN IF NOT EXISTS allow_backorders text NOT NULL DEFAULT 'no';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_allow_backorders'
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT chk_allow_backorders
      CHECK (allow_backorders IN ('no', 'notify', 'yes'));
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_products_low_stock
  ON products (stock_quantity)
  WHERE manage_stock = true AND stock_quantity IS NOT NULL;

CREATE OR REPLACE FUNCTION auto_update_stock_status()
RETURNS trigger AS $$
BEGIN
  IF NEW.manage_stock = true AND NEW.stock_quantity IS NOT NULL THEN
    IF NEW.stock_quantity <= 0 THEN
      IF NEW.allow_backorders <> 'no' THEN
        NEW.stock_status := 'on_order';
      ELSE
        NEW.stock_status := 'out_of_stock';
      END IF;
    ELSE
      NEW.stock_status := 'in_stock';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_stock_status ON products;
CREATE TRIGGER trg_auto_stock_status
  BEFORE INSERT OR UPDATE OF stock_quantity, manage_stock, allow_backorders
  ON products
  FOR EACH ROW EXECUTE FUNCTION auto_update_stock_status();
