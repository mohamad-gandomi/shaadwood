'use client';

import * as React from 'react';
import { TreePine, Sparkles, Truck, HeartHandshake } from 'lucide-react';

const BADGES = [
  {
    icon: TreePine,
    title: '100% Solid Hardwood',
    subtitle: 'Zero veneers, plywood, or particle board',
  },
  {
    icon: Sparkles,
    title: 'Heirloom Joinery',
    subtitle: 'Hand-fitted traditional mortise & tenon',
  },
  {
    icon: Truck,
    title: 'White-Glove Delivery',
    subtitle: 'In-home room placement & assembly included',
  },
  {
    icon: HeartHandshake,
    title: '25-Year Warranty',
    subtitle: 'Direct craftsman support from our studio',
  },
];

export function TrustBadges() {
  return (
    <section className="py-12 sm:py-16 bg-zen-50 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.title} className="flex items-center gap-4 p-4 rounded-xl bg-white/70 border border-border/50">
                <div className="w-12 h-12 rounded-xl bg-shaad-50 text-shaad-800 border border-shaad-200/60 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-foreground font-serif">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {badge.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
