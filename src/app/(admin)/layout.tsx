import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/shop";
import {
  LayoutDashboard,
  Package,
  Tags,
  ClipboardList,
  Users,
  Mail,
  Settings,
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" as const },
  { href: "/admin/produkty", label: "Produkty", icon: "Package" as const },
  { href: "/admin/kategorie", label: "Kategorie", icon: "Tags" as const },
  { href: "/admin/objednavky", label: "Objednávky", icon: "ClipboardList" as const },
  { href: "/admin/zakaznici", label: "Zákazníci", icon: "Users" as const },
  { href: "/admin/newsletter", label: "Newsletter", icon: "Mail" as const },
  { href: "/admin/nastaveni", label: "Nastavení", icon: "Settings" as const },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/prihlaseni?redirectTo=/admin");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar navItems={navItems} userEmail={user.email ?? ""} />

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
          <Link href="/admin" className="flex items-center gap-1">
            <span className="font-display text-lg font-bold">MASI</span>
            <span className="font-display text-lg font-bold text-primary">-CO</span>
            <span className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gray-500">
              Admin
            </span>
          </Link>
          <div className="flex gap-1.5 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 hover:text-primary"
                title={item.label}
              >
                {item.icon === "LayoutDashboard" && <LayoutDashboard size={16} />}
                {item.icon === "Package" && <Package size={16} />}
                {item.icon === "Tags" && <Tags size={16} />}
                {item.icon === "ClipboardList" && <ClipboardList size={16} />}
                {item.icon === "Users" && <Users size={16} />}
                {item.icon === "Mail" && <Mail size={16} />}
                {item.icon === "Settings" && <Settings size={16} />}
              </Link>
            ))}
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
