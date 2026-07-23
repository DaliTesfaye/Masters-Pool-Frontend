// app/dashboard/layout.tsx
import {LogoutButton} from "@/app/components/logout-button";
import { createClient } from '@/utils/supabase/server'
import { 
  User, ShoppingBag, LayoutDashboard, 
  Waves, CalendarDays, Trophy 
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const navItems = [
    { label: 'Accueil', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Mon Profil', href: '/dashboard/profile', icon: User },
    { label: 'Mes Commandes', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Réservations (Bientôt)', href: '#', icon: CalendarDays, disabled: true },
    { label: 'Tournois (Bientôt)', href: '#', icon: Trophy, disabled: true },
  ]

  return (
    <div className="min-h-[calc(100vh-64px)] pt-16 bg-black text-white flex select-none">
      
      <aside className="w-64 bg-[#0A0D10]/40 border-r border-slate-900 flex flex-col justify-between p-5 pt-8 backdrop-blur-md sticky top-16 h-[calc(100vh-64px)] shrink-0">
        <div className="space-y-8">
          
          <div className="flex items-center gap-2.5 px-2">
            <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest block text-white">Masters Pool</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block -mt-0.5">Espace Client</span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 h-10 rounded-xl text-xs font-bold transition-all group border border-transparent ${
                    item.disabled 
                      ? 'opacity-30 pointer-events-none text-slate-600' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50 hover:border-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.disabled ? 'text-slate-700' : 'text-slate-500 group-hover:text-cyan-400 transition-colors'}`} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Replaced raw form with LogoutButton */}
        <div className="pt-4 border-t border-slate-900/60">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto pt-12 p-6 md:p-10 relative">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  )
}