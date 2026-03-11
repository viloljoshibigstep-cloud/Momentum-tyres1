import { createClient } from "@/lib/supabase/server";
import { CartItem, Order, OrderStatus } from "@/types";

export async function createOrder(
  dealerId: string,
  items: CartItem[],
  deliveryAddress: string,
  notes: string
): Promise<{ order: Order | null; error: string | null }> {
  const supabase = createClient();

  if (items.length === 0) {
    return { order: null, error: "Cannot submit an empty order" };
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        dealer_id: dealerId,
        status: "submitted",
        total_amount: Math.round(totalAmount * 100) / 100,
        delivery_address: deliveryAddress,
        notes,
      },
    ])
    .select()
    .single();

  if (orderError || !order) {
    console.error("Order creation error:", orderError);
    return { order: null, error: "Failed to create order. Please try again." };
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    // Rollback order
    await supabase.from("orders").delete().eq("id", order.id);
    return { order: null, error: "Failed to save order items. Please try again." };
  }

  return { order, error: null };
}

export async function getOrdersByDealer(dealerId: string, limit?: number): Promise<Order[]> {
  const supabase = createClient();
  let query = supabase
    .from("orders")
    .select("*, items:order_items(*, product:products(id, name, size, image_url))")
    .eq("dealer_id", dealerId)
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) return [];
  return data || [];
}

export async function getOrderById(orderId: string, dealerId?: string): Promise<Order | null> {
  const supabase = createClient();
  let query = supabase
    .from("orders")
    .select(`
      *,
      dealer:dealers(id, company_name, email, phone, address, city, tier:dealer_tiers(tier_name)),
      items:order_items(*, product:products(id, name, size, image_url, sku))
    `)
    .eq("id", orderId);

  if (dealerId) {
    query = query.eq("dealer_id", dealerId);
  }

  const { data, error } = await query.single();
  if (error) return null;
  return data;
}

// Admin operations
export async function getAllOrders(filters?: { status?: string }, limit?: number): Promise<Order[]> {
  const supabase = createClient();
  let query = supabase
    .from("orders")
    .select(`
      *,
      dealer:dealers(id, company_name, email),
      items:order_items(id)
    `)
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) return [];
  return data || [];
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  return !error;
}

export async function addInternalNote(orderId: string, note: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("orders")
    .update({
      internal_notes: note,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  return !error;
}

export async function getDealerOrderStats(dealerId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("orders")
    .select("status, created_at")
    .eq("dealer_id", dealerId);

  const orders = data || [];
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  return {
    total: orders.length,
    submitted: orders.filter((o) => o.status === "submitted").length,
    approved: orders.filter((o) => o.status === "approved").length,
    dispatched: orders.filter((o) => o.status === "dispatched").length,
    this_month: orders.filter((o) => o.created_at >= startOfMonth).length,
  };
}
