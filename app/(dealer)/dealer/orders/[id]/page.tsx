import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getOrderById } from "@/services/orders";
import {
  formatCurrency,
  formatDate,
  getOrderStatusColor,
  getOrderStatusLabel,
} from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Package, CheckCircle, Clock, Truck, XCircle } from "lucide-react";
import type { OrderStatus } from "@/types";

const statusTimeline: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: "submitted", label: "Submitted", icon: Clock },
  { status: "approved", label: "Approved", icon: CheckCircle },
  { status: "dispatched", label: "Dispatched", icon: Truck },
];

const statusOrder: OrderStatus[] = ["submitted", "approved", "backordered", "dispatched", "cancelled"];

export default async function DealerOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dealer-login");

  const order = await getOrderById(params.id);
  if (!order || order.dealer_id !== user.id) notFound();

  const currentStatusIndex = statusOrder.indexOf(order.status as OrderStatus);
  const GST = (order.total_amount || 0) * (0.15 / 1.15);
  const subtotal = (order.total_amount || 0) - GST;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dealer/orders"
          className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-navy text-sm mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Orders
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-brand-navy">
              {order.order_number || `Order #${order.id.slice(0, 8)}`}
            </h1>
            <p className="text-brand-muted text-sm">
              Placed {formatDate(order.created_at)}
            </p>
          </div>
          <span
            className={`text-sm font-semibold px-3 py-1.5 rounded-full ${getOrderStatusColor(order.status as OrderStatus)}`}
          >
            {getOrderStatusLabel(order.status as OrderStatus)}
          </span>
        </div>
      </div>

      {/* Status timeline (only for non-cancelled orders) */}
      {order.status !== "cancelled" && (
        <div className="bg-white border border-brand-border rounded-2xl p-6 mb-6">
          <h2 className="font-black text-brand-navy text-sm uppercase tracking-wide mb-5">
            Order Progress
          </h2>
          <div className="flex items-center">
            {statusTimeline.map((step, i) => {
              const stepIndex = statusOrder.indexOf(step.status);
              const isCompleted = currentStatusIndex >= stepIndex;
              const isActive = currentStatusIndex === stepIndex;
              const isBackordered = order.status === "backordered";

              return (
                <div key={step.status} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isBackordered && i === 1
                          ? "border-yellow-400 bg-yellow-50"
                          : isCompleted
                          ? "border-brand-green bg-brand-green"
                          : isActive
                          ? "border-brand-orange bg-brand-orange"
                          : "border-brand-border bg-white"
                      }`}
                    >
                      {isBackordered && i === 1 ? (
                        <Clock size={14} className="text-yellow-600" />
                      ) : isCompleted ? (
                        <step.icon size={14} className="text-white" />
                      ) : (
                        <step.icon size={14} className="text-brand-muted" />
                      )}
                    </div>
                    <p
                      className={`text-xs font-semibold mt-1 ${
                        isCompleted ? "text-brand-navy" : "text-brand-muted"
                      }`}
                    >
                      {isBackordered && i === 1 ? "Backordered" : step.label}
                    </p>
                  </div>
                  {i < statusTimeline.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        currentStatusIndex > statusOrder.indexOf(step.status)
                          ? "bg-brand-green"
                          : "bg-brand-border"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {order.status === "backordered" && (
            <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              This order is on backorder. We&apos;ll dispatch as soon as stock is available.
            </p>
          )}
        </div>
      )}

      {order.status === "cancelled" && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
          <XCircle size={18} className="text-brand-red flex-shrink-0" />
          <p className="text-sm font-semibold text-brand-red">This order has been cancelled.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order items */}
        <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-brand-border">
            <h2 className="font-black text-brand-navy text-sm uppercase tracking-wide">
              Order Items
            </h2>
          </div>
          {order.items && order.items.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border bg-brand-surface">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                    Product
                  </th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                    Qty
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-brand-navy text-sm">
                        {item.product?.name || "Product"}
                      </p>
                      <p className="text-xs text-brand-muted font-mono">
                        {item.product?.size}
                      </p>
                      <p className="text-xs text-brand-muted">
                        {formatCurrency(item.unit_price)} each
                      </p>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="font-semibold text-brand-navy text-sm">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="font-semibold text-brand-navy text-sm">
                        {formatCurrency(item.total_price)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-brand-muted">
              <Package size={24} className="mx-auto mb-2" />
              <p className="text-sm">Item details not available.</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-white border border-brand-border rounded-2xl p-5">
            <h2 className="font-black text-brand-navy text-sm uppercase tracking-wide mb-4">
              Order Total
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-muted">Subtotal (ex. GST)</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">GST (15%)</span>
                <span className="font-semibold">{formatCurrency(GST)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-brand-border font-black text-brand-navy">
                <span>Total (inc. GST)</span>
                <span>{formatCurrency(order.total_amount || 0)}</span>
              </div>
            </div>
          </div>

          {order.delivery_address && (
            <div className="bg-white border border-brand-border rounded-2xl p-5">
              <h3 className="font-black text-brand-navy text-sm uppercase tracking-wide mb-2">
                Delivery Address
              </h3>
              <p className="text-sm text-brand-muted">{order.delivery_address}</p>
            </div>
          )}

          {order.notes && (
            <div className="bg-white border border-brand-border rounded-2xl p-5">
              <h3 className="font-black text-brand-navy text-sm uppercase tracking-wide mb-2">
                Order Notes
              </h3>
              <p className="text-sm text-brand-muted">{order.notes}</p>
            </div>
          )}

          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5">
            <p className="text-sm text-brand-muted mb-3">Need help with this order?</p>
            <Link href="/contact" className="btn-primary text-sm w-full justify-center">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
