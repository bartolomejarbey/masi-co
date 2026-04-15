import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

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

export default function PotvrzeniObjednavkyPage({ searchParams }: ConfirmationPageProps) {
  const orderNumber = searchParams?.order;
  const qrCodeUrl = searchParams?.qr;
  const paymentStatus = searchParams?.status;

  const isPaid = paymentStatus === "PAID";

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Potvrzení objednávky</p>
      <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
        {isPaid ? "Platba proběhla úspěšně" : "Objednávka byla přijata"}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-600">
        Děkujeme. Objednávku jsme uložili do systému a budeme ji dále zpracovávat. Přesnou cenu potvrdíme podle
        skutečné hmotnosti připraveného zboží.
      </p>
      {orderNumber ? (
        <p className="mt-6 rounded-2xl bg-gray-100 px-6 py-4 text-lg font-semibold text-black">
          Číslo objednávky: {orderNumber}
        </p>
      ) : null}

      {qrCodeUrl ? (
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-display text-xl font-bold">Platba převodem</h2>
          <p className="mt-2 text-sm text-gray-600">
            Naskenujte QR kód v bankovní aplikaci pro rychlou platbu.
          </p>
          <div className="mt-4 flex justify-center">
            <Image
              src={qrCodeUrl}
              alt="QR kód pro platbu"
              width={200}
              height={200}
              unoptimized
            />
          </div>
          <div className="mt-4 space-y-1 text-sm text-gray-600">
            <p><strong>Číslo účtu:</strong> 43-2367040227/0100</p>
            <p><strong>VS:</strong> {orderNumber?.replace(/\D/g, "")}</p>
          </div>
        </div>
      ) : null}

      <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-gray-500">
        Potvrzení objednávky jsme vám odeslali na e-mail. Pokud budete potřebovat cokoliv upravit nebo doplnit,
        stačí nás kontaktovat a uvést číslo objednávky.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/produkty"
          className="inline-flex rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary"
        >
          Pokračovat v nákupu
        </Link>
        <Link
          href="/kontakt"
          className="inline-flex rounded-md border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
        >
          Kontaktovat podporu
        </Link>
      </div>
    </div>
  );
}
