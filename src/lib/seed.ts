import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://soobesyxsijdazjjstyn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvb2Jlc3l4c2lqZGF6ampzdHluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA1NzU1NCwiZXhwIjoyMDkwNjMzNTU0fQ.71UYmtIpxgnRXPANVcVF7jiyVGrar-Of0I8DzbkaH78"
);

function slug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type StockStatus = "in_stock" | "out_of_stock" | "on_order";

interface ProductInput {
  name: string;
  price: number;
  unit: string;
  stock_status: StockStatus;
  weight_info?: string;
  is_featured?: boolean;
  badge?: string;
}

async function seed() {
  console.log("=== MASI-CO SEED START ===\n");

  // ── 1. HLAVNÍ KATEGORIE ──
  const mainCats = [
    { name: "Hotovky", slug: "hotovky", description: "Hotová jídla ve sklenicích 900ml", sort_order: 1 },
    { name: "Maso", slug: "maso", description: "Čerstvé maso z českých a moravských jatek", sort_order: 2 },
    { name: "Uzené maso", slug: "uzene-maso", description: "Tradičně uzené maso", sort_order: 3 },
    { name: "Ostatní maso", slug: "ostatni-maso", description: "Drůbež, králík, jehněčí a další", sort_order: 4 },
    { name: "Zvěřina", slug: "zverina", description: "Divoká zvěř z českých revírů", sort_order: 5 },
    { name: "Ryby", slug: "ryby", description: "Čerstvé ryby a mořské plody", sort_order: 6 },
    { name: "Uzeniny", slug: "uzeniny", description: "Tradiční české uzeniny", sort_order: 7 },
    { name: "Ostatní sortiment", slug: "ostatni-sortiment", description: "Další produkty a doplňky", sort_order: 8 },
  ];

  const { data: insertedMainCats, error: mainCatErr } = await supabase
    .from("categories")
    .insert(mainCats)
    .select();

  if (mainCatErr) { console.error("Main categories error:", mainCatErr); return; }
  console.log(`✓ Hlavní kategorie: ${insertedMainCats!.length}`);

  const catMap: Record<string, string> = {};
  for (const c of insertedMainCats!) catMap[c.slug] = c.id;

  // ── 2. PODKATEGORIE POD "MASO" ──
  const subCats = [
    { name: "Vepřové maso", slug: "veprove-maso", description: "Čerstvé vepřové maso", parent_id: catMap["maso"], sort_order: 1 },
    { name: "Vepřové droby", slug: "veprove-droby", description: "Vepřové vnitřnosti", parent_id: catMap["maso"], sort_order: 2 },
    { name: "Hovězí maso", slug: "hovezi-maso", description: "Čerstvé hovězí maso", parent_id: catMap["maso"], sort_order: 3 },
    { name: "Hovězí droby", slug: "hovezi-droby", description: "Hovězí vnitřnosti", parent_id: catMap["maso"], sort_order: 4 },
    { name: "Telecí maso", slug: "teleci-maso", description: "Čerstvé telecí maso", parent_id: catMap["maso"], sort_order: 5 },
    { name: "Kuřecí maso", slug: "kureci-maso", description: "Čerstvé kuřecí maso", parent_id: catMap["maso"], sort_order: 6 },
    { name: "Mleté maso a zavářka", slug: "mlete-maso-a-zavarka", description: "Mleté maso a masové zavářky", parent_id: catMap["maso"], sort_order: 7 },
  ];

  const { data: insertedSubCats, error: subCatErr } = await supabase
    .from("categories")
    .insert(subCats)
    .select();

  if (subCatErr) { console.error("Sub categories error:", subCatErr); return; }
  console.log(`✓ Podkategorie: ${insertedSubCats!.length}`);

  for (const c of insertedSubCats!) catMap[c.slug] = c.id;

  // ── 3. PRODUKTY ──
  const productsByCategory: Record<string, ProductInput[]> = {
    "hovezi-maso": [
      { name: "Hovězí svíčková/býk 1kg", price: 756, unit: "kg", stock_status: "in_stock", is_featured: true, badge: "Top" },
      { name: "Hovězí svíčková/kráva 1kg", price: 718, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí roštěná/býk 1kg", price: 447, unit: "kg", stock_status: "in_stock", is_featured: true },
      { name: "Hovězí roštěná/kráva 1kg", price: 371, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí roštěná stařená 1kg", price: 558, unit: "kg", stock_status: "out_of_stock" },
      { name: "Hovězí zadní b.k./býk 1kg", price: 367, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí zadní b.k./kráva 1kg", price: 348, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí přední b.k. krk/býk 1kg", price: 327, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí přední b.k. krk/kráva 1kg", price: 301, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí přední s kostí 1kg", price: 160, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí přední kližka/býk 1kg", price: 267, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí přední kližka/kráva 1kg", price: 255, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí krájené kostky na guláš 1kg", price: 307, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí mleté maso 1kg", price: 187, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí líčka mražená 1kg", price: 393, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí oháňka 1kg", price: 198, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí kosti/harfy 1kg", price: 50, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí kosti morkové 1kg", price: 90, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí kosti s klouby/řezané 1kg", price: 50, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí zadní/falešná svíčková 1kg", price: 423, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí zadní plec/býk 1kg", price: 327, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí zadní plec/kráva 1kg", price: 299, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí zadní/váleček 1kg", price: 447, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí zadní vrchní šál 1kg", price: 358, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí zadní spodní šál 1kg", price: 338, unit: "kg", stock_status: "out_of_stock" },
      { name: "Hovězí Flank steak 1kg", price: 437, unit: "kg", stock_status: "out_of_stock" },
      { name: "Hovězí chuck roll 1kg", price: 431, unit: "kg", stock_status: "on_order" },
      { name: "Hovězí ořez-HPV 1kg", price: 151, unit: "kg", stock_status: "out_of_stock" },
    ],
    "hovezi-droby": [
      { name: "Hovězí játra 1kg", price: 29, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí jazyk chl/mr 1kg", price: 129, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí srdce chl/mr 1kg", price: 50, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí dršťky/předvařené 1kg", price: 113, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí dršťky syrové chl/mr 1kg", price: 113, unit: "kg", stock_status: "in_stock" },
      { name: "Hovězí býčí žlázy 1kg", price: 125, unit: "kg", stock_status: "in_stock" },
    ],
    "veprove-maso": [
      { name: "Vepřová krkovice bez kosti 1kg", price: 147, unit: "kg", stock_status: "in_stock", is_featured: true },
      { name: "Vepřová krkovice s kostí 1kg", price: 136, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřová kýta bez kosti 1kg", price: 113, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřová kýta plátkovaná 1kg", price: 136, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřová kýta/nudličky 1kg", price: 136, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřová panenka chlazená 1kg", price: 224, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřová pečeně bez kosti 1kg", price: 125, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřová pečeně s kostí 1kg", price: 114, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřová pečeně s kostí/sekané 1kg", price: 125, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřová plec bez kosti 1kg", price: 111, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřový bok bez kosti 1kg", price: 129, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřový bok s kostí 1kg", price: 128, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřová žebra z boku/plochá 1kg", price: 104, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřová žebra z boku/speciál 1kg", price: 165, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřová žebra z pečeně a krkovice 1kg", price: 62, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřové koleno zadní s kostí 1kg", price: 85, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřové koleno zadní bez kosti 1kg", price: 115, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřové koleno přední s kostí 1kg", price: 71, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřové mleté maso 1kg", price: 133, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřové krájené kostky na guláš z plece 1kg", price: 134, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřová líčka 1kg", price: 259, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřová hlava půlená 1kg", price: 34, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřová kůže 1kg", price: 11, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřové nožičky 1kg", price: 29, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřové ocásky masité 1kg", price: 106, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřové palce z panenek 1kg", price: 174, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřové sádlo hřbetní 1kg", price: 74, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřový lalok 1kg", price: 94, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřový T-bone steak 400g", price: 197, unit: "kg", stock_status: "out_of_stock" },
      { name: "Vepřový ořez libový 1kg", price: 111, unit: "kg", stock_status: "out_of_stock" },
      { name: "Vepřová kostra 1kg", price: 106, unit: "kg", stock_status: "on_order" },
      { name: "Vepřová půlka 1kg", price: 96, unit: "kg", stock_status: "on_order" },
      { name: "Vepřová střeva 20m", price: 1236, unit: "ks", stock_status: "out_of_stock" },
    ],
    "veprove-droby": [
      { name: "Vepřová játra chl/mr 1kg", price: 62, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřová ledvina chl/mr 1kg", price: 48, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřové srdce chl/mr 1kg", price: 69, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřový jazyk chl/mr 1kg", price: 127, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřový žaludek chl/mr 1kg", price: 74, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřová krev 1kg", price: 43, unit: "kg", stock_status: "in_stock" },
    ],
    "teleci-maso": [
      { name: "Telecí kýta býk/kráva/mražená 1kg", price: 476, unit: "kg", stock_status: "in_stock" },
      { name: "Telecí kosti/mražené 1kg", price: 74, unit: "kg", stock_status: "in_stock" },
      { name: "Telecí plec býk/kráva/mražená 1kg", price: 342, unit: "kg", stock_status: "out_of_stock" },
      { name: "Telecí svíčková 1kg", price: 952, unit: "kg", stock_status: "on_order" },
    ],
    "kureci-maso": [
      { name: "Kuřecí prsa 1kg", price: 174, unit: "kg", stock_status: "in_stock", is_featured: true },
      { name: "Kuřecí stehna/200g až 240g/ 1kg", price: 103, unit: "kg", stock_status: "in_stock" },
      { name: "Kuřecí stehenní řízky bez kůže 1kg", price: 113, unit: "kg", stock_status: "in_stock" },
      { name: "Kuřecí čtvrtky chlazené 1kg", price: 53, unit: "kg", stock_status: "in_stock" },
      { name: "Kuřecí křídla 1kg", price: 53, unit: "kg", stock_status: "in_stock" },
      { name: "Kuřecí křídla bez letek 1kg", price: 85, unit: "kg", stock_status: "in_stock" },
      { name: "Kuřecí paličky 1kg", price: 76, unit: "kg", stock_status: "in_stock" },
      { name: "Kuře celé/1,2 až 1,5kg/ 1kg", price: 106, unit: "kg", stock_status: "in_stock" },
      { name: "Kuře chlazené/nekalibrované/ 1kg", price: 76, unit: "kg", stock_status: "in_stock" },
      { name: "Kuřecí roláda/vykoštěné kuře 1kg", price: 192, unit: "kg", stock_status: "in_stock" },
      { name: "Kuřecí prsa s.k. s kůží-supreme 1kg", price: 220, unit: "kg", stock_status: "in_stock" },
      { name: "Kuřecí prsa b.k. s kůží 1kg", price: 179, unit: "kg", stock_status: "out_of_stock" },
      { name: "Kuřecí špalíčky 1kg", price: 91, unit: "kg", stock_status: "on_order" },
      { name: "Kuřecí kostry 1kg", price: 35, unit: "kg", stock_status: "in_stock" },
      { name: "Kuřecí játra/tácek 0,5kg/ 1kg", price: 46, unit: "kg", stock_status: "in_stock" },
      { name: "Kuřecí srdce/tácek 0,5kg/ 1kg", price: 57, unit: "kg", stock_status: "in_stock" },
      { name: "Kuřecí žaludky/tácek 0,5kg/ 1kg", price: 53, unit: "kg", stock_status: "in_stock" },
    ],
    "mlete-maso-a-zavarka": [
      { name: "Mleté maso mix 50/50 1kg", price: 120, unit: "kg", stock_status: "in_stock" },
      { name: "Játrová zavářka 1kg", price: 105, unit: "kg", stock_status: "out_of_stock" },
    ],
    "ostatni-maso": [
      { name: "Husa/mražená/ 1kg", price: 301, unit: "kg", stock_status: "in_stock" },
      { name: "Husí stehna/mražená/ 1kg", price: 530, unit: "kg", stock_status: "out_of_stock" },
      { name: "Husokachna 3,4kg /mražená/ 1kg", price: 129, unit: "kg", stock_status: "out_of_stock" },
      { name: "Kachna 2,2-2,4kg /mražená/ 1kg", price: 118, unit: "kg", stock_status: "in_stock" },
      { name: "Kachní prsa bez kosti/mražené/ 1kg", price: 272, unit: "kg", stock_status: "in_stock" },
      { name: "Kachní čtvrtky /mražené/ 1kg", price: 195, unit: "kg", stock_status: "in_stock" },
      { name: "Kachní játra /bal. 0,5kg/mražená 1kg", price: 159, unit: "kg", stock_status: "in_stock" },
      { name: "Králík 1,3-1,4kg /mražený/ 1kg", price: 199, unit: "kg", stock_status: "in_stock" },
      { name: "Králičí stehna/mražená/ 1kg", price: 167, unit: "kg", stock_status: "in_stock" },
      { name: "Králičí hřbety /bal. 0,5kg/mražené 1kg", price: 224, unit: "kg", stock_status: "in_stock" },
      { name: "Slepice lehká 1,3kg /mražená/ 1kg", price: 83, unit: "kg", stock_status: "in_stock" },
      { name: "Slepice těžká/mražená/ 1kg", price: 101, unit: "kg", stock_status: "in_stock" },
      { name: "Krůtí prsa/chlazená/ 1kg", price: 298, unit: "kg", stock_status: "in_stock" },
      { name: "Krůtí stehenní plátek chl/mr 1kg", price: 212, unit: "kg", stock_status: "in_stock" },
      { name: "Krůtí palička chl/mr 1kg", price: 100, unit: "kg", stock_status: "in_stock" },
      { name: "Krůtí játra /mražené/ 1kg", price: 77, unit: "kg", stock_status: "in_stock" },
      { name: "Krůta chl/mr 1kg", price: 174, unit: "kg", stock_status: "out_of_stock" },
      { name: "Jehněčí koleno zadní 400-600g /mražené/ 1kg", price: 422, unit: "kg", stock_status: "in_stock" },
      { name: "Vepřové sele 1kg", price: 121, unit: "kg", stock_status: "on_order" },
    ],
    "hotovky": [
      { name: "Svíčková na smetaně 900ml", price: 178, unit: "ks", stock_status: "in_stock", weight_info: "900ml", is_featured: true, badge: "Top" },
      { name: "Hovězí guláš 900ml", price: 178, unit: "ks", stock_status: "in_stock", weight_info: "900ml", is_featured: true },
      { name: "Segedínský guláš 900ml", price: 178, unit: "ks", stock_status: "in_stock", weight_info: "900ml" },
      { name: "Koprová omáčka 900ml", price: 178, unit: "ks", stock_status: "in_stock", weight_info: "900ml" },
      { name: "Rajská omáčka 900ml", price: 178, unit: "ks", stock_status: "in_stock", weight_info: "900ml" },
      { name: "Štěpánská omáčka 900ml", price: 178, unit: "ks", stock_status: "in_stock", weight_info: "900ml" },
      { name: "Hamburská vepřová kýta 900ml", price: 178, unit: "ks", stock_status: "in_stock", weight_info: "900ml" },
      { name: "Hovězí roštěná na žampionech 900ml", price: 178, unit: "ks", stock_status: "out_of_stock", weight_info: "900ml" },
      { name: "Rozlítaný hovězí ptáček 900ml", price: 178, unit: "ks", stock_status: "in_stock", weight_info: "900ml" },
      { name: "Domácí papriková klobása 900ml", price: 178, unit: "ks", stock_status: "out_of_stock", weight_info: "900ml" },
      { name: "Mexické fazole 900ml", price: 178, unit: "ks", stock_status: "in_stock", weight_info: "900ml" },
      { name: "Gulášová polévka 900ml", price: 99, unit: "ks", stock_status: "in_stock", weight_info: "900ml" },
      { name: "Dršťková polévka 900ml", price: 99, unit: "ks", stock_status: "in_stock", weight_info: "900ml" },
      { name: "Bramborová s houbami 900ml", price: 99, unit: "ks", stock_status: "in_stock", weight_info: "900ml" },
      { name: "Čočková polévka 900ml", price: 99, unit: "ks", stock_status: "in_stock", weight_info: "900ml" },
      { name: "Frankfurtská s párkem 900ml", price: 99, unit: "ks", stock_status: "in_stock", weight_info: "900ml" },
      { name: "Hovězí vývar s játrovou zavářkou 900ml", price: 99, unit: "ks", stock_status: "in_stock", weight_info: "900ml" },
      { name: "Hovězí vývar s nudlemi 900ml", price: 99, unit: "ks", stock_status: "in_stock", weight_info: "900ml" },
      { name: "Kulajda 900ml", price: 99, unit: "ks", stock_status: "in_stock", weight_info: "900ml" },
      { name: "Kuřecí vývar s nudlemi 900ml", price: 99, unit: "ks", stock_status: "out_of_stock", weight_info: "900ml" },
    ],
  };

  let totalProducts = 0;
  let sortOrder = 1;

  for (const [catSlug, products] of Object.entries(productsByCategory)) {
    const categoryId = catMap[catSlug];
    if (!categoryId) {
      console.error(`✗ Kategorie '${catSlug}' nenalezena!`);
      continue;
    }

    const rows = products.map((p) => ({
      name: p.name,
      slug: slug(p.name),
      description: null,
      category_id: categoryId,
      price: p.price,
      unit: p.unit,
      weight_info: p.weight_info || null,
      image_url: null,
      gallery: null,
      stock_status: p.stock_status,
      is_active: true,
      is_featured: p.is_featured || false,
      badge: p.badge || null,
      sort_order: sortOrder++,
    }));

    const { data, error } = await supabase.from("products").insert(rows).select();
    if (error) {
      console.error(`✗ Produkty '${catSlug}':`, error.message);
    } else {
      console.log(`  ✓ ${catSlug}: ${data!.length} produktů`);
      totalProducts += data!.length;
    }
  }

  console.log(`\n✓ Celkem produktů: ${totalProducts}`);

  // ── 4. SITE SETTINGS ──
  const settings = [
    { key: "min_order_amount", value: { value: 1000 } },
    { key: "free_shipping_from", value: { value: 0 } },
    { key: "delivery_areas", value: { areas: ["Praha a okolí", "Praha-východ", "Mladá Boleslav", "Kladno", "Mělník", "Nymburk"] } },
    { key: "store_address", value: { company: "Masi-co s.r.o.", street: "Zahradní 466", zip: "250 64", city: "Měšice", region: "Praha-východ" } },
    { key: "contact", value: { email: "info@masi-co.cz", phone: "+420 123 456 789" } },
    { key: "social_links", value: { facebook: "", instagram: "", tiktok: "", website: "https://masi-co.cz" } },
    { key: "order_cutoff_time", value: { hour: 12, note: "Objednávky do 12:00 expedujeme tentýž den" } },
  ];

  const { error: settingsErr } = await supabase.from("site_settings").insert(settings);
  if (settingsErr) {
    console.error("✗ Site settings:", settingsErr.message);
  } else {
    console.log(`✓ Site settings: ${settings.length} záznamů`);
  }

  console.log("\n=== SEED DOKONČEN ===");
}

seed().catch(console.error);
