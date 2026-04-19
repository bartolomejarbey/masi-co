import type { MetadataRoute } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";

type SitemapRow = { slug: string; updated_at: string | null };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://masi-co.cz";
  const supabase = createServerSupabaseClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/sortiment`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/jak-nakupovat`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/o-nas`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/kontakt`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/obchodni-podminky`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/ochrana-udaju`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Category pages
  const { data: rawCategories } = await supabase
    .from("categories")
    .select("slug, updated_at");

  const categories = (rawCategories ?? []) as SitemapRow[];
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/sortiment/${cat.slug}`,
    lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Product pages
  const { data: rawProducts } = await supabase
    .from("products")
    .select("slug, updated_at");

  const products = (rawProducts ?? []) as SitemapRow[];
  const productPages: MetadataRoute.Sitemap = products.map((prod) => ({
    url: `${baseUrl}/produkt/${prod.slug}`,
    lastModified: prod.updated_at ? new Date(prod.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
