import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountDashboard } from "@/components/shop/AccountDashboard";
import { ensureCustomerProfile, getCurrentUser, getCustomerOrders, getCustomerProfile } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Můj účet",
};

export default async function UcetPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/prihlaseni?redirectTo=/ucet");
  }

  await ensureCustomerProfile(user);
  const profile = await getCustomerProfile(user.id);
  const orders = await getCustomerOrders(user.id);

  if (!profile?.customer) {
    redirect("/prihlaseni?redirectTo=/ucet");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Účet</p>
      <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Můj účet</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600">
        Přehled vašich údajů a objednávek navázaných na přihlášený účet.
      </p>
      <div className="mt-8">
        <AccountDashboard customer={profile.customer} address={profile.address} orders={orders} />
      </div>
    </div>
  );
}
