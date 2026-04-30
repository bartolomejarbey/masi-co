import dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SRC = "/tmp/_seo_popis.txt";
const PREVIEW = "/tmp/_seo_import_preview.json";
const APPLY = process.argv.includes("--apply");

type ParsedEntry = {
  product_name: string;
  meta_title: string | null;
  meta_description: string | null;
  seo_description: string | null;
  keywords: string | null;
};

type MatchedEntry = ParsedEntry & {
  matched_slug: string | null;
  matched_db_name: string | null;
  match_tier: "exact" | "normalized" | "fuzzy" | "none";
};

// ---------- helpers ----------

function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .replace(/×/g, "x")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/×/g, "x")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Aggressive strip of weight/packaging/freshness annotations for fuzzy match.
function stripAnnotations(s: string): string {
  return s
    .replace(/\([^)]*\)/g, " ") // (mražená, 1 kg), (bal. cca …)
    .replace(/\/[^/]*\//g, " ") // /bal. cca …/
    .replace(/\/[^/]+$/g, " ") // trailing /1kg
    .replace(/\bbal\.?\s*cca\s*[^,]+/gi, " ")
    .replace(/\b(mraz[eěí][nm][oaáé]|mrazen[oaáéý]?)\b/gi, " ")
    .replace(/\b\d+\s*[-–]\s*\d+\s*(kg|g|ks|ml)\b/gi, " ")
    .replace(/\b\d+(?:[.,]\d+)?\s*(kg|g|ks|ml|l)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanupBrand(text: string): string {
  return text
    .replace(/\bMasi[\s-]?co\b/gi, "MASI-CO")
    .replace(/\bMASI\s+CO\b/g, "MASI-CO");
}

// Repair the known docx artifact in čočková polévka where a word was split
// across paragraphs with junk: `naš_____________________::: ... ¨í kvalitní`
function repairCockovaPolevka(text: string): string {
  return text
    .replace(/naš_+:::+\s*\)?¨?í/g, "naší")
    .replace(/_{3,}:::+/g, "")
    .replace(/\)\s*¨/g, "");
}

// ---------- parser ----------

function loadAndPreprocess(): string {
  let raw = fs.readFileSync(SRC, "utf8");
  // Strip docx artifacts: `**` markers around accented chars from textutil
  raw = raw.replace(/\*\*/g, "");
  // Strip leading dash banner for first product
  raw = raw.replace(/^—-{2,}\s*\n/, "");
  // Repair čočková polévka mid-word artifact
  raw = repairCockovaPolevka(raw);
  return raw;
}

function splitIntoBlocks(raw: string): string[] {
  // Some entries are inline (PRODUKT: ... META TITLE: ... META DESCRIPTION: ...)
  // Some are multi-line. We split on lines that BEGIN with PRODUKT: (allowing
  // optional leading whitespace) — file may start without PRODUKT: for 1st entry.
  const lines = raw.split(/\r?\n/);
  const blocks: string[] = [];
  let current: string[] = [];
  let foundFirst = false;

  // 1st entry: synthesize "PRODUKT:" from META TITLE if file starts with META TITLE
  const firstNonEmpty = lines.findIndex((l) => l.trim().length > 0);
  if (
    firstNonEmpty >= 0 &&
    /^META TITLE:/.test(lines[firstNonEmpty].trim())
  ) {
    // Extract product name from META TITLE: "Čočková polévka 900ml | Masi-co"
    const m = lines[firstNonEmpty].match(/^META TITLE:\s*(.+?)\s*\|/);
    const synthName = m ? m[1].trim() : "Unknown";
    current.push(`PRODUKT: ${synthName}`);
    current.push(lines[firstNonEmpty]);
    for (let i = firstNonEmpty + 1; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s*PRODUKT:/.test(line)) {
        blocks.push(current.join("\n"));
        current = [line];
        foundFirst = true;
      } else {
        current.push(line);
      }
    }
  } else {
    for (const line of lines) {
      if (/^\s*PRODUKT:/.test(line)) {
        if (current.length > 0 && foundFirst) blocks.push(current.join("\n"));
        current = [line];
        foundFirst = true;
      } else {
        current.push(line);
      }
    }
  }
  if (current.length > 0) blocks.push(current.join("\n"));
  return blocks;
}

