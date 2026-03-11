import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatCurrency, formatDate, getOrderStatusColor, getOrderStatusLabel, getTierColor } from "@/lib/utils";
import type { OrderStatus } from "@/types";

export default async function AdminDealerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const [dealerRes, ordersRes, pricingRes, tiersRes] = await Promise.all([
    supabase
      .from("dealers")
      .select("*, tier:dealer_tiers(*)")
      .eq("id", params.id)
      .single(),
    supabase
      .from("orders")
      .select("*, items:order_items(count)")
      .eq("dealer_id", params.id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("dealer_pricing")
      .select("*, product:products(name, size)")
      .eq("dealer_id", params.id)
      .limit(20),
    supabase.from("dealer_tiers").select("*"),
  ]);

  const dealer = dealerRes.data;
  if (!dealer) notFound();

  const orders = ordersRes.data || [];
  const pricing = pricingRes.data || [];
  const tiers = tiersRes.data || [];

  const totalRevenue = orders
    .filter((o) => ["approved", "dispatched"].includes(o.status))
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/dealers" className="text-brand-muted hover:text-brand-navy">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-brand-navy">{dealer.company_name}</h1>
          <p className="text-brand-muted text-sm">{dealer.email}</p>
        </div>
        {dealer.tier && (
          <span className={`ml-auto text-sm font-bold px-3 py-1.5 rounded-full border ${getTierColor(dealer.tier.tier_name)}`}>
            {dealer.tier.tier_name}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile */}
        <div className="space-y-4">
          <div className="bg-white border border-brand-border rounded-2xl p-5">
            <h2 className="font-black text-brand-navy text-sm uppercase tracking-wide mb-4">
              Account Details
            </h2>
            <dl className="space-y-3 text-sm">
              {[
                ["Contact", dealer.contact_name || "—"],
                ["Phone", dealer.phone || "—"],
                ["Address", dealer.address || "—"],
                ["NZBN / ABN", dealer.abn || "—"],
                ["Status", dealer.status],
                ["Member Since", formatDate(dealer.created_at)],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-semibold text-brand-muted uppercase tracking-wide">{k}</dt>
                  <dd className="text-brand-navy font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-5">
            <h2 className="font-black text-brand-navy text-sm uppercase tracking-wide mb-4">
              Tier Assignment
            </h2>
            <div className="space-y-2">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    dealer.tier_id === tier.id ? "border-brand-orange bg-orange-50" : "border-brand-border"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-brand-navy text-sm">{tier.tier_name}</p>
                    <p className="text-xs text-brand-muted">×{tier.pricing_multiplier} of base</p>
                  </div>
                  {dealer.tier_id === tier.id && (
                    <span className="text-xs font-semibold text-brand-orange">Active</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-5">
            <h2 className="font-black text-brand-navy text-sm uppercase tracking-wide mb-3">
              Revenue Summary
            </h2>
            <p className="text-2xl font-black text-brand-navy">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-brand-muted mt-1">Approved + dispatched orders</p>
            <p className="text-sm text-brand-muted mt-2">{orders.length} total orders</p>
          </div>
        </div>

        {/* Orders + Pricing */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-brand-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-border">
              <h2 className="font-black text-brand-navy text-sm uppercase tracking-wide">
                Recent Orders
              </h2>
            </div>
            {orders.length === 0 ? (
              <p className="text-center py-6 text-brand-muted text-sm">No orders yet.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-surface">
                    {["Order", "Date", "Total", "Status"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-brand-surface/50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${order.id}`} className="font-semibold text-brand-orange hover:underline text-sm">
                          {order.order_number || `#${order.id.slice(0, 8)}`}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-brand-muted">{formatDate(order.created_at)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold">{order.total_amount ? formatCurrency(order.total_amount) : "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getOrderStatusColor(order.status as OrderStatus)}`}>
                          {getOrderStatusLabel(order.status as OrderStatus)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Custom pricing */}
          {pricing.length > 0 && (
            <div className="bg-white border border-brand-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-border">
                <h2 className="font-black text-brand-navy text-sm uppercase tracking-wide">
                  Custom Price Overrides
                </h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-surface">
                    {["Product", "Size", "Custom Price"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {pricing.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-brand-navy text-sm">
                          {(p as { product?: { name?: string } }).product?.name || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-brand-muted">
                          {(p as { product?: { size?: string } }).product?.size || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-brand-orange">
                          {formatCurrency(p.price)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
