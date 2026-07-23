"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, ShieldCheck, Clock } from "lucide-react";

export default function OrderConfirmedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const handleGoToTracker = () => {
    if (orderId) {
      router.push(`/checkout/success?orderId=${orderId}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-28 pb-24 px-6 md:px-12 relative flex items-center justify-center">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full mx-auto relative z-10 text-center space-y-8 bg-[#0A0D10]/50 border border-slate-900/80 p-8 rounded-2xl backdrop-blur-xl shadow-2xl">
        {/* Glowing Green Tick */}
        <div className="flex justify-center">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-in zoom-in-50 duration-500">
            <CheckCircle2 className="w-10 h-10" />
            <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping" />
          </div>
        </div>

        {/* Header Text */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400 block">
            Confirmation Réussie
          </span>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Commande Confirmée !
          </h1>
          <p className="text-slate-400 font-light text-xs leading-relaxed max-w-sm mx-auto">
            Votre adresse e-mail a été validée avec succès. Notre équipe a immédiatement pris en charge le traitement de votre commande.
          </p>
        </div>

        {/* Order ID & Status Summary Card */}
        {orderId && (
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 text-left space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Référence commande:</span>
              <span className="font-mono font-bold text-emerald-400">
                #{orderId.slice(-8)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Nouveau statut:</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <Clock className="w-3 h-3" /> En cours de traitement
              </span>
            </div>
          </div>
        )}

        {/* Action Button to Return to Tracker */}
        <div className="pt-2">
          <button
            onClick={handleGoToTracker}
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_4px_25px_rgba(16,185,129,0.3)] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            Suivre l'avancement de ma commande{" "}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Support Note */}
        <p className="text-[10px] text-slate-600 font-light flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
          Transaction sécurisée & enregistrée
        </p>
      </div>
    </div>
  );
}