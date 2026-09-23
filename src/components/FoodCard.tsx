import React from 'react';
import { Plus, Minus, Trash2, Heart } from 'lucide-react';
import { FoodItem, Language } from '../types';
import { toPersianDigits } from '../utils/translations';

interface FoodCardProps {
  food: FoodItem;
  quantity: number;
  isFavorite: boolean;
  lang: Language;
  onAddToCart: (food: FoodItem) => void;
  onRemoveFromCart: (foodId: string) => void;
  onToggleFavorite: (foodId: string) => void;
  onClickDetail: (food: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  quantity,
  isFavorite,
  lang,
  onAddToCart,
  onRemoveFromCart,
  onToggleFavorite,
  onClickDetail,
}) => {
  const isAvailable = food.isAvailable !== false;
  const hasDiscount = Boolean(food.discountPercent && food.discountPercent > 0 && food.originalPrice && food.originalPrice > food.price);

  return (
    <div 
      className={`w-full bg-transparent border-b border-[#C9A24D]/15 pb-4 mb-2 transition-all duration-200 flex flex-row items-stretch justify-between gap-3 sm:gap-4 select-none ${
        !isAvailable ? 'opacity-55 grayscale cursor-not-allowed' : ''
      }`}
    >
      
      {/* 
        RIGHT SIDE (In RTL):
        - Food Name (Bold, elegant)
        - Food Description (Natural text, clean line height)
        - Bottom Right: Red discount badge + Strikethrough Price + Final Price in Toman
      */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div className="space-y-1.5">
          <h3
            onClick={() => isAvailable && onClickDetail(food)}
            className={`font-bold text-base sm:text-lg transition-colors leading-snug ${
              isAvailable 
                ? 'text-[#F8F5EF] hover:text-[#f0d47c] cursor-pointer' 
                : 'text-stone-400 cursor-not-allowed'
            }`}
          >
            {lang === 'fa' ? food.name : food.nameEn}
          </h3>

          <p
            onClick={() => isAvailable && onClickDetail(food)}
            className={`text-xs sm:text-sm leading-relaxed font-light line-clamp-3 ${
              isAvailable ? 'text-[#A8A49B] cursor-pointer' : 'text-stone-500 cursor-not-allowed'
            }`}
          >
            {lang === 'fa' ? food.description : food.descriptionEn}
          </p>
        </div>

        {/* Pricing & Discount */}
        <div className="flex flex-col gap-1 mt-3">
          {/* Discount Badge - Only shown when discount exists */}
          {hasDiscount && (
            <div>
              <span className="inline-flex items-center bg-[#E53935] text-white font-bold text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded font-vazir shadow-sm">
                %{toPersianDigits(food.discountPercent!)}
              </span>
            </div>
          )}

          {/* Strikethrough & Final Price - Strikethrough ONLY shown if there is discount */}
          <div className="flex items-baseline gap-2 font-vazir">
            {hasDiscount && food.originalPrice && (
              <span className="text-xs text-[#A8A49B]/70 line-through">
                {toPersianDigits(food.originalPrice.toLocaleString())}
              </span>
            )}

            <div className="flex items-baseline gap-1">
              <span className={`font-extrabold text-sm sm:text-base ${isAvailable ? 'text-[#F8F5EF]' : 'text-stone-400'}`}>
                {toPersianDigits(food.price.toLocaleString())}
              </span>
              <span className="text-[11px] sm:text-xs text-[#A8A49B]">تومان</span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        LEFT SIDE (In RTL):
        - Square Food Image with Favorite button in corner opposite to food name
        - Directly below image:
          - If unavailable: Gray "ناموجود" pill
          - If quantity === 0: Button [+ افزودن] with color #f0d47c
          - If quantity > 0: Interactive Stepper
      */}
      <div className={`w-24 sm:w-28 shrink-0 flex flex-col ${food.hideImage ? 'justify-end items-end' : 'items-center justify-between gap-2.5'}`}>
        {/* Square Food Image with Corner Favorite Button */}
        {!food.hideImage && (
          <div className="relative w-full aspect-square rounded-[8px] overflow-hidden bg-black/30 shrink-0 shadow-sm group">
            <img
              src={food.image}
              alt={lang === 'fa' ? food.name : food.nameEn}
              referrerPolicy="no-referrer"
              onClick={() => isAvailable && onClickDetail(food)}
              className={`w-full h-full object-cover object-center transition-transform duration-300 ${
                isAvailable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed filter grayscale'
              }`}
            />

            {/* Favorite button on image corner (opposite side to food name in RTL: top-right or top-left) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(food.id);
              }}
              className={`absolute top-1.5 start-1.5 p-1.5 rounded-full backdrop-blur-md transition-all shadow-md active:scale-90 ${
                isFavorite
                  ? 'bg-black/70 text-rose-500 scale-105'
                  : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/70'
              }`}
              title={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
              aria-label="افزودن به علاقه‌مندی‌ها"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        )}

        {/* Add / Stepper Button */}
        <div className="w-full">
          {!isAvailable ? (
            /* Unavailable state: Gray pill, non-clickable */
            <div className="w-full py-1.5 rounded-[6px] bg-stone-800/80 border border-stone-600/40 text-stone-400 font-bold text-[11px] text-center select-none cursor-not-allowed">
              ناموجود
            </div>
          ) : quantity > 0 ? (
            /* Selected Stepper State with border-radius: 6px and #f0d47c */
            <div className="w-full h-8 px-1.5 rounded-[6px] bg-[#061829] border border-[#f0d47c]/60 text-[#f0d47c] flex items-center justify-between font-vazir text-xs shadow-sm">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromCart(food.id);
                }}
                className="p-1 text-[#f0d47c] hover:text-white transition-colors active:scale-90"
                aria-label="کاهش"
              >
                {quantity === 1 ? (
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Minus className="w-3.5 h-3.5" />
                )}
              </button>

              <span className="font-bold text-xs sm:text-sm text-[#f0d47c]">
                {toPersianDigits(quantity)}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(food);
                }}
                className="p-1 text-[#f0d47c] hover:text-white transition-colors active:scale-90"
                aria-label="افزایش"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            /* Default State: [+ افزودن] button with border-radius: 6px and color #f0d47c */
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(food);
              }}
              className="w-full py-1.5 px-2 rounded-[6px] bg-[#f0d47c]/15 hover:bg-[#f0d47c]/25 border border-[#f0d47c]/40 text-[#f0d47c] font-bold text-xs sm:text-sm flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm"
              title="افزودن به سبد خرید"
            >
              <span className="text-sm font-black">+</span>
              <span>افزودن</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
