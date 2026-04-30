import dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function auditStorage() {
  try {
    console.log(`\n=== SUPABASE STORAGE: products/hotovky/ ===\n`);

    const { data: files, error } = await supabase.storage
      .from("products")
      .list("hotovky");

    if (error) throw error;
    if (!files || files.length === 0) {
      console.log("No files in hotovky/");
      return;
    }

    console.log(`Total files: ${files.length}\n`);
    console.log("FILENAME | CREATED_AT | UPDATED_AT | SIZE (bytes) | TYPE");
    console.log("---|---|---|---|---");

    files.forEach((f: any) => {
      const type = f.name.includes("DSC")
        ? "REAL"
        : f.name.includes(".png")
        ? "AI_PNG"
        : "OTHER";
      console.log(
        `${f.name} | ${f.created_at || "?"} | ${f.updated_at || "?"} | ${f.metadata?.size || "?"} | ${type}`
      );
    });

    // Count types
    const real = files.filter((f: any) => f.name.includes("DSC")).length;
    const ai = files.filter((f: any) => f.name.includes(".png")).length;
    const other = files.length - real - ai;

    console.log(`\n=== SUMMARY ===`);
    console.log(`REAL photos (DSC): ${real}`);
    console.log(`AI generated (.png): ${ai}`);
    console.log(`Other/JPG: ${other}`);
  } catch (err: any) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

auditStorage();
