// app/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/auth/actions'
import { LogOut, User, Calendar, Shield, IdCard, Phone } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the linked custom profile data from our public.profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone_number')
    .eq('id', user.id)
    .single()

  const signupDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : "Non disponible"

  return (
    <div className="min-h-screen bg-[#000000] text-white p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-md w-full bg-[#0A0D10]/60 border border-slate-900 rounded-2xl p-6 space-y-6 backdrop-blur-md relative">
        
        {/* Header and Logout */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            <h1 className="text-sm font-black uppercase tracking-wider">Profil Client</h1>
          </div>
          <form action={logout}>
            <button className="h-8 px-3 bg-black hover:bg-rose-950/20 hover:text-rose-400 border border-slate-900 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer">
              <LogOut className="w-3 h-3" /> Déconnexion
            </button>
          </form>
        </div>

        {/* User Visual Avatar */}
        <div className="flex flex-col items-center text-center space-y-2 py-2">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <User className="w-7 h-7" />
          </div>
          <div>
            {/* Display full name if set, otherwise fallback to email */}
            <h2 className="text-sm font-bold text-slate-200">
              {profile?.full_name || user.email}
            </h2>
            <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">Compte Vérifié</p>
          </div>
        </div>

        {/* Profile Metadata Breakdown */}
        <div className="space-y-2.5 bg-black/40 p-4 rounded-xl border border-slate-900/60">
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <User className="w-3.5 h-3.5 text-slate-600" />
              <span>Nom Complet</span>
            </div>
            <span className="font-medium text-slate-300">
              {profile?.full_name || "Non renseigné"}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-3.5 h-3.5 text-slate-600" />
              <span>Téléphone</span>
            </div>
            <span className="font-medium text-slate-300">
              {profile?.phone_number || "Non renseigné"}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-600" />
              <span>Membre Depuis</span>
            </div>
            <span className="font-medium text-slate-300">
              {signupDate}
            </span>
          </div>

        </div>

      </div>
    </div>
  )
}