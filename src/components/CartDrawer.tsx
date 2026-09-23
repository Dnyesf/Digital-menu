import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { CartItem, Language } from '../types';
import { formatPrice, toPersianDigits, translations } from '../utils/translations';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  lang: Language;
  onClose: () => void;
  onUpdateQuantity: (foodId: string, delta: number) => void;
  onRemoveItem: (foodId: string) => void;
  onProceedToCheckout: (appliedDiscount: number) => void;
  onExploreMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  lang,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onExploreMenu,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const t = translations[lang];

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => {
    const itemOptionTotal = item.selectedOptions?.reduce((oAcc, o) => oAcc + o.price, 0) || 0;
    return acc + (item.food.price + itemOptionTotal) * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 0 ? 45000 : 0;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyPromo = () => {
    const cleaned = promoCode.trim().toUpperCase();
    if (cleaned === 'SHAYGAN' || cleaned === 'SHAYGAN1403' || cleaned === 'ROYAL') {
      setDiscountPercent(15);
      setPromoMessage({ text: t.codeApplied, isError: false });
    } else {
      setDiscountPercent(0);
      setPromoMessage({ text: t.invalidCode, isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#061829] border-s border-[#C9A24D]/35 flex flex-col h-full shadow-2xl z-10 overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-[#071A2D] border-b border-[#C9A24D]/25 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C9A24D]" />
            <h2 className="font-amiri text-xl font-bold text-[#F8F5EF]">
              {t.cart} ({lang === 'fa' ? toPersianDigits(items.reduce((s, i) => s + i.quantity, 0)) : items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#020F1E] border border-[#C9A24D]/30 text-[#A8A49B] hover:text-[#F0D47C] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="py-20 text-center px-4">
              <div className="w-20 h-20 rounded-full bg-[#071A2D] border border-[#C9A24D]/30 flex items-center justify-center mx-auto mb-4 text-[#C9A24D]">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h3 className="font-amiri text-xl font-bold text-[#F8F5EF]">{t.cartEmpty}</h3>
              <p className="text-xs text-[#A8A49B] mt-2 max-w-xs mx-auto leading-relaxed">
                {t.cartEmptyDesc}
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExploreMenu();
                }}
                className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A24D] to-[#8A6A32] text-[#020F1E] font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-all"
              >
                {t.viewMenuCTA}
              </button>
            </div>
          ) : (
            items.map((item) => {
              const itemUnitTotal = item.food.price + (item.selectedOptions?.reduce((s, o) => s + o.price, 0) || 0);
              return (
                <div
                  key={item.food.id}
                  className="p-3 rounded-2xl bg-[#071A2D] border border-[#C9A24D]/25 flex items-center gap-3 transition-all hover:border-[#C9A24D]/50"
                >
                  <img
                    src={item.food.image}
                    alt={item.food.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#C9A24D]/30"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-amiri text-sm font-bold text-[#F8F5EF] truncate">
                        {lang === 'fa' ? item.food.name : item.food.nameEn}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.food.id)}
                        className="text-[#A8A49B] hover:text-rose-400 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <p className="text-[10px] text-[#A8A49B] truncate">
                        {item.selectedOptions.map((o) => (lang === 'fa' ? o.name : o.nameEn)).join(', ')}
                      </p>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F0D47C] font-vazir">
                        {formatPrice(itemUnitTotal * item.quantity, lang)}
                      </span>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 px-2 py-0.5 rounded-lg bg-[#0B2238] border border-[#C9A24D]/40">
                        <button
                          onClick={() => onUpdateQuantity(item.food.id, -1)}
                          className="text-[#F5EFE4] hover:text-[#C9A24D] p-1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[#F0D47C] min-w-4 text-center font-vazir">
                          {lang === 'fa' ? toPersianDigits(item.quantity) : item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.food.id, 1)}
                          className="text-[#F5EFE4] hover:text-[#C9A24D] p-1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#071A2D] border-t border-[#C9A24D]/30 space-y-4">
            {/* Promo Code Input */}
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder={lang === 'fa' ? 'کد تخفیف: SHAYGAN' : 'Promo Code: SHAYGAN'}
                    className="w-full py-2 ps-8 pe-3 rounded-xl bg-[#0B2238] border border-[#C9A24D]/35 text-xs text-[#F8F5EF] placeholder-[#A8A49B]/50 uppercase tracking-wider focus:outline-none focus:border-[#C9A24D]"
                  />
                  <Tag className="w-3.5 h-3.5 text-[#C9A24D] absolute top-1/2 -translate-y-1/2 start-2.5" />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-3 py-2 rounded-xl bg-[#0B2238] border border-[#C9A24D] text-[#F0D47C] text-xs font-bold hover:bg-[#C9A24D]/20 transition-all"
                >
                  {t.applyCode}
                </button>
              </div>
              {promoMessage && (
                <p className={`text-[11px] ${promoMessage.isError ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {promoMessage.text}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-[#A8A49B] pt-2 border-t border-[#C9A24D]/15">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="text-[#F5EFE4] font-medium font-vazir">{formatPrice(subtotal, lang)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.deliveryFee}</span>
                <span className="text-[#F5EFE4] font-medium font-vazir">{formatPrice(deliveryFee, lang)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>{t.discount} (۱۵٪)</span>
                  <span className="font-vazir">-{formatPrice(discountAmount, lang)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base font-bold text-[#F8F5EF] pt-2 border-t border-[#C9A24D]/20">
                <span className="text-[#F0D47C]">{t.total}</span>
                <span className="text-[#F0D47C] font-vazir font-black">{formatPrice(grandTotal, lang)}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              id="cart-checkout-btn"
              onClick={() => {
                onClose();
                onProceedToCheckout(discountAmount);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C9A24D] via-[#E4C76A] to-[#C9A24D] text-[#020F1E] font-bold text-sm sm:text-base shadow-lg shadow-[#C9A24D]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>{t.checkout}</span>
              {lang === 'fa' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#A8A49B]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24D]" />
              <span>پک گرم ویژه، ظروف تشریفاتی و ضمانت سلامت غذا</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
