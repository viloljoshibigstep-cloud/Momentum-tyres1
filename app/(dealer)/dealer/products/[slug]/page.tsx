"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Plus, Minus, FileText, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/hooks/useCart";
import { SpecTable } from "@/components/products/SpecTable";
import { StockBadge } from "@/components/dealer/StockBadge";
import { formatCurrency } from "@/lib/utils";
import type { ProductWithStock } from "@/types";

async function getProductWithStockAndPrice(
  slug: string,
  dealerId: string
): Promise<ProductWithStock | null> {
  const supabase = createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !product) return null;

  const { data: stock } = await supabase
    .from("stock")
    .select("*")
    .eq("product_id", product.id)
    .single();

  const { data: override } = await supabase
    .from("dealer_pricing")
    .select("price")
    .eq("dealer_id", dealerId)
    .eq("product_id", product.id)
    .single();

  let dealer_price = product.base_price || 0;
  if (override) {
    dealer_price = override.price;
  } else {
    const { data: dealer } = await supabase
      .from("dealers")
      .select("tier:dealer_tiers(pricing_multiplier)")
      .eq("id", dealerId)
      .single();
    if (dealer?.tier) {
      const tier = dealer.tier as unknown as { pricing_multiplier: number };
      dealer_price = (product.base_price || 0) * tier.pricing_multiplier;
    }
  }

  return {
    ...product,
    stock: stock || undefined,
    dealer_price: Math.round(dealer_price * 100) / 100,
  };
}

export default function DealerProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<ProductWithStock | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem, items } = useCart();

  const inCart = product ? items.find((i) => i.product_id === product.id) : null;

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/dealer-login");
        return;
      }
      const data = await getProductWithStockAndPrice(slug, user.id);
      setProduct(data);
      setLoading(false);
    }
    load();
  }, [slug, router]);

  function handleAddToCart() {
    if (!product || !product.dealer_price) return;
    addItem(product, quantity, product.dealer_price);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-8 bg-brand-surface rounded w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-72 bg-brand-surface rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 bg-brand-surface rounded w-3/4" />
            <div className="h-4 bg-brand-surface rounded w-1/2" />
            <div className="h-10 bg-brand-surface rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h2 className="text-xl font-bold text-brand-navy mb-2">Product Not Found</h2>
        <Link href="/dealer/products" className="btn-primary text-sm">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const stock = product.stock;
  const isAvailable = stock?.status !== undefined;
  const stockQty = stock?.quantity ?? 0;
  const maxQty = stock?.status === "in_stock" ? Math.min(stockQty, 99) : 99;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/dealer/products"
        className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-navy text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Catalogue
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* Image */}
        <div className="bg-brand-surface rounded-2xl overflow-hidden flex items-center justify-center h-80">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
          ) : (
            <div className="text-center">
              <div className="text-6xl font-black text-brand-orange/20">MT</div>
              <p className="text-brand-muted text-sm mt-2">{product.size}</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <p className="text-xs font-semibold text-brand-orange uppercase tracking-widest mb-2">
              {product.category.name}
            </p>
          )}
          <h1 className="text-2xl font-black text-brand-navy mb-1">{product.name}</h1>
          <p className="text-3xl font-black text-brand-muted font-mono mb-3">{product.size}</p>

          <div className="flex flex-wrap gap-2 mb-5">
            {product.pattern && (
              <span className="text-xs bg-brand-surface text-brand-navy px-2 py-1 rounded-md font-medium">
                {product.pattern}
              </span>
            )}
            {product.application && (
              <span className="text-xs bg-brand-surface text-brand-navy px-2 py-1 rounded-md font-medium">
                {product.application}
              </span>
            )}
            {product.sku && (
              <span className="text-xs bg-brand-surface text-brand-muted px-2 py-1 rounded-md font-mono">
                SKU: {product.sku}
              </span>
            )}
          </div>

          {/* Stock badge */}
          {stock && (
            <div className="mb-5">
              <StockBadge status={stock.status} quantity={stock.quantity} size="md" />
            </div>
          )}

          {/* Dealer price */}
          {product.dealer_price ? (
            <div className="bg-brand-surface rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-1">
                Your Price (ex. GST)
              </p>
              <p className="text-3xl font-black text-brand-orange">
                {formatCurrency(product.dealer_price)}
              </p>
              {product.base_price && product.dealer_price < product.base_price && (
                <p className="text-xs text-brand-muted mt-1">
                  RRP: <span className="line-through">{formatCurrency(product.base_price)}</span>
                </p>
              )}
            </div>
          ) : (
            <div className="bg-brand-surface rounded-xl p-4 mb-6">
              <p className="text-sm text-brand-muted">Pricing not available for this product.</p>
            </div>
          )}

          {/* Quantity + Add to cart */}
          {product.dealer_price && isAvailable && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-brand-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-brand-surface transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center font-semibold text-brand-navy">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                  className="p-2.5 hover:bg-brand-surface transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-lg transition-all ${
                  addedToCart
                    ? "bg-brand-green text-white"
                    : "bg-brand-orange hover:bg-brand-orange-dark text-white"
                }`}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle size={16} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    {inCart ? `Update Cart (${inCart.quantity + quantity})` : "Add to Cart"}
                  </>
                )}
              </button>
            </div>
          )}

          {inCart && (
            <p className="text-xs text-brand-muted text-center">
              {inCart.quantity} already in cart.{" "}
              <Link href="/dealer/cart" className="text-brand-orange hover:underline">
                View cart →
              </Link>
            </p>
          )}

          {product.datasheet_url && (
            <a
              href={product.datasheet_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-brand-orange hover:underline mt-4"
            >
              <FileText size={14} />
              Download Product Datasheet (PDF)
            </a>
          )}
        </div>
      </div>

      {/* Spec table */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 mb-6">
        <h2 className="font-black text-brand-navy mb-4">Technical Specifications</h2>
        <SpecTable size={product.size} pattern={product.pattern} application={product.application} specifications={product.specifications} sku={product.sku} />
      </div>

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <div className="bg-white border border-brand-border rounded-2xl p-6">
          <h2 className="font-black text-brand-navy mb-4">Product Features</h2>
          <ul className="space-y-2">
            {product.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle size={16} className="text-brand-green flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
