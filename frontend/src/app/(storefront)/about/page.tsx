import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Compass, TreePine, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'درباره کارگاه و فلسفه درودگری | استودیو شادوود',
  description:
    'آشنایی با استودیو شادوود: اتصالات اصیل چوب گردو و بلوط، حفاظت با روغن‌های گیاهی ارگانیک و خلق آثاری ماندگار برای نسل‌ها زیست آرام.',
  alternates: {
    canonical: 'https://shaadwood.com/about',
  },
  openGraph: {
    title: 'درباره استودیو درودگری شادوود و فلسفه ساخت چوب',
    description:
      'اتصالات کام و زبانه، جنگل‌داری پایدار و مبلمان دست‌ساز به سبک مینیمال ژاپنی-اسکاندیناوی.',
    url: 'https://shaadwood.com/about',
    siteName: 'استودیو درودگری شادوود',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  mainEntity: {
    '@type': 'Organization',
    name: 'استودیو درودگری شادوود',
    url: 'https://shaadwood.com',
    logo: 'https://shaadwood.com/logo.png',
    description:
      'کارگاه ساخت مبلمان و دست‌سازه‌های چوب طبیعی با اتصالات کهن کام و زبانه و پوشش روغن گیاهی ارگانیک.',
    knowsAbout: [
      'چوب خالص طبیعی',
      'اتصالات سنتی کام و زبانه',
      'چوب خشک‌شده در کوره صنعتی',
      'طراحی مینیمال و آرام ژاپنی-اسکاندیناوی',
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zen-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Atelier Masthead */}
      <section className="pt-12 pb-14 sm:pt-20 sm:pb-20 border-b border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="text-xs font-sans tracking-widest text-shaad-800 font-semibold block">
            اصالت چوب و فلسفه درودگری
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-foreground tracking-tight leading-[1.2]">
            آثاری خلق‌شده برای نسل‌ها زیست آرام و ماندگار
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
            شادوود بر پایه‌ای استوار بنا شده است: این‌که متریال زنده، اتصالات دیرین کام و زبانه و تناسبات سنجیده،
            آثاری ماندگار می‌آفرینند که فراتر از چرخه‌های مصرف‌گرایی، نسل‌اندرنسل باقی می‌مانند.
          </p>
        </div>
      </section>

      {/* 2. Visual Atelier Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-zen-200 border border-border/80 shadow-md">
          <img
            src="http://localhost:4000/uploads/showcase-bookshelf.webp"
            alt="کارگاه درودگری شادوود"
            fetchPriority="high"
            loading="eager"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 text-white max-w-lg space-y-1">
            <span className="text-[10px] font-sans tracking-widest text-emerald-300 font-semibold">
              کارگاه اختصاصی درودگری
            </span>
            <p className="font-serif text-lg sm:text-2xl font-bold">
              پیوند اصالت تنه‌های کهنسال با آرامش طراحی شرقی
            </p>
          </div>
        </div>
      </section>

      {/* 3. Three Pillars of Craft */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            سه رکن تخطی‌ناپذیر کارگاه ما
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-light">
            هر میز ناهارخوری، صندلی و تخت‌خواب در شادوود بر پایه این اصول پدید می‌آید.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-shaad-100 text-shaad-800 flex items-center justify-center">
              <TreePine className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-foreground">۱۰۰٪ چوب خالص و دیرین</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              ما هرگز از ام‌دی‌اف، نئوپان یا روکش‌های صنعتی مصنوعی استفاده نمی‌کنیم. همه قطعات از تخته‌های تنومند
              چوب گردوی سیاه، بلوط سپید و ساج دست‌چین و فرآوری می‌شوند.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-shaad-100 text-shaad-800 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-foreground">اتصالات کام و زبانه سنتی</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              چوب نفس می‌کشد و با تغییر فصل‌ها منبسط و منقبض می‌شود. اتصالات درهم‌تنیده کام و زبانه امکان حرکت طبیعی الیاف را
              فراهم کرده و از تابیدگی یا ترک‌خوردن سازه جلوگیری می‌نمایند.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-shaad-100 text-shaad-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-foreground">پوشش‌های گیاهی و ارگانیک</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              پرداخت دستی با روغن‌های بذر کتان و موم خالص زنبور عسل بافت مخملین و لمس طبیعی چوب را آشکار می‌سازد،
              بدون هیچ‌گونه بوی نامطبوع و بخارات نفتی شیمایی.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Atelier Statistics Bar */}
      <section className="bg-shaad-900 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-wood-100">۲۵ سال</span>
            <p className="text-xs text-wood-200/80 font-sans tracking-wider">ضمانت اتصالات سازه</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-wood-100">صفر</span>
            <p className="text-xs text-wood-200/80 font-sans tracking-wider">ام‌دی‌اف و پلاستیک</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-wood-100">۱۰۰٪</span>
            <p className="text-xs text-wood-200/80 font-sans tracking-wider">خشک‌شده در کوره تخصصی</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-wood-100">دست‌ساز</span>
            <p className="text-xs text-wood-200/80 font-sans tracking-wider">در کارگاه استودیو شادوود</p>
          </div>
        </div>
      </section>

      {/* 5. Direct Action Call */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 text-center space-y-6">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
          مشتاق سفارش اثری مانا برای فضای زندگی خود هستید؟
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed font-light">
          مجموعه مبلمان دست‌ساز ما را ورق بزنید یا برای ابعاد سفارشی و گونه‌های اختصاصی چوب با استادکاران ما در ارتباط باشید.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild className="h-11 px-7 rounded-xl bg-shaad-800 hover:bg-shaad-900 text-white text-xs font-semibold">
            <Link href="/shop" className="flex items-center gap-2">
              <span>مشاهده آثار استودیو</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-11 px-7 rounded-xl border-border/80 bg-white hover:bg-zen-100 text-xs font-semibold">
            <Link href="/contact" className="flex items-center gap-2">
              <span>اطلاعات تماس و کارگاه</span>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
