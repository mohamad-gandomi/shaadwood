'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EditorialBanners() {
  return (
    <section id="living" className="space-y-16 sm:space-y-24 py-16 sm:py-24 bg-zen-50 border-b border-border/60">
      {/* 1. Full-Width Credenza Atmospheric Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-md group">
          <div className="aspect-[16/9] sm:aspect-[21/9] w-full bg-zen-100">
            <img
              src="http://localhost:4000/uploads/showcase-credenza.webp"
              alt="Handcrafted Walnut Credenza with continuous wood grain"
              onError={(e) => {
                e.currentTarget.src = '/images/showcase-credenza.webp';
              }}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 sm:p-10 lg:p-14">
            <div className="max-w-xl space-y-2 sm:space-y-3 text-white">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-medium text-white/80">
                Continuous Grain Matching
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif">
                The Heritage 6-Drawer Credenza
              </h3>
              <p className="text-xs sm:text-sm text-white/90 font-light leading-relaxed">
                Cut from a single 12-foot slab of certified black walnut so the natural grain flows uninterrupted
                across each hand-fitted drawer face.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Asymmetric Split Duo (Lounge Armchair & Architectural Shelving) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {/* Card A: Lounge Duo */}
          <div className="relative rounded-3xl overflow-hidden shadow-sm group bg-white border border-border/60">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src="http://localhost:4000/uploads/showcase-lounge-duo.webp"
                alt="Dark Ash Lounge Armchair and Solid Timber End Table"
                onError={(e) => {
                  e.currentTarget.src = '/images/showcase-lounge-duo.webp';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="p-6 sm:p-8 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-shaad-800">
                Accent Seating
              </span>
              <h4 className="text-xl sm:text-2xl font-bold font-serif text-foreground">
                Nordic Ash Lounge & Block Timber
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Clean angles paired with soft bouclé wool upholstery, accompanied by our end-grain solid oak block table.
              </p>
            </div>
          </div>

          {/* Card B: Architectural Bookshelf */}
          <div className="relative rounded-3xl overflow-hidden shadow-sm group bg-white border border-border/60">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src="http://localhost:4000/uploads/showcase-bookshelf.webp"
                alt="Floor-to-Ceiling Modular Solid Wood Library Shelving"
                onError={(e) => {
                  e.currentTarget.src = '/images/showcase-bookshelf.webp';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="p-6 sm:p-8 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-shaad-800">
                Modular Storage
              </span>
              <h4 className="text-xl sm:text-2xl font-bold font-serif text-foreground">
                Architectural Grid Library
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Open timber grid system engineered to breathe light into living rooms and room divider spaces.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
