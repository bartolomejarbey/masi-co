import type { Metadata } from "next";
import { Roboto, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/shop/TopBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { CartProvider } from "@/components/shop/CartProvider";
import { getCurrentUser, fetchCategoryTree } from "@/lib/shop";

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
      <body
        className={`${roboto.variable} ${robotoSlab.variable} font-sans antialiased bg-white text-black`}
      >
        <CartProvider>
          <TopBar />
          <HeaderWrapper userPromise={userPromise} categoriesPromise={categoriesPromise} />
          <main>{children}</main>
          <Footer />
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
