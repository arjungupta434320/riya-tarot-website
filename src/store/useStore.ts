import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  description: string;
  shortIntention: string;
  price: number;
  salePrice?: number;
  image: string;
  gallery?: string[];
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  isCartOpen: boolean;
  wishlist: string[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  cart: [],
  isCartOpen: false,
  wishlist: [],
  addToCart: (product, quantity = 1) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
          isCartOpen: true,
        };
      }
      return { cart: [...state.cart, { ...product, quantity }], isCartOpen: true };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    })),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  clearCart: () => set({ cart: [] }),
  toggleWishlist: (productId) =>
    set((state) => {
      if (state.wishlist.includes(productId)) {
        return { wishlist: state.wishlist.filter((id) => id !== productId) };
      }
      return { wishlist: [...state.wishlist, productId] };
    }),
}));
