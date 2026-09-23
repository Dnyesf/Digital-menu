import React from 'react';
import { X, CheckCircle2, Clock, Phone, MapPin, ChefHat, Bike, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { Order, OrderStatus, Language } from '../types';
import { formatPrice, toPersianDigits, translations } from '../utils/translations';

interface OrderTrackingModalProps {
  order: Order;
  lang: Language;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  lang,
  onClose,
}) => {
  const t = translations[lang];

  const steps: { key: OrderStatus; label: string; icon: any }[] = [
    { key: 'submitted', label: t.orderStatusSubmitted, icon: CheckCircle2 },
    { key: 'confirmed', label: t.orderStatusConfirmed, icon: ShieldCheck },
    { key: 'cooking', label: t.orderStatusCooking, icon: ChefHat },
    { key: 'delivering', label: t.orderStatusDelivering, icon: Bike },
    { key: 'delivered', label: t.orderStatusDelivered, icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto pb-28 sm:pb-8">
      <div className="relative w-full max-w-xl bg-[#061829] border-0 sm:border border-[#C9A24D]/40 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-screen sm:max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#071A2D] border-b border-[#C9A24D]/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#020F1E] border border-[#C9A24D]/30 text-[#A8A49B] hover:text-[#C9A24D]"
            >
              {lang === 'fa' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            </button>
            <div>
              <span className="text-[10px] text-[#A8A49B] uppercase tracking-wider block">
                {t.trackOrder}
              </span>
              <h2 className="font-amiri text-lg font-bold text-[#F8F5EF] flex items-center gap-2">
                <span>سفارش</span>
                <span className="font-mono text-[#F0D47C]">#{order.id}</span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#A8A49B] hover:text-[#F8F5EF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Estimated Arrival Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0B2238] to-[#071A2D] border border-[#C9A24D]/40 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#C9A24D]/20 border border-[#C9A24D] flex items-center justify-center text-[#F0D47C]">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs text-[#A8A49B]">{t.estimatedDeliveryTime}</span>
                <div className="text-xl font-bold text-[#F0D47C] font-vazir">
                  {lang === 'fa' ? `${toPersianDigits(order.etaMinutes)} دقیقه دیگر` : `in ${order.etaMinutes} mins`}
                </div>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#020F1E] border border-[#C9A24D]/50 text-xs font-semibold text-[#F8F5EF]">
              {order.orderTime}
            </span>
          </div>

          {/* Stepper Timeline */}
          <div className="p-5 rounded-2xl bg-[#071A2D] border border-[#C9A24D]/25">
            <h3 className="text-xs font-bold text-[#C9A24D] uppercase tracking-wider mb-4">
              مراحل پردازش و ارسال سفارش
            </h3>

            <div className="space-y-4">
              {steps.map((step, idx) => {
                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex items-start gap-3 relative">
                    {/* Connecting Vertical Line */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`absolute top-7 start-3.5 w-0.5 h-6 -ml-px ${
                          idx < currentStepIndex ? 'bg-[#C9A24D]' : 'bg-[#0B2238]'
                        }`}
                      />
                    )}

                    {/* Step Icon Node */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                        isPassed
                          ? 'bg-[#C9A24D] text-[#020F1E]'
                          : isCurrent
                          ? 'bg-[#0B2238] border-2 border-[#C9A24D] text-[#F0D47C] ring-4 ring-[#C9A24D]/20'
                          : 'bg-[#020F1E] border border-[#C9A24D]/30 text-[#A8A49B]/40'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="pt-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold ${
                            isCurrent
                              ? 'text-[#F0D47C] font-bold'
                              : isPassed
                              ? 'text-[#F8F5EF]'
                              : 'text-[#A8A49B]/60'
                          }`}
                        >
                          {step.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] text-amber-400 font-medium px-2 py-0.5 rounded-full bg-amber-400/10">
                            در حال اجرا
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Card & Contact */}
          <div className="p-4 rounded-2xl bg-[#071A2D] border border-[#C9A24D]/25 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0B2238] border border-[#C9A24D]/40 flex items-center justify-center text-[#C9A24D]">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#F8F5EF]">{t.courierName}</h4>
                <p className="text-[11px] text-[#A8A49B]">پیک اختصاصی خودرویی شایگان با جعبه حرارتی</p>
              </div>
            </div>

            <a
              href="tel:09120000000"
              className="p-2.5 rounded-xl bg-[#0B2238] border border-[#C9A24D] text-[#F0D47C] hover:bg-[#C9A24D]/20 transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.courierPhone}</span>
            </a>
          </div>

          {/* Delivery Address */}
          <div className="p-4 rounded-2xl bg-[#071A2D] border border-[#C9A24D]/20 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#C9A24D] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-[#A8A49B] block mb-0.5">نشانی مقصد تحویل:</span>
              <p className="text-[#F5EFE4] leading-relaxed">{order.address}</p>
            </div>
          </div>

          {/* Order Items Breakdown */}
          <div className="p-4 rounded-2xl bg-[#071A2D] border border-[#C9A24D]/20 space-y-2 text-xs">
            <h4 className="font-bold text-[#C9A24D] uppercase tracking-wider mb-2">
              اقلام ثبت شده
            </h4>
            {order.items.map((i) => (
              <div key={i.food.id} className="flex justify-between py-1.5 border-b border-[#C9A24D]/10">
                <span className="text-[#F5EFE4]">
                  {lang === 'fa' ? i.food.name : i.food.nameEn} × {i.quantity}
                </span>
                <span className="font-semibold font-vazir text-[#F0D47C]">
                  {formatPrice(i.food.price * i.quantity, lang)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 text-sm font-bold text-[#F0D47C]">
              <span>مبلغ کل پرداخت‌شده:</span>
              <span className="font-vazir font-black">{formatPrice(order.total, lang)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
