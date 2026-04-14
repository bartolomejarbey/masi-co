import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Obchodní podmínky",
};

export default function ObchodniPodminkyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Právní informace</p>
      <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Obchodní podmínky</h1>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-sm leading-7 text-gray-700 sm:p-8">
        <section className="border-b border-gray-100 pb-8">
          <h2 className="font-display text-2xl font-bold text-black">OBCHODNÍ PODMÍNKY</h2>
          <div className="mt-4 space-y-1">
            <p>obchodní společnosti Masi-co s.r.o.</p>
            <p>se sídlem: Jana Zajíce 563/20, 170 00 Praha 7</p>
            <p>identifikační číslo: 28402979</p>
            <p>spisová značka: C 139001 vedená u Městského soudu v Praze</p>
            <p>pro prodej zboží prostřednictvím on-line obchodu umístěného na internetové adrese</p>
            <p>www.masi-co.cz</p>
          </div>
        </section>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="font-display text-2xl font-bold text-black">1. ÚVODNÍ USTANOVENÍ</h2>
            <div className="mt-4 space-y-3">
              <p>
                1.1. Tyto obchodní podmínky (dále jen „obchodní podmínky“) obchodní společnosti Masi-co s.r.o., se sídlem Jana
                Zajíce 563/20, 170 00 Praha 7, identifikační číslo: 28402979, spisová značka C 139001 vedená u Městského soudu v
                Praze (dále jen „prodávající“) upravují v souladu s ustanovením § 1751 odst. 1 zákona č. 89/2012 Sb., občanský
                zákoník, vzájemná práva a povinnosti smluvních stran vzniklé v souvislosti s kupní smlouvou uzavíranou mezi
                prodávajícím a jinou fyzickou či právnickou osobou (dále jen „kupující“) prostřednictvím internetového obchodu
                prodávajícího. Internetový obchod je prodávajícím provozován na webové stránce umístěné na internetové adrese
                www.masi-co.cz prostřednictvím webového rozhraní obchodu.
              </p>
              <p>1.2. Obchodní podmínky se nevztahují na případy, kdy osoba nakupuje zboží v rámci své podnikatelské činnosti.</p>
              <p>1.3. Odchylná ustanovení mohou být sjednána v kupní smlouvě. Ta mají přednost před obchodními podmínkami.</p>
              <p>1.4. Kupní smlouva i obchodní podmínky jsou vyhotoveny v českém jazyce.</p>
              <p>1.5. Prodávající může obchodní podmínky měnit nebo doplňovat.</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-black">2. UŽIVATELSKÝ ÚČET</h2>
            <div className="mt-4 space-y-3">
              <p>2.1. Na základě registrace může kupující přistupovat do svého uživatelského účtu a objednávat zboží.</p>
              <p>2.2. Kupující je povinen uvádět pravdivé a aktuální údaje.</p>
              <p>2.3. Přístup k účtu je chráněn uživatelským jménem a heslem.</p>
              <p>2.4. Kupující není oprávněn umožnit využívání účtu třetím osobám.</p>
              <p>2.5. Prodávající může účet zrušit například v případě jeho dlouhodobé neaktivity.</p>
              <p>2.6. Uživatelský účet nemusí být dostupný nepřetržitě.</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-black">3. UZAVŘENÍ KUPNÍ SMLOUVY</h2>
            <div className="mt-4 space-y-3">
              <p>3.1. Prezentace zboží na webu má informativní charakter.</p>
              <p>3.2. Webové rozhraní obsahuje informace o zboží včetně cen a DPH.</p>
              <p>3.3. Web obsahuje informace o nákladech na dopravu.</p>
              <div>
                <p>3.4. Pro objednání zboží kupující vyplní objednávkový formulář.</p>
                <p>Objednávka obsahuje zejména:</p>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>vybrané zboží</li>
                  <li>způsob platby</li>
                  <li>způsob dopravy</li>
                  <li>náklady na dopravu</li>
                </ul>
              </div>
              <p>3.5. Kupující může údaje před odesláním objednávky zkontrolovat.</p>
              <p>3.6. Prodávající může požádat o dodatečné potvrzení objednávky.</p>
              <p>3.7. Smlouva vzniká potvrzením objednávky prodávajícím e-mailem.</p>
              <p>3.8. Kupující souhlasí s použitím komunikačních prostředků na dálku.</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-black">4. CENA ZBOŽÍ A PLATEBNÍ PODMÍNKY</h2>
            <div className="mt-4 space-y-3">
              <p>Kupní cenu může kupující uhradit:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>hotově v provozovně</li>
                <li>na dobírku</li>
                <li>platební kartou</li>
              </ul>
              <p>Kupující je povinen uhradit také náklady na dopravu.</p>
              <p>V případě bezhotovostní platby je cena splatná do 14 dnů od uzavření smlouvy.</p>
              <p>Prodávající je plátcem DPH.</p>
              <p>Daňový doklad bude kupujícímu zaslán elektronicky.</p>
              <p>Podle zákona o evidenci tržeb je prodávající povinen vystavit účtenku.</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-black">5. ODSTOUPENÍ OD SMLOUVY</h2>
            <div className="mt-4 space-y-3">
              <p>Kupující má právo odstoupit od kupní smlouvy do 14 dnů od převzetí zboží.</p>
              <p>Odstoupení je možné zaslat na adresu: objednavky@masi-co.com</p>
              <p>Kupující je povinen zboží vrátit do 14 dnů od odstoupení.</p>
              <p>Náklady na vrácení zboží nese kupující.</p>
              <p>Prodávající vrátí peníze nejpozději do 14 dnů od odstoupení.</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-black">6. PŘEPRAVA A DODÁNÍ ZBOŽÍ</h2>
            <div className="mt-4 space-y-3">
              <p>Kupující je povinen převzít zboží při dodání.</p>
              <p>Při převzetí je kupující povinen zkontrolovat neporušenost obalu.</p>
              <p>Pokud je obal poškozen, nemusí zásilku převzít.</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-black">7. PRÁVA Z VADNÉHO PLNĚNÍ</h2>
            <div className="mt-4 space-y-3">
              <p>Prodávající odpovídá za to, že zboží při převzetí nemá vady.</p>
              <p>Kupující má právo uplatnit reklamaci do 24 měsíců od převzetí zboží.</p>
              <div>
                <p>Reklamaci lze uplatnit:</p>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>osobně na adrese Zahradní 466, 250 64 Měšice</li>
                  <li>telefonicky +420 222 533 001</li>
                  <li>e-mailem objednavky@masi-co.com</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-black">8. DALŠÍ PRÁVA A POVINNOSTI</h2>
            <div className="mt-4 space-y-3">
              <p>Kupující nabývá vlastnictví zaplacením kupní ceny.</p>
              <p>
                Mimosoudní řešení sporů: Česká obchodní inspekce{" "}
                <a
                  href="https://adr.coi.cz"
                  className="text-primary transition-colors hover:text-primary-dark"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://adr.coi.cz
                </a>
              </p>
              <p>
                Online řešení sporů EU:{" "}
                <a
                  href="http://ec.europa.eu/consumers/odr"
                  className="text-primary transition-colors hover:text-primary-dark"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  http://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p>Dozor nad ochranou osobních údajů vykonává Úřad pro ochranu osobních údajů.</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-black">9. OCHRANA OSOBNÍCH ÚDAJŮ (GDPR)</h2>
            <div className="mt-4 space-y-3">
              <p>
                9.1. Prodávající zpracovává osobní údaje kupujících v souladu s Nařízením Evropského parlamentu a Rady
                (EU) 2016/679 (GDPR).
              </p>
              <p>9.2. Správcem osobních údajů je společnost Masi-co s.r.o., Jana Zajíce 563/20, Praha 7, IČO 28402979.</p>
              <div>
                <p>9.3. Prodávající zpracovává zejména tyto osobní údaje:</p>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>jméno a příjmení</li>
                  <li>adresu doručení</li>
                  <li>e-mailovou adresu</li>
                  <li>telefonní číslo</li>
                  <li>další údaje nezbytné pro realizaci objednávky</li>
                </ul>
              </div>
              <div>
                <p>9.4. Údaje jsou zpracovávány za účelem:</p>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>vyřízení objednávky</li>
                  <li>plnění kupní smlouvy</li>
                  <li>vedení uživatelského účtu</li>
                  <li>splnění zákonných povinností</li>
                  <li>komunikace se zákazníkem</li>
                  <li>zasílání obchodních sdělení a marketingových informací</li>
                </ul>
              </div>
              <p>
                9.5. Kupující souhlasí s tím, že prodávající může využívat jeho e-mailovou adresu a telefonní číslo pro
                zasílání obchodních sdělení, informací o novinkách, produktech, službách a marketingových akcích společnosti.
              </p>
              <p>
                9.6. Kupující může tento souhlas kdykoliv odvolat například prostřednictvím odkazu v e-mailu nebo
                zasláním žádosti na e-mail: objednavky@masi-co.com
              </p>
              <p>9.7. Osobní údaje jsou uchovávány pouze po dobu nezbytnou pro splnění účelu jejich zpracování.</p>
              <div>
                <p>9.8. Osobní údaje mohou být předány třetím osobám pouze v nezbytném rozsahu, zejména:</p>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>dopravcům</li>
                  <li>poskytovatelům platebních služeb</li>
                  <li>účetním a daňovým poradcům</li>
                  <li>poskytovatelům IT služeb</li>
                </ul>
              </div>
              <div>
                <p>9.9. Kupující má právo:</p>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>na přístup k osobním údajům</li>
                  <li>na opravu údajů</li>
                  <li>na výmaz</li>
                  <li>na omezení zpracování</li>
                  <li>vznést námitku proti zpracování</li>
                  <li>podat stížnost u Úřadu pro ochranu osobních údajů</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-black">10. COOKIES A OBCHODNÍ SDĚLENÍ</h2>
            <div className="mt-4 space-y-3">
              <p>Kupující souhlasí se zasíláním obchodních sdělení.</p>
              <p>Kupující také souhlasí s ukládáním cookies na jeho zařízení.</p>
              <p>Souhlas může kdykoliv odvolat.</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-black">11. DORUČOVÁNÍ</h2>
            <p className="mt-4">Kupujícímu může být doručováno na jeho e-mailovou adresu.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-black">12. ZÁVĚREČNÁ USTANOVENÍ</h2>
            <div className="mt-4 space-y-3">
              <p>Právní vztahy se řídí českým právem.</p>
              <p>Kupní smlouva je archivována prodávajícím v elektronické podobě.</p>
              <div className="space-y-1">
                <p>Kontaktní údaje:</p>
                <p>Masi-co s.r.o.</p>
                <p>Zahradní 466</p>
                <p>250 64 Měšice</p>
                <p>e-mail: objednavky@masi-co.com</p>
                <p>telefon: +420 222 533 001</p>
              </div>
              <p>V Praze dne 15. 3. 2026</p>
              <div className="space-y-1">
                <p>Adam Slezák</p>
                <p>jednatel společnosti</p>
                <p>Masi-co s.r.o.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
