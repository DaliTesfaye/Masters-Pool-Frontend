"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  MapPin,
  Calendar,
  HelpCircle,
  Loader2,
  XCircle,
} from "lucide-react";

// Exact status allowed by your DB constraint
type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

interface OrderDetails {
  id: string;
  status: OrderStatus;
  total_amount?: number;
  created_at?: string;
  delivery_method?: string;
  address?: string;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = React.useState<OrderDetails | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Map your exact DB statuses to timeline weights (1 -> 3)
  const getStatusWeight = (status?: OrderStatus): number => {
    switch (status) {
      case "pending":
        return 1;
      case "processing":
        return 2;
      case "completed":
        return 3;
      default:
        return 1;
    }
  };

  React.useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("Aucun identifiant de commande fourni.");
      return;
    }

    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) throw new Error("Impossible de récupérer la commande");

        const data = await response.json();
        if (data) {
          setOrder({
            id: orderId,
            status: data.status,
            total_amount: data.total_amount,
            created_at: data.created_at,
            delivery_method: data.delivery_method,
            address: data.address,
          });
          setError(null);
        }
      } catch (err: unknown) {
        console.error("Order fetch error:", err);
        setError("Erreur lors du chargement du statut de la commande.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();

    // Poll every 10 seconds to auto-update as status shifts in DB
    const interval = setInterval(fetchOrderStatus, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  const currentStatus = order?.status || "pending";
  const currentWeight = getStatusWeight(currentStatus);
  const isCancelled = currentStatus === "cancelled";

  // 3-step timeline matching DB workflow
  const stepsData = [
    {
      weight: 1,
      title: "Commande Enregistrée",
      activeText: "En attente de confirmation",
      desc: "Votre demande a été reçue et est en cours de validation.",
    },
    {
      weight: 2,
      title: "Préparation & Traitement",
      activeText: "En cours de préparation",
      desc: "L'équipe prépare votre matériel et configure vos accès.",
    },
    {
      weight: 3,
      title: "Commande Finalisée",
      activeText: "Terminé 100%",
      desc: "Votre commande est prête / vous a été remise en main propre.",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-28 pb-24 px-6 md:px-12 relative flex items-center justify-center">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto relative z-10 text-center space-y-8">
        {/* Header Badge */}
        <div className="space-y-4 animate-in fade-in duration-500">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full border mb-2 ${
              isCancelled
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)]"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
            }`}
          >
            {isCancelled ? <XCircle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
          </div>

          <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400 block">
            Suivi de Commande
          </span>

          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
            Commande {orderId ? `#${orderId.slice(-6)}` : ""}
          </h1>

          {isCancelled && (
            <p className="text-rose-400 font-semibold text-sm">
              Cette commande a été annulée. Veuillez contacter le support en cas de doute.
            </p>
          )}

          {error && <p className="text-xs text-rose-500 font-mono">{error}</p>}
        </div>

        {/* Dynamic Progress Timeline */}
        {!isCancelled && (
          <div className="bg-[#0A0D10]/30 border border-slate-900 rounded-xl p-6 text-left space-y-6">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Progression
              </h3>
              {order?.total_amount && (
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Total: {order.total_amount} DT
                </span>
              )}
            </div>

            <div className="space-y-5">
              {stepsData.map((step, idx) => {
                const isActive = step.weight === currentWeight;
                const isCompleted = step.weight < currentWeight;

                return (
                  <div key={step.weight} className="flex gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className={`w-6 h-6 rounded-full border text-xs font-black flex items-center justify-center font-mono transition-all duration-300 ${
                          isActive
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            : isCompleted
                            ? "bg-emerald-500 border-emerald-500 text-black"
                            : "bg-slate-950 border-slate-800 text-slate-500"
                        }`}
                      >
                        {isCompleted || (currentWeight === 3 && step.weight === 3)
                          ? "✓"
                          : step.weight}
                      </div>
                      {idx !== stepsData.length - 1 && (
                        <div
                          className={`w-0.5 h-12 transition-colors duration-300 ${
                            isCompleted || currentWeight === 3
                              ? "bg-emerald-500/40"
                              : "bg-slate-900"
                          }`}
                        />
                      )}
                    </div>

                    <div className="space-y-1 pt-0.5">
                      <h4
                        className={`text-sm font-bold uppercase tracking-tight transition-colors duration-300 ${
                          isActive || isCompleted || (currentWeight === 3 && step.weight === 3)
                            ? "text-white"
                            : "text-slate-500"
                        }`}
                      >
                        {step.title}
                        {isActive && (
                          <span className="ml-2 text-[9px] font-normal tracking-normal bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase animate-pulse">
                            {step.activeText}
                          </span>
                        )}
                      </h4>
                      <p
                        className={`text-xs font-light leading-relaxed transition-colors duration-300 ${
                          isActive || isCompleted || (currentWeight === 3 && step.weight === 3)
                            ? "text-slate-400"
                            : "text-slate-600"
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-4 rounded-xl border border-slate-900 bg-[#0A0D10]/20 flex gap-3 items-start">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold uppercase text-slate-400 tracking-wide mb-1">
                Adresse
              </h5>
              <p className="text-xs font-light text-slate-500 leading-relaxed">
                {order?.address || "Club Masters Pool\nTunis, Tunisie"}
              </p>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-slate-900 bg-[#0A0D10]/20 flex gap-3 items-start">
            <Calendar className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold uppercase text-slate-400 tracking-wide mb-1">
                Horaires
              </h5>
              <p className="text-xs font-light text-slate-500 leading-relaxed">
                7j/7 — De 10:00 à 00:00
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-slate-900">
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full sm:w-auto px-8 h-12 bg-emerald-500 text-black font-bold uppercase tracking-widest text-xs rounded-lg shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:bg-emerald-400 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            Retour au Tableau de Bord <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] text-slate-600 font-light flex items-center justify-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" /> Besoin d'assistance ? Contactez le club.
        </p>
      </div>
    </div>
  );
}