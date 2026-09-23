import React, { useState } from 'react';
import { 
  ArrowRight, 
  Trash2, 
  Plus, 
  Minus, 
  ChevronDown, 
  ChevronUp,
  ChevronLeft,
  Bike,
  Store,
  Clock,
  Building2,
  Tag,
  Check,
  X,
  Gem
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, FoodItem, Language, Order, UserProfile } from '../types';
import { toPersianDigits } from '../utils/translations';
import { api } from '../services/api';

// Image Logo for SEP (سامان الکترونیک پرداخت) matching user provided logo
const SepLogo: React.FC = () => (
  <img
    src="https://www.eghtesadonline.com/media/bb50e183ZTp3ZWJwfGY6L2ZpbGVzL2ZhL25ld3MvMTQwMi83LzE5LzExMDQyNjJfODE4LmpwZ3xmdWk6MTEyNzU5NXxsOmZhfHY6MQ.webp"
    alt="سپ - پرداخت الکترونیک سامان"
    className="w-full h-full object-contain"
  />
);

// Image Logo for AP (آسان پرداخت / آپ) matching user provided logo
const ApLogo: React.FC = () => (
  <img
    src="https://s.cafebazaar.ir/images/icons/com.sibche.aspardproject.app_512x512.png?x-img=v1/resize,h_256,w_256,lossless_false/optimize"
    alt="آپ - آسان پرداخت"
    className="w-full h-full object-contain"
  />
);

