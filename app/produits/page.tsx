"use client";

// app/produits/page.tsx
import * as React from "react";
import Link from "next/link";
import { ShoppingBag, SlidersHorizontal, Eye, Loader2 } from "lucide-react";
import { useShop } from "@/context/shop-context";
import { createClient } from "@/utils/supabase/client";

export default function ProduitsPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState("Tous");
  
  const { addToCart, setCartOpen } = useShop();

  // 1. Fetch real product data from Supabase
  React.useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  // 2. Extract unique categories dynamically from database results
  const categories = React.useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return ["Tous", ...unique];
  }, [products]);

  // 3. Filter products by selected category
  const filteredProducts = products.filter(
    (product) => selectedCategory === "Tous" || product.category === selectedCategory
  );

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image_url || product.image,
      tag: product.tag,
    });
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 px-6 md:px-12 relative">
      
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-150 h-150 bg-emerald-500/3 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Navigation / Header Anchor */}
        <div className="flex flex-col gap-6 border-b border-slate-900 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-primary block mb-2 text-neon-glow">
                Pro-Shop Intégral
              </span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                TOUT LE <span className="text-primary">CATALOGUE</span>
              </h1>
            </div>
            <p className="text-slate-500 text-xs font-light max-w-xs leading-relaxed uppercase">
              Équipez-vous avec le matériel officiel utilisé par les champions de la salle Masters Pool.
            </p>
          </div>
        </div>

        {/* Filter Navigation Tabs Strip */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-950 pb-6">
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-bold tracking-wider mr-4">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filtrer:
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary text-black border-primary shadow-neon-green"
                  : "bg-[#0A0D10] text-slate-400 border-slate-900 hover:text-white hover:border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Results Display Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div 
                key={n} 
                className="h-72 rounded-xl bg-[#0A0D10] border border-slate-900 animate-pulse flex items-center justify-center"
              >
                <Loader2 className="w-5 h-5 text-slate-700 animate-spin" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 border border-slate-900 rounded-xl bg-[#0A0D10]">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-mono">
              Aucun produit trouvé dans cette catégorie.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const imageUrl = product.image_url || product.image || "/placeholder.jpg";
              const formattedPrice = typeof product.price === "number" ? `${product.price} DT` : product.price;

              return (
                <div 
                  key={product.id} 
                  className="group relative flex flex-col justify-between rounded-xl bg-[#0A0D10] border border-slate-900 p-3 transition-all duration-300 hover:border-primary/20 hover:shadow-neon-green"
                >
                  {/* Product Visual Container */}
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black border border-slate-950 flex items-center justify-center">
                    {product.tag && (
                      <span className="absolute top-3 left-3 z-20 text-[9px] font-bold uppercase tracking-widest bg-black/80 backdrop-blur-md text-primary border border-primary/30 px-2 py-1 rounded">
                        {product.tag}
                      </span>
                    )}
                    <img 
                      src={imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-80"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=400";
                      }}
                    />
                  </div>

                  {/* Text & Meta Details Info */}
                  <div className="mt-4 px-1 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                      {product.category}
                    </span>
                    
                    <Link href={`/produits/${product.id}`}>
                      <h3 className="text-sm font-bold text-white tracking-wide uppercase truncate transition duration-200 hover:text-primary">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex justify-between items-center mt-4 pt-2 border-t border-slate-950">
                      <span className="text-sm font-black text-white font-mono tracking-tight">
                        {formattedPrice}
                      </span>
                      
                      {/* Action group */}
                      <div className="flex items-center gap-1.5">
                        <Link 
                          href={`/produits/${product.id}`}
                          className="text-slate-400 hover:text-primary transition-colors duration-200 p-1.5 hover:bg-slate-950/60 rounded-md"
                          title="Voir le produit"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="text-slate-400 hover:text-primary transition-colors duration-200 p-1.5 hover:bg-slate-950/60 rounded-md cursor-pointer"
                          title="Ajouter au panier"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}