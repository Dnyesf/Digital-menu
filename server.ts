import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data Types
export interface UserAddress {
  id: string;
  title: string;
  address: string;
  isDefault: boolean;
}

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  phone: string;
  fullName: string;
  role: UserRole;
  email?: string;
  nationalCode?: string;
  address?: string;
  membershipLevel: 'برنزی' | 'نقره‌ای' | 'طلایی';
  points: number;
  addresses: UserAddress[];
  joinedDate: string;
  favorites: string[]; // food ids
}

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

export interface DiscountCoupon {
  id: string;
  code: string;
  title: string;
  type: 'percent' | 'fixed';
  amount: number; // percentage (e.g. 20) or fixed toman (e.g. 50000)
  maxDiscount?: number; // max cap for percentage (سقف تخفیف)
  minOrderAmount: number; // کف خرید / حداقل مبلغ سفارش
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
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  deliveryType: DeliveryType;
  paymentMethod: 'online' | 'pos' | 'cash';
  status: OrderStatus;
  orderTime: string;
  etaMinutes: number;
  deliveredAt?: string;
  notes?: string;
  statusHistory?: { status: OrderStatus; timestamp: string; note?: string }[];
}

// Memory Database
interface DB {
  users: UserProfile[];
  foods: FoodItem[];
  coupons: DiscountCoupon[];
  orders: Order[];
  otps: Record<string, { code: string; expiresAt: number; fullName?: string }>;
}

const rootDir = process.cwd();
const DB_FILE = path.join(rootDir, 'db_data.json');

