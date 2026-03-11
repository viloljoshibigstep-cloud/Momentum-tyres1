"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Products", href: "/products", hasDropdown: true },
  { label: "About", href: "/about" },
  { label: "Why Choose Us", href: "/why-choose-us" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

const productCategories = [
  { label: "Passenger Car (PCR)", href: "/products/pcr" },
  { label: "SUV & 4x4", href: "/products/suv-4x4" },
  { label: "Light Truck", href: "/products/light-truck" },
  { label: "Truck & Bus (TBR)", href: "/products/tbr" },
  { label: "Off-Road", href: "/products/off-road" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowProductMenu(false);
  }, [pathname]);

  return (
    <>
      {/* Top bar */}
      <div className="bg-brand-navy text-white text-xs py-2 hidden md:block">
        <div className="container mx-auto flex items-center justify-between">
          <span className="text-slate-400">
            New Zealand&apos;s trusted tyre distributor since 2003
          </span>
          <div className="flex items-center gap-6">
            <a
              href="tel:0800236587"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone size={12} />
              0800 236 587
            </a>
            <span className="text-slate-600">|</span>
            <Link
              href="/dealer-login"
              className="text-brand-orange hover:text-brand-orange-dark font-medium transition-colors"
            >
              Dealer Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header
        className={cn(
          "sticky top-0 z-50 bg-white transition-shadow duration-300",
          isScrolled ? "shadow-md" : "shadow-sm"
        )}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-brand-orange rounded flex items-center justify-center">
                <span className="text-white font-black text-sm">M</span>
              </div>
              <div>
                <div className="font-black text-brand-navy text-lg leading-none tracking-tight">
                  MOMENTUM
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-muted leading-none">
                  Tyres
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) =>
                item.hasDropdown ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setShowProductMenu(true)}
                    onMouseLeave={() => setShowProductMenu(false)}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                        pathname.startsWith("/products")
                          ? "text-brand-orange bg-orange-50"
                          : "text-slate-700 hover:text-brand-navy hover:bg-slate-50"
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform duration-200",
                          showProductMenu ? "rotate-180" : ""
                        )}
                      />
                    </button>
                    {showProductMenu && (
                      <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl border border-brand-border py-2 animate-fade-in">
                        <Link
                          href="/products"
                          className="flex items-center px-4 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-surface transition-colors border-b border-brand-border mb-1"
                        >
                          All Products
                        </Link>
                        {productCategories.map((cat) => (
                          <Link
                            key={cat.href}
                            href={cat.href}
                            className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:text-brand-navy hover:bg-brand-surface transition-colors"
                          >
                            {cat.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                      pathname === item.href || pathname.startsWith(item.href + "/")
                        ? "text-brand-orange bg-orange-50"
                        : "text-slate-700 hover:text-brand-navy hover:bg-slate-50"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/become-dealer"
                className="text-sm font-semibold text-brand-navy hover:text-brand-orange transition-colors"
              >
                Become a Dealer
              </Link>
              <Link
                href="/dealer-login"
                className="btn-primary text-sm py-2 px-4"
              >
                Dealer Portal
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-brand-border bg-white animate-fade-in">
            <div className="container mx-auto py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "block px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    pathname === item.href
                      ? "text-brand-orange bg-orange-50"
                      : "text-slate-700 hover:bg-brand-surface"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {/* Mobile product subcategories */}
              <div className="pl-4 space-y-1 border-l-2 border-brand-border ml-4">
                {productCategories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="block px-4 py-2 text-xs font-medium text-slate-500 hover:text-brand-navy transition-colors"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
              <div className="pt-4 border-t border-brand-border space-y-2">
                <Link
                  href="/become-dealer"
                  className="block px-4 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-surface rounded-lg transition-colors"
                >
                  Become a Dealer
                </Link>
                <Link
                  href="/dealer-login"
                  className="block px-4 py-3 text-sm font-semibold text-white bg-brand-orange rounded-lg text-center"
                >
                  Dealer Portal Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
