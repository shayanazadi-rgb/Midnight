"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  addToCart as apiAddToCart,
  getCart,
  updateCartItem as apiUpdateCartItem,
  type Cart,
} from "@/lib/api";

const CART_KEY = "midnightshop_cart_id";

type CartContextValue = {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  refresh: () => Promise<void>;
  addItem: (productId: number, variantId: number, quantity?: number) => Promise<void>;
  setQuantity: (productId: number, variantId: number, quantity: number) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem(CART_KEY) || undefined : undefined;
      const next = await getCart(stored);
      setCart(next);
      localStorage.setItem(CART_KEY, next.id);
    } catch {
      // API may be offline during first paint
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (productId: number, variantId: number, quantity = 1) => {
      const stored = localStorage.getItem(CART_KEY) || undefined;
      const next = await apiAddToCart(stored, {
        product_id: productId,
        variant_id: variantId,
        quantity,
      });
      setCart(next);
      localStorage.setItem(CART_KEY, next.id);
    },
    [],
  );

  const setQuantity = useCallback(
    async (productId: number, variantId: number, quantity: number) => {
      const stored = localStorage.getItem(CART_KEY);
      if (!stored) return;
      const next = await apiUpdateCartItem(stored, productId, variantId, quantity);
      setCart(next);
    },
    [],
  );

  const value = useMemo(
    () => ({
      cart,
      loading,
      itemCount: cart?.item_count ?? 0,
      refresh,
      addItem,
      setQuantity,
    }),
    [cart, loading, refresh, addItem, setQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
