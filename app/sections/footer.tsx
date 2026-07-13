// components/footer.tsx
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#000000] border-t border-slate-900 pt-20 pb-10 px-6 md:px-12 relative overflow-hidden">
      
      {/* Deep subtle background glow */}
      <div className="absolute bottom-0 right-0 w-100 h-100 bg-emerald-500/2 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Top Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Column 1: Brand Signature */}
          <div className="md:col-span-4 space-y-6">
            <Link href="#home" className="w-13.75 h-13.75 block transition-transform duration-200 hover:scale-105">
              <img 
                src="/logo.jpeg" 
                alt="Masters Pool Logo" 
                className="w-full h-full object-cover rounded-full shadow-neon-green border border-primary/40"
              />
            </Link>
            <p className="text-xs text-slate-500 max-w-xs font-light leading-relaxed uppercase tracking-wider">
              L'alliance ultime du design épuré et de la précision technique pour les passionnés de billard.
            </p>
          </div>

          {/* Column 2: Direct Accès */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary text-neon-glow block mb-2">
              Accès Direct
            </span>
            <div className="space-y-3">
              <a 
                href="tel:+216 99 487 070" 
                className="flex items-center gap-3 text-xs text-slate-400 hover:text-primary transition duration-200 font-mono"
              >
                <Phone className="w-3.5 h-3.5 text-primary/70" /> +216 99 487 070
              </a>
              <a 
                href="mailto:contact@masterspool.com" 
                className="flex items-center gap-3 text-xs text-slate-400 hover:text-primary transition duration-200"
              >
                <Mail className="w-3.5 h-3.5 text-primary/70" /> Masters8Pool@gmail.com
              </a>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-light">
                <MapPin className="w-3.5 h-3.5 text-primary/70" /> AFH Mrezga , Hammamet
              </div>
            </div>
          </div>

          {/* Column 3: Club Hours & Socials */}
          <div className="md:col-span-4 space-y-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 block mb-2">
                Le Club
              </span>
              <div className="flex items-start gap-2.5 text-xs text-slate-400 font-light">
                <Clock className="w-3.5 h-3.5 text-primary/70 mt-0.5 shrink-0" />
                <span>Ouvert 7j/7 de 14:00 à 02:00 <br /> <span className="text-[10px] text-slate-600">Late Night Sessions</span></span>
              </div>
            </div>

            {/* Custom SVG Social Links (Bypasses TypeScript Export Error) */}
            <div className="flex gap-3 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#0A0D10] border border-slate-900 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#0A0D10] border border-slate-900 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.71.054 1.14.051 1.96.23 2.53.45a4.58 4.58 0 011.67 1.09 4.58 4.58 0 011.09 1.67c.22.57.4 1.39.45 2.53.04.925.05 1.28.05 3.71v.172c0 2.43-.01 2.784-.054 3.71-.051 1.14-.23 1.96-.45 2.53a4.604 4.604 0 01-1.09 1.67 4.58 4.58 0 01-1.67 1.09c-.57.22-1.39.4-2.53.45-.925.04-1.28.05-3.71.05h-.172c-2.43 0-2.784-.01-3.71-.054-1.14-.051-1.96-.23-2.53-.45a4.58 4.58 0 01-1.67-1.09 4.556 4.556 0 01-1.09-1.67c-.22-.57-.4-1.39-.45-2.53-.04-.925-.05-1.28-.05-3.71v-.172c0-2.43.01-2.784.054-3.71.051-1.14.23-1.96.45-2.53a4.604 4.604 0 011.09-1.67 4.58 4.58 0 011.67-1.09c.57-.22 1.39-.4 2.53-.45.925-.04 1.28-.05 3.71-.05h.172zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8.333a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.333-8.666a.833.833 0 100-1.666.833.833 0 000 1.666z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-8 border-t border-slate-950 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-600">
            © {new Date().getFullYear()} Masters Pool. Tous droits réservés.
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-light">
            Developed by Dridi Dali
          </span>
        </div>

      </div>
    </footer>
  );
}