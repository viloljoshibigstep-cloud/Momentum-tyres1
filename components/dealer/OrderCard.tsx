import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Order } from "@/types";
import { formatCurrency, formatDateShort, getOrderStatusLabel, getOrderStatusColor, cn } from "@/lib/utils";

interface OrderCardProps {
  order: Order;
  href: string;
}

export function OrderCard({ order, href }: OrderCardProps) {
  const itemCount = order.items?.length || 0;

  return (
    <Link
      href={href}
      className="flex items-center justify-between bg-white border border-brand-border rounded-xl p-4 hover:shadow-md hover:border-brand-orange/30 transition-all group"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex-shrink-0 w-10 h-10 bg-brand-surface rounded-lg flex items-center justify-center">
          <span className="text-xs font-bold text-brand-navy">#</span>
        </div>
        <div className="min-w-0">
          <p className="font-bold text-brand-navy text-sm">{order.order_number}</p>
          <p className="text-xs text-brand-muted">
            {formatDateShort(order.created_at)} · {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <span
          className={cn(
            "text-xs font-semibold px-3 py-1 rounded-full border",
            getOrderStatusColor(order.status)
          )}
        >
          {getOrderStatusLabel(order.status)}
        </span>
        {order.total_amount !== null && (
          <span className="font-bold text-brand-navy text-sm hidden md:block">
            {formatCurrency(order.total_amount)}
          </span>
        )}
        <ChevronRight
          size={16}
          className="text-brand-muted group-hover:text-brand-orange transition-colors"
        />
      </div>
    </Link>
  );
}
