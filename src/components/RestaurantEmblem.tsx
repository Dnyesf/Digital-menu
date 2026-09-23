import React from 'react';

interface RestaurantEmblemProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const RestaurantEmblem: React.FC<RestaurantEmblemProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* Circular Gold Luxury Emblem */}
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        {/* Outer ambient glow */}
        <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-md animate-pulse-glow" />

        {/* Outer Gold Border Ring with Delicate Pattern */}
        <div className="relative w-full h-full rounded-full p-[2px] bg-gradient-to-tr from-[#9B7A22] via-[#F0D47C] to-[#C9A227] shadow-[0_4px_20px_rgba(212,175,55,0.35)]">
          <div className="w-full h-full rounded-full bg-[#0A0F1C] border border-[#D4AF37]/50 flex flex-col items-center justify-center p-1 relative overflow-hidden">
            {/* Subtle background arabesque geometry */}
            <div className="absolute inset-0 bg-radial from-[#D4AF37]/15 to-transparent pointer-events-none" />

            {/* Circular text or badge */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              {/* Persian Calligraphy Main Name */}
              <span className="font-amiri font-black text-[#F0D47C] leading-none tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-base sm:text-lg">
                عابدین‌زاده
              </span>

              {/* English Subtitle Under */}
              <span className="font-cinzel text-[7px] tracking-widest text-[#D4AF37]/90 uppercase mt-0.5 scale-90">
                ABEDINZADEH
              </span>
            </div>
          </div>
        </div>
      </div>

      {showTagline && (
        <div className="mt-2 text-center">
          <h2 className="font-amiri text-lg sm:text-xl font-bold text-[#F8F5EF] drop-shadow">
            رستوران عابدین‌زاده
          </h2>
          <p className="text-xs sm:text-sm text-[#D4AF37] font-medium tracking-wide mt-0.5">
            طعم اصیل، لحظاتی ماندگار
          </p>
        </div>
      )}
    </div>
  );
};
