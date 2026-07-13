"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User } from "lucide-react";
import { useShop } from "@/context/shop-context";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" }, // Directs to hash correctly even from subpages
  { label: "Produits", href: "/produits" }, // Routes straight to your products page
];

export default function Navbar() {
  const { setCartOpen, cart } = useShop();
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-glass">
      <nav className="mx-auto grid h-20 w-full max-w-6xl grid-cols-3 items-center gap-4 px-6">
        
        {/* Left: Pure Logo Link (Max 20px) */}
        <Link href="/" className="w-16.25 h-16.25 block transition-transform duration-200 hover:scale-105 shrink-0">
          <img 
            src="/logo.jpeg" 
            alt="Masters Pool Logo" 
            className="w-full h-full object-cover rounded-full shadow-neon-green border border-primary/50"
          />
        </Link>

        {/* Center: Navigation Links */}
        <ul className="flex items-center justify-center gap-8">
          {navItems.map((item) => (
            <li key={item.label}>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground h-auto px-0 text-xs tracking-widest uppercase hover:text-primary"
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            </li>
          ))}
        </ul>

        {/* Right: Actions Utilities (Cart & Profile Login) */}
        <div className="flex items-center justify-end gap-4">
          
          {/* Reactive Cart Trigger Button */}
          <Button
            onClick={() => setCartOpen(true)}
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-primary h-9 w-9 transition-colors duration-200"
            title="Ouvrir le panier"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-black text-[9px] font-black font-mono w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-neon-green">
                {totalItemsCount}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary h-9 w-9 transition-colors duration-200"
          >
            <Link href="#login">
              <User className="w-4 h-4" />
            </Link>
          </Button>
        </div>

      </nav>
    </header>
  );
}