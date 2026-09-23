'use client';

import * as React from 'react';
import { HeroSlider } from '@/components/storefront/hero-slider';
import { TrustBadges } from '@/components/storefront/trust-badges';
import { ProductCarousel } from '@/components/storefront/product-carousel';
import { FeaturedSpotlight } from '@/components/storefront/featured-spotlight';
import { EditorialBanners } from '@/components/storefront/editorial-banners';
import { MaterialStoryGrid } from '@/components/storefront/material-story-grid';

export default function StorefrontHomePage() {
  return (
    <div className="space-y-0">
      {/* 1. Big Atmospheric Hero Slider */}
      <HeroSlider />

      {/* 2. Zen Craftsmanship Pillars */}
      <TrustBadges />

      {/* 3. Live Backend Product Carousel */}
      <ProductCarousel />

      {/* 4. Signature Featured Piece Spotlight */}
      <FeaturedSpotlight />

      {/* 5. Editorial Atmospheric Banners */}
      <EditorialBanners />

      {/* 6. Material, Timber & Workshop Story */}
      <MaterialStoryGrid />
    </div>
  );
}
