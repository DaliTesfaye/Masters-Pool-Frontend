"use client";
// components/cart-drawer.tsx
import * as React from "react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useShop } from "@/context/shop-context";
import Link from "next/link";

export default function CartDrawer() {
  const { isCartOpen, setCartOpen, cart, updateQuantity, removeFromCart, getCartSubtotal } = useShop();

  // Handle ESC key to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    if (isCartOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setCartOpen]);

  return (
    <>
      {/* Background Overlay Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setCartOpen(false)}
      />

      {/* Main Right Drawer Side-Panel Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-110 bg-[#0A0D10] border-l border-slate-900 z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header Strip Panel */}
        <div className="p-6 border-b border-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Votre Panier</h2>
            <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-900">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button 
            onClick={() => setCartOpen(false)}
            className="p-1 text-slate-500 hover:text-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Cart Content List Arena */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-600">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Votre panier est vide</p>
                <p className="text-xs font-light text-slate-600 mt-1 max-w-50">Découvrez nos équipements de haute précision au Pro-Shop.</p>
              </div>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.id}
                className="flex gap-4 p-3 rounded-lg bg-black/40 border border-slate-950 items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 h-16 rounded bg-black border border-slate-900 shrink-0 overflow-hidden flex items-center justify-center p-1">
                    <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-medium block mb-0.5">{item.category}</span>
                    <h4 className="text-xs font-bold text-white truncate uppercase tracking-wide max-w-40">{item.name}</h4>
                    <span className="text-xs font-black text-primary font-mono block mt-1">{item.price}</span>
                  </div>
                </div>

                {/* Counter & Action Controls Wrapper */}
                <div className="flex flex-col items-end gap-2.5">
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-600 hover:text-rose-500 transition-colors duration-200 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center border border-slate-900 bg-black rounded-md overflow-hidden h-7">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 h-full text-slate-500 hover:text-white hover:bg-slate-950 transition-colors"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="px-2 text-xs font-mono font-bold text-white min-w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 h-full text-slate-500 hover:text-white hover:bg-slate-950 transition-colors"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sticky Bill checkout Action panel container */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-950 bg-black/20 space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Sous-total</span>
              <span className="text-xl font-black font-mono text-white tracking-tight">{getCartSubtotal()} DT</span>
            </div>
            <p className="text-[10px] text-slate-600 font-light leading-normal">
              Les options de livraison ou de retrait sur place à la salle Masters Pool s'effectuent à l'étape suivante.
            </p>
            <Link 
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="w-full h-12 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-lg shadow-neon-green hover:bg-emerald-400 transition-all duration-300 flex items-center justify-center"
            >
              Passer la Commande
            </Link>
          </div>
        )}
      </div>
    </>
  );
}