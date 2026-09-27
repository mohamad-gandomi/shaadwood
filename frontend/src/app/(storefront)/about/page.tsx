import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Compass, ShieldCheck, TreePine, Sparkles, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About Our Atelier & Joinery Philosophy | Shaadwood',
  description:
    'Discover Shaadwood Woodcraft Studio: solid walnut and oak joinery, sustainable timber provenance, and heirloom furniture crafted for generations of slow living.',
  alternates: {
    canonical: 'https://shaadwood.com/about',
  },
  openGraph: {
    title: 'About Shaadwood Woodcraft Studio & Joinery Ethos',
    description:
      'Solid timber joinery, ethical forestry, and Japanese-Scandinavian quiet luxury furniture.',
    url: 'https://shaadwood.com/about',
    siteName: 'Shaadwood Woodcraft Studio',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  mainEntity: {
    '@type': 'Organization',
    name: 'Shaadwood Woodcraft Studio',
    url: 'https://shaadwood.com',
    logo: 'https://shaadwood.com/logo.png',
    description:
      'Artisan studio handcrafting solid wood heirloom furniture using traditional joinery and natural plant-oil finishes.',
    foundingLocation: {
      '@type': 'Place',
      name: 'Portland, Oregon',
    },
    knowsAbout: [
      'Solid Wood Furniture',
      'Mortise and Tenon Joinery',
      'Kiln-Dried Timber',
      'Japanese-Scandinavian Design',
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zen-50 pb-20">
      {/* Structured SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Atelier Masthead */}
      <section className="pt-12 pb-14 sm:pt-20 sm:pb-20 border-b border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-shaad-800 font-semibold block">
            Provenance &amp; Craft Ethos
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-foreground tracking-tight leading-[1.12]">
            Furniture Built for Generations of Slow, Deliberate Living
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
            Shaadwood was established on a single principle: that honest materials, traditional mortise-and-tenon
            joinery, and restrained proportion create pieces that outlast disposable consumer cycles.
          </p>
        </div>
      </section>

      {/* 2. Visual Atelier Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-zen-200 border border-border/80 shadow-md">
          <img
            src="http://localhost:4000/uploads/showcase-bookshelf.webp"
            alt="Shaadwood Artisan Woodworking Atelier"
            fetchPriority="high"
            loading="eager"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-white max-w-lg space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 font-semibold">
              The Portland Studio
            </span>
            <p className="font-serif text-lg sm:text-2xl font-bold">
              Where Ancient Timber Meets Japanese Restraint
            </p>
          </div>
        </div>
      </section>

      {/* 3. Three Pillars of Craft */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Our Three Uncompromising Pillars
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-light">
            Every dining bench, platform bed, and lounge chair reflects these craftsmanship standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-shaad-100 text-shaad-800 flex items-center justify-center">
              <TreePine className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-foreground">100% Solid Certified Hardwood</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              We never use particle board, MDF cores, or commercial printed veneers. Every piece is precision-milled
              from slow-kiln-dried American Black Walnut, White Oak, or reclaimed teak.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-shaad-100 text-shaad-800 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-foreground">Mortise &amp; Tenon Joinery</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              Wood is alive and expands across seasons. Our interlocking joinery allows organic movement without
              warping, creating rock-solid structural stability that spans decades.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-shaad-100 text-shaad-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-foreground">Non-Toxic Plant Oil Finishes</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              Hand-rubbed organic cold-pressed plant oils and pure beeswax enrich the timber grain, forming a silky,
              breathable surface that patinas gracefully without petrochemical fumes.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Atelier Statistics Bar */}
      <section className="bg-shaad-900 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-wood-100">25 Years</span>
            <p className="text-xs text-wood-200/80 font-mono uppercase tracking-wider">Structural Warranty</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-wood-100">Zero</span>
            <p className="text-xs text-wood-200/80 font-mono uppercase tracking-wider">Plastic or MDF</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-wood-100">100%</span>
            <p className="text-xs text-wood-200/80 font-mono uppercase tracking-wider">Kiln-Dried Timber</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-wood-100">Handmade</span>
            <p className="text-xs text-wood-200/80 font-mono uppercase tracking-wider">In Our Studio</p>
          </div>
        </div>
      </section>

      {/* 5. Direct Action Call */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 text-center space-y-6">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
          Ready to Commission an Heirloom for Your Space?
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed font-light">
          Browse our curated catalog of solid wood furniture or reach out to our craftsmen to discuss custom
          dimensions and timber finishes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild className="h-11 px-7 rounded-xl bg-shaad-800 hover:bg-shaad-900 text-white text-xs font-semibold">
            <Link href="/shop" className="flex items-center gap-2">
              <span>Explore Studio Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-11 px-7 rounded-xl border-border/80 bg-white hover:bg-zen-100 text-xs font-semibold">
            <Link href="/contact" className="flex items-center gap-2">
              <span>Workshop &amp; Concierge Info</span>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
