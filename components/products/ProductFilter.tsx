"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

const applications = [
  "All",
  "Passenger",
  "SUV",
  "Light Truck",
  "Commercial",
  "Off-Road",
];

interface ProductFilterProps {
  showCategoryFilter?: boolean;
  categories?: { slug: string; name: string }[];
}

export function ProductFilter({ showCategoryFilter, categories }: ProductFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [application, setApplication] = useState(searchParams.get("application") || "All");
  const [size, setSize] = useState(searchParams.get("size") || "");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (application && application !== "All") params.set("application", application);
      if (size) params.set("size", size);

      const query = params.toString();
      router.push(`${pathname}${query ? "?" + query : ""}`, { scroll: false });
    }, 350);

    return () => clearTimeout(timeout);
  }, [search, application, size, pathname, router]);

  function clearAll() {
    setSearch("");
    setApplication("All");
    setSize("");
  }

  const hasActiveFilters = search || (application && application !== "All") || size;

  return (
    <div className="bg-white border border-brand-border rounded-2xl p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or size (e.g. 225/45R17)..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-navy"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Toggle filters */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border rounded-lg transition-colors ${
            showFilters
              ? "bg-brand-navy text-white border-brand-navy"
              : "border-brand-border text-brand-navy hover:bg-brand-surface"
          }`}
        >
          <SlidersHorizontal size={16} />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-brand-orange text-white text-xs flex items-center justify-center">
              !
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <X size={14} />
            Clear All
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-brand-border">
          {/* Size filter */}
          <div>
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">
              Tyre Size
            </label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="e.g. 225/45R17"
              className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>

          {/* Application */}
          <div>
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">
              Application
            </label>
            <select
              value={application}
              onChange={(e) => setApplication(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
            >
              {applications.map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </select>
          </div>

          {/* Category (if shown) */}
          {showCategoryFilter && categories && (
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">
                Category
              </label>
              <select className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white">
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
