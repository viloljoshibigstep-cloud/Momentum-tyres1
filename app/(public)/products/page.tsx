import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Grid3X3 } from "lucide-react";
import { getCategoriesWithProductCount } from "@/services/categories";

export const metadata: Metadata = {
  title: "Product Catalogue",
  description: "Browse Momentum Tyres full range of passenger, SUV, truck and off-road tyres.",
};

const categoryImages: Record<string, string> = {
  pcr: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "suv-4x4": "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=600&q=80",
  "light-truck": "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=600&q=80",
  tbr: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80",
  "off-road": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80",
};

export default async function ProductsPage() {
  const categories = await getCategoriesWithProductCount();

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy py-16">
        <div className="container mx-auto text-center">
          <p className="section-label mb-3">Full Range</p>
          <h1 className="text-4xl font-black text-white mb-4">Product Catalogue</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Premium tyre solutions for every vehicle and application — from daily passenger cars
            to heavy commercial fleets.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-brand-surface border-b border-brand-border">
        <div className="container mx-auto py-3">
          <nav className="flex items-center gap-2 text-xs text-brand-muted">
            <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <span>/</span>
            <span className="text-brand-navy font-medium">Products</span>
          </nav>
        </div>
      </div>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto">
          {categories.length === 0 ? (
            <div className="text-center py-20">
              <Grid3X3 size={40} className="text-brand-muted mx-auto mb-4" />
              <p className="text-brand-muted">No categories found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products/${cat.slug}`}
                  className="group relative rounded-2xl overflow-hidden bg-brand-navy hover:ring-2 hover:ring-brand-orange transition-all duration-300 card-hover"
                >
                  {/* Background image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={categoryImages[cat.slug] || categoryImages.pcr}
                      alt={cat.name}
                      fill
                      className="object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                      unoptimized
                    />
                  </div>
                  {/* Content overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
                          {cat.product_count || 0} Products
                        </p>
                        <h2 className="text-xl font-black text-white">{cat.name}</h2>
                        <p className="text-slate-300 text-sm mt-1 line-clamp-2">
                          {cat.description}
                        </p>
                      </div>
                      <ArrowUpRight
                        size={20}
                        className="category-arrow text-slate-400 group-hover:text-brand-orange flex-shrink-0 mt-1"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
