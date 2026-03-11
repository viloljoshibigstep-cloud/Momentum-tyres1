import { createClient } from "@/lib/supabase/server";
import { DealerApplication } from "@/types";

export async function getAdminStats() {
  const supabase = createClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [ordersResult, dealersResult, applicationsResult, stockResult, productsResult, revenueResult] = await Promise.all([
    supabase.from("orders").select("status"),
    supabase.from("dealers").select("status"),
    supabase.from("dealer_applications").select("status"),
    supabase.from("stock").select("status").in("status", ["low_stock", "backorder"]),
    supabase.from("products").select("id").eq("is_active", true),
    supabase.from("orders").select("total_amount").in("status", ["approved", "dispatched"]).gte("created_at", startOfMonth),
  ]);

  const orders = ordersResult.data || [];
  const dealers = dealersResult.data || [];
  const applications = applicationsResult.data || [];
  const lowStock = stockResult.data || [];
  const products = productsResult.data || [];
  const revenueOrders = revenueResult.data || [];
  const revenueThisMonth = revenueOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "submitted").length,
    activeDealers: dealers.filter((d) => d.status === "active").length,
    pendingApplications: applications.filter((a) => a.status === "pending").length,
    lowStockAlerts: lowStock.length,
    totalProducts: products.length,
    revenueThisMonth: Math.round(revenueThisMonth * 100) / 100,
  };
}

export async function getDealerApplications(status?: string): Promise<DealerApplication[]> {
  const supabase = createClient();
  let query = supabase
    .from("dealer_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) return [];
  return data || [];
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "pending" | "approved" | "rejected"
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("dealer_applications")
    .update({ status })
    .eq("id", applicationId);

  return !error;
}

export async function getContactSubmissions() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

export async function upsertDealerPriceOverride(
  dealerId: string,
  productId: string,
  price: number
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("dealer_pricing").upsert(
    { dealer_id: dealerId, product_id: productId, price },
    { onConflict: "dealer_id,product_id" }
  );
  return !error;
}

export async function updateTierMultiplier(tierId: string, multiplier: number): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("dealer_tiers")
    .update({ pricing_multiplier: multiplier })
    .eq("id", tierId);
  return !error;
}
