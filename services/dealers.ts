import { createClient } from "@/lib/supabase/server";
import { Dealer, DealerProfile, DealerTier } from "@/types";

export async function getDealerProfile(userId: string): Promise<DealerProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("dealers")
    .select("*, tier:dealer_tiers(*)")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return {
    dealer: data,
    tier: data.tier as DealerTier | null,
  };
}

export async function getDealerPriceForProduct(
  dealerId: string,
  productId: string,
  basePrice: number
): Promise<number> {
  const supabase = createClient();

  // Check for specific override first
  const { data: override } = await supabase
    .from("dealer_pricing")
    .select("price")
    .eq("dealer_id", dealerId)
    .eq("product_id", productId)
    .single();

  if (override) return override.price;

  // Fall back to tier pricing
  const { data: dealer } = await supabase
    .from("dealers")
    .select("tier:dealer_tiers(pricing_multiplier)")
    .eq("id", dealerId)
    .single();

  if (dealer?.tier) {
    const tier = dealer.tier as unknown as { pricing_multiplier: number };
    return Math.round(basePrice * tier.pricing_multiplier * 100) / 100;
  }

  return basePrice;
}

export async function getDealerPricesBulk(
  dealerId: string,
  productIds: string[]
): Promise<Record<string, number>> {
  const supabase = createClient();

  const { data: overrides } = await supabase
    .from("dealer_pricing")
    .select("product_id, price")
    .eq("dealer_id", dealerId)
    .in("product_id", productIds);

  const { data: dealer } = await supabase
    .from("dealers")
    .select("tier:dealer_tiers(pricing_multiplier)")
    .eq("id", dealerId)
    .single();

  const multiplier = (dealer?.tier as unknown as { pricing_multiplier: number } | null)?.pricing_multiplier || 1;

  const { data: products } = await supabase
    .from("products")
    .select("id, base_price")
    .in("id", productIds);

  const priceMap: Record<string, number> = {};
  const overrideMap: Record<string, number> = {};
  (overrides || []).forEach((o) => {
    overrideMap[o.product_id] = o.price;
  });

  (products || []).forEach((p) => {
    if (overrideMap[p.id]) {
      priceMap[p.id] = overrideMap[p.id];
    } else {
      priceMap[p.id] = Math.round((p.base_price || 0) * multiplier * 100) / 100;
    }
  });

  return priceMap;
}

// Admin operations
export async function getAllDealers(): Promise<Dealer[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("dealers")
    .select("*, tier:dealer_tiers(*)")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

export async function updateDealerStatus(
  dealerId: string,
  status: "pending" | "active" | "suspended"
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("dealers")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", dealerId);

  return !error;
}

export async function assignDealerTier(
  dealerId: string,
  tierId: string
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("dealers")
    .update({ tier_id: tierId, updated_at: new Date().toISOString() })
    .eq("id", dealerId);

  return !error;
}

export async function getDealerTiers(): Promise<DealerTier[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("dealer_tiers")
    .select("*")
    .order("pricing_multiplier", { ascending: true });

  if (error) return [];
  return data || [];
}

export async function updateDealerProfile(
  dealerId: string,
  updates: Partial<Dealer>
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("dealers")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", dealerId);

  return !error;
}
