import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  CheckCircle2,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Potvrzení objednávky",
};

type ConfirmationPageProps = {
  searchParams?: {
    order?: string;
    qr?: string;
    status?: string;
  };
};

export default function PotvrzeniObjednavkyPage({
  searchParams,
}: ConfirmationPageProps) {
  const orderNumber = searchParams?.order;
  const qrCodeUrl = searchParams?.qr;
  const paymentStatus = searchParams?.status;

  const isPaid = paymentStatus === "PAID";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
      {/* Steps indicator */}
      <nav className="mb-12 flex items-center justify-center gap-2 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-xs text-green-600">
            <CheckCircle2 size={14} />
          </span>
          <span className="hidden sm:inline">Košík</span>
        </div>
        <div className="h-px w-8 bg-green-300 sm:w-12" />
        <div className="flex items-center gap-2 text-gray-400">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-xs text-green-600">
            <CheckCircle2 size={14} />
          </span>
          <span className="hidden sm:inline">Pokladna</span>
        </div>
        <div className="h-px w-8 bg-green-300 sm:w-12" />
        <div className="flex items-center gap-2 font-semibold text-green-600">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-xs text-white">
            <CheckCircle2 size={14} />
          </span>
          <span className="hidden sm:inline">Potvrzení</span>
        </div>
      </nav>

      {/* Success card */}
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>

        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          {isPaid ? "Platba proběhla úspěšně" : "Děkujeme za objednávku!"}
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-600">
          Objednávku jsme přijali a budeme ji zpracovávat. Přesnou cenu
          potvrdíme podle skutečné hmotnosti připraveného zboží.
        </p>

        {orderNumber && (
          <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Číslo objednávky
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-black">
              {orderNumber}
            </p>
          </div>
        )}
      </div>

      {/* QR code for bank transfer */}
      {qrCodeUrl && (
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center">
          <h2 className="font-display text-lg font-bold">Platba převodem</h2>
          <p className="mt-1 text-sm text-gray-500">
            Naskenujte QR kód v bankovní aplikaci pro rychlou platbu.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="rounded-xl border border-gray-100 bg-white p-3">
              <Image
                src={qrCodeUrl}
                alt="QR kód pro platbu"
                width={180}
                height={180}
                unoptimized
              />
            </div>
          </div>
          <div className="mt-4 space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-900">Číslo účtu:</span>{" "}
              43-2367040227/0100
            </p>
            <p>
              <span className="font-medium text-gray-900">VS:</span>{" "}
              {orderNumber?.replace(/\D/g, "")}
            </p>
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-blue-100 bg-blue-50 px-6 py-4 text-center">
        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
          <Mail size={16} className="text-blue-600" />
        </div>
        <p className="text-sm leading-relaxed text-blue-800">
          Potvrzení objednávky jsme odeslali na váš e-mail. Pokud budete
          potřebovat cokoliv upravit, kontaktujte nás s číslem objednávky.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/sortiment"
          className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary"
        >
          Pokračovat v nákupu
          <ArrowRight size={14} />
        </Link>
        <Link
          href="/kontakt"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
        >
          <Phone size={14} />
          Kontaktovat podporu
        </Link>
      </div>
    </div>
  );
}
