"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ClipboardList,
  Users,
  Mail,
  Settings,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const iconMap = {
  LayoutDashboard,
  Package,
  Tags,
  ClipboardList,
  Users,
  Mail,
  Settings,
} as const;

type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof iconMap;
};

interface AdminSidebarProps {
  navItems: NavItem[];
  userEmail: string;
}

export function AdminSidebar({ navItems, userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden flex-shrink-0 flex-col bg-[#18181B] text-white transition-all duration-200 lg:flex ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-1">
            <span className="font-display text-lg font-bold">MASI</span>
            <span className="font-display text-lg font-bold text-primary">-CO</span>
            <span className="ml-1.5 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Admin
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
          title={collapsed ? "Rozbalit" : "Sbalit"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex-1 space-y-0.5 px-2">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              } ${collapsed ? "justify-center px-0" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/10 p-3">
        {!collapsed && (
          <p className="mb-2 truncate text-xs text-gray-500">{userEmail}</p>
        )}
        <Link
          href="/"
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-400 transition-colors hover:bg-white/5 hover:text-white ${
            collapsed ? "justify-center px-0" : ""
          }`}
          title="Zpět na e-shop"
        >
          <Store size={14} />
          {!collapsed && <span>Zpět na e-shop</span>}
        </Link>
      </div>
    </aside>
  );
}
