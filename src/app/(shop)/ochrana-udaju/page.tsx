import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů",
};

export default function OchranaUdajuPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Právní informace</p>
      <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Ochrana osobních údajů</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600">
        Informace o zpracování osobních údajů zákazníků v souladu s GDPR.
      </p>
      <div className="mt-8 space-y-8 rounded-2xl border border-gray-200 bg-white p-6 text-sm leading-7 text-gray-700 sm:p-8">
        <section>
          <h2 className="font-display text-2xl font-bold text-black">Správce osobních údajů</h2>
          <div className="mt-4 space-y-2">
            <p>Masi-co s.r.o.</p>
            <p>Jana Zajíce 563/20, 170 00 Praha 7</p>
            <p>IČO 28402979</p>
            <p>e-mail: objednavky@masi-co.com</p>
          </div>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold text-black">Jaké údaje zpracováváme</h2>
          <ul className="mt-4 list-disc space-y-1 pl-6">
            <li>jméno a příjmení</li>
            <li>adresu doručení</li>
            <li>e-mailovou adresu</li>
            <li>telefonní číslo</li>
            <li>další údaje nezbytné pro realizaci objednávky</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold text-black">Účely zpracování</h2>
          <ul className="mt-4 list-disc space-y-1 pl-6">
            <li>vyřízení objednávky</li>
            <li>plnění kupní smlouvy</li>
            <li>vedení uživatelského účtu</li>
            <li>splnění zákonných povinností</li>
            <li>komunikace se zákazníkem</li>
            <li>zasílání obchodních sdělení a marketingových informací</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold text-black">Obchodní sdělení a marketing</h2>
          <div className="mt-4 space-y-3">
            <p>
              Kupující souhlasí s tím, že prodávající může využívat jeho e-mailovou adresu a telefonní číslo pro
              zasílání obchodních sdělení, informací o novinkách, produktech, službách a marketingových akcích společnosti.
            </p>
            <p>
              Tento souhlas může kupující kdykoliv odvolat například prostřednictvím odkazu v e-mailu nebo zasláním
              žádosti na adresu objednavky@masi-co.com.
            </p>
          </div>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold text-black">Doba uchování a předání údajů</h2>
          <div className="mt-4 space-y-3">
            <p>Osobní údaje jsou uchovávány pouze po dobu nezbytnou pro splnění účelu jejich zpracování.</p>
            <p>Údaje mohou být předány třetím osobám pouze v nezbytném rozsahu, zejména:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>dopravcům</li>
              <li>poskytovatelům platebních služeb</li>
              <li>účetním a daňovým poradcům</li>
              <li>poskytovatelům IT služeb</li>
            </ul>
          </div>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold text-black">Vaše práva</h2>
          <ul className="mt-4 list-disc space-y-1 pl-6">
            <li>na přístup k osobním údajům</li>
            <li>na opravu údajů</li>
            <li>na výmaz</li>
            <li>na omezení zpracování</li>
            <li>vznést námitku proti zpracování</li>
            <li>podat stížnost u Úřadu pro ochranu osobních údajů</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold text-black">Cookies a kontakt</h2>
          <div className="mt-4 space-y-3">
            <p>Kupující souhlasí s ukládáním cookies na jeho zařízení. Souhlas může kdykoliv odvolat.</p>
            <p>
              V případě dotazu k ochraně osobních údajů nás můžete kontaktovat prostřednictvím stránky Kontakt nebo
              e-mailem na objednavky@masi-co.com.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
