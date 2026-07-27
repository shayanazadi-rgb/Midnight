export type Category = {
  id: number;
  slug: string;
  name: string;
  name_fa: string;
  description: string;
  image: string;
  sort_order: number;
  product_count: number;
};

export type ProductVariant = {
  id: number;
  size: string;
  color: string;
  color_hex: string;
  stock: number;
  sku: string;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  name_fa: string;
  description?: string;
  description_fa?: string;
  price: number;
  compare_at_price: number | null;
  category_slug: string;
  category_name_fa: string;
  images: string[];
  tags: string[];
  featured: boolean;
  in_stock: boolean;
  discount_percent: number | null;
  variants?: ProductVariant[];
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type CartItem = {
  id: number;
  product_id: number;
  variant_id: number;
  product_slug: string;
  quantity: number;
  unit_price: number;
  product_name: string;
  product_name_fa: string;
  size: string;
  color: string;
  image: string;
  line_total: number;
};

export type Cart = {
  id: string;
  items: CartItem[];
  subtotal: number;
  item_count: number;
  updated_at: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000/api/v1";

export function getApiBase() {
  return API_BASE;
}

async function parseApiError(res: Response): Promise<string> {
  const text = await res.text();
  if (!text) return `API error ${res.status}`;
  try {
    const data = JSON.parse(text) as Record<string, unknown>;
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) {
      return String(data.non_field_errors[0]);
    }
    const firstKey = Object.keys(data)[0];
    if (firstKey) {
      const value = data[firstKey];
      if (Array.isArray(value) && value[0]) return String(value[0]);
      if (typeof value === "string") return value;
    }
  } catch {
    // plain text
  }
  return text;
}

async function apiFetch<T>(
  path: string,
  init?: RequestInit & { cartId?: string; token?: string | null },
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (init?.cartId) {
    headers.set("X-Cart-Id", init.cartId);
  }
  if (init?.token) {
    headers.set("Authorization", `Token ${init.token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    next: init?.cache === "no-store" ? undefined : { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories/");
}

export async function getProducts(params?: {
  category?: string;
  featured?: boolean;
  search?: string;
  tag?: string;
  sort?: "newest" | "bestsellers" | "discount";
  discounted?: boolean;
  limit?: number;
  offset?: number;
}): Promise<Paginated<Product>> {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.featured != null) qs.set("featured", String(params.featured));
  if (params?.search) qs.set("search", params.search);
  if (params?.tag) qs.set("tag", params.tag);
  if (params?.sort) qs.set("sort", params.sort);
  if (params?.discounted) qs.set("discounted", "1");
  if (params?.limit != null) qs.set("limit", String(params.limit));
  if (params?.offset != null) qs.set("offset", String(params.offset));
  const query = qs.toString();
  return apiFetch<Paginated<Product>>(`/products/${query ? `?${query}` : ""}`);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/products/featured/");
}

export async function getProduct(slug: string): Promise<Product> {
  return apiFetch<Product>(`/products/${slug}/`, { cache: "no-store" });
}

export async function getCart(cartId?: string): Promise<Cart> {
  return apiFetch<Cart>("/cart/", {
    cache: "no-store",
    cartId,
  });
}

export async function addToCart(
  cartId: string | undefined,
  payload: { product_id: number; variant_id: number; quantity: number },
): Promise<Cart> {
  return apiFetch<Cart>("/cart/items/", {
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store",
    cartId,
  });
}

export async function updateCartItem(
  cartId: string,
  productId: number,
  variantId: number,
  quantity: number,
): Promise<Cart> {
  return apiFetch<Cart>(`/cart/items/${productId}/${variantId}/`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
    cache: "no-store",
    cartId,
  });
}

export type CheckoutPayload = {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  postal_code?: string;
};

export type Order = {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  postal_code: string;
  status: string;
  items: {
    id: number;
    product_name: string;
    product_name_fa: string;
    size: string;
    color: string;
    unit_price: number;
    quantity: number;
    image: string;
    line_total: number;
  }[];
  total: number;
  item_count: number;
  created_at: string;
};

export async function checkout(
  cartId: string,
  payload: CheckoutPayload,
  token?: string | null,
): Promise<Order> {
  return apiFetch<Order>("/checkout/", {
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store",
    cartId,
    token,
  });
}

export async function getOrder(orderId: number): Promise<Order> {
  return apiFetch<Order>(`/orders/${orderId}/`, { cache: "no-store" });
}

export async function getMyOrders(token: string): Promise<Order[]> {
  return apiFetch<Order[]>("/orders/mine/", {
    cache: "no-store",
    token,
  });
}

export type CustomerProfile = {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  postal_code: string;
};

export type AuthResponse = {
  token: string;
  phone: string;
  profile?: CustomerProfile;
};

export type LoginPayload = {
  phone: string;
  password: string;
};

export type RegisterPayload = {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  postal_code?: string;
  password: string;
};

export async function loginCustomer(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login/", {
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

export async function registerCustomer(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

export async function logoutCustomer(token: string): Promise<void> {
  await apiFetch("/auth/logout/", {
    method: "POST",
    cache: "no-store",
    token,
  });
}

export async function fetchMe(
  token: string,
): Promise<{ phone: string; profile: CustomerProfile }> {
  return apiFetch<{ phone: string; profile: CustomerProfile }>("/auth/me/", {
    cache: "no-store",
    token,
  });
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
}
