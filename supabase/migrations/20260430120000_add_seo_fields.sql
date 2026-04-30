-- SEO fields per product
-- meta_title:       <title> tag override; fallback product.name
-- meta_description: short tagline; rendered below H1 + <meta name="description">
-- seo_description:  long SEO copy; rendered in accordion "Popis" + JSON-LD
-- keywords:         comma-separated; <meta name="keywords"> + JSON-LD keywords

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS meta_title       text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS seo_description  text,
  ADD COLUMN IF NOT EXISTS keywords         text;
