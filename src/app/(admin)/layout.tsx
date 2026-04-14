import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/shop";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/objednavky", label: "Objednávky", icon: "📦" },
  { href: "/admin/produkty", label: "Produkty", icon: "🥩" },
  { href: "/admin/kategorie", label: "Kategorie", icon: "📂" },
  { href: "/admin/zakaznici", label: "Zákazníci", icon: "👥" },
  { href: "/admin/newsletter", label: "Newsletter", icon: "✉️" },
  { href: "/admin/nastaveni", label: "Nastavení", icon: "⚙️" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/prihlaseni?redirectTo=/admin");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-black text-white lg:block">
        <div className="flex h-16 items-center border-b border-gray-800 px-6">
          <Link href="/admin" className="font-display text-xl font-bold tracking-wide">
            MASI-CO <span className="text-[#CC1939]">Admin</span>
          </Link>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-gray-800 p-4">
          <div className="text-xs text-gray-500">{user.email}</div>
          <Link href="/" className="mt-2 block text-xs text-gray-400 hover:text-white">
            ← Zpět na e-shop
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
          <Link href="/admin" className="font-display text-lg font-bold">
            MASI-CO <span className="text-[#CC1939]">Admin</span>
          </Link>
          <div className="flex gap-2 overflow-x-auto text-xs">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-700 hover:bg-gray-200"
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
