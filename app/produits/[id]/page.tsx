"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, RefreshCw, Loader2 } from "lucide-react";
import { useShop } from "@/context/shop-context";
import { createClient } from "@/utils/supabase/client"; // Adjust path if using different client location

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const { addToCart, setCartOpen } = useShop();

  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch product from Supabase dynamically by URL ID
  React.useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (!error && data) {
        setProduct(data);
      }
      setLoading(false);
    }

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image_url,
    });

    setCartOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white pt-28 px-6 text-center">
        <h2 className="text-xl font-bold">Produit non trouvé</h2>
        <Link href="/produits" className="text-primary mt-4 inline-block underline">
          Retour au Pro-Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-28 pb-24 px-6 md:px-12 relative">
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-137.5 h-137.5 bg-emerald-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">
        <Link 
          href="/produits" 
          className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-slate-500 hover:text-primary transition duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Retour au Pro-Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Image */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1 rounded-2xl bg-linear-to-b from-emerald-500/10 to-transparent opacity-60 blur-md" />
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#0A0D10] border border-slate-900 flex items-center justify-center p-4">
              {product.tag && (
                <span className="absolute top-4 left-4 z-20 text-[9px] font-bold uppercase tracking-widest bg-black/90 backdrop-blur-md text-primary border border-primary/30 px-2.5 py-1 rounded">
                  {product.tag}
                </span>
              )}
              <img 
                src={product.image_url} 
                alt={product.name}
                className="max-h-full max-w-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 block mb-2">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight">
                {product.name}
              </h1>
              <div className="text-2xl font-black text-primary font-mono mt-4 tracking-tight">
                {product.price} DT
              </div>
            </div>

            <p className="text-slate-400 font-light text-sm md:text-base leading-relaxed max-w-2xl">
              {product.description}
            </p>

            {product.specs && product.specs.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-slate-950">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Spécifications Techniques</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {product.specs.map((spec: string, i: number) => (
                    <li key={i} className="text-xs font-light text-slate-500 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary/70" /> {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
              <button 
                onClick={handleAddToCart}
                className="w-full sm:w-auto px-8 h-12 bg-primary text-black font-bold uppercase tracking-widest text-xs rounded-lg shadow-neon-green hover:bg-emerald-400 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" /> Ajouter au Panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}