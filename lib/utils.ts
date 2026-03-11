import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderStatus, StockStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-NZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat("en-NZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    submitted: "Submitted",
    approved: "Approved",
    backordered: "Backordered",
    dispatched: "Dispatched",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
}

export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    submitted: "bg-blue-100 text-blue-700 border-blue-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    backordered: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dispatched: "bg-purple-100 text-purple-700 border-purple-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}

export function getStockStatusLabel(status: StockStatus): string {
  const labels: Record<StockStatus, string> = {
    in_stock: "In Stock",
    low_stock: "Low Stock",
    backorder: "Backorder Available",
  };
  return labels[status] || status;
}

export function getStockStatusColor(status: StockStatus): string {
  const colors: Record<StockStatus, string> = {
    in_stock: "bg-brand-green-light text-brand-green border-green-200",
    low_stock: "bg-brand-yellow-light text-brand-yellow border-yellow-200",
    backorder: "bg-brand-red-light text-brand-red border-red-200",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}

export function getTierColor(tierName: string): string {
  const lower = tierName.toLowerCase();
  if (lower.includes("gold")) return "bg-yellow-100 text-yellow-700 border-yellow-300";
  if (lower.includes("silver")) return "bg-slate-100 text-slate-600 border-slate-300";
  if (lower.includes("bronze")) return "bg-orange-100 text-orange-700 border-orange-300";
  return "bg-gray-100 text-gray-700";
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getTyreImageUrl(category: string): string {
  const images: Record<string, string> = {
    pcr: "https://images.unsplash.com/photo-1558816280-dee9521ff364?w=600&q=80",
    "suv-4x4": "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=600&q=80",
    "light-truck": "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=600&q=80",
    tbr: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80",
    "off-road": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80",
  };
  return images[category] || images.pcr;
}
