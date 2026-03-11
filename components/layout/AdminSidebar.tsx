"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  ClipboardList,
  DollarSign,
  Boxes,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Dealers", href: "/admin/dealers", icon: Users },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Pricing", href: "/admin/pricing", icon: DollarSign },
  { label: "Stock", href: "/admin/stock", icon: Boxes },
];

interface AdminSidebarProps {
  adminName?: string;
}

export function AdminSidebar({ adminName = "Admin" }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin-login");
    router.refresh();
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-brand-navy text-white">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-orange rounded flex items-center justify-center">
            <span className="text-white font-black text-xs">M</span>
          </div>
          <div>
            <div className="font-black text-white text-sm leading-none">MOMENTUM</div>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 leading-none">
              Admin Panel
            </div>
          </div>
        </Link>
      </div>

      {/* Admin info */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
          <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{adminName}</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "admin-sidebar-link",
                isActive ? "active" : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      {/* View site + logout */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <ExternalLink size={18} />
          View Public Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-brand-navy flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-orange rounded flex items-center justify-center">
            <span className="text-white font-black text-xs">M</span>
          </div>
          <span className="font-black text-white text-sm">MOMENTUM ADMIN</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-white">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 h-full shadow-xl">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
