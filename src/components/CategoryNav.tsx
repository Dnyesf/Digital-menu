import React, { useRef } from 'react';
import { Search } from 'lucide-react';
import { CategoryInfo, Language } from '../types';

interface CategoryNavProps {
  categories: CategoryInfo[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  lang: Language;
  onOpenSearch?: () => void;
  onOpenMenuDrawer?: () => void;
  variant?: 'visual' | 'compact' | string;
  isFixed?: boolean;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  lang,
  onOpenSearch,
  onOpenMenuDrawer,
  isFixed,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Filter out any 'all' category if present
  const validCategories = categories.filter((c) => c.id !== 'all');

  const handleTabClick = (catId: string) => {
    onSelectCategory(catId);
    const btn = tabButtonRefs.current[catId];
    const container = scrollRef.current;
    if (btn && container) {
      // In RTL layout with flex items next to search icon (which is on the right side),
      // we scroll the container so this button aligns at the start right next to the search icon.
      const containerRect = container.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      
      // Distance from the container's right edge to the button's right edge
      const offsetRight = containerRect.right - btnRect.right;
      
      // Scroll the container so button aligns near the right edge (right next to search icon)
      container.scrollBy({
        left: -offsetRight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div
      className={`w-full bg-[#020F1E]/95 backdrop-blur-md border-0 border-none shadow-none outline-none transition-all duration-100 select-none ${
        isFixed ? 'fixed top-0 inset-x-0 z-40' : 'relative z-30'
      }`}
      style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
    >
      <div 
        className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center gap-2 sm:gap-3 border-0 border-none outline-none"
        style={{ border: 'none', outline: 'none' }}
      >
        {/* 
          RIGHT SIDE (In RTL):
          1. Menu Drawer Icon: Rounded square with 3 bullet lines, matching user's image
          2. Search Icon: Clean magnifying glass, matching user's image
        */}
        {(onOpenMenuDrawer || onOpenSearch) && (
          <div className="flex items-center gap-1 shrink-0 border-0 border-none">
            {/* List / Menu Icon matching screenshot */}
            {onOpenMenuDrawer && (
              <button
                onClick={onOpenMenuDrawer}
                className="p-1.5 text-[#8E8E93] hover:text-[#F8F5EF] transition-colors rounded-lg flex items-center justify-center active:scale-95 border-0 border-none"
                title="مشاهده عناوین منو"
                aria-label="مشاهده عناوین منو"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-[21px] h-[21px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                  <circle cx="7.8" cy="8.5" r="0.85" fill="currentColor" stroke="none" />
                  <line x1="10.8" y1="8.5" x2="16.5" y2="8.5" />
                  <circle cx="7.8" cy="12" r="0.85" fill="currentColor" stroke="none" />
                  <line x1="10.8" y1="12" x2="16.5" y2="12" />
                  <circle cx="7.8" cy="15.5" r="0.85" fill="currentColor" stroke="none" />
                  <line x1="10.8" y1="15.5" x2="16.5" y2="15.5" />
                </svg>
              </button>
            )}

            {/* Search Icon matching screenshot */}
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-1.5 text-[#8E8E93] hover:text-[#F8F5EF] transition-colors rounded-lg flex items-center justify-center active:scale-95 border-0 border-none"
                title="جستجو در منو"
                aria-label="جستجو در منو"
              >
                <Search className="w-[21px] h-[21px]" strokeWidth={1.9} />
              </button>
            )}
          </div>
        )}

        {/* 
          3. Horizontal Scrollable Category Tabs:
          - Absolutely no border on container
          - Clicking scrolls smoothly to align tab right next to the search icon
          - Active: Bold text with solid rounded underline indicator pill at the bottom edge
        */}
        <div
          ref={scrollRef}
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar scroll-smooth py-0.5 px-1 flex-1 border-0 border-none outline-none"
          style={{ border: 'none', outline: 'none' }}
        >
          {validCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                ref={(el) => {
                  tabButtonRefs.current[cat.id] = el;
                }}
                onClick={() => handleTabClick(cat.id)}
                className={`relative whitespace-nowrap px-3 pt-1.5 pb-2.5 text-sm sm:text-base transition-colors shrink-0 flex flex-col items-center justify-center border-none ${
                  isActive
                    ? 'font-bold text-[#F8F5EF]'
                    : 'font-normal text-[#8E8E93] hover:text-[#F8F5EF]'
                }`}
              >
                <span>{lang === 'fa' ? cat.name : cat.nameEn}</span>

                {/* Thick rounded underline indicator pill under active tab, exactly as shown in reference image */}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-2 h-[3.5px] bg-[#f0d47c] rounded-full shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
