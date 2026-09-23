import React from 'react';

interface BottomNavProps {
  activeTab: string;
  cartCount: number;
  onNavigate: (tab: 'home' | 'cart' | 'profile') => void;
}

export const BottomNavigation: React.FC<BottomNavProps> = ({
  activeTab,
  cartCount,
  onNavigate,
}) => {
  return (
    <nav className="fixed bottom-5 inset-x-0 mx-auto w-fit z-[70] transition-all duration-300 pointer-events-none select-none">
      {/* 
        Instagram-style floating pill bar exactly matching uploaded screenshot:
        - Sleek dark pill container
        - Active item enclosed in a rounded dark-gray capsule
        - Inactive items are clean outline icons in white
        - Red notification dot on cart (bottom-right of icon) like the Instagram notification dot
      */}
      <div className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-[#101216]/95 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
        
        {/* 1. Home Item (خانه) */}
        <button
          id="bottom-nav-home"
          onClick={() => onNavigate('home')}
          className={`relative transition-all duration-200 active:scale-95 flex items-center justify-center ${
            activeTab === 'home'
              ? 'bg-[#2b313c] text-white px-5 py-2.5 rounded-full shadow-inner'
              : 'text-white/80 hover:text-white px-4 py-2.5 rounded-full hover:bg-white/5'
          }`}
          title="خانه"
          aria-label="خانه"
        >
          {activeTab === 'home' ? (
            /* Active Solid House with Cutout Doorway */
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] text-white" fill="currentColor">
              <path d="M3.5 21V10.8a1.5 1.5 0 0 1 .55-1.16l7-5.6a1.5 1.5 0 0 1 1.9 0l7 5.6a1.5 1.5 0 0 1 .55 1.16V21a1 1 0 0 1-1 1h-4.5a.5.5 0 0 1-.5-.5V14.5a2 2 0 0 0-4 0v7a.5.5 0 0 1-.5.5H4.5a1 1 0 0 1-1-1z" />
            </svg>
          ) : (
            /* Inactive Outline House */
            <svg
              viewBox="0 0 24 24"
              className="w-[22px] h-[22px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3.5 10.5 12 3.5l8.5 7v9a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-9z" />
              <path d="M9 21v-6a3 3 0 0 1 6 0v6" />
            </svg>
          )}
        </button>

        {/* 2. Cart / Orders Item (سبد خرید) */}
        <button
          id="bottom-nav-cart"
          onClick={() => onNavigate('cart')}
          className={`relative transition-all duration-200 active:scale-95 flex items-center justify-center ${
            activeTab === 'cart'
              ? 'bg-[#2b313c] text-white px-5 py-2.5 rounded-full shadow-inner'
              : 'text-white/80 hover:text-white px-4 py-2.5 rounded-full hover:bg-white/5'
          }`}
          title="سبد خرید"
          aria-label="سبد خرید"
        >
          <div className="relative flex items-center justify-center">
            {activeTab === 'cart' ? (
              /* Active Solid Shopping Bag with Cutout Handle */
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] text-white" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.2 2a1.5 1.5 0 0 0-1.16.55L2.3 6.2A1.5 1.5 0 0 0 2 7.15V19.5A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5V7.15c0-.36-.12-.7-.34-.95l-2.7-3.65A1.5 1.5 0 0 0 17.8 2H6.2zm2.3 8a3.5 3.5 0 0 0 7 0v-1a1 1 0 1 1 2 0v1a5.5 5.5 0 0 1-11 0v-1a1 1 0 1 1 2 0v1z"
                />
              </svg>
            ) : (
              /* Inactive Outline Shopping Bag */
              <svg
                viewBox="0 0 24 24"
                className="w-[22px] h-[22px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            )}

            {/* Instagram-style red notification dot */}
            {cartCount > 0 && (
              <span className="absolute -bottom-0.5 -end-0.5 w-2.5 h-2.5 rounded-full bg-[#E53935] ring-2 ring-[#101216]" />
            )}
          </div>
        </button>

        {/* 3. Profile / Account Item (حساب کاربری) */}
        <button
          id="bottom-nav-profile"
          onClick={() => onNavigate('profile')}
          className={`relative transition-all duration-200 active:scale-95 flex items-center justify-center ${
            activeTab === 'profile'
              ? 'bg-[#2b313c] text-white px-5 py-2.5 rounded-full shadow-inner'
              : 'text-white/80 hover:text-white px-4 py-2.5 rounded-full hover:bg-white/5'
          }`}
          title="حساب کاربری"
          aria-label="حساب کاربری"
        >
          {activeTab === 'profile' ? (
            /* Active Solid User */
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] text-white" fill="currentColor">
              <circle cx="12" cy="7" r="4.5" />
              <path d="M4 21a8 8 0 0 1 16 0v.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5V21z" />
            </svg>
          ) : (
            /* Inactive Outline User (matching Instagram profile icon) */
            <svg
              viewBox="0 0 24 24"
              className="w-[22px] h-[22px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9.5" />
              <circle cx="12" cy="8.5" r="3.2" />
              <path d="M6.5 18a6.5 6.5 0 0 1 11 0" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
};
