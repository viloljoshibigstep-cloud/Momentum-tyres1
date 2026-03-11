import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
}

function ProductCard({ product }: { product: Product }) {
  const categorySlug = product.category?.slug || "pcr";
  return (
    <Link
      href={`/products/${categorySlug}/${product.slug}`}
      className="group bg-white border border-brand-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-brand-orange/30 transition-all duration-300"
    >
      <div className="relative h-44 bg-brand-surface overflow-hidden">
        <Image
          src={
            product.image_url ||
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
          }
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute top-3 left-3">
          <span className="bg-brand-orange text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {product.application || "Tyre"}
          </span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold text-brand-orange uppercase tracking-wider mb-1">
          {product.category?.name}
        </p>
        <h3 className="font-bold text-brand-navy text-base mb-1 group-hover:text-brand-orange transition-colors">
          {product.name}
        </h3>
        <p className="text-brand-muted text-sm font-mono">{product.size}</p>
        {product.pattern && (
          <p className="text-xs text-brand-muted mt-1">Pattern: {product.pattern}</p>
        )}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-border">
          <span className="text-xs text-brand-muted">View Specifications</span>
          <ArrowRight size={16} className="text-brand-orange group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-brand-surface">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-3">Highlighted Products</p>
            <h2 className="section-title">Featured Tyres</h2>
          </div>
          <Link
            href="/products"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-brand-orange hover:gap-3 transition-all"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-8 md:hidden">
          <Link href="/products" className="btn-secondary text-sm">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
