import React, { useState } from 'react';
import { 
  ArrowRight, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  CheckCircle2, 
  MapPin, 
  Edit3, 
  CreditCard, 
  Wallet, 
  Truck, 
  Store,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { CartItem, FoodItem, Language, Order } from '../types';
import { formatPrice, toPersianDigits } from '../utils/translations';
import confetti from 'canvas-confetti';

interface CartScreenProps {
  items: CartItem[];
  lang: Language;
  onBack: () => void;
  onUpdateQuantity: (foodId: string, delta: number) => void;
  onRemoveItem: (foodId: string) => void;
  onClearCart?: () => void;
  onOrderSuccess: (order: Order) => void;
  onExploreMenu: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  items,
  lang,
  onBack,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
  onExploreMenu,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'zarinpal' | 'wallet'>('zarinpal');
  const [address, setAddress] = useState('تهران، زعفرانیه، خیابان آصف، کوچه بهار، پلاک ۱۲، واحد ۴');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);

  const totalCount = items.reduce((s, i) => s + i.quantity, 0);

  const subtotal = items.reduce((acc, item) => {
    return acc + item.food.price * item.quantity;
  }, 0);

  const deliveryFee = deliveryMethod === 'delivery' && subtotal > 0 ? (subtotal > 600000 ? 0 : 35000) : 0;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const vatAmount = Math.round(subtotal * 0.09); // 9% VAT
  const grandTotal = Math.max(0, subtotal + deliveryFee + vatAmount - discountAmount);

  const handleApplyPromo = () => {
    const cleaned = promoCode.trim().toUpperCase();
    if (['ABEDINZADEH', 'GOLDEN', 'GOLD', 'VIP'].includes(cleaned)) {
      setDiscountPercent(15);
      setPromoMessage({ text: 'کد تخفیف ۱۵٪ ویژه با موفقیت اعمال شد.', isError: false });
    } else {
      setDiscountPercent(0);
      setPromoMessage({ text: 'کد تخفیف وارد شده معتبر نمی‌باشد.', isError: true });
    }
  };

  const handleCheckout = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#F0D47C', '#FFFFFF', '#0A0F1C'],
    });

    const newOrder: Order = {
      id: 'ABZ-' + Math.floor(100000 + Math.random() * 900000),
      items: items,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      discount: discountAmount,
      total: grandTotal,
      deliveryType: deliveryMethod,
      address: address,
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      paymentMethod: paymentMethod === 'zarinpal' ? 'online' : 'online',
      status: 'cooking',
      orderTime: 'هم‌اکنون',
      etaMinutes: 30,
    };

    setIsPaidSuccess(true);
    onOrderSuccess(newOrder);
  };

  if (isPaidSuccess) {
    return (
      <div className="w-full px-4 py-8 flex flex-col items-center justify-center min-h-[650px] text-center animate-fadeIn text-[#F8F5EF]">
        <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center text-[#F0D47C] shadow-[0_0_30px_rgba(212,175,55,0.4)] mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="font-amiri text-2xl font-bold text-[#F8F5EF]">سفارش شما با موفقیت ثبت شد</h2>
        <p className="mt-2 text-xs sm:text-sm text-[#A8A49B] max-w-xs leading-relaxed">
          سفارش با شماره رهگیری <span className="text-[#F0D47C] font-bold">ABZ-849201</span> در حال طبخ با زعفران ممتاز و ارسال ویژه تشریفات عابدین‌زاده است.
        </p>

        <div className="w-full max-w-sm mt-6 p-4 rounded-[18px] bg-[#0E1729] border border-[#D4AF37]/70 text-right space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-[#D4AF37]/20">
            <span className="text-[#A8A49B]">مبلغ پرداختی:</span>
            <span className="text-[#F0D47C] font-bold">{formatPrice(grandTotal, lang)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#D4AF37]/20">
            <span className="text-[#A8A49B]">شیوه تحویل:</span>
            <span>{deliveryMethod === 'delivery' ? 'ارسال سریع با پیک اختصاصی' : 'تحویل حضوری در رستوران'}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#A8A49B]">زمان تقریبی تحویل:</span>
            <span className="text-[#F0D47C] font-bold">۳۰ الی ۳۵ دقیقه</span>
          </div>
        </div>

        <button
          onClick={onBack}
          className="mt-6 w-full max-w-sm py-3 rounded-2xl bg-gradient-to-r from-[#C9A227] via-[#D4AF37] to-[#F0D47C] text-[#0A0F1C] font-bold text-sm shadow-[0_4px_20px_rgba(212,175,55,0.4)]"
        >
          بازگشت به منو
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full px-4 py-16 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-[#0E1729] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]/50 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-amiri text-xl font-bold text-[#F8F5EF]">سبد خرید شما خالی است</h2>
        <p className="text-xs text-[#A8A49B] max-w-xs leading-relaxed">
          طعم‌های لذیذ برگر دوبل، چیزبرگر ویژه، پیتزا مخصوص و کباب‌های زرین عابدین‌زاده منتظر شماست.
        </p>
        <button
          onClick={onExploreMenu}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-[#0A0F1C] font-bold text-xs shadow-md"
        >
          مشاهده منوی رستوران
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-3 sm:px-4 py-3 space-y-4 animate-fadeIn pb-28 text-[#F8F5EF] relative">
      {/* Header: “سبد خرید” + back button + item count */}
      <div className="flex items-center justify-between py-1">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-[#0E1729] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0F1C] transition-colors"
          aria-label="بازگشت"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="font-amiri text-lg sm:text-xl font-bold text-[#F8F5EF]">
          سبد خرید
        </h1>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#142036] text-[#F0D47C] border border-[#D4AF37]/40">
          {toPersianDigits(totalCount)} آیتم
        </span>
      </div>

      {/* List of Order Items: Food thumbnail, Dish name, Quantity controls (- 1 +) in dark pill with gold text, Item total price in gold, Delete icon */}
      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.food.id}
            className="p-3 rounded-[18px] bg-[#0E1729] border border-[#D4AF37]/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.5)] flex items-center justify-between gap-3"
          >
            {/* Food Thumbnail */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0A0F1C] border border-[#D4AF37]/40 shrink-0">
              <img
                src={item.food.image}
                alt={item.food.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Dish Name & Single Item Price */}
            <div className="flex-1 min-w-0">
              <h3 className="font-amiri text-sm font-bold text-[#F8F5EF] truncate">
                {item.food.name}
              </h3>
              <p className="text-[11px] text-[#F0D47C] font-vazir font-semibold mt-0.5">
                {formatPrice(item.food.price * item.quantity, lang)}
              </p>
            </div>

            {/* Quantity Controls in dark pill with gold text + Trash */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#080D18] border border-[#D4AF37]/50 shadow-inner">
                <button
                  onClick={() => onUpdateQuantity(item.food.id, -1)}
                  className="w-5 h-5 rounded-full text-white/80 hover:text-rose-400 flex items-center justify-center transition-colors active:scale-90"
                  aria-label="کاهش"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold text-[#F0D47C] min-w-4 text-center font-vazir">
                  {toPersianDigits(item.quantity)}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.food.id, 1)}
                  className="w-5 h-5 rounded-full text-white/80 hover:text-[#F0D47C] flex items-center justify-center transition-colors active:scale-90"
                  aria-label="افزایش"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>

              {/* Delete / Trash Icon */}
              <button
                onClick={() => onRemoveItem(item.food.id)}
                className="w-8 h-8 rounded-xl bg-black/40 text-[#A8A49B] hover:text-rose-400 border border-white/10 flex items-center justify-center transition-colors"
                aria-label="حذف"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Address Selection Card */}
      <div className="p-3.5 rounded-[18px] bg-[#0E1729] border border-[#D4AF37]/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)] space-y-3">
        <span className="text-xs font-bold text-[#F0D47C] block">شیوه دریافت سفارش</span>

        {/* Radio/Selector between “ارسال با پیک” and “تحویل حضوری در رستوران” */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDeliveryMethod('delivery')}
            className={`p-2.5 rounded-xl border flex items-center gap-2 text-right transition-all ${
              deliveryMethod === 'delivery'
                ? 'bg-[#142036] border-[#D4AF37] text-[#F0D47C] shadow-md'
                : 'bg-[#080D18] border-[#D4AF37]/30 text-[#A8A49B]'
            }`}
          >
            <Truck className="w-4 h-4 text-[#D4AF37]" />
            <div className="text-xs">
              <span className="block font-bold">ارسال با پیک</span>
              <span className="text-[10px] text-[#A8A49B]">تحویل درب منزل</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDeliveryMethod('pickup')}
            className={`p-2.5 rounded-xl border flex items-center gap-2 text-right transition-all ${
              deliveryMethod === 'pickup'
                ? 'bg-[#142036] border-[#D4AF37] text-[#F0D47C] shadow-md'
                : 'bg-[#080D18] border-[#D4AF37]/30 text-[#A8A49B]'
            }`}
          >
            <Store className="w-4 h-4 text-[#D4AF37]" />
            <div className="text-xs">
              <span className="block font-bold">تحویل حضوری</span>
              <span className="text-[10px] text-[#A8A49B]">در عمارت رستوران</span>
            </div>
          </button>
        </div>

        {/* Selected Address with edit icon */}
        {deliveryMethod === 'delivery' && (
          <div className="p-2.5 rounded-xl bg-[#080D18] border border-[#D4AF37]/30 flex items-start justify-between gap-2 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              {isEditingAddress ? (
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-black/60 border border-[#D4AF37] rounded px-2 py-1 text-xs text-[#F8F5EF]"
                />
              ) : (
                <span className="text-[#F8F5EF] leading-relaxed text-[11px]">{address}</span>
              )}
            </div>
            <button
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="text-[#D4AF37] hover:underline shrink-0 p-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Discount Code Input Card: Input field “کد تخفیف” + Gold button “اعمال” */}
      <div className="p-3.5 rounded-[18px] bg-[#0E1729] border border-[#D4AF37]/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)] space-y-2">
        <label className="block text-xs font-bold text-[#F0D47C] flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" />
          <span>کد تخفیف</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="کد تخفیف (مثال: GOLDEN)"
            className="flex-1 py-2 px-3 rounded-xl bg-[#080D18] border border-[#D4AF37]/40 text-xs text-[#F8F5EF] uppercase placeholder:normal-case placeholder-[#A8A49B]/60 focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-[#0A0F1C] font-bold text-xs hover:brightness-110 active:scale-95 shadow-md"
          >
            اعمال
          </button>
        </div>
        {promoMessage && (
          <p
            className={`text-[11px] mt-1 font-medium ${
              promoMessage.isError ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {promoMessage.text}
          </p>
        )}
      </div>

      {/* Payment Method Card: زرین‌پال / درگاه پرداخت بانکی + کیف پول عابدین‌زاده */}
      <div className="p-3.5 rounded-[18px] bg-[#0E1729] border border-[#D4AF37]/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)] space-y-2">
        <span className="text-xs font-bold text-[#F0D47C] block">درگاه و روش پرداخت</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod('zarinpal')}
            className={`p-2.5 rounded-xl border flex items-center gap-2 text-right transition-all ${
              paymentMethod === 'zarinpal'
                ? 'bg-[#142036] border-[#D4AF37] text-[#F0D47C] shadow-md'
                : 'bg-[#080D18] border-[#D4AF37]/30 text-[#A8A49B]'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#D4AF37]" />
            <div className="text-xs">
              <span className="block font-bold">زرین‌پال / درگاه بانکی</span>
              <span className="text-[10px] text-[#A8A49B]">کلیه کارت‌های شتاب</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('wallet')}
            className={`p-2.5 rounded-xl border flex items-center gap-2 text-right transition-all ${
              paymentMethod === 'wallet'
                ? 'bg-[#142036] border-[#D4AF37] text-[#F0D47C] shadow-md'
                : 'bg-[#080D18] border-[#D4AF37]/30 text-[#A8A49B]'
            }`}
          >
            <Wallet className="w-4 h-4 text-[#D4AF37]" />
            <div className="text-xs">
              <span className="block font-bold">کیف پول عابدین‌زاده</span>
              <span className="text-[10px] text-[#A8A49B]">موجودی: ۲,۴۵۰ امتیاز</span>
            </div>
          </button>
        </div>
      </div>

      {/* Price Summary Card (dark with thin gold border):
          - جمع کل (Subtotal)
          - هزینه ارسال (Delivery fee or رایگان)
          - تخفیف (Discount amount in green/gold)
          - مالیات و ارزش افزوده (Tax/VAT)
          - مبلغ قابل پرداخت (Total payable in large gold font)
      */}
      <div className="p-4 rounded-[20px] bg-[#0E1729] border border-[#D4AF37]/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.06),0_8px_20px_rgba(0,0,0,0.6)] space-y-2 text-xs">
        <div className="flex justify-between py-1 border-b border-[#D4AF37]/20">
          <span className="text-[#A8A49B]">جمع کل اقلام:</span>
          <span className="font-vazir font-semibold text-[#F8F5EF]">{formatPrice(subtotal, lang)}</span>
        </div>

        <div className="flex justify-between py-1 border-b border-[#D4AF37]/20">
          <span className="text-[#A8A49B]">هزینه ارسال:</span>
          <span className="font-vazir font-semibold text-[#F8F5EF]">
            {deliveryFee === 0 ? (
              <span className="text-emerald-400 font-bold">رایگان (ویژه تشریفات)</span>
            ) : (
              formatPrice(deliveryFee, lang)
            )}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between py-1 border-b border-[#D4AF37]/20 text-emerald-400">
            <span>تخفیف ویژه اعمال‌شده ({discountPercent}٪):</span>
            <span className="font-vazir font-bold">-{formatPrice(discountAmount, lang)}</span>
          </div>
        )}

        <div className="flex justify-between py-1 border-b border-[#D4AF37]/20">
          <span className="text-[#A8A49B]">مالیات بر ارزش افزوده (۹٪):</span>
          <span className="font-vazir font-semibold text-[#F8F5EF]">{formatPrice(vatAmount, lang)}</span>
        </div>

        <div className="flex justify-between items-baseline pt-2">
          <span className="font-amiri text-sm font-bold text-[#F8F5EF]">مبلغ قابل پرداخت:</span>
          <span className="font-amiri text-lg sm:text-xl font-black text-[#F0D47C] drop-shadow-sm font-vazir">
            {formatPrice(grandTotal, lang)}
          </span>
        </div>
      </div>

      {/* Big Sticky Gold Checkout Button: “تکمیل و پرداخت سفارش” + total price */}
      <div className="pt-2">
        <button
          onClick={handleCheckout}
          className="w-full py-3.5 px-4 rounded-[18px] bg-gradient-to-r from-[#C9A227] via-[#D4AF37] to-[#F0D47C] text-[#0A0F1C] font-black text-sm tracking-wide shadow-[0_4px_25px_rgba(212,175,55,0.45)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span>تکمیل و پرداخت سفارش</span>
          </div>
          <span className="font-vazir text-xs font-black bg-black/20 px-2.5 py-1 rounded-lg">
            {formatPrice(grandTotal, lang)}
          </span>
        </button>
      </div>
    </div>
  );
};
