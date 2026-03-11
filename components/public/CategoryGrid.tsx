import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
}

// Fallback category data for when DB is loading
const categoryMeta: Record<string, { description: string; image: string; count: string }> = {
  pcr: {
    description: "Our tyres deliver superior grip and longevity for every journey — city streets to open highway.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    count: "120+ SKUs",
  },
  "suv-4x4": {
    description: "Engineered for the demands of SUV and 4WD vehicles on any terrain.",
    image: "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=400&q=80",
    count: "80+ SKUs",
  },
  "light-truck": {
    description: "Dependable tyres for light commercial vehicles and delivery fleets.",
    image: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=400&q=80",
    count: "60+ SKUs",
  },
  tbr: {
    description: "Heavy duty radial tyres built for long-haul truck and bus applications.",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&q=80",
    count: "90+ SKUs",
  },
  "off-road": {
    description: "Extreme terrain tyres for mining, construction and adventure.",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&q=80",
    count: "50+ SKUs",
  },
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="section-label mb-3">Product Categories</p>
            <h2 className="section-title">
              Performance Meets Style —
              <br />
              Explore Our Collection
            </h2>
          </div>
          <div className="relative max-w-xs">
            <input
              type="text"
              placeholder="Search your tyre size here..."
              className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-brand-navy rounded flex items-center justify-center hover:bg-brand-orange transition-colors">
              <ArrowUpRight size={14} className="text-white" />
            </button>
          </div>
        </div>

        {/* Category cards — ref UI style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.slice(0, 3).map((cat) => {
            const meta = categoryMeta[cat.slug] || categoryMeta.pcr;
            return (
              <Link
                key={cat.id}
                href={`/products/${cat.slug}`}
                className="group relative bg-brand-navy rounded-2xl overflow-hidden p-6 hover:ring-2 hover:ring-brand-orange transition-all duration-300 card-hover"
              >
                {/* Arrow */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                    <Image
                      src={meta.image}
                      alt={cat.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                  <ArrowUpRight
                    size={20}
                    className="category-arrow text-slate-400 group-hover:text-brand-orange"
                  />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{cat.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                  {cat.description || meta.description}
                </p>
                <p className="text-brand-orange text-xs font-semibold mt-4 uppercase tracking-wider">
                  {meta.count}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Second row */}
        {categories.length > 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            {categories.slice(3, 5).map((cat) => {
              const meta = categoryMeta[cat.slug] || categoryMeta.pcr;
              return (
                <Link
                  key={cat.id}
                  href={`/products/${cat.slug}`}
                  className="group relative bg-brand-navy rounded-2xl overflow-hidden p-6 hover:ring-2 hover:ring-brand-orange transition-all duration-300 card-hover"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                      <Image
                        src={meta.image}
                        alt={cat.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                    <ArrowUpRight
                      size={20}
                      className="category-arrow text-slate-400 group-hover:text-brand-orange"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{cat.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {cat.description || meta.description}
                  </p>
                  <p className="text-brand-orange text-xs font-semibold mt-4 uppercase tracking-wider">
                    {meta.count}
                  </p>
                </Link>
              );
            })}
          </div>
        )}

        {/* Large bottom banner */}
        <div className="mt-16 text-center bg-brand-surface rounded-2xl p-10">
          <h3 className="text-2xl md:text-3xl font-black text-brand-navy mb-3">
            Tyre & Wheel Solutions Delivering Quality
            <span className="text-brand-orange"> Your Vehicle Deserves</span>
          </h3>
          <p className="text-brand-muted max-w-xl mx-auto mb-6">
            From premium performance to heavy commercial — we have the tyre to meet your
            specific requirements, anywhere in New Zealand.
          </p>
          <Link href="/products" className="btn-primary">
            View Full Catalogue
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
