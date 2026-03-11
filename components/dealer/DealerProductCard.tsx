"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Product, Stock } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { StockBadge } from "./StockBadge";
import { useCart } from "@/hooks/useCart";

interface DealerProductCardProps {
  product: Product;
  stock?: Stock;
  dealerPrice?: number;
}

export function DealerProductCard({
  product,
  stock,
  dealerPrice,
}: DealerProductCardProps) {
  const { addItem, items } = useCart();
  const inCart = items.find((i) => i.product_id === product.id);
  const price = dealerPrice || product.base_price || 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, price);
  }

  return (
    <Link
      href={`/dealer/products/${product.slug}`}
      className="group flex flex-col bg-white border border-brand-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-brand-orange/30 transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative h-44 bg-brand-surface overflow-hidden">
        <Image
          src={
            product.image_url ||
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
          }
          alt={product.name}
          fill
          className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
        />
        {stock && (
          <div className="absolute top-3 left-3">
            <StockBadge status={stock.status} size="sm" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-semibold text-brand-orange uppercase tracking-wider mb-1">
          {product.category?.name}
        </p>
        <h3 className="font-bold text-brand-navy text-sm leading-snug mb-1 group-hover:text-brand-orange transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="font-mono text-base font-black text-brand-navy mb-1">{product.size}</p>
        {product.sku && (
          <p className="text-xs text-brand-muted font-mono">SKU: {product.sku}</p>
        )}

        {/* Price */}
        <div className="mt-auto pt-4 border-t border-brand-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-muted">Your Price</p>
              <p className="text-lg font-black text-brand-orange">
                {formatCurrency(price)}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                inCart
                  ? "bg-brand-green-light text-brand-green border border-green-200"
                  : "bg-brand-orange text-white hover:bg-brand-orange-dark"
              }`}
            >
              <ShoppingCart size={14} />
              {inCart ? "In Cart" : "Add"}
            </button>
          </div>
          {inCart && (
            <p className="text-xs text-brand-green mt-1.5 flex items-center gap-1">
              <span>×{inCart.quantity} in cart</span>
              <ArrowRight size={10} />
              <Link href="/dealer/cart" className="underline">
                View Cart
              </Link>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
