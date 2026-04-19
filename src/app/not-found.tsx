import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <p className="font-display text-8xl font-bold text-gray-200">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
        Stránka nenalezena
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-gray-500">
        Stránka, kterou hledáte, neexistuje nebo byla přesunuta. Zkuste se
        vrátit na úvodní stránku nebo prohlédnout náš sortiment.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary"
        >
          <ArrowLeft size={14} />
          Zpět na úvod
        </Link>
        <Link
          href="/sortiment"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
        >
          <Search size={14} />
          Prohlédnout sortiment
        </Link>
      </div>
    </div>
  );
}
