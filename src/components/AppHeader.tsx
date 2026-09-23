import React from 'react';
import { Crown } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface HeaderProps {
  lang: Language;
  onNavigate: (tab: 'home' | 'menu' | 'cart' | 'reservation' | 'profile' | 'story') => void;
  activeTab: string;
}

export const AppHeader: React.FC<HeaderProps> = ({
  lang,
  onNavigate,
  activeTab,
}) => {
  const t = translations[lang];

  return (
    /* 
      Header:
      - Completely overlaid on top of the image (Hero image)
      - NO solid background color, NO border divider line
      - Soft backdrop blur + subtle top-to-bottom dark gradient fade
    */
    <header
      className={`z-40 w-full transition-all duration-300 border-none ${
        activeTab === 'home'
          ? 'absolute top-0 inset-x-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent backdrop-blur-[3px]'
          : 'relative bg-[#020F1E]/95 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-center pointer-events-auto">
        {/* Center: Restaurant Brand Emblem & Title */}
        <div 
          onClick={() => onNavigate('home')}
          className="cursor-pointer flex flex-col items-center justify-center text-center select-none group"
        >
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-[#F0D47C] group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_2px_12px_rgba(201,162,77,0.6)]" />
            <span className="font-amiri text-2xl sm:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FDF8E2] via-[#F0D47C] to-[#C9A24D] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {t.restaurantName}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs tracking-widest text-[#F0D47C]/90 font-cinzel drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            عمارت تشریفاتی پارسی
          </span>
        </div>
      </div>
    </header>
  );
};
