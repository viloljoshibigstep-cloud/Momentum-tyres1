"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle, AlertCircle, AlertTriangle, Package } from "lucide-react";
import type { Stock, Product } from "@/types";

type StockRow = Stock & { product?: Product };

function getStatusColor(status: string) {
  if (status === "in_stock") return "bg-green-50 text-brand-green border-green-200";
  if (status === "low_stock") return "bg-yellow-50 text-yellow-700 border-yellow-200";
  return "bg-red-50 text-brand-red border-red-200";
}

function autoStatus(qty: number): string {
  if (qty === 0) return "backorder";
  if (qty < 10) return "low_stock";
  return "in_stock";
}

export default function AdminStockPage() {
  const [stocks, setStocks] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [msgs, setMsgs] = useState<Record<string, { type: "success" | "error"; text: string }>>({});
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("stock")
      .select("*, product:products(id, name, size, sku, category_id, category:categories(name))")
      .order("updated_at", { ascending: false });
    setStocks(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateStock(stockId: string, qty: number) {
    setSaving((prev) => ({ ...prev, [stockId]: true }));
    const newStatus = autoStatus(qty);
    const supabase = createClient();
    const { error } = await supabase
      .from("stock")
      .update({ quantity: qty, status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", stockId);

    setMsgs((prev) => ({
      ...prev,
      [stockId]: error
        ? { type: "error", text: "Failed to save." }
        : { type: "success", text: "Saved!" },
    }));
    setSaving((prev) => ({ ...prev, [stockId]: false }));

    if (!error) {
      setStocks((prev) =>
        prev.map((s) =>
          s.id === stockId ? { ...s, quantity: qty, status: newStatus as Stock["status"] } : s
        )
      );
      setTimeout(
        () => setMsgs((prev) => { const n = { ...prev }; delete n[stockId]; return n; }),
        3000
      );
    }
  }

  const filtered = stocks.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  const lowCount = stocks.filter((s) => s.status === "low_stock").length;
  const backorderCount = stocks.filter((s) => s.status === "backorder").length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-brand-navy">Stock Management</h1>
        <p className="text-brand-muted text-sm mt-1">
          Update stock levels. Status is automatically calculated from quantity.
        </p>
      </div>

      {/* Alert summary */}
      {(lowCount > 0 || backorderCount > 0) && (
        <div className="flex gap-4 mb-6">
          {lowCount > 0 && (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700">
                {lowCount} product{lowCount !== 1 ? "s" : ""} low on stock
              </span>
            </div>
          )}
          {backorderCount > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="text-brand-red" />
              <span className="text-sm font-semibold text-brand-red">
                {backorderCount} product{backorderCount !== 1 ? "s" : ""} on backorder
              </span>
            </div>
          )}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { value: "all", label: `All (${stocks.length})` },
          { value: "in_stock", label: `In Stock (${stocks.filter((s) => s.status === "in_stock").length})` },
          { value: "low_stock", label: `Low Stock (${lowCount})` },
          { value: "backorder", label: `Backorder (${backorderCount})` },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === tab.value
                ? "bg-brand-navy text-white"
                : "bg-white border border-brand-border text-brand-muted hover:bg-brand-surface"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white border border-brand-border rounded-2xl p-8">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 bg-brand-surface rounded-lg" />)}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-2xl p-16 text-center">
          <Package size={48} className="text-brand-muted mx-auto mb-4" />
          <p className="text-brand-muted">No stock records found.</p>
        </div>
      ) : (
        <div className="bg-white border border-brand-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border bg-brand-surface">
                {["Product", "SKU", "Size", "Qty", "Status", "Last Updated", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((stock) => (
                <tr key={stock.id} className="hover:bg-brand-surface/50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-brand-navy text-sm">{stock.product?.name || "—"}</p>
                    <p className="text-xs text-brand-muted">
                      {(stock.product as unknown as { category?: { name?: string } })?.category?.name}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-brand-muted">{stock.product?.sku || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-brand-muted">{stock.product?.size}</span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={stock.quantity}
                      min={0}
                      className="w-20 px-2 py-1.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange text-center"
                      onBlur={(e) => {
                        const newQty = parseInt(e.target.value);
                        if (!isNaN(newQty) && newQty !== stock.quantity) {
                          updateStock(stock.id, newQty);
                        }
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${getStatusColor(stock.status)}`}>
                      {stock.status === "in_stock" ? "In Stock" : stock.status === "low_stock" ? "Low Stock" : "Backorder"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-brand-muted">
                      {new Date(stock.updated_at).toLocaleDateString("en-NZ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {saving[stock.id] && <Loader2 size={12} className="animate-spin text-brand-muted" />}
                      {msgs[stock.id] && (
                        <div className={`flex items-center gap-1 text-xs ${msgs[stock.id].type === "success" ? "text-brand-green" : "text-brand-red"}`}>
                          {msgs[stock.id].type === "success" ? (
                            <CheckCircle size={12} />
                          ) : (
                            <AlertCircle size={12} />
                          )}
                          {msgs[stock.id].text}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
