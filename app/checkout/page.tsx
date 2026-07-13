"use client";
// app/checkout/page.tsx
import * as React from "react";
import { useShop } from "@/context/shop-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Truck, Club } from "lucide-react";

export default function CheckoutPage() {
  const { cart, getCartSubtotal } = useShop();
  const [deliveryMethod, setDeliveryMethod] = React.useState<"club" | "delivery">("club");
  const router = useRouter();

  const subtotal = getCartSubtotal();
  const deliveryFee = deliveryMethod === "delivery" ? 8 : 0;
  const total = subtotal + deliveryFee;

  const handleConfirmOrder = () => {
    // Basic structural routing without state loss or intermediate page flashing
    router.push("/produits/confirmation");
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 px-6 md:px-12 relative">
      <div className="absolute top-0 left-1/4 w-140 h-140 bg-emerald-500/2 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-10">
        
        {/* Navigation Link header */}
        <Link 
          href="/produits" 
          className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-slate-500 hover:text-primary transition duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Continuer les achats
        </Link>

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-primary block mb-2">Finalisation</span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">VALIDER LA COMMANDE</h1>
        </div>

        {cart.length === 0 ? (
          <div className="border border-slate-900 bg-[#0A0D10] rounded-xl p-12 text-center max-w-md mx-auto space-y-4">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Aucun produit à valider</p>
            <p className="text-xs text-slate-600 font-light">Votre panier est actuellement vide. Veuillez sélectionner des articles du Pro-Shop.</p>
            <Link href="/produits" className="inline-block px-6 py-2.5 bg-primary text-black font-bold uppercase tracking-wider text-xs rounded-md">
              Voir le Catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT SIDE INPUT PANEL: Shipping Options and Details Form (7 Columns) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Delivery Choice Grid Cards */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Mode de Récupération</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("club")}
                    className={`p-4 rounded-xl border flex flex-col gap-2 text-left transition-all duration-200 ${
                      deliveryMethod === "club"
                        ? "bg-[#0A0D10] border-primary text-white shadow-neon-green"
                        : "bg-black/40 border-slate-900 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <Club className={`w-5 h-5 ${deliveryMethod === "club" ? "text-primary" : "text-slate-500"}`} />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider block text-white">Retrait Gratuit au Club</span>
                      <span className="text-[11px] font-light text-slate-500 block mt-0.5">Disponible immédiatement à Masters Pool</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`p-4 rounded-xl border flex flex-col gap-2 text-left transition-all duration-200 ${
                      deliveryMethod === "delivery"
                        ? "bg-[#0A0D10] border-primary text-white shadow-neon-green"
                        : "bg-black/40 border-slate-900 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <Truck className={`w-5 h-5 ${deliveryMethod === "delivery" ? "text-primary" : "text-slate-500"}`} />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider block text-white">Livraison à Domicile</span>
                      <span className="text-[11px] font-light text-slate-500 block mt-0.5">Frais de port fixes de 8 DT dans toute la Tunisie</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Informational Customer Fields Entry Form Box */}
              <div className="space-y-4 pt-6 border-t border-slate-950">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Informations Personnelles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Nom Complet</label>
                    <input type="text" placeholder="Ex: Dali" className="w-full h-11 bg-[#0A0D10] border border-slate-900 rounded-lg px-4 text-xs font-medium focus:border-primary/50 outline-hidden transition" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Numéro de Téléphone</label>
                    <input type="tel" placeholder="Ex: 22 123 456" className="w-full h-11 bg-[#0A0D10] border border-slate-900 rounded-lg px-4 text-xs font-mono focus:border-primary/50 outline-hidden transition" />
                  </div>
                </div>

                {deliveryMethod === "delivery" && (
                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Adresse Complète de Livraison</label>
                    <textarea rows={3} placeholder="Rue, Ville, Code Postal..." className="w-full bg-[#0A0D10] border border-slate-900 rounded-lg p-4 text-xs font-medium focus:border-primary/50 outline-hidden transition resize-none" />
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT SIDE DATA PANEL: Quick Items Checklist and Subtotal Card (5 Columns) */}
            <div className="lg:col-span-5 bg-[#0A0D10] border border-slate-900 rounded-xl p-6 space-y-6 sticky top-28">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-950 pb-3">Récapitulatif de Commande</h3>
              
              {/* Embedded item review loop */}
              <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-light truncate max-w-50">
                      {item.name} <span className="text-[10px] font-mono text-slate-600 font-bold ml-1">x{item.quantity}</span>
                    </span>
                    <span className="font-mono text-white font-bold">{parseInt(item.price.replace(/[^0-9]/g, ""), 10) * item.quantity} DT</span>
                  </div>
                ))}
              </div>

              {/* Price calculations layout segment panel */}
              <div className="space-y-2 border-t border-slate-950 pt-4 text-xs">
                <div className="flex justify-between text-slate-500 font-light">
                  <span>Sous-total</span>
                  <span className="font-mono">{subtotal} DT</span>
                </div>
                <div className="flex justify-between text-slate-500 font-light">
                  <span>Frais de livraison</span>
                  <span className="font-mono">{deliveryFee === 0 ? "Gratuit" : `${deliveryFee} DT`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-950/60">
                  <span className="uppercase tracking-wider">Total</span>
                  <span className="font-mono text-primary">{total} DT</span>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="button" 
                  onClick={handleConfirmOrder}
                  className="w-full h-12 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-lg shadow-neon-green hover:bg-emerald-400 transition-all duration-300"
                >
                  Confirmer la Commande
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 uppercase font-bold tracking-wider pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" /> Paiement Cash à la Livraison / Récupération
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}