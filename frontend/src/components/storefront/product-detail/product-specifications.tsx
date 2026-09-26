'use client';

import * as React from 'react';
import { TreePine, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product } from '@/types';

interface ProductSpecificationsProps {
  product: Product;
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  // Combine default fields (dimensions & weight) with dynamic repeater specifications
  const specsList = React.useMemo(() => {
    const list: Array<{ label: string; value: string }> = [];

    // 1. Always prioritize Dimensions from default product field
    if (product.dimensions) {
      list.push({ label: 'Craft Dimensions', value: product.dimensions });
    }

    // 2. Always prioritize Net Weight from default product field
    if (product.weight) {
      list.push({ label: 'Net Weight', value: `${product.weight} kg` });
    }

    // 3. Custom specifications from repeater (skip duplicate dimensions/weight)
    if (product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0) {
      for (const item of product.specifications) {
        if (!item || !item.label || !item.value) continue;
        const isDim = /dimension/i.test(item.label);
        const isWeight = /weight/i.test(item.label);

        // If product has default dimensions, avoid duplicate dimensions row
        if (isDim && product.dimensions) continue;

        // If product has default weight, avoid duplicate weight row
        if (isWeight && product.weight) continue;

        list.push(item);
      }
      return list;
    }

    // 4. Fallback default specs if no custom repeater specs are configured
    list.push(
      { label: 'Timber Specie', value: 'Certified Sustainably Harvested Hardwood (Oak / Walnut / Ash)' },
      { label: 'Joinery Technique', value: 'Traditional Mortise & Tenon with Dowel Reinforcements' },
      { label: 'Surface Treatment', value: 'Hand-Rubbed Organic Linseed & Beeswax Matte Oil' },
      { label: 'Hardware', value: 'Solid Antiqued Cast Brass, Concealed Soft-Close Hinges' },
      { label: 'Environmental Standard', value: 'Zero VOC, Non-Toxic Natural Sealants & Dyes' },
      { label: 'Warranty & Care', value: '10-Year Master Craftsman Structural Warranty' }
    );

    return list;
  }, [product.specifications, product.dimensions, product.weight]);

  return (
    <section className="pt-16 pb-6 border-t border-border/70">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-shaad-800 text-xs font-semibold uppercase tracking-widest mb-1.5">
              <TreePine className="w-3.5 h-3.5" />
              <span>Artisanal Specifications</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              Meticulous Craftsmanship & Materiality
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-light max-w-sm">
            Each piece is individually registered with its timber provenance and master craftsman hallmark.
          </p>
        </div>

        {/* Dynamic Specifications Repeater Table / Grid */}
        <div className="bg-white rounded-3xl border border-border/70 overflow-hidden shadow-2xs">
          <div className="divide-y divide-border/60">
            {specsList.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-5 hover:bg-zen-50/60 transition-colors gap-2 sm:gap-4 items-baseline"
              >
                <div className="md:col-span-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-shaad-700 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <div className="md:col-span-8 text-xs sm:text-sm font-medium text-foreground">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Woodworking Standards Box */}
        <div className="bg-shaad-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-shaad-300 text-xs uppercase tracking-widest font-semibold">
            <Sparkles className="w-4 h-4 text-shaad-400" />
            <span>The Shaadwood Architectural Standard</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug">
            Living Wood Finished to Breathe with Your Space
          </h3>
          <p className="text-xs sm:text-sm text-zen-200/90 font-light leading-relaxed max-w-3xl">
            We reject high-gloss synthetic plastic polyurethanes that smother natural grain. Our
            master woodworkers treat every timber surface with non-toxic, micro-porous natural oils
            formulated from flaxseed and carnauba wax. This allows the living grain to respond
            harmoniously to atmospheric changes and cultivate an extraordinary, rich patina over generations.
          </p>
        </div>
      </div>
    </section>
  );
}
