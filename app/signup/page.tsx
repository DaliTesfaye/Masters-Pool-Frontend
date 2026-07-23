// app/signup/page.tsx
import { signup } from '@/app/auth/actions'
import { Mail, Lock, UserPlus, User, Phone } from 'lucide-react'
import Link from 'next/link'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center px-6 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-md w-full bg-[#0A0D10]/60 border border-slate-900 rounded-2xl p-8 space-y-6 relative z-10 backdrop-blur-md">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Inscription</h1>
          <p className="text-xs text-slate-400 font-light">Inscrivez-vous pour suivre l'avancement de votre projet.</p>
        </div>

        <form className="space-y-4">
          
          {/* NEW: Full Name input field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Nom Complet</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" />
              <input 
                name="fullName" 
                type="text" 
                required 
                className="w-full h-11 bg-black border border-slate-900 rounded-lg pl-10 pr-4 text-xs font-medium focus:border-cyan-500/50 outline-none text-white transition-colors"
                placeholder="Jean Dupont"
              />
            </div>
          </div>

          {/* NEW: Phone Number input field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Numéro de Téléphone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" />
              <input 
                name="phone" 
                type="tel" 
                required 
                className="w-full h-11 bg-black border border-slate-900 rounded-lg pl-10 pr-4 text-xs font-medium focus:border-cyan-500/50 outline-none text-white transition-colors"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Adresse E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" />
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full h-11 bg-black border border-slate-900 rounded-lg pl-10 pr-4 text-xs font-medium focus:border-cyan-500/50 outline-none text-white transition-colors"
                placeholder="nom@exemple.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" />
              <input 
                name="password" 
                type="password" 
                required 
                className="w-full h-11 bg-black border border-slate-900 rounded-lg pl-10 pr-4 text-xs font-medium focus:border-cyan-500/50 outline-none text-white transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-xs font-medium text-rose-400 bg-rose-950/20 border border-rose-900/50 p-3 rounded-lg text-center">
              {decodeURIComponent(error)}
            </div>
          )}

          <button 
            formAction={signup}
            className="w-full h-11 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-xs rounded-lg shadow-[0_4px_20px_rgba(6,182,212,0.15)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <UserPlus className="w-4 h-4" /> Créer mon compte
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-cyan-400 hover:underline font-bold">
            Se connecter
          </Link>
        </p>

      </div>
    </div>
  )
}