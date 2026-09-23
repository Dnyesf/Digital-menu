import React from 'react';
import { X } from 'lucide-react';
import { CategoryInfo, FoodItem, Language } from '../types';
import { toPersianDigits } from '../utils/translations';

interface CategorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryInfo[];
  foods: FoodItem[];
  lang: Language;
  onSelectCategory: (categoryId: string) => void;
}

export const CategorySheet: React.FC<CategorySheetProps> = ({
  isOpen,
  onClose,
  categories,
  foods,
  lang,
  onSelectCategory,
}) => {
  if (!isOpen) return null;

  // Calculate count for each category
  const getCategoryCount = (catId: string) => {
    return foods.filter((f) => f.category === catId).length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      {/* Bottom Sheet Drawer */}
      <div
        className="relative w-full max-w-lg bg-[#071A2D] border-t border-[#C9A24D]/35 rounded-t-3xl shadow-[0_-15px_50px_rgba(0,0,0,0.8)] z-10 max-h-[80vh] flex flex-col animate-slideUp overflow-hidden"
      >
        {/* Drag Handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-white/25" />
        </div>

        {/* Drawer Header: Title 'منو' on right, '✕' on left */}
        <div className="px-5 py-3 border-b border-[#C9A24D]/20 flex items-center justify-between">
          <h3 className="font-amiri text-xl sm:text-2xl font-bold text-[#F8F5EF]">
            {lang === 'fa' ? 'منو' : 'Menu'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-[#A8A49B] hover:text-[#F8F5EF] flex items-center justify-center transition-colors"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Items List with counts */}
        <div className="overflow-y-auto divide-y divide-white/10 px-4 py-2">
          {categories.map((cat) => {
            const count = getCategoryCount(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onClose();
                }}
                className="w-full py-4 px-3 flex items-center justify-between text-start hover:bg-[#C9A24D]/10 rounded-xl transition-colors group"
              >
                {/* Category Name on Right (in RTL) */}
                <span className="font-medium text-sm sm:text-base text-[#F8F5EF] group-hover:text-[#F0D47C] transition-colors">
                  {lang === 'fa' ? cat.name : cat.nameEn}
                </span>

                {/* Dish Count on Left (in RTL) */}
                <span className="text-sm font-vazir text-[#A8A49B] group-hover:text-[#F0D47C] font-semibold">
                  {lang === 'fa' ? toPersianDigits(count) : count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
