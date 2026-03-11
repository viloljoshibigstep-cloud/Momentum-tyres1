import Link from "next/link";
import { getAdminStats } from "@/services/admin";
import { getAllOrders } from "@/services/orders";
import { getDealerApplications } from "@/services/admin";
import { getLowStockAlerts } from "@/services/stock";
import { formatCurrency, formatDate, getOrderStatusColor, getOrderStatusLabel } from "@/lib/utils";
import { Users, Package, ShoppingBag, AlertTriangle, FileText, TrendingUp, ArrowRight } from "lucide-react";
import type { OrderStatus } from "@/types";

export default async function AdminDashboardPage() {
  const [stats, recentOrders, applications, lowStockItems] = await Promise.all([
    getAdminStats(),
    getAllOrders({ status: "all" }, 5),
    getDealerApplications("pending"),
    getLowStockAlerts(),
  ]);

  const statCards = [
    {
      icon: ShoppingBag,
      label: "Total Orders",
      value: stats.totalOrders,
      sub: `${stats.pendingOrders} pending`,
      color: "bg-blue-50 text-blue-600",
      href: "/admin/orders",
    },
    {
      icon: Users,
      label: "Active Dealers",
      value: stats.activeDealers,
      sub: `${stats.pendingApplications} applications`,
      color: "bg-green-50 text-green-600",
      href: "/admin/dealers",
    },
    {
      icon: Package,
      label: "Products",
      value: stats.totalProducts,
      sub: "In catalogue",
      color: "bg-purple-50 text-purple-600",
      href: "/admin/products",
    },
    {
      icon: TrendingUp,
      label: "Revenue This Month",
      value: formatCurrency(stats.revenueThisMonth),
      sub: "Submitted orders",
      color: "bg-orange-50 text-orange-600",
      href: "/admin/orders",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-brand-navy">Admin Dashboard</h1>
        <p className="text-brand-muted text-sm mt-1">Overview of your platform.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white border border-brand-border rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon size={18} />
            </div>
            <div className="text-2xl font-black text-brand-navy">{s.value}</div>
            <div className="text-xs text-brand-muted mt-0.5">{s.label}</div>
            <div className="text-xs text-brand-orange font-semibold mt-1">{s.sub}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
            <h2 className="font-black text-brand-navy text-sm">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-brand-orange hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-center py-8 text-brand-muted text-sm">No orders yet.</p>
          ) : (
            <table className="w-full">
              <tbody className="divide-y divide-brand-border">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-surface/50">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-brand-navy text-sm">{order.order_number}</p>
                      <p className="text-xs text-brand-muted">{order.dealer?.company_name}</p>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <span className="text-xs text-brand-muted">{formatDate(order.created_at)}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getOrderStatusColor(order.status as OrderStatus)}`}>
                        {getOrderStatusLabel(order.status as OrderStatus)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-sm font-semibold text-brand-navy">
                        {order.total_amount ? formatCurrency(order.total_amount) : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right col */}
        <div className="space-y-4">
          {/* Pending applications */}
          <div className="bg-white border border-brand-border rounded-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <h2 className="font-black text-brand-navy text-sm">Pending Applications</h2>
              <Link href="/admin/dealers?tab=pending" className="text-xs text-brand-orange hover:underline">
                View all
              </Link>
            </div>
            {applications.length === 0 ? (
              <p className="text-center py-6 text-brand-muted text-xs">No pending applications.</p>
            ) : (
              <div className="divide-y divide-brand-border">
                {applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="px-5 py-3">
                    <p className="font-semibold text-brand-navy text-sm">{app.company_name}</p>
                    <p className="text-xs text-brand-muted">{app.email}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low stock alerts */}
          {lowStockItems.length > 0 && (
            <div className="bg-white border border-brand-border rounded-2xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-yellow-500" />
                  <h2 className="font-black text-brand-navy text-sm">Low Stock Alerts</h2>
                </div>
                <Link href="/admin/stock" className="text-xs text-brand-orange hover:underline">
                  Manage
                </Link>
              </div>
              <div className="divide-y divide-brand-border">
                {lowStockItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-brand-navy line-clamp-1">
                        {(item as { product?: { name?: string } }).product?.name || "Product"}
                      </p>
                      <p className="text-xs text-brand-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      item.status === "backorder" ? "bg-red-50 text-brand-red" : "bg-yellow-50 text-yellow-700"
                    }`}>
                      {item.status === "backorder" ? "Backorder" : "Low"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="bg-white border border-brand-border rounded-2xl p-4">
            <h3 className="font-black text-brand-navy text-sm mb-3">Quick Actions</h3>
            <div className="space-y-1">
              {[
                { href: "/admin/products", label: "Add New Product", icon: Package },
                { href: "/admin/dealers", label: "Manage Dealers", icon: Users },
                { href: "/admin/orders", label: "View All Orders", icon: ShoppingBag },
                { href: "/admin/pricing", label: "Pricing Settings", icon: TrendingUp },
                { href: "/admin/stock", label: "Update Stock", icon: FileText },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-muted hover:bg-brand-surface hover:text-brand-navy transition-colors"
                >
                  <link.icon size={14} />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
