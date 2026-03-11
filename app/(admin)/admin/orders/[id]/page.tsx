"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate, getOrderStatusColor, getOrderStatusLabel } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const STATUS_OPTIONS: OrderStatus[] = [
  "submitted",
  "approved",
  "backordered",
  "dispatched",
  "cancelled",
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<OrderStatus>("submitted");
  const [internalNote, setInternalNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("orders")
      .select("*, dealer:dealers(company_name, email, phone), items:order_items(*, product:products(name, size, sku))")
      .eq("id", id)
      .single();

    if (data) {
      setOrder(data);
      setStatus(data.status as OrderStatus);
      setInternalNote(data.internal_notes || "");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true);
    setSaveMsg(null);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({
          status,
          internal_notes: internalNote || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
      setOrder((prev) => prev ? { ...prev, status, internal_notes: internalNote } : prev);
      setSaveMsg({ type: "success", text: "Order updated successfully." });
    } catch (err: unknown) {
      setSaveMsg({ type: "error", text: err instanceof Error ? err.message : "Update failed." });
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-brand-orange" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-brand-muted mb-4">Order not found.</p>
        <Link href="/admin/orders" className="btn-primary text-sm">Back to Orders</Link>
      </div>
    );
  }

  const GST = (order.total_amount || 0) * (0.15 / 1.15);
  const subtotal = (order.total_amount || 0) - GST;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="text-brand-muted hover:text-brand-navy">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-brand-navy">{order.order_number}</h1>
          <p className="text-brand-muted text-sm">
            {order.dealer?.company_name} · {formatDate(order.created_at)}
          </p>
        </div>
        <span className={`ml-auto text-sm font-semibold px-3 py-1.5 rounded-full ${getOrderStatusColor(order.status as OrderStatus)}`}>
          {getOrderStatusLabel(order.status as OrderStatus)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
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
                  {["Product", "SKU", "Qty", "Unit Price", "Total"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-brand-navy text-sm">{item.product?.name || "—"}</p>
                      <p className="text-xs font-mono text-brand-muted">{item.product?.size}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-brand-muted">{item.product?.sku || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-brand-navy">{item.quantity}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{formatCurrency(item.unit_price)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">{formatCurrency(item.total_price)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-8 text-brand-muted text-sm">No items.</p>
          )}

          <div className="border-t border-brand-border px-5 py-4 bg-brand-surface">
            <div className="flex justify-end">
              <div className="space-y-1 text-sm min-w-[200px]">
                <div className="flex justify-between">
                  <span className="text-brand-muted">Subtotal (ex. GST)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">GST (15%)</span>
                  <span>{formatCurrency(GST)}</span>
                </div>
                <div className="flex justify-between font-black text-brand-navy pt-1 border-t border-brand-border">
                  <span>Total</span>
                  <span>{formatCurrency(order.total_amount || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Management panel */}
        <div className="space-y-4">
          {/* Dealer info */}
          <div className="bg-white border border-brand-border rounded-2xl p-5">
            <h3 className="font-black text-brand-navy text-sm uppercase tracking-wide mb-3">
              Dealer
            </h3>
            <p className="font-semibold text-brand-navy">{order.dealer?.company_name}</p>
            <p className="text-sm text-brand-muted">{order.dealer?.email}</p>
            {order.dealer?.phone && (
              <p className="text-sm text-brand-muted">{order.dealer.phone}</p>
            )}
            {order.delivery_address && (
              <div className="mt-3 pt-3 border-t border-brand-border">
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-1">
                  Delivery
                </p>
                <p className="text-sm text-brand-muted">{order.delivery_address}</p>
              </div>
            )}
          </div>

          {/* Update status */}
          <div className="bg-white border border-brand-border rounded-2xl p-5">
            <h3 className="font-black text-brand-navy text-sm uppercase tracking-wide mb-3">
              Update Status
            </h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white mb-3"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {getOrderStatusLabel(s)}
                </option>
              ))}
            </select>

            <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
              Internal Notes
            </label>
            <textarea
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none mb-3"
              placeholder="Internal notes (not visible to dealer)..."
            />

            {saveMsg && (
              <div className={`flex items-center gap-2 rounded-lg p-3 mb-3 ${
                saveMsg.type === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}>
                {saveMsg.type === "success" ? (
                  <CheckCircle size={14} className="text-brand-green" />
                ) : (
                  <AlertCircle size={14} className="text-brand-red" />
                )}
                <p className={`text-xs ${saveMsg.type === "success" ? "text-brand-green" : "text-brand-red"}`}>
                  {saveMsg.text}
                </p>
              </div>
            )}

            <button
              onClick={save}
              disabled={saving}
              className="w-full btn-primary justify-center py-2.5 text-sm"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Dealer notes */}
          {order.notes && (
            <div className="bg-white border border-brand-border rounded-2xl p-5">
              <h3 className="font-black text-brand-navy text-sm uppercase tracking-wide mb-2">
                Dealer Notes
              </h3>
              <p className="text-sm text-brand-muted">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
