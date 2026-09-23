import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  ChevronLeft,
  ShoppingBag,
  Tag,
  Gift,
  Heart,
  Headphones,
  LogOut,
  Sparkles,
  Phone,
  Copy,
  Clock,
  MapPin,
  Plus,
  Trash2,
  X,
  Share2,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Award,
  Minus,
  Truck,
  Store,
  UtensilsCrossed,
  Calendar
} from 'lucide-react';
import { FoodItem, Language, Order, Theme, UserProfile, DiscountCoupon } from '../types';
import { formatPrice, toPersianDigits } from '../utils/translations';
import { RESTAURANT_INFO } from '../data/mockData';
import { AdminPanel } from './AdminPanel';
import { AuthView } from './AuthView';
import { api } from '../services/api';

interface ProfileViewProps {
  lang: Language;
  theme: Theme;
  orders: Order[];
  favoriteFoods: FoodItem[];
  cartQuantities: Record<string, number>;
  allFoods: FoodItem[];
  currentUser?: UserProfile | null;
  onUpdateCurrentUser?: (user: UserProfile | null) => void;
  onUpdateFoodStatus?: (foodId: string, isAvailable: boolean) => void;
  onAddNewFood?: (newFood: FoodItem) => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: any) => void;
  onThemeToggle: () => void;
  onTrackOrder: (order: Order) => void;
  onAddToCart: (food: FoodItem) => void;
  onRemoveFromCart: (foodId: string) => void;
  onToggleFavorite: (foodId: string) => void;
  onClickDetail: (food: FoodItem) => void;
  onNavigateToStory?: () => void;
  onNavigateToHome?: () => void;
  onRefreshFoods?: () => void;
  onOpenLoginModal?: () => void;
  onReorder?: (order: Order) => void;
}

type ProfileSubPage = 'main' | 'info' | 'transactions' | 'discounts' | 'invite' | 'favorites' | 'support' | 'admin';

