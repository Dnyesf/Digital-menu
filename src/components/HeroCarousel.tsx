import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { HeroSlide, Language } from '../types';
import { translations } from '../utils/translations';

interface HeroCarouselProps {
  slides: HeroSlide[];
  lang: Language;
  onCtaClick: (action: 'menu' | 'reservation' | 'food', targetId?: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  lang,
  onCtaClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const t = translations[lang];

  const minSwipeDistance = 50;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Depending on RTL/LTR:
    if (lang === 'fa') {
      if (isLeftSwipe) {
        prevSlide();
      } else if (isRightSwipe) {
        nextSlide();
      }
    } else {
      if (isLeftSwipe) {
        nextSlide();
      } else if (isRightSwipe) {
        prevSlide();
      }
    }
  };

  const currentSlide = slides[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden bg-[#020F1E] select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-width visual container with animated luxury movement */}
      <div className="relative h-[480px] sm:h-[540px] md:h-[600px] w-full overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          >
            {/* Animated Background Image: Ken Burns continuous motion */}
            <img
              src={slide.image}
              alt={lang === 'fa' ? slide.title : slide.titleEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center animate-hero-pan will-change-transform"
            />
            
            {/* Luxury Atmospheric Lighting & Dark Vignettes: seamless transition */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020F1E] via-[#020F1E]/50 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#020F1E]" />
            <div className="absolute inset-0 bg-radial from-transparent via-[#020F1E]/30 to-[#020F1E]/80 pointer-events-none" />

            {/* Subtle Golden ambient shimmer glow */}
            <div className="absolute top-1/4 -right-16 w-80 h-80 rounded-full bg-[#C9A24D]/10 blur-3xl pointer-events-none animate-pulse-glow" />
          </div>
        ))}

        {/* Content Overlay: padded at top so transparent header logo & buttons sit pristinely over the image */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end pt-28 pb-14 sm:pb-16 px-5 sm:px-8 md:px-12 max-w-7xl mx-auto">
          <div className="max-w-xl sm:max-w-2xl space-y-3 sm:space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#061829]/75 border border-[#C9A24D]/60 backdrop-blur-md shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#F0D47C]" />
              <span className="text-xs sm:text-sm font-semibold text-[#F0D47C]">
                {lang === 'fa' ? currentSlide.badge : currentSlide.badgeEn}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-amiri text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F8F5EF] leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              {lang === 'fa' ? currentSlide.title : currentSlide.titleEn}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-[#F5EFE4]/90 line-clamp-2 max-w-lg leading-relaxed font-light drop-shadow-md">
              {lang === 'fa' ? currentSlide.subtitle : currentSlide.subtitleEn}
            </p>

            {/* Action CTA Button */}
            <div className="pt-2 sm:pt-4 flex items-center">
              <button
                id="hero-cta-btn"
                onClick={() => onCtaClick(currentSlide.ctaAction, currentSlide.targetFoodId)}
                className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#C9A24D] via-[#F0D47C] to-[#C9A24D] text-[#020F1E] font-bold text-sm sm:text-base shadow-xl shadow-[#C9A24D]/25 hover:shadow-[#C9A24D]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>{lang === 'fa' ? currentSlide.ctaText : currentSlide.ctaTextEn}</span>
                {lang === 'fa' ? <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> : <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows (Desktop) */}
        <button
          onClick={lang === 'fa' ? nextSlide : prevSlide}
          className="hidden sm:flex absolute top-1/2 -translate-y-1/2 start-4 z-30 p-2.5 rounded-full bg-[#071A2D]/70 border border-[#C9A24D]/40 text-[#F5EFE4] hover:text-[#C9A24D] hover:bg-[#071A2D] transition-all"
          aria-label="Previous Slide"
        >
          {lang === 'fa' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <button
          onClick={lang === 'fa' ? prevSlide : nextSlide}
          className="hidden sm:flex absolute top-1/2 -translate-y-1/2 end-4 z-30 p-2.5 rounded-full bg-[#071A2D]/70 border border-[#C9A24D]/40 text-[#F5EFE4] hover:text-[#C9A24D] hover:bg-[#071A2D] transition-all"
          aria-label="Next Slide"
        >
          {lang === 'fa' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        {/* Indicators ● ○ ○ ○ */}
        <div className="absolute bottom-4 inset-x-0 z-30 flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? 'w-6 h-2 bg-[#C9A24D] shadow-sm shadow-[#C9A24D]'
                  : 'w-2 h-2 bg-[#F5EFE4]/35 hover:bg-[#F5EFE4]/60'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
