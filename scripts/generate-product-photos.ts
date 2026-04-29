/**
 * Product Photo Generator for MASI-CO (gpt-image-1 with smart reference selection)
 *
 * For each product, selects 6-10 best matching reference photos from existing
 * client photos in Supabase Storage (same category → sibling categories → fallback).
 * Falls back to images.generate() only when no references are available at all.
 *
 * Usage:  npx tsx scripts/generate-product-photos.ts
 */

import dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import OpenAI, { toFile } from "openai";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import { readFile } from "fs/promises";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const GPT_IMAGE_QUALITY: "low" | "medium" | "high" = "high";
const SIZE: "1024x1024" | "1024x1792" | "1792x1024" = "1024x1024";
const BATCH_LIMIT = 212; // Full run — all remaining products without photos.
const DELAY_MS = 15_000; // 15s between API calls
const OUTPUT_DIR = path.join(
  process.env.HOME || "~",
  "Downloads",
  "masi-co-generated"
);
const LOG_FILE = path.join(__dirname, "generation-log.txt");
const COST_PER_IMAGE = 0.17; // gpt-image-1 high quality

// ─── REFERENCE IMAGES — SMART SELECTION ─────────────────────────────────────

const REF_CACHE_DIR = path.join(__dirname, "reference-cache");
const FALLBACK_REF_DIR = path.join(__dirname, "reference-images");
const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MIN_REFS = 6;
const MAX_REFS = 10;

type RefProduct = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  image_url: string;
  localPath: string;
};

type CategoryFull = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
};

// Loaded at runtime in main()
let referencePool: RefProduct[] = [];
let allCategories: CategoryFull[] = [];
let fallbackRefPaths: string[] = [];

function loadFallbackRefs(): string[] {
  if (!fs.existsSync(FALLBACK_REF_DIR)) return [];
  return fs.readdirSync(FALLBACK_REF_DIR)
    .filter((f) => SUPPORTED_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort()
    .map((f) => path.join(FALLBACK_REF_DIR, f));
}

async function downloadRefToCache(imageUrl: string, slug: string): Promise<string | null> {
  const ext = path.extname(new URL(imageUrl).pathname) || ".jpg";
  const localPath = path.join(REF_CACHE_DIR, `${slug}${ext}`);

  if (fs.existsSync(localPath)) return localPath;

  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(localPath, buffer);
    return localPath;
  } catch (err: any) {
    log(`[WARN] Cannot download ref ${slug}: ${err.message}`);
    return null;
  }
}

function getSiblingCategoryIds(categoryId: string): string[] {
  const cat = allCategories.find((c) => c.id === categoryId);
  if (!cat) return [];

  if (cat.parent_id) {
    // Has parent → siblings are categories with same parent_id
    return allCategories
      .filter((c) => c.parent_id === cat.parent_id && c.id !== categoryId)
      .map((c) => c.id);
  }

  // Root category — define manual affinity groups
  const affinityMap: Record<string, string[]> = {
    "Ryby": ["Ostatní maso", "Zvěřina"],
    "Zvěřina": ["Ostatní maso", "Ryby"],
    "Uzené maso": ["Uzeniny"],
    "Ostatní maso": ["Zvěřina"],
  };

  const affinityNames = affinityMap[cat.name] || [];
  return allCategories
    .filter((c) => affinityNames.includes(c.name))
    .map((c) => c.id);
}

function getReferencesForProduct(product: { category_id: string; name: string }): {
  paths: string[];
  breakdown: string;
} {
  const sameCat = referencePool.filter((r) => r.category_id === product.category_id);
  const siblingIds = getSiblingCategoryIds(product.category_id);
  const siblingRefs = referencePool.filter((r) => siblingIds.includes(r.category_id));

  // Also check parent's other children (for droby → maso, etc.)
  const cat = allCategories.find((c) => c.id === product.category_id);
  let parentChildRefs: RefProduct[] = [];
  if (cat?.parent_id) {
    const parentChildIds = allCategories
      .filter((c) => c.parent_id === cat.parent_id && c.id !== product.category_id)
      .map((c) => c.id);
    parentChildRefs = referencePool.filter((r) => parentChildIds.includes(r.category_id));
  }

  // Build priority list: same category → siblings → parent's children → all
  const selected: RefProduct[] = [];
  const seen = new Set<string>();

  function addRefs(refs: RefProduct[], max: number) {
    for (const r of refs) {
      if (selected.length >= max || seen.has(r.id)) continue;
      seen.add(r.id);
      selected.push(r);
    }
  }

  addRefs(sameCat, MAX_REFS);
  if (selected.length < MIN_REFS) addRefs(siblingRefs, MAX_REFS);
  if (selected.length < MIN_REFS) addRefs(parentChildRefs, MAX_REFS);
  if (selected.length < MIN_REFS) addRefs(referencePool, MAX_REFS); // any ref

  // Build breakdown string
  const catName = (id: string) => allCategories.find((c) => c.id === id)?.name || "?";
  const countByCat: Record<string, number> = {};
  selected.forEach((r) => {
    const name = catName(r.category_id);
    countByCat[name] = (countByCat[name] || 0) + 1;
  });
  const breakdownParts = Object.entries(countByCat).map(([c, n]) => `${n} from ${c}`);

  let paths = selected.map((r) => r.localPath);

  // Fallback: if we have fewer than MIN_REFS, pad with scripts/reference-images/
  if (paths.length < MIN_REFS && fallbackRefPaths.length > 0) {
    const needed = Math.min(MIN_REFS - paths.length, fallbackRefPaths.length);
    const fallbackUsed = fallbackRefPaths.slice(0, needed);
    paths = [...paths, ...fallbackUsed];
    breakdownParts.push(`${needed} from fallback`);
  }

  // Cap at MAX_REFS
  paths = paths.slice(0, MAX_REFS);

  const breakdown = `${paths.length} refs total, ${breakdownParts.join(", ")}`;
  return { paths, breakdown };
}

