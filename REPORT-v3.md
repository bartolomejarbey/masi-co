# MASI-CO E-shop — Iterace 3 — REPORT

**Datum:** 2026-04-15  
**Čas zpracování:** ~60 min

---

## Úloha 1: Uzené maso — 14 produktů ✅

Vloženo **14 produktů** do kategorie Uzené maso:
- Uzený bok b.k., s kostí (2 varianty)
- Uzená krkovice b.k., s kostí (2 varianty)
- Uzená kýta b.k., plátkovaná (2 varianty)
- Uzená plec b.k., s kostí (2 varianty)
- Uzená pečeně b.k., s kostí (2 varianty)
- Uzené ocásky, Uzený jazyk

Fotky přiřazeny: Uzený bok.jpg, Uzený ocásek.jpg

---

## Úloha 2: Verifikace DSC fotek ✅

Všech **29 DSC fotek** ověřeno:
- 20 přiřazeno k produktům (image_url)
- 1 přiřazena do gallery (Živická klobása)
- 2 jako category image (Uzeniny, Hotovky)
- 3 čekaly na Úlohu 8 (Zelňačka, Znojemská, Vepřové na žampionech) → nyní přiřazeny
- 1 promo skupinová (DSC00542 → Ostatní sortiment category)
- 3 lifestyle/restaurant (DSC09603→Zvěřina cat, DSC09953→Ryby cat, DSC09968→unused)

---

## Úloha 3: Kategorie — nav menu obrázky ✅

**11 kategorií** nyní má obrázky:

| Kategorie | Zdroj obrázku |
|-----------|---------------|
| Maso | Hovězí svíčková/býk |
| Hovězí maso | Hovězí roštěná/býk |
| Vepřové maso | Vepřová panenka |
| Kuřecí maso | Kuřecí prsa |
| Uzené maso | Uzený bok |
| Ostatní maso | Krůtí prsa |
| Uzeniny | DSC00473 (skupinové) |
| Hotovky | DSC00536 (skupinové) |
| Párky a špekáčky | Debrecínské párky |
| Klobásy trvanlivé | Živická klobása |
| Zvěřina | DSC09968 (meat counter) |
| Ryby | DSC09953 (restaurant) |
| Ostatní sortiment | DSC00542 (jars group) |

---

## Úloha 4: Hero carousel ✅

- Rozšířen ze 3 na **6 obrázků** (hero-1..hero-6)
- Přidány 3 lifestyle fotky (DSC09603, DSC09953, DSC09968)
- Všechny hero obrázky zmenšeny z 17-20 MB na 65-124 KB (1920px šířka)
- Rotace zpomalena z 3s na **5s**

---

## Úloha 5: UI/UX audit s Playwright ✅

Screenshoty pořízeny (desktop 1440px + mobile 390px):
- Homepage, Produkty, Hovězí maso, Kontakt, Jak nakupovat, Košík, Přihlášení
- Mega menu hover, Product detail

**Výsledky auditu:**
- Celkový design je konzistentní a profesionální
- Mega menu zobrazuje obrázky kategorií správně
- Mobile layout adaptuje správně
- Kontaktní údaje jsou všude konzistentní
- Produkty bez fotek mají placeholder (201/252 bez fotek)

---

## Úloha 6: Admin UI vylepšení ✅

### Sidebar ikony
- Nahrazeny emoji (📊📦🥩...) za **lucide-react** ikony:
  - Dashboard → LayoutDashboard
  - Objednávky → Package
  - Produkty → Beef
  - Kategorie → FolderTree
  - Zákazníci → Users
  - Newsletter → Mail
  - Nastavení → Settings
  - Zpět na e-shop → Store

### Produkty admin
- Přidán **vyhledávač produktů** (text search)
- Přidán **indikátor chybějící fotky** (ImageOff icon)
- Stock filtry a bulk akce byly již implementovány v iteraci 2

---

## Úloha 7: Checkout + Comgate + QR ✅

