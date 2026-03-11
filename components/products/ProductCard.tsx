import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const categorySlug = product.category?.slug || "pcr";
  const href = `/products/${categorySlug}/${product.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col bg-white border border-brand-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-brand-orange/30 transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative h-48 bg-brand-surface overflow-hidden">
        <Image
          src={
            product.image_url ||
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80"
          }
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        {/* Application badge */}
        {product.application && (
          <div className="absolute top-3 left-3">
            <span className="bg-brand-navy text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {product.application}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-semibold text-brand-orange uppercase tracking-wider mb-1">
          {product.category?.name || "Tyre"}
        </p>
        <h3 className="font-bold text-brand-navy text-sm leading-snug mb-2 group-hover:text-brand-orange transition-colors">
          {product.name}
        </h3>

        {/* Size — prominent, mono */}
        <div className="font-mono text-lg font-black text-brand-navy mb-1">
          {product.size}
        </div>

        {product.pattern && (
          <p className="text-xs text-brand-muted mb-3">
            Pattern: <span className="font-medium text-brand-navy">{product.pattern}</span>
          </p>
        )}

        {product.sku && (
          <p className="text-xs text-brand-muted">
            SKU: <span className="font-mono">{product.sku}</span>
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-border">
          {product.datasheet_url ? (
            <span className="flex items-center gap-1 text-xs text-brand-muted">
              <FileText size={12} />
              Datasheet
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1 text-xs font-semibold text-brand-orange group-hover:gap-2 transition-all">
            View Specs <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// Skeleton loader
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-brand-border rounded-2xl overflow-hidden">
      <div className="h-48 skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-3 skeleton w-24" />
        <div className="h-4 skeleton w-full" />
        <div className="h-6 skeleton w-32" />
        <div className="h-3 skeleton w-48" />
      </div>
    </div>
  );
}
