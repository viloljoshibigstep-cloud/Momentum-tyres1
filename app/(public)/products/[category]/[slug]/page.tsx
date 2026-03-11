import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Download, ArrowLeft, ArrowRight } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/services/products";
import { getCategoryBySlug } from "@/services/categories";
import { SpecTable } from "@/components/products/SpecTable";
import { ProductCard } from "@/components/products/ProductCard";

interface Props {
  params: { category: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} ${product.size}`,
    description: product.description || `${product.name} ${product.size} — View specifications and technical data.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const [product, category] = await Promise.all([
    getProductBySlug(params.slug),
    getCategoryBySlug(params.category),
  ]);

  if (!product) notFound();

  const related = product.category_id
    ? await getRelatedProducts(product.id, product.category_id, 3)
    : [];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-brand-surface border-b border-brand-border">
        <div className="container mx-auto py-3">
          <nav className="flex items-center gap-2 text-xs text-brand-muted flex-wrap">
            <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-brand-orange transition-colors">Products</Link>
            <span>/</span>
            <Link href={`/products/${params.category}`} className="hover:text-brand-orange transition-colors capitalize">
              {category?.name || params.category}
            </Link>
            <span>/</span>
            <span className="text-brand-navy font-medium truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product detail */}
      <section className="py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div>
              <div className="relative aspect-square bg-brand-surface rounded-2xl overflow-hidden border border-brand-border">
                <Image
                  src={
                    product.image_url ||
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
                  }
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  priority
                  unoptimized
                />
              </div>
              {/* Gallery thumbnails */}
              {product.gallery_urls && product.gallery_urls.length > 0 && (
                <div className="flex gap-3 mt-4">
                  {product.gallery_urls.slice(0, 4).map((url, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 rounded-lg overflow-hidden border-2 border-brand-border"
                    >
                      <Image
                        src={url}
                        alt={`${product.name} view ${i + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="text-xs font-semibold text-brand-orange uppercase tracking-wider mb-2">
                {product.category?.name}
              </p>
              <h1 className="text-3xl font-black text-brand-navy mb-1">{product.name}</h1>
              <div className="font-mono text-2xl font-bold text-brand-navy/70 mb-4">
                {product.size}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.application && (
                  <span className="bg-brand-orange/10 text-brand-orange text-xs font-semibold px-3 py-1 rounded-full">
                    {product.application}
                  </span>
                )}
                {product.pattern && (
                  <span className="bg-brand-surface text-brand-navy text-xs font-medium px-3 py-1 rounded-full border border-brand-border">
                    {product.pattern}
                  </span>
                )}
                {product.sku && (
                  <span className="bg-brand-surface text-brand-muted text-xs font-mono px-3 py-1 rounded-full border border-brand-border">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {product.description && (
                <p className="text-brand-muted leading-relaxed mb-6">{product.description}</p>
              )}

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-brand-navy text-sm uppercase tracking-wide mb-3">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dealer CTA */}
              <div className="bg-brand-navy rounded-xl p-5 mb-6">
                <p className="text-white text-sm font-semibold mb-1">
                  Pricing available to registered dealers only
                </p>
                <p className="text-slate-400 text-xs mb-3">
                  Log in or apply to become a dealer to see pricing and stock availability.
                </p>
                <div className="flex gap-3">
                  <Link href="/dealer-login" className="btn-primary text-sm py-2 px-4">
                    Dealer Login
                  </Link>
                  <Link href="/become-dealer" className="btn-ghost-white text-sm py-2 px-4">
                    Apply Now
                  </Link>
                </div>
              </div>

              {/* Datasheet */}
              {product.datasheet_url && (
                <a
                  href={product.datasheet_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy border border-brand-border rounded-lg px-4 py-2.5 hover:bg-brand-surface transition-colors"
                >
                  <Download size={16} className="text-brand-orange" />
                  Download Technical Datasheet (PDF)
                </a>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div className="mt-14">
            <h2 className="text-xl font-black text-brand-navy mb-6">
              Technical Specifications
            </h2>
            <SpecTable
              size={product.size}
              pattern={product.pattern}
              application={product.application}
              specifications={product.specifications}
              sku={product.sku}
            />
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-brand-navy">Related Products</h2>
                <Link
                  href={`/products/${params.category}`}
                  className="flex items-center gap-1 text-sm font-semibold text-brand-orange hover:gap-2 transition-all"
                >
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Back */}
          <div className="mt-10">
            <Link
              href={`/products/${params.category}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-muted hover:text-brand-navy transition-colors"
            >
              <ArrowLeft size={14} />
              Back to {category?.name || "Products"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
