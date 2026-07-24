"use client";

import * as React from "react";
import { User, Phone, MapPin, Mail, Calendar, Shield, Save, Edit2, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProfile } from "@/app/actions/profile";

interface ProfileFormProps {
  initialProfile: {
    full_name?: string | null;
    phone_number?: string | null;
    address?: string | null;
  } | null;
  userEmail: string;
  signupDate: string;
}

export default function ProfileForm({ initialProfile, userEmail, signupDate }: ProfileFormProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  
  const [fullName, setFullName] = React.useState(initialProfile?.full_name || "");
  const [phone, setPhone] = React.useState(initialProfile?.phone_number || "");
  const [address, setAddress] = React.useState(initialProfile?.address || "");
  
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync state if initialProfile changes
  React.useEffect(() => {
    setFullName(initialProfile?.full_name || "");
    setPhone(initialProfile?.phone_number || "");
    setAddress(initialProfile?.address || "");
  }, [initialProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await updateProfile({
      fullName,
      phone,
      address,
    });

    setLoading(false);
    if (res.success) {
      setMessage({ type: "success", text: res.message || "Profil mis à jour." });
      setIsEditing(false); // Close edit mode on success
    } else {
      setMessage({ type: "error", text: res.error || "Erreur lors de la mise à jour." });
    }
  };

  const handleCancel = () => {
    // Reset values to initial props
    setFullName(initialProfile?.full_name || "");
    setPhone(initialProfile?.phone_number || "");
    setAddress(initialProfile?.address || "");
    setIsEditing(false);
    setMessage(null);
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        
        {message && (
          <div className="p-4 rounded-xl border text-xs flex items-center gap-2.5 bg-emerald-500/10 border-emerald-500/20 text-emerald-400 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/40 p-6 rounded-xl border border-slate-900/60">
          
          {/* Nom Complet */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-600" /> Nom Complet
            </span>
            <p className="text-sm font-medium text-slate-200">{fullName || "Non renseigné"}</p>
          </div>

          {/* Numéro de Téléphone */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-600" /> Téléphone
            </span>
            <p className="text-sm font-medium text-slate-200">{phone || "Non renseigné"}</p>
          </div>

          {/* Adresse E-mail */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-600" /> E-mail
            </span>
            <p className="text-sm font-medium text-slate-200">{userEmail}</p>
          </div>

          {/* Membre Depuis */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-600" /> Membre Depuis
            </span>
            <p className="text-sm font-medium text-slate-200">{signupDate}</p>
          </div>

          {/* Adresse complète */}
          <div className="space-y-1 md:col-span-2 pt-4 border-t border-slate-900/40">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-600" /> Adresse de livraison
            </span>
            <p className="text-sm font-medium text-slate-300 leading-relaxed whitespace-pre-line">
              {address || "Aucune adresse enregistrée pour le moment."}
            </p>
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto px-6 h-11 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/30 text-cyan-400 font-bold uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Edit2 className="w-4 h-4" /> Modifier le profil
          </button>
        </div>

      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {message && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 animate-in fade-in duration-200 ${
          message.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/20 p-6 rounded-xl border border-slate-900/40">
        
        {/* Nom Complet */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-500" /> Nom Complet
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ex: Mohamed Ben Ali"
            className="w-full h-11 px-4 rounded-xl bg-black border border-slate-900 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium"
          />
        </div>

        {/* Numéro de Téléphone */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-500" /> Téléphone
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ex: +216 99 999 999"
            className="w-full h-11 px-4 rounded-xl bg-black border border-slate-900 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium"
          />
        </div>

        {/* Adresse E-mail (Disabled/Read-only) */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-600" /> E-mail (Non modifiable)
          </label>
          <div className="relative">
            <input
              type="email"
              disabled
              value={userEmail}
              className="w-full h-11 px-4 rounded-xl bg-[#07090C] border border-slate-950 text-sm text-slate-500 font-medium cursor-not-allowed opacity-80"
            />
            <Shield className="w-3.5 h-3.5 text-slate-600 absolute right-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Membre Depuis (Disabled/Read-only) */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-600" /> Membre Depuis
          </label>
          <div className="w-full h-11 px-4 rounded-xl bg-[#07090C] border border-slate-950 text-sm text-slate-500 font-medium flex items-center select-none opacity-80">
            {signupDate}
          </div>
        </div>

        {/* Adresse complète */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-500" /> Adresse de livraison complète
          </label>
          <textarea
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Rue, Code postal, Ville, Tunisie (Nécessaire pour l'expédition de vos commandes)"
            className="w-full p-4 rounded-xl bg-black border border-slate-900 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium resize-none leading-relaxed"
          />
        </div>

      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-900/60 flex items-center justify-end gap-4">
        <button
          type="button"
          disabled={loading}
          onClick={handleCancel}
          className="w-full sm:w-auto px-6 h-11 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-slate-400 font-bold uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-4 h-4" /> Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 h-11 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_4px_20px_rgba(16,185,129,0.15)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Enregistrer
            </>
          )}
        </button>
      </div>

    </form>
  );
}
