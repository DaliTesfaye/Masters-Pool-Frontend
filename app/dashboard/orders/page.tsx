// app/dashboard/orders/page.tsx
import { createClient } from '@/utils/supabase/server'
import { ShoppingBag, ArrowUpRight, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// Simple mock data for presentation - replace this later with your actual Supabase fetch
const mockOrders = [
  {
    id: "MP-98421",
    date: "12 Juillet 2026",
    status: "LIVRÉ", // EN_COURS, LIVRÉ, ANNULÉ
    total: "149.00 TND",
    items: "Kit d'entretien de piscine complet (Brosses, épuisette, thermomètre)",
    deliveryEstimate: "Livré le 14 Juillet 2026"
  },
  {
    id: "MP-97105",
    date: "05 Juillet 2026",
    status: "EN_COURS",
    total: "2,350.00 TND",
    items: "Pompe de filtration Masters Élite 1.5 CV + Filtre à sable",
    deliveryEstimate: "Estimation: Expédié sous 24h"
  }
]

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

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

      {mockOrders.length === 0 ? (
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
          {mockOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-[#0A0D10]/40 border border-slate-900 rounded-2xl p-5 md:p-6 backdrop-blur-md hover:border-slate-800 transition-colors space-y-4"
            >
              {/* TOP CARD BAR */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-900/60">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">N° de commande</p>
                    <p className="text-xs font-black text-white uppercase tracking-wide">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Date d'achat</p>
                    <p className="text-xs font-bold text-slate-300">{order.date}</p>
                  </div>
                </div>

                {/* STATUS BADGES */}
                <div>
                  {order.status === 'LIVRÉ' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" /> Livré
                    </span>
                  )}
                  {order.status === 'EN_COURS' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                      <Clock className="w-3 h-3 animate-pulse" /> En préparation
                    </span>
                  )}
                  {order.status === 'ANNULÉ' && (
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
                    {order.items}
                  </p>
                </div>
                
                <div className="text-left md:text-right shrink-0">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total payé</p>
                  <p className="text-sm font-black text-cyan-400">{order.total}</p>
                </div>
              </div>

              {/* FOOTER METRICS INFO */}
              <div className="pt-3 border-t border-slate-900/40 flex items-center justify-between flex-wrap gap-3 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-400 font-light">
                  <Truck className="w-3.5 h-3.5 text-slate-500" />
                  <span>{order.deliveryEstimate}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* UPDATED CONFIRMATION PATH */}
                  <Link 
                    href={`/produits/confirmation?id=${order.id}`}
                    className="inline-flex items-center gap-1.5 px-3 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-wide hover:bg-cyan-500/20 transition-all cursor-pointer"
                  >
                    Suivre le statut
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
          ))}
        </div>
      )}

    </div>
  )
}