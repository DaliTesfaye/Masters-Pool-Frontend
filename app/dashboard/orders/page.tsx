// app/dashboard/orders/page.tsx
import { createClient } from '@/utils/supabase/server'
import { ShoppingBag, ArrowUpRight, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch real order data from Supabase
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      created_at,
      status,
      total_amount,
      delivery_method,
      address,
      order_items (
        quantity,
        products (
          name
        )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error.message);
  }

  const safeOrders = (orders || []) as any[];

  return (
    <div className="space-y-8">
      
      {/* PAGE HEADER */}
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
          Mes Commandes
        </h1>
        <p className="text-xs text-slate-400 font-light leading-relaxed">
          Suivez l'état de vos achats et accédez à vos factures Masters Pool en un coup d'œil.
        </p>
      </div>

      {safeOrders.length === 0 ? (
        /* CLEAN EMPTY STATE */
        <div className="border border-dashed border-slate-900 rounded-2xl p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto space-y-4">
          <div className="p-4 bg-slate-900/40 rounded-full text-slate-600 border border-slate-900">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-200">Aucune commande pour le moment</h3>
            <p className="text-xs text-slate-500 font-light max-w-xs mx-auto">
              Une fois que vous aurez validé un devis ou effectué un achat, l'historique apparaîtra ici.
            </p>
          </div>
          <Link 
            href="/#produits" 
            className="inline-flex items-center gap-2 px-4 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-all"
          >
            Voir notre catalogue <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        /* MINIMALIST ORDERS LIST */
        <div className="space-y-4">
          {safeOrders.map((order) => {
            // Build items list string
            const itemsString = order.order_items
              ? order.order_items
                  .map((item: any) => `${item.products?.name || "Produit"} (x${item.quantity})`)
                  .join(", ")
              : "Aucun article";

            // Status mapping to label
            const isCompleted = order.status === 'completed';
            const isProcessing = order.status === 'processing';
            const isCancelled = order.status === 'cancelled';
            const isPending = order.status === 'pending';

            return (
              <div 
                key={order.id} 
                className="bg-[#0A0D10]/40 border border-slate-900 rounded-2xl p-5 md:p-6 backdrop-blur-md hover:border-slate-800 transition-colors space-y-4"
              >
                {/* TOP CARD BAR */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-900/60">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">N° de commande</p>
                      <p className="text-xs font-black text-white uppercase tracking-wide">#{order.id.slice(-6)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Date d'achat</p>
                      <p className="text-xs font-bold text-slate-300">{formatDate(order.created_at)}</p>
                    </div>
                  </div>

                  {/* STATUS BADGES */}
                  <div>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" /> Livré / Complété
                      </span>
                    )}
                    {isProcessing && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                        <Clock className="w-3 h-3 animate-pulse" /> En préparation
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                        <Clock className="w-3 h-3" /> En attente
                      </span>
                    )}
                    {isCancelled && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider">
                        <AlertCircle className="w-3 h-3" /> Annulé
                      </span>
                    )}
                  </div>
                </div>

                {/* MIDDLE BODY CONTENT */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Articles commandés</p>
                    <p className="text-xs font-medium text-slate-200 leading-relaxed">
                      {itemsString}
                    </p>
                  </div>
                  
                  <div className="text-left md:text-right shrink-0">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total payé</p>
                    <p className="text-sm font-black text-cyan-400">{order.total_amount} TND</p>
                  </div>
                </div>

                {/* FOOTER METRICS INFO */}
                <div className="pt-3 border-t border-slate-900/40 flex items-center justify-between flex-wrap gap-3 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-400 font-light">
                    <Truck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Mode: {order.delivery_method === 'delivery' ? `Livraison à domicile (${order.address || 'Adresse non spécifiée'})` : 'Retrait direct au comptoir du club'}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* BUTTON TO 3 STEPS PAGE */}
                    <Link 
                      href={`/produits/confirmation?id=${order.id}`}
                      className="inline-flex items-center gap-1.5 px-3 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-wide hover:bg-cyan-500/20 transition-all cursor-pointer"
                    >
                      Voir statut
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>

                    <Link 
                      href="/contact" 
                      className="text-xs font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      <span>Besoin d'aide ?</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-700 group-hover:text-cyan-400 transition-colors" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  )
}