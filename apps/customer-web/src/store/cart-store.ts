import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  fabricId: string;
  fabricName: string;
  fabricColor: string;
  styleId: string;
  styleName: string;
  customizations: {
    collar: string;
    sleeve: string;
    fit: string;
  };
  quantity: number;
  price: number; // total price for this line item
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        set((state) => ({
          items: [...state.items, { ...item, id }],
        }));
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const unitPrice = item.price / item.quantity;
              return { ...item, quantity, price: unitPrice * quantity };
            }
            return item;
          }),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((total, item) => total + item.price, 0),
      getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: 'stitchit-cart-storage',
    }
  )
);
