import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getDealerOrderStats, getOrdersByDealer } from "@/services/orders";
import { formatCurrency, formatDate, getOrderStatusColor, getOrderStatusLabel, getTierColor } from "@/lib/utils";
import { ShoppingBag, Package, Clock, TrendingUp, ArrowRight, Megaphone } from "lucide-react";

export default async function DealerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dealer-login");

  const { data: dealer } = await supabase
    .from("dealers")
    .select("*, tier:dealer_tiers(*)")
    .eq("id", user.id)
    .single();
  if (!dealer) redirect("/dealer-login?error=not_authorized");

  const [stats, recentOrdersResult, promotionsResult] = await Promise.all([
    getDealerOrderStats(user.id),
    getOrdersByDealer(user.id, 5),
    supabase
      .from("promotions")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(2),
  ]);

  const recentOrders = recentOrdersResult || [];
  const promotions = promotionsResult.data || [];

  const statCards = [
    {
      icon: ShoppingBag,
      label: "Total Orders",
      value: stats.total,
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Clock,
      label: "Pending / Submitted",
      value: stats.submitted,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      icon: Package,
      label: "Dispatched",
      value: stats.dispatched,
      color: "bg-green-50 text-green-600",
    },
    {
      icon: TrendingUp,
      label: "This Month",
      value: stats.this_month,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-brand-navy">
              Welcome back, {dealer.company_name}
            </h1>
            <p className="text-brand-muted text-sm mt-1">
              Here&apos;s what&apos;s happening with your account.
            </p>
          </div>
          {dealer.tier && (
            <span
              className={`text-sm font-bold px-4 py-1.5 rounded-full border ${getTierColor(dealer.tier.tier_name)}`}
            >
              {dealer.tier.tier_name} Dealer
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white border border-brand-border rounded-xl p-5">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon size={18} />
            </div>
            <div className="text-2xl font-black text-brand-navy">{s.value}</div>
            <div className="text-xs text-brand-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-brand-navy">Recent Orders</h2>
            <Link
              href="/dealer/orders"
              className="text-sm text-brand-orange hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag size={32} className="text-brand-muted mx-auto mb-2" />
              <p className="text-brand-muted text-sm">No orders yet</p>
              <Link href="/dealer/products" className="btn-primary text-sm mt-4 inline-flex">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/dealer/orders/${order.id}`}
                  className="flex items-center justify-between p-3 bg-brand-surface rounded-xl hover:bg-brand-surface-2 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-brand-navy text-sm">{order.order_number}</p>
                    <p className="text-xs text-brand-muted">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {order.total_amount && (
                      <span className="text-sm font-semibold text-brand-navy">
                        {formatCurrency(order.total_amount)}
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-md ${getOrderStatusColor(order.status)}`}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="bg-white border border-brand-border rounded-2xl p-5">
            <h3 className="font-black text-brand-navy text-sm mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/dealer/products"
                className="w-full flex items-center gap-3 p-3 bg-brand-orange text-white rounded-xl font-semibold text-sm hover:bg-brand-orange-dark transition-colors"
              >
                <Package size={16} />
                Browse Products
              </Link>
              <Link
                href="/dealer/orders"
                className="w-full flex items-center gap-3 p-3 bg-brand-surface rounded-xl text-brand-navy font-semibold text-sm hover:bg-brand-surface-2 transition-colors"
              >
                <ShoppingBag size={16} />
                Order History
              </Link>
              <Link
                href="/dealer/account"
                className="w-full flex items-center gap-3 p-3 bg-brand-surface rounded-xl text-brand-navy font-semibold text-sm hover:bg-brand-surface-2 transition-colors"
              >
                <TrendingUp size={16} />
                My Account
              </Link>
            </div>
          </div>

          {/* Promotions */}
          {promotions.length > 0 && (
            <div className="bg-brand-navy rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Megaphone size={14} className="text-brand-orange" />
                <h3 className="font-black text-sm">Active Promotions</h3>
              </div>
              <div className="space-y-3">
                {promotions.map((promo) => (
                  <div key={promo.id} className="bg-white/10 rounded-lg p-3">
                    <p className="font-semibold text-sm">{promo.title}</p>
                    {promo.discount_percent && (
                      <p className="text-brand-orange font-black text-lg">
                        {promo.discount_percent}% OFF
                      </p>
                    )}
                    {promo.description && (
                      <p className="text-slate-300 text-xs mt-1">{promo.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
