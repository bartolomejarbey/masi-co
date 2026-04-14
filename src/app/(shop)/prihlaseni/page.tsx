import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/shop/AuthForm";
import { getCurrentUser } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Přihlášení",
};

type LoginPageProps = {
  searchParams?: {
    redirectTo?: string;
  };
};

export default async function PrihlaseniPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();
  const redirectTo = searchParams?.redirectTo || "/ucet";

  if (user) {
    redirect(redirectTo);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <AuthForm mode="login" redirectTo={redirectTo} />
    </div>
  );
}
