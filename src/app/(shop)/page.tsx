import { HeroSection } from "@/components/shop/HeroSection";
import { MarqueeBar } from "@/components/shop/MarqueeBar";
import { CategoriesSection } from "@/components/shop/CategoriesSection";
import { HotovkyBanner } from "@/components/shop/HotovkyBanner";
import { FeaturedProducts } from "@/components/shop/FeaturedProducts";
import { HowItWorks } from "@/components/shop/HowItWorks";
import { AboutSection } from "@/components/shop/AboutSection";
import { DeliverySection } from "@/components/shop/DeliverySection";
import { NewsletterSection } from "@/components/shop/NewsletterSection";
import { supabase } from "@/lib/supabase";
import type { Category, Product } from "@/lib/types";

// Demo data when Supabase is not connected
const demoCategories: Category[] = [
  { id: "1", name: "Hotovky", slug: "hotovky", description: "Hotová jídla ve sklenici", image_url: null, parent_id: null, sort_order: 1, is_active: true, created_at: "" },
  { id: "2", name: "Maso", slug: "maso", description: "Čerstvé maso z českých farem", image_url: null, parent_id: null, sort_order: 2, is_active: true, created_at: "" },
  { id: "3", name: "Uzené maso", slug: "uzene-maso", description: "Tradičně uzené maso", image_url: null, parent_id: null, sort_order: 3, is_active: true, created_at: "" },
  { id: "4", name: "Ostatní maso", slug: "ostatni-maso", description: "Drůbež, králík, jehněčí a další", image_url: null, parent_id: null, sort_order: 4, is_active: true, created_at: "" },
  { id: "5", name: "Zvěřina", slug: "zverina", description: "Divoká zvěř z českých revírů", image_url: null, parent_id: null, sort_order: 5, is_active: true, created_at: "" },
  { id: "6", name: "Ryby", slug: "ryby", description: "Čerstvé ryby a mořské plody", image_url: null, parent_id: null, sort_order: 6, is_active: true, created_at: "" },
  { id: "7", name: "Uzeniny", slug: "uzeniny", description: "Tradiční české uzeniny", image_url: null, parent_id: null, sort_order: 7, is_active: true, created_at: "" },
  { id: "8", name: "Ostatní sortiment", slug: "ostatni-sortiment", description: "Další produkty a doplňky", image_url: null, parent_id: null, sort_order: 8, is_active: true, created_at: "" },
];

const demoProducts: Product[] = [
  { id: "p1", name: "Hovězí svíčková / býk 1 kg", slug: "hovezi-svickova-byk", description: null, category_id: "2", price: 756, unit: "kg", weight_info: null, image_url: null, gallery: null, stock_status: "in_stock", is_active: true, is_featured: true, badge: "Top", sort_order: 1, created_at: "", updated_at: "" },
  { id: "p2", name: "Hovězí roštěná / býk 1 kg", slug: "hovezi-rostena-byk", description: null, category_id: "2", price: 447, unit: "kg", weight_info: null, image_url: null, gallery: null, stock_status: "in_stock", is_active: true, is_featured: true, badge: null, sort_order: 2, created_at: "", updated_at: "" },
  { id: "p3", name: "Vepřová krkovice bez kosti 1 kg", slug: "veprova-krkovice-bez-kosti", description: null, category_id: "2", price: 147, unit: "kg", weight_info: null, image_url: null, gallery: null, stock_status: "in_stock", is_active: true, is_featured: true, badge: null, sort_order: 3, created_at: "", updated_at: "" },
  { id: "p4", name: "Svíčková na smetaně 900 ml", slug: "svickova-na-smetane", description: null, category_id: "1", price: 178, unit: "ks", weight_info: "900 ml", image_url: null, gallery: null, stock_status: "in_stock", is_active: true, is_featured: true, badge: "Top", sort_order: 4, created_at: "", updated_at: "" },
  { id: "p5", name: "Hovězí guláš 900 ml", slug: "hovezi-gulas", description: null, category_id: "1", price: 178, unit: "ks", weight_info: "900 ml", image_url: null, gallery: null, stock_status: "in_stock", is_active: true, is_featured: true, badge: null, sort_order: 5, created_at: "", updated_at: "" },
  { id: "p6", name: "Kuřecí prsa 1 kg", slug: "kureci-prsa", description: null, category_id: "2", price: 174, unit: "kg", weight_info: null, image_url: null, gallery: null, stock_status: "in_stock", is_active: true, is_featured: true, badge: null, sort_order: 6, created_at: "", updated_at: "" },
];

async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .is("parent_id", null)
      .eq("is_active", true)
      .order("sort_order");

    if (error || !data || data.length === 0) return demoCategories;
    return data;
  } catch {
    return demoCategories;
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("sort_order")
      .limit(8);

    if (error || !data || data.length === 0) {
      // Fallback: get first 6 in_stock products
      const { data: fallback } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("stock_status", "in_stock")
        .order("sort_order")
        .limit(6);

      if (fallback && fallback.length > 0) return fallback;
      return demoProducts;
    }
    return data;
  } catch {
    return demoProducts;
  }
}

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <>
      <HeroSection />
      <MarqueeBar />
      <CategoriesSection categories={categories} />
      <HotovkyBanner />
      <FeaturedProducts products={featuredProducts} />
      <HowItWorks />
      <AboutSection />
      <DeliverySection />
      <NewsletterSection />
    </>
  );
}
