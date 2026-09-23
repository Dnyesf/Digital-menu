import React, { useState } from 'react';
import { Search, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { FoodItem, Language } from '../types';
import { translations } from '../utils/translations';
import { FoodCard } from './FoodCard';

interface SearchModalProps {
  isOpen: boolean;
  lang: Language;
  foodItems: FoodItem[];
  cartQuantities: Record<string, number>;
  favorites: string[];
  query: string;
  onQueryChange: (q: string) => void;
  onClose: () => void;
  onAddToCart: (food: FoodItem) => void;
  onRemoveFromCart: (foodId: string) => void;
  onToggleFavorite: (foodId: string) => void;
  onClickDetail: (food: FoodItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  lang,
  foodItems,
  cartQuantities,
  favorites,
  query,
  onQueryChange,
  onClose,
  onAddToCart,
  onRemoveFromCart,
  onToggleFavorite,
  onClickDetail,
}) => {
  const t = translations[lang];

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const filteredFoods = foodItems.filter((food) => {
    if (!q) return true;
    return (
      food.name.toLowerCase().includes(q) ||
      food.nameEn.toLowerCase().includes(q) ||
      food.description.toLowerCase().includes(q) ||
      food.descriptionEn.toLowerCase().includes(q) ||
      food.category.toLowerCase().includes(q) ||
      food.ingredients.some((ing) => ing.toLowerCase().includes(q)) ||
      food.ingredientsEn.some((ing) => ing.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-40 bg-[#020F1E] flex flex-col overflow-hidden animate-fadeIn pb-24">
      {/* Header Search Bar (Clean search input, no filters) */}
      <div className="p-4 sm:p-5 bg-[#061829] border-b border-white/10 flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-2.5 rounded-xl border border-white/10 bg-[#071A2D] text-[#F8F5EF] hover:text-[#f0d47c] transition-colors"
          aria-label="Back"
          title="بازگشت"
        >
          {lang === 'fa' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        </button>

        {/* Clean Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full py-3 ps-11 pe-10 rounded-xl bg-[#071A2D] border border-white/10 text-[#F8F5EF] placeholder-[#A8A49B]/60 text-sm focus:outline-none focus:border-[#f0d47c]/60 focus:ring-1 focus:ring-[#f0d47c]/60 transition-all font-vazir"
          />
          <Search className="w-5 h-5 text-[#f0d47c] absolute top-1/2 -translate-y-1/2 start-3.5" />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              className="absolute top-1/2 -translate-y-1/2 end-3 text-[#A8A49B] hover:text-[#F8F5EF] p-1 transition-colors"
              title="پاک کردن"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl mx-auto w-full hide-scrollbar">
        <div className="mb-4 text-xs font-semibold text-[#A8A49B] flex items-center justify-between">
          <span>
            {lang === 'fa'
              ? `یافته‌ها: ${filteredFoods.length} مورد`
              : `Found ${filteredFoods.length} items`}
          </span>
          {query && (
            <span className="text-[11px] text-[#f0d47c]/80">
              جستجو برای: «{query}»
            </span>
          )}
        </div>

        {filteredFoods.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-[#f0d47c]/40 mx-auto mb-4" />
            <h3 className="font-bold text-lg text-[#F8F5EF]">{t.noResults}</h3>
            <p className="text-xs text-[#A8A49B] mt-1 font-light">
              {lang === 'fa'
                ? 'لطفاً کلمات کلیدی دیگری مانند کباب، شیشلیک، برگ یا زرشک‌پلو را امتحان کنید.'
                : 'Try keywords like kebab, shishlik, barg, saffron or tahchin.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            {filteredFoods.map((food) => (
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
        )}
      </div>
    </div>
  );
};
