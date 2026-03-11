"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatDate, getTierColor } from "@/lib/utils";
import { Users, Search, CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import type { Dealer, DealerTier, DealerApplication } from "@/types";

type Tab = "dealers" | "applications";

export default function AdminDealersPage() {
  const [dealers, setDealers] = useState<(Dealer & { tier?: DealerTier })[]>([]);
  const [applications, setApplications] = useState<DealerApplication[]>([]);
  const [tiers, setTiers] = useState<DealerTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("dealers");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    const supabase = createClient();
    const [dealerRes, appRes, tierRes] = await Promise.all([
      supabase
        .from("dealers")
        .select("*, tier:dealer_tiers(*)")
        .order("created_at", { ascending: false }),
      supabase
        .from("dealer_applications")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("dealer_tiers").select("*"),
    ]);
    setDealers(dealerRes.data || []);
    setApplications(appRes.data || []);
    setTiers(tierRes.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(dealerId: string, status: string) {
    const supabase = createClient();
    await supabase.from("dealers").update({ status }).eq("id", dealerId);
    setDealers((prev) =>
      prev.map((d) => (d.id === dealerId ? { ...d, status: status as Dealer["status"] } : d))
    );
  }

  async function assignTier(dealerId: string, tierId: string) {
    const supabase = createClient();
    await supabase.from("dealers").update({ tier_id: tierId || null }).eq("id", dealerId);
    const newTier = tiers.find((t) => t.id === tierId);
    setDealers((prev) =>
      prev.map((d) => (d.id === dealerId ? { ...d, tier_id: tierId, tier: newTier } : d))
    );
  }

  async function updateAppStatus(appId: string, status: string) {
    const supabase = createClient();
    await supabase.from("dealer_applications").update({ status }).eq("id", appId);
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId ? { ...a, status: status as DealerApplication["status"] } : a
      )
    );
  }

  const filteredDealers = dealers.filter((d) => {
    const matchSearch =
      !search ||
      d.company_name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingApps = applications.filter((a) => a.status === "pending").length;

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-green-50 text-brand-green border-green-200",
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      suspended: "bg-red-50 text-brand-red border-red-200",
    };
    return map[status] || "bg-brand-surface text-brand-muted border-brand-border";
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-brand-navy">Dealers</h1>
        <p className="text-brand-muted text-sm mt-1">
          Manage dealer accounts and applications.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("dealers")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "dealers"
              ? "bg-brand-navy text-white"
              : "bg-white border border-brand-border text-brand-muted hover:bg-brand-surface"
          }`}
        >
          <Users size={14} className="inline mr-1" />
          Active Dealers ({dealers.length})
        </button>
        <button
          onClick={() => setTab("applications")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "applications"
              ? "bg-brand-navy text-white"
              : "bg-white border border-brand-border text-brand-muted hover:bg-brand-surface"
          }`}
        >
          Applications
          {pendingApps > 0 && (
            <span className="ml-2 bg-brand-orange text-white text-xs rounded-full px-1.5 py-0.5">
              {pendingApps}
            </span>
          )}
        </button>
      </div>

      {tab === "dealers" && (
        <>
          {/* Filters */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company or email..."
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="bg-white border border-brand-border rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-brand-muted">Loading...</div>
            ) : filteredDealers.length === 0 ? (
              <div className="p-12 text-center">
                <Users size={32} className="text-brand-muted mx-auto mb-3" />
                <p className="text-brand-muted">No dealers found.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-surface">
                    {["Company", "Email", "Tier", "Status", "Joined", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {filteredDealers.map((dealer) => (
                    <tr key={dealer.id} className="hover:bg-brand-surface/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-brand-navy text-sm">{dealer.company_name}</p>
                        <p className="text-xs text-brand-muted">{dealer.contact_name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-brand-muted">{dealer.email}</span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={dealer.tier_id || ""}
                          onChange={(e) => assignTier(dealer.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-md border cursor-pointer ${
                            dealer.tier ? getTierColor(dealer.tier.tier_name) : "border-brand-border bg-white text-brand-muted"
                          }`}
                        >
                          <option value="">No Tier</option>
                          {tiers.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.tier_name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${statusBadge(dealer.status)}`}>
                          {dealer.status.charAt(0).toUpperCase() + dealer.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-brand-muted">{formatDate(dealer.created_at)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {dealer.status !== "active" && (
                            <button
                              onClick={() => updateStatus(dealer.id, "active")}
                              className="p-1.5 rounded-md bg-green-50 text-brand-green hover:bg-green-100 transition-colors"
                              title="Activate"
                            >
                              <CheckCircle size={13} />
                            </button>
                          )}
                          {dealer.status !== "suspended" && (
                            <button
                              onClick={() => updateStatus(dealer.id, "suspended")}
                              className="p-1.5 rounded-md bg-red-50 text-brand-red hover:bg-red-100 transition-colors"
                              title="Suspend"
                            >
                              <XCircle size={13} />
                            </button>
                          )}
                          <Link
                            href={`/admin/dealers/${dealer.id}`}
                            className="p-1.5 rounded-md bg-brand-surface text-brand-muted hover:bg-brand-surface-2 transition-colors"
                          >
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {tab === "applications" && (
        <div className="bg-white border border-brand-border rounded-2xl overflow-hidden">
          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <Clock size={32} className="text-brand-muted mx-auto mb-3" />
              <p className="text-brand-muted">No applications received yet.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border bg-brand-surface">
                  {["Company", "Contact", "Business Type", "Volume", "Date", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-brand-surface/50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-brand-navy text-sm">{app.company_name}</p>
                      <p className="text-xs text-brand-muted">{app.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-brand-muted">{app.contact_name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-brand-muted">{app.business_type || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-brand-muted">{app.annual_volume || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-brand-muted">{formatDate(app.created_at)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${statusBadge(app.status)}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {app.status === "pending" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateAppStatus(app.id, "approved")}
                            className="p-1.5 rounded-md bg-green-50 text-brand-green hover:bg-green-100"
                            title="Approve"
                          >
                            <CheckCircle size={13} />
                          </button>
                          <button
                            onClick={() => updateAppStatus(app.id, "rejected")}
                            className="p-1.5 rounded-md bg-red-50 text-brand-red hover:bg-red-100"
                            title="Reject"
                          >
                            <XCircle size={13} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
