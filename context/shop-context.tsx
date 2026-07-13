"use client";
// context/shop-context.tsx
import * as React from "react";

export interface CartItem {
  id: number;
  name: string;
  price: string; // e.g., "420 DT"
  image: string;
  category: string;
  quantity: number;
}

interface ShopContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  getCartSubtotal: () => number;
}

const ShopContext = React.createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = React.useState(false);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true); // Automatically slide open cart on add
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const getCartSubtotal = () => {
    return cart.reduce((sum, item) => {
      const numericPrice = parseInt(item.price.replace(/[^0-9]/g, ""), 10) || 0;
      return sum + numericPrice * item.quantity;
    }, 0);
  };

  return (
    <ShopContext.Provider value={{ cart, isCartOpen, setCartOpen, addToCart, removeFromCart, updateQuantity, getCartSubtotal }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = React.useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context;
}