function parseBlock(block: string): ParsedEntry | null {
  // Extract fields. Each field's value runs to the next known token or EOF.
  // Tokens: PRODUKT: META TITLE: META DESCRIPTION: SEO POPIS: KLÍČOVÁ SLOVA:
  const TOKENS = [
    "PRODUKT:",
    "META TITLE:",
    "META DESCRIPTION:",
    "SEO POPIS:",
    "KLÍČOVÁ SLOVA:",
  ];

  const findToken = (s: string, fromIdx: number): { tok: string; idx: number } | null => {
    let best: { tok: string; idx: number } | null = null;
    for (const tok of TOKENS) {
      const idx = s.indexOf(tok, fromIdx);
      if (idx >= 0 && (!best || idx < best.idx)) best = { tok, idx };
    }
    return best;
  };

  const fields: Record<string, string> = {};
  let pos = 0;
  let currentTok: string | null = null;
  let currentStart = 0;

  while (pos < block.length) {
    const next = findToken(block, pos);
    if (!next) {
      if (currentTok) {
        fields[currentTok] = block.slice(currentStart);
      }
      break;
    }
    if (currentTok) {
      fields[currentTok] = block.slice(currentStart, next.idx);
    }
    currentTok = next.tok;
    currentStart = next.idx + next.tok.length;
    pos = currentStart;
  }
  if (currentTok && !(currentTok in fields)) {
    fields[currentTok] = block.slice(currentStart);
  }

  const product_name = (fields["PRODUKT:"] ?? "").trim();
  if (!product_name) return null;

  // Skip non-product entries
  if (/nebude uvedeno|Poznámka:/i.test(product_name)) return null;

  // Fragment from prior KLÍČOVÁ SLOVA leaking into PRODUKT line
  // (ends with comma, contains keyword-list phrasing).
  if (/,\s*$/.test(product_name)) return null;
  if (/\bcena za kg\b/i.test(product_name)) return null;

  // Skip fragmentary blocks (KLÍČOVÁ SLOVA leaked into PRODUKT line) —
  // require at least one of META TITLE / META DESCRIPTION / SEO POPIS.
  const hasContent =
    !!(fields["META TITLE:"]?.trim() ||
       fields["META DESCRIPTION:"]?.trim() ||
       fields["SEO POPIS:"]?.trim());
  if (!hasContent) return null;

  const meta_title_raw = (fields["META TITLE:"] ?? "").trim();
  const meta_description_raw = (fields["META DESCRIPTION:"] ?? "").trim();
  const seo_description_raw = (fields["SEO POPIS:"] ?? "").trim();
  const keywords_raw = (fields["KLÍČOVÁ SLOVA:"] ?? "").trim();

  // Cleanup
  const meta_title = meta_title_raw
    ? cleanupBrand(meta_title_raw).replace(/\s*\*+\s*$/, "").trim() || null
    : null;
  const meta_description = meta_description_raw
    ? cleanupBrand(meta_description_raw).replace(/\s*\*+\s*$/, "").trim() || null
    : null;
  // Preserve paragraph breaks in seo_description
  const seo_description = seo_description_raw
    ? cleanupBrand(seo_description_raw)
        .replace(/\s*\*+\s*$/, "")
        .replace(/\n{3,}/g, "\n\n") // collapse triple+ newlines
        .replace(/[ \t]+\n/g, "\n") // strip trailing spaces on lines
        .trim() || null
    : null;
  const keywords = keywords_raw
    ? Array.from(
        new Set(
          keywords_raw
            .replace(/\s*\*+\s*$/, "")
            .split(/[,;]/)
            .map((k) => k.trim())
            .filter(Boolean)
        )
      ).join(", ") || null
    : null;

  return {
    product_name,
    meta_title,
    meta_description,
    seo_description,
    keywords,
  };
}

// ---------- matcher ----------

// Manual overrides for docx-name → db-slug where typos / formatting prevent
// fuzzy matching. Keys must match docx PRODUKT: line exactly.
const MANUAL_ALIASES: Record<string, string> = {
  "Apetito klobása": "apetito-bal-cca-1-5kg-1kg",
  "Elítkový prejt mražený": "jelitkovy-prejt-mrazeny-bal-cca-2-5kg-1kg",
  "Jelitní/jitrnice": "jitrnice-jelita-1kg",
  "Rokolice růžičky": "brokolice-ruzicky-bal-cca-2-5kg-1kg",
  "Rybí file kostky 100 g (mražené, 1 kg)": "rybi-file-kostky-100gr-mrazeno-1kg",
};

