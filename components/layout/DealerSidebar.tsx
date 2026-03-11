"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/hooks/useCart";

const navItems = [
  { label: "Dashboard", href: "/dealer/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/dealer/products", icon: Package },
  { label: "My Orders", href: "/dealer/orders", icon: ClipboardList },
  { label: "Account", href: "/dealer/account", icon: User },
];

interface DealerSidebarProps {
  dealerName: string;
  tierName?: string;
}

export function DealerSidebar({ dealerName, tierName }: DealerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, clearCart } = useCart();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearCart();
    router.push("/dealer-login");
    router.refresh();
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-brand-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-orange rounded flex items-center justify-center">
            <span className="text-white font-black text-xs">M</span>
          </div>
          <div>
            <div className="font-black text-brand-navy text-sm leading-none">MOMENTUM</div>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-muted leading-none">
              Dealer Portal
            </div>
          </div>
        </Link>
      </div>

      {/* Dealer info */}
      <div className="px-4 py-4 border-b border-brand-border">
        <div className="flex items-center gap-3 bg-brand-surface rounded-xl p-3">
          <div className="w-9 h-9 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            {dealerName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-brand-navy truncate">{dealerName}</p>
            {tierName && (
              <p className="text-xs text-brand-orange font-medium">{tierName} Dealer</p>
            )}
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
                "dealer-sidebar-link",
                isActive ? "active" : ""
              )}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}

        {/* Cart link with badge */}
        <Link
          href="/dealer/cart"
          className={cn(
            "dealer-sidebar-link",
            pathname === "/dealer/cart" ? "active" : ""
          )}
          onClick={() => setMobileOpen(false)}
        >
          <ShoppingCart size={18} />
          <span className="flex-1">Cart</span>
          {itemCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-orange text-white text-xs flex items-center justify-center font-bold">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-brand-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-brand-border">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-brand-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-orange rounded flex items-center justify-center">
            <span className="text-white font-black text-xs">M</span>
          </div>
          <span className="font-black text-brand-navy text-sm">MOMENTUM</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dealer/cart" className="relative p-2">
            <ShoppingCart size={20} className="text-brand-navy" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-orange text-white text-[10px] flex items-center justify-center font-bold">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 bg-white h-full shadow-xl animate-slide-in-right">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
