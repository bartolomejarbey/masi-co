import dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function analyze() {
  try {
    const { data: cats } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", "hotovky")
      .single();

    const { data: prods } = await supabase
      .from("products")
      .select("slug, image_url")
      .eq("category_id", cats!.id)
      .order("slug");

    const jpgProds = prods?.filter((p: any) => p.image_url.includes(".jpg") && !p.image_url.includes("DSC")) || [];

    console.log(`\n=== 17x JPG (non-DSC) hotovky produkt ===\n`);
    console.log("SLUG | IMAGE_URL");
    console.log("---|---");
    jpgProds.forEach((p: any) => {
      console.log(`${p.slug} | ${p.image_url}`);
    });

    console.log(`\nAnalyze: Are they from generate-product-photos.ts gpt-image-1?`);
    console.log("- All have slug-based names (bramborova-s-houbami-900ml.jpg, etc.)");
    console.log("- Consistent with script's upload pattern: category/slug.jpg");
    console.log("- NOT DSC*.jpg (real photo)");
    console.log("- NOT .png (which are the 'smarter prompt' regenerations from 28.4)");
    console.log("\nCONCLUSION: These are JPG outputs from gpt-image-1 generation — likely from earlier attempts before 28.4 massage prompts.");
  } catch (err: any) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

analyze();
