"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Loader2,
  AlertCircle,
  CheckCircle,
  Package,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  delivery_address: z.string().min(5, "Delivery address is required"),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const GST_RATE = 0.15;

export default function DealerCartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderId, setOrderId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const gst = total * GST_RATE;
  const grandTotal = total + gst;

  async function onSubmit(data: FormData) {
    if (items.length === 0) {
      setErrorMsg("Your cart is empty. Add products before submitting.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/dealer-login");
        return;
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          dealer_id: user.id,
          status: "submitted",
          total_amount: grandTotal,
          delivery_address: data.delivery_address,
          notes: data.notes || null,
        })
        .select()
        .single();

      if (orderError || !order) throw orderError || new Error("Order creation failed");

      // Insert items
      const { error: itemsError } = await supabase.from("order_items").insert(
        items.map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: Math.round(item.quantity * item.unit_price * 100) / 100,
        }))
      );

      if (itemsError) {
        // Rollback order
        await supabase.from("orders").delete().eq("id", order.id);
        throw itemsError;
      }

      setOrderId(order.id);
      clearCart();
      setStatus("success");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Order submission failed. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-brand-green" />
        </div>
        <h1 className="text-2xl font-black text-brand-navy mb-3">Order Submitted!</h1>
        <p className="text-brand-muted mb-8">
          Your order has been submitted and is being reviewed. You&apos;ll receive updates as it
          progresses.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href={`/dealer/orders/${orderId}`} className="btn-primary text-sm">
            View Order
          </Link>
          <Link href="/dealer/products" className="btn-secondary text-sm">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 bg-brand-surface rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart size={36} className="text-brand-muted" />
        </div>
        <h1 className="text-2xl font-black text-brand-navy mb-3">Your Cart is Empty</h1>
        <p className="text-brand-muted mb-8">Add products from the catalogue to get started.</p>
        <Link href="/dealer/products" className="btn-primary">
          <Package size={16} />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-black text-brand-navy mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="bg-white border border-brand-border rounded-xl p-4 flex items-start gap-4"
            >
              {/* Product image */}
              <div className="w-16 h-16 bg-brand-surface rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {item.product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <span className="text-lg font-black text-brand-orange/30">MT</span>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-brand-navy text-sm truncate">{item.product.name}</p>
                <p className="text-xs text-brand-muted font-mono">{item.product.size}</p>
                {item.product.sku && (
                  <p className="text-xs text-brand-muted">SKU: {item.product.sku}</p>
                )}

                <div className="flex items-center gap-3 mt-2">
                  {/* Qty controls */}
                  <div className="flex items-center border border-brand-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="p-1.5 hover:bg-brand-surface transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="p-1.5 hover:bg-brand-surface transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-xs text-brand-muted">
                    × {formatCurrency(item.unit_price)}
                  </span>
                </div>
              </div>

              {/* Line total + remove */}
              <div className="text-right flex-shrink-0">
                <p className="font-black text-brand-navy text-sm">
                  {formatCurrency(item.quantity * item.unit_price)}
                </p>
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="mt-2 p-1.5 text-brand-muted hover:text-brand-red transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary + form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-brand-border rounded-2xl p-5 sticky top-6">
            <h2 className="font-black text-brand-navy mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-brand-muted">Subtotal (ex. GST)</span>
                <span className="font-semibold">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">GST (15%)</span>
                <span className="font-semibold">{formatCurrency(gst)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-brand-border font-black text-brand-navy">
                <span>Total (inc. GST)</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {status === "error" && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <AlertCircle size={14} className="text-brand-red flex-shrink-0 mt-0.5" />
                <p className="text-xs text-brand-red">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                  Delivery Address *
                </label>
                <textarea
                  {...register("delivery_address")}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
                  placeholder="123 Workshop Street, Auckland 2013"
                />
                {errors.delivery_address && (
                  <p className="text-xs text-brand-red mt-1">
                    {errors.delivery_address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                  Order Notes (optional)
                </label>
                <textarea
                  {...register("notes")}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
                  placeholder="Special delivery instructions, purchase order number, etc."
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full btn-primary justify-center py-3"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Order"
                )}
              </button>
            </form>

            <button
              onClick={() => {
                if (confirm("Clear your entire cart?")) clearCart();
              }}
              className="w-full mt-3 text-xs text-brand-muted hover:text-brand-red transition-colors py-2"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
