import React, { useState } from 'react';
import { X, Star, Clock, Flame, Heart, Plus, Minus, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { FoodItem, FoodOption, Language } from '../types';
import { formatPrice, toPersianDigits, translations } from '../utils/translations';

interface FoodDetailModalProps {
  food: FoodItem;
  quantityInCart: number;
  isFavorite: boolean;
  lang: Language;
  relatedFoods: FoodItem[];
  onClose: () => void;
  onAddToCartWithOptions: (food: FoodItem, qty: number, options: FoodOption[]) => void;
  onToggleFavorite: (foodId: string) => void;
  onSelectFood: (food: FoodItem) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  food,
  quantityInCart,
  isFavorite,
  lang,
  relatedFoods,
  onClose,
  onAddToCartWithOptions,
  onToggleFavorite,
  onSelectFood,
}) => {
  const t = translations[lang];
  const [selectedOptions, setSelectedOptions] = useState<FoodOption[]>([]);
  const [qty, setQty] = useState(quantityInCart > 0 ? quantityInCart : 1);

  const toggleOption = (option: FoodOption) => {
    if (selectedOptions.some((o) => o.id === option.id)) {
      setSelectedOptions(selectedOptions.filter((o) => o.id !== option.id));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const optionsTotal = selectedOptions.reduce((acc, opt) => acc + opt.price, 0);
  const finalUnitPrice = food.price + optionsTotal;
  const totalPrice = finalUnitPrice * qty;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#061829] border-0 sm:border border-[#C9A24D]/40 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-screen sm:max-h-[92vh] flex flex-col">
        {/* Header Action Overlay */}
        <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
          <button
            onClick={onClose}
            className="pointer-events-auto p-2.5 rounded-full bg-[#020F1E]/80 border border-[#C9A24D]/40 text-[#F5EFE4] hover:text-[#C9A24D] hover:bg-[#020F1E] backdrop-blur-md transition-all shadow-lg"
            aria-label="Back"
          >
            {lang === 'fa' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>

          <button
            onClick={() => onToggleFavorite(food.id)}
            className={`pointer-events-auto p-2.5 rounded-full bg-[#020F1E]/80 border backdrop-blur-md transition-all shadow-lg ${
              isFavorite
                ? 'text-rose-500 border-rose-500/50'
                : 'text-[#F5EFE4] border-[#C9A24D]/40 hover:text-rose-400'
            }`}
            aria-label="Favorite"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 pb-28 sm:pb-24">
          {/* Hero Food Image */}
          <div className="relative w-full h-64 sm:h-80 bg-[#020F1E]">
            <img
              src={food.image}
              alt={lang === 'fa' ? food.name : food.nameEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061829] via-transparent to-black/30" />
            
            {/* Badges on Hero */}
            <div className="absolute bottom-4 start-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#020F1E]/90 border border-[#C9A24D] text-[#F0D47C] text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-md">
                <Star className="w-3.5 h-3.5 fill-current text-[#F0D47C]" />
                <span>{lang === 'fa' ? toPersianDigits(food.rating) : food.rating}</span>
                <span className="text-[#A8A49B] text-[10px]">({lang === 'fa' ? toPersianDigits(food.reviewsCount) : food.reviewsCount} نظر)</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-[#071A2D]/90 border border-[#C9A24D]/40 text-[#F5EFE4] text-xs font-medium backdrop-blur-md flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C9A24D]" />
                <span>{food.preparationTime} {lang === 'fa' ? 'دقیقه' : 'mins'}</span>
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-4 sm:p-6 space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#F8F5EF] leading-snug">
                  {lang === 'fa' ? food.name : food.nameEn}
                </h2>
                <div className="text-xl sm:text-2xl font-bold text-[#F0D47C] font-vazir">
                  {formatPrice(food.price, lang)}
                </div>
              </div>

              <p className="mt-3 text-sm text-[#A8A49B] leading-relaxed font-light">
                {lang === 'fa' ? food.description : food.descriptionEn}
              </p>
            </div>

            {/* Ingredients & Attributes */}
            <div className="p-4 rounded-2xl bg-[#071A2D] border border-[#C9A24D]/25">
              <h4 className="text-xs font-bold text-[#C9A24D] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                <span>{t.ingredients}</span>
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {(lang === 'fa' ? food.ingredients : food.ingredientsEn).map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#0B2238] border border-[#C9A24D]/20 text-[#F5EFE4]/90 text-xs font-light"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Options & Addons */}
            {food.options && food.options.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-[#C9A24D] uppercase tracking-wider mb-3">
                  {t.optionsAndAddons}
                </h4>
                <div className="space-y-2">
                  {food.options.map((opt) => {
                    const isChecked = selectedOptions.some((o) => o.id === opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => toggleOption(opt)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#0B2238] border-[#C9A24D] text-[#F0D47C]'
                            : 'bg-[#071A2D]/60 border-[#C9A24D]/20 text-[#F5EFE4]/80 hover:border-[#C9A24D]/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                              isChecked
                                ? 'bg-[#C9A24D] border-[#C9A24D] text-[#020F1E]'
                                : 'border-[#C9A24D]/40 bg-[#020F1E]'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-sm font-medium">
                            {lang === 'fa' ? opt.name : opt.nameEn}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-[#F0D47C]">
                          +{formatPrice(opt.price, lang)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related Dishes */}
            {relatedFoods.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-[#C9A24D] uppercase tracking-wider mb-3">
                  {t.relatedFoods}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {relatedFoods.slice(0, 2).map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectFood(rel)}
                      className="p-2 rounded-xl bg-[#071A2D] border border-[#C9A24D]/20 hover:border-[#C9A24D]/60 flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <img
                        src={rel.image}
                        alt={rel.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-[#F5EFE4] truncate">
                          {lang === 'fa' ? rel.name : rel.nameEn}
                        </p>
                        <p className="text-[11px] text-[#F0D47C] font-semibold mt-0.5">
                          {formatPrice(rel.price, lang)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Checkout / Add Bar */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 bg-[#071A2D]/95 border-t border-[#C9A24D]/35 backdrop-blur-md flex items-center justify-between gap-3 z-30">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#0B2238] border border-[#C9A24D]/40">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-7 h-7 rounded-lg bg-[#020F1E] text-[#F5EFE4] hover:text-[#C9A24D] flex items-center justify-center transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-bold text-[#F0D47C] min-w-5 text-center font-vazir">
              {lang === 'fa' ? toPersianDigits(qty) : qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-7 h-7 rounded-lg bg-[#C9A24D] text-[#020F1E] hover:bg-[#E4C76A] flex items-center justify-center font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Add to Cart Button with dynamic total */}
          <button
            onClick={() => {
              onAddToCartWithOptions(food, qty, selectedOptions);
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C9A24D] via-[#E4C76A] to-[#C9A24D] text-[#020F1E] font-bold text-sm sm:text-base shadow-lg shadow-[#C9A24D]/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-between"
          >
            <span>{t.addToCart}</span>
            <span className="text-xs sm:text-sm font-black font-vazir">
              {formatPrice(totalPrice, lang)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