### Nové platební metody
| Metoda | Implementace |
|--------|-------------|
| Dobírka (hotovost) | Beze změny |
| Bankovní převod | NOVÉ — QR kód SPD formát |
| Stravenky | Beze změny |
| Online kartou | NOVÉ — Comgate brána |

### Comgate integrace
- **`src/lib/comgate.ts`** — createComgatePayment(), getComgateStatus()
- **`src/app/api/comgate/callback/route.ts`** — POST (webhook) + GET (redirect)
- Env proměnné: `COMGATE_MERCHANT_ID`, `COMGATE_SECRET`, `COMGATE_TEST_MODE`
- Po platbě se automaticky aktualizuje payment_status + order_status

### QR platba (SPD formát)
- **`src/lib/qr-payment.ts`** — generateSPDString(), getQRCodeUrl()
- IBAN: CZ4301000000432367040227 (KB)
- VS: číslo objednávky (numerická část)
- QR kód zobrazován na potvrzovací stránce

### Email potvrzení (Resend)
- **`src/lib/email.ts`** — sendOrderConfirmation()
- HTML šablona s tabulkou položek, cenou, platebními údaji
- Pro bank_transfer obsahuje QR kód a číslo účtu
- Fallback: log do konzole pokud RESEND_API_KEY není nastaven
- Env proměnná: `RESEND_API_KEY`

### Aktualizované soubory
- `CheckoutPageClient.tsx` — 4 platební metody, Comgate redirect
- `api/orders/route.ts` — integrace Comgate + email + QR
- `potvrzeni/page.tsx` — QR kód pro bankovní převod
- `types.ts` — PaymentMethod + 'bank_transfer'
- `schema.sql` — CHECK constraint aktualizován

### ⚠️ DB migrace potřeba:
```sql
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check 
  CHECK (payment_method IN ('cash_on_delivery', 'bank_transfer', 'meal_vouchers', 'online_card', 'apple_pay', 'google_pay'));
```

---

## Úloha 8: Chybějící produkty + ceny ✅

### 5 nových produktů:
| Produkt | Cena | Kategorie | Fotka |
|---------|------|-----------|-------|
| Zelňačka 900ml | 99 Kč | Hotovky | DSC00503 ✅ |
| Znojemská omáčka 900ml | 178 Kč | Hotovky | DSC00505 ✅ |
| Vepřové na žampionech 900ml | 178 Kč | Hotovky | DSC00511 ✅ |
| Klobása Jalapenos se sýrem 1kg | 200 Kč | Klobásy měkké | named photo ✅ |
| Pikantní klobása 1kg | 200 Kč | Klobásy měkké | named photo ✅ |

### Opravené ceny:
- **Daňčí kýta/mraženo/ 1kg**: 0 → **450 Kč**
- **Kančí krkovice/mraženo/ 1kg**: 0 → **380 Kč**

---

## Celkové shrnutí iterace 3

| Metrika | Hodnota |
|---------|---------|
| Produktů celkem | **252** |
| Nových produktů | 19 (14 Uzené + 5 chybějících) |
| Kategorií s obrázky | **13** (z 21) |
| Hero obrázků | 6 (optimalizované) |
| Fotek přiřazeno celkem | **63** (58 z v1 + 5 nových) |
| Nové soubory | comgate.ts, qr-payment.ts, email.ts, callback/route.ts |
| Platební metody | 4 (dobírka, převod+QR, stravenky, online Comgate) |

### ⚠️ Před spuštěním do produkce:
1. Nastavit `COMGATE_MERCHANT_ID` a `COMGATE_SECRET` v env
2. Nastavit `RESEND_API_KEY` v env  
3. Nastavit `NEXT_PUBLIC_SITE_URL` na produkční URL
4. Spustit SQL migraci pro `bank_transfer` payment method
5. Nastavit doménu v Resend pro odesílání z objednavky@masi-co.com
6. Nastavit callback URL v Comgate admin panelu
