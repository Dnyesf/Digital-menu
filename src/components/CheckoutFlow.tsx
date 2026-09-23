import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin, Phone, User, CreditCard, Banknote, ShieldCheck, Sparkles, Truck, Store } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Language, Order } from '../types';
import { formatPrice, toPersianDigits, translations } from '../utils/translations';

interface CheckoutFlowProps {
  items: CartItem[];
  discount: number;
  lang: Language;
  onCancel: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  items,
  discount,
  lang,
  onCancel,
  onOrderSuccess,
}) => {
  const t = translations[lang];
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [name, setName] = useState('شاهین رادمنش');
  const [phone, setPhone] = useState('۰۹۱۲۳۴۵۶۷۸۹');
  const [address, setAddress] = useState('تهران، زعفرانیه، خیابان آصف، کوچه بهار، پلاک ۱۲، واحد ۴');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'pos'>('online');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const subtotal = items.reduce((acc, item) => {
    const itemOptionTotal = item.selectedOptions?.reduce((oAcc, o) => oAcc + o.price, 0) || 0;
    return acc + (item.food.price + itemOptionTotal) * item.quantity;
  }, 0);

  const deliveryFee = deliveryType === 'delivery' ? 45000 : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  const handlePlaceOrder = () => {
    const generatedId = `SH-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: generatedId,
      items,
      subtotal,
      deliveryFee,
      discount,
      total: grandTotal,
      deliveryType,
      address: deliveryType === 'delivery' ? address : 'تحویل حضوری در کاخ شایگان',
      phone,
      paymentMethod,
      status: 'submitted',
      orderTime: `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')} - امروز`,
      etaMinutes: deliveryType === 'delivery' ? 35 : 20,
    };

    setPlacedOrder(newOrder);
    setCurrentStep(4);

    // Fire celebratory royal confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C9A24D', '#E4C76A', '#F0D47C', '#0B2238', '#FFFFFF']
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#020F1E] text-[#F8F5EF] flex flex-col justify-between py-6 px-4 sm:px-8 max-w-3xl mx-auto animate-fadeIn">
      {/* Checkout Header with Steps Indicator */}
      <div>
        <div className="flex items-center justify-between pb-6 border-b border-[#C9A24D]/25">
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="p-2.5 rounded-xl bg-[#071A2D] border border-[#C9A24D]/30 text-[#A8A49B] hover:text-[#C9A24D] transition-colors"
              aria-label="Back"
            >
              {lang === 'fa' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
            <h1 className="font-amiri text-2xl font-bold text-[#F8F5EF]">
              {t.checkout}
            </h1>
          </div>

          <div className="text-xs font-semibold text-[#C9A24D]">
            {lang === 'fa' ? `مرحله ${toPersianDigits(currentStep)} از ${toPersianDigits(4)}` : `Step ${currentStep} of 4`}
          </div>
        </div>

        {/* Progress Bar Milestones */}
        <div className="grid grid-cols-4 gap-2 my-6 text-center text-xs">
          {[
            { step: 1, label: t.step1 },
            { step: 2, label: t.step2 },
            { step: 3, label: t.step3 },
            { step: 4, label: t.step4 },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold transition-all text-xs ${
                  currentStep >= s.step
                    ? 'bg-[#C9A24D] text-[#020F1E] shadow-sm shadow-[#C9A24D]'
                    : 'bg-[#071A2D] border border-[#C9A24D]/30 text-[#A8A49B]'
                }`}
              >
                {lang === 'fa' ? toPersianDigits(s.step) : s.step}
              </div>
              <span
                className={`text-[11px] truncate max-w-full font-medium ${
                  currentStep >= s.step ? 'text-[#F0D47C]' : 'text-[#A8A49B]/70'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Delivery or Pickup */}
        {currentStep === 1 && (
          <div className="space-y-4 py-4 animate-fadeIn">
            <h3 className="font-amiri text-lg font-bold text-[#F8F5EF]">
              {t.deliveryMethod} یا {t.pickupMethod}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setDeliveryType('delivery')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  deliveryType === 'delivery'
                    ? 'bg-[#0B2238] border-[#C9A24D] shadow-lg shadow-[#C9A24D]/15'
                    : 'bg-[#071A2D] border-[#C9A24D]/25 hover:border-[#C9A24D]/60'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-[#020F1E] text-[#C9A24D]">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#F8F5EF] text-sm">{t.deliveryMethod}</h4>
                    <p className="text-xs text-[#A8A49B] mt-0.5">پک گرم اختصاصی درب منزل شما</p>
                  </div>
                </div>
                <div className="text-xs font-semibold text-[#F0D47C] pt-2 border-t border-[#C9A24D]/20">
                  هزینه ارسال: {formatPrice(45000, lang)}
                </div>
              </div>

              <div
                onClick={() => setDeliveryType('pickup')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  deliveryType === 'pickup'
                    ? 'bg-[#0B2238] border-[#C9A24D] shadow-lg shadow-[#C9A24D]/15'
                    : 'bg-[#071A2D] border-[#C9A24D]/25 hover:border-[#C9A24D]/60'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-[#020F1E] text-[#C9A24D]">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#F8F5EF] text-sm">{t.pickupMethod}</h4>
                    <p className="text-xs text-[#A8A49B] mt-0.5">دریافت حضوری از کانتر تشریفات کاخ</p>
                  </div>
                </div>
                <div className="text-xs font-semibold text-emerald-400 pt-2 border-t border-[#C9A24D]/20">
                  {t.free}
                </div>
              </div>
            </div>

            {/* Dishes Summary preview */}
            <div className="mt-8 p-4 rounded-2xl bg-[#071A2D] border border-[#C9A24D]/20">
              <h4 className="text-xs font-bold text-[#C9A24D] uppercase tracking-wider mb-2">خلاصه اقلام سفارش ({items.length})</h4>
              <div className="space-y-1.5 text-xs text-[#F5EFE4]/90">
                {items.map((i) => (
                  <div key={i.food.id} className="flex justify-between py-1 border-b border-[#C9A24D]/10">
                    <span>{lang === 'fa' ? i.food.name : i.food.nameEn} × {i.quantity}</span>
                    <span className="font-vazir font-semibold text-[#F0D47C]">{formatPrice(i.food.price * i.quantity, lang)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Address & Details */}
        {currentStep === 2 && (
          <div className="space-y-4 py-4 animate-fadeIn">
            <h3 className="font-amiri text-lg font-bold text-[#F8F5EF]">
              اطلاعات تحویل‌گیرنده
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#A8A49B] mb-1.5">{t.customerName}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-2.5 ps-10 pe-3 rounded-xl bg-[#071A2D] border border-[#C9A24D]/40 text-sm text-[#F8F5EF] focus:outline-none focus:border-[#C9A24D]"
                  />
                  <User className="w-4 h-4 text-[#C9A24D] absolute top-1/2 -translate-y-1/2 start-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A8A49B] mb-1.5">{t.customerPhone}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full py-2.5 ps-10 pe-3 rounded-xl bg-[#071A2D] border border-[#C9A24D]/40 text-sm text-[#F8F5EF] focus:outline-none focus:border-[#C9A24D]"
                  />
                  <Phone className="w-4 h-4 text-[#C9A24D] absolute top-1/2 -translate-y-1/2 start-3.5" />
                </div>
              </div>

              {deliveryType === 'delivery' && (
                <div>
                  <label className="block text-xs font-semibold text-[#A8A49B] mb-1.5">{t.deliveryAddress}</label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t.addressPlaceholder}
                      className="w-full py-2.5 ps-10 pe-3 rounded-xl bg-[#071A2D] border border-[#C9A24D]/40 text-sm text-[#F8F5EF] focus:outline-none focus:border-[#C9A24D]"
                    />
                    <MapPin className="w-4 h-4 text-[#C9A24D] absolute top-3.5 start-3.5" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#A8A49B] mb-1.5">{t.notes}</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.notesPlaceholder}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#071A2D] border border-[#C9A24D]/40 text-sm text-[#F8F5EF] focus:outline-none focus:border-[#C9A24D]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment Method */}
        {currentStep === 3 && (
          <div className="space-y-4 py-4 animate-fadeIn">
            <h3 className="font-amiri text-lg font-bold text-[#F8F5EF]">
              شیوه پرداخت سفارش
            </h3>

            <div className="space-y-3">
              <div
                onClick={() => setPaymentMethod('online')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'online'
                    ? 'bg-[#0B2238] border-[#C9A24D] shadow-lg shadow-[#C9A24D]/15'
                    : 'bg-[#071A2D] border-[#C9A24D]/25 hover:border-[#C9A24D]/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#020F1E] text-[#C9A24D]">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#F8F5EF] text-sm">{t.paymentOnline}</h4>
                    <p className="text-xs text-[#A8A49B] mt-0.5">کلیه کارتهای عضو شبکه بانکی شتاب کشور</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-[#C9A24D]">
                  {paymentMethod === 'online' && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A24D]" />}
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('pos')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'pos'
                    ? 'bg-[#0B2238] border-[#C9A24D] shadow-lg shadow-[#C9A24D]/15'
                    : 'bg-[#071A2D] border-[#C9A24D]/25 hover:border-[#C9A24D]/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#020F1E] text-[#C9A24D]">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#F8F5EF] text-sm">{t.paymentPos}</h4>
                    <p className="text-xs text-[#A8A49B] mt-0.5">پرداخت به پیک یا صندوق هنگام دریافت</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-[#C9A24D]">
                  {paymentMethod === 'pos' && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A24D]" />}
                </div>
              </div>
            </div>

            {/* Price review */}
            <div className="mt-6 p-4 rounded-2xl bg-[#071A2D] border border-[#C9A24D]/30 space-y-2 text-xs">
              <div className="flex justify-between text-[#A8A49B]">
                <span>{t.subtotal}</span>
                <span className="font-vazir font-semibold text-[#F5EFE4]">{formatPrice(subtotal, lang)}</span>
              </div>
              <div className="flex justify-between text-[#A8A49B]">
                <span>{t.deliveryFee}</span>
                <span className="font-vazir font-semibold text-[#F5EFE4]">
                  {deliveryFee > 0 ? formatPrice(deliveryFee, lang) : t.free}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>{t.discount}</span>
                  <span className="font-vazir font-semibold">-{formatPrice(discount, lang)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#F0D47C] pt-2 border-t border-[#C9A24D]/20">
                <span>{t.total}</span>
                <span className="font-vazir font-black">{formatPrice(grandTotal, lang)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Final Confirmation */}
        {currentStep === 4 && placedOrder && (
          <div className="py-8 text-center space-y-5 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-[#C9A24D]/20 border border-[#C9A24D] flex items-center justify-center mx-auto text-[#F0D47C] shadow-lg shadow-[#C9A24D]/25">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#071A2D] border border-[#C9A24D]/50 text-xs font-semibold text-[#F0D47C] mb-2">
                سفارش تأیید شد
              </span>
              <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#F8F5EF]">
                {t.orderSuccess}
              </h2>
              <p className="text-xs text-[#A8A49B] mt-1">
                سفارش شما در آشپزخانه درباری شایگان در حال تدارک و طبخ است.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#071A2D] border border-[#C9A24D]/35 space-y-2.5 text-xs text-start">
              <div className="flex justify-between border-b border-[#C9A24D]/20 pb-2">
                <span className="text-[#A8A49B]">{t.orderNumber}:</span>
                <span className="font-bold text-[#F0D47C] font-mono">{placedOrder.id}</span>
              </div>
              <div className="flex justify-between border-b border-[#C9A24D]/20 pb-2">
                <span className="text-[#A8A49B]">{t.total}:</span>
                <span className="font-bold text-[#F8F5EF] font-vazir">{formatPrice(placedOrder.total, lang)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8A49B]">{t.estimatedDeliveryTime}:</span>
                <span className="font-bold text-emerald-400">
                  {lang === 'fa' ? `${toPersianDigits(placedOrder.etaMinutes)} دقیقه` : `${placedOrder.etaMinutes} mins`}
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onOrderSuccess(placedOrder)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A24D] via-[#E4C76A] to-[#C9A24D] text-[#020F1E] font-bold text-sm sm:text-base shadow-lg shadow-[#C9A24D]/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.trackOrder}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar for Steps 1-3 */}
      {currentStep < 4 && (
        <div className="pt-6 border-t border-[#C9A24D]/20 flex items-center justify-between gap-4">
          <button
            onClick={() => {
              if (currentStep === 1) onCancel();
              else setCurrentStep((prev) => (prev - 1) as any);
            }}
            className="px-5 py-3 rounded-xl bg-[#071A2D] border border-[#C9A24D]/35 text-[#F5EFE4] hover:text-[#C9A24D] font-medium text-xs sm:text-sm transition-all"
          >
            {currentStep === 1 ? 'انصراف' : 'مرحله قبل'}
          </button>

          <button
            onClick={() => {
              if (currentStep === 3) {
                handlePlaceOrder();
              } else {
                setCurrentStep((prev) => (prev + 1) as any);
              }
            }}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A24D] via-[#E4C76A] to-[#C9A24D] text-[#020F1E] font-bold text-xs sm:text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2"
          >
            <span>{currentStep === 3 ? t.confirmAndPay : 'مرحله بعد'}</span>
            {lang === 'fa' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
};