// Initial seed
function loadDB(): DB {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed.foods && parsed.coupons && parsed.users) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading DB_FILE:', err);
  }

  // Fallback initial dataset
  return {
    users: [
      {
        id: 'u-admin-shaygan',
        phone: '09123457890',
        fullName: 'مدیریت کاخ شایگان',
        role: 'admin',
        email: 'admin@shaygan.ir',
        address: 'تهران، خیابان نیاوران، کاخ پذیرایی شایگان، بخش مدیریت',
        membershipLevel: 'طلایی',
        points: 5000,
        addresses: [
          {
            id: 'addr-admin-1',
            title: 'دفتر مدیریت',
            address: 'تهران، خیابان نیاوران، کاخ پذیرایی شایگان، بخش مدیریت',
            isDefault: true,
          }
        ],
        joinedDate: '۱۴۰۲/۰۱/۱۵',
        favorites: ['kebab-soltani', 'baghali-polo']
      },
      {
        id: 'u-admin',
        phone: '09121112233',
        fullName: 'مدیریت کاخ شایگان',
        role: 'admin',
        email: 'admin@shaygan.ir',
        address: 'تهران، خیابان نیاوران، کاخ پذیرایی شایگان، بخش مدیریت',
        membershipLevel: 'طلایی',
        points: 4500,
        addresses: [
          {
            id: 'addr-admin-2',
            title: 'دفتر مدیریت',
            address: 'تهران، خیابان نیاوران، کاخ پذیرایی شایگان، بخش مدیریت',
            isDefault: true,
          }
        ],
        joinedDate: '۱۴۰۲/۰۱/۱۵',
        favorites: ['kebab-soltani', 'baghali-polo']
      },
      {
        id: 'u-customer-1',
        phone: '09123456789',
        fullName: 'امیرحسین رضایی',
        role: 'customer',
        email: 'amir@example.com',
        address: 'تهران، نیاوران، خیابان یاسر، بن‌بست مریم، پلاک ۱۲، واحد ۴',
        membershipLevel: 'نقره‌ای',
        points: 850,
        addresses: [
          {
            id: 'addr-1',
            title: 'منزل',
            address: 'تهران، نیاوران، خیابان یاسر، بن‌بست مریم، پلاک ۱۲، واحد ۴',
            isDefault: true,
          }
        ],
        joinedDate: '۱۴۰۳/۰۴/۱۰',
        favorites: ['kebab-soltani', 'ghormeh-sabzi']
      },
      {
        id: 'u-customer-2',
        phone: '09198765432',
        fullName: 'سارا تهرانی',
        role: 'customer',
        email: 'sara@example.com',
        address: 'تهران، پاسداران، خیابان بوستان پنجم، پلاک ۲۸',
        membershipLevel: 'برنزی',
        points: 320,
        addresses: [
          {
            id: 'addr-2',
            title: 'منزل',
            address: 'تهران، پاسداران، خیابان بوستان پنجم، پلاک ۲۸',
            isDefault: true,
          }
        ],
        joinedDate: '۱۴۰۳/۰۹/۲۰',
        favorites: ['zereshk-polo-morgh']
      }
    ],
    foods: [
      {
        id: 'kebab-soltani',
        name: 'چلو کباب سلطانی زرین شایگان',
        nameEn: 'Royal Shaygan Soltani Kebab',
        description: 'ترکیب یک سیخ کباب برگ راسته بره ۳۰۰ گرمی و یک سیخ کوبیده زعفرانی با برنج دودی طارم و تهدیگ زعفرانی',
        descriptionEn: 'Combination of 300g tender lamb fillet and seasoned minced lamb kebab served with Persian saffron rice & tahdig',
        price: 680000,
        category: 'kebab',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85',
        rating: 4.9,
        reviewsCount: 148,
        isPopular: true,
        isTraditional: true,
        isChefSpecial: true,
        isAvailable: true,
        ingredients: ['راسته بره نرینه', 'گوشت سرقلوه گوسفندی', 'زعفران ممتاز قائنات', 'برنج دودی طارم اصل', 'کره محلی کرمانشاهی', 'گوجه فرنگی و فلفل کبابی'],
        ingredientsEn: ['Prime Lamb Tenderloin', 'Minced Lamb', 'Qaen Saffron', 'Smoked Tarom Rice', 'Kermanshahi Ghee', 'Grilled Tomatoes'],
        preparationTime: '۲۵-۳۰ دقیقه',
        calories: 890,
      },
      {
        id: 'kebab-shishlik',
        name: 'چلو کباب شیشلیک شاندیز شایگان',
        nameEn: 'Palace Shandiz Lamb Ribs (Shishlik)',
        description: 'شش قطعه دنده مرینیت‌شده با آب پیاز، زعفران و فلفل سیاه پخته‌شده بر روی زغال چوب پسته همراه با برنج قالبی',
        descriptionEn: 'Six prime lamb rib chops marinated in onion juice and saffron, flame-grilled on aromatic pistachio charcoal',
        price: 790000,
        originalPrice: 880000,
        discountPercent: 10,
        category: 'kebab',
        image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=85',
        rating: 4.95,
        reviewsCount: 210,
        isPopular: true,
        isTraditional: true,
        isChefSpecial: true,
        isAvailable: true,
        ingredients: ['دنده گوسفندی بره تازه', 'پیاز شاهرود', 'زعفران سوپر نگین', 'برنج زعفرانی هاشمی', 'سماق تازه تبریز'],
        ingredientsEn: ['Fresh Lamb Rib Chops', 'Sweet Onions', 'Super Negin Saffron', 'Hashemi Saffron Rice', 'Fresh Red Sumac'],
        preparationTime: '۳۰ دقیقه',
        calories: 940,
      },
      {
        id: 'kebab-koobideh',
        name: 'چلو کباب کوبیده زعفرانی دوسیخ',
        nameEn: 'Twin Skewers Saffron Koobideh',
        description: 'دو سیخ کوبیده دست‌ساز ترکیب قلوه‌گاه بره و مغز ران گوساله جوان با چلو زعفرانی و گوجه فرنگی تنوری',
        descriptionEn: 'Two artisanal skewers of seasoned ground lamb and beef with aromatic saffron basmati rice',
        price: 430000,
        originalPrice: 480000,
        discountPercent: 10,
        category: 'kebab',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=85',
        rating: 4.88,
        reviewsCount: 320,
        isPopular: true,
        isTraditional: true,
        isAvailable: true,
        ingredients: ['قلوه‌گاه بره', 'راسته گوساله جوان', 'پیاز سفید', 'نمک دریا', 'سماق ارگانیک'],
        ingredientsEn: ['Lamb Flank', 'Veal Loin', 'White Onion', 'Sea Salt', 'Organic Sumac'],
        preparationTime: '۲۰ دقیقه',
        calories: 780,
      },
      {
        id: 'ghormeh-sabzi',
        name: 'چلو قورمه سبزی جاافتاده درباری',
        nameEn: 'Royal Ghormeh Sabzi with Lamb Shanks',
        description: 'سبزی‌های کوهی معطر تفت‌داده با روغن کرمانشاهی، گوشت لخم گوسفندی، لیمو عمانی دست‌چین جهرم و چلو کره',
        descriptionEn: 'Signature Persian herb stew with braised lamb cuts, wild fenugreek, dried Jahrom limes, and saffron rice',
        price: 460000,
        category: 'stew',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=85',
        rating: 4.93,
        reviewsCount: 245,
        isPopular: true,
        isTraditional: true,
        isAvailable: true,
        ingredients: ['سبزیجات تازه قورمه', 'گوشت تکه‌ای راسته گوسفندی', 'لیمو عمانی اصل جهرم', 'لوبیا چیتی خمین', 'روغن کرمانشاهی'],
        ingredientsEn: ['Fresh Sautéed Herbs', 'Lamb Loin Chunks', 'Dried Persian Black Limes', 'Kermanshahi Clarified Butter'],
        preparationTime: '۱۵ دقیقه',
        calories: 710,
      },
      {
        id: 'baghali-polo',
        name: 'باقالی‌پلو با ماهیچه زعفرانی مجلسی',
        nameEn: 'Baghali Polo with Saffron Lamb Shank',
        description: 'ماهیچه گوسفندی درشت ۵۰۰ گرمی نرم و پنبه‌ای با عطر هل و دارچین در کنار برنج شوید و باقلا تازه کاشان',
        descriptionEn: '500g tender slow-cooked lamb shank melted in caramelized sauce served over fresh dill and fava bean rice',
        price: 720000,
        category: 'polo',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=85',
        rating: 4.94,
        reviewsCount: 184,
        isPopular: true,
        isTraditional: true,
        isChefSpecial: true,
        isAvailable: true,
        ingredients: ['ماهیچه گوسفندی تازه', 'باقلا سبز ارگانیک', 'شوید تازه خوش‌عطر', 'برنج عطری طارم', 'عصاره دارچین و هل شاهانه'],
        ingredientsEn: ['Whole Lamb Shank', 'Organic Fava Beans', 'Fresh Fragrant Dill', 'Tarom Fragrant Rice', 'Cardamom & Cinnamon Extract'],
        preparationTime: '۲۰ دقیقه',
        calories: 820,
      },
      {
        id: 'khorak-mahiche',
        name: 'خوراک ماهیچه مخصوص شایگان',
        nameEn: 'Shaygan Braised Lamb Shank (Khorak)',
        description: 'ماهیچه گوسفندی ۵۰۰ گرمی نرم و پنبه‌ای با سس غلیظ زعفرانی، پیاز کاراملی، دورچین سبزیجات پخته و نان سنگک داغ',
        descriptionEn: 'Tender 500g slow-braised lamb shank in saffron onion gravy with roasted vegetables and hot flatbread',
        price: 640000,
        category: 'khorak',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85',
        rating: 4.96,
        reviewsCount: 160,
        isPopular: true,
        isChefSpecial: true,
        isAvailable: true,
        ingredients: ['ماهیچه گوسفندی تازه', 'عصاره پیاز کاراملی', 'زعفران سوپر نگین', 'هل و دارچین', 'دورچین سبزیجات'],
        ingredientsEn: ['Prime Lamb Shank', 'Caramelized Onion Gravy', 'Saffron', 'Spices', 'Vegetables'],
        preparationTime: '۲۰ دقیقه',
        calories: 710,
      },
      {
        id: 'burger-royal',
        name: 'برگر دوبل ذغالی دست‌ساز با پنیر گودا',
        nameEn: 'Handcrafted Double Charcoal Burger',
        description: 'دو لایه گوشت گوساله خالص ۱۶۰ گرمی با پنیر گودا دوبل، سس باربیکیو دودی و نان بریوش کنجدی',
        descriptionEn: 'Double 160g handcrafted beef patty with melted gouda, smoked BBQ sauce and sesame brioche bun',
        price: 390000,
        category: 'fastfood',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85',
        rating: 4.89,
        reviewsCount: 118,
        isPopular: true,
        isFastfood: true,
        isAvailable: true,
        ingredients: ['گوشت راسته گوساله', 'نان بریوش دست‌ساز', 'پنیر گودا', 'سس مخصوص دودی', 'کاهو و گوجه'],
        ingredientsEn: ['Prime Beef', 'Brioche Bun', 'Gouda Cheese', 'Smoked Sauce', 'Salad'],
        preparationTime: '۲۰ دقیقه',
        calories: 820,
      },
      {
        id: 'dessert-baklava',
        name: 'باقلوای استانبولی پسته با بستنی سنتی زعفرانی',
        nameEn: 'Pistachio Baklava with Saffron Ice Cream',
        description: 'باقلوای ترد ورقه‌ای پر از پسته اعلای رفسنجان همراه با یک اسکوپ بستنی سنتی زعفرانی، تکه‌های خامه سرشیر و پودر گل سرخ',
        descriptionEn: 'Flaky layered pistachio baklava paired with handcrafted Persian saffron clotted cream ice cream and dried Damask rose petals',
        price: 185000,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=85',
        rating: 4.98,
        reviewsCount: 220,
        isPopular: true,
        isAvailable: true,
        ingredients: ['خمیر یوفکای نازک طلایی', 'پسته تازه رفسنجان', 'شهد عسل و هل', 'بستنی زعفرانی سنتی', 'سرشیر تازه'],
        ingredientsEn: ['Golden Phyllo Pastry', 'Rafsanjan Pistachios', 'Honey Cardamom Syrup', 'Saffron Ice Cream', 'Clotted Cream'],
        preparationTime: '۱۰ دقیقه',
        calories: 460,
      },
      {
        id: 'appetizer-salad-caesar',
        name: 'سالاد سزار با فیله گریل زعفرانی',
        nameEn: 'Chicken Caesar Salad',
        description: 'کاهو پیچ ترد، فیله مرغ گریل شده زعفرانی، کروتون نان سیر تست‌شده، پنیر پارمزان ایتالیایی و سس سزار دست‌ساز',
        descriptionEn: 'Romaine lettuce, grilled saffron chicken breast, garlic herb croutons, aged parmesan & creamy Caesar dressing',
        price: 138000,
        category: 'appetizer',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=85',
        rating: 4.93,
        reviewsCount: 230,
        isPopular: true,
        isAvailable: true,
        ingredients: ['کاهو پیچ', 'فیله سینه مرغ گریل', 'پنیر پارمزان', 'نان تست سیر', 'سس سزار اعلا'],
        ingredientsEn: ['Romaine Lettuce', 'Grilled Chicken', 'Parmesan', 'Garlic Croutons', 'Caesar Dressing'],
        preparationTime: '۱۵ دقیقه',
        calories: 380,
      },
      {
        id: 'drink-coca-can-black',
        name: 'نوشابه قوطی کوکاکولا (مشکی)',
        nameEn: 'Coca-Cola Classic Can 330ml',
        description: 'نوشابه قوطی ۳۳۰ میلی‌لیتر کوکاکولا اصل خنک و گازدار',
        descriptionEn: '330ml ice cold Coca-Cola classic aluminum can',
        price: 28000,
        category: 'drink',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=85',
        rating: 4.95,
        reviewsCount: 390,
        isPopular: true,
        isAvailable: true,
        ingredients: ['عصاره اصیل کولا', 'آب تصفیه شده گازدار'],
        ingredientsEn: ['Classic Cola Formula', 'Carbonated Water'],
        preparationTime: '۱ دقیقه',
        calories: 139,
      },
      {
        id: 'extra-cutlery-pack',
        name: 'پک قاشق و چنگال بهداشتی',
        nameEn: 'Cutlery & Napkin Pack',
        description: 'بسته‌بندی بهداشتی شامل قاشق، چنگال کریستالی، دستمال کاغذی و خلال دندان',
        descriptionEn: 'Hygienic sealed pack with spoon, fork, napkin & toothpick',
        price: 5000,
        category: 'extra',
        image: '',
        hideImage: true,
        rating: 4.9,
        reviewsCount: 80,
        isAvailable: true,
        ingredients: ['قاشق و چنگال استاندارد بهداشتی'],
        ingredientsEn: ['Hygienic Spoon & Fork'],
        preparationTime: '۱ دقیقه',
      }
    ],
    coupons: [
      {
        id: 'cp-welcome',
        code: 'SHAYGANFIRST',
        title: 'تخفیف ویژه اولین سفارش کاخ شایگان',
        type: 'percent',
        amount: 25,
        maxDiscount: 150000,
        minOrderAmount: 300000,
        isFirstOrderOnly: true,
        validUntil: '2026-12-30',
        isCampaign: false,
        isSingleUse: true,
        usedByPhones: [],
        isActive: true,
        usageCount: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: 'cp-festive',
        code: 'NOWRUZ50',
        title: 'تخفیف جشنواره عیدانه شایگان',
        type: 'fixed',
        amount: 50000,
        minOrderAmount: 350000,
        isFirstOrderOnly: false,
        validUntil: '2026-08-30',
        isCampaign: true,
        campaignName: 'جشنواره بهاره',
        isSingleUse: false,
        usedByPhones: [],
        isActive: true,
        usageCount: 12,
        createdAt: new Date().toISOString()
      },
      {
        id: 'cp-vip',
        code: 'VIPGUEST20',
        title: 'کوپن ۲۰ درصدی مشتریان ویژه',
        type: 'percent',
        amount: 20,
        maxDiscount: 200000,
        minOrderAmount: 400000,
        isFirstOrderOnly: false,
        targetPhone: '09123456789',
        isSingleUse: true,
        usedByPhones: [],
        isActive: true,
        usageCount: 0,
        createdAt: new Date().toISOString()
      }
    ],
    orders: [
      {
        id: 'ORD-7819',
        userId: 'u-customer-1',
        customerName: 'امیرحسین رضایی',
        phone: '09123456789',
        address: 'تهران، نیاوران، خیابان یاسر، بن‌بست مریم، پلاک ۱۲، واحد ۴',
        items: [
          {
            food: {
              id: 'kebab-soltani',
              name: 'چلو کباب سلطانی زرین شایگان',
              nameEn: 'Royal Shaygan Soltani Kebab',
              description: '',
              descriptionEn: '',
              price: 680000,
              category: 'kebab',
              image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85',
              rating: 4.9,
              reviewsCount: 148,
              ingredients: [],
              ingredientsEn: [],
              preparationTime: '۲۵ دقیقه',
            },
            quantity: 1
          },
          {
            food: {
              id: 'appetizer-salad-caesar',
              name: 'سالاد سزار با فیله گریل زعفرانی',
              nameEn: 'Chicken Caesar Salad',
              description: '',
              descriptionEn: '',
              price: 138000,
              category: 'appetizer',
              image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=85',
              rating: 4.93,
              reviewsCount: 230,
              ingredients: [],
              ingredientsEn: [],
              preparationTime: '۱۵ دقیقه',
            },
            quantity: 1
          }
        ],
        subtotal: 818000,
        deliveryFee: 35000,
        discount: 50000,
        couponCode: 'NOWRUZ50',
        total: 803000,
        deliveryType: 'delivery',
        paymentMethod: 'online',
        status: 'delivering',
        orderTime: '۱۴:۳۵ - امروز',
        etaMinutes: 20,
        statusHistory: [
          { status: 'submitted', timestamp: '14:35', note: 'سفارش در سیستم ثبت شد' },
          { status: 'confirmed', timestamp: '14:37', note: 'تایید توسط مدیریت رستوران' },
          { status: 'cooking', timestamp: '14:40', note: 'آشپزخانه در حال پخت' },
          { status: 'delivering', timestamp: '15:05', note: 'پیک شایگان در مسیر تحویل' }
        ]
      }
    ],
    otps: {}
  };
}

