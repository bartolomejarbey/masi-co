import Link from "next/link";
import { Truck } from "lucide-react";

export function DeliverySection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Left — info (3 cols) */}
          <div className="lg:col-span-3">
            <span className="text-xs uppercase tracking-[0.15em] font-medium text-primary mb-3 block">
              Doručení
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Rozvoz po Praze a okolí
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
              Rozvážíme vlastním chlazeným vozem přímo k vám domů. Doprava je vždy zdarma a zboží zůstává po celou dobu v řízeném chladu.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-off-white p-5 rounded-2xl">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                  Minimální objednávka
                </p>
                <p className="font-display text-xl font-bold">1 000 Kč</p>
              </div>
              <div className="bg-off-white p-5 rounded-2xl">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                  Doprava
                </p>
                <p className="font-display text-xl font-bold text-green-600">Zdarma</p>
              </div>
            </div>

            {/* Areas */}
            <div className="mb-8">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Oblasti rozvozu
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Praha a okolí",
                  "Praha-východ",
                  "Mladá Boleslav",
                  "Kladno",
                  "Mělník",
                  "Nymburk",
                ].map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center px-3 py-1.5 bg-off-white text-xs font-medium text-gray-600 rounded-full"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-400">
              Všechny ceny jsou uvedené s DPH. U váženého zboží se konečná cena může lišit podle skutečné hmotnosti.
            </div>

            <Link
              href="/jak-nakupovat"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors mt-6"
            >
              Jak nakupovat
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="lg:col-span-2 flex items-center">
            <div className="bg-primary text-white p-8 sm:p-10 w-full rounded-2xl shadow-lg">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <Truck size={24} className="text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">
                Vlastní rozvoz
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                Vaše objednávka je doručena přímo naším chlazeným vozem. Bez překladišť a bez zprostředkovatelů, přímo od nás k vám.
              </p>
              <p className="text-white/60 text-xs">
                Objednávky do 12:00 obvykle expedujeme tentýž den.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
