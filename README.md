# MASI-CO E-shop

E-shop s masem a hotovymi jidly. Next.js 14 + Supabase + Tailwind CSS.

## Spusteni

```bash
npm install
cp .env.local.example .env.local
# Vyplnit NEXT_PUBLIC_SUPABASE_URL a NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## Databaze

### Schema

Kompletni SQL schema je v `src/lib/schema.sql`. Obsahuje:
- 8 tabulek: categories, products, customers, customer_addresses, orders, order_items, newsletter_subscribers, site_settings
- Podpora podkategorii (categories.parent_id)
- Full-text search na products (tsvector + GIN index)
- Automaticke generovani cisel objednavek (MC-20260001, MC-20260002...)
- RLS policies pro vsechny tabulky
- Triggery na updated_at

### Jak spustit v Supabase

**Varianta 1: SQL Editor (doporuceno)**

1. Otevrit Supabase Dashboard > SQL Editor
2. Vlozit a spustit obsah `src/lib/schema.sql`
3. Vlozit a spustit obsah `supabase/migrations/20240101000001_seed_data.sql`

**Varianta 2: Supabase CLI**

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

### Seed data

Soubor `supabase/migrations/20240101000001_seed_data.sql` obsahuje:
- 8 hlavnich kategorii + 7 podkategorii masa
- 130+ realnych produktu s cenami v CZK
- 7 zaznamu site_settings (min. objednavka, rozvoz, kontakt...)

### Struktura databaze

| Tabulka                | Popis                                    |
|------------------------|------------------------------------------|
| categories             | Kategorie a podkategorie produktu        |
| products               | Produkty e-shopu s full-text search      |
| customers              | Registrovani zakaznici (auth.users)      |
| customer_addresses     | Dodaci a fakturacni adresy               |
| orders                 | Objednavky s auto-generovanym cislem     |
| order_items            | Polozky objednavek (snapshot cen)        |
| newsletter_subscribers | Odberatele newsletteru                   |
| site_settings          | Konfigurace e-shopu (key-value, jsonb)   |
