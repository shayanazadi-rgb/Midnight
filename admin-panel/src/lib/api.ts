const TOKEN_KEY = "midnight_panel_token";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000/api/v1/panel";

export const MEDIA_ORIGIN =
  process.env.NEXT_PUBLIC_MEDIA_ORIGIN?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

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

export type Variant = {
  id?: number;
  size: string;
  color: string;
  color_hex: string;
  stock: number;
  sku?: string;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  name_fa: string;
  description: string;
  description_fa: string;
  price: number;
  compare_at_price: number | null;
  discount_percent?: number;
  category: number;
  category_name_fa: string;
  images: string[];
  tags: string;
  featured: boolean;
  is_active: boolean;
  variants: Variant[];
};

export type Sale = {
  id: number;
  first_name?: string;
  last_name?: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  postal_code?: string;
  status: string;
  note: string;
  total: number;
  item_count: number;
  created_at: string;
  items: {
    id: number;
    product_name_fa: string;
    size: string;
    color: string;
    unit_price: number;
    quantity: number;
    line_total: number;
  }[];
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

async function panelFetch<T>(
  path: string,
  init?: RequestInit & { auth?: boolean },
): Promise<T> {
  const headers = new Headers(init?.headers);
  const auth = init?.auth !== false;
  if (auth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Token ${token}`);
  }
  if (init?.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    let detail = `Error ${res.status}`;
    try {
      const data = await res.json();
      detail = data.detail || JSON.stringify(data);
    } catch {
      detail = await res.text();
    }
    throw new Error(detail);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function login(username: string, password: string) {
  return panelFetch<{ token: string; username: string }>("/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    auth: false,
  });
}

export async function logout() {
  try {
    await panelFetch("/logout/", { method: "POST" });
  } finally {
    clearToken();
  }
}

export async function getCategories() {
  return panelFetch<Category[]>("/categories/");
}

export async function createCategory(payload: Partial<Category>) {
  return panelFetch<Category>("/categories/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(id: number) {
  return panelFetch<void>(`/categories/${id}/`, { method: "DELETE" });
}

export async function getProducts(params?: { category?: string; search?: string }) {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.search) qs.set("search", params.search);
  qs.set("limit", "100");
  const q = qs.toString();
  const data = await panelFetch<Paginated<Product> | Product[]>(
    `/products/${q ? `?${q}` : ""}`,
  );
  return Array.isArray(data) ? data : data.results;
}

export async function getProduct(id: number) {
  return panelFetch<Product>(`/products/${id}/`);
}

export async function createProduct(payload: Record<string, unknown>) {
  return panelFetch<Product>("/products/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(id: number, payload: Record<string, unknown>) {
  return panelFetch<Product>(`/products/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id: number) {
  return panelFetch<void>(`/products/${id}/`, { method: "DELETE" });
}

export async function uploadImage(file: File, folder = "products") {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  return panelFetch<{ url: string; path: string }>("/upload/", {
    method: "POST",
    body: form,
  });
}

export async function getSales() {
  const data = await panelFetch<Paginated<Sale> | Sale[]>("/sales/?limit=100");
  return Array.isArray(data) ? data : data.results;
}

export async function getSalesSummary() {
  return panelFetch<{
    orders_count: number;
    units_sold: number;
    revenue: number;
  }>("/sales/summary/");
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
}
