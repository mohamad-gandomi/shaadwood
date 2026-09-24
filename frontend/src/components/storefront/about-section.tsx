'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-zen-50 border-b border-border/60 scroll-mt-24">
      <div id="craft" className="scroll-mt-24" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Workshop Image Column (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-zen-100 border border-border/60 shadow-sm aspect-[4/3]">
              <img
                src="/images/material-craft-wood.webp"
                alt="Shaadwood artisan workshop bench with timber swatches and hand tools"
                onError={(e) => {
                  e.currentTarget.src = '/images/hero-bedroom-zen.webp';
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-xs text-xs">
                <span className="font-semibold text-shaad-900 font-serif">Shaadwood Workshop</span>
                <span className="text-muted-foreground text-[11px] ml-2 font-mono">Portland, Oregon</span>
              </div>
            </div>
          </div>

          {/* Text & Philosophy Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-shaad-800">
                Artisanal Heritage
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-serif leading-tight">
                Crafted by Hand, Built for Generations
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed max-w-xl">
              At Shaadwood, every piece begins with hand-selected planks of certified American black walnut and European white oak. Guided by traditional mortise-and-tenon joinery and finished with zero-VOC organic plant oils, we build quiet, enduring furniture that grows richer with every passing year.
            </p>

            {/* Core Craft Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-shaad-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-xs text-foreground font-serif">100% Solid Timber</h3>
                  <p className="text-[11px] text-muted-foreground">Zero veneers or plywood</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-shaad-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-xs text-foreground font-serif">Heirloom Joinery</h3>
                  <p className="text-[11px] text-muted-foreground">Traditional tenon joints</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-shaad-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-xs text-foreground font-serif">Organic Finishes</h3>
                  <p className="text-[11px] text-muted-foreground">Cold-pressed plant oils</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link href="#about">
                <Button
                  variant="outline"
                  className="rounded-full border-border/80 bg-white hover:bg-zen-100 text-foreground text-xs sm:text-sm font-medium tracking-wide gap-2 shadow-2xs"
                >
                  <span>Our Studio Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
