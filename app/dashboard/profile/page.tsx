// app/dashboard/profile/page.tsx
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/auth/actions'
import { LogOut, User, Sparkles } from 'lucide-react'
import { redirect } from 'next/navigation'
import ProfileForm from './profile-form'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the linked custom profile data from public.profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone_number, address')
    .eq('id', user.id)
    .single()

  const signupDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : "Non disponible"

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
          Mon Profil
        </h1>
        <p className="text-xs text-slate-400 font-light leading-relaxed">
          Gérez vos coordonnées personnelles de livraison et de contact utilisées lors de vos achats.
        </p>
      </div>

      <div className="max-w-2xl bg-[#0A0D10]/40 border border-slate-900 rounded-2xl p-6 md:p-8 space-y-8 backdrop-blur-md relative overflow-hidden">
        {/* Ambient light glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />

        {/* Top Header Section */}
        <div className="flex justify-between items-center border-b border-slate-900/60 pb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-200">
                {profile?.full_name || user.email}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span className="text-[9px] text-emerald-400 font-black uppercase tracking-wider">Membre Privilège</span>
              </div>
            </div>
          </div>
          <form action={logout}>
            <button className="h-9 px-4 bg-black hover:bg-rose-950/20 hover:text-rose-400 border border-slate-900 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1.5 cursor-pointer">
              <LogOut className="w-3.5 h-3.5" /> Déconnexion
            </button>
          </form>
        </div>

        {/* Form Body */}
        <div className="relative z-10">
          <ProfileForm 
            initialProfile={profile} 
            userEmail={user.email || ""} 
            signupDate={signupDate} 
          />
        </div>

      </div>
    </div>
  )
}