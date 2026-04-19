import type { Metadata } from "next";
import { Roboto, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/shop/TopBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { CartProvider } from "@/components/shop/CartProvider";
import { getCurrentUser, fetchCategoryTree } from "@/lib/shop";
import { Toaster } from "sonner";

const roboto = Roboto({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto-slab",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MASI-CO | Maso s respektem",
    template: "%s | MASI-CO",
  },
  description:
    "Online řeznictví MASI-CO. Čerstvé hovězí, vepřové, uzeniny i hotová jídla. Rozvážíme po Praze a okolí.",
  metadataBase: new URL("https://masi-co.cz"),
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: "MASI-CO",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "MASI-CO",
  description: "Online řeznictví s vlastním rozvozem po Praze a okolí.",
  url: "https://masi-co.cz",
  telephone: "+420222533001",
  email: "objednavky@masi-co.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Zahradní 466",
    addressLocality: "Měšice",
    postalCode: "250 64",
    addressCountry: "CZ",
  },
  currenciesAccepted: "CZK",
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userPromise = getCurrentUser();
  const categoriesPromise = fetchCategoryTree();

  return (
    <html lang="cs">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${roboto.variable} ${robotoSlab.variable} font-sans antialiased bg-white text-black`}
      >
        <CartProvider>
          <TopBar />
          <HeaderWrapper userPromise={userPromise} categoriesPromise={categoriesPromise} />
          <main>{children}</main>
          <Footer />
          <Toaster position="bottom-right" richColors closeButton />
        </CartProvider>
      </body>
    </html>
  );
}

async function HeaderWrapper({
  userPromise,
  categoriesPromise,
}: {
  userPromise: ReturnType<typeof getCurrentUser>;
  categoriesPromise: ReturnType<typeof fetchCategoryTree>;
}) {
  const [user, categories] = await Promise.all([userPromise, categoriesPromise]);
  return <Header authEmail={user?.email ?? null} categories={categories} />;
}
