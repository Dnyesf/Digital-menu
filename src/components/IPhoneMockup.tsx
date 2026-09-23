import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface IPhoneMockupProps {
  children: React.ReactNode;
  activeScreen: string;
  onSwitchScreen: (screenId: string) => void;
  isMockupMode: boolean;
  onToggleMockupMode: () => void;
}

export const IPhoneMockup: React.FC<IPhoneMockupProps> = ({
  children,
  activeScreen,
  onSwitchScreen,
  isMockupMode,
  onToggleMockupMode,
}) => {
  const screens = [
    { id: 'menu', label: '۱. منو و فست‌فود', icon: '🍔' },
    { id: 'reservation', label: '۲. رزرو میز', icon: '📅' },
    { id: 'profile', label: '۳. حساب کاربری', icon: '👤' },
    { id: 'cart', label: '۴. سبد سفارش', icon: '🛍️' },
    { id: 'special-moments', label: '۵. لحظات خاص', icon: '✨' },
    { id: 'home', label: 'صفحه اصلی', icon: '🏛️' },
  ];

  return (
    <div className="min-h-screen bg-[#060A13] text-[#F8F5EF] flex flex-col items-center justify-start p-0 sm:p-4 md:p-6 overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
      {/* Top Floating Control Bar for Screen Switching & View Mode */}
      <header className="w-full max-w-5xl py-2 px-3 sm:px-4 mb-2 sm:mb-4 flex flex-col md:flex-row items-center justify-between gap-3 bg-[#0B1220]/90 backdrop-blur-xl border border-[#D4AF37]/35 rounded-2xl shadow-xl z-50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="font-amiri font-bold text-sm sm:text-base text-[#F0D47C]">
            رستوران عابدین‌زاده
          </span>
          <span className="text-[11px] text-[#A8A49B] hidden sm:inline">
            طعم اصیل، لحظاتی ماندگار
          </span>
        </div>

        {/* Screen Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar max-w-full py-1">
          {screens.map((s) => {
            const isActive = activeScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSwitchScreen(s.id)}
                className={`whitespace-nowrap px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#0A0F1C] shadow-[0_2px_10px_rgba(212,175,55,0.4)] scale-105 font-bold'
                    : 'bg-[#142036] text-[#F5F0E6]/80 hover:text-white hover:bg-[#1c2c4a] border border-[#D4AF37]/20'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mockup Frame Toggle */}
        <button
          onClick={onToggleMockupMode}
          className="text-[11px] px-3 py-1.5 rounded-xl border border-[#D4AF37]/40 bg-[#0E1729] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0F1C] transition-all whitespace-nowrap hidden lg:flex items-center gap-1"
        >
          <span>{isMockupMode ? '📱 حالت قاب آیفون' : '🖥️ حالت تمام صفحه'}</span>
        </button>
      </header>

      {/* Main Container: Mockup Frame OR Responsive Wide Container */}
      {isMockupMode ? (
        <div className="relative w-full max-w-[412px] h-[890px] my-auto bg-black rounded-[54px] p-[10px] shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.22)] border-[4px] border-[#222834] transition-all">
          {/* Outer edge buttons simulation */}
          <div className="absolute -start-[13px] top-[115px] w-[3px] h-[28px] bg-[#333d4f] rounded-s" />
          <div className="absolute -start-[13px] top-[160px] w-[3px] h-[50px] bg-[#333d4f] rounded-s" />
          <div className="absolute -start-[13px] top-[225px] w-[3px] h-[50px] bg-[#333d4f] rounded-s" />
          <div className="absolute -end-[13px] top-[180px] w-[3px] h-[75px] bg-[#333d4f] rounded-e" />

          {/* Screen Inner Glass */}
          <div className="relative w-full h-full bg-[#0A0F1C] rounded-[44px] overflow-hidden flex flex-col border border-white/10 shadow-inner">
            {/* Authentic 9:41 Status Bar with White Icons */}
            <div className="absolute top-0 inset-x-0 h-11 px-7 flex items-center justify-between text-white z-50 pointer-events-none select-none">
              {/* Time in Persian/English: 9:41 */}
              <span className="font-semibold text-xs tracking-tight">9:41</span>

              {/* Dynamic Island / Camera Notch */}
              <div className="w-24 h-5 bg-black rounded-full mx-auto flex items-center justify-end pe-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#121214] border border-[#262628]" />
              </div>

              {/* Status Icons: Cellular, Wifi, Battery */}
              <div className="flex items-center gap-1.5">
                <Signal className="w-3.5 h-3.5 stroke-[2]" />
                <Wifi className="w-3.5 h-3.5 stroke-[2]" />
                <BatteryMedium className="w-4 h-4 stroke-[2]" />
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pt-10 pb-6 hide-scrollbar relative">
              {children}
            </div>

            {/* Home Indicator Bar */}
            <div className="absolute bottom-1.5 inset-x-0 mx-auto w-32 h-1 bg-white/40 rounded-full z-50 pointer-events-none" />
          </div>
        </div>
      ) : (
        /* Responsive Wide Canvas with Fixed 9:41 Mobile Bar */
        <div className="w-full max-w-4xl bg-[#0A0F1C] rounded-3xl border border-[#D4AF37]/40 shadow-2xl overflow-hidden relative min-h-[850px] flex flex-col">
          {/* Subtle Mobile Status Bar */}
          <div className="w-full h-8 px-6 bg-[#0B1220] border-b border-[#D4AF37]/20 flex items-center justify-between text-xs text-white/90 select-none">
            <span className="font-semibold text-xs">9:41</span>
            <div className="flex items-center gap-2">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <BatteryMedium className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
