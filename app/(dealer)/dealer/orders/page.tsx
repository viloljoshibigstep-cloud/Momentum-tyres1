import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getOrdersByDealer } from "@/services/orders";
import { formatCurrency, formatDate, getOrderStatusColor, getOrderStatusLabel } from "@/lib/utils";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Package } from "lucide-react";
import type { OrderStatus } from "@/types";

interface SearchParams {
  status?: string;
}

const statusTabs: { value: string; label: string }[] = [
  { value: "all", label: "All Orders" },
  { value: "submitted", label: "Submitted" },
  { value: "approved", label: "Approved" },
  { value: "dispatched", label: "Dispatched" },
  { value: "backordered", label: "Backordered" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function DealerOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dealer-login");

  const orders = await getOrdersByDealer(user.id, 100);
  const activeStatus = searchParams.status || "all";

  const filteredOrders =
    activeStatus === "all"
      ? orders
      : orders?.filter((o) => o.status === activeStatus) || [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-brand-navy">Order History</h1>
        <p className="text-brand-muted text-sm mt-1">
          Track and manage all your orders.
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {statusTabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/dealer/orders${tab.value !== "all" ? `?status=${tab.value}` : ""}`}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeStatus === tab.value
                ? "bg-brand-orange text-white"
                : "bg-white border border-brand-border text-brand-muted hover:bg-brand-surface"
            }`}
          >
            {tab.label}
            {tab.value !== "all" && orders && (
              <span className="ml-1.5 opacity-70">
                ({orders.filter((o) => o.status === tab.value).length})
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Orders table */}
      {!filteredOrders || filteredOrders.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-2xl p-16 text-center">
          <ShoppingBag size={48} className="text-brand-muted mx-auto mb-4" />
          <h3 className="text-xl font-bold text-brand-navy mb-2">No Orders Found</h3>
          <p className="text-brand-muted mb-6">
            {activeStatus !== "all"
              ? `No ${activeStatus} orders.`
              : "You haven't placed any orders yet."}
          </p>
          <Link href="/dealer/products" className="btn-primary text-sm">
            <Package size={14} />
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-brand-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border bg-brand-surface">
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                  Order
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide hidden sm:table-cell">
                  Date
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide hidden md:table-cell">
                  Total
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                  Status
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-brand-surface/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-brand-navy text-sm">
                      {order.order_number || `#${order.id.slice(0, 8)}`}
                    </p>
                    {order.items && (
                      <p className="text-xs text-brand-muted">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="text-sm text-brand-muted">
                      {formatDate(order.created_at)}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm font-semibold text-brand-navy">
                      {order.total_amount ? formatCurrency(order.total_amount) : "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getOrderStatusColor(order.status as OrderStatus)}`}
                    >
                      {getOrderStatusLabel(order.status as OrderStatus)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/dealer/orders/${order.id}`}
                      className="text-brand-orange hover:underline text-sm flex items-center gap-1 justify-end"
                    >
                      View <ArrowRight size={12} />
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
