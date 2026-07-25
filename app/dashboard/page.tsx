// app/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server'
import { User, ShoppingBag, ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone_number, address')
    .eq('id', user.id)
    .single()

  const { count: activeOrdersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .neq('status', 'cancelled')

  const isProfileComplete = Boolean(
    profile?.full_name && profile?.phone_number && profile?.address
  )

  return (
    <div className="space-y-8">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#0A0D10] to-black border border-slate-900 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="max-w-xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Membre Privilège
          </div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white pt-1">
            Bienvenue, {profile?.full_name || 'Client'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            Gérez vos informations personnelles et suivez l'historique de vos commandes depuis votre espace client Masters Pool sécurisé.
          </p>
        </div>
      </div>

      {/* STATS TILES FOR ACTIVE SECTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#0A0D10]/40 border border-slate-900 rounded-xl p-5 flex items-center justify-between backdrop-blur-md">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Statut Profil</p>
            <p className={`text-sm font-bold ${isProfileComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isProfileComplete ? 'Complet' : 'Incomplet'}
            </p>
          </div>
          <div className={`p-2.5 rounded-lg border ${isProfileComplete ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0A0D10]/40 border border-slate-900 rounded-xl p-5 flex items-center justify-between backdrop-blur-md">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Commandes actives</p>
            <p className="text-sm font-bold text-slate-200">
              {activeOrdersCount || 0} commande{activeOrdersCount === 1 ? '' : 's'} en cours
            </p>
          </div>
          <div className="p-2.5 bg-slate-900/40 rounded-lg border border-slate-900 text-cyan-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* LOGICAL DISPATCH ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-1">Mises à jour</h3>
          <div className="flex items-start gap-3.5 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <p className="font-bold text-slate-200">Espace Client opérationnel</p>
              <p className="text-slate-400 font-light text-[11px]">Votre compte est entièrement connecté à notre base de données. Vos informations d'accès sont cryptées.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-1 font-black">Accès Rapides</h3>
          <div className="bg-[#0A0D10]/30 border border-slate-900 rounded-xl p-2 divide-y divide-slate-900/60">
            <Link href="/dashboard/profile" className="flex items-center justify-between p-3 text-xs font-bold text-slate-400 hover:text-white rounded-lg hover:bg-slate-900/30 transition-all group">
              <span>Voir mes informations</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </Link>
            <Link href="/dashboard/orders" className="flex items-center justify-between p-3 text-xs font-bold text-slate-400 hover:text-white rounded-lg hover:bg-slate-900/30 transition-all group">
              <span>Historique d'achats</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}