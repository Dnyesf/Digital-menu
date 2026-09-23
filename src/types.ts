export type Language = 'fa' | 'en';
export type Theme = 'dark' | 'light';

export interface FoodOption {
  id: string;
  name: string;
  nameEn: string;
  price: number;
}

export type FoodCategory = 
  | 'kebab' 
  | 'stew' 
  | 'polo' 
  | 'khorak' 
  | 'fastfood' 
  | 'dessert' 
  | 'appetizer' 
  | 'drink' 
  | 'extra';

export interface FoodItem {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  category: FoodCategory;
  image: string;
  hideImage?: boolean;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isTraditional?: boolean;
  isFastfood?: boolean;
  isChefSpecial?: boolean;
  isAvailable?: boolean;
  subCategory?: string;
  ingredients: string[];
  ingredientsEn: string[];
  preparationTime: string;
  calories?: number;
  options?: FoodOption[];
}

export interface CartItem {
  food: FoodItem;
  quantity: number;
  selectedOptions?: FoodOption[];
}

export type OrderStatus = 'submitted' | 'confirmed' | 'cooking' | 'delivering' | 'delivered' | 'cancelled';
export type DeliveryType = 'delivery' | 'pickup' | 'dine_in';

export interface Order {
  id: string;
  userId?: string;
  customerName?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  deliveryType: DeliveryType;
  address: string;
  phone: string;
  paymentMethod: 'online' | 'pos' | 'cash';
  status: OrderStatus;
  orderTime: string;
  etaMinutes: number;
  deliveredAt?: string;
  notes?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  badge: string;
  badgeEn: string;
  ctaText: string;
  ctaTextEn: string;
  ctaAction: 'menu' | 'food';
  targetFoodId?: string;
  image: string;
}

export interface CategoryInfo {
  id: FoodCategory | 'all';
  name: string;
  nameEn: string;
  icon: string;
  image: string;
  count: number;
}

export type UserRole = 'customer' | 'admin';

export interface UserAddress {
  id: string;
  title: string;
  address: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  phone: string;
  fullName: string;
  role: UserRole;
  nationalCode?: string;
  email?: string;
  address?: string;
  membershipLevel: 'برنزی' | 'نقره‌ای' | 'طلایی';
  points: number;
  addresses: UserAddress[];
  joinedDate: string;
  favorites?: string[];
}

export interface DiscountCoupon {
  id: string;
  code: string;
  title: string;
  type: 'percent' | 'fixed';
  amount: number;
  maxDiscount?: number;
  minOrderAmount: number;
  isFirstOrderOnly?: boolean;
  validUntil?: string;
  isCampaign?: boolean;
  campaignName?: string;
  targetPhone?: string;
  isSingleUse?: boolean;
  usedByPhones?: string[];
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}
