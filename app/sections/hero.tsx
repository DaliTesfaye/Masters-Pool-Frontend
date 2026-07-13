"use client";

import * as React from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// Mock local room images - Replace these with paths to your actual venue photos
const localImages = [
  { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8ZrVryoITsWpSlcyrqClpcGLEkTzgjh0ALn0UnxzhFkAjrYz5_J0Haus&s=10", alt: "Salle Billard Tables" },
  { src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1600", alt: "Lounge Ambiance" },
];

export default function HeroSection() {
  // Configures the slider to jump images every 3000ms (3 seconds)
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <section id="home" className="relative h-[90vh] w-full overflow-hidden bg-black">
      
      {/* 1. Background Image Slider */}
      <div className="absolute inset-0 z-0">
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-full"
          opts={{
            loop: true,
            duration: 40, // Controls the transition sliding speed
          }}
        >
          <CarouselContent className="h-[90vh] ml-0">
            {localImages.map((img, index) => (
              <CarouselItem key={index} className="pl-0 h-full w-full relative">
                {/* Dark Vignette Overlay over each image for high text contrast */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-black/40 z-10" />
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover select-none"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* 2. Foreground Content Overlay */}
      <div className="relative z-20 h-full max-w-5xl mx-auto px-6 flex flex-col justify-center items-center text-center">
        
        <span className="text-xs font-bold uppercase tracking-[0.4em] text-primary mb-4 block text-neon-glow">
          Masters Pool Lounge
        </span>

        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase text-white leading-none">
          Jouer Comme <br />
          <span className="text-primary text-neon-glow">Un Master</span>
        </h1>

        <p className="mt-6 text-sm sm:text-base text-slate-300 max-w-lg font-light leading-relaxed">
          Plongez dans l'ambiance exclusive de notre salle. Des tables de qualité tournoi et des accessoires de précision attendent votre meilleur coup.
        </p>

        {/* Action Buttons using shadcn primitives */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Button size="lg" className="font-bold tracking-wide bg-primary text-black hover:bg-primary/90 shadow-neon-green transition-all duration-300 px-8 py-6">
            <Link href="#reservation">Jouer</Link>
          </Button>
          
          <Button variant="outline" size="lg" className="font-semibold tracking-wide border-slate-800 text-slate-200 hover:text-primary hover:border-primary/50 bg-black/40 backdrop-blur-sm px-8 py-6">
            <Link href="#produits">Nos Produits</Link>
          </Button>
        </div>

      </div>

      {/* Bottom decorative ambient blur */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-linear-to-t from-black to-transparent z-20 pointer-events-none" />
    </section>
  );
}