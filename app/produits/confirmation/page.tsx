"use client";

import * as React from "react";
import { CheckCircle2, ArrowRight, MapPin, Calendar, HelpCircle } from "lucide-react";

// Explicit type for allowed states in your application pipeline
type OrderStatus = "unverified" | "verified" | "onboarding" | "shipped";

export default function OrderConfirmationPage() {
  /**
   * You can dynamically change this state to test the UI transitions:
   * "unverified" -> Step 1 active
   * "verified"   -> Step 2 active, Step 1 completed
   * "onboarding" -> Step 3 active, Steps 1-2 completed
   * "shipped"    -> All steps completed
   */
  const currentStatus: OrderStatus = "shipped";

  // Maps your backend/state strings to their sequential index weights
  const statusWeights: Record<OrderStatus, number> = {
    unverified: 1,
    verified: 2,
    onboarding: 3,
    shipped: 4, // 4 means everything up to step 3 is fully finished
  };

  const currentWeight = statusWeights[currentStatus];

  const stepsData = [
    {
      weight: 1,
      title: "Vérification du compte",
      activeText: "En attente de validation",
      desc: "Notre équipe vérifie les détails de votre profil informatique pour valider la commande.",
    },
    {
      weight: 2,
      title: "Onboarding & Configuration",
      activeText: "Configuration en cours",
      desc: "Préparation de votre espace, attribution des accès et calibrage technique de votre environnement.",
    },
    {
      weight: 3,
      title: "Matériel Expédié",
      activeText: "Livraison en cours",
      desc: "Le matériel a quitté nos ateliers ou est prêt pour votre retrait direct au comptoir du club.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-28 pb-24 px-6 md:px-12 relative flex items-center justify-center">
      {/* Ambient glowing background blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto relative z-10 text-center space-y-8">
        
        {/* Success Header Status */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400 block">
            Statut de la Demande
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
            Suivi de Commande
          </h1>
          <p className="text-slate-400 font-light text-sm max-w-md mx-auto leading-relaxed">
            Suivez l'évolution en temps réel du traitement de votre dossier et de la configuration de votre matériel.
          </p>
        </div>

        {/* Dynamic State Status Tracking Component */}
        <div className="bg-[#0A0D10]/30 border border-slate-900 rounded-xl p-6 text-left space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-900 pb-3">
            Progression de l'activation
          </h3>
          
          <div className="space-y-5">
            {stepsData.map((step, idx) => {
              const isActive = step.weight === currentWeight;
              const isCompleted = step.weight < currentWeight;

              return (
                <div key={step.weight} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-6 h-6 rounded-full border text-xs font-black flex items-center justify-center font-mono transition-all duration-300 ${
                      isActive 
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                        : isCompleted 
                        ? "bg-emerald-500 border-emerald-500 text-black" 
                        : "bg-slate-950 border-slate-800 text-slate-500"
                    }`}>
                      {isCompleted ? "✓" : step.weight}
                    </div>
                    {idx !== stepsData.length - 1 && (
                      <div className={`w-0.5 h-12 transition-colors duration-300 ${isCompleted ? 'bg-emerald-500/40' : 'bg-slate-900'}`} />
                    )}
                  </div>
                  
                  <div className="space-y-1 pt-0.5">
                    <h4 className={`text-sm font-bold uppercase tracking-tight transition-colors duration-300 ${isActive || isCompleted ? 'text-white' : 'text-slate-500'}`}>
                      {step.title}
                      {isActive && (
                        <span className="ml-2 text-[9px] font-normal tracking-normal bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase animate-pulse">
                          {step.activeText}
                        </span>
                      )}
                    </h4>
                    <p className={`text-xs font-light leading-relaxed transition-colors duration-300 ${isActive || isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informative Grid Metadata Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-4 rounded-xl border border-slate-900 bg-[#0A0D10]/20 flex gap-3 items-start">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold uppercase text-slate-400 tracking-wide mb-1">Point de Retrait Principal</h5>
              <p className="text-xs font-light text-slate-500 leading-relaxed">
                Club Masters Pool<br />Tunis, Tunisie
              </p>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-slate-900 bg-[#0A0D10]/20 flex gap-3 items-start">
            <Calendar className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold uppercase text-slate-400 tracking-wide mb-1">Horaires de Retrait</h5>
              <p className="text-xs font-light text-slate-500 leading-relaxed">
                7j/7 — De 10:00 à 00:00<br />Assistance technique sur place
              </p>
            </div>
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-slate-900">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full sm:w-auto px-8 h-12 bg-emerald-500 text-black font-bold uppercase tracking-widest text-xs rounded-lg shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:bg-emerald-400 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            Retour au Tableau de Bord <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Help Center Contact Note */}
        <p className="text-[10px] text-slate-600 font-light flex items-center justify-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" /> Besoin d'assistance ? Contactez directement l'équipe technique au club.
        </p>

      </div>
    </div>
  );
}