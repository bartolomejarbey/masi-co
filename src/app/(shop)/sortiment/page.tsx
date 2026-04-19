import Image from "next/image";
import Link from "next/link";
import { fetchRootCategories } from "@/lib/shop";
import type { Category } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sortiment",
};

const categoryContent: Record<string, { headline: string; text: string }> = {
  maso: {
    headline: "Čerstvé maso",
    text: "Naše hovězí ještě včera mělo plány na víkend. Steaky, roštěnky, svíčkové — vše ručně porcované, jak se na pořádné řeznictví sluší.",
  },
  hotovky: {
    headline: "Hotová jídla",
    text: "Pro ty, co chtějí jíst dobře, ale vařit? To ne. Sekaná, řízky, guláš — domácí chuť bez domácího nepořádku.",
  },
  "uzene-maso": {
    headline: "Uzené speciality",
    text: "Uzené po staročesku. Žádné tekuté kouře, žádné zkratky. Jen dřevo, čas a trocha řeznické magie.",
  },
  zverina: {
    headline: "Zvěřina",
    text: "Pro dobrodruhy u plotny. Jelení, srnčí, divočák — maso s příběhem z českých lesů.",
  },
  ryby: {
    headline: "Ryby",
    text: "I řezník ví, že pátek patří rybě. Čerstvé, filetované, připravené skočit na pánev.",
  },
  uzeniny: {
    headline: "Uzeniny",
    text: "Klobásky, párky, šunka — to, co dělá svačinu svačinou a piknik piknikem.",
  },
  "ostatni-sortiment": {
    headline: "Ostatní dobroty",
    text: "Bramboráky, knedlíky, přílohy a věci, bez kterých by maso bylo osamělé.",
  },
};

export default async function NaseProduktyPage() {
  const categories = await fetchRootCategories();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(204,25,57,0.06),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            MASI-CO Produkty
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Naše produkty
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            Poctivé maso, domácí hotovky a speciality z našeho řeznictví.
            Vybíráme jen to nejlepší — od lokálních dodavatelů, co znají své řemeslo.
          </p>
        </div>
      </section>

      {/* Category sections */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {categories.map((category: Category, index: number) => {
          const content = categoryContent[category.slug] ?? {
            headline: category.name,
            text: category.description ?? "Prohlédněte si produkty v této kategorii.",
          };
          const isEven = index % 2 === 1;

          return (
            <section
              key={category.id}
              className="border-b border-gray-100 py-16 last:border-b-0 sm:py-20 lg:py-24"
            >
              <div className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16 ${isEven ? "lg:flex-row-reverse" : ""}`}>
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#f4f4f5,#d4d4d8)] lg:w-1/2">
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full border border-white/70 bg-white/30 px-4 py-2 text-sm font-medium uppercase tracking-[0.25em] text-gray-400 backdrop-blur-sm">
                        {category.name}
                      </div>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex flex-col lg:w-1/2">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                    Kategorie
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                    {content.headline}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                    {content.text}
                  </p>
                  <div className="mt-8">
                    <Link
                      href={`/sortiment/${category.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-primary"
                    >
                      Prozkoumat
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