// ─── CLIENTS ─────────────────────────────────────────────────────────────────

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const STORAGE_BUCKET = "products";

// ─── SLUGIFY ─────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── TIMESTAMP & LOG ─────────────────────────────────────────────────────────

function ts(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function log(msg: string) {
  const line = `[${ts()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + "\n");
}

// ─── CATEGORY → PROMPT TYPE ─────────────────────────────────────────────────

type PromptType =
  | "maso"
  | "uzeniny"
  | "uzene"
  | "hotovky"
  | "ryby"
  | "zverina"
  | "droby"
  | "ostatni";

const CATEGORY_TYPE_MAP: Record<string, PromptType> = {
  "Hovězí maso": "maso",
  "Vepřové maso": "maso",
  "Telecí maso": "maso",
  "Kuřecí maso": "maso",
  "Ostatní maso": "maso",
  Maso: "maso",
  "Mleté maso a zavářka": "maso",

  "Klobásy měkké": "uzeniny",
  "Klobásy trvanlivé": "uzeniny",
  "Párky a špekáčky": "uzeniny",
  Šunky: "uzeniny",
  "Salámy měkké": "uzeniny",
  "Salámy trvanlivé": "uzeniny",
  Uzeniny: "uzeniny",

  "Uzené maso": "uzene",
  Hotovky: "hotovky",
  Ryby: "ryby",
  Zvěřina: "zverina",
  "Hovězí droby": "droby",
  "Vepřové droby": "droby",
  "Ostatní sortiment": "ostatni",
};

// ─── PRODUCT NAME → ENGLISH TRANSLATION ─────────────────────────────────────

const TRANSLATION_MAP: Record<string, string> = {
  // ── Hovězí maso ──
  "Hovězí chuck roll 1kg": "beef chuck roll",
  "Hovězí Flank steak 1kg": "beef flank steak",
  "Hovězí kosti morkové 1kg": "beef marrow bones",
  "Hovězí kosti s klouby/řezané 1kg": "cut beef bones with joints",
  "Hovězí kosti/harfy 1kg": "beef rib bones",
  "Hovězí krájené kostky na guláš 1kg": "diced beef for goulash",
  "Hovězí líčka mražená 1kg": "frozen beef cheeks",
  "Hovězí mleté maso 1kg": "ground beef",
  "Hovězí oháňka 1kg": "beef oxtail cut into round cross-sections showing tail vertebrae and meat, NOT marrow bones, NOT knee joints",
  "Hovězí ořez-HPV 1kg": "beef trimmings",
  "Hovězí přední b.k. krk/býk 1kg": "boneless beef neck from bull",
  "Hovězí přední b.k. krk/kráva 1kg": "boneless beef neck from cow",
  "Hovězí přední kližka/býk 1kg": "beef front shin from bull",
  "Hovězí přední kližka/kráva 1kg": "beef front shin from cow",
  "Hovězí přední s kostí 1kg": "beef front quarter with bone",
  "Hovězí roštěná stařená 1kg": "dry-aged beef sirloin",
  "Hovězí roštěná/býk 1kg": "beef sirloin from bull",
  "Hovězí roštěná/kráva 1kg": "beef sirloin from cow",
  "Hovězí svíčková/býk 1kg": "long whole cylindrical beef tenderloin muscle from bull, intact loin shape, NOT a flat steak",
  "Hovězí svíčková/kráva 1kg": "beef tenderloin from cow",
  "Hovězí zadní b.k./býk 1kg": "boneless beef rump from bull",
  "Hovězí zadní b.k./kráva 1kg": "boneless beef rump from cow",
  "Hovězí zadní plec/býk 1kg": "beef rear shoulder from bull",
  "Hovězí zadní plec/kráva 1kg": "beef rear shoulder from cow",
  "Hovězí zadní spodní šál 1kg": "beef bottom round",
  "Hovězí zadní vrchní šál 1kg": "beef top round",
  "Hovězí zadní/falešná svíčková 1kg": "beef eye of round (false tenderloin)",
  "Hovězí zadní/váleček 1kg": "beef round roll",

  // ── Vepřové maso ──
  "Vepřová hlava půlená 1kg": "raw butcher cuts of cheek and jowl meat from a pork head, lean pink pork meat pieces neatly arranged on butcher paper, NOT a whole or halved head, NOT showing skull, eyes, ears, or brain, professional product photography",
  "Vepřová kostra 1kg": "pork carcass bones",
  "Vepřová krkovice bez kosti 1kg": "boneless pork neck collar",
  "Vepřová krkovice s kostí 1kg": "pork neck collar with bone",
  "Vepřová kůže 1kg": "pork skin",
  "Vepřová kýta bez kosti 1kg": "boneless pork leg",
  "Vepřová kýta plátkovaná 1kg": "sliced pork leg",
  "Vepřová kýta/nudličky 1kg": "raw pork leg pre-cut into thin uniform strips, multiple visible strips of meat in a pile, NOT a whole muscle chunk",
  "Vepřová líčka 1kg": "pork cheeks",
  "Vepřová panenka chlazená 1kg": "chilled pork tenderloin",
  "Vepřová pečeně bez kosti 1kg": "boneless pork roast",
  "Vepřová pečeně s kostí 1kg": "pork roast with bone",
  "Vepřová pečeně s kostí/sekané 1kg": "pork roast with bone, chopped",
  "Vepřová plec bez kosti 1kg": "boneless pork shoulder",
  "Vepřová půlka 1kg": "pork half carcass",
  "Vepřová střeva 20m": "pork casings, natural sausage casing",
  "Vepřová žebra z boku/plochá 1kg": "flat pork side ribs",
  "Vepřová žebra z boku/speciál 1kg": "special cut pork side ribs",
  "Vepřová žebra z pečeně a krkovice 1kg": "pork ribs from roast and neck",
  "Vepřové koleno přední s kostí 1kg": "front pork knuckle with bone",
  "Vepřové koleno zadní bez kosti 1kg": "boneless rear pork knuckle",
  "Vepřové koleno zadní s kostí 1kg": "rear pork knuckle with bone",
  "Vepřové krájené kostky na guláš z plece 1kg": "diced pork shoulder for goulash",
  "Vepřové mleté maso 1kg": "ground pork",
  "Vepřové nožičky 1kg": "multiple raw pork trotters (pig feet) with hooves, cleaned, traditional Czech butcher product, normal pig anatomy, NO human-hand distortion",
  "Vepřové ocásky masité 1kg": "multiple raw meaty pork tails laid in a small pile, recognizable curly tail shape, traditional Czech butcher product",
  "Vepřové palce z panenek 1kg": "pork tenderloin medallions",
  "Vepřové sádlo hřbetní 1kg": "pork back fat",
  "Vepřové sele 1kg": "vacuum-packed raw pork shoulder portion from a young pig, rosy pink raw pork meat, NOT a whole carcass, NOT a piglet, NOT showing skin or limbs, professional butcher product photography",
  "Vepřový bok bez kosti 1kg": "boneless pork belly",
  "Vepřový bok s kostí 1kg": "pork belly with bone",
  "Vepřový lalok 1kg": "pork jowl",
  "Vepřový ořez libový 1kg": "lean pork trimmings",
  "Vepřový T-bone steak 400g": "pork T-bone steak",

  // ── Telecí maso ──
  "Telecí kosti/mražené 1kg": "frozen veal bones",
  "Telecí kýta býk/kráva/mražená 1kg": "frozen veal leg",
  "Telecí plec býk/kráva/mražená 1kg": "frozen veal shoulder",
  "Telecí svíčková 1kg": "long whole cylindrical veal tenderloin muscle, intact loin shape",

  // ── Kuřecí maso ──
  "Kuře celé/1,2 až 1,5kg/ 1kg": "whole chicken",
  "Kuře chlazené/nekalibrované/ 1kg": "chilled whole chicken",
  "Kuřecí čtvrtky chlazené 1kg": "chilled chicken quarters",
  "Kuřecí játra/tácek 0,5kg/ 1kg": "pile of multiple small fresh raw chicken liver lobes, NOT a single large piece",
  "Kuřecí kostry 1kg": "raw chicken backbone frames in a stack (rib cage and spine only, without breast meat or legs), traditional butcher carcass leftovers",
  "Kuřecí křídla 1kg": "stack of multiple separated raw chicken wings in a pile, NOT a whole chicken",
  "Kuřecí křídla bez letek 1kg": "chicken wings without tips",
  "Kuřecí paličky 1kg": "chicken drumsticks",
  "Kuřecí prsa 1kg": "raw chicken pectoral fillet, boneless white poultry meat cut",
  "Kuřecí prsa b.k. s kůží 1kg": "raw boneless chicken pectoral fillet with skin, white poultry meat",
  "Kuřecí prsa s.k. s kůží-supreme 1kg": "raw chicken supreme pectoral cut with bone and skin, white poultry meat",
  "Kuřecí roláda/vykoštěné kuře 1kg": "chicken roulade, deboned whole chicken",
  "Kuřecí špalíčky 1kg": "chicken leg portions",
  "Kuřecí srdce/tácek 0,5kg/ 1kg": "chicken hearts",
  "Kuřecí stehenní řízky bez kůže 1kg": "skinless chicken thigh cutlets",
  "Kuřecí stehna/200g až 240g/ 1kg": "chicken thighs",
  "Kuřecí žaludky/tácek 0,5kg/ 1kg": "chicken gizzards",

  // ── Ostatní maso ──
  "Husa/mražená/ 1kg": "frozen whole plucked goose carcass, headless, raw poultry ready to cook",
  "Husí stehna/mražená/ 1kg": "stack of multiple frozen separated goose drumsticks and thighs, individual leg portions, NOT whole birds",
  "Husokachna 3,4kg /mražená/ 1kg": "frozen Muscovy duck",
  "Jehněčí koleno zadní 400-600g /mražené/ 1kg": "frozen rear lamb shank",
  "Kachna 2,2-2,4kg /mražená/ 1kg": "frozen whole plucked duck carcass, headless, raw poultry ready to cook",
  "Kachní čtvrtky /mražené/ 1kg": "multiple frozen separated duck quarter portions (leg with thigh attached), individual pieces in a pile, NOT whole birds",
  "Kachní játra /bal. 0,5kg/mražená 1kg": "frozen duck liver",
  "Kachní prsa bez kosti/mražené/ 1kg": "frozen raw boneless duck pectoral fillet, dark poultry meat cut",
  "Králičí hřbety /bal. 0,5kg/mražené 1kg": "frozen rabbit backs",
  "Králičí stehna/mražená/ 1kg": "frozen rabbit legs",
  "Králík 1,3-1,4kg /mražený/ 1kg": "neat raw rabbit fillet portions on butcher paper, multiple cleaned boneless meat pieces, pale rosy raw rabbit meat, NOT a whole carcass, NOT showing limbs, head, or rib cage, professional butcher product photography",
  "Krůta chl/mr 1kg": "whole plucked headless turkey carcass, raw poultry, butchered, ready to cook",
  "Krůtí játra /mražené/ 1kg": "frozen turkey liver",
  "Krůtí palička chl/mr 1kg": "turkey drumstick",
  "Krůtí prsa/chlazená/ 1kg": "chilled raw turkey pectoral fillet, boneless white poultry meat cut",
  "Krůtí stehenní plátek chl/mr 1kg": "turkey thigh steak",
  "Slepice lehká 1,3kg /mražená/ 1kg": "frozen light hen",
  "Slepice těžká/mražená/ 1kg": "frozen heavy stewing hen",

  // ── Mleté maso a zavářka ──
  "Játrová zavářka 1kg": "liver dumpling stuffing",
  "Mleté maso mix 50/50 1kg": "mixed ground meat 50/50 beef and pork",

  // ── Hovězí droby ──
  "Hovězí býčí žlázy 1kg": "fresh raw beef sweetbreads (bull thymus glands), creamy pale pink soft smooth lobes, NOT brain tissue, NO convoluted or folded texture",
  "Hovězí dršťky syrové chl/mr 1kg": "raw beef tripe",
  "Hovězí dršťky/předvařené 1kg": "pre-cooked beef tripe",
  "Hovězí játra 1kg": "beef liver",
  "Hovězí jazyk chl/mr 1kg": "beef tongue",
  "Hovězí srdce chl/mr 1kg": "beef heart",

  // ── Vepřové droby ──
  "Vepřová játra chl/mr 1kg": "pork liver",
  "Vepřová krev 1kg": "fresh red pork blood as viscous liquid filling a clear glass jar, liquid surface visible, NOT solid meat",
  "Vepřová ledvina chl/mr 1kg": "pork kidney",
  "Vepřové srdce chl/mr 1kg": "pork heart",
  "Vepřový jazyk chl/mr 1kg": "pork tongue",
  "Vepřový žaludek chl/mr 1kg": "pork stomach",

  // ── Uzené maso ──
  "Anglická slanina/bal. cca 1,5-2,5kg/ 1kg": "English smoked bacon slab",
  "Kuřecí stehna uzená/bal. cca 1-1,5kg/ 1kg": "smoked chicken legs",
  "Oravská slanina krájená/bal. cca 0,5kg/ 1kg": "sliced Orava smoked bacon",
  "Uzená krkovice b.k./bal. cca 1-1,5kg/ 1kg": "boneless smoked pork neck",
  "Uzená kýta s kostí/bal. cca 10-12kg/ 1kg": "smoked pork leg with bone",
  "Uzená plec b.k./bal. cca 1kg": "boneless smoked pork shoulder",
  "Uzená slanina/špek/bal. cca 1-2,5kg/ 1kg": "smoked bacon slab",
  "Uzená žebra z boku 1kg": "smoked side ribs",
  "Uzené koleno přední s.k./bal. cca 1-1,5kg/ 1kg": "smoked front pork knuckle with bone",
  "Uzené koleno zadní s.k./bal. cca 1-1,5kg/ 1kg": "smoked rear pork knuckle with bone",
  "Uzené ocásky/bal. cca 1-1,5kg/ 1kg": "smoked pork tails",
  "Uzené žebra z pečeně a krkovice 1kg": "smoked ribs from roast and neck",
  "Uzený bok b.k./bal. cca 1kg": "boneless smoked pork belly",
  "Uzený jazyk hovězí/bal. cca 1-1,5kg/ 1kg": "smoked beef tongue",

  // ── Klobásy měkké ──
  "Apetito/bal. cca 1,5kg/ 1kg": "Apetito soft sausage",
  "Čertovská klobása/bal. cca 1,5kg/ 1kg": "spicy devil sausage",
  "Hajšova klobása/bal. cca 1,5kg/ 1kg": "Hajš traditional sausage",
  "Papriková klobása/bal. cca 2kg/ 1kg": "paprika sausage",
  "Klobása Jalapenos se sýrem/bal. cca 0.5kg/ 1kg": "jalapeño and cheese sausage",
  "Pikantní klobása/bal. cca 0.5kg/ 1kg": "spicy sausage",
  "Šunková klobása/bal. cca 1,5kg/ 1kg": "ham sausage",
  "Vinná klobása 1kg": "wine sausage",
  "Zbojnická klobása/bal. cca 2kg/ 1kg": "Zbojnická robber-style sausage",

  // ── Párky a špekáčky ──
  "Debrecínské párky/bal. cca 1.5kg/ 1kg": "Debrecen-style frankfurters",
  "Esso luxus párky/bal. cca 1.5kg/ 1kg": "Esso luxury frankfurters",
  "Javořické párky/bal. cca 1.5kg/ 1kg": "Javořice frankfurters",
  "Jemné párky/bal. cca 1.5kg/ 1kg": "fine frankfurters",
  "Koktejlové kuřecí párky/bal. cca 1.5kg/ 1kg": "cocktail chicken frankfurters",
  "Libový párek/bal. cca 1.5kg/ 1kg": "lean frankfurter",
  "Špekáčky/bal. cca 1.5kg/ 1kg": "Czech BBQ sausages (špekáčky)",
  "Točený salám Slovenský/bal. cca 1.5kg/ 1kg": "Slovak twisted salami",
  "Vídeňské párky/bal. cca 1.5kg/ 1kg": "Vienna sausages (wieners)",

  // ── Šunky ──
  "Burgundská od kosti/bal. cca 1-1,5kg/ 1kg": "Burgundy ham off the bone",
  "Debrecínská pečeně/bal. cca 2-2,5kg/ 1kg": "Debrecen-style roasted ham",
  "Kladenská pečeně/bal. cca 2kg/ 1kg": "Kladno-style roasted ham",
  "Moravské uzené maso/bal. cca 1kg": "Moravian smoked ham",
  "Schinkenspeck/bal. cca 1kg": "Schinkenspeck smoked ham",
  "Šunka Bohemia/bal. cca 3-3,5kg/ 1kg": "Bohemia premium ham",
  "Šunka dušená výběr/bal. cca 3-3,5kg/ 1kg": "steamed select premium ham",
  "Šunka kuřecí/bal. cca 3-3,5kg/ 1kg": "chicken ham",
  "Šunka Mandolína/bal. cca 1-1,5kg/ 1kg": "Mandolina pressed ham",
  "Šunka pizza/bal. cca 3-3,5kg/ 1kg": "pizza ham",
  "Šunka standart krájená/bal. 1kg": "standard sliced ham",
  "Šunka standart/bal. cca 3-3,5kg/ 1kg": "standard deli ham block",

  // ── Salámy měkké ──
  "Gothaj/bal. cca 2,5kg/ 1kg": "Gothaj bologna-style salami",
  "Junior/bal. cca 2kg/ 1kg": "Junior soft salami",
  "Mortadela/bal. cca 3kg/ 1kg": "Mortadella",
  "Šunkový salám/bal. cca 2,5kg/ 1kg": "ham salami",

  // ── Salámy trvanlivé ──
  "Chorizo/bal. cca 1kg": "Chorizo sausage",
  "Herkules/bal. cca 0,8kg/ 1kg": "Herkules dry-cured salami",
  "Lovecký salám/bal. cca 0,5kg/ 1kg": "Hunter's dry salami",
  "Pálivý paprikový salám/bal. cca 0,8kg/ 1kg": "spicy paprika dry salami",
  "Paprikáš/bal. cca 0,8kg/ 1kg": "Paprikáš dry salami",
  "Poličan/bal. cca 0,8kg/ 1kg": "Poličan dry salami",
  "Polický uherák/bal. cca 0,8kg/ 1kg": "Polička Hungarian dry salami",
  "Rio Ebro/bal. cca 2,5kg/ 1kg": "Rio Ebro dry salami",
  "Turistický salám/bal. cca 0,8kg/ 1kg": "Tourist dry salami",
  "Vysočina/bal. cca 0,8kg/ 1kg": "Vysočina dry salami",
  "Živická klobása/bal. cca 1kg/ 1kg": "Živická dry sausage",

  // ── Hotovky ──
  "Bramborová s houbami 900ml": "potato soup with mushrooms in jar",
  "Čočková polévka 900ml": "lentil soup in jar",
  "Domácí papriková klobása 900ml": "homemade paprika sausage in jar",
  "Dršťková polévka 900ml": "tripe soup in jar",
  "Frankfurtská s párkem 900ml": "Frankfurt sausage soup in jar",
  "Gulášová polévka 900ml": "goulash soup in jar",
  "Hamburská vepřová kýta 900ml": "Hamburg-style pork leg stew in jar",
  "Hovězí guláš 900ml": "beef goulash in jar",
  "Hovězí roštěná na žampionech 900ml": "beef sirloin with mushroom sauce in jar",
  "Hovězí vývar s játrovou zavářkou 900ml": "beef broth with liver dumplings in jar",
  "Hovězí vývar s nudlemi 900ml": "beef broth with noodles in jar",
  "Koprová omáčka 900ml": "dill cream sauce in jar",
  "Kulajda 900ml": "kulajda Czech mushroom soup in jar",
  "Kuřecí vývar s nudlemi 900ml": "chicken broth with noodles in jar",
  "Mexické fazole 900ml": "Mexican-style beans in jar",
  "Rajská omáčka 900ml": "tomato sauce in jar",
  "Rozlítaný hovězí ptáček 900ml": "deconstructed beef roulade in jar",
  "Segedínský guláš 900ml": "Szegedín goulash with sauerkraut in jar",
  "Štěpánská omáčka 900ml": "Štěpánská beef cream sauce in jar",
  "Svíčková na smetaně 900ml": "svíčková beef in cream sauce in jar",
  "Vepřové na žampionech 900ml": "pork with mushroom sauce in jar",
  "Zelňačka 900ml": "Czech cabbage soup in jar",
  "Znojemská omáčka 900ml": "Znojmo-style pickle sauce in jar",

  // ── Ryby ──
  "Filet treska/mraženo/ 1kg": "frozen cod fillet",
  "Pangasius filet bal. 5kg/mraženo/ 1kg": "frozen pangasius fillet",
  "Pstruh 250-300g/mraženo/ 1kg": "frozen whole trout",
  "Rybí file kostky 100gr/mraženo/ 1kg": "frozen fish fillet cubes",
  "Treska obalovaná/mraženo/ 1kg": "breaded cod fillet",

  // ── Zvěřina ──
  "Daňčí kýta/mraženo/ 1kg": "fallow deer leg",
  "Kančí krkovice/mraženo/ 1kg": "wild boar neck",
  "Kančí kýta/mraženo/ 1kg": "wild boar leg",
  "Kančí plec/mraženo/ 1kg": "wild boar shoulder",
  "Srnčí kýta/mraženo/ 1kg": "roe deer leg",
  "Srnčí plec/mraženo/ 1kg": "roe deer shoulder",
  "Zvěřina na guláš/mraženo/ 1kg": "wild game meat for goulash",

  // ── Ostatní sortiment ──
  "Americké brambory/bal. cca 2,5kg/ 1kg": "American-style potato wedges",
  "Aspik šunkový s brokolicí/bal. cca 2kg/ 1kg": "ham aspic with broccoli",
  "Babiččina sekaná/bal. cca 2kg/ 1kg": "grandmother's meatloaf",
  "Bramborák český/bal. 25ks/ 1ks": "Czech potato pancake (bramborák)",
  "Bramborové tolary Kaizer/bal. cca 2,5kg/ 1kg": "Kaiser potato medallions",
  "Brokolice růžičky/bal. cca 2,5kg/ 1kg": "broccoli florets",
  "Čínská směs/bal. cca 2,5kg/ 1kg": "Chinese vegetable stir-fry mix",
  "Česnek drcený/bal. cca 1kg": "crushed garlic",
  "Eidam 30%/bal. cca 3kg/ 1kg": "Edam cheese 30% fat",
  "Eidam uzený/bal. cca 3kg/ 1kg": "smoked Edam cheese",
  "Fazolové lusky celé/bal. cca 2,5kg/ 1kg": "whole green beans",
  "Fazolové lusky řezané/bal. cca 2,5kg/ 1kg": "cut green beans",
  "Francouzská zeleninová směs/bal. cca 2,5kg/ 1kg": "French vegetable mix",
  "Hranolky 9x9/bal. cca 2,5kg/ 1kg": "French fries 9x9mm cut",
  "Hranolky Julianne 6x6/bal. cca 2,5kg/ 1kg": "Julienne fries 6x6mm cut",
  "Hranolky steak house/bal. cca 2,5kg/ 1kg": "steak house thick-cut fries",
  "Hrášek mražený/bal. cca 2,5kg/ 1kg": "frozen green peas",
  "Husí paštika/bal. cca 2kg/ 1kg": "goose pâté",
  "Játrový sýr-stříbrná cihla/bal. cca 1kg": "liver cheese (Leberkäse) block",
  "Jelítkový prejt mražený/bal. cca 2,5kg/ 1kg": "frozen blood sausage stuffing",
  "Jitrnice/jelita 1kg": "Czech liver sausage (jitrnice)",
  "Jitrnicový prejt mražený/bal. cca 2,5kg/ 1kg": "frozen liver sausage stuffing",
  "Kapusta řezaná/bal. cca 2,5kg/ 1kg": "sliced sauerkraut",
  "Knedlík bramborový /500g/ 1ks": "Czech potato dumpling",
  "Knedlík houskový /550g/1ks": "Czech bread dumpling (houskový knedlík)",
  "Krokety/bal. cca 2,5kg/ 1kg": "potato croquettes",
  "Kukuřice zrno/bal. cca 2,5kg/ 1kg": "corn kernels",
  "Květák na obalení/bal. cca 2,5kg/ 1kg": "cauliflower florets for breading",
  "Lečo zelenina/bal. cca 2,5kg/ 1kg": "lecho vegetable mix (peppers, tomatoes, onion)",
  "Mrkev-baby/bal. cca 2,5kg/ 1kg": "baby carrots",
  "Niva EXCLUSIVE/bal. cca 2,5kg/ 1kg": "Niva blue cheese",
  "Polévková směs/bal. cca 2,5kg/ 1kg": "soup vegetable mix",
  "Pórek řezaný/bal. cca 2,5kg/ 1kg": "sliced leeks",
  "Přílohová směs s kukuřicí/bal. cca 2,5kg/ 1kg": "side dish vegetable mix with corn",
  "Škvarky Selské 1kg": "farmhouse pork cracklings",
  "Škvařené sádlo-kyblík/bal. 3kg/ 1kg": "rendered pork lard in bucket",
  "Škvařené sádlo-rukáv/bal. 3kg/ 1kg": "rendered pork lard in sleeve",
  "Špenát granule/bal. cca 2,5kg/ 1kg": "frozen spinach granules",
  "Špenát/bal. cca 2,5kg/ 1kg": "frozen leaf spinach",
  "Světlá delikates/bal. cca 2kg/ 1kg": "light delicatessen meat (tlačenka)",
  "Světlá tlačenka/bal. cca 4kg/ 1kg": "light head cheese (tlačenka)",
  "Žampiony mražené-plátky/bal. cca 2,5kg/ 1kg": "frozen sliced mushrooms",
  "Zelenina pod svíčkovou/bal. cca 2,5kg/ 1kg":
    "root vegetables for svíčková sauce (carrots, parsnip, celery)",
};

// ─── PROMPTS ────────────────────────────────────────────────────────────────

const NEGATIVE = "IMPORTANT: No text, no letters, no labels, no logos, no writing, no typography anywhere in the image. No packaging with labels. No brand names.";

function buildPrompt(productNameEN: string, productNameCZ: string, type: PromptType): string {
  const lowerEN = productNameEN.toLowerCase();
  const isFrozen =
    lowerEN.includes("frozen") || productNameCZ.toLowerCase().includes("mražen");
  const isWholeAnimal =
    lowerEN.includes("carcass") ||
    /\bwhole\b/.test(lowerEN);
  const isGround = lowerEN.includes("ground");
  const frostyGuard = isFrozen
    ? " Clean professional product shot, NO ice crystals or freezer-burn distortion on meat surface, NO snow or frost coating the flesh."
    : "";
  const liveAnimalGuard =
    isWholeAnimal
      ? " The animal MUST be butchered, plucked, headless, and laid out as a raw cooking-ready carcass. NEVER show a live animal."
      : "";

  switch (type) {
    case "maso":
      if (isGround) {
        return `A handful of fresh raw ${productNameEN} held by a butcher's hand in a black nitrile glove or laid on butcher paper. The ground meat must show uniform fresh ground texture with visible meat fibers and no convoluted, brain-like, or AI-distorted patterns. In the same professional studio photography style as the reference images. Dark background, dramatic lighting, minimalist composition.${frostyGuard} ${NEGATIVE}`;
      }
      if (isWholeAnimal) {
        return `${productNameEN}, laid out flat on butcher paper as a raw carcass ready for cooking. In the same professional studio photography style as the reference images. Dark background, dramatic lighting, minimalist composition.${liveAnimalGuard}${frostyGuard} ${NEGATIVE}`;
      }
      return `A piece of raw ${productNameEN} held by a butcher's hand in a black nitrile glove, in the same professional studio photography style as the reference images. Dark background, dramatic lighting, minimalist composition.${frostyGuard} ${NEGATIVE}`;

    case "uzeniny":
      return `A ${productNameEN} placed on a rustic dark wooden cutting board with scattered sea salt, peppercorns, rosemary and bay leaf, in the same professional studio photography style as the reference images. Dark background, dramatic lighting. Show sausages/meat directly without any plastic packaging, without any labels, without any branded wrapping. Just the meat product on the wooden board with scattered salt, peppercorns, rosemary, bay leaf. ${NEGATIVE}`;

    case "uzene":
      return `Smoked ${productNameEN} hanging on a steel butcher's hook, held by a hand in black nitrile glove, in the same professional studio photography style as the reference images. Dark background, warm amber tones. Show the meat directly without any plastic packaging, without any labels, without any branded wrapping. ${NEGATIVE}`;

    case "hotovky": {
      const labelText = productNameCZ.replace(/\s*\d+\s*ml\s*$/i, "").toUpperCase();
      return `A single clear glass jar 900ml filled with Czech traditional ${productNameEN}, white red-checkered fabric cover on top tied with rustic string. The jar wears a prominent rectangular paper label on the front, centered, clearly readable. The label has bold red "MASI-CO ŘEZNICTVÍ" branding at the top and the product name "${labelText}" below it in clean black serif typography on cream-colored paper. Both lines must be sharp, legible, correctly spelled and centered. In the same professional studio photography style as the reference images. Pitch black background, dramatic low-key studio lighting from the side creating rim light on glass, warm tones inside jar, minimalist composition, single subject only.`;
    }

    case "ryby":
      return `Raw ${productNameEN} on a dark wet slate surface with crushed ice, in the same professional studio photography style as the reference images. Dark background, dramatic lighting, glistening fish skin. ${NEGATIVE}`;

    case "zverina":
      if (isWholeAnimal) {
        return `${productNameEN}, laid out flat on butcher paper as a raw carcass ready for cooking. In the same professional studio photography style as the reference images. Dark background, dramatic lighting, rich meat tones, minimalist composition.${liveAnimalGuard}${frostyGuard} ${NEGATIVE}`;
      }
      return `A piece of raw wild game ${productNameEN} held by a hand in a black nitrile glove, in the same professional studio photography style as the reference images. Dark background, dramatic lighting, rich meat tones.${frostyGuard} ${NEGATIVE}`;

    case "droby":
      return `Fresh raw ${productNameEN} placed on a dark slate board, in the same professional studio photography style as the reference images. Dark background, dramatic lighting, minimalist composition, single subject only.${frostyGuard} ${NEGATIVE}`;

    case "ostatni":
      return `${productNameEN} placed on a dark wooden board, in the same professional studio photography style as the reference images. Dark background, dramatic lighting, minimalist composition. ${NEGATIVE}`;
  }
}

