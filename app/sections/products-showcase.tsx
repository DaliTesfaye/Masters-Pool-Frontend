"use client";
// app/sections/products-showcase.tsx
import { ShoppingBag, Eye } from "lucide-react";
import Link from "next/link";
import { useShop } from "@/context/shop-context";

// Static mock premium products data
const featuredProducts = [
  {
    id: 1,
    name: "Queue de Billard Carbon Pro",
    category: "Queues & Flèches",
    price: "420 DT",
    tag: "Premium",
    image: "/prod1.jpeg" 
  },
  {
    id: 2,
    name: "Gant Masters Black Edition",
    category: "Accessoires",
    price: "45 DT",
    tag: "Top Vente",
    image: "/prod2.jpeg"
  },
  {
    id: 3,
    name: "Mallette de Transport Rigide",
    category: "Stockage",
    price: "180 DT",
    tag: "Nouveau",
    image: "/prod3.jpeg"
  },
  {
    id: 4,
    name: "Procédé Kamui Original (M)",
    category: "Maintenance",
    price: "65 DT",
    tag: "Essentiel",
    image: "/prod4.jpeg"
  }
];

export default function ProductsShowcaseSection() {
  const { addToCart } = useShop();

  return (
    <section id="produits" className="relative py-28 px-6 bg-[#000000] border-t border-slate-900 overflow-hidden">
      
      {/* Background neon accent beam */}
      <div className="absolute bottom-1/4 right-1/4 w-125 h-125 bg-emerald-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        {/* Section Heading Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-primary block mb-3 text-neon-glow">
              Le Pro-Shop
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
              ÉQUIPEMENT DE <br />
              <span className="text-primary">HAUTE PRÉCISION</span>
            </h2>
          </div>
          <p className="text-slate-500 text-xs md:text-sm max-w-xs font-light leading-relaxed">
            Une sélection rigoureuse de matériel approuvé par notre équipe pour faire passer votre jeu au niveau supérieur.
          </p>
        </div>

        {/* Minimalist Product Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div 
              key={product.id} 
              className="group relative flex flex-col justify-between rounded-xl bg-[#0A0D10] border border-slate-900 p-3 transition-all duration-300 hover:border-primary/20 hover:shadow-neon-green"
            >
              
              {/* Product Visual Container */}
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black border border-slate-950 flex items-center justify-center">
                
                {/* Condition Tag Badge */}
                <span className="absolute top-3 left-3 z-20 text-[9px] font-bold uppercase tracking-widest bg-black/80 backdrop-blur-md text-primary border border-primary/30 px-2 py-1 rounded">
                  {product.tag}
                </span>

                {/* Main Product Image */}
                <div className="absolute inset-0 bg-linear-to-b from-slate-900/10 to-black z-10" />
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=400"
                  }}
                />

                {/* Sliding Action Overlay Container with Next.js Link instead of a button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center gap-3">
                  <Link 
                    href={`/produits/${product.id}`}
                    className="h-9 px-4 inline-flex items-center justify-center text-xs font-bold uppercase tracking-wider gap-1.5 rounded-md bg-white text-black hover:bg-slate-200 transition-colors duration-200"
                  >
                    <Eye className="w-3.5 h-3.5" /> Voir Produit
                  </Link>
                </div>

              </div>

              {/* Text & Meta Details Info */}
              <div className="mt-4 px-1 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                  {product.category}
                </span>
                
                {/* Wrap title in a link too so users can click either option */}
                <Link href={`/produits/${product.id}`}>
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase truncate transition duration-200 hover:text-primary">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex justify-between items-center mt-4 pt-2 border-t border-slate-950">
                  <span className="text-sm font-black text-white font-mono tracking-tight">
                    {product.price}
                  </span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="text-slate-400 hover:text-primary transition-colors duration-200 p-1"
                    title="Ajouter au panier"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Catalog Callout */}
        <div className="mt-16 text-center">
          <Link 
            href="/produits" 
            className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-slate-400 border border-slate-800 hover:border-primary/50 hover:text-primary bg-black px-8 py-3.5 rounded-lg transition-all duration-300"
          >
            Voir Tout Le Catalogue
          </Link>
        </div>

      </div>
    </section>
  );
}