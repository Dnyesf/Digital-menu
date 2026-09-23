import React from 'react';
import { CategoryInfo, Language } from '../types';
import { Flame, Soup, Utensils, Wine, Sparkles, Sandwich, Crown } from 'lucide-react';

interface CategoryCardProps {
  category: CategoryInfo;
  lang: Language;
  dishCount: number;
}

const getCategoryMeta = (id: string) => {
  switch (id) {
    case 'kebab':
      return {
        icon: Flame,
        subtitle: 'راسته بره گوسفندی مرینیت‌شده در زعفران قائنات، چلو دودی طارم و زغال پسته',
        badge: 'محبوب‌ترین ضیافت دربار',
        bgGradient: 'from-[#020F1E]/95 via-[#020F1E]/75 to-[#020F1E]/30',
      };
    case 'stew':
      return {
        icon: Soup,
        subtitle: 'خورشت‌های جاافتاده قاجاری با زعفران سوپرنگین، لیمو عمانی و روغن اصیل کرمانشاهی',
        badge: 'دست‌پخت اصیل عمارت',
        bgGradient: 'from-[#020F1E]/95 via-[#020F1E]/75 to-[#020F1E]/30',
      };
    case 'fastfood':
      return {
        icon: Sandwich,
        subtitle: 'تلفیق مدرن با دستپخت شاهانه، سس‌های دست‌ساز و پنیرهای طبیعی فرآوری‌شده',
        badge: 'تلفیق اصیل و معاصر',
        bgGradient: 'from-[#020F1E]/95 via-[#020F1E]/75 to-[#020F1E]/30',
      };
    case 'appetizer':
      return {
        icon: Utensils,
        subtitle: 'پیش‌غذاهای سنتی گیلان و شیراز با نان داغ تنوری کنجدی و زیتون‌های پرورده محلی',
        badge: 'آغاز باشکوه سفره',
        bgGradient: 'from-[#020F1E]/95 via-[#020F1E]/75 to-[#020F1E]/30',
      };
    case 'dessert':
      return {
        icon: Sparkles,
        subtitle: 'باقلوای پسته‌ای زعفرانی، شله‌زرد درباری با خلال بادام و سرشیر اعلا',
        badge: 'شیرینی و حلاوت شاهانه',
        bgGradient: 'from-[#020F1E]/95 via-[#020F1E]/75 to-[#020F1E]/30',
      };
    case 'drink':
      return {
        icon: Wine,
        subtitle: 'شربت‌های سنتی عرقیجات کاشان، بهارنارنج ناب شیراز و سکنجبین زعفرانی',
        badge: 'نوشیدنی‌های گوارا و فرح‌بخش',
        bgGradient: 'from-[#020F1E]/95 via-[#020F1E]/75 to-[#020F1E]/30',
      };
    default:
      return {
        icon: Crown,
        subtitle: 'کلکسیون کامل طعم‌های اصیل و شاهانه کاخ شایگان',
        badge: 'دستورپخت انحصاری دربار',
        bgGradient: 'from-[#020F1E]/95 via-[#020F1E]/75 to-[#020F1E]/30',
      };
  }
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  lang,
}) => {
  const meta = getCategoryMeta(category.id);
  const Icon = meta.icon;

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C9A24D]/35 bg-[#071A2D] shadow-2xl group transition-all duration-300 hover:border-[#C9A24D]/75 mb-4 sm:mb-6 min-h-[140px] sm:min-h-[160px] flex items-center">
      {/* High-quality Cinematic Background Food Image */}
      <img
        src={category.image}
        alt={category.name}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.7] contrast-105"
      />

      {/* Persian Pattern & Sophisticated Vignette Dark Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${meta.bgGradient} rtl:bg-gradient-to-l`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020F1E] via-transparent to-black/40" />

      {/* Subtle Persian Golden Ornamental Lines */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A24D]/50 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A24D]/30 to-transparent" />

      {/* Card Content with Refined Royal Typography */}
      <div className="relative z-10 p-5 sm:p-7 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div className="space-y-2 max-w-2xl">
          {/* Top minimal badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#020F1E]/85 border border-[#C9A24D]/60 text-[11px] sm:text-xs font-bold text-[#F0D47C] backdrop-blur-md shadow-sm">
            <Icon className="w-3.5 h-3.5 text-[#C9A24D]" />
            <span>{meta.badge}</span>
          </div>

          {/* Category Title with high aesthetic Persian font */}
          <h3 className="font-amiri text-2xl sm:text-3xl md:text-4xl font-black text-[#F8F5EF] drop-shadow-md tracking-wide">
            {lang === 'fa' ? category.name : category.nameEn}
          </h3>

          {/* Authentic Subtitle */}
          <p className="text-xs sm:text-sm text-[#EAE5D9] font-light leading-relaxed drop-shadow-sm max-w-xl">
            {meta.subtitle}
          </p>
        </div>

        {/* Minimal Luxury Royal Seal Indicator */}
        <div className="self-start sm:self-center shrink-0">
          <div className="px-4 py-2 sm:py-2.5 rounded-2xl bg-[#020F1E]/85 backdrop-blur-md border border-[#C9A24D]/50 text-xs sm:text-sm text-[#F0D47C] font-bold flex items-center gap-2.5 shadow-lg group-hover:border-[#C9A24D] transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#C9A24D] animate-pulse" />
            <span className="font-amiri text-sm sm:text-base">سفره {lang === 'fa' ? category.name : category.nameEn}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
