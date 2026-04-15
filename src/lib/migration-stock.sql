-- ============================================================
-- MASI-CO: Migrace — Správa skladu (WooCommerce-style)
-- Spusť v Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Nové sloupce na tabulce products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS manage_stock boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS stock_quantity decimal(10,3),
  ADD COLUMN IF NOT EXISTS low_stock_threshold int DEFAULT 3,
  ADD COLUMN IF NOT EXISTS max_per_order int,
  ADD COLUMN IF NOT EXISTS allow_backorders text NOT NULL DEFAULT 'no';

-- 2. CHECK constraint pro allow_backorders
ALTER TABLE products
  ADD CONSTRAINT chk_allow_backorders
  CHECK (allow_backorders IN ('no', 'notify', 'yes'));

-- 3. Index pro rychlé dotazy na nízký stav
CREATE INDEX IF NOT EXISTS idx_products_low_stock
  ON products (stock_quantity)
  WHERE manage_stock = true AND stock_quantity IS NOT NULL;

-- 4. Trigger: automaticky aktualizuj stock_status při změně stock_quantity
CREATE OR REPLACE FUNCTION auto_update_stock_status()
RETURNS trigger AS $$
BEGIN
  IF NEW.manage_stock = true AND NEW.stock_quantity IS NOT NULL THEN
    IF NEW.stock_quantity <= 0 THEN
      IF NEW.allow_backorders != 'no' THEN
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

CREATE TRIGGER trg_auto_stock_status
  BEFORE INSERT OR UPDATE OF stock_quantity, manage_stock, allow_backorders
  ON products
  FOR EACH ROW EXECUTE FUNCTION auto_update_stock_status();

-- Hotovo!
-- Po spuštění se u všech produktů nastaví manage_stock = false (manuální režim).
-- V adminu můžeš u každého produktu zapnout "Sledovat stav skladu" a nastavit množství.
