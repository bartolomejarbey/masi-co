# Redesign stránky produktů MASI-CO

## Souhrn

Přepracování stránky `/produkty` z plochého výpisu produktů na dvouúrovňový systém:
1. **Landing page "Naše produkty"** (`/produkty`) — storytelling kategorie se vtipnými texty
2. **Produktová stránka** (`/produkty/[slug]`) — stránkování po 18, nové karty s hover overlay

## 1. Landing page "Naše produkty" (`/produkty`)

### Hero sekce
- Nadpis: "Naše produkty" (font-display, Roboto Slab, velký)
- Podnadpis: "Poctivé maso, domácí hotovky a speciality z našeho řeznictví. Vybíráme jen to nejlepší — od lokálních dodavatelů, co znají své řemeslo."
- Dekorativní pozadí s jemným gradientem (primary color)

### Kategorie — střídavý layout (obrázek vlevo/vpravo)

Každá kategorie je full-width sekce. Střídavé rozložení obrázku a textu.

| Kategorie | Slug | Nadpis | Text |
|---|---|---|---|
| Maso | maso | "Čerstvé maso" | "Naše hovězí ještě včera mělo plány na víkend. Steaky, roštěnky, svíčkové — vše ručně porcované, jak se na pořádné řeznictví sluší." |
| Hotovky | hotovky | "Hotová jídla" | "Pro ty, co chtějí jíst dobře, ale vařit? To ne. Sekaná, řízky, guláš — domácí chuť bez domácího nepořádku." |
| Uzené maso | uzene-maso | "Uzené speciality" | "Uzené po staročesku. Žádné tekuté kouře, žádné zkratky. Jen dřevo, čas a trocha řeznické magie." |
| Zvěřina | zverina | "Zvěřina" | "Pro dobrodruhy u plotny. Jelení, srnčí, divočák — maso s příběhem z českých lesů." |
| Ryby | ryby | "Ryby" | "I řezník ví, že pátek patří rybě. Čerstvé, filetované, připravené skočit na pánev." |
| Uzeniny | uzeniny | "Uzeniny" | "Klobásky, párky, šunka — to, co dělá svačinu svačinou a piknik piknikem." |
| Ostatní sortiment | ostatni-sortiment | "Ostatní dobroty" | "Bramboráky, knedlíky, přílohy a věci, bez kterých by maso bylo osamělé." |

Každý blok obsahuje:
- Obrázek kategorie (z DB `category.image_url`, fallback gradient)
- Nadpis (Roboto Slab, bold)
- Text (vtipný mix — hrdý nadpis, odlehčený popis)
- CTA tlačítko "Prozkoumat →" → `/produkty/[slug]`

### Vizuální styl landing page
- Střídavý layout: liché kategorie = obrázek vlevo, text vpravo; sudé = opačně
- Na mobilu: vždy obrázek nahoře, text pod ním
- Jemné fade-in animace při scrollování (optional, CSS only)
- Sekce oddělené dostatečným spacingem (py-16 / py-20)

## 2. Product karty s hover overlay

### Výchozí stav
- Bílá karta, jemný border (`border-gray-200`), `rounded-2xl`
- Obrázek nahoře, poměr **4:3** (místo čtverce)
- Pod obrázkem: název produktu (klikatelný na detail), weight info, cena (velká, `text-primary`), badge skladu jako malý tag
- Žádné tlačítko do košíku viditelné v defaultu — čistý design

### Hover stav (desktop)
- Karta: `-translate-y-1`, `shadow-xl` transition
- Přes obrázek: poloprůhledný tmavý overlay (`bg-black/50`) s:
  - Tlačítko "Do košíku" (bílé pozadí, černý text, výrazné)
  - Odkaz "Detail" (bílý text, menší, pod tlačítkem)
- Overlay animace: fade-in 200ms

### Mobilní varianta
- Hover overlay neexistuje
- Tlačítko "Do košíku" je vždy viditelné pod kartou jako kompaktní lišta
- Tap na obrázek → navigace na detail produktu

### Quantity selector
- Na desktopu: zobrazí se inline po kliknutí na "Do košíku" v overlay
- Na mobilu: vždy viditelný vedle tlačítka (stávající +/- design)

## 3. Stránkování

### Parametry
- **18 produktů na stránku** (6 řádků × 3 sloupce na desktopu)
- URL parametr `?page=N`, default 1
- Server-side: `fetchAllProducts` dostane `page` a `perPage` parametry
- Supabase `.range(from, to)` pro efektivní query

### UI navigace
- Pozice: pod gridem produktů, centrovaná
- Layout: `← Předchozí | 1 2 3 ... N | Další →`
- Čísla stránek jako rounded buttony, aktivní stránka vyplněná (primary color)
- Předchozí/Další disabled na první/poslední stránce
- Při změně stránky: `window.scrollTo` na začátek gridu

### Řazení a filtrování
- Zachovat stávající: dropdown řazení (Doporučené, Název, Cena), filtr dostupnosti
- Vizuálně zmenšit — kompaktnější inline layout
- Při změně filtru/řazení → reset na stránku 1

## 4. Soubory k úpravě

| Soubor | Změna |
|---|---|
| `src/app/(shop)/produkty/page.tsx` | Kompletní přepis na landing page s kategoriemi |
| `src/app/(shop)/produkty/[slug]/page.tsx` | Přidání stránkování, nový layout |
| `src/components/shop/ProductCard.tsx` | Nový design s hover overlay |
| `src/components/shop/ProductsGrid.tsx` | Úprava pro nové karty |
| `src/components/shop/Pagination.tsx` | Nová komponenta |
| `src/lib/shop.ts` | Přidání `page`/`perPage` parametrů do fetch funkcí |

## 5. Barvy a typografie (existující)

- Primary: `#CC1939`, dark: `#A81430`
- Font display: Roboto Slab
- Font body: Roboto
- Borders: `gray-200`, hover `gray-300`
- Tlačítka: uppercase, tracking-wider
