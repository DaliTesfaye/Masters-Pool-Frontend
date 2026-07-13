"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useShop } from "@/context/shop-context";

// Full Catalog Database lookup mock
const catalogDatabase = [
  {
    id: "1",
    name: "Queue de Billard Carbon Pro",
    category: "Queues & Flèches",
    price: "420 DT",
    tag: "Premium",
    image: "/prod1.jpeg",
    description: "Conçue pour une stabilité absolue et une déflexion ultra-basse. La flèche en fibre de carbone offre une régularité inégalée coup après coup, éliminant les variations dues aux changements de température ou d'humidité.",
    specs: ["Matériau : Fibre de Carbon High-Grade", "Jonction : Uni-Loc Quick Release", "Procédé : Kamui Noir Medium (12.5mm)", "Poids réajustable : 19oz à 21oz"]
  },
  {
    id: "2",
    name: "Gant Masters Black Edition",
    category: "Accessoires",
    price: "45 DT",
    tag: "Top Vente",
    image: "/prod2.jpeg",
    description: "Le gant Masters offre une surface lisse à friction ultra-basse pour un contrôle optimal du pont de flèche. Tissu respirant à double sens Lycra offrant un ajustement extensible parfait.",
    specs: ["Main : Gauche (Pour joueur droitier)", "Matériau : Lycra Premium respirant", "Fermeture : Velcro ajustable poignet", "Grip : Anti-dérapant paume intégrale"]
  },
  {
    id: "3",
    name: "Mallette de Transport Rigide",
    category: "Stockage",
    price: "180 DT",
    tag: "Nouveau",
    image: "/prod3.jpeg",
    description: "Protection blindée pour vos précieuses flèches et fûts. Coque extérieure en ABS étanche doublée d'un intérieur en mousse de velours moulée sous pression anti-choc.",
    specs: ["Capacité : 2 Fûts / 4 Flèches", "Structure : ABS Rigide Anti-Choc", "Sécurité : Double serrure à combinaison", "Lentille d'évacuation d'humidité"]
  },
  {
    id: "4",
    name: "Procédé Kamui Original (M)",
    category: "Maintenance",
    price: "65 DT",
    tag: "Essentiel",
    image: "/prod4.jpeg",
    description: "Composé à 100% de cuir de porc stratifié en couches sélectionnées. Offre une porosité maximale pour une adhérence parfaite de la craie et réduit considérablement les risques de fausse queue.",
    specs: ["Dureté : Medium (M)", "Diamètre : 14mm (A retailler)", "Structure : 9 couches de cuir laminé", "Origine : Fabriqué au Japon"]
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const { addToCart, setCartOpen } = useShop();

  // Find target product matching URL parameter index id
  const product = catalogDatabase.find((p) => p.id === productId) || catalogDatabase[0];

  const handleAddToCart = () => {
    // Convert string ID to number to mirror context tracking safely
    addToCart({
      id: Number(product.id),
      name: product.name,
      category: product.category,
      price: product.price,
      tag: product.tag,
      image: product.image
    });
    // Automatically slide drawer open for direct interaction verification
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-28 pb-24 px-6 md:px-12 relative">
      
      {/* Dynamic ambient halo background decoration */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-137.5 h-137.5 bg-emerald-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">
        
        {/* Back Link Breadcrumb Header */}
        <Link 
          href="/produits" 
          className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-slate-500 hover:text-primary transition duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Retour au Pro-Shop
        </Link>

        {/* 2-Column Split Presentation Layout Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT INTERACTION LAYOUT: Premium Oversized Image Spotlight Frame (Spans 5 Columns) */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1 rounded-2xl bg-linear-to-b from-emerald-500/10 to-transparent opacity-60 blur-md" />
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#0A0D10] border border-slate-900 flex items-center justify-center p-4">
              <span className="absolute top-4 left-4 z-20 text-[9px] font-bold uppercase tracking-widest bg-black/90 backdrop-blur-md text-primary border border-primary/30 px-2.5 py-1 rounded">
                {product.tag}
              </span>
              <img 
                src={product.image} 
                alt={product.name}
                className="max-h-full max-w-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=600";
                }}
              />
            </div>
          </div>

          {/* RIGHT INTERACTION LAYOUT: High-Contrast Technical Specs Catalog Details (Spans 7 Columns) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Title Identity Hierarchy */}
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 block mb-2">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight">
                {product.name}
              </h1>
              <div className="text-2xl font-black text-primary font-mono mt-4 tracking-tight">
                {product.price}
              </div>
            </div>

            {/* Description Copy Segment Block */}
            <p className="text-slate-400 font-light text-sm md:text-base leading-relaxed max-w-2xl">
              {product.description}
            </p>

            {/* Detailed Spec Bullet Checklist Points Container */}
            <div className="space-y-3 pt-6 border-t border-slate-950">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Spécifications Techniques</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {product.specs.map((spec, i) => (
                  <li key={i} className="text-xs font-light text-slate-500 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary/70" /> {spec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Premium Guarantee Badges Strip Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-950">
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0A0D10]/40 border border-slate-950">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Garantie 100% Officiel</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0A0D10]/40 border border-slate-950">
                <Truck className="w-4 h-4 text-primary shrink-0" />
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Retrait au Club / Livraison</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0A0D10]/40 border border-slate-950">
                <RefreshCw className="w-4 h-4 text-primary shrink-0" />
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Support Expert</span>
              </div>
            </div>

            {/* Call to Actions Bar Controls Footer Panel */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
              <button 
                onClick={handleAddToCart}
                className="w-full sm:w-auto px-8 h-12 bg-primary text-black font-bold uppercase tracking-widest text-xs rounded-lg shadow-neon-green hover:bg-emerald-400 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Ajouter au Panier
              </button>
              
              <Link 
                href="/#contact"
                className="w-full sm:w-auto px-8 h-12 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-bold uppercase tracking-widest text-xs rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                Réserver & Essayer en Salle
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}