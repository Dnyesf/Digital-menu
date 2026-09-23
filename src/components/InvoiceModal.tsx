import React from 'react';
import { X, CheckCircle2, Clock, MapPin, Phone, ShieldCheck, Printer, ArrowRight } from 'lucide-react';
import { Order, Language } from '../types';
import { formatPrice, toPersianDigits } from '../utils/translations';
import { RESTAURANT_INFO } from '../data/mockData';

interface InvoiceModalProps {
  order: Order;
  lang: Language;
  onClose: () => void;
  onReorder?: (order: Order) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  lang,
  onClose,
  onReorder,
}) => {
  const isDelivered = order.status === 'delivered';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#071A2D] border border-[#f0d47c]/30 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col font-vazir text-right">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#051424] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 text-[#A8A49B] hover:text-[#F8F5EF]"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <div>
              <h3 className="font-black text-base text-[#F8F5EF] flex items-center gap-2">
                <span>فاکتور رسمی سفارش</span>
                <span className="font-mono text-[#f0d47c]">#{order.id}</span>
              </h3>
              <span className="text-[11px] text-[#A8A49B]">
                {order.orderTime}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#A8A49B] hover:text-[#F8F5EF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Restaurant Brand Banner */}
          <div className="text-center pb-4 border-b border-white/10 space-y-1">
            <h2 className="font-amiri font-bold text-xl text-[#f0d47c]">
              عمارت و رستوران کاخ شایگان
            </h2>
            <p className="text-[11px] text-[#A8A49B]">
              {RESTAURANT_INFO.address} • تلفن: {toPersianDigits(RESTAURANT_INFO.phone)}
            </p>
          </div>

          {/* Delivery & Status Info */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#A8A49B]">وضعیت تحویل:</span>
              <span
                className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1.5 ${
                  isDelivered
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-amber-500/15 text-amber-400'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isDelivered ? 'تحویل داده شده' : 'در حال آماده‌سازی و ارسال'}</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-[#A8A49B]">
              <span>زمان ثبت / تحویل:</span>
              <span className="text-[#F8F5EF] font-mono">
                {order.deliveredAt || order.orderTime}
              </span>
            </div>

            <div className="flex items-start gap-2 pt-1 border-t border-white/5 text-[#A8A49B]">
              <MapPin className="w-3.5 h-3.5 text-[#f0d47c] shrink-0 mt-0.5" />
              <span className="text-[#F8F5EF] text-[11px] leading-relaxed">
                نشانی مقصد: {order.address}
              </span>
            </div>
          </div>

          {/* Ordered Food Items List */}
          <div className="space-y-2.5">
            <h4 className="font-black text-xs text-[#f0d47c]">اقلام سفارش داده شده</h4>
            <div className="divide-y divide-white/[0.06] border border-white/10 rounded-2xl bg-[#020F1E] overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                      <img
                        src={item.food.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80'}
                        alt={item.food.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-0.5 right-0.5 bg-[#f0d47c] text-[#020F1E] font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                        {toPersianDigits(item.quantity)}
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-xs text-[#F8F5EF]">{item.food.name}</div>
                      <div className="text-[10px] text-[#A8A49B]">
                        فی: {formatPrice(item.food.price)} تومان
                      </div>
                    </div>
                  </div>

                  <div className="text-left font-mono font-bold text-xs text-[#F8F5EF]">
                    {formatPrice(item.food.price * item.quantity)} تومان
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Breakdown */}
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-[#A8A49B]">
            <div className="flex items-center justify-between">
              <span>جمع کل اقلام:</span>
              <span className="text-[#F8F5EF] font-mono">{formatPrice(order.subtotal)} تومان</span>
            </div>

            {order.discount > 0 && (
              <div className="flex items-center justify-between text-emerald-400">
                <span>تخفیف اعمال شده:</span>
                <span className="font-mono font-bold">-{formatPrice(order.discount)} تومان</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span>هزینه پیک و بسته‌بندی سلطنتی:</span>
              <span className="text-[#F8F5EF] font-mono">{formatPrice(order.deliveryFee)} تومان</span>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm">
              <span className="font-black text-[#F8F5EF]">مبلغ پرداخت شده:</span>
              <span className="font-black font-mono text-[#f0d47c] text-base">
                {formatPrice(order.total)} تومان
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#051424] border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#A8A49B] hover:text-[#F8F5EF] transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>چاپ فاکتور</span>
          </button>

          {onReorder && (
            <button
              onClick={() => onReorder(order)}
              className="flex-1 py-2.5 rounded-xl bg-[#f0d47c] hover:bg-[#e4c76a] text-[#020F1E] font-black text-xs transition-all shadow-md active:scale-95 text-center"
            >
              سفارش مجدد این اقلام
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