export const ProfileView: React.FC<ProfileViewProps> = ({
  lang,
  theme,
  orders,
  favoriteFoods,
  cartQuantities,
  allFoods,
  currentUser,
  onUpdateCurrentUser,
  onUpdateFoodStatus,
  onAddNewFood,
  onUpdateOrderStatus,
  onThemeToggle,
  onTrackOrder,
  onAddToCart,
  onRemoveFromCart,
  onToggleFavorite,
  onClickDetail,
  onNavigateToStory,
  onNavigateToHome,
  onRefreshFoods,
  onOpenLoginModal,
  onReorder,
}) => {
  // Active subpage state
  const [currentPage, setCurrentPage] = useState<ProfileSubPage>('main');

  // Selected invoice order for bottom drawer
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Logout dialog state
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Edit user profile state
  const [editName, setEditName] = useState(currentUser?.fullName || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editAddress, setEditAddress] = useState(currentUser?.address || (currentUser?.addresses?.[0]?.address || ''));

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.fullName || '');
      setEditPhone(currentUser.phone || '');
      setEditEmail(currentUser.email || '');
      setEditAddress(currentUser.address || (currentUser.addresses?.[0]?.address || ''));
    }
  }, [currentUser]);

  // Transactions filter
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'delivered' | 'processing'>('all');

  // Database Coupons list
  const [dbCoupons, setDbCoupons] = useState<DiscountCoupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoadingCoupons(true);
        const data = await api.getCoupons();
        if (Array.isArray(data)) {
          setDbCoupons(data);
        }
      } catch (e) {
        console.error('Error loading database coupons', e);
      } finally {
        setLoadingCoupons(false);
      }
    };
    if (currentPage === 'discounts') {
      fetchCoupons();
    }
  }, [currentPage]);

  // Toast message
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // If user is not logged in, show AuthView
  if (!currentUser) {
    return (
      <AuthView
        onLoginSuccess={(loggedUser) => {
          try {
            localStorage.setItem('shaygan_user', JSON.stringify(loggedUser));
          } catch {}
          if (onUpdateCurrentUser) onUpdateCurrentUser(loggedUser);
        }}
        onBackToHome={onNavigateToHome}
      />
    );
  }

  // Current user
  const user = currentUser;
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    showToast(`کد «${label}» کپی شد.`);
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'رستوران و کاخ پذیرایی شایگان',
        text: 'دعوت به سفارش غذاهای اصیل و شاهانه از رستوران شایگان',
        url: window.location.href,
      }).catch(() => {});
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
      }
      showToast('لینک رستوران شایگان کپی شد. می‌توانید برای دوستان خود بفرستید.');
    }
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      const res = await api.updateProfile({
        userId: currentUser.id,
        phone: currentUser.phone,
        fullName: editName.trim(),
        email: editEmail.trim(),
        address: editAddress.trim(),
      });
      if (res.user && onUpdateCurrentUser) {
        onUpdateCurrentUser(res.user);
        localStorage.setItem('shaygan_user', JSON.stringify(res.user));
      }
      showToast('اطلاعات کاربری با موفقیت به‌روزرسانی شد.');
      setTimeout(() => {
        setCurrentPage('main');
      }, 500);
    } catch {
      showToast('خطا در ذخیره اطلاعات');
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    if (transactionFilter === 'delivered') return order.status === 'delivered';
    if (transactionFilter === 'processing') return order.status !== 'delivered';
    return true;
  });

  const getDeliveryTypeBadge = (deliveryType?: string) => {
    switch (deliveryType) {
      case 'dine_in':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <UtensilsCrossed className="w-3 h-3" />
            صرف در سالن
          </span>
        );
      case 'pickup':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Store className="w-3 h-3" />
            تحویل حضوری
          </span>
        );
      case 'delivery':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Truck className="w-3 h-3" />
            تحویل با پیک
          </span>
        );
    }
  };

  return (
    <div dir="rtl" className="w-full max-w-xl md:max-w-4xl mx-auto min-h-screen bg-[#020F1E] text-[#F8F5EF] flex flex-col font-vazir animate-fadeIn pb-24">
      {/* SUB-PAGE 1: ORDERS (سفارشات) */}
      {currentPage === 'transactions' && (
        <div className="w-full min-h-screen animate-fadeIn">
          {/* Subpage Header */}
          <div className="sticky top-0 z-30 bg-[#020F1E]/95 backdrop-blur-md border-b border-white/[0.08] px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage('main')}
                className="p-1.5 text-[#F8F5EF] hover:text-[#f0d47c] transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
                title="بازگشت به حساب کاربری"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.2]" />
              </button>
              <h2 className="font-black text-lg text-[#F8F5EF]">سفارشات</h2>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="p-4 flex items-center gap-2 border-b border-white/[0.06] bg-[#071322]">
            <button
              onClick={() => setTransactionFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                transactionFilter === 'all'
                  ? 'bg-[#f0d47c] text-[#020F1E]'
                  : 'bg-white/5 text-[#A8A49B] hover:bg-white/10'
              }`}
            >
              همه
            </button>
            <button
              onClick={() => setTransactionFilter('delivered')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                transactionFilter === 'delivered'
                  ? 'bg-[#f0d47c] text-[#020F1E]'
                  : 'bg-white/5 text-[#A8A49B] hover:bg-white/10'
              }`}
            >
              تحویل شده
            </button>
            <button
              onClick={() => setTransactionFilter('processing')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                transactionFilter === 'processing'
                  ? 'bg-[#f0d47c] text-[#020F1E]'
                  : 'bg-white/5 text-[#A8A49B] hover:bg-white/10'
              }`}
            >
              در حال انجام
            </button>
          </div>

          {/* Orders List */}
          <div className="p-4 space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-white/5 text-[#A8A49B] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <p className="text-sm text-[#A8A49B]">سفارشی در این دسته‌بندی یافت نشد.</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isDelivered = order.status === 'delivered';
                const formattedDateTime = order.orderTime || (order.deliveredAt ? `تحویل شده · ${order.deliveredAt}` : 'ثبت سفارش');
                const recipientName = order.customerName || user?.fullName || 'مشتری گرامی';
                const formattedAddress = order.address ? `تحویل به ${recipientName}، ${order.address}` : `تحویل حضوری در کاخ شایگان`;

                return (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#071A2D] border border-white/10 hover:border-[#f0d47c]/30 shadow-lg text-[#F8F5EF] transition-all hover:shadow-xl space-y-3 font-vazir"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#f0d47c]/30 overflow-hidden shrink-0 bg-[#020F1E] p-0.5 shadow-xs flex items-center justify-center">
                          <img
                            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80"
                            alt="لوگو رستوران"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>

                        <div className="text-right min-w-0">
                          <h3 className="font-bold text-base sm:text-lg text-[#F8F5EF] leading-snug">
                            {RESTAURANT_INFO.name || 'کاخ پذیرایی شایگان'}
                          </h3>
                          <div className="text-xs text-[#A8A49B] font-normal mt-0.5">
                            {formattedDateTime}
                          </div>
                          <div
                            className="text-xs text-[#A8A49B] truncate max-w-[190px] sm:max-w-xs md:max-w-md mt-0.5"
                            title={order.address || 'نشانی ثبت نشده'}
                          >
                            {formattedAddress}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-1.5">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-lg inline-flex items-center gap-1 ${
                            isDelivered
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {isDelivered ? 'تحویل‌ شده' : 'در حال آماده‌سازی'}
                        </span>
                        {getDeliveryTypeBadge(order.deliveryType)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-1">
                      <div className="flex items-center gap-2.5 overflow-x-auto py-2 scrollbar-none">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#020F1E] p-1 flex items-center justify-center border border-white/10"
                            title={`${item.food?.name || 'غذا'} (${item.quantity} عدد)`}
                          >
                            <img
                              src={item.food?.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80'}
                              alt={item.food?.name || 'غذا'}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute -top-2.5 right-1 w-5 h-5 rounded-full bg-[#0D1530] border border-[#f0d47c] text-[#f0d47c] text-[10px] sm:text-[11px] font-bold flex items-center justify-center shadow-xs z-10 font-mono">
                              {toPersianDigits(item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="shrink-0 text-left">
                        <span className="font-black text-lg sm:text-xl text-[#f0d47c] font-mono">
                          {toPersianDigits(order.total.toLocaleString())}
                        </span>
                        <span className="text-xs sm:text-sm text-[#A8A49B] mr-1 font-vazir">
                          تومان
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-[#F8F5EF] font-bold text-xs sm:text-sm text-center transition-colors active:scale-[0.98] border border-white/10 cursor-pointer"
                      >
                        مشاهده فاکتور
                      </button>

                      <button
                        onClick={() => {
                          if (onReorder) {
                            onReorder(order);
                          } else {
                            order.items.forEach((it) => {
                              for (let i = 0; i < it.quantity; i++) {
                                onAddToCart(it.food);
                              }
                            });
                            showToast('اقلام به سبد خرید اضافه شدند.');
                          }
                        }}
                        className="w-full py-3 rounded-xl bg-[#f0d47c] hover:bg-[#e4c76a] text-[#020F1E] font-black text-xs sm:text-sm text-center transition-colors active:scale-[0.98] shadow-md cursor-pointer"
                      >
                        سفارش مجدد
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-PAGE 2: DISCOUNTS (تخفیف‌ها) */}
      {currentPage === 'discounts' && (
        <div className="w-full min-h-screen animate-fadeIn">
          <div className="sticky top-0 z-30 bg-[#020F1E]/95 backdrop-blur-md border-b border-white/[0.08] px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage('main')}
                className="p-1.5 text-[#F8F5EF] hover:text-[#f0d47c] transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
                title="بازگشت به حساب کاربری"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.2]" />
              </button>
              <h2 className="font-black text-lg text-[#F8F5EF]">تخفیف‌ها و کوپن‌ها</h2>
            </div>
          </div>

          <div className="px-4 divide-y divide-white/[0.08]">
            {loadingCoupons ? (
              <div className="py-16 text-center text-xs text-[#A8A49B]">در حال بارگذاری کدهای تخفیف از دیتابیس...</div>
            ) : dbCoupons.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-white/5 text-[#f0d47c] flex items-center justify-center mx-auto">
                  <Tag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-bold text-sm text-[#F8F5EF]">کوپن فعالی یافت نشد</h3>
                <p className="text-xs text-[#A8A49B]">در حال حاضر هیچ کد تخفیف فعالی در دیتابیس موجود نیست.</p>
              </div>
            ) : (
              dbCoupons.map((voucher) => {
                const badgeText = voucher.isFirstOrderOnly
                  ? 'سفارش اول'
                  : voucher.isCampaign
                  ? voucher.campaignName || 'جشنواره'
                  : 'تخفیف ویژه';

                const amountText = voucher.type === 'percent'
                  ? `${toPersianDigits(voucher.amount)}٪ تخفیف ${voucher.maxDiscount ? `(تا سقف ${toPersianDigits((voucher.maxDiscount / 1000).toLocaleString())} هزار تومان)` : ''}`
                  : `${toPersianDigits(voucher.amount.toLocaleString())} تومان تخفیف`;

                const minSpendText = voucher.minOrderAmount
                  ? `حداقل خرید: ${toPersianDigits(voucher.minOrderAmount.toLocaleString())} تومان`
                  : 'بدون حداقل خرید';

                const expiryText = voucher.validUntil
                  ? `اعتبار تا: ${toPersianDigits(voucher.validUntil)}`
                  : 'اعتبار نامحدود';

                return (
                  <div
                    key={voucher.id || voucher.code}
                    className="py-4 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-base text-[#f0d47c] tracking-wider">
                            {voucher.code}
                          </span>
                          <span className="bg-[#E91E63]/15 text-[#FF6584] text-[10px] font-bold px-2 py-0.5 rounded-[4px]">
                            {badgeText}
                          </span>
                        </div>
                        <p className="text-xs text-[#F8F5EF] font-bold mt-1">
                          {amountText}
                        </p>
                        <p className="text-[11px] text-[#A8A49B] mt-0.5">
                          {voucher.title || 'تخفیف ویژه کاخ شایگان'}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCopy(voucher.code, voucher.code)}
                        className="p-2 px-3 rounded-[6px] bg-white/10 hover:bg-[#f0d47c] hover:text-[#020F1E] text-white transition-all flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
                        title="کپی کد تخفیف"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">کپی</span>
                      </button>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-[#A8A49B]">
                      <span>{minSpendText}</span>
                      <span className="text-[#f0d47c]/90">{expiryText}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-PAGE 3: INVITE FRIENDS (دعوت از دوستان) */}
      {currentPage === 'invite' && (
        <div className="w-full min-h-screen animate-fadeIn flex flex-col">
          <div className="sticky top-0 z-30 bg-[#020F1E]/95 backdrop-blur-md border-b border-white/[0.08] px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage('main')}
                className="p-1.5 text-[#F8F5EF] hover:text-[#f0d47c] transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
                title="بازگشت به حساب کاربری"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.2]" />
              </button>
              <h2 className="font-black text-lg text-[#F8F5EF]">دعوت از دوستان</h2>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#f0d47c]/10 border border-[#f0d47c]/30 flex items-center justify-center text-[#f0d47c] shadow-lg">
              <Gift className="w-10 h-10 stroke-[1.5]" />
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-xl text-[#F8F5EF]">
                تجربه شاهانه را با دوستانتان شریک شوید
              </h3>
              <p className="text-xs text-[#A8A49B] leading-relaxed">
                با دعوت از دوستان و عزیزان خود به کاخ رستوران شایگان، لذت طعم اصیل کباب‌ها و غذاهای کهن ایرانی را به آنها هدیه دهید.
              </p>
            </div>

            <div className="w-full divide-y divide-white/[0.08] py-2 text-start text-xs">
              <div className="py-2.5 flex items-center gap-2.5 text-[#F8F5EF]">
                <CheckCircle2 className="w-4 h-4 text-[#f0d47c] shrink-0" />
                <span>ارسال سریع و گرم تمام سفارش‌ها در ظروف بهداشتی</span>
              </div>
              <div className="py-2.5 flex items-center gap-2.5 text-[#F8F5EF]">
                <CheckCircle2 className="w-4 h-4 text-[#f0d47c] shrink-0" />
                <span>دسترسی کامل به منوی اصیل ایرانی، کباب‌ها و خوراک‌ها</span>
              </div>
              <div className="py-2.5 flex items-center gap-2.5 text-[#F8F5EF]">
                <CheckCircle2 className="w-4 h-4 text-[#f0d47c] shrink-0" />
                <span>پشتیبانی اختصاصی و پیگیری لحظه‌ای سفارش</span>
              </div>
            </div>

            <div className="w-full pt-2">
              <button
                onClick={handleShareApp}
                className="w-full py-3.5 rounded-[6px] bg-[#f0d47c] hover:bg-[#e4c76a] text-[#020F1E] font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>اشتراک‌گذاری با دوستان</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-PAGE 4: FAVORITES (مورد علاقه‌ها) */}
      {currentPage === 'favorites' && (
        <div className="w-full min-h-screen animate-fadeIn">
          <div className="sticky top-0 z-30 bg-[#020F1E]/95 backdrop-blur-md border-b border-white/[0.08] px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage('main')}
                className="p-1.5 text-[#F8F5EF] hover:text-[#f0d47c] transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
                title="بازگشت به حساب کاربری"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.2]" />
              </button>
              <h2 className="font-black text-lg text-[#F8F5EF]">مورد علاقه‌ها</h2>
            </div>
          </div>

          <div className="px-4 divide-y divide-white/[0.08]">
            {favoriteFoods.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 text-rose-400 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-[#F8F5EF]">لیست علاقه‌مندی‌های شما خالی است</h3>
                  <p className="text-xs text-[#A8A49B]">غذاهای دلخواهتان را از منو نشان کنید تا اینجا ذخیره شوند.</p>
                </div>
                <button
                  onClick={() => {
                    if (onNavigateToHome) onNavigateToHome();
                  }}
                  className="px-5 py-2.5 rounded-[6px] bg-[#f0d47c] text-[#020F1E] font-bold text-xs shadow-sm hover:bg-[#e4c76a] transition-all cursor-pointer"
                >
                  مشاهده منوی رستوران
                </button>
              </div>
            ) : (
              favoriteFoods.map((food) => {
                const qty = cartQuantities[food.id] || 0;
                return (
                  <div
                    key={food.id}
                    className="py-4 flex items-center gap-3.5"
                  >
                    <div 
                      onClick={() => onClickDetail(food)}
                      className="w-20 h-20 rounded-[6px] overflow-hidden bg-white/5 shrink-0 cursor-pointer"
                    >
                      <img
                        src={food.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'}
                        alt={food.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between">
                        <h4 
                          onClick={() => onClickDetail(food)}
                          className="font-black text-sm text-[#F8F5EF] truncate cursor-pointer hover:text-[#f0d47c] transition-colors"
                        >
                          {food.name}
                        </h4>
                        <button
                          onClick={() => onToggleFavorite(food.id)}
                          className="text-rose-500 hover:text-rose-400 p-1 shrink-0 cursor-pointer"
                          title="حذف از مورد علاقه‌ها"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#A8A49B] line-clamp-1">
                        {food.description}
                      </p>

                      <div className="flex items-center justify-between pt-1.5">
                        <div className="flex items-baseline gap-1">
                          <span className="font-black text-xs text-[#f0d47c]">
                            {toPersianDigits(food.price.toLocaleString())}
                          </span>
                          <span className="text-[9px] text-[#A8A49B]">تومان</span>
                        </div>

                        {qty === 0 ? (
                          <button
                            onClick={() => onAddToCart(food)}
                            className="px-3 py-1 rounded-[6px] bg-[#f0d47c] hover:bg-[#e4c76a] text-[#020F1E] font-bold text-[11px] transition-all shadow-sm cursor-pointer"
                          >
                            افزودن
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 bg-[#f0d47c] text-[#020F1E] rounded-[6px] px-2 py-0.5 font-bold text-xs">
                            <button
                              onClick={() => onAddToCart(food)}
                              className="hover:opacity-75 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-mono">{toPersianDigits(qty)}</span>
                            <button
                              onClick={() => onRemoveFromCart(food.id)}
                              className="hover:opacity-75 cursor-pointer"
                            >
                              {qty === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-PAGE 5: SUPPORT (پشتیبانی) */}
      {currentPage === 'support' && (
        <div className="w-full min-h-screen animate-fadeIn">
          <div className="sticky top-0 z-30 bg-[#020F1E]/95 backdrop-blur-md border-b border-white/[0.08] px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage('main')}
                className="p-1.5 text-[#F8F5EF] hover:text-[#f0d47c] transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
                title="بازگشت به حساب کاربری"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.2]" />
              </button>
              <h2 className="font-black text-lg text-[#F8F5EF]">پشتیبانی امور مشتریان</h2>
            </div>
          </div>

          <div className="px-4 divide-y divide-white/[0.08]">
            <a
              href="tel:02122800000"
              className="py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#f0d47c]/15 text-[#f0d47c] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#F8F5EF]">شماره تلفن رستوران (۲۴ ساعته)</h3>
                  <p className="text-[11px] text-[#A8A49B] mt-0.5">پاسخگویی آنی واحد تشریفات و پیگیری سفارشات</p>
                </div>
              </div>
              <span className="font-mono text-sm text-[#f0d47c] font-black dir-ltr">
                ۰۲۱-۲۲۸۰۰۰۰۰
              </span>
            </a>

            <div className="py-5 space-y-3 text-xs">
              <h4 className="font-black text-sm text-[#F8F5EF] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#f0d47c]" />
                <span>پرسش‌های متداول مشتریان</span>
              </h4>
              <div className="space-y-3 text-[#A8A49B] text-[11px] leading-relaxed divide-y divide-white/[0.06] pt-1">
                <div className="pt-2">
                  <p className="font-bold text-[#F8F5EF] mb-0.5">زمان تحویل سفارش‌ها چقدر است؟</p>
                  <p>معمولاً بین ۲۵ تا ۳۵ دقیقه بسته به موقعیت مکانی و در بسته‌بندی حرارتی ارسال می‌شود.</p>
                </div>
                <div className="pt-3">
                  <p className="font-bold text-[#F8F5EF] mb-0.5">چگونه می‌توان سفارش را پیگیری کرد؟</p>
                  <p>از طریق منوی سفارشات می‌توانید وضعیت سفارش را زنده ببینید یا با شماره ۲۲۸۰۰۰۰۰-۰۲۱ تماس حاصل فرمایید.</p>
                </div>
                <div className="pt-3">
                  <p className="font-bold text-[#F8F5EF] mb-0.5">آیا بسته‌بندی غذاها گرم تحویل داده می‌شود؟</p>
                  <p>تمامی غذاها در ظروف سیل‌شده اختصاصی و باکس‌های عایق حرارتی حمل می‌شوند تا در دمای مطلوب به دست شما برسند.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-PAGE 6: USER INFO (اطلاعات کاربری) */}
      {currentPage === 'info' && (
        <div className="w-full min-h-screen animate-fadeIn">
          <div className="sticky top-0 z-30 bg-[#020F1E]/95 backdrop-blur-md border-b border-white/[0.08] px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage('main')}
                className="p-1.5 text-[#F8F5EF] hover:text-[#f0d47c] transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
                title="بازگشت به حساب کاربری"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.2]" />
              </button>
              <h2 className="font-black text-lg text-[#F8F5EF]">اطلاعات کاربری</h2>
            </div>
          </div>

          <form onSubmit={handleSaveInfo} className="px-4 py-4 space-y-4">
            <div className="divide-y divide-white/[0.08] space-y-3">
              <div className="pt-1">
                <label className="text-xs text-[#A8A49B] block mb-1.5 font-bold">نام و نام خانوادگی</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-3 rounded-[8px] bg-[#020F1E] border border-white/15 text-xs text-[#F8F5EF] focus:outline-none focus:border-[#f0d47c]"
                  required
                />
              </div>

              <div className="pt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-[#A8A49B] font-bold">شماره تلفن همراه</label>
                  {onOpenLoginModal && (
                    <button
                      type="button"
                      onClick={onOpenLoginModal}
                      className="text-[11px] text-[#5D87FF] hover:underline font-bold cursor-pointer"
                    >
                      تغییر شماره / ورود به حساب دیگر
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={editPhone}
                  disabled
                  className="w-full p-3 rounded-[8px] bg-[#020F1E]/50 border border-white/10 text-xs text-[#A8A49B] cursor-not-allowed font-mono"
                />
              </div>

              <div className="pt-3">
                <label className="text-xs text-[#A8A49B] block mb-1.5 font-bold">پست الکترونیک (ایمیل)</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full p-3 rounded-[8px] bg-[#020F1E] border border-white/15 text-xs text-[#F8F5EF] focus:outline-none focus:border-[#f0d47c]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-[6px] bg-[#f0d47c] hover:bg-[#e4c76a] text-[#020F1E] font-black text-xs shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              ذخیره تغییرات
            </button>
          </form>
        </div>
      )}

      {/* SUB-PAGE 7: ADMIN PANEL */}
      {currentPage === 'admin' && (
        <div className="w-full min-h-screen animate-fadeIn">
          <AdminPanel
            onBack={() => setCurrentPage('main')}
            lang={lang}
            currentUser={user}
            onRefreshFoods={onRefreshFoods}
            onUpdateOrderStatus={onUpdateOrderStatus}
            onAddNewFood={onAddNewFood}
          />
        </div>
      )}

      {/* MAIN PROFILE MENU */}
      {currentPage === 'main' && (
        <div className="w-full animate-fadeIn">
          {/* Header Row */}
          <div className="px-4 pt-4 pb-3 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <button
                onClick={() => {
                  if (onNavigateToHome) onNavigateToHome();
                }}
                className="p-1 text-[#F8F5EF] hover:text-[#f0d47c] transition-colors mt-0.5 cursor-pointer"
                title="بازگشت به صفحه اصلی"
                aria-label="بازگشت"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.2]" />
              </button>

              <div>
                <h1 className="font-black text-xl text-[#F8F5EF] leading-snug">
                  {user.fullName}
                </h1>
                <p className="text-xs text-[#A8A49B] mt-1 font-mono tracking-wide">
                  {toPersianDigits(user.phone)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <button
                onClick={() => setCurrentPage('info')}
                className="text-xs text-[#5D87FF] hover:underline font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>اطلاعات کاربری</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="h-2.5 bg-[#010811] w-full shrink-0 my-2" />

          {/* Main Menu Items */}
          <div className="px-4 divide-y divide-white/[0.06]">
            {/* 1. سفارشات (غیرفعال) */}
            <div
              className="w-full py-4 flex items-center justify-between text-start opacity-60 cursor-not-allowed select-none"
            >
              <div className="flex items-center gap-3.5">
                <ShoppingBag className="w-5 h-5 text-[#A8A49B] stroke-[1.8] shrink-0" />
                <div>
                  <div className="font-bold text-sm text-[#F8F5EF]">سفارشات</div>
                  <div className="text-[11px] text-[#A8A49B] mt-0.5">مشاهده سوابق خرید و فاکتورها</div>
                </div>
              </div>
              <span className="bg-amber-500/10 text-[#f0d47c] border border-[#f0d47c]/30 text-[11px] font-bold px-2.5 py-0.5 rounded-[4px]">
                غیرفعال
              </span>
            </div>

            {/* 2. تخفیف‌ها (غیرفعال) */}
            <div
              className="w-full py-4 flex items-center justify-between text-start opacity-60 cursor-not-allowed select-none"
            >
              <div className="flex items-center gap-3.5">
                <Tag className="w-5 h-5 text-[#A8A49B] stroke-[1.8] -rotate-90 shrink-0" />
                <div>
                  <div className="font-bold text-sm text-[#F8F5EF]">تخفیف‌ها</div>
                  <div className="text-[11px] text-[#A8A49B] mt-0.5">کوپن‌ها و جوایز فعال</div>
                </div>
              </div>
              <span className="bg-amber-500/10 text-[#f0d47c] border border-[#f0d47c]/30 text-[11px] font-bold px-2.5 py-0.5 rounded-[4px]">
                غیرفعال
              </span>
            </div>

            {/* 3. آدرس‌ها (غیرفعال) */}
            <div
              className="w-full py-4 flex items-center justify-between text-start opacity-60 cursor-not-allowed select-none"
            >
              <div className="flex items-center gap-3.5">
                <MapPin className="w-5 h-5 text-[#A8A49B] stroke-[1.8] shrink-0" />
                <div>
                  <div className="font-bold text-sm text-[#F8F5EF]">آدرس‌ها</div>
                  <div className="text-[11px] text-[#A8A49B] mt-0.5">مدیریت نشانی‌ها و موقعیت تحویل سفارش</div>
                </div>
              </div>
              <span className="bg-amber-500/10 text-[#f0d47c] border border-[#f0d47c]/30 text-[11px] font-bold px-2.5 py-0.5 rounded-[4px]">
                غیرفعال
              </span>
            </div>

            {/* 4. باشگاه مشتریان (غیرفعال) */}
            <div
              className="w-full py-4 flex items-center justify-between text-start opacity-60 cursor-not-allowed select-none"
            >
              <div className="flex items-center gap-3.5">
                <Award className="w-5 h-5 text-[#f0d47c] stroke-[1.8] shrink-0" />
                <div>
                  <div className="font-bold text-sm text-[#F8F5EF]">باشگاه مشتریان شایگان</div>
                  <div className="text-[11px] text-[#A8A49B] mt-0.5">امتیازات زرین، هدایا و تخفیف‌های وفاداری</div>
                </div>
              </div>

              <span className="bg-amber-500/10 text-[#f0d47c] border border-[#f0d47c]/30 text-[11px] font-bold px-2.5 py-0.5 rounded-[4px]">
                غیرفعال
              </span>
            </div>

            {/* 5. رزرو میز و سالن VIP (غیرفعال) */}
            <div
              className="w-full py-4 flex items-center justify-between text-start opacity-60 cursor-not-allowed select-none"
            >
              <div className="flex items-center gap-3.5">
                <Calendar className="w-5 h-5 text-[#f0d47c] stroke-[1.8] shrink-0" />
                <div>
                  <div className="font-bold text-sm text-[#F8F5EF]">رزرو میز و سالن VIP</div>
                  <div className="text-[11px] text-[#A8A49B] mt-0.5">رزرو آنلاین میز، تراس اختصاصی و اتاق جلسات</div>
                </div>
              </div>

              <span className="bg-amber-500/10 text-[#f0d47c] border border-[#f0d47c]/30 text-[11px] font-bold px-2.5 py-0.5 rounded-[4px]">
                غیرفعال
              </span>
            </div>

            {/* 4. دعوت از دوستان */}
            <button
              onClick={() => setCurrentPage('invite')}
              className="w-full py-4 flex items-center justify-between text-start hover:bg-white/[0.02] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Gift className="w-5 h-5 text-[#A8A49B] group-hover:text-[#f0d47c] transition-colors stroke-[1.8] shrink-0" />
                <div>
                  <div className="font-bold text-sm text-[#F8F5EF]">دعوت از دوستان</div>
                  <div className="text-[11px] text-[#A8A49B] mt-0.5">اشتراک‌گذاری لذت تجربه شایگان</div>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#A8A49B]/60 group-hover:text-[#F8F5EF] transition-colors" />
            </button>

            {/* 5. مورد علاقه‌ها */}
            <button
              onClick={() => setCurrentPage('favorites')}
              className="w-full py-4 flex items-center justify-between text-start hover:bg-white/[0.02] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Heart className="w-5 h-5 text-[#A8A49B] group-hover:text-rose-400 transition-colors stroke-[1.8] shrink-0" />
                <div>
                  <div className="font-bold text-sm text-[#F8F5EF]">مورد علاقه‌ها</div>
                  <div className="text-[11px] text-[#A8A49B] mt-0.5">غذاها و آیتم‌های نشان‌شده</div>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#A8A49B]/60 group-hover:text-[#F8F5EF] transition-colors" />
            </button>

            {/* 6. پشتیبانی */}
            <button
              onClick={() => setCurrentPage('support')}
              className="w-full py-4 flex items-center justify-between text-start hover:bg-white/[0.02] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Headphones className="w-5 h-5 text-[#A8A49B] group-hover:text-[#5D87FF] transition-colors stroke-[1.8] shrink-0" />
                <div>
                  <div className="font-bold text-sm text-[#F8F5EF]">پشتیبانی</div>
                  <div className="text-[11px] text-[#A8A49B] mt-0.5">پاسخگویی ۲۴ ساعته امور مشتریان</div>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#A8A49B]/60 group-hover:text-[#F8F5EF] transition-colors" />
            </button>

            {/* 7. داستان شایگان */}
            <button
              onClick={() => {
                if (onNavigateToStory) onNavigateToStory();
              }}
              className="w-full py-4 flex items-center justify-between text-start hover:bg-white/[0.02] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Sparkles className="w-5 h-5 text-[#A8A49B] group-hover:text-[#f0d47c] transition-colors stroke-[1.8] shrink-0" />
                <div>
                  <div className="font-bold text-sm text-[#F8F5EF]">داستان شایگان</div>
                  <div className="text-[11px] text-[#A8A49B] mt-0.5">آشنایی با اصالت و تاریخچه کاخ پذیرایی</div>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#A8A49B]/60 group-hover:text-[#F8F5EF] transition-colors" />
            </button>

            {/* Admin Panel Entry */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setCurrentPage('admin' as any)}
                className="w-full py-4 flex items-center justify-between text-start hover:bg-white/[0.02] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <ShieldCheck className="w-5 h-5 text-[#f0d47c] stroke-[1.8] shrink-0" />
                  <div>
                    <div className="font-bold text-sm text-[#f0d47c]">پنل مدیریت کاخ شایگان</div>
                    <div className="text-[11px] text-[#f0d47c]/70 mt-0.5">مدیریت غذاها، سفارشات، اعضا و کدهای تخفیف</div>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-[#f0d47c] group-hover:text-[#F8F5EF] transition-colors" />
              </button>
            )}
          </div>

          <div className="h-2.5 bg-[#010811] w-full shrink-0 my-2" />

          {/* 8. خروج از حساب کاربری */}
          <div className="px-4">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full py-4 flex items-center justify-between text-start hover:bg-white/[0.02] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <LogOut className="w-5 h-5 text-rose-400 stroke-[1.8] shrink-0" />
                <div className="font-bold text-sm text-rose-400">خروج از حساب کاربری</div>
              </div>
              <ChevronLeft className="w-4 h-4 text-rose-400/60 group-hover:text-rose-400 transition-colors" />
            </button>
          </div>

          <div className="h-2.5 bg-[#010811] w-full shrink-0 mb-4" />

          {/* FOOTER */}
          <footer className="w-full bg-[#031326] border-t border-[#f0d47c]/20 pt-8 pb-16 px-6 text-[#F8F5EF] space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#f0d47c]/10 border border-[#f0d47c]/30 flex items-center justify-center mx-auto text-[#f0d47c]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-amiri font-bold text-2xl text-[#f0d47c]">
                کاخ پذیرایی شایگان
              </h3>
              <p className="text-xs text-[#A8A49B] leading-relaxed max-w-sm mx-auto">
                {RESTAURANT_INFO.tagline}
              </p>
            </div>

            <div className="rounded-[16px] bg-[#020F1E] border border-white/[0.08] p-4 space-y-3 text-xs">
              <div className="flex items-center gap-3 text-[#A8A49B]">
                <MapPin className="w-4 h-4 text-[#f0d47c] shrink-0" />
                <span className="text-[#F8F5EF]">{RESTAURANT_INFO.address}</span>
              </div>
              <div className="flex items-center gap-3 text-[#A8A49B]">
                <Phone className="w-4 h-4 text-[#f0d47c] shrink-0" />
                <span className="text-[#F8F5EF] font-mono">{RESTAURANT_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-[#A8A49B]">
                <Clock className="w-4 h-4 text-[#f0d47c] shrink-0" />
                <span className="text-[#F8F5EF]">{RESTAURANT_INFO.workingHours}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#f0d47c]">
              <ShieldCheck className="w-4 h-4" />
              <span>دارای نشان زرین اصالت و استاندارد بهداشت بین‌المللی</span>
            </div>

            <div className="text-center text-[11px] text-[#A8A49B]/50 pt-2 border-t border-white/[0.06]">
              تمامی حقوق برای کاخ و رستوران شایگان محفوظ است © ۱۴۰۴
            </div>
          </footer>
        </div>
      )}

      {/* LOGOUT CONFIRMATION DIALOG */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn p-4">
          <div className="w-full max-w-xs bg-[#071A2D] border border-white/15 rounded-[22px] p-6 space-y-4 text-center font-vazir shadow-2xl animate-slideUp">
            <div className="w-14 h-14 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>

            <h3 className="font-black text-base text-[#F8F5EF]">خروج از حساب کاربری</h3>
            <p className="text-xs text-[#A8A49B] leading-relaxed">
              آیا اطمینان دارید که می‌خواهید از حساب کاربری خود خارج شوید؟
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="py-2.5 rounded-[6px] bg-white/10 text-[#F8F5EF] font-bold text-xs hover:bg-white/15 transition-all cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('shaygan_user');
                  } catch {}
                  if (onUpdateCurrentUser) onUpdateCurrentUser(null);
                  setIsLogoutModalOpen(false);
                  showToast('با موفقیت از حساب کاربری خارج شدید.');
                }}
                className="py-2.5 rounded-[6px] bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                خروج از حساب
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 inset-x-0 mx-auto w-fit z-[100] px-4 py-2 rounded-full bg-[#f0d47c] text-[#020F1E] font-bold text-xs shadow-2xl animate-fadeIn">
          {toastMsg}
        </div>
      )}

      {/* Invoice Drawer */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-xs animate-fadeIn font-vazir">
          <div className="fixed inset-0" onClick={() => setSelectedInvoiceOrder(null)} />

          <div className="relative w-full max-w-xl md:max-w-2xl bg-[#071A2D] border-t border-white/15 rounded-t-[32px] p-6 shadow-2xl z-10 animate-slideUp max-h-[85vh] flex flex-col">
            <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mb-4 shrink-0" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div>
                <h3 className="font-black text-base text-[#F8F5EF]">لیست اقلام و مشخصات سفارش</h3>
                <p className="text-xs text-[#A8A49B] mt-0.5 font-mono">سفارش #{selectedInvoiceOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-2 rounded-xl text-[#A8A49B] hover:text-[#F8F5EF] hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 overflow-y-auto flex-1 divide-y divide-white/5">
              <div className="flex items-center justify-between text-xs text-[#A8A49B] pb-2">
                <span>نوع تحویل:</span>
                <span>{getDeliveryTypeBadge(selectedInvoiceOrder.deliveryType)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#A8A49B] pb-2">
                <span>آدرس یا موقعیت تحویل:</span>
                <span className="text-[#F8F5EF] font-medium text-left max-w-xs truncate">{selectedInvoiceOrder.address}</span>
              </div>

              {selectedInvoiceOrder.items.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.food.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&q=80'}
                      alt={item.food.name}
                      className="w-14 h-14 rounded-2xl object-cover bg-white/5 border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[#F8F5EF] leading-snug truncate">
                        {item.food.name}
                      </h4>
                      <div className="text-xs text-[#f0d47c] font-mono mt-1">
                        {formatPrice(item.food.price)} تومان
                      </div>
                    </div>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-xl bg-[#f0d47c]/15 border border-[#f0d47c]/30 text-[#f0d47c] font-black text-xs font-mono shrink-0">
                    {toPersianDigits(item.quantity)} عدد
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 shrink-0">
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-[#F8F5EF] font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
