'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function StorefrontFooter() {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      toast.success('Welcome to the Shaadwood Collector Circle', {
        description: 'You will receive seasonal studio dispatches and private collection previews.',
      });
      setEmail('');
    }
  };

  return (
    <footer className="bg-zen-100/80 text-foreground pt-16 sm:pt-24 pb-12 border-t border-border/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-14 border-b border-border/60">
          <div className="lg:col-span-6 space-y-3">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-shaad-900 block">
              SHAADWOOD
            </span>
            <p className="text-xs sm:text-sm text-muted-foreground font-light max-w-md leading-relaxed">
              Handcrafted in solid walnut, oak, and teak. We build heirloom furniture designed for generations of slow,
              deliberate living.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <h4 className="font-serif font-semibold text-sm sm:text-base text-foreground">
              Join the Collector&apos;s Circle
            </h4>
            <p className="text-xs text-muted-foreground font-light">
              Receive seasonal timber harvest dispatches, private studio previews, and interior design essays.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="bg-white border-border/80 text-xs h-10 rounded-xl focus-visible:ring-shaad-800"
              />
              <Button
                type="submit"
                className="bg-shaad-800 hover:bg-shaad-900 text-white text-xs px-5 h-10 rounded-xl shrink-0 font-medium"
              >
                {subscribed ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <h5 className="font-semibold uppercase tracking-wider text-[11px] text-shaad-900 font-sans">
              Furniture Collections
            </h5>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/shop?categorySlug=bedroom" className="hover:text-shaad-800 transition-colors">
                  Bedroom Platform Beds
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=living-room" className="hover:text-shaad-800 transition-colors">
                  Living Sofas & Armchairs
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=coffee-tables" className="hover:text-shaad-800 transition-colors">
                  Organic Coffee Tables
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=dining-room" className="hover:text-shaad-800 transition-colors">
                  Dining Tables & Benches
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-shaad-800 transition-colors">
                  Full Studio Catalog
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold uppercase tracking-wider text-[11px] text-shaad-900 font-sans">
              Artisan Craft
            </h5>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="#craft" className="hover:text-shaad-800 transition-colors">
                  Hardwood Sourcing
                </Link>
              </li>
              <li>
                <Link href="#craft" className="hover:text-shaad-800 transition-colors">
                  Mortise & Tenon Joinery
                </Link>
              </li>
              <li>
                <Link href="/attributes" className="hover:text-shaad-800 transition-colors">
                  Wood Swatches & Finishes
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-shaad-800 transition-colors">
                  Studio Workshop Journal
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold uppercase tracking-wider text-[11px] text-shaad-900 font-sans">
              Customer Care
            </h5>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <span className="text-muted-foreground">White-Glove Delivery Info</span>
              </li>
              <li>
                <span className="text-muted-foreground">25-Year Solid Wood Warranty</span>
              </li>
              <li>
                <span className="text-muted-foreground">Solid Wood Care & Oiling</span>
              </li>
              <li>
                <span className="text-muted-foreground">Custom Commission Inquiries</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold uppercase tracking-wider text-[11px] text-shaad-900 font-sans">
              Workshop Studio
            </h5>
            <p className="text-muted-foreground leading-relaxed">
              550 NW 13th Avenue<br />
              Portland, Oregon 97209<br />
              concierge@shaadwood.com<br />
              +1 555-0199
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-[11px] text-shaad-800 hover:text-shaad-900 font-medium"
              >
                <span>Admin Operations Portal</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>© {new Date().getFullYear()} Shaadwood Woodcraft Studio Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Iranian Shaparak (Zarinpal) & Cards Supported</span>
            <span>•</span>
            <span>Zero Plastic Packaging</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
