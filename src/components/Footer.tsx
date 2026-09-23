import React from 'react';
import { Crown, Phone, MapPin, Clock, Instagram, Send, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { RESTAURANT_INFO } from '../data/mockData';

interface FooterProps {
  lang: Language;
  onNavigate: (tab: 'home' | 'menu' | 'story' | 'profile') => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  const t = translations[lang];

  return (
    <footer className="w-full bg-[#020F1E] border-t border-[#C9A24D]/25 pt-12 pb-24 lg:pb-12 text-[#F8F5EF] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-persian-pattern pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#C9A24D]/20">
          {/* Brand & Emblem */}
          <div className="md:col-span-1 space-y-3 text-center md:text-start">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Crown className="w-6 h-6 text-[#C9A24D]" />
              <span className="font-amiri text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F0D47C] via-[#C9A24D] to-[#E4C76A]">
                {t.restaurantName}
              </span>
            </div>
            <p className="text-xs text-[#A8A49B] leading-relaxed font-light">
              {RESTAURANT_INFO.tagline}
            </p>
            <div className="pt-2 flex items-center justify-center md:justify-start gap-2 text-xs text-[#F0D47C]">
              <ShieldCheck className="w-4 h-4 text-[#C9A24D]" />
              <span>نشان زرین اصالت دستپخت ایرانی</span>
            </div>
          </div>

          {/* Quick Access Links */}
          <div className="space-y-3 text-center md:text-start">
            <h4 className="font-amiri text-base font-bold text-[#F0D47C]">
              دسترسی سریع
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A49B]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#F0D47C] transition-colors cursor-pointer"
                >
                  {t.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('story')}
                  className="hover:text-[#F0D47C] transition-colors cursor-pointer"
                >
                  {t.ourStory}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile')}
                  className="hover:text-[#F0D47C] transition-colors cursor-pointer"
                >
                  {t.profile}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-center md:text-start">
            <h4 className="font-amiri text-base font-bold text-[#F0D47C]">
              {t.contactUs}
            </h4>
            <div className="space-y-2 text-xs text-[#A8A49B]">
              <div className="flex items-start justify-center md:justify-start gap-2">
                <MapPin className="w-4 h-4 text-[#C9A24D] shrink-0 mt-0.5" />
                <span>{RESTAURANT_INFO.address}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="w-4 h-4 text-[#C9A24D] shrink-0" />
                <span className="font-mono">{RESTAURANT_INFO.phone}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Clock className="w-4 h-4 text-[#C9A24D] shrink-0" />
                <span>{RESTAURANT_INFO.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Social & Royal Newsletter */}
          <div className="space-y-3 text-center md:text-start">
            <h4 className="font-amiri text-base font-bold text-[#F0D47C]">
              شبکه‌های اجتماعی و عضویت
            </h4>
            <p className="text-xs text-[#A8A49B] leading-relaxed">
              جهت آگاهی از برنامه‌های ویژه موسیقی سنتی، منوی فصلی و رویدادهای تشریفاتی کاخ شایگان.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
              <a
                href="#instagram"
                className="p-2.5 rounded-xl bg-[#071A2D] border border-[#C9A24D]/30 text-[#F5EFE4] hover:text-[#C9A24D] hover:border-[#C9A24D] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#telegram"
                className="p-2.5 rounded-xl bg-[#071A2D] border border-[#C9A24D]/30 text-[#F5EFE4] hover:text-[#C9A24D] hover:border-[#C9A24D] transition-all"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A8A49B]/70 gap-3 text-center">
          <p>{t.copyright}</p>
          <p className="font-cinzel text-[11px] uppercase tracking-wider text-[#C9A24D]">
            SHAYGAN PALACE • ROYAL PERSIAN DINING & HERITAGE
          </p>
        </div>
      </div>
    </footer>
  );
};
