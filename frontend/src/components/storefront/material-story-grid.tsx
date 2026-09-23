'use client';

import * as React from 'react';
import { Compass, Hammer, TreePine, Droplets } from 'lucide-react';

const STORIES = [
  {
    icon: TreePine,
    title: 'Certified Hardwoods',
    tagline: 'Responsibly Harvested Timber',
    description: 'We source only kiln-dried American black walnut and European white oak from regenerative forests.',
  },
  {
    icon: Hammer,
    title: 'Precision Joinery',
    tagline: 'Built Without Nails or Glue Failures',
    description: 'Centuries-old mortise, tenon, and finger joints allow natural timber movement through the seasons.',
  },
  {
    icon: Compass,
    title: 'Proportion & Balance',
    tagline: 'Japandi Architectural Design',
    description: 'Rooted in the calm simplicity of Japanese joinery and the organic warmth of Scandinavian modernism.',
  },
  {
    icon: Droplets,
    title: 'Organic Plant Oils',
    tagline: 'Zero VOC & Breathable Finish',
    description: 'Hand-buffed with cold-pressed natural linseed oils and organic beeswax for a silky, non-toxic touch.',
  },
];

export function MaterialStoryGrid() {
  return (
    <section id="craft" className="py-20 sm:py-28 bg-white border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-shaad-800">
            Artisanal Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground font-serif">
            Made by Hand, Kept for Life
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
            In our Portland workshop, every plank is inspected for structural stability, grain direction, and character before shaping.
          </p>
        </div>

        {/* Feature Visual with Workbench Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-sm border border-border/60 bg-zen-100">
          <div className="aspect-[16/9] sm:aspect-[21/9] w-full">
            <img
              src="http://localhost:4000/uploads/material-craft-wood.webp"
              alt="Shaadwood craftsman workbench showing solid wood samples and hand tools"
              onError={(e) => {
                e.currentTarget.src = '/images/material-craft-wood.webp';
              }}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-white/50 text-xs shadow-xs">
            <span className="font-semibold text-shaad-900 font-serif">Shaadwood Workshop</span>
            <span className="text-muted-foreground text-[11px] ml-2">Workbench & Grain Swatches</span>
          </div>
        </div>

        {/* 4 Story Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-4">
          {STORIES.map((story) => {
            const Icon = story.icon;
            return (
              <div
                key={story.title}
                className="p-6 rounded-2xl bg-zen-50 border border-border/60 space-y-3 hover:border-shaad-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-shaad-50 text-shaad-800 border border-shaad-200/60 flex items-center justify-center">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-foreground font-serif">{story.title}</h3>
                  <div className="text-[11px] font-mono text-shaad-800">{story.tagline}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  {story.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
