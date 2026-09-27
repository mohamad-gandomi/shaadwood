import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Contact Concierge & Studio Location | Shaadwood',
  description:
    'Connect with Shaadwood Woodcraft Studio. Workshop address in Portland Oregon, concierge phone lines, appointment hours, and trade commission inquiries.',
  alternates: {
    canonical: 'https://shaadwood.com/contact',
  },
  openGraph: {
    title: 'Contact Shaadwood Woodcraft Studio & Workshop',
    description:
      'Direct workshop phone lines, studio location, and concierge hours for bespoke solid wood furniture.',
    url: 'https://shaadwood.com/contact',
    siteName: 'Shaadwood Woodcraft Studio',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FurnitureStore',
  name: 'Shaadwood Woodcraft Studio',
  image: 'http://localhost:4000/uploads/showcase-bookshelf.webp',
  telephone: '+1-555-0199',
  email: 'concierge@shaadwood.com',
  url: 'https://shaadwood.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '550 NW 13th Avenue',
    addressLocality: 'Portland',
    addressRegion: 'OR',
    postalCode: '97209',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 45.5262,
    longitude: -122.6853,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00',
      closes: '17:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '11:00',
      closes: '16:00',
    },
  ],
  priceRange: '$$$$',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zen-50 pb-20">
      {/* Structured SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Header */}
      <section className="pt-12 pb-14 sm:pt-20 sm:pb-18 border-b border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-shaad-800 font-semibold block">
            Studio Concierge &amp; Workshop
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight leading-[1.15]">
            Direct Lines to Our Woodcraft Guild
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-xl mx-auto">
            Whether inquiring about timber swatches, bespoke dimensions, or white-glove freight delivery, our
            concierge and woodworkers are at your disposal.
          </p>
        </div>
      </section>

      {/* 2. Information Cards Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: Physical Workshop Location */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-shaad-100 text-shaad-800 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="font-serif font-bold text-xl text-foreground">Workshop &amp; Studio Showroom</h2>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                Our active woodcraft workshop and finished furniture gallery are situated in the heart of the Pearl District.
              </p>
              <div className="p-4 rounded-2xl bg-zen-50 border border-border/70 font-mono text-xs space-y-1 text-foreground">
                <p className="font-semibold">Shaadwood Woodcraft Studio</p>
                <p className="text-muted-foreground">550 NW 13th Avenue</p>
                <p className="text-muted-foreground">Portland, Oregon 97209</p>
                <p className="text-[11px] text-shaad-800 pt-1 font-sans">Ground-level accessible &middot; Street parking available</p>
              </div>
            </div>
          </div>

          {/* Card 2: Direct Telephones */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-shaad-100 text-shaad-800 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h2 className="font-serif font-bold text-xl text-foreground">Direct Telephone Inquiries</h2>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                Speak directly with our client concierge or woodcraft production supervisors during studio hours.
              </p>
              <div className="space-y-2 pt-1">
                <div className="p-3.5 rounded-2xl bg-zen-50 border border-border/70 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-mono uppercase tracking-wider">Client Concierge</span>
                    <a href="tel:+15550199" className="font-mono text-sm font-semibold text-shaad-900 hover:underline">
                      +1 (555) 0199
                    </a>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Primary
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-zen-50 border border-border/70 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-mono uppercase tracking-wider">Artisan Workshop Desk</span>
                    <a href="tel:+15550142" className="font-mono text-sm font-semibold text-shaad-900 hover:underline">
                      +1 (555) 0142
                    </a>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zen-100 text-muted-foreground border border-border/70">
                    Production
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Direct Email Correspondence */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-shaad-100 text-shaad-800 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="font-serif font-bold text-xl text-foreground">Electronic Correspondence</h2>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                Send us blueprints, architectural inquiries, or bespoke commission requests. We reply within 24 business hours.
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-zen-50 border border-border/60 flex items-center justify-between">
                  <span className="text-muted-foreground">General Concierge:</span>
                  <a href="mailto:concierge@shaadwood.com" className="font-mono text-shaad-800 font-medium hover:underline">
                    concierge@shaadwood.com
                  </a>
                </div>
                <div className="p-3 rounded-xl bg-zen-50 border border-border/60 flex items-center justify-between">
                  <span className="text-muted-foreground">Custom Commissions:</span>
                  <a href="mailto:commissions@shaadwood.com" className="font-mono text-shaad-800 font-medium hover:underline">
                    commissions@shaadwood.com
                  </a>
                </div>
                <div className="p-3 rounded-xl bg-zen-50 border border-border/60 flex items-center justify-between">
                  <span className="text-muted-foreground">Trade &amp; Architecture:</span>
                  <a href="mailto:trade@shaadwood.com" className="font-mono text-shaad-800 font-medium hover:underline">
                    trade@shaadwood.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Hours & Private Viewing */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-shaad-100 text-shaad-800 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="font-serif font-bold text-xl text-foreground">Visiting &amp; Consultation Hours</h2>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                Visitors are welcome to touch natural grain swatches and inspect our joinery in person.
              </p>
              <div className="space-y-2 pt-1 font-mono text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Tuesday &ndash; Friday</span>
                  <span className="text-foreground font-semibold">10:00 AM &ndash; 5:00 PM PST</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="text-foreground font-semibold">11:00 AM &ndash; 4:00 PM PST</span>
                </div>
                <div className="flex items-center justify-between py-1.5 text-muted-foreground">
                  <span>Sunday &amp; Monday</span>
                  <span className="italic">Closed for Timber Curing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. White Glove Delivery Commitment */}
        <div className="p-6 sm:p-8 rounded-3xl bg-shaad-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-base sm:text-lg">Nationwide White-Glove Direct Dispatch</h3>
              <p className="text-xs text-wood-200/80 font-light max-w-xl">
                Every piece is secured in sustainable zero-plastic wooden crates, dispatched via dedicated furniture freight,
                and assembled inside your room of choice.
              </p>
            </div>
          </div>

          <Button asChild className="bg-white text-shaad-900 hover:bg-zen-100 font-semibold text-xs px-6 h-10 shrink-0">
            <Link href="/shop" className="flex items-center gap-2">
              <span>View Collections</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
