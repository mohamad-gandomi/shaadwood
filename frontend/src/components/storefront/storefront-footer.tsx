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
        description: 'You will receive seasonal studio dispatches and private previews.',
      });
      setEmail('');
    }
  };

  return (
    <footer className="bg-zen-100/80 text-foreground pt-14 sm:pt-20 pb-10 border-t border-border/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-10 border-b border-border/60">
          <div className="lg:col-span-6 space-y-2.5">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-shaad-900 block">
              SHAADWOOD
            </span>
            <p className="text-xs sm:text-sm text-muted-foreground font-light max-w-md leading-relaxed">
              Handcrafted in solid walnut, oak, and teak. Heirloom furniture built for generations of slow, deliberate living.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-2.5">
            <h4 className="font-serif font-semibold text-sm sm:text-base text-foreground">
              Join the Collector&apos;s Circle
            </h4>
            <p className="text-xs text-muted-foreground font-light">
              Receive timber harvest dispatches, private studio previews, and interior design essays.
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
              <Button type="submit" className="bg-shaad-800 hover:bg-shaad-900 text-white text-xs px-5 h-10 rounded-xl shrink-0 font-medium">
                {subscribed ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Navigation Columns covering all storefront pages */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-2.5">
            <h5 className="font-semibold uppercase tracking-wider text-[11px] text-shaad-900">Furniture Collections</h5>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/shop" className="hover:text-shaad-800 transition-colors">Full Studio Catalog</Link></li>
              <li><Link href="/shop?categorySlug=living-room" className="hover:text-shaad-800 transition-colors">Living Sofas &amp; Armchairs</Link></li>
              <li><Link href="/shop?categorySlug=dining-room" className="hover:text-shaad-800 transition-colors">Dining Tables &amp; Benches</Link></li>
              <li><Link href="/shop?categorySlug=bedroom" className="hover:text-shaad-800 transition-colors">Bedroom Platform Beds</Link></li>
              <li><Link href="/shop?categorySlug=coffee-tables" className="hover:text-shaad-800 transition-colors">Organic Coffee Tables</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h5 className="font-semibold uppercase tracking-wider text-[11px] text-shaad-900">Artisan Craft &amp; Journal</h5>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/about" className="hover:text-shaad-800 transition-colors">About Our Atelier</Link></li>
              <li><Link href="/about" className="hover:text-shaad-800 transition-colors">Mortise &amp; Tenon Joinery</Link></li>
              <li><Link href="/blog" className="hover:text-shaad-800 transition-colors">Studio Workshop Journal</Link></li>
              <li><Link href="/blog?category=woodcraft-and-design-guides" className="hover:text-shaad-800 transition-colors">Woodcraft &amp; Design Guides</Link></li>
              <li><Link href="/blog?category=timber-care" className="hover:text-shaad-800 transition-colors">Timber Care &amp; Natural Oils</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h5 className="font-semibold uppercase tracking-wider text-[11px] text-shaad-900">Client Concierge</h5>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/account" className="hover:text-shaad-800 transition-colors">My Orders &amp; Profile</Link></li>
              <li><Link href="/auth/otp" className="hover:text-shaad-800 transition-colors">SMS OTP Login / Register</Link></li>
              <li><Link href="/cart" className="hover:text-shaad-800 transition-colors">Shopping Cart</Link></li>
              <li><Link href="/contact" className="hover:text-shaad-800 transition-colors">White-Glove Delivery Info</Link></li>
              <li><Link href="/about" className="hover:text-shaad-800 transition-colors">25-Year Wood Warranty</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h5 className="font-semibold uppercase tracking-wider text-[11px] text-shaad-900">Workshop &amp; Studio</h5>
            <p className="text-muted-foreground leading-relaxed">
              550 NW 13th Avenue<br />
              Portland, Oregon 97209<br />
              concierge@shaadwood.com<br />
              +1 555-0199
            </p>
            <div className="pt-0.5">
              <Link href="/contact" className="inline-flex items-center gap-1.5 text-[11px] text-shaad-800 hover:text-shaad-900 font-semibold">
                <span>Studio Hours &amp; Directions</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Rights & Quick Root Navigation covering all pages */}
        <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Shaadwood Woodcraft Studio Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <Link href="/shop" className="hover:text-shaad-800 transition-colors">Catalog</Link>
            <span>&middot;</span>
            <Link href="/blog" className="hover:text-shaad-800 transition-colors">Journal</Link>
            <span>&middot;</span>
            <Link href="/about" className="hover:text-shaad-800 transition-colors">About Us</Link>
            <span>&middot;</span>
            <Link href="/contact" className="hover:text-shaad-800 transition-colors">Contact</Link>
            <span>&middot;</span>
            <Link href="/account" className="hover:text-shaad-800 transition-colors">Account</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
