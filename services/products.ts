import { createClient } from "@/lib/supabase/server";
import { Product, ProductFilters, ProductWithStock } from "@/types";

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const supabase = createClient();
  let query = supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (filters?.category) {
    query = query.eq("categories.slug", filters.category);
  }
  if (filters?.application) {
    query = query.ilike("application", `%${filters.application}%`);
  }
  if (filters?.size) {
    query = query.ilike("size", `%${filters.size}%`);
  }
  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,size.ilike.%${filters.search}%,pattern.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data || [];
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) return [];
  return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(6);

  if (error) return [];
  return data || [];
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 3): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .neq("id", productId)
    .limit(limit);

  if (error) return [];
  return data || [];
}

export async function searchProducts(query: string): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .or(`name.ilike.%${query}%,size.ilike.%${query}%,pattern.ilike.%${query}%,sku.ilike.%${query}%`)
    .limit(20);

  if (error) return [];
  return data || [];
}

export async function getProductWithStockAndPrice(
  slug: string,
  dealerId: string
): Promise<ProductWithStock | null> {
  const supabase = createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !product) return null;

  const { data: stock } = await supabase
    .from("stock")
    .select("*")
    .eq("product_id", product.id)
    .single();

  const { data: override } = await supabase
    .from("dealer_pricing")
    .select("price")
    .eq("dealer_id", dealerId)
    .eq("product_id", product.id)
    .single();

  let dealer_price = product.base_price || 0;
  if (override) {
    dealer_price = override.price;
  } else {
    const { data: dealer } = await supabase
      .from("dealers")
      .select("tier:dealer_tiers(pricing_multiplier)")
      .eq("id", dealerId)
      .single();
    if (dealer?.tier) {
      const tier = dealer.tier as unknown as { pricing_multiplier: number };
      dealer_price = (product.base_price || 0) * tier.pricing_multiplier;
    }
  }

  return {
    ...product,
    stock: stock || undefined,
    dealer_price: Math.round(dealer_price * 100) / 100,
  };
}

// Admin operations
export async function getAllProductsAdmin(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

export async function createProduct(product: Partial<Product>): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    return null;
  }
  return data;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    return null;
  }
  return data;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: false })
    .eq("id", id);

  return !error;
}
