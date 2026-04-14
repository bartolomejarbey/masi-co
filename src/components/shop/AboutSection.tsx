export function AboutSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <span className="text-xs uppercase tracking-[0.15em] font-medium text-primary mb-3 block">
              O nás
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              Maso s respektem
            </h2>
            <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              <p>
                Už téměř 20 let děláme v Masi-co jednu věc pořád stejně: poctivé řeznické řemeslo.
              </p>
              <p>
                Jsme rodinná firma, která stojí na jednoduchých hodnotách: kvalitě, férovosti
                a respektu k masu i zákazníkům.
              </p>
              <p>
                Nevěříme na anonymní velkovýrobu. Věříme na dobré maso, ověřené dodavatele
                a dlouhodobé vztahy.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8">
              {[
                "Čerstvé hovězí a vepřové",
                "Uzeniny a speciality",
                "Maso na grilování, vaření i pečení",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-sm font-medium text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#efe2e2,#d8d8d8)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(204,25,57,0.18),transparent_26%)]" />
            <div className="absolute inset-x-6 bottom-8 top-8 rounded-[28px] border border-white/50 bg-white/20 backdrop-blur-[2px]" />
            <div className="absolute left-12 top-12 rounded-full border border-white/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white">
              Rodinná firma
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
