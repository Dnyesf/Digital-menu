import React, { useState } from 'react';
import { 
  ArrowRight, 
  Search, 
  Flame, 
  Beef, 
  Pizza, 
  Sandwich, 
  Drumstick,
  UtensilsCrossed,
  X
} from 'lucide-react';
import { FoodItem, Language } from '../types';
import { FoodCard } from './FoodCard';

interface MenuPageProps {
  foods: FoodItem[];
  cartQuantities: Record<string, number>;
  favorites: string[];
  lang: Language;
  onAddToCart: (food: FoodItem) => void;
  onRemoveFromCart: (foodId: string) => void;
  onToggleFavorite: (foodId: string) => void;
  onClickDetail: (food: FoodItem) => void;
  onBack: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  foods,
  cartQuantities,
  favorites,
  lang,
  onAddToCart,
  onRemoveFromCart,
  onToggleFavorite,
  onClickDetail,
  onBack,
}) => {
  // Category tab: 'burger' | 'pizza' | 'sandwich' | 'fried' | 'all'
  const [activeCategory, setActiveCategory] = useState<string>('burger');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const [menuType, setMenuType] = useState<'fastfood' | 'traditional'>('fastfood');

  // 4 Horizontal tabs for Fast Food specified in design:
  // سوخاری – ساندویچ – پیتزا – برگر (برگر با پس‌زمینه طلایی پر = تب فعال، بقیه outline)
  const fastFoodTabs = [
    { id: 'burger', label: 'برگر', icon: Beef, subCategories: ['burger'] },
    { id: 'pizza', label: 'پیتزا', icon: Pizza, subCategories: ['pizza'] },
    { id: 'sandwich', label: 'ساندویچ', icon: Sandwich, subCategories: ['sandwich'] },
    { id: 'fried', label: 'سوخاری', icon: Drumstick, subCategories: ['fried', 'fries'] },
  ];

  // Filter foods according to fastfood / traditional
  const displayedFoods = foods.filter((item) => {
    // Search query filter
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || 
      item.name.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (menuType === 'traditional') {
      return item.category !== 'fastfood';
    }

    // Fast food items
    if (item.category !== 'fastfood') return false;

    // Filter by subcategory if a specific tab is selected, or return all if 'all'
    if (activeCategory === 'all') return true;
    const currentTab = fastFoodTabs.find(t => t.id === activeCategory);
    if (!currentTab) return true;
    return item.subCategory ? currentTab.subCategories.includes(item.subCategory) : true;
  });

  return (
    <div dir="rtl" className="w-full max-w-[390px] mx-auto min-h-screen bg-gradient-to-b from-[#0D1530] via-[#091024] to-[#060A1C] text-[#F5F0E6] flex flex-col pb-28">
      {/* 1. Page 1 Header */}
      <div className="sticky top-0 z-40 bg-[#0D1530]/90 backdrop-blur-md px-4 pt-3 pb-3 border-b border-[#E8C56B]/20">
        <div className="flex items-center justify-between">
          {/* Circular Return Button (Right in RTL) */}
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-[#10182F] border border-[#E8C56B]/30 text-[#E8C56B] flex items-center justify-center hover:bg-[#E8C56B]/15 transition-all active:scale-95 shadow-sm"
            title="بازگشت"
            aria-label="بازگشت"
          >
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* Small Logo in Center */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={onBack}>
            <div className="w-7 h-7 rounded-full p-[1px] bg-gradient-to-tr from-[#E8C56B] to-[#9C7A1E]">
              <div className="w-full h-full rounded-full bg-[#0D1530] flex items-center justify-center">
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#E8C56B]" />
              </div>
            </div>
            <span className="text-xs font-bold gold-gradient-text">عابدین‌زاده</span>
          </div>

          {/* Circular Search Button (Left in RTL) */}
          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="w-9 h-9 rounded-full bg-[#10182F] border border-[#E8C56B]/30 text-[#E8C56B] flex items-center justify-center hover:bg-[#E8C56B]/15 transition-all active:scale-95 shadow-sm"
            title="جستجو"
            aria-label="جستجو"
          >
            <Search className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Collapsible Search Input */}
        {showSearchInput && (
          <div className="mt-3 relative animate-fadeIn">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی غذا، پیتزا، برگر..."
              className="w-full py-2 ps-9 pe-8 rounded-full bg-[#10182F] border border-[#E8C56B]/40 text-xs text-[#F5F0E6] placeholder-[#C9A227]/50 focus:outline-none focus:border-[#E8C56B]"
              autoFocus
            />
            <Search className="w-3.5 h-3.5 text-[#E8C56B] absolute top-1/2 -translate-y-1/2 start-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 end-3 text-[#E8C56B]/70 hover:text-[#E8C56B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="px-4 pt-4 space-y-4">
        {/* Large Gold Centered Title: «فست‌فود» with short decorative gold line underneath */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold gold-gradient-text tracking-wide">
            {menuType === 'fastfood' ? 'فست‌فود' : 'سفره اصیل ایرانی'}
          </h2>
          {/* Short Decorative Gold Line */}
          <div className="flex items-center justify-center">
            <div className="w-12 h-[2px] rounded-full gold-gradient-bg shadow-[0_1px_6px_rgba(201,162,39,0.5)]" />
          </div>
          {/* Subtitle: «طعم‌های محبوب، با کیفیت عابدینزاده» */}
          <p className="text-xs text-[#C9A227]/80 pt-0.5">
            طعم‌های محبوب، با کیفیت عابدینزاده
          </p>
        </div>

        {/* Menu Type Selector Pill: Fast Food (Default) vs Traditional */}
        <div className="flex items-center justify-center p-1 rounded-full bg-[#10182F] border border-[#E8C56B]/20 text-xs">
          <button
            onClick={() => {
              setMenuType('fastfood');
              setActiveCategory('burger');
            }}
            className={`flex-1 py-1.5 px-3 rounded-full font-medium transition-all text-center ${
              menuType === 'fastfood'
                ? 'gold-gradient-bg text-[#060A1C] font-bold shadow-sm'
                : 'text-[#C9A227]/70 hover:text-[#E8C56B]'
            }`}
          >
            فست‌فود ویژه (۶ غذا)
          </button>
          <button
            onClick={() => setMenuType('traditional')}
            className={`flex-1 py-1.5 px-3 rounded-full font-medium transition-all text-center ${
              menuType === 'traditional'
                ? 'gold-gradient-bg text-[#060A1C] font-bold shadow-sm'
                : 'text-[#C9A227]/70 hover:text-[#E8C56B]'
            }`}
          >
            سفره اصیل ایرانی
          </button>
        </div>

        {/* Horizontal Category Tabs Row (4 items with small round icon above text):
            سوخاری – ساندویچ – پیتزا – برگر (برگر با پس‌زمینه طلایی پر = تب فعال، بقیه outline) */}
        {menuType === 'fastfood' && (
          <div className="grid grid-cols-4 gap-2 pt-1">
            {fastFoodTabs.map((tab) => {
              const isActive = activeCategory === tab.id;
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(isActive ? 'all' : tab.id)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-[16px] transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'gold-gradient-bg text-[#060A1C] shadow-[0_4px_14px_rgba(201,162,39,0.35)] scale-102'
                      : 'bg-[#10182F] border border-[#E8C56B]/25 text-[#E8C56B] hover:border-[#E8C56B]/60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${
                      isActive ? 'bg-[#060A1C]/15 text-[#060A1C]' : 'bg-[#0D1530] text-[#E8C56B]'
                    }`}
                  >
                    <TabIcon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="text-[11px] font-bold leading-none">{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 2-Column Food Grid */}
        <div className="pt-2">
          {displayedFoods.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {displayedFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  quantity={cartQuantities[food.id] || 0}
                  isFavorite={favorites.includes(food.id)}
                  lang={lang}
                  onAddToCart={onAddToCart}
                  onRemoveFromCart={onRemoveFromCart}
                  onToggleFavorite={onToggleFavorite}
                  onClickDetail={onClickDetail}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-[20px] bg-[#10182F] border border-[#E8C56B]/20 space-y-2">
              <p className="text-sm text-[#F5F0E6]/80">غذایی مطابق جستجوی شما یافت نشد.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="text-xs text-[#E8C56B] underline"
              >
                نمایش همه غذاها
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
