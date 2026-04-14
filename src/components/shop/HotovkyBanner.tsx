import Link from "next/link";

export function HotovkyBanner() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-off-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="relative aspect-[4/3] lg:aspect-[3/2] overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#efe5d9,#d7c0a7)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(204,25,57,0.18),transparent_24%)]" />
            <div className="absolute bottom-8 left-8 h-36 w-24 rounded-t-[999px] rounded-b-2xl border border-white/50 bg-white/30 backdrop-blur-sm" />
            <div className="absolute bottom-8 left-24 h-44 w-28 rounded-t-[999px] rounded-b-2xl border border-white/50 bg-white/20 backdrop-blur-sm" />
            <div className="absolute bottom-8 left-44 h-32 w-24 rounded-t-[999px] rounded-b-2xl border border-white/50 bg-white/25 backdrop-blur-sm" />
            <div className="absolute right-8 top-8 rounded-full border border-white/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white">
              Hotovky
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.15em] font-medium text-primary mb-3 block">
              Specialita
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Hotová jídla ve sklenici
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
              Tradiční české recepty z kvalitních surovin. Stačí jen ohřát. Svíčková, guláš,
              koprová omáčka a další klasiky připravené poctivě a bez zbytečných kompromisů.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {["Poctivá výroba", "Bez zbytečných konzervantů", "Tradiční recepty"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 text-xs font-medium text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link
              href="/produkty/hotovky"
              className="inline-flex items-center justify-center rounded-md bg-primary hover:bg-primary-dark text-white font-medium text-sm uppercase tracking-wider px-7 py-3.5 transition-colors"
            >
              Prohlédnout hotovky
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
