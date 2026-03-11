"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { Loader2, CheckCircle, AlertCircle, Plus, Trash2 } from "lucide-react";
import type { DealerTier, Dealer, Product } from "@/types";

export default function AdminPricingPage() {
  const [tiers, setTiers] = useState<DealerTier[]>([]);
  const [dealers, setDealers] = useState<Pick<Dealer, 'id' | 'company_name' | 'tier_id'>[]>([]);
  const [products, setProducts] = useState<Pick<Product, 'id' | 'name' | 'size' | 'base_price'>[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Record<string, { type: string; text: string }>>({});

  // Override form state
  const [selectedDealer, setSelectedDealer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [overridePrice, setOverridePrice] = useState("");
  const [overrides, setOverrides] = useState<Array<{
    id: string;
    dealer_id: string;
    product_id: string;
    price: number;
    dealer?: { company_name?: string };
    product?: { name?: string; size?: string };
  }>>([]);

  const load = useCallback(async () => {
    const supabase = createClient();
    const [tierRes, dealerRes, productRes, overrideRes] = await Promise.all([
      supabase.from("dealer_tiers").select("*").order("pricing_multiplier"),
      supabase.from("dealers").select("id, company_name, tier_id").eq("status", "active").order("company_name"),
      supabase.from("products").select("id, name, size, base_price").eq("is_active", true).order("name").limit(100),
      supabase
        .from("dealer_pricing")
        .select("*, dealer:dealers(company_name), product:products(name, size)")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    setTiers(tierRes.data || []);
    setDealers(dealerRes.data || []);
    setProducts(productRes.data || []);
    setOverrides(overrideRes.data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function saveTier(tier: DealerTier, newMultiplier: string) {
    setSaving(tier.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("dealer_tiers")
      .update({ pricing_multiplier: parseFloat(newMultiplier) })
      .eq("id", tier.id);
    setMsgs((prev) => ({
      ...prev,
      [tier.id]: error
        ? { type: "error", text: "Save failed." }
        : { type: "success", text: "Saved!" },
    }));
    setSaving(null);
    if (!error) {
      setTiers((prev) =>
        prev.map((t) =>
          t.id === tier.id ? { ...t, pricing_multiplier: parseFloat(newMultiplier) } : t
        )
      );
    }
  }

  async function addOverride() {
    if (!selectedDealer || !selectedProduct || !overridePrice) return;
    const supabase = createClient();
    const { error } = await supabase.from("dealer_pricing").upsert({
      dealer_id: selectedDealer,
      product_id: selectedProduct,
      price: parseFloat(overridePrice),
    });
    if (!error) {
      setSelectedDealer("");
      setSelectedProduct("");
      setOverridePrice("");
      load();
    }
  }

  async function deleteOverride(id: string) {
    const supabase = createClient();
    await supabase.from("dealer_pricing").delete().eq("id", id);
    setOverrides((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-brand-navy">Pricing Management</h1>
        <p className="text-brand-muted text-sm mt-1">
          Manage dealer tier multipliers and per-dealer price overrides.
        </p>
      </div>

      {/* Tier pricing */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 mb-6">
        <h2 className="font-black text-brand-navy mb-1">Dealer Tier Multipliers</h2>
        <p className="text-brand-muted text-xs mb-5">
          Final price = base_price × multiplier. Lower = cheaper for dealer.
        </p>

        <div className="space-y-4">
          {tiers.map((tier) => {
            const msg = msgs[tier.id];
            return (
              <div key={tier.id} className="flex items-center gap-4 p-4 border border-brand-border rounded-xl">
                <div className="flex-1">
                  <p className="font-black text-brand-navy">{tier.tier_name}</p>
                  {tier.description && (
                    <p className="text-xs text-brand-muted">{tier.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-brand-muted">×</label>
                  <input
                    key={tier.id}
                    defaultValue={tier.pricing_multiplier.toString()}
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="2"
                    className="w-24 px-3 py-2 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange text-center"
                    onBlur={(e) => {
                      if (parseFloat(e.target.value) !== tier.pricing_multiplier) {
                        saveTier(tier, e.target.value);
                      }
                    }}
                  />
                </div>

                <div className="flex items-center gap-2 min-w-[100px]">
                  {saving === tier.id && (
                    <Loader2 size={14} className="animate-spin text-brand-muted" />
                  )}
                  {msg && (
                    <div className={`flex items-center gap-1 text-xs font-semibold ${msg.type === "success" ? "text-brand-green" : "text-brand-red"}`}>
                      {msg.type === "success" ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      {msg.text}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price overrides */}
      <div className="bg-white border border-brand-border rounded-2xl p-6">
        <h2 className="font-black text-brand-navy mb-1">Per-Dealer Price Overrides</h2>
        <p className="text-brand-muted text-xs mb-5">
          Set a specific price for a product for a particular dealer (overrides tier pricing).
        </p>

        {/* Add override */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-brand-surface rounded-xl mb-6">
          <select
            value={selectedDealer}
            onChange={(e) => setSelectedDealer(e.target.value)}
            className="px-3 py-2 text-sm border border-brand-border rounded-lg focus:outline-none bg-white"
          >
            <option value="">Select Dealer</option>
            {dealers.map((d) => (
              <option key={d.id} value={d.id}>{d.company_name}</option>
            ))}
          </select>

          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="px-3 py-2 text-sm border border-brand-border rounded-lg focus:outline-none bg-white"
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.size}) — {p.base_price ? formatCurrency(p.base_price) : "—"}
              </option>
            ))}
          </select>

          <input
            value={overridePrice}
            onChange={(e) => setOverridePrice(e.target.value)}
            type="number"
            step="0.01"
            min="0"
            placeholder="Price (NZD)"
            className="px-3 py-2 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />

          <button
            onClick={addOverride}
            disabled={!selectedDealer || !selectedProduct || !overridePrice}
            className="btn-primary text-sm justify-center disabled:opacity-50"
          >
            <Plus size={14} />
            Add Override
          </button>
        </div>

        {/* Overrides list */}
        {overrides.length === 0 ? (
          <p className="text-center py-6 text-brand-muted text-sm">No price overrides set.</p>
        ) : (
          <div className="space-y-2">
            {overrides.map((o) => (
              <div key={o.id} className="flex items-center gap-4 p-3 border border-brand-border rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-brand-navy text-sm">
                    {o.dealer?.company_name || "—"}{" "}
                    <span className="text-brand-muted font-normal">→</span>{" "}
                    {o.product?.name}
                  </p>
                  <p className="text-xs text-brand-muted font-mono">{o.product?.size}</p>
                </div>
                <span className="font-black text-brand-orange">{formatCurrency(o.price)}</span>
                <button
                  onClick={() => deleteOverride(o.id)}
                  className="p-1.5 text-brand-muted hover:text-brand-red transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
