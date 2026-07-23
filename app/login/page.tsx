// app/login/page.tsx
import { login } from '@/app/auth/actions'
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center px-6 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-md w-full bg-[#0A0D10]/60 border border-slate-900 rounded-2xl p-8 space-y-6 relative z-10 backdrop-blur-md">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Connexion</h1>
          <p className="text-xs text-slate-400 font-light">Accédez à votre espace client Masters Pool.</p>
        </div>

        <form className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Adresse E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" />
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full h-11 bg-black border border-slate-900 rounded-lg pl-10 pr-4 text-xs font-medium focus:border-emerald-500/50 outline-none text-white transition-colors"
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
                className="w-full h-11 bg-black border border-slate-900 rounded-lg pl-10 pr-4 text-xs font-medium focus:border-emerald-500/50 outline-none text-white transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-xs font-medium text-rose-400 bg-rose-950/20 border border-rose-900/50 p-3 rounded-lg text-center/50">
              {decodeURIComponent(error)}
            </div>
          )}

          <button 
            formAction={login}
            className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xs rounded-lg shadow-[0_4px_20px_rgba(16,185,129,0.15)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <LogIn className="w-4 h-4" /> Se Connecter
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Nouveau client ?{' '}
          <Link href="/signup" className="text-emerald-400 hover:underline font-bold">
            Créer un compte
          </Link>
        </p>

      </div>
    </div>
  )
}