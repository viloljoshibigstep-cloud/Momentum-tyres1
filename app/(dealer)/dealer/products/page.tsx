import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getProducts } from "@/services/products";
import { getDealerPricesBulk } from "@/services/dealers";
import { getStockBulk } from "@/services/stock";
import { DealerProductCard } from "@/components/dealer/DealerProductCard";
import { ProductFilter } from "@/components/products/ProductFilter";
import { Suspense } from "react";
import { Package } from "lucide-react";

interface SearchParams {
  search?: string;
  category?: string;
  application?: string;
  size?: string;
  stock?: string;
}

export default async function DealerProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dealer-login");

  const [productsResult, categoriesResult] = await Promise.all([
    getProducts({
      search: searchParams.search,
      category: searchParams.category,
      application: searchParams.application,
      size: searchParams.size,
    }),
    supabase.from("categories").select("id, name, slug").order("sort_order"),
  ]);

  const products = productsResult || [];
  const categories = categoriesResult.data || [];

  // Get dealer prices and stock for all products
  const productIds = products.map((p) => p.id);
  const [dealerPrices, stockLevels] = await Promise.all([
    getDealerPricesBulk(user.id, productIds),
    getStockBulk(productIds),
  ]);

  // Filter by stock status if requested
  let filteredProducts = products;
  if (searchParams.stock && searchParams.stock !== "all") {
    filteredProducts = products.filter((p) => {
      const stock = stockLevels[p.id];
      return stock?.status === searchParams.stock;
    });
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-brand-navy">Product Catalogue</h1>
        <p className="text-brand-muted text-sm mt-1">
          Browse {products.length} products with your exclusive dealer pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-brand-border rounded-xl p-4 sticky top-6">
            <h3 className="font-black text-brand-navy text-sm mb-4 uppercase tracking-wide">
              Filters
            </h3>
            <Suspense fallback={null}>
              <ProductFilter categories={categories} />
            </Suspense>

            {/* Stock filter */}
            <div className="mt-4 pt-4 border-t border-brand-border">
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-2">
                Stock Status
              </label>
              <div className="space-y-1">
                {[
                  { value: "all", label: "All Products" },
                  { value: "in_stock", label: "In Stock" },
                  { value: "low_stock", label: "Low Stock" },
                  { value: "backorder", label: "Backorder" },
                ].map((opt) => (
                  <a
                    key={opt.value}
                    href={`/dealer/products?${new URLSearchParams({
                      ...Object.fromEntries(
                        Object.entries(searchParams).filter(([k]) => k !== "stock")
                      ),
                      ...(opt.value !== "all" ? { stock: opt.value } : {}),
                    })}`}
                    className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      (searchParams.stock || "all") === opt.value
                        ? "bg-brand-orange text-white font-semibold"
                        : "text-brand-muted hover:bg-brand-surface"
                    }`}
                  >
                    {opt.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-brand-border rounded-2xl p-16 text-center">
              <Package size={48} className="text-brand-muted mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand-navy mb-2">No Products Found</h3>
              <p className="text-brand-muted mb-4">Try adjusting your filters.</p>
              <a href="/dealer/products" className="btn-primary text-sm">
                Clear Filters
              </a>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-brand-muted">
                  Showing <span className="font-semibold text-brand-navy">{filteredProducts.length}</span> products
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <DealerProductCard
                    key={product.id}
                    product={product}
                    dealerPrice={dealerPrices[product.id]}
                    stock={stockLevels[product.id]}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
