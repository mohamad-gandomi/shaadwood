'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { formatCurrency } from '@/lib/utils';

export function FeaturedSpotlight() {
  const { addItem } = useCart();

  const handleAddFeatured = () => {
    addItem({
      id: 'spotlight-sanctuary-bed',
      productId: 'spotlight-sanctuary-bed',
      name: 'The Shaadwood Minimalist Platform Bed',
      price: 1850,
      image: 'http://localhost:4000/uploads/hero-bedroom-zen.webp',
      finish: 'Solid American Walnut',
    });
  };

  return (
    <section id="bedroom" className="py-20 sm:py-28 bg-white border-b border-border/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16 items-center">
          {/* Left Text & Philosophy (5 cols) */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-shaad-50 text-shaad-800 text-xs font-semibold tracking-wider uppercase border border-shaad-200">
              <Sparkles className="w-3.5 h-3.5 text-shaad-600" />
              <span>Studio Signature Model</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-serif leading-[1.15]">
              Designed for Quiet Rest
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-light">
              Crafted entirely from continuous planks of kiln-dried American black walnut. Zero composite boards,
              zero veneers. Engineered with concealed mortise and tenon joinery that assembles without creaks or
              hardware fatigue.
            </p>

            {/* Spec Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-foreground">
                <CheckCircle2 className="w-4 h-4 text-shaad-700 shrink-0" />
                <span>Hand-rubbed organic plant oil & beeswax matte seal</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-foreground">
                <CheckCircle2 className="w-4 h-4 text-shaad-700 shrink-0" />
                <span>Integrated continuous headboard with gentle 7-degree ergonomic incline</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-foreground">
                <CheckCircle2 className="w-4 h-4 text-shaad-700 shrink-0" />
                <span>Solid timber slat system supporting hybrid & latex organic mattresses</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Button
                size="lg"
                onClick={handleAddFeatured}
                className="bg-shaad-800 hover:bg-shaad-900 text-white font-medium px-6 py-3 text-xs sm:text-sm tracking-wider uppercase gap-2 rounded-full shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Curate for {formatCurrency(1850)}</span>
              </Button>

              <Link href="#craft">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-foreground hover:text-shaad-800 text-xs sm:text-sm gap-1.5 font-medium"
                >
                  <span>Joinery Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image Stage (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden bg-zen-100 border border-border/60 shadow-lg group">
              <img
                src="http://localhost:4000/uploads/hero-bedroom-zen.webp"
                alt="The Shaadwood Minimalist Platform Bed in Solid American Walnut"
                onError={(e) => {
                  e.currentTarget.src = '/images/hero-bedroom-zen.webp';
                }}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-sm text-xs">
                <div className="font-semibold text-foreground font-serif">Shaadwood Platform Bed</div>
                <div className="text-[11px] text-muted-foreground font-mono">Solid American Black Walnut • Queen / King</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
