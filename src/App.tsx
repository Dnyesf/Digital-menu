import React, { useState, useEffect, useRef } from 'react';
import { AppHeader } from './components/AppHeader';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoryNav } from './components/CategoryNav';
import { CategoryCard } from './components/CategoryCard';
import { FoodCard } from './components/FoodCard';
import { FoodDetailModal } from './components/FoodDetailModal';
import { SearchModal } from './components/SearchModal';
import { CartView } from './components/CartView';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { RestaurantStory } from './components/RestaurantStory';
import { ProfileView } from './components/ProfileView';
import { BottomNavigation } from './components/BottomNavigation';
import { Footer } from './components/Footer';
import { CategorySheet } from './components/CategorySheet';

import { HERO_SLIDES, CATEGORIES, FOOD_ITEMS } from './data/mockData';
import { CartItem, FoodItem, FoodOption, Language, Order, Theme, OrderStatus, UserProfile } from './types';
import { translations } from './utils/translations';
import { ArrowLeft, ArrowRight, Sparkles, Crown, Flame, Soup, Sandwich, Utensils, ArrowUp } from 'lucide-react';
import { api } from './services/api';
import { LoginModal } from './components/LoginModal';

export default function App() {
  // Localization & Theme state
  const [lang, setLang] = useState<Language>('fa');
  const [theme, setTheme] = useState<Theme>('dark');

  // Active view tab: 'home' | 'cart' | 'profile' | 'story'
  const [activeTab, setActiveTab] = useState<'home' | 'cart' | 'profile' | 'story'>('home');

  // Food items state (fetches from backend API with fallback to initial mock)
  const [foods, setFoods] = useState<FoodItem[]>(FOOD_ITEMS);

  // User state (authenticated user or null for guest)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('shaygan_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Navigation and drawers
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<1 | 2>(1);
  const [orderNotes, setOrderNotes] = useState('');
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isTabsFixed, setIsTabsFixed] = useState(false);
  const tabsSentinelRef = useRef<HTMLDivElement>(null);

  // Selected food for detail view
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  // Home selected category filter
  const [homeCategory, setHomeCategory] = useState<string>('kebab');

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shaygan_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shaygan_favorites');
      return saved ? JSON.parse(saved) : ['kebab-soltani', 'baghali-polo'];
    } catch {
      return ['kebab-soltani', 'baghali-polo'];
    }
  });

  // Orders strictly from Database
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch orders from Database
  const fetchOrdersFromBackend = async (userToFetch?: UserProfile | null) => {
    const usr = userToFetch !== undefined ? userToFetch : currentUser;
    if (!usr) {
      setOrders([]);
      return;
    }
    try {
      if (usr.role === 'admin') {
        const adminOrders = await api.adminGetOrders();
        setOrders(Array.isArray(adminOrders) ? adminOrders : []);
      } else {
        const myOrders = await api.getMyOrders({ phone: usr.phone, userId: usr.id });
        setOrders(Array.isArray(myOrders) ? myOrders : []);
      }
    } catch (e) {
      console.log('Error fetching database orders', e);
    }
  };

  useEffect(() => {
    fetchOrdersFromBackend(currentUser);
  }, [currentUser]);

  // Sync RTL / LTR and Lang attribute on HTML tag
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);

  // Sync Theme class on document element
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }, [theme]);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shaygan_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shaygan_favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // Save current user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('shaygan_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('shaygan_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Load foods and orders from backend on startup
  const fetchFoodsFromBackend = async () => {
    try {
      const backendFoods = await api.getFoods();
      if (Array.isArray(backendFoods)) {
        setFoods(backendFoods);
      }
    } catch (e) {
      console.log('Using local foods data');
    }
  };

  useEffect(() => {
    fetchFoodsFromBackend();
  }, []);

  // Scroll listener for floating scroll-to-top button & fixed tabs detection
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);

      if (tabsSentinelRef.current) {
        const rect = tabsSentinelRef.current.getBoundingClientRect();
        setIsTabsFixed(rect.top <= 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [activeTab]);

  const t = translations[lang];

  // Helper map of foodId -> quantity in cart
  const cartQuantities = cartItems.reduce((acc, item) => {
    acc[item.food.id] = (acc[item.food.id] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Cart Handlers
  const handleAddToCart = (food: FoodItem) => {
    if (food.isAvailable === false) return;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { food, quantity: 1 }];
    });
  };

  const handleAddToCartWithOptions = (food: FoodItem, quantity: number, options: FoodOption[]) => {
    if (food.isAvailable === false) return;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + quantity, selectedOptions: options }
            : item
        );
      }
      return [...prev, { food, quantity, selectedOptions: options }];
    });
  };

  const handleRemoveFromCart = (foodId: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.food.id === foodId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((item) => item.food.id !== foodId);
      }
      return prev.map((item) =>
        item.food.id === foodId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const handleUpdateQuantity = (foodId: string, delta: number) => {
    if (delta > 0) {
      const food = foods.find((f) => f.id === foodId);
      if (food) handleAddToCart(food);
    } else {
      handleRemoveFromCart(foodId);
    }
  };

  const handleToggleFavorite = (foodId: string) => {
    setFavorites((prev) =>
      prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]
    );
  };

  // Admin handlers
  const handleUpdateFoodStatus = (foodId: string, isAvailable: boolean) => {
    setFoods((prev) =>
      prev.map((item) => (item.id === foodId ? { ...item, isAvailable } : item))
    );
  };

  const handleAddNewFood = (newFood: FoodItem) => {
    setFoods((prev) => [newFood, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
      setActiveTrackingOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleHeroCta = (action: 'menu' | 'reservation' | 'food', targetId?: string) => {
    if (action === 'menu' || action === 'reservation') {
      setActiveTab('home');
      setTimeout(() => {
        const el = document.getElementById('category-nav-bar');
        if (el) {
          const navOffset = 60;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 80);
    } else if (action === 'food' && targetId) {
      const f = foods.find((item) => item.id === targetId);
      if (f) setSelectedFood(f);
    }
  };

  return (
    <div className={`min-h-screen bg-[#020F1E] text-[#F8F5EF] flex flex-col font-vazir ${theme === 'light' ? 'bg-[#F8F3EA] text-[#061829]' : ''}`}>
      {/* Main App Header */}
      {activeTab !== 'cart' && (
        <AppHeader
          lang={lang}
          activeTab={activeTab}
          onNavigate={(tab) => {
            setActiveTab(tab === 'reservation' ? 'home' : (tab as any));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* View Routing Body */}
      <main className="flex-1">
        {/* 1. HOME VIEW (Discovery) */}
        {activeTab === 'home' && (
          <div className="animate-fadeIn pb-28">
            {/* Hero Carousel */}
            <HeroCarousel
              slides={HERO_SLIDES}
              lang={lang}
              onCtaClick={handleHeroCta}
            />

            {/* Fixed-on-scroll Category Tabs Bar */}
            <div id="category-nav-bar" ref={tabsSentinelRef} className="relative w-full">
              {isTabsFixed && <div className="h-12 w-full pointer-events-none" />}
              <CategoryNav
                categories={CATEGORIES}
                selectedCategory={homeCategory}
                onSelectCategory={(catId) => {
                  setHomeCategory(catId);
                  const el = document.getElementById(`category-section-${catId}`);
                  if (el) {
                    const navOffset = 70;
                    const elementPosition = el.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navOffset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                lang={lang}
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenMenuDrawer={() => setIsCategorySheetOpen(true)}
                isFixed={isTabsFixed}
              />
            </div>

            {/* Categories & Food Cards */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10 pt-4">
              {CATEGORIES.map((category) => {
                const categoryDishes = foods.filter((f) => f.category === category.id);
                if (categoryDishes.length === 0) return null;

                return (
                  <section
                    key={category.id}
                    id={`category-section-${category.id}`}
                    className="scroll-mt-36 space-y-3"
                  >
                    <div className="pt-6 pb-2 border-b border-[#C9A24D]/15">
                      <h2 className="font-amiri text-xl sm:text-2xl font-bold text-[#C9A24D]">
                        {lang === 'fa' ? category.name : category.nameEn}
                      </h2>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                      {categoryDishes.map((food) => (
                        <FoodCard
                          key={food.id}
                          food={food}
                          quantity={cartQuantities[food.id] || 0}
                          isFavorite={favorites.includes(food.id)}
                          lang={lang}
                          onAddToCart={handleAddToCart}
                          onRemoveFromCart={handleRemoveFromCart}
                          onToggleFavorite={handleToggleFavorite}
                          onClickDetail={setSelectedFood}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. ORDERS & CART VIEW */}
        {activeTab === 'cart' && (
          <CartView
            items={cartItems}
            lang={lang}
            step={cartStep}
            onSetStep={setCartStep}
            orderNotes={orderNotes}
            onSetOrderNotes={setOrderNotes}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={() => {
              setCartItems([]);
              try {
                localStorage.removeItem('shaygan_cart');
              } catch {}
            }}
            onAddToCart={handleAddToCart}
            currentUser={currentUser}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onBackToHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCompleteOrder={(order) => {
              setOrders((prev) => [order, ...prev]);
              setCartItems([]);
              setCartStep(1);
              setActiveTrackingOrder(order);
            }}
            allFoods={foods}
            onClickDetail={setSelectedFood}
          />
        )}

        {/* 3. RESTAURANT STORY VIEW */}
        {activeTab === 'story' && (
          <RestaurantStory
            lang={lang}
            onNavigateToHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 4. PROFILE / ACCOUNT VIEW */}
        {activeTab === 'profile' && (
          <ProfileView
            lang={lang}
            theme={theme}
            orders={orders}
            favoriteFoods={foods.filter((f) => favorites.includes(f.id))}
            cartQuantities={cartQuantities}
            allFoods={foods}
            currentUser={currentUser}
            onUpdateCurrentUser={setCurrentUser}
            onRefreshFoods={fetchFoodsFromBackend}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onUpdateFoodStatus={handleUpdateFoodStatus}
            onAddNewFood={handleAddNewFood}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            onTrackOrder={(order) => setActiveTrackingOrder(order)}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onToggleFavorite={handleToggleFavorite}
            onClickDetail={setSelectedFood}
            onReorder={(order) => {
              order.items.forEach((it) => {
                for (let i = 0; i < it.quantity; i++) {
                  handleAddToCart(it.food);
                }
              });
              setActiveTab('cart');
              setCartStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToStory={() => {
              setActiveTab('story');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* MODAL: Login with Phone OTP */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* MODAL: Food Detail */}
      {selectedFood && (
        <FoodDetailModal
          food={selectedFood}
          quantityInCart={cartQuantities[selectedFood.id] || 0}
          isFavorite={favorites.includes(selectedFood.id)}
          lang={lang}
          relatedFoods={foods.filter((f) => f.id !== selectedFood.id && f.category === selectedFood.category)}
          onClose={() => setSelectedFood(null)}
          onAddToCartWithOptions={handleAddToCartWithOptions}
          onToggleFavorite={handleToggleFavorite}
          onSelectFood={setSelectedFood}
        />
      )}

      {/* MODAL: Search */}
      <SearchModal
        isOpen={isSearchOpen}
        lang={lang}
        foodItems={foods}
        cartQuantities={cartQuantities}
        favorites={favorites}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onClose={() => setIsSearchOpen(false)}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onToggleFavorite={handleToggleFavorite}
        onClickDetail={(food) => {
          setIsSearchOpen(false);
          setSelectedFood(food);
        }}
      />

      {/* MODAL: Live Order Tracking */}
      {activeTrackingOrder && (
        <OrderTrackingModal
          order={activeTrackingOrder}
          lang={lang}
          onClose={() => setActiveTrackingOrder(null)}
        />
      )}

      {/* DRAWER: Menu Categories Bottom Sheet */}
      <CategorySheet
        isOpen={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        categories={CATEGORIES}
        foods={foods}
        lang={lang}
        onSelectCategory={(catId) => {
          setHomeCategory(catId);
          const el = document.getElementById(`category-section-${catId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      />

      {/* Floating Scroll to Top Button */}
      {showScrollTop && activeTab !== 'cart' && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 end-5 sm:end-8 z-40 w-10 h-10 rounded-full bg-[#071A2D] border border-[#C9A24D]/40 text-[#F0D47C] shadow-2xl flex items-center justify-center hover:bg-[#C9A24D] hover:text-[#020F1E] active:scale-95 transition-all animate-fadeIn"
          title="بازگشت به بالا"
          aria-label="بازگشت به بالا"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Fixed Floating Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab === 'home' ? 'home' : activeTab === 'cart' ? 'cart' : activeTab === 'profile' ? 'profile' : 'home'}
        cartCount={totalCartCount}
        onNavigate={(tab) => {
          setIsSearchOpen(false);
          setActiveTrackingOrder(null);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