function matchToDb(
  parsed: ParsedEntry,
  dbProducts: { slug: string; name: string }[]
): MatchedEntry {
  const docxName = parsed.product_name;

  // 0. Manual alias
  if (MANUAL_ALIASES[docxName]) {
    const targetSlug = MANUAL_ALIASES[docxName];
    const aliasMatch = dbProducts.find((p) => p.slug === targetSlug);
    if (aliasMatch) {
      return {
        ...parsed,
        matched_slug: aliasMatch.slug,
        matched_db_name: aliasMatch.name,
        match_tier: "fuzzy",
      };
    }
  }

  // 1. Exact name match
  const exact = dbProducts.find((p) => p.name === docxName);
  if (exact) {
    return {
      ...parsed,
      matched_slug: exact.slug,
      matched_db_name: exact.name,
      match_tier: "exact",
    };
  }

  // 2. Normalized match
  const docxNorm = normalizeForMatch(docxName);
  const normMatch = dbProducts.find((p) => normalizeForMatch(p.name) === docxNorm);
  if (normMatch) {
    return {
      ...parsed,
      matched_slug: normMatch.slug,
      matched_db_name: normMatch.name,
      match_tier: "normalized",
    };
  }

  // 3. Slug-based match
  const docxSlug = slugify(docxName);
  const slugMatch = dbProducts.find((p) => p.slug === docxSlug);
  if (slugMatch) {
    return {
      ...parsed,
      matched_slug: slugMatch.slug,
      matched_db_name: slugMatch.name,
      match_tier: "normalized",
    };
  }

  // 4. Fuzzy: aggressively strip annotations on both sides and require equality.
  const docxFuzzy = normalizeForMatch(stripAnnotations(docxName));
  if (docxFuzzy) {
    const fuzzyMatch = dbProducts.find(
      (p) => normalizeForMatch(stripAnnotations(p.name)) === docxFuzzy
    );
    if (fuzzyMatch) {
      return {
        ...parsed,
        matched_slug: fuzzyMatch.slug,
        matched_db_name: fuzzyMatch.name,
        match_tier: "fuzzy",
      };
    }
  }

  return {
    ...parsed,
    matched_slug: null,
    matched_db_name: null,
    match_tier: "none",
  };
}

// ---------- main ----------

async function main() {
  const raw = loadAndPreprocess();
  const blocks = splitIntoBlocks(raw);
  console.log(`Parsed ${blocks.length} blocks from docx text`);

  const parsed: ParsedEntry[] = [];
  for (const block of blocks) {
    const e = parseBlock(block);
    if (e) parsed.push(e);
  }
  console.log(`Valid entries: ${parsed.length}`);

  const { data: dbData, error: dbErr } = await supabase
    .from("products")
    .select("slug, name")
    .order("slug");
  if (dbErr) throw dbErr;
  const dbProducts = dbData ?? [];
  console.log(`DB products: ${dbProducts.length}`);

  const matched: MatchedEntry[] = parsed.map((p) => matchToDb(p, dbProducts));

  const stats = {
    total: matched.length,
    exact: matched.filter((m) => m.match_tier === "exact").length,
    normalized: matched.filter((m) => m.match_tier === "normalized").length,
    fuzzy: matched.filter((m) => m.match_tier === "fuzzy").length,
    none: matched.filter((m) => m.match_tier === "none").length,
  };
  console.log("\n=== Match stats ===");
  console.log(stats);

  // Detect duplicate db slugs (multiple docx entries → same product)
  const slugCounts = new Map<string, number>();
  for (const m of matched) {
    if (m.matched_slug) {
      slugCounts.set(m.matched_slug, (slugCounts.get(m.matched_slug) ?? 0) + 1);
    }
  }
  const dupes = Array.from(slugCounts.entries()).filter(([, n]) => n > 1);
  if (dupes.length) {
    console.log("\n=== Duplicate slug matches (review!) ===");
    dupes.forEach(([slug, n]) => console.log(`  ${slug} → ${n} docx entries`));
  }

  // Sample 5 with full content
  console.log("\n=== Sample matches ===");
  matched.slice(0, 5).forEach((m) => {
    console.log(
      `[${m.match_tier.toUpperCase()}] ${m.product_name} → ${m.matched_slug ?? "—"}`
    );
  });

  console.log("\n=== Unmatched (docx → no DB) ===");
  matched
    .filter((m) => m.match_tier === "none")
    .forEach((m) => console.log(`  ${m.product_name}`));

  fs.writeFileSync(PREVIEW, JSON.stringify(matched, null, 2));
  console.log(`\nPreview written: ${PREVIEW}`);

  if (!APPLY) {
    console.log("\n[dry-run] Re-run with --apply to write to DB.");
    return;
  }

  // Apply
  console.log("\n=== Applying to DB ===");
  let ok = 0;
  let skip = 0;
  let fail = 0;
  for (const m of matched) {
    if (!m.matched_slug) {
      skip++;
      continue;
    }
    const update: Record<string, string | null> = {};
    if (m.meta_title) update.meta_title = m.meta_title;
    if (m.meta_description) update.meta_description = m.meta_description;
    if (m.seo_description) update.seo_description = m.seo_description;
    if (m.keywords) update.keywords = m.keywords;
    if (Object.keys(update).length === 0) {
      skip++;
      continue;
    }
    const { error } = await supabase
      .from("products")
      .update(update)
      .eq("slug", m.matched_slug);
    if (error) {
      console.log(`  ✗ ${m.matched_slug}: ${error.message}`);
      fail++;
    } else {
      ok++;
    }
  }
  console.log(`\nApplied: ${ok} ok, ${skip} skipped, ${fail} failed`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
