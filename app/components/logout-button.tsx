"use client";

import { useShop } from "@/context/shop-context";
import { logout } from "@/app/auth/actions";
import { LogOut } from "lucide-react";
import { useTransition } from "react";

export function LogoutButton() {
  const { clearLocalCart } = useShop();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    // 1. Immediately clear the cart in memory
    clearLocalCart();

    // 2. Execute the server action to destroy the Supabase session
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="w-full flex items-center gap-3 px-3 h-10 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-400 hover:bg-rose-950/10 transition-all cursor-pointer disabled:opacity-50"
    >
      <LogOut className="w-4 h-4" />
      {isPending ? "Déconnexion..." : "Déconnexion"}
    </button>
  );
}