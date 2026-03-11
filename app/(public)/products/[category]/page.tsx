import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug } from "@/services/categories";
import { getProductsByCategory, getProducts } from "@/services/products";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilter } from "@/components/products/ProductFilter";
import { Suspense } from "react";
import { Package } from "lucide-react";

interface Props {
  params: { category: string };
  searchParams: { search?: string; application?: string; size?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description: category.description || `Browse ${category.name} tyres from Momentum`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const category = await getCategoryBySlug(params.category);
  if (!category) notFound();

  // If filters active, use full product search; otherwise category-filtered
  const hasFilters = searchParams.search || searchParams.application || searchParams.size;
  const products = hasFilters
    ? await getProducts({
        category: params.category,
        search: searchParams.search,
        application: searchParams.application !== "All" ? searchParams.application : undefined,
        size: searchParams.size,
      })
    : await getProductsByCategory(params.category);

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy py-12">
        <div className="container mx-auto">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            <span>/</span>
            <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="text-3xl font-black text-white">{category.name}</h1>
          {category.description && (
            <p className="text-slate-400 mt-2 max-w-xl">{category.description}</p>
          )}
        </div>
      </section>

      <div className="container mx-auto py-10">
        <Suspense fallback={null}>
          <ProductFilter />
        </Suspense>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-brand-surface rounded-2xl">
            <Package size={40} className="text-brand-muted mx-auto mb-4" />
            <h3 className="font-bold text-brand-navy mb-2">No Products Found</h3>
            <p className="text-brand-muted text-sm mb-4">
              Try adjusting your search or filter criteria.
            </p>
            <Link href={`/products/${params.category}`} className="btn-secondary text-sm">
              Clear Filters
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-brand-muted">
                <span className="font-semibold text-brand-navy">{products.length}</span>{" "}
                product{products.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
