import { CartPageClient } from "@/components/shop/CartPageClient";
import { fetchMinOrderAmount } from "@/lib/shop";

export default async function KosikPage() {
  const minOrderAmount = await fetchMinOrderAmount();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Košík</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Vaše objednávka</h1>
      </div>
      <CartPageClient minOrderAmount={minOrderAmount} />
    </div>
  );
}