interface CartViewProps {
  items: CartItem[];
  lang: Language;
  step: 1 | 2;
  onSetStep: (step: 1 | 2) => void;
  orderNotes: string;
  onSetOrderNotes: (notes: string) => void;
  onUpdateQuantity: (foodId: string, delta: number) => void;
  onRemoveItem: (foodId: string) => void;
  onClearCart: () => void;
  onAddToCart: (food: FoodItem) => void;
  onBackToHome: () => void;
  onCompleteOrder: (order: Order) => void;
  allFoods: FoodItem[];
  onClickDetail?: (food: FoodItem) => void;
  currentUser?: UserProfile | null;
  onOpenLoginModal?: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  lang,
  step,
  onSetStep,
  orderNotes,
  onSetOrderNotes,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddToCart,
  onBackToHome,
  onCompleteOrder,
  allFoods,
  onClickDetail,
  currentUser,
  onOpenLoginModal,
}) => {
  // Step 2 Form States
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'in_person'>('courier');
  const defaultUserAddr = currentUser?.addresses?.[0]?.address || 'امیر، ناحیه ۴، منطقه ۲، بلوار خیام، خیام ۵۰، بین نیلوفر ۳ و ۵ پلاک ۶۵';
  const [deliveryAddress, setDeliveryAddress] = useState(defaultUserAddr);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState(defaultUserAddr);

  // Payment Gateway: Only SEP and AP (as requested)
  const [selectedGateway, setSelectedGateway] = useState<'ap' | 'saman'>('ap');

  // Promo code bottom sheet / modal state
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; amount: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Expand items in Step 2
  const [showOrderItemsDetail, setShowOrderItemsDetail] = useState(false);

  // Expand discount items breakdown dropdown
  const [isDiscountDropdownOpen, setIsDiscountDropdownOpen] = useState(false);

  // Address save
  const handleSaveAddress = () => {
    if (tempAddress.trim()) {
      setDeliveryAddress(tempAddress.trim());
    }
    setIsEditingAddress(false);
  };

  // Calculations
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Raw subtotal
  const rawSubtotal = items.reduce((acc, item) => {
    const origPrice = item.food.originalPrice || item.food.price;
    return acc + origPrice * item.quantity;
  }, 0);

  // Actual discounted subtotal from foods
  const actualSubtotal = items.reduce((acc, item) => {
    return acc + item.food.price * item.quantity;
  }, 0);

  // Discounts
  const itemDiscounts = Math.max(0, rawSubtotal - actualSubtotal);
  const couponDiscount = appliedPromo ? appliedPromo.amount : 0;
  const totalDiscounts = itemDiscounts + couponDiscount;

  // Delivery fee (24,000 as per screenshot)
  const deliveryFee = deliveryMethod === 'courier' && items.length > 0 ? 24000 : 0;

  // Taxes (roughly 9% as in screenshot)
  const taxes = items.length > 0 ? Math.round(actualSubtotal * 0.09) : 0;

  // Final Payable amount
  const grandTotal = Math.max(0, actualSubtotal + deliveryFee + taxes - couponDiscount);

  // Complementary / Upsell items for "محصولی از قلم نیفتاده؟"
  // Shows all appetizer, dessert and drink items completely
  const upsellCandidates = allFoods.filter(
    (f) => f.category === 'appetizer' || f.category === 'dessert' || f.category === 'drink'
  );

  // Apply Promo via Backend API
  const handleCheckPromo = async () => {
    setPromoError(null);
    const clean = promoCode.trim().toUpperCase();
    if (!clean) {
      setPromoError('لطفاً کد تخفیف را وارد کنید');
      return;
    }

    try {
      const res = await api.verifyCoupon({
        code: clean,
        orderAmount: actualSubtotal,
        phone: '09123456789',
      });
      setAppliedPromo({ code: clean, amount: res.discountAmount });
      setIsPromoModalOpen(false);
      setPromoCode('');
    } catch (err: any) {
      setPromoError(err.message || 'کد تخفیف وارد شده معتبر نمی‌باشد');
    }
  };

  // Final Pay Action
  const handleFinalPayment = async () => {
    // Check if user is logged in
    if (!currentUser) {
      if (onOpenLoginModal) {
        onOpenLoginModal();
      }
      return;
    }

    try {
      const backendRes = await api.createOrder({
        customerName: currentUser.fullName || 'مشتری کاخ شایگان',
        phone: currentUser.phone || '09123456789',
        address: deliveryMethod === 'courier' ? deliveryAddress : 'مراجعه حضوری به سالن رستوران شایگان',
        items,
        subtotal: rawSubtotal,
        deliveryFee,
        discount: totalDiscounts,
        couponCode: appliedPromo?.code,
        total: grandTotal,
        deliveryType: deliveryMethod === 'courier' ? 'delivery' : 'pickup',
        paymentMethod: 'online',
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f0d47c', '#C9A24D', '#E4C76A', '#ffffff'],
        });
      } catch {
        // ignore
      }

      onCompleteOrder(backendRes.order);
    } catch {
      // Fallback local order
      const generatedId = `SH-${Math.floor(10000 + Math.random() * 90000)}`;
      const newOrder: Order = {
        id: generatedId,
        items,
        subtotal: rawSubtotal,
        deliveryFee,
        discount: totalDiscounts,
        total: grandTotal,
        deliveryType: deliveryMethod === 'courier' ? 'delivery' : 'pickup',
        address: deliveryMethod === 'courier' ? deliveryAddress : 'مراجعه حضوری به رستوران شایگان',
        phone: currentUser.phone || '۰۹۱۲۳۴۵۶۷۸۹',
        paymentMethod: 'online',
        status: 'submitted',
        orderTime: `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')} - امروز`,
        etaMinutes: 20,
      };
      onCompleteOrder(newOrder);
    }
  };

  return (
    <div dir="rtl" className="w-full max-w-xl md:max-w-4xl mx-auto min-h-screen bg-[#020F1E] text-[#F8F5EF] flex flex-col font-vazir pb-52 animate-fadeIn">
      {/* 
        ====================================================
        HEADER
        ====================================================
      */}
      <div className="sticky top-0 z-30 bg-[#020F1E]/95 backdrop-blur-md px-4 py-3.5 border-b border-white/[0.08] flex items-center justify-between">
        {/* Right side: Arrow back + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (step === 2) {
                onSetStep(1);
              } else {
                onBackToHome();
              }
            }}
            className="p-1 text-[#F8F5EF] hover:text-[#f0d47c] transition-colors"
            title="بازگشت"
            aria-label="بازگشت"
          >
            <ArrowRight className="w-5 h-5 stroke-[2.2]" />
          </button>

          <h1 className="font-bold text-base sm:text-lg text-[#F8F5EF]">
            {step === 1 ? 'سبد خرید' : 'تأیید نهایی و پرداخت'}
          </h1>
        </div>

        {/* Left side: Trash icon (Only on Step 1) */}
        {step === 1 && items.length > 0 && (
          <button
            onClick={() => onClearCart()}
            className="px-2.5 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 active:scale-95 transition-all rounded-lg cursor-pointer flex items-center gap-1.5 border border-rose-500/20"
            title="حذف کل سبد خرید"
            aria-label="حذف کل سبد خرید"
          >
            <Trash2 className="w-4 h-4 stroke-[2]" />
            <span className="text-xs font-bold">حذف کل سبد</span>
          </button>
        )}
      </div>

      {/* 
        ====================================================
        EMPTY CART STATE (When 0 items)
        ====================================================
      */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 my-auto">
          <div className="w-20 h-20 rounded-full bg-[#061829] border border-white/10 flex items-center justify-center text-[#f0d47c]/60 shadow-lg">
            <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-[#F8F5EF]">سبد خرید شما خالی است</h3>
            <p className="text-xs text-[#A8A49B] max-w-xs">
              می‌توانید لذیذترین غذاهای اصیل ایرانی را از منوی رستوران شایگان به سبد خود اضافه کنید.
            </p>
          </div>
          <button
            onClick={onBackToHome}
            className="mt-2 px-6 py-2.5 rounded-[6px] bg-[#f0d47c] text-[#020F1E] font-bold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            مشاهده منوی رستوران
          </button>
        </div>
      ) : (
        <>
          {/* 
            ====================================================
            STEP 1: سبد خرید (Clean Flat Layout with Thick Dividers)
            ====================================================
          */}
          {step === 1 && (
            <div className="flex flex-col">
              {/* 1. CART ITEMS LIST */}
              <div className="px-4 py-2">
                {items.map((item) => {
                  const originalPrice = item.food.originalPrice || item.food.price;
                  const discountPct = item.food.discountPercent || (originalPrice > item.food.price ? Math.round(((originalPrice - item.food.price) / originalPrice) * 100) : 0);

                  return (
                    <div
                      key={item.food.id}
                      className="border-b border-white/[0.08] last:border-b-0 py-4 flex flex-col gap-2.5"
                    >
                      {/* Top Row: Title on right, Image on left */}
                      <div className="flex items-center justify-between gap-3">
                        <h3
                          onClick={() => onClickDetail && onClickDetail(item.food)}
                          className="font-bold text-base text-[#F8F5EF] cursor-pointer hover:text-[#f0d47c] transition-colors leading-snug"
                        >
                          {lang === 'fa' ? item.food.name : item.food.nameEn}
                        </h3>

                        {/* Thumbnail image with border-radius: 6px */}
                        <div
                          onClick={() => onClickDetail && onClickDetail(item.food)}
                          className="w-14 h-14 rounded-[6px] overflow-hidden bg-[#061829] shrink-0 border border-white/10 cursor-pointer shadow-sm"
                        >
                          <img
                            src={item.food.image}
                            alt={item.food.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Bottom Row: Stepper on right (in RTL), Price & Discount on left */}
                      <div className="flex items-center justify-between">
                        {/* Stepper Controller */}
                        <div className="h-8 px-2 rounded-[6px] bg-[#061829] border border-[#f0d47c]/50 text-[#f0d47c] flex items-center gap-2.5 text-xs shadow-sm">
                          <button
                            onClick={() => onUpdateQuantity(item.food.id, 1)}
                            className="p-1 text-[#f0d47c] hover:text-white transition-colors active:scale-90"
                            title="افزایش"
                            aria-label="افزایش"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>

                          <span className="font-bold text-sm text-[#F8F5EF] min-w-3 text-center">
                            {toPersianDigits(item.quantity)}
                          </span>

                          <button
                            onClick={() => {
                              if (item.quantity === 1) {
                                onRemoveItem(item.food.id);
                              } else {
                                onUpdateQuantity(item.food.id, -1);
                              }
                            }}
                            className="p-1 text-[#f0d47c] hover:text-white transition-colors active:scale-90"
                            title={item.quantity === 1 ? 'حذف' : 'کاهش'}
                            aria-label={item.quantity === 1 ? 'حذف' : 'کاهش'}
                          >
                            {item.quantity === 1 ? (
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            ) : (
                              <Minus className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* Pricing & Discount */}
                        <div className="flex items-center gap-2">
                          {discountPct > 0 && (
                            <span className="bg-[#E53935] text-white font-bold text-[10px] px-1.5 py-0.5 rounded-[4px] font-vazir shadow-sm">
                              %{toPersianDigits(discountPct)}
                            </span>
                          )}

                          <div className="flex items-baseline gap-1.5">
                            {originalPrice > item.food.price && (
                              <span className="text-xs text-[#A8A49B]/70 line-through">
                                {toPersianDigits(originalPrice.toLocaleString())}
                              </span>
                            )}
                            <div className="flex items-baseline gap-1">
                              <span className="font-bold text-base text-[#F8F5EF]">
                                {toPersianDigits((item.food.price * item.quantity).toLocaleString())}
                              </span>
                              <span className="text-xs text-[#A8A49B]">تومان</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Thick divider between cart items and carousel */}
              <div className="h-2.5 bg-[#010811] w-full shrink-0" />

              {/* 2. SECTION: محصولی از قلم نیفتاده؟ (Complementary Carousel - Compact & Persistent) */}
              {upsellCandidates.length > 0 && (
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="font-bold text-xs sm:text-sm text-[#F8F5EF]">
                      محصولی از قلم نیفتاده؟
                    </h4>
                  </div>

                  <div className="flex items-stretch gap-2.5 overflow-x-auto hide-scrollbar pb-2">
                    {upsellCandidates.map((food) => {
                      const inCartQty = items.find((it) => it.food.id === food.id)?.quantity || 0;
                      return (
                        <div
                          key={food.id}
                          className="w-24 sm:w-28 shrink-0 flex flex-col justify-between bg-[#061829]/70 border border-white/[0.08] rounded-[8px] p-1.5 select-none hover:border-[#f0d47c]/40 transition-colors"
                        >
                          {/* Image with round "+" / quantity button */}
                          <div className="relative w-full aspect-square rounded-[6px] overflow-hidden bg-[#020F1E] border border-white/10">
                            <img
                              src={food.image}
                              alt={food.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            {/* Quantity badge if in cart */}
                            {inCartQty > 0 && (
                              <span className="absolute top-1 start-1 bg-[#f0d47c] text-[#020F1E] text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                                {toPersianDigits(inCartQty)}
                              </span>
                            )}
                            {/* Round + Button */}
                            <button
                              onClick={() => onAddToCart(food)}
                              className="absolute bottom-1 end-1 w-6 h-6 rounded-full bg-[#f0d47c] text-[#020F1E] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                              title="افزودن به سبد"
                              aria-label="افزودن"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>

                          {/* Title & Price */}
                          <div className="pt-1.5 flex flex-col justify-between flex-1">
                            <span className="font-medium text-[11px] text-[#F8F5EF] line-clamp-1 leading-tight" title={food.name}>
                              {food.name}
                            </span>
                            <div className="flex items-baseline gap-0.5 mt-1">
                              <span className="font-bold text-[11px] text-[#f0d47c]">
                                {toPersianDigits(food.price.toLocaleString())}
                              </span>
                              <span className="text-[9px] text-[#A8A49B]">ت</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Thick divider before Order Notes */}
              <div className="h-2.5 bg-[#010811] w-full shrink-0" />

              {/* 3. SECTION: توضیحات روی سفارش */}
              <div className="px-4 py-3 space-y-2">
                <h4 className="font-bold text-sm sm:text-base text-[#F8F5EF]">
                  توضیحات روی سفارش
                </h4>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => onSetOrderNotes(e.target.value)}
                  placeholder="اگر سفارشتان نیاز به توضیحات دارد اینجا بنویسید."
                  className="w-full p-3 rounded-[6px] bg-[#061829]/60 border border-white/[0.08] text-xs sm:text-sm text-[#F8F5EF] placeholder-[#A8A49B]/60 focus:outline-none focus:border-[#f0d47c]/60 resize-none transition-all leading-relaxed"
                />
              </div>

              {/* Thick divider before Invoice Details */}
              <div className="h-2.5 bg-[#010811] w-full shrink-0" />

              {/* 4. SECTION: ریز فاکتور و صورت‌حساب در مرحله ۱ (بدون مالیات و ارسال) */}
              <div className="px-4 py-3 space-y-3 text-xs sm:text-sm">
                {/* Row: جمع اقلام */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[#A8A49B]">
                    <span>جمع اقلام سفارش ({toPersianDigits(totalItemCount)})</span>
                    <div className="flex items-baseline gap-1 text-[#F8F5EF]">
                      <span className="font-bold">{toPersianDigits(rawSubtotal.toLocaleString())}</span>
                      <span className="text-xs text-[#A8A49B]">تومان</span>
                    </div>
                  </div>

                  {/* Clean, simple non-collapsible items list underneath */}
                  <div className="pr-3 pl-1 py-1 space-y-1.5 border-r border-white/15 text-[11px] text-[#A8A49B]">
                    {items.map((it) => {
                      const itemOrig = (it.food.originalPrice || it.food.price) * it.quantity;
                      return (
                        <div key={it.food.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f0d47c]/70 shrink-0" />
                            <span className="text-[#F8F5EF] font-medium">{it.food.name}</span>
                            <span className="text-[10px] text-[#A8A49B]">({toPersianDigits(it.quantity)} عدد)</span>
                          </div>
                          <span className="font-mono text-[#F8F5EF]/80">
                            {toPersianDigits(itemOrig.toLocaleString())} تومان
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Row: جمع تخفیف‌ها (ساده، شکیل، بدون فلش و بدون دراپ‌داون) */}
                {itemDiscounts > 0 && (
                  <div className="flex items-center justify-between text-emerald-400 font-bold pt-1">
                    <span>جمع تخفیف‌ها</span>
                    <div className="flex items-baseline gap-1 font-mono">
                      <span>{toPersianDigits(itemDiscounts.toLocaleString())}</span>
                      <span className="text-xs">تومان</span>
                    </div>
                  </div>
                )}

                {/* Row: مبلغ قابل پرداخت */}
                <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="font-bold text-sm text-[#F8F5EF]">مبلغ قابل پرداخت</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-black text-base sm:text-lg text-[#F8F5EF]">
                      {toPersianDigits(actualSubtotal.toLocaleString())}
                    </span>
                    <span className="text-xs text-[#A8A49B]">تومان</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 
            ====================================================
            STEP 2: تأیید نهایی و پرداخت (Matching Screenshots 1, 4, 5, 6)
            ====================================================
          */}
          {step === 2 && (
            <div className="flex flex-col">
              {/* SECTION 1: روش تحویل سفارش (Matching Image 1) */}
              <div className="px-4 py-3 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm sm:text-base text-[#F8F5EF]">
                    روش تحویل سفارش
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentUser) {
                        if (onOpenLoginModal) onOpenLoginModal();
                        return;
                      }
                      setIsEditingAddress(!isEditingAddress);
                    }}
                    className="text-xs text-[#5D87FF] hover:underline flex items-center gap-0.5 font-bold"
                  >
                    <span>{currentUser ? 'تغییر آدرس' : 'ورود جهت ثبت آدرس'}</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Option 1: ارسال با پیک به */}
                <div
                  onClick={() => setDeliveryMethod('courier')}
                  className="py-3 border-b border-white/[0.08] cursor-pointer flex items-start justify-between gap-3"
                >
                  {/* Right side: Icon + Texts */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                      <Bike className="w-4 h-4 text-[#A8A49B]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-[#F8F5EF] mb-0.5">
                        ارسال با پیک به
                      </div>
                      {!isEditingAddress ? (
                        <p className="text-xs text-[#A8A49B] leading-relaxed line-clamp-2">
                          {deliveryAddress}
                        </p>
                      ) : (
                        <div className="mt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
                          <textarea
                            rows={2}
                            value={tempAddress}
                            onChange={(e) => setTempAddress(e.target.value)}
                            className="w-full p-2 text-xs rounded bg-[#061829] border border-[#5D87FF]/50 text-white"
                          />
                          <button
                            onClick={handleSaveAddress}
                            className="px-3 py-1 bg-[#5D87FF] text-white font-bold text-xs rounded"
                          >
                            تأیید آدرس
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Left side: Radio dot */}
                  <div className="w-4 h-4 rounded-full border-2 border-[#5D87FF] flex items-center justify-center shrink-0 mt-1">
                    {deliveryMethod === 'courier' && (
                      <div className="w-2 h-2 rounded-full bg-[#5D87FF]" />
                    )}
                  </div>
                </div>

                {/* Option 2: مراجعه حضوری به رستوران */}
                <div
                  onClick={() => setDeliveryMethod('in_person')}
                  className="py-3 cursor-pointer flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                      <Store className="w-4 h-4 text-[#A8A49B]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xs sm:text-sm text-[#F8F5EF] mb-0.5">
                        مراجعه حضوری به رستوران شایگان
                      </div>
                      <p className="text-xs text-[#A8A49B] leading-relaxed">
                        مشهد، منطقه سجاد، نبش بهارستان ۵، مرکز پذیرایی شایگان
                      </p>
                    </div>
                  </div>

                  {/* Left side: Radio dot */}
                  <div className="w-4 h-4 rounded-full border border-[#A8A49B]/50 flex items-center justify-center shrink-0 mt-1">
                    {deliveryMethod === 'in_person' && (
                      <div className="w-2 h-2 rounded-full bg-[#5D87FF]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Thick divider before Delivery Time */}
              <div className="h-2.5 bg-[#010811] w-full shrink-0" />

              {/* SECTION 2: زمان تحویل (Matching Image 1) */}
              <div className="px-4 py-3 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-base text-[#F8F5EF]">
                    زمان تحویل
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#7C3AED]/20 text-[#C4B5FD] text-[11px] font-bold">
                    زیر ۲۰ دقیقه
                  </span>
                </div>

                {/* Row: تحویل فوری */}
                <div className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#7C3AED]/20 text-[#A78BFA] flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#F8F5EF]">
                        تحویل فوری
                      </h4>
                      <div className="text-xs text-[#A8A49B] mt-0.5">
                        هزینه ارسال : {toPersianDigits(deliveryFee.toLocaleString())} تومان
                      </div>
                    </div>
                  </div>

                  {/* Radio dot */}
                  <div className="w-4 h-4 rounded-full border-2 border-[#5D87FF] flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#5D87FF]" />
                  </div>
                </div>

                {/* Notice box */}
                <div className="p-3 rounded-[8px] bg-[#061829]/70 text-[11px] text-[#A8A49B] text-center border border-white/[0.04]">
                  زمان تحویل با توجه به تعداد و نوع محصولات ممکن است تغییر کند.
                </div>
              </div>

              {/* Thick divider before Payment Method */}
              <div className="h-2.5 bg-[#010811] w-full shrink-0" />

              {/* SECTION 3: روش پرداخت (Matching Image 4 - Only SEP & AP, logos only) */}
              <div className="px-4 py-3 space-y-3">
                <h3 className="font-bold text-sm sm:text-base text-[#F8F5EF]">
                  روش پرداخت
                </h3>

                {/* Row: پرداخت آنلاین با کارت بانکی */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-5 h-5 text-[#A8A49B]" />
                      <span className="font-bold text-xs sm:text-sm text-[#F8F5EF]">
                        پرداخت آنلاین با کارت بانکی
                      </span>
                    </div>

                    {/* Radio circle */}
                    <div className="w-4 h-4 rounded-full border-2 border-[#5D87FF] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#5D87FF]" />
                    </div>
                  </div>

                  {/* Gateways: ONLY SEP and AP with ONLY small logo, NO text below */}
                  <div className="flex items-center gap-3 pt-1 pe-2">
                    {/* AP Logo Card */}
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('ap')}
                      className={`w-12 h-12 rounded-[10px] bg-white p-2 flex items-center justify-center transition-all shadow-sm ${
                        selectedGateway === 'ap'
                          ? 'ring-2 ring-[#5D87FF] ring-offset-2 ring-offset-[#020F1E]'
                          : 'border border-gray-200 opacity-75 hover:opacity-100'
                      }`}
                      title="آپ"
                      aria-label="درگاه آپ"
                    >
                      <div className="w-7 h-7 flex items-center justify-center">
                        <ApLogo />
                      </div>
                    </button>

                    {/* SEP Logo Card */}
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('saman')}
                      className={`w-12 h-12 rounded-[10px] bg-white p-2 flex items-center justify-center transition-all shadow-sm ${
                        selectedGateway === 'saman'
                          ? 'ring-2 ring-[#5D87FF] ring-offset-2 ring-offset-[#020F1E]'
                          : 'border border-gray-200 opacity-75 hover:opacity-100'
                      }`}
                      title="سپ"
                      aria-label="درگاه سپ"
                    >
                      <div className="w-7 h-7 flex items-center justify-center">
                        <SepLogo />
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Thick divider before Promo Code */}
              <div className="h-2.5 bg-[#010811] w-full shrink-0" />

              {/* SECTION 4: وارد کردن کد تخفیف (Matching Image 5) */}
              <div
                onClick={() => setIsPromoModalOpen(true)}
                className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                {/* Right: Tag icon + Texts */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center text-[#A8A49B]">
                    <Tag className="w-5 h-5 -rotate-90 stroke-[1.8]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#F8F5EF]">
                      وارد کردن کد تخفیف
                    </h4>
                    <p className="text-[11px] text-[#A8A49B] mt-0.5">
                      {appliedPromo
                        ? `کد ${appliedPromo.code} اعمال شد (${toPersianDigits(appliedPromo.amount.toLocaleString())} تومان تخفیف)`
                        : 'کد تخفیف خود را وارد کنید'}
                    </p>
                  </div>
                </div>

                {/* Left: Plus icon (blue/purple) */}
                <button
                  type="button"
                  className="w-7 h-7 flex items-center justify-center text-[#5D87FF] hover:scale-110 active:scale-95 transition-transform"
                  title="افزودن کد تخفیف"
                  aria-label="افزودن کد تخفیف"
                >
                  <Plus className="w-5 h-5 stroke-[2.2]" />
                </button>
              </div>

              {/* Thick divider before Payment Details */}
              <div className="h-2.5 bg-[#010811] w-full shrink-0" />

              {/* SECTION 5: جزئیات پرداخت (Matching Image 6) */}
              <div className="px-4 py-3 space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-base text-[#F8F5EF]">
                    جزئیات پرداخت
                  </h3>
                  <button
                    onClick={() => setShowOrderItemsDetail(!showOrderItemsDetail)}
                    className="text-xs text-[#5D87FF] hover:underline font-bold"
                  >
                    {showOrderItemsDetail ? 'بستن اقلام' : 'مشاهده اقلام'}
                  </button>
                </div>

                {/* Expandable items preview */}
                {showOrderItemsDetail && (
                  <div className="p-3 rounded-[8px] bg-[#061829] border border-white/[0.08] space-y-2">
                    {items.map((i) => (
                      <div key={i.food.id} className="flex justify-between text-xs py-1 border-b border-white/[0.04] last:border-0">
                        <span>{i.food.name} × {toPersianDigits(i.quantity)}</span>
                        <span className="font-bold text-[#f0d47c]">{toPersianDigits((i.food.price * i.quantity).toLocaleString())} تومان</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Rows */}
                <div className="flex items-center justify-between text-[#A8A49B]">
                  <span>جمع اقلام سفارش ({toPersianDigits(totalItemCount)})</span>
                  <div className="flex items-baseline gap-1 text-[#F8F5EF]">
                    <span className="font-bold">{toPersianDigits(rawSubtotal.toLocaleString())}</span>
                    <span className="text-xs text-[#A8A49B]">تومان</span>
                  </div>
                </div>

                {/* Row: جمع تخفیف‌ها (با قابلیت باز شدن کشویی در مرحله ۲) */}
                {totalDiscounts > 0 && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setIsDiscountDropdownOpen(!isDiscountDropdownOpen)}
                      className="w-full flex items-center justify-between text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-1">
                        <span className="font-bold">جمع تخفیف‌ها</span>
                        {isDiscountDropdownOpen ? (
                          <ChevronUp className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 font-bold">
                        <span>{toPersianDigits(totalDiscounts.toLocaleString())}</span>
                        <span className="text-xs">تومان</span>
                      </div>
                    </button>

                    {/* Dropdown breakdown */}
                    {isDiscountDropdownOpen && (
                      <div className="p-2.5 rounded-[8px] bg-emerald-950/30 border border-emerald-500/20 space-y-1.5 animate-fadeIn">
                        {items
                          .filter((it) => {
                            const origPrice = it.food.originalPrice || it.food.price;
                            return origPrice > it.food.price || (it.food.discountPercent && it.food.discountPercent > 0);
                          })
                          .map((it) => {
                            const origPrice = it.food.originalPrice || it.food.price;
                            const unitDiscount = origPrice - it.food.price;
                            const totalItemDiscount = unitDiscount * it.quantity;
                            const pct = it.food.discountPercent || Math.round((unitDiscount / origPrice) * 100);
                            return (
                              <div
                                key={it.food.id}
                                className="flex items-center justify-between text-[11px] text-[#A8A49B] py-1 border-b border-emerald-500/10 last:border-b-0"
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                  <span className="text-[#F8F5EF]">{it.food.name}</span>
                                  <span className="text-[10px] text-[#A8A49B]">({toPersianDigits(it.quantity)} عدد)</span>
                                  <span className="bg-emerald-500/20 text-emerald-300 font-bold px-1 py-0.5 rounded text-[10px]">
                                    ٪{toPersianDigits(pct)}
                                  </span>
                                </div>
                                <div className="text-emerald-400 font-bold font-mono">
                                  {toPersianDigits(totalItemDiscount.toLocaleString())} تومان
                                </div>
                              </div>
                            );
                          })}
                        {appliedPromo && (
                          <div className="flex items-center justify-between text-[11px] text-[#A8A49B] pt-1">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                              <span className="text-[#F8F5EF]">کد تخفیف ({appliedPromo.code})</span>
                            </div>
                            <div className="text-emerald-400 font-bold font-mono">
                              {toPersianDigits(appliedPromo.amount.toLocaleString())} تومان
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-[#A8A49B]">
                  <span>هزینه ارسال</span>
                  <div className="flex items-baseline gap-1 text-[#F8F5EF]">
                    <span className="font-bold">{toPersianDigits(deliveryFee.toLocaleString())}</span>
                    <span className="text-xs text-[#A8A49B]">تومان</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[#A8A49B]">
                  <span>مالیات</span>
                  <div className="flex items-baseline gap-1 text-[#F8F5EF]">
                    <span className="font-bold">{toPersianDigits(taxes.toLocaleString())}</span>
                    <span className="text-xs text-[#A8A49B]">تومان</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="font-bold text-sm text-[#F8F5EF]">مبلغ قابل پرداخت</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-black text-base sm:text-lg text-[#F8F5EF]">
                      {toPersianDigits(grandTotal.toLocaleString())}
                    </span>
                    <span className="text-xs text-[#A8A49B]">تومان</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 
            ====================================================
            PROMO CODE BOTTOM SHEET MODAL (Matching Image 6)
            - Elevated to z-[100] so it is in front of all bars
            - Smooth slide-up transition with top drag handle
            - Generous padding so submit button is never obscured
            ====================================================
          */}
          {isPromoModalOpen && (
            <div 
              className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
              onClick={() => setIsPromoModalOpen(false)}
            >
              <div
                className="w-full max-w-md bg-[#071A2D] border-t border-[#f0d47c]/30 rounded-t-[28px] p-5 pt-3 pb-32 sm:pb-8 space-y-4 font-vazir shadow-[0_-12px_45px_rgba(0,0,0,0.85)] animate-slideUp"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drag handle */}
                <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto my-1 cursor-grab" />

                {/* Header: Title on right, X on left */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <h3 className="font-bold text-base text-[#F8F5EF]">
                    وارد کردن کد تخفیف
                  </h3>
                  <button
                    onClick={() => {
                      setIsPromoModalOpen(false);
                      setPromoError(null);
                    }}
                    className="p-1.5 rounded-full hover:bg-white/10 text-[#A8A49B] hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Input Field */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="کد را اینجا وارد کنید"
                    className="w-full py-3.5 px-4 rounded-[12px] bg-[#020F1E] border border-white/20 text-sm text-[#F8F5EF] placeholder-[#A8A49B]/60 focus:outline-none focus:border-[#5D87FF] transition-all"
                    dir="rtl"
                    autoFocus
                  />
                  {promoError && (
                    <p className="text-xs text-rose-400 font-bold px-1">{promoError}</p>
                  )}
                  {appliedPromo && (
                    <p className="text-xs text-emerald-400 font-bold flex items-center gap-1 px-1">
                      <Check className="w-3.5 h-3.5" />
                      کد {appliedPromo.code} فعال است ({toPersianDigits(appliedPromo.amount.toLocaleString())} تومان تخفیف)
                    </p>
                  )}
                </div>

                {/* Submit Action Button */}
                <button
                  type="button"
                  onClick={handleCheckPromo}
                  className="w-full py-3.5 rounded-[12px] bg-[#4E5EF7] hover:bg-[#3D4DF3] active:bg-[#3242DC] text-white font-bold text-sm shadow-xl active:scale-[0.98] transition-all cursor-pointer"
                >
                  بررسی کد
                </button>
              </div>
            </div>
          )}

          {/* 
            ====================================================
            STICKY ACTION BAR
            - Placed at bottom-[84px] so it NEVER interferes with BottomNavigation
            - Button on LEFT, Text/Price on RIGHT as explicitly requested
            - Hidden when promo modal is active to prevent any overlap
            ====================================================
          */}
          {!isPromoModalOpen && (
            <div className="fixed bottom-[84px] inset-x-0 z-30 pointer-events-none animate-fadeIn">
              <div className="max-w-xl md:max-w-4xl mx-auto px-4">
                <div className="pointer-events-auto bg-[#071A2D]/95 backdrop-blur-lg border border-white/10 rounded-[12px] p-3 shadow-2xl flex items-center justify-between">
                  {/* Right side in RTL: Amount info (first in flow in RTL is at right) */}
                  <div className="text-start">
                    <div className="text-[11px] text-[#A8A49B]">مبلغ قابل پرداخت</div>
                    <div className="flex items-baseline gap-1 font-vazir">
                      <span className="font-black text-base sm:text-lg text-[#F8F5EF]">
                        {toPersianDigits((step === 1 ? actualSubtotal : grandTotal).toLocaleString())}
                      </span>
                      <span className="text-xs text-[#A8A49B]">تومان</span>
                    </div>
                  </div>

                  {/* Left side in RTL: Action Button */}
                  {step === 1 ? (
                    <button
                      disabled
                      aria-disabled="true"
                      className="px-5 py-2.5 rounded-[6px] bg-white/10 text-white/50 border border-white/10 font-bold text-xs sm:text-sm shadow-none cursor-not-allowed shrink-0 flex items-center gap-1.5 select-none opacity-80"
                      title="ادامه خرید موقتا غیرفعال می‌باشد"
                    >
                      <span>ادامه خرید</span>
                      <span className="text-[10px] bg-amber-500/20 text-[#f0d47c] px-1.5 py-0.5 rounded font-bold">
                        موقتا غیرفعال
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={handleFinalPayment}
                      className="px-6 py-2.5 rounded-[6px] bg-[#f0d47c] text-[#020F1E] font-bold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                    >
                      پرداخت آنلاین
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
