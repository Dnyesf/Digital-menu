import React, { useState } from 'react';
import { Wifi, Battery, Smartphone, Monitor } from 'lucide-react';

interface IPhoneFrameProps {
  children: React.ReactNode;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children }) => {
  const [isPhoneView, setIsPhoneView] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-[#060A1C] flex flex-col items-center justify-start text-[#F5F0E6] relative">
      {/* Top Floating Device View Mode Switcher */}
      <div className="fixed top-3 left-3 z-[100] flex items-center gap-1.5 p-1 rounded-full bg-[#0D1530]/90 backdrop-blur-md border border-[#E8C56B]/30 shadow-lg text-[11px]">
        <button
          onClick={() => setIsPhoneView(true)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
            isPhoneView
              ? 'bg-gradient-to-r from-[#E8C56B] to-[#C9A227] text-[#060A1C] font-bold shadow-sm'
              : 'text-[#F5F0E6]/70 hover:text-[#E8C56B]'
          }`}
          title="حالت موبایل آیفون"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>قاب آیفون</span>
        </button>
        <button
          onClick={() => setIsPhoneView(false)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
            !isPhoneView
              ? 'bg-gradient-to-r from-[#E8C56B] to-[#C9A227] text-[#060A1C] font-bold shadow-sm'
              : 'text-[#F5F0E6]/70 hover:text-[#E8C56B]'
          }`}
          title="حالت تمام صفحه"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>تمام‌صفحه</span>
        </button>
      </div>

      {isPhoneView ? (
        <div className="py-4 sm:py-8 w-full flex justify-center items-start px-2 sm:px-4">
          {/* iPhone 16 Pro Body Frame */}
          <div className="relative w-full max-w-[390px] min-h-[844px] rounded-[52px] p-[10px] bg-gradient-to-b from-[#2A2E3D] via-[#1A1E2C] to-[#121522] shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_0_1px_rgba(232,197,107,0.25)] ring-1 ring-white/10">
            {/* Outer Rim Details (Titanium sheen buttons mockup) */}
            <div className="absolute -right-[13px] top-[140px] w-[3px] h-[55px] bg-[#3B4054] rounded-r-sm" />
            <div className="absolute -left-[13px] top-[110px] w-[3px] h-[30px] bg-[#3B4054] rounded-l-sm" />
            <div className="absolute -left-[13px] top-[155px] w-[3px] h-[50px] bg-[#3B4054] rounded-l-sm" />
            <div className="absolute -left-[13px] top-[215px] w-[3px] h-[50px] bg-[#3B4054] rounded-l-sm" />

            {/* Inner Screen Bezel */}
            <div className="relative w-full rounded-[44px] overflow-hidden bg-gradient-to-b from-[#0D1530] to-[#060A1C] flex flex-col min-h-[824px] border border-black/80 shadow-inner">
              {/* iPhone Status Bar (Fixed at top of screen) */}
              <div className="sticky top-0 z-50 w-full h-11 px-7 flex items-center justify-between text-white text-[13px] font-semibold select-none bg-gradient-to-b from-[#0D1530] to-transparent pointer-events-none">
                {/* Time (Left side on iPhone display) */}
                <span className="tracking-tight font-medium">9:41</span>

                {/* Dynamic Island Pill */}
                <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[110px] h-[30px] bg-black rounded-full flex items-center justify-between px-3 shadow-md pointer-events-auto">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0D253F] ring-1 ring-[#E8C56B]/30" />
                </div>

                {/* Right side: Signal, Wifi, Battery (White icons) */}
                <div className="flex items-center gap-1.5">
                  {/* Cellular Signal 4 bars */}
                  <div className="flex items-end gap-[1.5px] h-3">
                    <div className="w-[3px] h-1.5 bg-white rounded-xs" />
                    <div className="w-[3px] h-2 bg-white rounded-xs" />
                    <div className="w-[3px] h-2.5 bg-white rounded-xs" />
                    <div className="w-[3px] h-3 bg-white rounded-xs" />
                  </div>

                  {/* WiFi Icon */}
                  <Wifi className="w-3.5 h-3.5 stroke-[2.4] text-white" />

                  {/* Battery Icon */}
                  <div className="relative flex items-center">
                    <div className="w-5 h-2.5 rounded-[3px] border border-white p-[1px] flex items-center">
                      <div className="h-full w-full bg-white rounded-[1px]" />
                    </div>
                    <div className="w-[1.5px] h-1 bg-white rounded-r-[1px] ml-[0.5px]" />
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col relative w-full overflow-y-auto pb-16">
                {children}
              </div>

              {/* iPhone Home Indicator Bottom Bar */}
              <div className="sticky bottom-0 z-50 w-full h-5 flex items-center justify-center pointer-events-none bg-gradient-to-t from-[#060A1C] to-transparent">
                <div className="w-32 h-1 bg-white/40 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Fullscreen Desktop / Tablet Experience */
        <div className="w-full flex-1 flex flex-col bg-gradient-to-b from-[#0D1530] to-[#060A1C]">
          {children}
        </div>
      )}
    </div>
  );
};