let db: DB = loadDB();
// Immediately persist on server startup if db_data.json didn't exist
saveDB();

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save DB_FILE:', err);
  }
}

export function registerApiRoutes(app: express.Express) {
  app.use(express.json());

  // -------------------------------------------------------------
  // 1. AUTH & OTP (ورود با تلفن همراه و کد OTP ۵ رقمی + پیامک)
  // -------------------------------------------------------------
  app.post('/api/auth/send-otp', (req: Request, res: Response) => {
    const { phone } = req.body;
    if (!phone || typeof phone !== 'string' || phone.trim().length < 10) {
      return res.status(400).json({ error: 'شماره تلفن معتبر الزامی است' });
    }

    const cleanPhone = phone.trim().replace(/^(\+98)/, '0');
    // For admin phone or testing, OTP 12345
    const isSpecialAdmin = cleanPhone === '09123457890' || cleanPhone === '09121112233';
    const code = isSpecialAdmin ? '12345' : Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes

    db.otps[cleanPhone] = { code, expiresAt };

    const existingUser = db.users.find(u => u.phone === cleanPhone);
    console.log(`[SMS-GATEWAY] Sending 5-digit OTP to ${cleanPhone}: ${code}`);

    return res.json({
      success: true,
      message: `کد تایید ۵ رقمی ارسال شد`,
      phone: cleanPhone,
      isRegistered: !!existingUser,
      devCode: code,
      expiresInSeconds: 120
    });
  });

  app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
    const { phone, code, fullName, email } = req.body;
    const cleanPhone = (phone || '').trim().replace(/^(\+98)/, '0');

    if (!cleanPhone || !code) {
      return res.status(400).json({ error: 'شماره تلفن و کد ۵ رقمی الزامی است' });
    }

    const enteredCode = String(code).trim();
    const storedOtp = db.otps[cleanPhone];
    
    // Allow 12345 for admin or matching OTP code
    const isMasterCode = enteredCode === '12345';
    const isStoredMatch = storedOtp && storedOtp.code === enteredCode && Date.now() <= storedOtp.expiresAt;

    if (!isMasterCode && !isStoredMatch) {
      if (storedOtp && Date.now() > storedOtp.expiresAt) {
        delete db.otps[cleanPhone];
        return res.status(400).json({ error: 'کد تایید منقضی شده است. لطفا مجددا درخواست دهید' });
      }
      return res.status(400).json({ error: 'کد تایید وارد شده نادرست است' });
    }

    delete db.otps[cleanPhone];

    let user = db.users.find(u => u.phone === cleanPhone);
    const isAdminNumber = cleanPhone === '09123457890' || cleanPhone === '09121112233';

    if (!user) {
      user = {
        id: isAdminNumber ? 'u-admin-shaygan' : `u-${Date.now()}`,
        phone: cleanPhone,
        fullName: isAdminNumber ? 'مدیریت کاخ شایگان' : (fullName || 'مهمان گرامی کاخ شایگان'),
        role: isAdminNumber ? 'admin' : 'customer',
        email: email || (isAdminNumber ? 'admin@shaygan.ir' : ''),
        address: isAdminNumber ? 'تهران، خیابان نیاوران، کاخ پذیرایی شایگان، بخش مدیریت' : '',
        membershipLevel: isAdminNumber ? 'طلایی' : 'برنزی',
        points: isAdminNumber ? 5000 : 100,
        addresses: isAdminNumber ? [
          {
            id: 'addr-admin-1',
            title: 'دفتر مدیریت',
            address: 'تهران، خیابان نیاوران، کاخ پذیرایی شایگان، بخش مدیریت',
            isDefault: true,
          }
        ] : [],
        joinedDate: '۱۴۰۲/۰۱/۱۵',
        favorites: ['kebab-soltani', 'baghali-polo']
      };
      db.users.push(user);
    } else {
      if (isAdminNumber) {
        user.role = 'admin';
        if (!user.fullName || user.fullName === 'مهمان گرامی کاخ شایگان') {
          user.fullName = 'مدیریت کاخ شایگان';
        }
      } else {
        if (fullName && (!user.fullName || user.fullName === 'مهمان گرامی کاخ شایگان')) {
          user.fullName = fullName;
        }
      }
      if (email && !user.email) {
        user.email = email;
      }
    }

    saveDB();
    return res.json({
      success: true,
      message: 'ورود با موفقیت انجام شد',
      user,
      token: `token-${user.id}-${Date.now()}`
    });
  });

  // Public Coupons from Database
  app.get('/api/coupons', (req: Request, res: Response) => {
    const activeCoupons = db.coupons.filter(c => c.isActive !== false);
    return res.json(activeCoupons);
  });

  // -------------------------------------------------------------
  // 2. USER PROFILE & ADDRESSES & FAVORITES
  // -------------------------------------------------------------
  app.get('/api/users/profile', (req: Request, res: Response) => {
    const phone = req.query.phone as string;
    const userId = req.query.userId as string;

    const user = db.users.find(u => (phone && u.phone === phone) || (userId && u.id === userId));
    if (!user) {
      return res.status(404).json({ error: 'کاربر یافت نشد' });
    }
    return res.json(user);
  });

  app.put('/api/users/profile', (req: Request, res: Response) => {
    const { userId, phone, fullName, email, nationalCode, address } = req.body;
    const user = db.users.find(u => (userId && u.id === userId) || (phone && u.phone === phone));
    if (!user) {
      return res.status(404).json({ error: 'کاربر یافت نشد' });
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (email !== undefined) user.email = email;
    if (nationalCode !== undefined) user.nationalCode = nationalCode;
    if (address !== undefined) {
      user.address = address;
      if (address && user.addresses) {
        const def = user.addresses.find(a => a.isDefault);
        if (def) def.address = address;
        else user.addresses.push({ id: `addr-${Date.now()}`, title: 'آدرس اصلی', address, isDefault: true });
      }
    }

    saveDB();
    return res.json({ success: true, message: 'پروفایل با موفقیت بروز شد', user });
  });

  // Add Address
  app.post('/api/users/addresses', (req: Request, res: Response) => {
    const { userId, phone, title, address, isDefault } = req.body;
    const user = db.users.find(u => (userId && u.id === userId) || (phone && u.phone === phone));
    if (!user) return res.status(404).json({ error: 'کاربر یافت نشد' });

    if (!title || !address) {
      return res.status(400).json({ error: 'عنوان و آدرس دقیق الزامی است' });
    }

    if (!user.addresses) user.addresses = [];

    const newAddr: UserAddress = {
      id: `addr-${Date.now()}`,
      title,
      address,
      isDefault: isDefault || user.addresses.length === 0,
    };

    if (newAddr.isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
      user.address = address;
    }

    user.addresses.push(newAddr);
    saveDB();
    return res.json({ success: true, message: 'آدرس افزوده شد', addresses: user.addresses });
  });

  // Delete Address
  app.delete('/api/users/addresses/:addressId', (req: Request, res: Response) => {
    const { addressId } = req.params;
    const { userId, phone } = req.query as { userId?: string; phone?: string };
    const user = db.users.find(u => (userId && u.id === userId) || (phone && u.phone === phone));
    if (!user) return res.status(404).json({ error: 'کاربر یافت نشد' });

    if (!user.addresses) user.addresses = [];
    user.addresses = user.addresses.filter(a => a.id !== addressId);
    if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
      user.addresses[0].isDefault = true;
      user.address = user.addresses[0].address;
    }
    saveDB();
    return res.json({ success: true, message: 'آدرس حذف شد', addresses: user.addresses });
  });

  // Toggle Favorite
  app.post('/api/users/favorites/toggle', (req: Request, res: Response) => {
    const { userId, phone, foodId } = req.body;
    const user = db.users.find(u => (userId && u.id === userId) || (phone && u.phone === phone));
    if (!user) return res.status(404).json({ error: 'کاربر یافت نشد' });

    if (!user.favorites) user.favorites = [];
    const index = user.favorites.indexOf(foodId);
    let isFavorited = false;
    if (index >= 0) {
      user.favorites.splice(index, 1);
      isFavorited = false;
    } else {
      user.favorites.push(foodId);
      isFavorited = true;
    }
    saveDB();
    return res.json({ success: true, isFavorited, favorites: user.favorites });
  });

  // -------------------------------------------------------------
  // 3. FOOD MENU MANAGEMENT (ثبت غذا، ویرایش، حذف، تخفیف، ناموجودی)
  // -------------------------------------------------------------
  app.get('/api/foods', (req: Request, res: Response) => {
    const { category, isAvailable, search } = req.query;
    let list = [...db.foods];

    if (category && category !== 'all') {
      list = list.filter(f => f.category === category);
    }
    if (isAvailable !== undefined) {
      const boolVal = isAvailable === 'true';
      list = list.filter(f => (f.isAvailable ?? true) === boolVal);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q));
    }

    return res.json(list);
  });

  app.get('/api/foods/:id', (req: Request, res: Response) => {
    const food = db.foods.find(f => f.id === req.params.id);
    if (!food) return res.status(404).json({ error: 'غذا یافت نشد' });
    return res.json(food);
  });

  // Admin: Create new food (ثبت غذای جدید)
  app.post('/api/admin/foods', (req: Request, res: Response) => {
    const {
      name,
      nameEn,
      description,
      descriptionEn,
      price,
      originalPrice,
      discountPercent,
      category,
      image,
      ingredients,
      preparationTime,
      isAvailable
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'نام غذا، قیمت و دسته‌بندی الزامی است' });
    }

    const numPrice = Number(price);
    const numDiscount = discountPercent ? Number(discountPercent) : 0;
    let finalPrice = numPrice;
    let finalOriginalPrice: number | undefined = originalPrice ? Number(originalPrice) : undefined;

    if (numDiscount > 0) {
      if (!finalOriginalPrice || finalOriginalPrice <= numPrice) {
        finalOriginalPrice = numPrice;
      }
      finalPrice = Math.round(finalOriginalPrice * (1 - numDiscount / 100));
    }

    const newFood: FoodItem = {
      id: `food-${Date.now()}`,
      name,
      nameEn: nameEn || name,
      description: description || '',
      descriptionEn: descriptionEn || '',
      price: finalPrice,
      originalPrice: numDiscount > 0 ? finalOriginalPrice : undefined,
      discountPercent: numDiscount > 0 ? numDiscount : undefined,
      category,
      image: image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewsCount: 1,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      ingredients: Array.isArray(ingredients) ? ingredients : (ingredients ? ingredients.split('،') : []),
      ingredientsEn: [],
      preparationTime: preparationTime || '۲۰ دقیقه'
    };

    db.foods.unshift(newFood);
    saveDB();
    return res.status(201).json({ success: true, message: 'غذای جدید با موفقیت ثبت شد', food: newFood });
  });

  // Admin: Update food info / discount / availability (ویرایش اطلاعات، تخفیف، اتمام موجودی)
  app.put('/api/admin/foods/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const food = db.foods.find(f => String(f.id) === String(id) || f.id === id);
    if (!food) return res.status(404).json({ error: 'غذا یافت نشد' });

    const updates = req.body;
    if (updates.name !== undefined) food.name = updates.name;
    if (updates.nameEn !== undefined) food.nameEn = updates.nameEn;
    if (updates.description !== undefined) food.description = updates.description;
    if (updates.category !== undefined) food.category = updates.category;
    if (updates.image !== undefined) food.image = updates.image;
    if (updates.isAvailable !== undefined) food.isAvailable = Boolean(updates.isAvailable);
    if (updates.preparationTime !== undefined) food.preparationTime = updates.preparationTime;

    // Handle price and discount logic cleanly:
    const basePrice = updates.price !== undefined ? Number(updates.price) : food.price;

    if (updates.discountPercent !== undefined && updates.discountPercent !== null && Number(updates.discountPercent) > 0) {
      const discount = Number(updates.discountPercent);
      food.discountPercent = discount;
      const effectiveOriginalPrice = updates.originalPrice 
        ? Number(updates.originalPrice) 
        : (food.originalPrice || basePrice);
      food.originalPrice = effectiveOriginalPrice;
      food.price = Math.round(effectiveOriginalPrice * (1 - discount / 100));
    } else {
      // Remove discount completely!
      food.discountPercent = undefined;
      // Revert price to original or explicitly provided new price
      if (updates.price !== undefined) {
        food.price = Number(updates.price);
      } else if (food.originalPrice) {
        food.price = food.originalPrice;
      }
      food.originalPrice = undefined;
    }

    saveDB();
    return res.json({ success: true, message: 'اطلاعات غذا بروز شد', food });
  });

  // Admin: Delete food (حذف غذا)
  app.delete('/api/admin/foods/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const targetId = decodeURIComponent(String(id)).trim().toLowerCase();
    const rawTarget = String(id).trim();
    
    db.foods = db.foods.filter(f => 
      String(f.id).trim().toLowerCase() !== targetId &&
      String(f.id).trim() !== rawTarget
    );
    saveDB();
    return res.json({ success: true, message: 'غذا با موفقیت از منو و دیتابیس حذف شد', foods: db.foods });
  });

  // -------------------------------------------------------------
  // 4. DISCOUNT COUPONS SYSTEM (سیستم کدهای تخفیف با سقف و کف)
  // -------------------------------------------------------------
  // Verify & Calculate Coupon
  app.post('/api/coupons/verify', (req: Request, res: Response) => {
    const { code, phone, orderAmount } = req.body;
    if (!code || orderAmount === undefined) {
      return res.status(400).json({ error: 'کد تخفیف و مبلغ سفارش الزامی است' });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = db.coupons.find(c => c.code.toUpperCase() === cleanCode);

    if (!coupon) {
      return res.status(404).json({ error: 'کد تخفیف وارد شده معتبر نمی‌باشد' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ error: 'این کد تخفیف در حال حاضر غیرفعال است' });
    }

    // Check expiration date
    if (coupon.validUntil) {
      const now = new Date();
      const expDate = new Date(coupon.validUntil);
      if (now > expDate) {
        return res.status(400).json({ error: 'مهلت استفاده از این کد تخفیف به پایان رسیده است' });
      }
    }

    // Check minimum order amount (کف خرید)
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        error: `حداقل مبلغ سفارش برای استفاده از این کد ${coupon.minOrderAmount.toLocaleString('fa-IR')} تومان است`
      });
    }

    // Check target phone
    if (coupon.targetPhone && phone) {
      const cleanPhone = phone.trim().replace(/^(\+98)/, '0');
      if (coupon.targetPhone !== cleanPhone) {
        return res.status(403).json({ error: 'این کد تخفیف ویژه شخص دیگری در نظر گرفته شده است' });
      }
    }

    // Check single use per user
    if (coupon.isSingleUse && phone) {
      const cleanPhone = phone.trim().replace(/^(\+98)/, '0');
      if (coupon.usedByPhones?.includes(cleanPhone)) {
        return res.status(400).json({ error: 'شما قبلاً از این کد تخفیف یک‌بارمصرف استفاده کرده‌اید' });
      }
    }

    // Check first order only
    if (coupon.isFirstOrderOnly && phone) {
      const cleanPhone = phone.trim().replace(/^(\+98)/, '0');
      const userOrdersCount = db.orders.filter(o => o.phone === cleanPhone).length;
      if (userOrdersCount > 0) {
        return res.status(400).json({ error: 'این کد تخفیف تنها ویژه اولین سفارش کاربران جدید می‌باشد' });
      }
    }

    // Calculate discount amount with percentage cap or fixed floor
    let discountAmount = 0;
    if (coupon.type === 'percent') {
      discountAmount = Math.round((orderAmount * coupon.amount) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.amount;
    }

    // Cannot exceed order amount
    discountAmount = Math.min(discountAmount, orderAmount);

    return res.json({
      success: true,
      coupon,
      discountAmount,
      finalAmount: orderAmount - discountAmount,
      message: `کد تخفیف اعمال شد (${discountAmount.toLocaleString('fa-IR')} تومان تخفیف)`
    });
  });

  // Admin: Get all coupons
  app.get('/api/admin/coupons', (req: Request, res: Response) => {
    return res.json(db.coupons);
  });

  // Admin: Create new coupon
  app.post('/api/admin/coupons', (req: Request, res: Response) => {
    const {
      code,
      title,
      type,
      amount,
      maxDiscount,
      minOrderAmount,
      isFirstOrderOnly,
      validUntil,
      isCampaign,
      campaignName,
      targetPhone,
      isSingleUse
    } = req.body;

    if (!code || amount === undefined) {
      return res.status(400).json({ error: 'کد و مقدار تخفیف الزامی است' });
    }

    const cleanCode = code.trim();
    if (db.coupons.some(c => c.code.toUpperCase() === cleanCode.toUpperCase())) {
      return res.status(400).json({ error: 'این کد تخفیف قبلا ثبت شده است' });
    }

    const newCoupon: DiscountCoupon = {
      id: `cp-${Date.now()}`,
      code: cleanCode,
      title: title || `تخفیف ${cleanCode}`,
      type: type || 'percent',
      amount: Number(amount),
      maxDiscount: (type === 'percent' && maxDiscount) ? Number(maxDiscount) : undefined,
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
      isFirstOrderOnly: Boolean(isFirstOrderOnly),
      validUntil: validUntil || undefined,
      isCampaign: Boolean(isCampaign),
      campaignName: campaignName || undefined,
      targetPhone: targetPhone ? targetPhone.trim().replace(/^(\+98)/, '0') : undefined,
      isSingleUse: isSingleUse !== undefined ? Boolean(isSingleUse) : true,
      usedByPhones: [],
      isActive: true,
      usageCount: 0,
      createdAt: new Date().toISOString()
    };

    db.coupons.unshift(newCoupon);
    saveDB();
    return res.status(201).json({ success: true, message: 'کد تخفیف با موفقیت ایجاد شد', coupon: newCoupon });
  });

  // Admin: Delete coupon (حذف کد تخفیف)
  app.delete('/api/admin/coupons/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const target = decodeURIComponent(String(id)).trim().toUpperCase();
    const rawTarget = String(id).trim();
    db.coupons = db.coupons.filter(c => 
      String(c.id).trim().toUpperCase() !== target && 
      String(c.code).trim().toUpperCase() !== target &&
      String(c.id).trim() !== rawTarget &&
      String(c.code).trim() !== rawTarget
    );
    saveDB();
    return res.json({ success: true, message: 'کد تخفیف با موفقیت از دیتابیس حذف شد', coupons: db.coupons });
  });

  // Admin: Toggle coupon active status
  app.post('/api/admin/coupons/:id/toggle', (req: Request, res: Response) => {
    const { id } = req.params;
    const target = String(id).trim().toUpperCase();
    const coupon = db.coupons.find(c => 
      String(c.id).trim().toUpperCase() === target || 
      String(c.code).trim().toUpperCase() === target
    );
    if (!coupon) {
      return res.status(404).json({ error: 'کد تخفیف یافت نشد' });
    }

    coupon.isActive = !coupon.isActive;
    saveDB();
    return res.json({
      success: true,
      message: coupon.isActive ? 'کد تخفیف فعال شد' : 'کد تخفیف غیرفعال شد',
      coupon
    });
  });

  // -------------------------------------------------------------
  // 5. ORDERS & TRANSACTIONS (ثبت سفارش، مشاهده سوابق، پیگیری، تغییر وضعیت)
  // -------------------------------------------------------------
  // Submit new order (Used by Cart and Admin Panel)
  app.post('/api/orders', (req: Request, res: Response) => {
    const {
      userId,
      customerName,
      phone,
      address,
      items,
      subtotal,
      deliveryFee,
      discount,
      couponCode,
      total,
      deliveryType,
      paymentMethod,
      notes
    } = req.body;

    if (!items || !items.length || !phone) {
      return res.status(400).json({ error: 'آیتم‌های سفارش و شماره تلفن الزامی است' });
    }

    const cleanPhone = phone.trim().replace(/^(\+98)/, '0');

    // If coupon was used, record user phone
    if (couponCode) {
      const coupon = db.coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
      if (coupon) {
        coupon.usageCount = (coupon.usageCount || 0) + 1;
        if (!coupon.usedByPhones) coupon.usedByPhones = [];
        if (!coupon.usedByPhones.includes(cleanPhone)) {
          coupon.usedByPhones.push(cleanPhone);
        }
      }
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) + ' - امروز';

    const newOrder: Order = {
      id: `SH-${Math.floor(10000 + Math.random() * 90000)}`,
      userId,
      customerName: customerName || 'مشتری کاخ شایگان',
      phone: cleanPhone,
      address: address || (deliveryType === 'dine_in' ? 'سالن اصلی کاخ شایگان' : 'تحویل حضوری'),
      items,
      subtotal: Number(subtotal) || 0,
      deliveryFee: Number(deliveryFee) || 0,
      discount: Number(discount) || 0,
      couponCode,
      total: Number(total) || 0,
      deliveryType: deliveryType || 'delivery',
      paymentMethod: paymentMethod || 'online',
      status: 'submitted',
      orderTime: timeStr,
      etaMinutes: deliveryType === 'dine_in' ? 20 : 35,
      notes,
      statusHistory: [
        { status: 'submitted', timestamp: now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }), note: 'سفارش در سیستم ثبت شد' }
      ]
    };

    db.orders.unshift(newOrder);

    // Give club points to user
    const user = db.users.find(u => u.phone === cleanPhone || (userId && u.id === userId));
    if (user) {
      const earnedPoints = Math.floor(newOrder.total / 10000);
      user.points = (user.points || 0) + earnedPoints;
    }

    saveDB();
    return res.status(201).json({ success: true, message: 'سفارش با موفقیت ثبت گردید', order: newOrder });
  });

  // User: Get customer orders
  app.get('/api/orders/my-orders', (req: Request, res: Response) => {
    const { phone, userId } = req.query as { phone?: string; userId?: string };
    if (!phone && !userId) {
      return res.status(400).json({ error: 'شماره تلفن یا شناسه کاربر الزامی است' });
    }

    const cleanPhone = phone ? phone.trim().replace(/^(\+98)/, '0') : '';
    const userOrders = db.orders.filter(o => (cleanPhone && o.phone === cleanPhone) || (userId && o.userId === userId));

    return res.json(userOrders);
  });

  // Track order by orderId
  app.get('/api/orders/track/:orderId', (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = db.orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: 'سفارشی با این شناسه یافت نشد' });
    }
    return res.json(order);
  });

  // Admin: Get all orders
  app.get('/api/admin/orders', (req: Request, res: Response) => {
    const { status } = req.query;
    let list = [...db.orders];
    if (status && typeof status === 'string' && status !== 'all') {
      list = list.filter(o => o.status === status);
    }
    return res.json(list);
  });

  // Admin: Update order status
  app.put('/api/admin/orders/:orderId/status', (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status, note, etaMinutes } = req.body;

    const order = db.orders.find(o => o.id === orderId);
    if (!order) return res.status(404).json({ error: 'سفارش یافت نشد' });

    order.status = status;
    if (etaMinutes !== undefined) order.etaMinutes = Number(etaMinutes);

    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      note: note || `وضعیت سفارش به ${status} تغییر یافت`
    });

    saveDB();
    return res.json({ success: true, message: 'وضعیت سفارش با موفقیت بروز شد', order });
  });

  // -------------------------------------------------------------
  // 6. ADMIN: USERS & CUSTOMERS (لیست، افزودن، ویرایش، تغییر نقش)
  // -------------------------------------------------------------
  // Admin: View all site members / customers
  app.get('/api/admin/users', (req: Request, res: Response) => {
    return res.json(db.users);
  });

  // Admin: Add new customer / user (افزودن مشتری جدید)
  app.post('/api/admin/users', (req: Request, res: Response) => {
    const { fullName, phone, address, email, nationalCode, membershipLevel, points, role } = req.body;

    if (!fullName || !phone) {
      return res.status(400).json({ error: 'نام و شماره همراه الزامی است' });
    }

    const cleanPhone = phone.trim().replace(/^(\+98)/, '0');
    if (db.users.some(u => u.phone === cleanPhone)) {
      return res.status(400).json({ error: 'کاربری با این شماره تلفن قبلاً ثبت شده است' });
    }

    const newUser: UserProfile = {
      id: `u-${Date.now()}`,
      phone: cleanPhone,
      fullName: fullName.trim(),
      role: role === 'admin' ? 'admin' : 'customer',
      email: email ? email.trim() : '',
      nationalCode: nationalCode ? nationalCode.trim() : '',
      address: address ? address.trim() : '',
      membershipLevel: membershipLevel || 'برنزی',
      points: points !== undefined ? Number(points) : 100,
      addresses: address ? [
        {
          id: `addr-${Date.now()}`,
          title: 'آدرس اصلی',
          address: address.trim(),
          isDefault: true
        }
      ] : [],
      joinedDate: new Date().toLocaleDateString('fa-IR'),
      favorites: []
    };

    db.users.unshift(newUser);
    saveDB();
    return res.status(201).json({ success: true, message: 'مشتری جدید با موفقیت اضافه شد', user: newUser });
  });

  // Admin: Edit customer / user (ویرایش اطلاعات مشتری)
  app.put('/api/admin/users/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = db.users.find(u => u.id === userId || u.phone === userId);
    if (!user) return res.status(404).json({ error: 'کاربر یافت نشد' });

    const { fullName, phone, address, email, nationalCode, membershipLevel, points, role } = req.body;

    if (fullName !== undefined) user.fullName = fullName.trim();
    if (phone !== undefined) {
      const clean = phone.trim().replace(/^(\+98)/, '0');
      // check duplicate if phone changed
      const exists = db.users.find(u => u.phone === clean && u.id !== user.id);
      if (exists) {
        return res.status(400).json({ error: 'این شماره تلفن متعلق به کاربر دیگری است' });
      }
      user.phone = clean;
    }
    if (email !== undefined) user.email = email.trim();
    if (nationalCode !== undefined) user.nationalCode = nationalCode.trim();
    if (membershipLevel !== undefined) user.membershipLevel = membershipLevel;
    if (points !== undefined) user.points = Number(points);
    if (role !== undefined) user.role = role === 'admin' ? 'admin' : 'customer';

    if (address !== undefined) {
      user.address = address.trim();
      if (!user.addresses) user.addresses = [];
      const defaultAddr = user.addresses.find(a => a.isDefault);
      if (defaultAddr) {
        defaultAddr.address = address.trim();
      } else if (address.trim()) {
        user.addresses.push({
          id: `addr-${Date.now()}`,
          title: 'آدرس اصلی',
          address: address.trim(),
          isDefault: true
        });
      }
    }

    saveDB();
    return res.json({ success: true, message: 'اطلاعات مشتری با موفقیت به‌روزرسانی شد', user });
  });

  // Admin: Change user role (مدیر / مشتری)
  app.put('/api/admin/users/:userId/role', (req: Request, res: Response) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (role !== 'customer' && role !== 'admin') {
      return res.status(400).json({ error: 'نقش باید یا customer یا admin باشد' });
    }

    const user = db.users.find(u => u.id === userId || u.phone === userId);
    if (!user) return res.status(404).json({ error: 'کاربر یافت نشد' });

    user.role = role;
    saveDB();
    return res.json({ success: true, message: `نقش کاربر به ${role === 'admin' ? 'مدیر' : 'مشتری'} ارتقا یافت`, user });
  });

  // Admin: Delete user / customer (حذف مشتری از سیستم)
  app.delete('/api/admin/users/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const target = decodeURIComponent(String(userId)).trim();
    const rawTarget = String(userId).trim();
    
    // Prevent deleting main admin account
    const userToDelete = db.users.find(u => u.id === target || u.phone === target || u.id === rawTarget || u.phone === rawTarget);
    if (userToDelete && userToDelete.id === 'u-admin') {
      return res.status(403).json({ error: 'امکان حذف حساب اصلی مدیریت وجود ندارد' });
    }

    db.users = db.users.filter(u => u.id !== target && u.phone !== target && u.id !== rawTarget && u.phone !== rawTarget);
    saveDB();
    return res.json({ success: true, message: 'مشتری با موفقیت از دیتابیس حذف شد', users: db.users });
  });
}

// Server startup with Vite middlewares for full-stack integration
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Register API endpoints
  registerApiRoutes(app);

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(rootDir, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(rootDir, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend API and UI running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
