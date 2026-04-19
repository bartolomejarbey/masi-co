import { CheckoutPageClient } from "@/components/shop/CheckoutPageClient";
import { fetchMinOrderAmount } from "@/lib/shop";
import { CreditCard, CheckCircle2 } from "lucide-react";

export default async function PokladnaPage() {
  const minOrderAmount = await fetchMinOrderAmount();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      {/* Steps indicator */}
      <nav className="mb-10 flex items-center justify-center gap-2 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-xs text-green-600">
            <CheckCircle2 size={14} />
          </span>
          <span className="hidden sm:inline">Košík</span>
        </div>
        <div className="h-px w-8 bg-primary sm:w-12" />
        <div className="flex items-center gap-2 font-semibold text-primary">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs text-white">
            <CreditCard size={14} />
          </span>
          <span className="hidden sm:inline">Pokladna</span>
        </div>
        <div className="h-px w-8 bg-gray-300 sm:w-12" />
        <div className="flex items-center gap-2 text-gray-400">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500">
            <CheckCircle2 size={14} />
          </span>
          <span className="hidden sm:inline">Potvrzení</span>
        </div>
      </nav>

      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Pokladna</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Dokončení objednávky</h1>
      </div>
      <CheckoutPageClient minOrderAmount={minOrderAmount} />
    </div>
  );
}
