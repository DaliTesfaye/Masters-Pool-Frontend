"use client";

import * as React from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  getCart, 
  addToCart as addToCartAction, 
  updateCartQuantity as updateQuantityAction, 
  removeFromCart as removeFromCartAction 
} from "@/app/actions/cart";

export interface CartItem {
  id: number;
  db_id?: string;
  name: string;
  price: string;
  image: string;
  category: string;
  quantity: number;
}

interface ShopContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  isLoading: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: any) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, delta: number) => Promise<void>;
  getCartSubtotal: () => number;
  refreshCart: () => Promise<void>;
  clearLocalCart: () => void;
}

const ShopContext = React.createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const parseNumericPrice = (priceStr: string | number): number => {
    if (typeof priceStr === "number") return priceStr;
    const clean = String(priceStr).replace(/[^0-9.]/g, "");
    return parseFloat(clean) || 0;
  };

  const clearLocalCart = React.useCallback(() => {
    setCart([]);
    setCartOpen(false);
  }, []);

  // 1. Fetch Cart from Supabase Database
  const refreshCart = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getCart();
      
      if (res?.items && res.items.length > 0) {
        const formattedItems: CartItem[] = res.items.map((item: any) => ({
          id: isNaN(Number(item.product_id)) ? hashCode(String(item.product_id)) : Number(item.product_id),
          db_id: item.id,
          name: item.product_name,
          price: `${item.product_price} DT`,
          image: item.product_image || "",
          category: "Piscine",
          quantity: item.quantity,
        }));
        setCart(formattedItems);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Auth Listener
  React.useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session || event === "SIGNED_OUT") {
        clearLocalCart();
        setIsLoading(false);
        return;
      }

      if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") {
        await refreshCart();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshCart, clearLocalCart]);

  // 3. Add To Cart
  const addToCart = async (product: any) => {
    const numericPrice = parseNumericPrice(product.price);
    const productId = typeof product.id === "string" 
      ? (isNaN(Number(product.id)) ? hashCode(product.id) : Number(product.id)) 
      : product.id;

    const formattedProduct: CartItem = {
      id: productId,
      name: product.name,
      price: typeof product.price === "number" ? `${product.price} DT` : product.price,
      image: product.image_url || product.image || "",
      category: product.category || "Piscine",
      quantity: 1,
    };

    // Optimistic UI update
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, formattedProduct];
    });

    setCartOpen(true);

    try {
      const res = await addToCartAction({
        id: String(product.id),
        name: product.name,
        price: numericPrice,
        image: product.image_url || product.image,
      });

      if (res?.success) {
        const updatedCartRes = await getCart();
        if (updatedCartRes?.items) {
          setCart((prev) =>
            prev.map((localItem) => {
              const matchedDbItem = updatedCartRes.items.find(
                (dbItem: any) => String(dbItem.product_id) === String(product.id)
              );
              return matchedDbItem ? { ...localItem, db_id: matchedDbItem.id } : localItem;
            })
          );
        }
      }
    } catch (err) {
      console.warn("Database sync error:", err);
    }
  };

  // 4. Remove From Cart
  const removeFromCart = async (id: number) => {
    const itemToRemove = cart.find((item) => item.id === id);
    
    setCart((prev) => prev.filter((item) => item.id !== id));

    if (itemToRemove?.db_id) {
      await removeFromCartAction(itemToRemove.db_id);
    }
  };

  // 5. Update Quantity
  const updateQuantity = async (id: number, delta: number) => {
    const targetItem = cart.find((item) => item.id === id);
    if (!targetItem) return;

    const newQty = targetItem.quantity + delta;

    if (newQty <= 0) {
      await removeFromCart(id);
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );

    if (targetItem.db_id) {
      await updateQuantityAction(targetItem.db_id, newQty);
    }
  };

  const getCartSubtotal = () => {
    return cart.reduce((sum, item) => {
      return sum + parseNumericPrice(item.price) * item.quantity;
    }, 0);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        isCartOpen,
        isLoading,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartSubtotal,
        refreshCart,
        clearLocalCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = React.useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}