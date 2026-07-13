// app/sections/about.tsx
import { Target, ShieldCheck, Zap } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="relative min-h-screen w-full bg-[#000000] py-24 px-6 md:px-12 flex items-center border-t border-slate-900">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-150 h-150 bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* LEFT SIDE: The Visual Anchor (Asymmetric Framing) */}
        <div className="lg:col-span-5 relative group hidden md:block">
          {/* Neon background frame element */}
          <div className="absolute -inset-2 rounded-2xl bg-linear-to-br from-emerald-500/20 to-transparent opacity-70 blur-lg transition duration-500 group-hover:opacity-100" />
          
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0A0D10] h-137.5">
            <img 
              src="/about.jpeg" 
              alt="Masters Pool Atmosphere" 
              className="w-full h-full object-cover opacity-40 contrast-125 transition duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-60"
            />
            
            {/* Massive Abstract Floating Number Overlay */}
            <div className="absolute bottom-6 right-6 text-9xl font-black tracking-tighter text-white/5 select-none font-sans transition duration-500 group-hover:text-primary/10 text-neon-glow">
              8
            </div>

            {/* Floating Live Badge */}
            <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md border border-emerald-500/30 px-4 py-2 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Lounge Ambiance
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: The High-Contrast Minimalist Copy */}
        <div className="lg:col-span-7 space-y-10">
          
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-primary block mb-3 text-neon-glow">
              L'Esprit du Club
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
              LA PRÉCISION EST <br />
              NOTRE <span className="text-primary">SEULE RÈGLE</span>.
            </h2>
          </div>

          <div className="space-y-6 max-w-xl text-slate-300 font-light text-base md:text-lg leading-relaxed">
            <p>
              Oubliez les salles de billard sombres et mal entretenues. **Masters Pool** réinvente l'expérience. Nous avons conçu un espace épuré où le design moderne rencontre l'exigence technique des vrais joueurs.
            </p>
            <p className="text-slate-500 text-sm md:text-base border-l-2 border-primary/30 pl-4 italic">
              "Ici, on ne vient pas simplement passer le temps, on vient chercher la trajectoire parfaite, celle du Break Feeling."
            </p>
          </div>

          {/* Clean Row Features (No cards, pure typographic blocks) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-6 border-t border-slate-900">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-sm">
                <Target className="w-4 h-4 text-primary" /> Matériel Pro
              </div>
              <p className="text-xs text-slate-500 leading-normal">Draps de compétition tendus à la perfection.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-sm">
                <Zap className="w-4 h-4 text-primary" /> Luminosité
              </div>
              <p className="text-xs text-slate-500 leading-normal">Éclairage LED direct sur table sans ombres portées.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-sm">
                <ShieldCheck className="w-4 h-4 text-primary" /> Pro-Shop
              </div>
              <p className="text-xs text-slate-500 leading-normal">Boutique dédiée aux accessoires de pointe.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}