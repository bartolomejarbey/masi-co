-- ============================================================
-- MASI-CO — split "Ostatni sortiment" into 4 logical subcategories
-- ============================================================
-- Adds 4 child categories under "Ostatni sortiment" and remaps the
-- 43 products from the flat parent into:
--   - prilohy (potatoes, fries, croquettes, dumplings)
--   - zelenina (frozen vegetables and mixes)
--   - syry (cheese)
--   - tradicni-specialty (lard, cracklings, head cheese, blood sausage prep, pates)
--
-- Parent_id is looked up by slug so this works on both fresh seed
-- (UUID c0000000-...-08) and live DB (UUID bc7df9de-...).
-- ============================================================

-- 1) New subcategories under "ostatni-sortiment"
INSERT INTO categories (name, slug, description, parent_id, sort_order)
SELECT v.name, v.slug, v.description, p.id, v.sort_order
FROM (VALUES
  ('Prilohy',            'prilohy',            'Brambory, hranolky, krokety a knedliky',   1),
  ('Mrazena zelenina',   'zelenina',           'Mrazene zeleninove smesi a polotovary',    2),
  ('Syry',               'syry',               'Eidam, niva a dalsi syry',                 3),
  ('Tradicni specialty', 'tradicni-specialty', 'Sadlo, skvarky, tlacenka, jitrnice, paty', 4)
) AS v(name, slug, description, sort_order)
CROSS JOIN (SELECT id FROM categories WHERE slug = 'ostatni-sortiment') AS p
ON CONFLICT (slug) DO NOTHING;

-- 2) Remap products → Prilohy
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'prilohy')
WHERE slug IN (
  'americke-brambory-bal-cca-2-5kg-1kg',
  'bramborak-cesky-bal-25ks-1ks',
  'bramborove-tolary-kaizer-bal-cca-2-5kg-1kg',
  'hranolky-9x9-bal-cca-2-5kg-1kg',
  'hranolky-julianne-6x6-bal-cca-2-5kg-1kg',
  'hranolky-steak-house-bal-cca-2-5kg-1kg',
  'krokety-bal-cca-2-5kg-1kg',
  'knedlik-bramborovy-500g-1ks',
  'knedlik-houskovy-550g-1ks'
);

-- 3) Remap products → Mrazena zelenina
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'zelenina')
WHERE slug IN (
  'brokolice-ruzicky-bal-cca-2-5kg-1kg',
  'cesnek-drceny-bal-cca-1kg',
  'cinska-smes-bal-cca-2-5kg-1kg',
  'fazolove-lusky-cele-bal-cca-2-5kg-1kg',
  'fazolove-lusky-rezane-bal-cca-2-5kg-1kg',
  'francouzska-zeleninova-smes-bal-cca-2-5kg-1kg',
  'hrasek-mrazeny-bal-cca-2-5kg-1kg',
  'kapusta-rezana-bal-cca-2-5kg-1kg',
  'kukurice-zrno-bal-cca-2-5kg-1kg',
  'kvetak-na-obaleni-bal-cca-2-5kg-1kg',
  'leco-zelenina-bal-cca-2-5kg-1kg',
  'mrkev-baby-bal-cca-2-5kg-1kg',
  'polevkova-smes-bal-cca-2-5kg-1kg',
  'porek-rezany-bal-cca-2-5kg-1kg',
  'prilohova-smes-s-kukurici-bal-cca-2-5kg-1kg',
  'spenat-bal-cca-2-5kg-1kg',
  'spenat-granule-bal-cca-2-5kg-1kg',
  'zampiony-mrazene-platky-bal-cca-2-5kg-1kg',
  'zelenina-pod-svickovou-bal-cca-2-5kg-1kg'
);

-- 4) Remap products → Syry
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'syry')
WHERE slug IN (
  'eidam-30-bal-cca-3kg-1kg',
  'eidam-uzeny-bal-cca-3kg-1kg',
  'niva-exclusive-bal-cca-2-5kg-1kg'
);

-- 5) Remap products → Tradicni specialty
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'tradicni-specialty')
WHERE slug IN (
  'aspik-sunkovy-s-brokolici-bal-cca-2kg-1kg',
  'babiccina-sekana-bal-cca-2kg-1kg',
  'husi-pastika-bal-cca-2kg-1kg',
  'jatrovy-syr-stribrna-cihla-bal-cca-1kg',
  'jelitkovy-prejt-mrazeny-bal-cca-2-5kg-1kg',
  'jitrnice-jelita-1kg',
  'jitrnicovy-prejt-mrazeny-bal-cca-2-5kg-1kg',
  'skvarene-sadlo-kyblik-bal-3kg-1kg',
  'skvarene-sadlo-rukav-bal-3kg-1kg',
  'skvarky-selske-1kg',
  'svetla-delikates-bal-cca-2kg-1kg',
  'svetla-tlacenka-bal-cca-4kg-1kg'
);
