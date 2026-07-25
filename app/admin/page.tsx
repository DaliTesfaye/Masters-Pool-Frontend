import React from "react";
import { getAllOrders, updateOrderStatus } from "@/app/actions/admin";
import {
  Package,
  User,
  MapPin,
  Phone,
  Calendar,
  ShoppingBag,
  ChevronDown,
  Check,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const orders = await getAllOrders();

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-900 pb-5 gap-4">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wider text-white flex items-center gap-3">
              <Package className="text-primary w-7 h-7" /> Gestion des Commandes
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Liste de toutes les commandes passées par les clients.
            </p>
          </div>
          <div className="bg-[#0A0D10] border border-slate-900 px-4 py-2 rounded-lg text-xs font-bold text-slate-300">
            Total Commandes :{" "}
            <span className="text-white">{orders.length}</span>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-[#0A0D10] border border-slate-900 rounded-xl p-12 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-700 mx-auto" />
            <p className="text-slate-400 text-sm font-medium">
              Aucune commande pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order: any) => (
              <div
                key={order.id}
                className="bg-[#0A0D10] border border-slate-900 hover:border-slate-800 transition-colors p-5 rounded-xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center"
              >
                {/* Client & Order Details */}
                <div className="space-y-3 text-xs text-slate-400 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-white font-bold bg-slate-900 px-2 py-0.5 rounded text-[11px]">
                      #{order.id.slice(0, 8)}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <p className="flex items-center gap-2 text-slate-300 font-medium">
                      <User className="w-3.5 h-3.5 text-primary shrink-0" />{" "}
                      {order.full_name || order.name || "Client inconnu"}
                    </p>
                    <p className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />{" "}
                      {order.phone_number || "Pas de téléphone"}
                    </p>
                  </div>

                  <p className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {order.shipping_address ||
                      order.address ||
                      "Retrait sur place"}
                  </p>

                  {/* Products Section */}
                  <div className="border-t border-slate-900 pt-2 mt-2 space-y-1">
                    <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" /> Articles commandés :
                    </p>
                    {order.order_items && order.order_items.length > 0 ? (
                      order.order_items.map((item: any, idx: number) => {
                        // Safely extract product name from relation (object or array) or fallback fields
                        const productName =
                          item.products?.name ||
                          (Array.isArray(item.products) &&
                            item.products[0]?.name) ||
                          item.product_name ||
                          item.name ||
                          "Produit sans nom";

                        return (
                          <div
                            key={idx}
                            className="text-slate-300 flex justify-between pr-4 items-center"
                          >
                            <span>
                              •{" "}
                              <strong className="text-white">
                                {productName}
                              </strong>
                              <span className="text-slate-500 text-[11px] ml-1">
                                (x{item.quantity})
                              </span>
                            </span>
                            <span className="font-mono">
                              {item.price_at_purchase
                                ? `${item.price_at_purchase} TND`
                                : ""}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-slate-500 italic">
                        Aucun détail d'article trouvé
                      </p>
                    )}
                  </div>

                  <div className="pt-1 text-emerald-400 font-bold text-sm">
                    Montant Total : {order.total_amount} TND
                  </div>
                </div>

                {/* Status Actions */}
                {/* Status Actions */}
                <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end border-t lg:border-t-0 border-slate-900 pt-4 lg:pt-0">
                  {order.status === "completed" ? (
                    // Locked badge when status is completed
                    <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <Check className="w-3.5 h-3.5" />
                      Completed
                    </div>
                  ) : (
                    // Interactive dropdown for active/pending statuses
                    <details className="relative group">
                      <summary className="list-none cursor-pointer bg-slate-900 text-slate-300 border border-slate-800 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-800 transition-colors">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            order.status === "processing"
                              ? "bg-amber-500"
                              : order.status === "cancelled"
                                ? "bg-rose-500"
                                : "bg-blue-500"
                          }`}
                        ></span>
                        {order.status || "pending"}{" "}
                        <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-70 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="absolute right-0 lg:-right-2 mt-2 w-48 bg-[#0F1318] border border-slate-800 rounded-xl shadow-xl shadow-black/50 p-1 z-20 flex flex-col gap-0.5">
                        {[
                          "pending",
                          "processing",
                          "completed",
                          "cancelled",
                        ].map((status) => {
                          const updateAction = updateOrderStatus.bind(
                            null,
                            order.id,
                            status,
                          ) as any;
                          const isActive =
                            order.status === status ||
                            (!order.status && status === "pending");

                          return (
                            <form key={status} action={updateAction}>
                              <button
                                type="submit"
                                className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-between transition-colors
                  ${isActive ? "bg-slate-800/60 text-white" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}
                `}
                              >
                                {status === "pending" && "En attente"}
                                {status === "processing" && "En préparation"}
                                {status === "completed" && "Livré / Complété"}
                                {status === "cancelled" && "Annulé"}
                                {isActive && (
                                  <Check className="w-3.5 h-3.5 text-primary" />
                                )}
                              </button>
                            </form>
                          );
                        })}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
