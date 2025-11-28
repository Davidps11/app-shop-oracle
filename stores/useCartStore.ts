// stores/useCartStore.ts
import { create } from "zustand";

export type CartItem = {
  articleId: number;
  imageUrl: string;
  description: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  incrementQuantity: (articleId: number) => void;
  decrementQuantity: (articleId: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],

  // Agregar al carrito: si ya existe, aumenta quantity
addItem: (item) =>
  set((state) => {
    const existing = state.items.find(
      (i) => i.articleId === item.articleId
    );

    if (existing) {
      // Si ya existe, solo aumentamos cantidad
      return {
        items: state.items.map((i) =>
          i.articleId === item.articleId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };
    }

    // Si es nuevo → SIEMPRE iniciar en 1
    return {
      items: [...state.items, { ...item, quantity: 1 }],
    };
  }),


  // +1
  incrementQuantity: (articleId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.articleId === articleId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ),
    })),

  // -1 (y si llega a 0, se quita del carrito)
  decrementQuantity: (articleId) =>
    set((state) => {
      const updated = state.items
        .map((i) =>
          i.articleId === articleId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0);

      return { items: updated };
    }),

  clearCart: () => set({ items: [] }),
}));
