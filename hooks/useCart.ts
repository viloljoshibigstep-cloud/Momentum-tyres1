"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, CartState, Product } from "@/types";

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity: number, price: number) => {
        const { items } = get();
        const existing = items.find((i) => i.product_id === product.id);

        if (existing) {
          set({
            items: items.map((i) =>
              i.product_id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          const newItem: CartItem = {
            product_id: product.id,
            product,
            quantity,
            unit_price: price,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((i) => i.product_id !== productId) });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product_id === productId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce(
          (sum, item) => sum + item.unit_price * item.quantity,
          0
        );
      },

      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "momentum-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