// ─── TRANSLATE PRODUCT NAME ──────────────────────────────────────────────────

function translateProduct(name: string): string {
  if (TRANSLATION_MAP[name]) return TRANSLATION_MAP[name];

  const fallback = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\//g, " ")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim();

  return fallback + " (Czech meat product)";
}

// ─── ENSURE BUCKET EXISTS ────────────────────────────────────────────────────

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === STORAGE_BUCKET);

  if (!exists) {
    const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: true,
    });
    if (error) {
      log(`[ERROR] Could not create bucket "${STORAGE_BUCKET}": ${error.message}`);
      throw error;
    }
    log(`[OK] Created public bucket "${STORAGE_BUCKET}"`);
  }
}

// ─── UPLOAD TO SUPABASE ──────────────────────────────────────────────────────

async function uploadToSupabase(
  localPath: string,
  storagePath: string
): Promise<string> {
  const fileBuffer = fs.readFileSync(localPath);

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);

  return publicUrl;
}

// ─── SLEEP ───────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
};

async function main() {
  // ── SAFETY GUARD ──────────────────────────────────────────────────────────
  // Past incident (2026-04-28): script regenerated AI photos for 18 hotovky
  // products that had been manually nullified by `image_url = NULL`. Real DSC
  // originals (in storage) were left orphaned and the user only realized days
  // later. Required: explicit --i-know-this-overwrites flag on every run.
  // See scripts/_restore-hotovky-dsc.js for recovery script and the AI
  // photo audit doc for the full timeline.
  if (!process.argv.includes("--i-know-this-overwrites")) {
    console.error("=".repeat(70));
    console.error("REFUSING TO RUN — generate-product-photos.ts");
    console.error("");
    console.error("This script will REPLACE every product's image_url where it is NULL.");
    console.error("If any product had its image_url nullified by mistake, real DSC photos");
    console.error("will be silently overwritten with AI versions. This has happened before.");
    console.error("");
    console.error("Before running:");
    console.error("  1) Audit which products have image_url = NULL — do they SHOULD be NULL?");
    console.error("  2) Check Supabase Storage for orphan DSC*.jpg files that need restoring.");
    console.error("  3) If safe, re-run with: --i-know-this-overwrites");
    console.error("=".repeat(70));
    process.exit(1);
  }

  log("=".repeat(60));
  log("MASI-CO Product Photo Generator — SMART REFERENCES");
  log(`Mode: images.edit() with per-product reference selection (gpt-image-1)`);
  log(`Quality: ${GPT_IMAGE_QUALITY}, Size: ${SIZE}, Batch: ${BATCH_LIMIT}, Cost/img: ~$${COST_PER_IMAGE}`);
  log("=".repeat(60));

  // Ensure output dirs
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(REF_CACHE_DIR, { recursive: true });

  // Ensure storage bucket
  await ensureBucket();

  // Load fallback references from scripts/reference-images/
  fallbackRefPaths = loadFallbackRefs();
  log(`Fallback references: ${fallbackRefPaths.length} (${fallbackRefPaths.map((p) => path.basename(p)).join(", ")})`);

  // Fetch categories with parent_id
  const { data: rawCategories, error: catErr } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id");

  if (catErr || !rawCategories) {
    log(`[FATAL] Cannot fetch categories: ${catErr?.message}`);
    process.exit(1);
  }

  allCategories = rawCategories as CategoryFull[];
  const catById = new Map(allCategories.map((c) => [c.id, c]));

  // ── Load reference pool: all products WITH image_url ──
  log("");
  log("Loading reference pool...");

  const { data: rawRefProducts, error: refErr } = await supabase
    .from("products")
    .select("id, name, slug, category_id, image_url")
    .not("image_url", "is", null)
    .neq("image_url", "");

  if (refErr) {
    log(`[WARN] Cannot fetch reference products: ${refErr.message}`);
  }

  const refProducts = (rawRefProducts || []) as Array<{
    id: string; name: string; slug: string; category_id: string; image_url: string;
  }>;

  // Download all reference photos to local cache
  for (const ref of refProducts) {
    const localPath = await downloadRefToCache(ref.image_url, ref.slug);
    if (localPath) {
      referencePool.push({ ...ref, localPath });
    }
  }

  // Log reference distribution
  const refByCat: Record<string, number> = {};
  referencePool.forEach((r) => {
    const catName = catById.get(r.category_id)?.name || "?";
    refByCat[catName] = (refByCat[catName] || 0) + 1;
  });

  log(`Reference pool: ${referencePool.length} products cached`);
  Object.entries(refByCat)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, cnt]) => log(`  ${cat}: ${cnt}`));

  if (referencePool.length === 0 && fallbackRefPaths.length === 0) {
    log("[FATAL] No reference images available (pool empty, no fallback)");
    process.exit(1);
  }

  // ── Fetch products without images ──
  const { data: rawProducts, error: prodErr } = await supabase
    .from("products")
    .select("id, name, slug, category_id")
    .is("image_url", null)
    .order("category_id")
    .order("name");

  if (prodErr || !rawProducts) {
    log(`[FATAL] Cannot fetch products: ${prodErr?.message}`);
    process.exit(1);
  }

  const products = (rawProducts as ProductRow[]).slice(0, BATCH_LIMIT);

  log("");
  log(`Found ${rawProducts.length} products without photos, processing ${products.length}`);

  // Stats
  let generated = 0;
  let skipped = 0;
  let uploaded = 0;
  let errors = 0;
  const startTime = Date.now();

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const category = catById.get(product.category_id);
    const categorySlug = category?.slug || "bez-kategorie";
    const categoryName = category?.name || "Ostatní sortiment";
    const productSlug = slugify(product.name);
    const storagePath = `${categorySlug}/${productSlug}.png`;
    const localDir = path.join(OUTPUT_DIR, categorySlug);
    const localPath = path.join(localDir, `${productSlug}.png`);

    log(`[${i + 1}/${products.length}] ${product.name} (${categoryName})`);

    // Resume: if file exists locally, skip generation
    if (fs.existsSync(localPath)) {
      log(`[SKIP] Already exists locally: ${storagePath}`);

      try {
        const publicUrl = await uploadToSupabase(localPath, storagePath);
        await supabase
          .from("products")
          .update({ image_url: publicUrl })
          .eq("id", product.id);
        log(`[OK] Uploaded existing file & updated DB: ${storagePath}`);
        uploaded++;
      } catch (err: any) {
        log(`[ERROR] Upload/DB update failed for ${product.name}: ${err.message}`);
        errors++;
      }

      skipped++;
      continue;
    }

    // Determine prompt type
    const promptType = CATEGORY_TYPE_MAP[categoryName] || "ostatni";
    const englishName = translateProduct(product.name);
    const prompt = buildPrompt(englishName, product.name, promptType);

    // Smart reference selection
    const { paths: refPaths, breakdown } = getReferencesForProduct(product);
    const useReferenceImages = refPaths.length > 0;

    try {
      log(`  Type: ${promptType} | EN: "${englishName}"`);
      log(`  Refs: ${useReferenceImages ? breakdown : "NONE (generate)"}`);

      let imgBuffer: Buffer;

      if (useReferenceImages) {
        // images.edit() with smart-selected reference photos
        const refFiles = await Promise.all(
          refPaths.map(async (filePath) => {
            const buffer = await readFile(filePath);
            const ext = path.extname(filePath).toLowerCase().replace(".", "");
            const mimeType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
            return toFile(buffer, path.basename(filePath), { type: mimeType });
          })
        );

        const response = await (openai.images.edit as any)({
          model: "gpt-image-1",
          image: refFiles,
          prompt,
          size: SIZE,
          quality: GPT_IMAGE_QUALITY,
          n: 1,
        });

        const b64 = response.data[0]?.b64_json;
        if (!b64) {
          throw new Error("No b64_json in images.edit() response");
        }
        imgBuffer = Buffer.from(b64, "base64");
      } else {
        // No suitable references → images.generate()
        const response = await (openai.images.generate as any)({
          model: "gpt-image-1",
          prompt,
          size: SIZE,
          quality: GPT_IMAGE_QUALITY,
          n: 1,
        });

        const b64 = response.data[0]?.b64_json;
        if (!b64) {
          throw new Error("No b64_json in images.generate() response");
        }
        imgBuffer = Buffer.from(b64, "base64");
      }

      // Save locally
      fs.mkdirSync(localDir, { recursive: true });
      fs.writeFileSync(localPath, imgBuffer);
      log(`  Saved locally: ${storagePath} (${(imgBuffer.length / 1024).toFixed(0)} KB)`);

      // Upload to Supabase Storage
      const publicUrl = await uploadToSupabase(localPath, storagePath);

      // Update product in DB
      const { error: updateErr } = await supabase
        .from("products")
        .update({ image_url: publicUrl })
        .eq("id", product.id);

      if (updateErr) {
        throw new Error(`DB update failed: ${updateErr.message}`);
      }

      log(`[OK] ${product.name} -> ${storagePath} (cost: ~$${COST_PER_IMAGE.toFixed(2)})`);
      generated++;
    } catch (err: any) {
      log(`[ERROR] ${product.name} -> ${err.message}`);
      errors++;
    }

    // Rate limit (skip delay after last item)
    if (i < products.length - 1) {
      log(`  Waiting ${DELAY_MS / 1000}s (rate limit)...`);
      await sleep(DELAY_MS);
    }
  }

  // ─── FINAL STATS ───────────────────────────────────────────────────────────

  const elapsed = Date.now() - startTime;
  const minutes = Math.floor(elapsed / 60_000);
  const seconds = Math.floor((elapsed % 60_000) / 1000);
  const totalCost = generated * COST_PER_IMAGE;

  log("");
  log("=".repeat(60));
  log("STATISTIKA");
  log("=".repeat(60));
  log(`Celkem zpracováno: ${products.length}`);
  log(`Vygenerováno:      ${generated}`);
  log(`Přeskočeno:        ${skipped}`);
  log(`Nahráno (existující): ${uploaded}`);
  log(`Chyby:             ${errors}`);
  log(`Odhadované náklady: ~$${totalCost.toFixed(2)} (${generated} x ~$${COST_PER_IMAGE.toFixed(2)})`);
  log(`Celkový čas:       ${minutes}:${String(seconds).padStart(2, "0")}`);
  log("=".repeat(60));
}

main().catch((err) => {
  log(`[FATAL] ${err.message}`);
  process.exit(1);
});
