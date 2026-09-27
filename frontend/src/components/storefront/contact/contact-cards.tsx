import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function ContactCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
      {/* Card 1: Physical Workshop Location */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-shaad-100 text-shaad-800 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h2 className="font-serif font-bold text-xl text-foreground">کارگاه درودگری و شوروم استودیو</h2>
          <p className="text-xs text-muted-foreground leading-relaxed font-light">
            کارگاه فعال درودگری و گالری آثار تکمیل‌شده شادوود آماده میزبانی از دوستداران هنر چوب طبیعی است.
          </p>
          <div className="p-4 rounded-2xl bg-zen-50 border border-border/70 text-xs space-y-1 text-foreground leading-relaxed">
            <p className="font-semibold text-shaad-900">استودیو درودگری و مبلمان شادوود</p>
            <p className="text-muted-foreground">تهران، منطقه صنعتی کمرد، خیابان صنعت غربی، پلاک ۲۴</p>
            <p className="text-muted-foreground">کد پستی: ۱۶۵۴۸۳۲۱۹۹</p>
            <p className="text-[11px] text-shaad-800 pt-1">دسترسی همکف &middot; امکان پارک خودرو اختصاصی</p>
          </div>
        </div>
      </div>

      {/* Card 2: Direct Telephones */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-shaad-100 text-shaad-800 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h2 className="font-serif font-bold text-xl text-foreground">خطوط تماس مستقیم با کارگاه</h2>
          <p className="text-xs text-muted-foreground leading-relaxed font-light">
            در ساعات کاری می‌توانید مستقیماً با کارشناسان سفارشات و استادکاران کارگاه گفتگو کنید.
          </p>
          <div className="space-y-2 pt-1">
            <div className="p-3.5 rounded-2xl bg-zen-50 border border-border/70 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground block font-sans">واحد مشاوره و سفارشات</span>
                <a href="tel:02122334455" dir="ltr" className="font-sans text-sm font-semibold text-shaad-900 hover:underline">
                  ۰۲۱-۲۲۳۳۴۴۵۵
                </a>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                پاسخگویی اصلی
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zen-50 border border-border/70 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground block font-sans">میز استادکاران کارگاه</span>
                <a href="tel:09121234567" dir="ltr" className="font-sans text-sm font-semibold text-shaad-900 hover:underline">
                  ۰۹۱۲-۱۲۳۴۵۶۷
                </a>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zen-100 text-muted-foreground border border-border/70">
                بخش تولید
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
          <h2 className="font-serif font-bold text-xl text-foreground">مکاتبات و نقشه‌های معماری</h2>
          <p className="text-xs text-muted-foreground leading-relaxed font-light">
            جهت ارسال نقشه‌های معماری، طرح‌های سفارشی و استعلام ابعاد خاص. پاسخگویی حداکثر ظرف ۲۴ ساعت کاری.
          </p>
          <div className="space-y-2 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-zen-50 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">امور عمومی و کارگاه:</span>
              <a href="mailto:info@shaadwood.com" className="font-sans text-shaad-800 font-medium hover:underline">
                info@shaadwood.com
              </a>
            </div>
            <div className="p-3 rounded-xl bg-zen-50 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">سفارشات ابعاد خاص:</span>
              <a href="mailto:custom@shaadwood.com" className="font-sans text-shaad-800 font-medium hover:underline">
                custom@shaadwood.com
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
          <h2 className="font-serif font-bold text-xl text-foreground">ساعات بازدید و مشاوره حضوری</h2>
          <p className="text-xs text-muted-foreground leading-relaxed font-light">
            جهت لمس بافت تنه‌های چوب، مقایسه پرداخت‌ها و گفتگو با استادکاران پذیرای شما هستیم.
          </p>
          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">شنبه تا چهارشنبه</span>
              <span className="text-foreground font-semibold">۱۰:۰۰ صبح تا ۶:۰۰ عصر</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">پنج‌شنبه‌ها</span>
              <span className="text-foreground font-semibold">۱۰:۰۰ صبح تا ۲:۰۰ بعدازظهر</span>
            </div>
            <div className="flex items-center justify-between py-1.5 text-muted-foreground">
              <span>جمعه‌ها و ایام تعطیل</span>
              <span className="italic">کارگاه تعطیل (زمان استراحت چوب)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
