// ─── Database Entity Types ─────────────────────────────────────────────────

export interface DealerTier {
  id: string;
  tier_name: string;
  pricing_multiplier: number;
  description: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  product_count?: number;
}

export interface ProductSpecifications {
  load_index?: string;
  speed_rating?: string;
  tread_depth_mm?: string;
  ply_rating?: string;
  construction?: string;
  tread_pattern?: string;
  sidewall?: string;
  overall_diameter_mm?: string;
  section_width_mm?: string;
  rim_width_range?: string;
  max_load_kg?: string;
  max_pressure_kpa?: string;
  eu_label_fuel?: string;
  eu_label_wet?: string;
  noise_db?: string;
  noise_class?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  size: string;
  width: string | null;
  aspect_ratio: string | null;
  rim_diameter: string | null;
  pattern: string | null;
  application: string | null;
  description: string | null;
  features: string[] | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  datasheet_url: string | null;
  specifications: ProductSpecifications | null;
  category_id: string | null;
  base_price: number | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
}

export interface Stock {
  id: string;
  product_id: string;
  quantity: number;
  status: StockStatus;
  updated_at: string;
}

export type StockStatus = "in_stock" | "low_stock" | "backorder";

export interface Dealer {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postcode: string | null;
  abn: string | null;
  tier_id: string | null;
  status: DealerStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  tier?: DealerTier;
}

export type DealerStatus = "pending" | "active" | "suspended";

export interface DealerPricing {
  id: string;
  dealer_id: string;
  product_id: string;
  price: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  dealer_id: string;
  status: OrderStatus;
  total_amount: number | null;
  delivery_address: string | null;
  notes: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  dealer?: Dealer;
  items?: OrderItem[];
}

export type OrderStatus =
  | "submitted"
  | "approved"
  | "backordered"
  | "dispatched"
  | "cancelled";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  // Joined
  product?: Product;
}

export interface DealerApplication {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  abn: string | null;
  business_type: string | null;
  annual_volume: string | null;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  category: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string | null;
  discount_percent: number | null;
  image_url: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

// ─── Client-Side Types ─────────────────────────────────────────────────────

export interface CartItem {
  product_id: string;
  product: Product;
  quantity: number;
  unit_price: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number, price: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export interface DealerProfile {
  dealer: Dealer;
  tier: DealerTier | null;
}

export interface ProductWithStock extends Product {
  stock?: Stock;
  dealer_price?: number;
}

// ─── Filter Types ─────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: string;
  application?: string;
  size?: string;
  search?: string;
}

export interface OrderFilters {
  status?: OrderStatus | "all";
  dealer_id?: string;
}

// ─── Form Types ───────────────────────────────────────────────────────────

export interface DealerApplicationForm {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  abn: string;
  business_type: string;
  annual_volume: string;
  message: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface OrderSubmitForm {
  delivery_address: string;
  notes: string;
}
