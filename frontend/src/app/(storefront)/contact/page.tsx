import type { Metadata } from 'next';
import Link from 'next/link';
import { Truck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactCards } from '@/components/storefront/contact/contact-cards';

export const metadata: Metadata = {
  title: 'نشانی کارگاه و راه‌های ارتباطی | استودیو شادوود',
  description:
    'ارتباط مستقیم با کارگاه درودگری و گالری مبلمان دست‌ساز شادوود. تلفن سفارشات، نشانی شوروم، ساعات بازدید و مشاوره تخصصی چوب طبیعی.',
  alternates: {
    canonical: 'https://shaadwood.com/contact',
  },
  openGraph: {
    title: 'ارتباط با استودیو درودگری شادوود و نشانی کارگاه',
    description:
      'خطوط مستقیم ارتباط با استادکاران، نشانی گالری و ساعات مشاوره تخصصی مبلمان چوب طبیعی.',
    url: 'https://shaadwood.com/contact',
    siteName: 'استودیو درودگری شادوود',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FurnitureStore',
  name: 'استودیو درودگری شادوود',
  image: 'http://localhost:4000/uploads/showcase-bookshelf.webp',
  telephone: '+98-21-22334455',
  email: 'info@shaadwood.com',
  url: 'https://shaadwood.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'خیابان صنعت غربی، پلاک ۲۴',
    addressLocality: 'تهران',
    addressRegion: 'تهران',
    postalCode: '1654832199',
    addressCountry: 'IR',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zen-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Header */}
      <section className="pt-12 pb-14 sm:pt-20 sm:pb-18 border-b border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-sans tracking-widest text-shaad-800 font-semibold block">
            میز ارتباط و کارگاه درودگری
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight leading-[1.2]">
            پل‌های ارتباط مستقیم با استادکاران شادوود
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-xl mx-auto">
            چه در خصوص لمس بافت نمونه چوب‌ها، ابعاد سفارشی سازه‌ها یا هماهنگی باربری اختصاصی، درودگران و کارشناسان ما همراه شما هستند.
          </p>
        </div>
      </section>

      {/* 2. Information Cards Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-10">
        <ContactCards />

        {/* 3. White Glove Delivery Commitment */}
        <div className="p-6 sm:p-8 rounded-3xl bg-shaad-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="space-y-1 text-right">
              <h3 className="font-serif font-bold text-base sm:text-lg">ارسال تخصصی و تحویل داخل فضای منزل در سراسر کشور</h3>
              <p className="text-xs text-wood-200/80 font-light max-w-xl">
                تمام سازه‌ها در جعبه‌های چوبی اختصاصی مهاربندی شده، با ناوگان تخصصی مبلمان حمل شده و در فضای دلخواه شما مونتاژ و مستقر می‌گردند.
              </p>
            </div>
          </div>

          <Button asChild className="bg-white text-shaad-900 hover:bg-zen-100 font-semibold text-xs px-6 h-10 shrink-0">
            <Link href="/shop" className="flex items-center gap-2">
              <span>مشاهده آثار</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
