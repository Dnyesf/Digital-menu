import React from 'react';

interface RestaurantLogoHeaderProps {
  compact?: boolean;
}

export const RestaurantLogoHeader: React.FC<RestaurantLogoHeaderProps> = ({ compact = false }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center text-center select-none overflow-hidden ${compact ? 'py-2' : 'py-4 px-4'}`}>
      {/* Background with faint Islamic geometric arch overlay fading at corners */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-islamic-pattern" />

      {/* Decorative Dome Arch Silhouette Glow */}
      <div className="absolute top-0 w-48 h-24 bg-[#C9A227]/10 blur-2xl rounded-full pointer-events-none" />

      {/* Circular Logo with Double-Layer Gold Border */}
      <div className="relative z-10 flex items-center justify-center mb-2">
        {/* Outer Ring */}
        <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-[#E8C56B] via-[#C9A227] to-[#9C7A1E] shadow-[0_4px_18px_rgba(201,162,39,0.3)]">
          {/* Inner Gap / Second Ring */}
          <div className="p-[2px] rounded-full bg-[#0D1530]">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#131C38] to-[#0D1530] border border-[#E8C56B]/40 flex items-center justify-center p-2.5">
              {/* Islamic Dome / Royal Persian Toranj Emblem SVG */}
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full text-[#E8C56B] fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
              >
                {/* Crescent / Finial */}
                <path d="M50 8 C51 12 49 14 50 17 C51 14 49 12 50 8 Z" fill="#E8C56B" />
                <circle cx="50" cy="7" r="2" fill="#E8C56B" />
                
                {/* Persian Royal Arch / Dome */}
                <path 
                  d="M50 18 C38 28 32 38 32 54 C32 55 68 55 68 54 C68 38 62 28 50 18 Z" 
                  fill="none" 
                  stroke="#E8C56B" 
                  strokeWidth="3"
                />
                
                {/* Symmetrical Arabesque Foliage / Floral curves inside */}
                <path 
                  d="M50 24 C45 32 42 40 42 49 M50 24 C55 32 58 40 58 49" 
                  fill="none" 
                  stroke="#C9A227" 
                  strokeWidth="2"
                />
                <circle cx="50" cy="38" r="3.5" fill="#E8C56B" />

                {/* Symmetrical Base Columns & Steps */}
                <rect x="28" y="55" width="44" height="4" rx="2" fill="#C9A227" />
                <rect x="24" y="61" width="52" height="4" rx="2" fill="#E8C56B" />
                <rect x="20" y="67" width="60" height="3" rx="1.5" fill="#9C7A1E" />
                
                {/* Ornamental stars */}
                <circle cx="22" cy="40" r="1.5" fill="#E8C56B" opacity="0.8" />
                <circle cx="78" cy="40" r="1.5" fill="#E8C56B" opacity="0.8" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Title: Persian Gold Bold */}
      <h1 className="relative z-10 font-bold text-xl sm:text-2xl tracking-wide gold-gradient-text drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
        رستوران عابدینزاده
      </h1>

      {/* English Title: Smaller Tracking-Wider Gold */}
      <span className="relative z-10 text-[10px] tracking-[0.25em] text-[#C9A227]/90 font-medium uppercase mt-0.5">
        ABEDINZADEH RESTAURANT
      </span>

      {/* Slogan with Decorative Divider Lines */}
      <div className="relative z-10 flex items-center justify-center gap-2 mt-1.5 text-xs text-[#F5F0E6]/80">
        <span className="w-6 h-[1px] bg-gradient-to-r from-transparent to-[#C9A227]" />
        <span className="text-[11px] font-light tracking-wide text-[#E8C56B]">
          طعم اصیل، لذتی ماندگار
        </span>
        <span className="w-6 h-[1px] bg-gradient-to-l from-transparent to-[#C9A227]" />
      </div>
    </div>
  );
};
