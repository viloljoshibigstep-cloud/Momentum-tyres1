import { createClient } from "@/lib/supabase/server";
import { Stock, StockStatus } from "@/types";

export async function getStockForProduct(productId: string): Promise<Stock | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stock")
    .select("*")
    .eq("product_id", productId)
    .single();

  if (error) return null;
  return data;
}

export async function getStockBulk(productIds: string[]): Promise<Record<string, Stock>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stock")
    .select("*")
    .in("product_id", productIds);

  if (error) return {};

  const stockMap: Record<string, Stock> = {};
  (data || []).forEach((s) => {
    stockMap[s.product_id] = s;
  });
  return stockMap;
}

export async function getAllStock(): Promise<(Stock & { product?: { name: string; sku: string | null; size: string } })[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stock")
    .select("*, product:products(id, name, sku, size)")
    .order("updated_at", { ascending: false });

  if (error) return [];
  return data || [];
}

export async function updateStock(
  productId: string,
  quantity: number
): Promise<boolean> {
  const supabase = createClient();
  const status: StockStatus =
    quantity === 0 ? "backorder" : quantity < 10 ? "low_stock" : "in_stock";

  const { error } = await supabase
    .from("stock")
    .update({
      quantity,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("product_id", productId);

  return !error;
}

export async function upsertStock(
  productId: string,
  quantity: number
): Promise<boolean> {
  const supabase = createClient();
  const status: StockStatus =
    quantity === 0 ? "backorder" : quantity < 10 ? "low_stock" : "in_stock";

  const { error } = await supabase.from("stock").upsert(
    {
      product_id: productId,
      quantity,
      status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "product_id" }
  );

  return !error;
}

export async function getLowStockAlerts(): Promise<Stock[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stock")
    .select("*, product:products(name, sku, size)")
    .in("status", ["low_stock", "backorder"])
    .order("quantity", { ascending: true });

  if (error) return [];
  return data || [];
}
