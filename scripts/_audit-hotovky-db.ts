import dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function auditHotovky() {
  try {
    // Get all categories with 'hotovky' slug
    const { data: cats, error: catErr } = await supabase
      .from("categories")
      .select("id, slug, name")
      .eq("slug", "hotovky");

    if (catErr) throw catErr;
    if (!cats || cats.length === 0) {
      console.log("No 'hotovky' category found");
      return;
    }

    const hotovkyId = cats[0].id;
    console.log(`\n=== HOTOVKY CATEGORY (ID: ${hotovkyId}) ===\n`);

    // Get all products in hotovky category
    const { data: prods, error: prodErr } = await supabase
      .from("products")
      .select("id, slug, name, image_url, updated_at")
      .eq("category_id", hotovkyId)
      .order("name", { ascending: true });

    if (prodErr) throw prodErr;
    if (!prods) {
      console.log("No products found");
      return;
    }

    console.log(`Total products: ${prods.length}\n`);
    console.log("SLUG | NAME | IMAGE_URL | UPDATED_AT | TYPE");
    console.log("---|---|---|---|---");

    prods.forEach((p: any) => {
      const type = p.image_url.includes("DSC")
        ? "REAL"
        : p.image_url.includes(".png")
        ? "AI_PNG"
        : "OTHER";
      console.log(
        `${p.slug} | ${p.name} | ${p.image_url} | ${p.updated_at} | ${type}`
      );
    });

    // Count types
    const real = prods.filter((p: any) => p.image_url.includes("DSC")).length;
    const ai = prods.filter((p: any) => p.image_url.includes(".png")).length;
    const other = prods.length - real - ai;

    console.log(`\n=== SUMMARY ===`);
    console.log(`REAL photos (DSC*.jpg): ${real}`);
    console.log(`AI generated (.png): ${ai}`);
    console.log(`Other/Unknown: ${other}`);
  } catch (err: any) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

auditHotovky();
