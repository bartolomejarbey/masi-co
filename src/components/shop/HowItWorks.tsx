const steps = [
  {
    number: "1",
    title: "Vyberte",
    description: "Projděte sortiment a přidejte vybrané produkty do košíku.",
  },
  {
    number: "2",
    title: "Objednejte",
    description: "Vyplňte doručovací údaje. Minimální hodnota objednávky je 1 000 Kč.",
  },
  {
    number: "3",
    title: "Zaplaťte",
    description: "Vyberte si platbu online, hotově nebo stravenkami při převzetí.",
  },
  {
    number: "4",
    title: "Doručíme",
    description: "Objednávky do 12:00 obvykle expedujeme ještě tentýž den.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-off-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-primary mb-3">
            Nákup krok za krokem
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            Jak to funguje
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Objednat čerstvé maso je jednoduché a přehledné.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
          {steps.map((step) => (
            <div key={step.number} className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="font-display text-xl font-bold text-primary">
                  {step.number}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold mb-2">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
