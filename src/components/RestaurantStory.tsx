import React from 'react';
import { Crown, Sparkles, Award, HeartHandshake } from 'lucide-react';
import { Language } from '../types';
import { RESTAURANT_INFO } from '../data/mockData';
import { translations } from '../utils/translations';

interface RestaurantStoryProps {
  lang: Language;
  onNavigateToHome?: () => void;
}

export const RestaurantStory: React.FC<RestaurantStoryProps> = ({
  lang,
  onNavigateToHome,
}) => {
  const t = translations[lang];

  return (
    <div className="pt-24 sm:pt-28 py-8 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-12 animate-fadeIn pb-28">
      {/* Hero Banner for Story */}
      <div className="relative rounded-3xl overflow-hidden border border-[#C9A24D]/35 bg-[#071A2D] p-6 sm:p-12 text-center">
        <div className="absolute inset-0 opacity-15 bg-persian-pattern" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#020F1E]/80 border border-[#C9A24D] text-[#F0D47C] text-xs font-bold">
            <Crown className="w-4 h-4 text-[#F0D47C]" />
            <span>{t.persianHeritageBadge}</span>
          </div>

          <h1 className="font-amiri text-3xl sm:text-5xl font-black text-[#F8F5EF] leading-tight">
            {RESTAURANT_INFO.name}
          </h1>

          <p className="font-amiri text-base sm:text-xl text-[#F0D47C] font-semibold">
            {RESTAURANT_INFO.tagline}
          </p>

          <p className="text-xs sm:text-sm text-[#A8A49B] leading-relaxed pt-2">
            کاخ پذیرایی و رستوران شایگان با بیش از سه دهه قدمت، محلی برای تجربه اصیل‌ترین طعم‌های غذاهای ایرانی، چلوکباب‌های شاهانه و ضیافت‌های مجلل در محیطی فاخر و آرامش‌بخش است.
          </p>
        </div>
      </div>

      {/* Pillars of Royal Dining - Flat list style */}
      <div className="divide-y divide-white/[0.08] py-2">
        <div className="py-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#f0d47c]/15 text-[#f0d47c] flex items-center justify-center shrink-0 mt-0.5">
            <Award className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-amiri text-lg font-bold text-[#F8F5EF]">
              دستورپخت‌های سلطنتی اصیل
            </h3>
            <p className="text-xs text-[#A8A49B] leading-relaxed font-light">
              استفاده از خالص‌ترین زعفران سوپرنگین قائنات، کره گوسفندی محلی و برنج دودی اعلا، بر اساس دستورپخت‌های مکتوب دوره صفوی و قاجار.
            </p>
          </div>
        </div>

        <div className="py-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#f0d47c]/15 text-[#f0d47c] flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-amiri text-lg font-bold text-[#F8F5EF]">
              معماری و هنر اصیل ایرانی
            </h3>
            <p className="text-xs text-[#A8A49B] leading-relaxed font-light">
              حوض‌خانه فیروزه‌ای، پنجره‌های ارسی با شیشه‌های رنگی دست‌ساز و سالن شاه‌نشین اختصاصی، محیطی آرامش‌بخش و شکوهمند را خلق کرده است.
            </p>
          </div>
        </div>

        <div className="py-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#f0d47c]/15 text-[#f0d47c] flex items-center justify-center shrink-0 mt-0.5">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-amiri text-lg font-bold text-[#F8F5EF]">
              پذیرایی در شأن میهمانان گرامی
            </h3>
            <p className="text-xs text-[#A8A49B] leading-relaxed font-light">
              میزبانی با لباس‌های تشریفاتی سنتی، اجرای زنده گوشه‌های موسیقی کهن دستگاهی ایرانی و سرویس‌دهی منطبق بر استانداردهای ۵ ستاره بین‌المللی.
            </p>
          </div>
        </div>
      </div>

      {/* Master Chef Section */}
      <div className="border-t border-b border-white/[0.08] py-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 border border-[#f0d47c]/40 shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80"
            alt="سرآشپز کاخ شایگان"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-2 text-center md:text-start flex-1">
          <span className="text-xs font-bold text-[#f0d47c] tracking-wider block">
            سرآشپز ارشد و مشاور طعم
          </span>
          <h3 className="font-amiri text-2xl font-bold text-[#F8F5EF]">
            استاد محمدرضا شایگان
          </h3>
          <p className="text-xs text-[#A8A49B] leading-relaxed font-light pt-1">
            با بیش از ۳۵ سال سابقه احیای منوهای کهن ایران و آموزش هنر چلوکباب‌پزی و خورشت‌های فراموش‌شده سنتی، هر بشقاب در کاخ شایگان یک شاهکار هنری و تجربه حس نوستالژی اصالت است.
          </p>
        </div>

        {onNavigateToHome && (
          <div className="shrink-0">
            <button
              onClick={onNavigateToHome}
              className="px-6 py-3 rounded-[6px] bg-[#f0d47c] text-[#020F1E] font-bold text-xs sm:text-sm hover:bg-[#e4c76a] transition-all shadow-md cursor-pointer"
            >
              مشاهده منوی غذاها
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
