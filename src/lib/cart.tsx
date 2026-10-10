"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Currency } from "./products";

export type ProductMode = "permanente" | "fisico";

export interface CartItem {
  productId: string;
  productName: string;
  slug: string;
  price: number;
  currency: Currency;
  mode: ProductMode;
  image: string;
  category: string;
  notes: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, mode: ProductMode) => void;
  updateQuantity: (productId: string, mode: ProductMode, quantity: number) => void;
  updateNotes: (productId: string, mode: ProductMode, notes: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalPriceByCurrency: Record<Currency, number>;
  currency: Currency | null;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "blox-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = useCallback((item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const qty = item.quantity || 1;
    setItems((prev) => {
      const exists = prev.find((i) => i.productId === item.productId && i.mode === item.mode);
      if (exists) {
        return prev.map((i) =>
          i.productId === item.productId && i.mode === item.mode
            ? { ...i, quantity: i.quantity + qty, notes: item.notes || i.notes }
            : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  }, []);

  const removeItem = useCallback((productId: string, mode: ProductMode) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.mode === mode)));
  }, []);

  const updateQuantity = useCallback((productId: string, mode: ProductMode, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.mode === mode ? { ...i, quantity } : i
      )
    );
  }, []);

  const updateNotes = useCallback((productId: string, mode: ProductMode, notes: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.mode === mode ? { ...i, notes } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const totalPriceByCurrency = items.reduce(
    (acc, i) => {
      acc[i.currency] = (acc[i.currency] || 0) + i.price * i.quantity;
      return acc;
    },
    { PEN: 0, MXN: 0, COP: 0 } as Record<Currency, number>
  );

  const currency = items.length > 0 ? items[0].currency : null;

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, updateNotes, clearCart, totalItems, totalPrice, totalPriceByCurrency, currency }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}