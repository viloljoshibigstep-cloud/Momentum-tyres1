import { cn, getStockStatusLabel, getStockStatusColor } from "@/lib/utils";
import { StockStatus } from "@/types";
import { CircleDot } from "lucide-react";

interface StockBadgeProps {
  status: StockStatus;
  quantity?: number;
  size?: "sm" | "md";
}

export function StockBadge({ status, quantity, size = "md" }: StockBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold border rounded-full",
        getStockStatusColor(status),
        size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-3 py-1"
      )}
    >
      <CircleDot size={size === "sm" ? 8 : 10} className="flex-shrink-0" />
      {getStockStatusLabel(status)}
      {quantity !== undefined && status !== "backorder" && (
        <span className="opacity-70">({quantity})</span>
      )}
    </span>
  );
}
