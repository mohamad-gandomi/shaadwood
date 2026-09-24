'use client';

import * as React from 'react';
import { HeroSlider } from '@/components/storefront/hero-slider';
import { ProductCategories } from '@/components/storefront/product-categories';
import { ProductCarousel } from '@/components/storefront/product-carousel';
import { ImageCTA } from '@/components/storefront/image-cta';
import { TrustBadges } from '@/components/storefront/trust-badges';
import { ArticlesSection } from '@/components/storefront/articles-section';
import { AboutSection } from '@/components/storefront/about-section';

export default function StorefrontHomePage() {
  return (
    <div className="space-y-0">
      <HeroSlider />
      <ProductCategories />
      <ProductCarousel />
      <ImageCTA />
      <TrustBadges />
      <ArticlesSection />
      <AboutSection />
    </div>
  );
}
