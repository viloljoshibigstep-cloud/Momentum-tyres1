"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate, getOrderStatusColor, getOrderStatusLabel } from "@/lib/utils";
import { ShoppingBag, Search, ArrowRight } from "lucide-react";
import type { Order, OrderStatus } from "@/types";

const statusTabs = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "approved", label: "Approved" },
  { value: "backordered", label: "Backordered" },
  { value: "dispatched", label: "Dispatched" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("orders")
      .select("*, dealer:dealers(company_name, email), items:order_items(count)")
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      (o.order_number || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.dealer?.company_name || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-brand-navy">Orders</h1>
        <p className="text-brand-muted text-sm mt-1">Manage all dealer orders.</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              statusFilter === tab.value
                ? "bg-brand-navy text-white"
                : "bg-white border border-brand-border text-brand-muted hover:bg-brand-surface"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 opacity-70">
              ({tab.value === "all" ? orders.length : orders.filter((o) => o.status === tab.value).length})
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order number or dealer..."
          className="w-full pl-9 pr-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
        />
      </div>

      {loading ? (
        <div className="bg-white border border-brand-border rounded-2xl p-8">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-12 bg-brand-surface rounded-lg" />)}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-2xl p-16 text-center">
          <ShoppingBag size={48} className="text-brand-muted mx-auto mb-4" />
          <p className="text-brand-muted">No orders found.</p>
        </div>
      ) : (
        <div className="bg-white border border-brand-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border bg-brand-surface">
                {["Order #", "Dealer", "Date", "Items", "Total", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-brand-surface/50">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-brand-navy text-sm">
                      {order.order_number || `#${order.id.slice(0, 8)}`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-brand-navy text-sm">
                      {order.dealer?.company_name || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-brand-muted">{formatDate(order.created_at)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-brand-muted">
                      {Array.isArray(order.items) ? order.items.length : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-brand-navy">
                      {order.total_amount ? formatCurrency(order.total_amount) : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getOrderStatusColor(order.status as OrderStatus)}`}>
                      {getOrderStatusLabel(order.status as OrderStatus)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-brand-orange hover:underline text-sm flex items-center gap-1 justify-end"
                    >
                      Manage <ArrowRight size={12} />
                    </Link>
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
