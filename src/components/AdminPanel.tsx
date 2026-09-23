import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  Tag, 
  Users, 
  Utensils, 
  ShoppingBag, 
  CheckCircle2, 
  X, 
  Percent, 
  AlertCircle,
  Calendar,
  UserCheck,
  Shield,
  Eye,
  RefreshCw,
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
  Phone,
  MapPin,
  Flame,
  Award,
  LogOut,
  Bell,
  MoreVertical,
  Layers,
  Sparkles,
  Truck,
  Store,
  UtensilsCrossed,
  Wand2,
  Minus,
  UserPlus,
  Copy
} from 'lucide-react';
import { FoodItem, Order, UserProfile, DiscountCoupon, Language, OrderStatus, DeliveryType } from '../types';
import { api } from '../services/api';
import { formatPrice, toPersianDigits } from '../utils/translations';
import { CATEGORIES } from '../data/mockData';

interface AdminPanelProps {
  onBack: () => void;
  lang: Language;
  currentUser: UserProfile;
  onRefreshFoods?: () => void;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => void;
  onAddNewFood?: (newFood: FoodItem) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBack,
  lang,
  currentUser,
  onRefreshFoods,
  onUpdateOrderStatus,
  onAddNewFood,
}) => {
  // Tabs: dashboard, foods, orders, coupons, users
  const [activeTab, setActiveTab] = useState<'dashboard' | 'foods' | 'orders' | 'coupons' | 'users'>('foods');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'unavailable' | 'discounted'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Selected table rows (checkboxes)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Foods state
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Partial<FoodItem> | null>(null);
  const [hasDiscountToggle, setHasDiscountToggle] = useState(false);
  const [discountPercentInput, setDiscountPercentInput] = useState<number>(15);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // New Order Creation State
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newOrderCustomerName, setNewOrderCustomerName] = useState('');
  const [newOrderPhone, setNewOrderPhone] = useState('');
  const [newOrderDeliveryType, setNewOrderDeliveryType] = useState<DeliveryType>('dine_in');
  const [newOrderAddressOrTable, setNewOrderAddressOrTable] = useState('میز شماره ۱');
  const [newOrderItems, setNewOrderItems] = useState<Record<string, number>>({});
  const [newOrderNotes, setNewOrderNotes] = useState('');

  // Coupons state
  const [coupons, setCoupons] = useState<DiscountCoupon[]>([]);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<DiscountCoupon>>({
    code: '',
    title: '',
    type: 'percent',
    amount: 15,
    maxDiscount: 100000,
    minOrderAmount: 200000,
    isFirstOrderOnly: false,
    isSingleUse: true,
    isCampaign: false,
    isActive: true,
  });

  // Users state
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<UserProfile> | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Helper: Truncate item names to at most 3 words + '...'
  const summarizeItemName = (name: string, maxWords = 3) => {
    if (!name) return '';
    const words = name.trim().split(/\s+/);
    if (words.length <= maxWords) return name;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  // Helper: 12-character alphanumeric code generator
  const generateRandomCode = (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Load data based on active tab
  const loadFoods = async () => {
    try {
      setLoading(true);
      const data = await api.getFoods();
      setFoods(data);
    } catch (err: any) {
      showToast(err.message || 'خطا در بارگذاری غذاها');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.adminGetOrders(orderStatusFilter !== 'all' ? orderStatusFilter : undefined);
      setOrders(data);
    } catch (err: any) {
      showToast(err.message || 'خطا در بارگذاری سفارشات');
    } finally {
      setLoading(false);
    }
  };

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await api.adminGetCoupons();
      setCoupons(data);
    } catch (err: any) {
      showToast(err.message || 'خطا در بارگذاری کوپن‌ها');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.adminGetUsers();
      setUsers(data);
    } catch (err: any) {
      showToast(err.message || 'خطا در بارگذاری اعضا');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
    loadOrders();
    loadCoupons();
    loadUsers();
  }, []);

  useEffect(() => {
    if (activeTab === 'foods') loadFoods();
    if (activeTab === 'orders') loadOrders();
    if (activeTab === 'coupons') loadCoupons();
    if (activeTab === 'users') loadUsers();
    setCurrentPage(1);
    setSelectedIds([]);
  }, [activeTab, orderStatusFilter]);

  // Open food modal for edit or create
  const handleOpenFoodModal = (food?: FoodItem) => {
    if (food) {
      setEditingFood(food);
      const isDiscounted = Boolean(food.discountPercent && food.discountPercent > 0);
      setHasDiscountToggle(isDiscounted);
      setDiscountPercentInput(food.discountPercent || 15);
    } else {
      setEditingFood({
        category: 'kebab',
        price: 350000,
        isAvailable: true,
        preparationTime: '۲۰ دقیقه',
        ingredients: [],
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85',
      });
      setHasDiscountToggle(false);
      setDiscountPercentInput(15);
    }
    setIsFoodModalOpen(true);
  };

  // Food handlers
  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFood?.name || !editingFood?.price) {
      showToast('لطفا نام و قیمت غذا را وارد نمایید');
      return;
    }

    try {
      setLoading(true);

      const payload: Partial<FoodItem> = {
        ...editingFood,
      };

      if (hasDiscountToggle && discountPercentInput > 0 && typeof payload.price === 'number') {
        payload.discountPercent = discountPercentInput;
        if (!payload.originalPrice || payload.originalPrice <= payload.price) {
          payload.originalPrice = Math.round(payload.price / (1 - discountPercentInput / 100));
        }
      } else {
        payload.discountPercent = 0;
        payload.originalPrice = payload.price;
      }

      if (editingFood.id) {
        await api.adminUpdateFood(editingFood.id, payload);
        showToast('اطلاعات غذا با موفقیت بروز شد');
      } else {
        await api.adminCreateFood(payload);
        showToast('غذای جدید با موفقیت به منو اضافه شد');
      }
      setIsFoodModalOpen(false);
      setEditingFood(null);
      loadFoods();
      if (onRefreshFoods) onRefreshFoods();
    } catch (err: any) {
      showToast(err.message || 'خطا در ثبت غذا');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFood = async (id: string) => {
    try {
      setLoading(true);
      await api.adminDeleteFood(id);
      setFoods(prev => prev.filter(f => String(f.id).trim().toLowerCase() !== String(id).trim().toLowerCase()));
      showToast('غذا با موفقیت از منو و دیتابیس حذف شد');
      await loadFoods();
      if (onRefreshFoods) onRefreshFoods();
    } catch (err: any) {
      showToast(err.message || 'خطا در حذف غذا');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (food: FoodItem) => {
    try {
      const newStatus = !(food.isAvailable ?? true);
      await api.adminUpdateFood(food.id, { isAvailable: newStatus });
      showToast(newStatus ? 'موجودی غذا فعال شد' : 'موجودی غذا ناموجود اعلام شد');
      loadFoods();
      if (onRefreshFoods) onRefreshFoods();
    } catch (err: any) {
      showToast(err.message || 'خطا در تغییر وضعیت موجودی');
    }
  };

  // Order status handler
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setLoading(true);
      await api.adminUpdateOrderStatus(orderId, { status });
      showToast('وضعیت سفارش بروزرسانی شد');
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
      if (onUpdateOrderStatus) {
        onUpdateOrderStatus(orderId, status);
      }
    } catch (err: any) {
      showToast(err.message || 'خطا در بروزرسانی وضعیت');
    } finally {
      setLoading(false);
    }
  };

  // Create Order by Admin
  const handleCreateAdminOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedItemKeys = Object.keys(newOrderItems).filter(k => newOrderItems[k] > 0);
    if (selectedItemKeys.length === 0) {
      showToast('لطفا حداقل یک غذا برای ثبت سفارش انتخاب نمایید');
      return;
    }
    if (!newOrderCustomerName.trim() || !newOrderPhone.trim()) {
      showToast('لطفا نام مشتری و شماره تماس را وارد کنید');
      return;
    }

    try {
      setLoading(true);

      const items = selectedItemKeys.map(foodId => {
        const food = foods.find(f => f.id === foodId)!;
        return {
          food,
          quantity: newOrderItems[foodId]
        };
      });

      const subtotal = items.reduce((acc, it) => acc + it.food.price * it.quantity, 0);
      const deliveryFee = newOrderDeliveryType === 'delivery' ? 35000 : 0;
      const total = subtotal + deliveryFee;

      await api.createOrder({
        customerName: newOrderCustomerName.trim(),
        phone: newOrderPhone.trim(),
        deliveryType: newOrderDeliveryType,
        address: newOrderAddressOrTable.trim() || (newOrderDeliveryType === 'dine_in' ? 'صرف در سالن' : 'تحویل حضوری در رستوران'),
        items,
        subtotal,
        deliveryFee,
        discount: 0,
        total,
        status: 'cooking',
        notes: newOrderNotes,
      });

      showToast('سفارش جدید با موفقیت ثبت گردید');
      setIsNewOrderModalOpen(false);
      setNewOrderItems({});
      setNewOrderCustomerName('');
      setNewOrderPhone('');
      setNewOrderNotes('');
      loadOrders();
    } catch (err: any) {
      showToast(err.message || 'خطا در ثبت سفارش جدید');
    } finally {
      setLoading(false);
    }
  };

  // Coupon handlers
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.amount) {
      showToast('لطفا کد و مقدار تخفیف را وارد نمایید');
      return;
    }

    try {
      setLoading(true);
      await api.adminCreateCoupon(newCoupon);
      showToast('کد تخفیف جدید ایجاد شد');
      setIsCouponModalOpen(false);
      setNewCoupon({
        code: '',
        title: '',
        type: 'percent',
        amount: 15,
        maxDiscount: 100000,
        minOrderAmount: 200000,
        isFirstOrderOnly: false,
        isSingleUse: true,
        isCampaign: false,
        isActive: true,
      });
      loadCoupons();
    } catch (err: any) {
      showToast(err.message || 'خطا در ایجاد کوپن');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCoupon = async (coupon: DiscountCoupon) => {
    try {
      await api.adminToggleCoupon(coupon.id);
      showToast(coupon.isActive ? 'کوپن غیرفعال شد' : 'کوپن فعال شد');
      loadCoupons();
    } catch (err: any) {
      showToast(err.message || 'خطا در تغییر وضعیت');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      setLoading(true);
      await api.adminDeleteCoupon(id);
      setCoupons(prev => prev.filter(c => String(c.id).trim().toUpperCase() !== String(id).trim().toUpperCase() && String(c.code).trim().toUpperCase() !== String(id).trim().toUpperCase()));
      showToast('کد تخفیف با موفقیت از دیتابیس حذف شد');
      await loadCoupons();
    } catch (err: any) {
      showToast(err.message || 'خطا در حذف کوپن');
    } finally {
      setLoading(false);
    }
  };

  // Customer Management Handlers
  const handleOpenUserModal = (user?: UserProfile) => {
    if (user) {
      setEditingUser(user);
    } else {
      setEditingUser({
        fullName: '',
        phone: '',
        address: '',
        email: '',
        role: 'customer',
        membershipLevel: 'برنزی',
        points: 0,
      });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.fullName || !editingUser?.phone) {
      showToast('لطفا نام و شماره تماس مشتری را وارد نمایید');
      return;
    }

    try {
      setLoading(true);
      if (editingUser.id) {
        await api.adminUpdateUser(editingUser.id, editingUser);
        showToast('اطلاعات مشتری با موفقیت ویرایش شد');
      } else {
        await api.adminCreateUser(editingUser);
        showToast('مشتری جدید با موفقیت ثبت شد');
      }
      setIsUserModalOpen(false);
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      showToast(err.message || 'خطا در ذخیره اطلاعات مشتری');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setLoading(true);
      await api.adminDeleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId && u.phone !== userId));
      showToast('مشتری با موفقیت از دیتابیس حذف شد');
      await loadUsers();
    } catch (err: any) {
      showToast(err.message || 'خطا در حذف مشتری');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    showToast(`${label} کپی شد`);
  };

  // Filtered foods for table
  const filteredFoods = useMemo(() => {
    return foods.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.nameEn && item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

      let matchesStatus = true;
      if (statusFilter === 'available') matchesStatus = (item.isAvailable ?? true);
      if (statusFilter === 'unavailable') matchesStatus = (item.isAvailable === false);
      if (statusFilter === 'discounted') matchesStatus = Boolean(item.discountPercent && item.discountPercent > 0);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [foods, searchQuery, categoryFilter, statusFilter]);

  // Paginated foods
  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage) || 1;
  const paginatedFoods = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFoods.slice(start, start + itemsPerPage);
  }, [filteredFoods, currentPage]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedFoods.map(f => f.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
      if (deliveryTypeFilter !== 'all' && o.deliveryType !== deliveryTypeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          (o.customerName && o.customerName.toLowerCase().includes(q)) ||
          (o.phone && o.phone.includes(q))
        );
      }
      return true;
    });
  }, [orders, orderStatusFilter, deliveryTypeFilter, searchQuery]);

  // Total metrics
  const totalRevenue = useMemo(() => {
    return orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const categoryNames: Record<string, string> = {
    all: 'همه اقلام',
    kebab: 'چلو کباب',
    stew: 'چلو خورشت',
    polo: 'چلو پلو ایرانی',
    khorak: 'خوراک',
    fastfood: 'فست فود',
    dessert: 'دسرها و شیرینی ها',
    appetizer: 'سالاد و پیش غذا',
    drink: 'نوشیدنی',
    extra: 'افزودنی'
  };

  const getDeliveryTypeLabel = (deliveryType?: string) => {
    switch (deliveryType) {
      case 'dine_in':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
            <UtensilsCrossed className="w-3 h-3" />
            صرف در سالن
          </span>
        );
      case 'pickup':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            <Store className="w-3 h-3" />
            تحویل حضوری
          </span>
        );
      case 'delivery':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            <Truck className="w-3 h-3" />
            ارسال با پیک
          </span>
        );
    }
  };

  return (
    <div 
      dir="rtl" 
      className="fixed inset-0 z-50 w-screen h-screen bg-[#F6F8FA] text-[#1F2937] flex flex-row overflow-hidden font-vazir select-none"
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-xl bg-[#111827] text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-white/10 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-[72px] shrink-0 bg-white border-l border-gray-200 h-full flex flex-col items-center py-5 justify-between shadow-xs z-30">
        <div className="flex flex-col items-center gap-6">
          <div 
            className="w-11 h-11 rounded-2xl bg-[#020F1E] border border-[#f0d47c]/40 text-[#f0d47c] flex items-center justify-center font-black text-lg shadow-sm cursor-pointer hover:scale-105 transition-transform"
            title="کاخ پذیرایی شایگان"
          >
            <span>ش</span>
          </div>

          <nav className="flex flex-col items-center gap-2">
            {/* 1. Dashboard */}
            <div className="relative group">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#FFF0EB] text-[#FF5A2A] shadow-xs'
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                }`}
                aria-label="داشبورد"
              >
                <LayoutDashboard className="w-5 h-5 stroke-[2]" />
              </button>
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#111827] text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                داشبورد و آمار
              </div>
            </div>

            {/* 2. Foods & Menu */}
            <div className="relative group">
              <button
                onClick={() => setActiveTab('foods')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  activeTab === 'foods'
                    ? 'bg-[#FFF0EB] text-[#FF5A2A] shadow-xs'
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                }`}
                aria-label="منوی غذاها"
              >
                <Utensils className="w-5 h-5 stroke-[2]" />
              </button>
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#111827] text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                لیست غذاها و منو
              </div>
            </div>

            {/* 3. Orders */}
            <div className="relative group">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#FFF0EB] text-[#FF5A2A] shadow-xs'
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                }`}
                aria-label="سفارشات"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
              </button>
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#111827] text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                سفارشات و پیگیری
              </div>
            </div>

            {/* 4. Coupons */}
            <div className="relative group">
              <button
                onClick={() => setActiveTab('coupons')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  activeTab === 'coupons'
                    ? 'bg-[#FFF0EB] text-[#FF5A2A] shadow-xs'
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                }`}
                aria-label="کدهای تخفیف"
              >
                <Percent className="w-5 h-5 stroke-[2]" />
              </button>
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#111827] text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                کدهای تخفیف و پروموشن
              </div>
            </div>

            {/* 5. Users / Customers */}
            <div className="relative group">
              <button
                onClick={() => setActiveTab('users')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-[#FFF0EB] text-[#FF5A2A] shadow-xs'
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                }`}
                aria-label="مشتریان"
              >
                <Users className="w-5 h-5 stroke-[2]" />
              </button>
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#111827] text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                مشتریان و مدیریت اعضا
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom Profile Avatar & Logout */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl text-gray-400 hover:text-[#FF5A2A] hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="خروج از پنل مدیریت"
            >
              <LogOut className="w-5 h-5 -scale-y-100 stroke-[2]" />
            </button>
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#111827] text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
              خروج از پنل مدیریت
            </div>
          </div>

          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#020F1E] to-[#1E293B] border-2 border-white shadow-xs flex items-center justify-center text-white text-xs font-bold relative">
            <span>م</span>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 h-full flex flex-col overflow-y-auto bg-[#F6F8FA]">
        {/* Top Header Bar (Removed Back Button per user request) */}
        <header className="h-16 shrink-0 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در نام غذا، کد سفارش، مشتری..."
                className="w-full bg-[#F3F4F6] border border-transparent focus:border-gray-300 focus:bg-white rounded-xl py-2 px-4 pr-10 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200/60">
              <Shield className="w-3.5 h-3.5 text-[#FF5A2A]" />
              <span>{currentUser.fullName}</span>
              <span className="text-[10px] text-gray-400 bg-white px-1.5 py-0.5 rounded font-mono">مدیر ارشد</span>
            </div>
          </div>
        </header>

        {/* FOODS & MENU TAB */}
        {activeTab === 'foods' && (
          <div className="p-6 sm:p-8 space-y-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between gap-4 flex-wrap border-b border-gray-200/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-gray-200 shadow-2xs">
                  <h1 className="text-sm font-black text-gray-900">لیست غذاها و محصولات منو</h1>
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {toPersianDigits(filteredFoods.length)} قلم کالا
                </span>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
                {(['all', 'kebab', 'stew', 'polo', 'khorak', 'fastfood', 'dessert', 'appetizer', 'drink', 'extra'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategoryFilter(cat); setCurrentPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-gray-900 text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                    }`}
                  >
                    {categoryNames[cat] || cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-2xs">
                  <Filter className="w-3.5 h-3.5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
                    className="bg-transparent border-none text-xs font-bold text-gray-700 outline-none cursor-pointer"
                  >
                    <option value="all">همه وضعیت‌ها</option>
                    <option value="available">فقط موجود</option>
                    <option value="unavailable">ناموجود</option>
                    <option value="discounted">تخفیف‌دار</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => handleOpenFoodModal()}
                className="px-4 py-2.5 rounded-xl bg-[#FF5A2A] hover:bg-[#E54B1D] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>افزودن غذای جدید</span>
              </button>
            </div>

            {/* Foods Data Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs flex-1 flex flex-col justify-between">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500 text-[11px] font-bold">
                      <th className="py-3.5 px-4 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={paginatedFoods.length > 0 && selectedIds.length === paginatedFoods.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-[#FF5A2A] focus:ring-[#FF5A2A]"
                        />
                      </th>
                      <th className="py-3.5 px-4">شناسه</th>
                      <th className="py-3.5 px-4">وضعیت</th>
                      <th className="py-3.5 px-4 min-w-[200px]">نام غذا و تصویر</th>
                      <th className="py-3.5 px-4">دسته‌بندی</th>
                      <th className="py-3.5 px-4">قیمت (تومان)</th>
                      <th className="py-3.5 px-4 text-center">موجودی</th>
                      <th className="py-3.5 px-4 text-center w-24">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {paginatedFoods.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center text-gray-400">
                          هیچ غذایی با این فیلترها یافت نشد.
                        </td>
                      </tr>
                    ) : (
                      paginatedFoods.map((food) => {
                        const isAvailable = food.isAvailable ?? true;
                        const isDiscounted = Boolean(food.discountPercent && food.discountPercent > 0);
                        const isSelected = selectedIds.includes(food.id);

                        return (
                          <tr 
                            key={food.id}
                            className={`hover:bg-gray-50/70 transition-colors ${
                              isSelected ? 'bg-orange-50/40' : ''
                            }`}
                          >
                            <td className="py-3.5 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectRow(food.id)}
                                className="w-4 h-4 rounded border-gray-300 text-[#FF5A2A] focus:ring-[#FF5A2A]"
                              />
                            </td>

                            <td className="py-3.5 px-4 font-mono text-gray-500 font-semibold text-[11px]">
                              <div className="flex items-center gap-1.5">
                                <span>#{food.id}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(food.id, `شناسه ${food.name}`)}
                                  className="p-1 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                                  title="کپی شناسه غذا"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              {isAvailable ? (
                                isDiscounted ? (
                                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold border border-emerald-500/40 text-emerald-600 bg-emerald-50">
                                    تخفیف‌دار ({toPersianDigits(food.discountPercent!)}٪)
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold border border-gray-300 text-gray-600 bg-white">
                                    فعال
                                  </span>
                                )
                              ) : (
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold border border-rose-300 text-rose-600 bg-rose-50">
                                  ناموجود
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={food.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&q=80'}
                                  alt={food.name}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0 bg-gray-100"
                                />
                                <div>
                                  <div className="font-bold text-gray-900 leading-snug">
                                    {food.name}
                                  </div>
                                  <div className="text-[11px] text-gray-400 font-normal truncate max-w-[240px]">
                                    {food.ingredients && food.ingredients.length > 0
                                      ? food.ingredients.join('، ')
                                      : food.description}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-gray-600 font-medium">
                              {categoryNames[food.category] || food.category}
                            </td>

                            <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                              <div className="flex items-baseline gap-1.5">
                                <span>{toPersianDigits(food.price.toLocaleString())}</span>
                                {isDiscounted && food.originalPrice && (
                                  <span className="text-[10px] text-gray-400 line-through">
                                    {toPersianDigits(food.originalPrice.toLocaleString())}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleAvailability(food)}
                                className={`w-10 h-5 rounded-full p-0.5 transition-colors inline-flex items-center cursor-pointer ${
                                  isAvailable ? 'bg-[#FF5A2A]' : 'bg-gray-300'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                                    isAvailable ? 'translate-x-0' : '-translate-x-5'
                                  }`}
                                />
                              </button>
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleOpenFoodModal(food)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                  title="ویرایش"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteFood(food.id)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="حذف"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 flex-wrap gap-4 bg-white">
                <div>
                  نمایش {toPersianDigits((currentPage - 1) * itemsPerPage + (filteredFoods.length > 0 ? 1 : 0))} تا {toPersianDigits(Math.min(currentPage * itemsPerPage, filteredFoods.length))} از {toPersianDigits(filteredFoods.length)} غذا
                </div>

                <div className="flex items-center gap-1 font-mono">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center cursor-pointer"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded-lg font-bold transition-all cursor-pointer ${
                        currentPage === p
                          ? 'bg-[#FF5A2A] text-white'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {toPersianDigits(p)}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center cursor-pointer"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col relative">
            {/* Disabled notification banner */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-amber-800 text-xs font-bold shadow-2xs">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                این بخش در حال حاضر غیرفعال است.
              </span>
              <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-md text-[10px]">
                غیرفعال
              </span>
            </div>

            <div className="filter grayscale opacity-55 pointer-events-none select-none blur-[0.4px] space-y-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4 flex-wrap">
                <div>
                  <h1 className="text-base font-black text-gray-900">سفارشات رستوران و کاخ شایگان</h1>
                  <p className="text-xs text-gray-400 mt-0.5">مدیریت لحظه‌ای، ثبت سفارش حضوری/سالن، تغییر وضعیت و نوع تحویل</p>
                </div>

                <button
                  disabled
                  className="px-4 py-2.5 rounded-xl bg-gray-400 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>ثبت سفارش جدید (حضوری / سالن)</span>
                </button>
              </div>

              {/* Filters Row */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-xl">
                  {(['all', 'submitted', 'cooking', 'delivering', 'delivered'] as const).map((st) => (
                    <button
                      key={st}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        orderStatusFilter === st
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600'
                      }`}
                    >
                      {st === 'all' && 'همه وضعیت‌ها'}
                      {st === 'submitted' && 'جدید'}
                      {st === 'cooking' && 'در حال پخت'}
                      {st === 'delivering' && 'ارسال با پیک'}
                      {st === 'delivered' && 'تحویل شده'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-2xs">
                  <span className="text-gray-500 font-bold">نوع تحویل:</span>
                  <select
                    disabled
                    value={deliveryTypeFilter}
                    className="bg-transparent border-none text-xs font-bold text-gray-800 outline-none"
                  >
                    <option value="all">همه روش‌ها</option>
                    <option value="dine_in">صرف در سالن</option>
                    <option value="pickup">تحویل حضوری</option>
                    <option value="delivery">ارسال با پیک</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 text-[11px] font-bold">
                      <th className="py-3.5 px-4">کد سفارش</th>
                      <th className="py-3.5 px-4">مشتری</th>
                      <th className="py-3.5 px-4">تلفن</th>
                      <th className="py-3.5 px-4">نوع تحویل</th>
                      <th className="py-3.5 px-4">آدرس / میز</th>
                      <th className="py-3.5 px-4">اقلام سفارش</th>
                      <th className="py-3.5 px-4">مبلغ کل</th>
                      <th className="py-3.5 px-4">وضعیت</th>
                      <th className="py-3.5 px-4 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-16 text-center text-gray-400">
                          سفارشی یافت نشد.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                            #{order.id}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-gray-800">
                            {order.customerName}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-gray-500">
                            {toPersianDigits(order.phone)}
                          </td>
                          <td className="py-3.5 px-4">
                            {getDeliveryTypeLabel(order.deliveryType)}
                          </td>
                          <td className="py-3.5 px-4 text-gray-700 max-w-[160px] truncate" title={order.address}>
                            {order.address || '—'}
                          </td>
                          <td className="py-3.5 px-4 max-w-[220px]">
                            <div className="flex items-center gap-1 flex-wrap">
                              {order.items.map((it, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-100 px-2 py-0.5 rounded text-[11px] text-gray-700 truncate"
                                  title={`${it.food.name} (${it.quantity} عدد)`}
                                >
                                  {summarizeItemName(it.food.name, 3)} × {toPersianDigits(it.quantity)}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#FF5A2A]">
                            {toPersianDigits(order.total.toLocaleString())} تومان
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="bg-gray-100 border border-gray-200 text-gray-800 text-xs font-bold py-1 px-2.5 rounded-lg">
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="text-xs font-bold text-gray-400">
                              مشاهده جزئیات
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* COUPONS TAB */}
        {activeTab === 'coupons' && (
          <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col relative">
            {/* Disabled notification banner */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-amber-800 text-xs font-bold shadow-2xs">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                این بخش در حال حاضر غیرفعال است.
              </span>
              <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-md text-[10px]">
                غیرفعال
              </span>
            </div>

            <div className="filter grayscale opacity-55 pointer-events-none select-none blur-[0.4px] space-y-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h1 className="text-base font-black text-gray-900">کدهای تخفیف و پروموشن</h1>
                  <p className="text-xs text-gray-400 mt-0.5">مدیریت کدهای تخفیف مناسبتی، درصدی، مبلغی و اولین سفارش</p>
                </div>

                <button
                  disabled
                  className="px-4 py-2.5 rounded-xl bg-gray-400 text-white font-bold text-xs shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>تعریف کد تخفیف جدید</span>
                </button>
              </div>

              {/* Coupons Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 text-[11px] font-bold">
                      <th className="py-3.5 px-4">کد کوپن</th>
                      <th className="py-3.5 px-4">عنوان</th>
                      <th className="py-3.5 px-4">میزان تخفیف</th>
                      <th className="py-3.5 px-4">سقف تخفیف</th>
                      <th className="py-3.5 px-4">کف سفارش (حداقل خرید)</th>
                      <th className="py-3.5 px-4">تعداد استفاده</th>
                      <th className="py-3.5 px-4">وضعیت</th>
                      <th className="py-3.5 px-4 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {coupons.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center text-gray-400">
                          هیچ کد تخفیفی ثبت نشده است.
                        </td>
                      </tr>
                    ) : (
                      coupons.map((cp) => (
                        <tr key={cp.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                            {cp.code}
                          </td>
                          <td className="py-3.5 px-4 text-gray-800 font-medium">
                            {cp.title}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-emerald-600 font-mono">
                            {cp.type === 'percent' ? `${toPersianDigits(cp.amount)}٪` : `${formatPrice(cp.amount)} تومان`}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-gray-600">
                            {cp.maxDiscount ? `${formatPrice(cp.maxDiscount)} تومان` : 'نامحدود'}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-gray-500">
                            {cp.minOrderAmount ? `${formatPrice(cp.minOrderAmount)} تومان` : 'بدون کف'}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-gray-600">
                            {toPersianDigits(cp.usageCount || 0)} بار
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
                              {cp.isActive ? 'فعال' : 'غیرفعال'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center text-gray-400">
                            —
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col relative">
            {/* Disabled notification banner */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-amber-800 text-xs font-bold shadow-2xs">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                این بخش در حال حاضر غیرفعال است.
              </span>
              <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-md text-[10px]">
                غیرفعال
              </span>
            </div>

            <div className="filter grayscale opacity-55 pointer-events-none select-none blur-[0.4px] space-y-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4 flex-wrap">
                <div>
                  <h1 className="text-base font-black text-gray-900">لیست مشتریان و کاربران کاخ شایگان</h1>
                  <p className="text-xs text-gray-400 mt-0.5">افزودن مشتری، ویرایش اطلاعات، ذخیره آدرس و تعیین نقش‌ها</p>
                </div>

                <button
                  disabled
                  className="px-4 py-2.5 rounded-xl bg-gray-400 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>افزودن مشتری جدید</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 text-[11px] font-bold">
                      <th className="py-3.5 px-4">نام و نام خانوادگی</th>
                      <th className="py-3.5 px-4">تلفن همراه</th>
                      <th className="py-3.5 px-4 min-w-[200px]">آدرس ثبت‌شده</th>
                      <th className="py-3.5 px-4">نقش</th>
                      <th className="py-3.5 px-4">سطح عضویت</th>
                      <th className="py-3.5 px-4">امتیاز باشگاه</th>
                      <th className="py-3.5 px-4 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-900">
                          {u.fullName}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gray-600">
                          {toPersianDigits(u.phone)}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate" title={u.address || 'آدرسی ثبت نشده'}>
                          {u.address || (u.addresses?.[0]?.address) || '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-[#FFF0EB] text-[#FF5A2A] border border-[#FF5A2A]/30'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}>
                            {u.role === 'admin' ? 'مدیر سیستم' : 'مشتری'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-amber-600">
                          {u.membershipLevel || 'برنزی'}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                          {toPersianDigits(u.points || 0)} امتیاز
                        </td>
                        <td className="py-3.5 px-4 text-center text-gray-400">
                          —
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col">
            <div className="border-b border-gray-200 pb-4">
              <h1 className="text-base font-black text-gray-900">داشبورد آمار و تحلیل کاخ شایگان</h1>
              <p className="text-xs text-gray-400 mt-0.5">خلاصه فروش، سفارشات فعال و عملکرد رستوران</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                  <span>کل فروش تحویل‌شده</span>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-xl font-black text-gray-900 font-mono">
                  {toPersianDigits(totalRevenue.toLocaleString())} <span className="text-xs text-gray-500">تومان</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                  <span>کل سفارشات ثبت شده</span>
                  <ShoppingBag className="w-4 h-4 text-[#FF5A2A]" />
                </div>
                <div className="text-xl font-black text-gray-900 font-mono">
                  {toPersianDigits(orders.length)} <span className="text-xs text-gray-500">سفارش</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                  <span>غذاهای موجود در منو</span>
                  <Utensils className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl font-black text-gray-900 font-mono">
                  {toPersianDigits(foods.length)} <span className="text-xs text-gray-500">آیتم</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                  <span>مشتریان و اعضا</span>
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-xl font-black text-gray-900 font-mono">
                  {toPersianDigits(users.length)} <span className="text-xs text-gray-500">نفر</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD / EDIT FOOD */}
      {isFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-5 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-base text-gray-900">
                {editingFood?.id ? 'ویرایش غذای منو' : 'افزودن غذای جدید به منو'}
              </h3>
              <button
                onClick={() => setIsFoodModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFood} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">نام غذا (فارسی)</label>
                <input
                  type="text"
                  required
                  value={editingFood?.name || ''}
                  onChange={(e) => setEditingFood({ ...editingFood, name: e.target.value })}
                  placeholder="مثال: چلو کباب سلطانی زرین شایگان"
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white rounded-xl py-2 px-3 text-xs text-gray-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">دسته‌بندی</label>
                  <select
                    value={editingFood?.category || 'kebab'}
                    onChange={(e) => setEditingFood({ ...editingFood, category: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-800 outline-none cursor-pointer"
                  >
                    <option value="kebab">چلو کباب</option>
                    <option value="stew">چلو خورشت</option>
                    <option value="polo">چلو پلو ایرانی</option>
                    <option value="khorak">خوراک</option>
                    <option value="fastfood">فست فود</option>
                    <option value="dessert">دسرها و شیرینی ها</option>
                    <option value="appetizer">سالاد و پیش غذا</option>
                    <option value="drink">نوشیدنی</option>
                    <option value="extra">افزودنی</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">قیمت نهایی فروش (تومان)</label>
                  <input
                    type="number"
                    required
                    value={editingFood?.price || ''}
                    onChange={(e) => setEditingFood({ ...editingFood, price: Number(e.target.value) })}
                    placeholder="مثال: 450000"
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white rounded-xl py-2 px-3 text-xs text-gray-800 font-mono outline-none"
                  />
                </div>
              </div>

              {/* Discount Toggle */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasDiscountToggle}
                    onChange={(e) => setHasDiscountToggle(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FF5A2A] focus:ring-[#FF5A2A]"
                  />
                  <span className="text-xs font-bold text-gray-800">این غذا دارای تخفیف ویژه است</span>
                </label>
                {hasDiscountToggle && (
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-xs text-gray-600">درصد تخفیف:</span>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={discountPercentInput}
                      onChange={(e) => setDiscountPercentInput(Number(e.target.value))}
                      className="w-20 bg-white border border-gray-300 rounded-lg py-1 px-2 text-xs font-mono"
                    />
                    <span className="text-xs text-gray-400 font-mono">٪</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">لینک تصویر (URL)</label>
                <input
                  type="url"
                  value={editingFood?.image || ''}
                  onChange={(e) => setEditingFood({ ...editingFood, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white rounded-xl py-2 px-3 text-xs text-gray-800 font-mono outline-none text-left"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">توضیحات و ترکیبات</label>
                <textarea
                  rows={2}
                  value={editingFood?.description || ''}
                  onChange={(e) => setEditingFood({ ...editingFood, description: e.target.value })}
                  placeholder="راسته گوسفندی مرینیت شده، زعفران، کره محلی..."
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white rounded-xl py-2 px-3 text-xs text-gray-800 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFoodModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-bold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#FF5A2A] hover:bg-[#E54B1D] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  ذخیره اطلاعات غذا
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE COUPON */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-base text-gray-900">تعریف کد تخفیف جدید</h3>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">کد کوپن تخفیف</label>
                  <button
                    type="button"
                    onClick={() => {
                      const code12 = generateRandomCode(12);
                      setNewCoupon({ ...newCoupon, code: code12 });
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-[#FF5A2A] hover:underline font-bold cursor-pointer bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>تولید کد خودکار (۱۲ رقمی)</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={newCoupon.code || ''}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  placeholder="مثال: aB3kL9mQ2xZ7"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-mono font-bold outline-none text-left"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">عنوان فارسی کوپن</label>
                <input
                  type="text"
                  required
                  value={newCoupon.title || ''}
                  onChange={(e) => setNewCoupon({ ...newCoupon, title: e.target.value })}
                  placeholder="تخفیف ویژه جشنواره کاخ شایگان"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">نوع تخفیف</label>
                  <select
                    value={newCoupon.type || 'percent'}
                    onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none cursor-pointer"
                  >
                    <option value="percent">درصدی (٪)</option>
                    <option value="fixed">مبلغ ثابت (تومان)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    {newCoupon.type === 'percent' ? 'درصد تخفیف (٪)' : 'مبلغ تخفیف (تومان)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={newCoupon.amount || ''}
                    onChange={(e) => setNewCoupon({ ...newCoupon, amount: Number(e.target.value) })}
                    placeholder={newCoupon.type === 'percent' ? '20' : '50000'}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-mono outline-none"
                  />
                </div>
              </div>

              {newCoupon.type === 'percent' && (
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    سقف تخفیف درصدی (تومان) - اختیاری
                  </label>
                  <input
                    type="number"
                    value={newCoupon.maxDiscount || ''}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) || undefined })}
                    placeholder="مثال: 150000 (تخفیف تا سقف ۱۵۰ هزار تومان)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-mono outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">درصد تخفیف اعمال‌شده از این سقف فراتر نخواهد رفت.</p>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  کف سفارش و حداقل خرید برای اعمال تخفیف (تومان)
                </label>
                <input
                  type="number"
                  value={newCoupon.minOrderAmount || ''}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: Number(e.target.value) || 0 })}
                  placeholder="مثال: 250000"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-mono outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-bold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#FF5A2A] hover:bg-[#E54B1D] text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  ایجاد کوپن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW ORDER */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-base text-gray-900">ثبت سفارش جدید در سیستم</h3>
                <p className="text-xs text-gray-400">ثبت سفارش برای مشتریان حضوری، سالن غذاخوری یا تحویل پیک</p>
              </div>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdminOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">نام مشتری</label>
                  <input
                    type="text"
                    required
                    value={newOrderCustomerName}
                    onChange={(e) => setNewOrderCustomerName(e.target.value)}
                    placeholder="مثال: جناب دکتر رضایی"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">شماره تماس</label>
                  <input
                    type="text"
                    required
                    value={newOrderPhone}
                    onChange={(e) => setNewOrderPhone(e.target.value)}
                    placeholder="09123456789"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-mono outline-none text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setNewOrderDeliveryType('dine_in');
                    setNewOrderAddressOrTable('میز شماره ۱');
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    newOrderDeliveryType === 'dine_in'
                      ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-2xs'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>صرف در سالن (میز)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewOrderDeliveryType('pickup');
                    setNewOrderAddressOrTable('تحویل حضوری در کانتر رستوران');
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    newOrderDeliveryType === 'pickup'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-2xs'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>تحویل حضوری (بیرون‌بر)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewOrderDeliveryType('delivery');
                    setNewOrderAddressOrTable('');
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    newOrderDeliveryType === 'delivery'
                      ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-2xs'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>ارسال با پیک</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {newOrderDeliveryType === 'dine_in' ? 'شماره یا نام میز سالن' : 'آدرس و نشانی تحویل'}
                </label>
                <input
                  type="text"
                  required
                  value={newOrderAddressOrTable}
                  onChange={(e) => setNewOrderAddressOrTable(e.target.value)}
                  placeholder={newOrderDeliveryType === 'dine_in' ? 'مثال: میز VIP ۲' : 'آدرس دقیق مشتری...'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">انتخاب اقلام غذا از منو:</label>
                <div className="max-h-56 overflow-y-auto divide-y divide-gray-100 border border-gray-200 rounded-2xl p-2 bg-gray-50/60">
                  {foods.map((food) => {
                    const qty = newOrderItems[food.id] || 0;
                    return (
                      <div key={food.id} className="py-2 px-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={food.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=100&q=80'}
                            alt={food.name}
                            className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-gray-800 truncate">{food.name}</p>
                            <p className="text-[11px] text-gray-500 font-mono">{formatPrice(food.price)} تومان</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 bg-white border border-gray-200 rounded-xl px-2 py-1">
                          <button
                            type="button"
                            onClick={() => setNewOrderItems({ ...newOrderItems, [food.id]: qty + 1 })}
                            className="w-6 h-6 rounded-lg bg-[#FF5A2A] text-white flex items-center justify-center font-bold text-xs hover:bg-[#E54B1D] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center font-mono font-bold text-xs text-gray-800">
                            {toPersianDigits(qty)}
                          </span>
                          <button
                            type="button"
                            disabled={qty === 0}
                            onClick={() => setNewOrderItems({ ...newOrderItems, [food.id]: Math.max(0, qty - 1) })}
                            className="w-6 h-6 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-30 flex items-center justify-center font-bold text-xs hover:bg-gray-200 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">یادداشت سفارش (اختیاری)</label>
                <input
                  type="text"
                  value={newOrderNotes}
                  onChange={(e) => setNewOrderNotes(e.target.value)}
                  placeholder="مثال: بدون فلفل، ته‌دیگ زعفرانی دوبل..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-bold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-[#FF5A2A] hover:bg-[#E54B1D] text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
                >
                  ثبت نهایی سفارش
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CUSTOMER */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-base text-gray-900">
                {editingUser?.id ? 'ویرایش اطلاعات مشتری' : 'افزودن مشتری جدید'}
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">نام و نام خانوادگی</label>
                <input
                  type="text"
                  required
                  value={editingUser?.fullName || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  placeholder="مثال: سهراب مرادی"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">شماره تلفن همراه</label>
                <input
                  type="text"
                  required
                  value={editingUser?.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  placeholder="09123456789"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-mono outline-none text-left"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">آدرس و نشانی مشتری</label>
                <textarea
                  rows={2}
                  value={editingUser?.address || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                  placeholder="تهران، خیابان، پلاک..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">نقش کاربری</label>
                  <select
                    value={editingUser?.role || 'customer'}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none cursor-pointer"
                  >
                    <option value="customer">مشتری عادی</option>
                    <option value="admin">مدیر سیستم</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">سطح عضویت</label>
                  <select
                    value={editingUser?.membershipLevel || 'برنزی'}
                    onChange={(e) => setEditingUser({ ...editingUser, membershipLevel: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none cursor-pointer"
                  >
                    <option value="برنزی">برنزی</option>
                    <option value="نقره‌ای">نقره‌ای</option>
                    <option value="طلایی">طلایی</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">امتیاز باشگاه مشتریان</label>
                <input
                  type="number"
                  value={editingUser?.points || 0}
                  onChange={(e) => setEditingUser({ ...editingUser, points: Number(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-mono outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-bold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#FF5A2A] hover:bg-[#E54B1D] text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  ذخیره اطلاعات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAIL POPUP */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-base text-gray-900">جزئیات سفارش #{selectedOrder.id}</h3>
                <span className="text-xs text-gray-400 font-mono">{selectedOrder.orderTime}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">مشتری:</span>
                <span className="font-bold text-gray-900">{selectedOrder.customerName} ({toPersianDigits(selectedOrder.phone)})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 items-center">
                <span className="text-gray-500">نوع تحویل:</span>
                <span>{getDeliveryTypeLabel(selectedOrder.deliveryType)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">آدرس / شماره میز:</span>
                <span className="font-medium text-gray-800 text-left max-w-xs">{selectedOrder.address || '—'}</span>
              </div>
              {selectedOrder.notes && (
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">یادداشت سفارش:</span>
                  <span className="font-medium text-amber-700 text-left max-w-xs">{selectedOrder.notes}</span>
                </div>
              )}
              <div className="py-2 border-b border-gray-100 space-y-1.5">
                <span className="text-gray-500 block font-bold">اقلام خریداری شده:</span>
                <div className="space-y-1.5">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                      <span>{it.food.name}</span>
                      <span className="font-mono font-bold">{toPersianDigits(it.quantity)} عدد</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between py-1 font-bold text-sm">
                <span>مبلغ کل پرداختی:</span>
                <span className="text-[#FF5A2A] font-mono">{toPersianDigits(selectedOrder.total.toLocaleString())} تومان</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs cursor-pointer"
            >
              بستن پنجره
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
