import dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SRC = path.resolve(process.cwd(), "scripts/_seo-authored.json");
const APPLY = process.argv.includes("--apply");

type AuthoredEntry = {
  slug: string;
  meta_title: string;
  meta_description: string;
  seo_description: string;
  keywords: string;
};

async function main() {
  const raw = fs.readFileSync(SRC, "utf8");
  const entries: AuthoredEntry[] = JSON.parse(raw);
  console.log(`Loaded ${entries.length} authored entries from ${SRC}`);

  // Sanity-check slugs against DB
  const slugs = entries.map((e) => e.slug);
  const { data: existing, error } = await supabase
    .from("products")
    .select("slug, name")
    .in("slug", slugs);
  if (error) throw error;

  const existingSlugs = new Set((existing ?? []).map((p) => p.slug));
  const missing = slugs.filter((s) => !existingSlugs.has(s));
  if (missing.length) {
    console.log("\n⚠ MISSING in DB (typo in authored.json?):");
    missing.forEach((s) => console.log(`  ${s}`));
  }

  // Length sanity
  console.log("\n=== Length stats ===");
  for (const e of entries) {
    const tLen = e.meta_title.length;
    const dLen = e.meta_description.length;
    const sWords = e.seo_description.split(/\s+/).length;
    const kCount = e.keywords.split(",").length;
    const flag = tLen > 70 || dLen > 165 ? " ⚠" : "";
    console.log(
      `${e.slug.padEnd(45)} title:${tLen}  desc:${dLen}  seo:${sWords}w  kws:${kCount}${flag}`
    );
  }

  if (!APPLY) {
    console.log("\n[dry-run] Re-run with --apply to write to DB.");
    return;
  }

  console.log("\n=== Applying ===");
  let ok = 0;
  let fail = 0;
  for (const e of entries) {
    if (!existingSlugs.has(e.slug)) {
      console.log(`  ✗ ${e.slug}: not in DB`);
      fail++;
      continue;
    }
    const { error: upErr } = await supabase
      .from("products")
      .update({
        meta_title: e.meta_title,
        meta_description: e.meta_description,
        seo_description: e.seo_description,
        keywords: e.keywords,
      })
      .eq("slug", e.slug);
    if (upErr) {
      console.log(`  ✗ ${e.slug}: ${upErr.message}`);
      fail++;
    } else {
      ok++;
    }
  }
  console.log(`\nApplied: ${ok} ok, ${fail} failed`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
