import { FoodItem, Order, UserProfile, DiscountCoupon, UserAddress } from '../types';

// Helper to make API calls with fallback
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'خطایی در ارتباط با سرور رخ داد');
  }
  return data;
}

export const api = {
  // -------------------------------------------------------------
  // 1. AUTH & OTP (ورود با تلفن همراه و کد ۵ رقمی و سیستم پیامکی)
  // -------------------------------------------------------------
  async sendOtp(phone: string): Promise<{ success: boolean; message: string; devCode?: string; isRegistered: boolean }> {
    return request('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  async verifyOtp(params: {
    phone: string;
    code: string;
    fullName?: string;
    email?: string;
  }): Promise<{ success: boolean; message: string; user: UserProfile; token: string }> {
    return request('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // -------------------------------------------------------------
  // 2. USER PROFILE & ADDRESSES & FAVORITES
  // -------------------------------------------------------------
  async getProfile(phoneOrUserId: { phone?: string; userId?: string }): Promise<UserProfile> {
    const params = new URLSearchParams();
    if (phoneOrUserId.phone) params.set('phone', phoneOrUserId.phone);
    if (phoneOrUserId.userId) params.set('userId', phoneOrUserId.userId);
    return request(`/api/users/profile?${params.toString()}`);
  },

  async updateProfile(data: {
    userId?: string;
    phone?: string;
    fullName?: string;
    email?: string;
    nationalCode?: string;
    address?: string;
  }): Promise<{ success: boolean; user: UserProfile; message: string }> {
    return request('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async addAddress(data: {
    userId?: string;
    phone?: string;
    title: string;
    address: string;
    isDefault?: boolean;
  }): Promise<{ success: boolean; addresses: UserAddress[]; message: string }> {
    return request('/api/users/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteAddress(
    addressId: string,
    params: { userId?: string; phone?: string }
  ): Promise<{ success: boolean; addresses: UserAddress[]; message: string }> {
    const query = new URLSearchParams();
    if (params.userId) query.set('userId', params.userId);
    if (params.phone) query.set('phone', params.phone);
    return request(`/api/users/addresses/${addressId}?${query.toString()}`, {
      method: 'DELETE',
    });
  },

  async toggleFavorite(params: {
    userId?: string;
    phone?: string;
    foodId: string;
  }): Promise<{ success: boolean; isFavorited: boolean; favorites: string[] }> {
    return request('/api/users/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // -------------------------------------------------------------
  // 3. FOOD MENU (لیست غذاها، افزودن، ویرایش، حذف، تخفیف، اتمام موجودی)
  // -------------------------------------------------------------
  async getFoods(query?: { category?: string; isAvailable?: boolean; search?: string }): Promise<FoodItem[]> {
    const params = new URLSearchParams();
    if (query?.category) params.set('category', query.category);
    if (query?.isAvailable !== undefined) params.set('isAvailable', String(query.isAvailable));
    if (query?.search) params.set('search', query.search);
    return request(`/api/foods?${params.toString()}`);
  },

  async adminCreateFood(data: Partial<FoodItem>): Promise<{ success: boolean; message: string; food: FoodItem }> {
    return request('/api/admin/foods', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async adminUpdateFood(id: string, data: Partial<FoodItem>): Promise<{ success: boolean; message: string; food: FoodItem }> {
    return request(`/api/admin/foods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async adminDeleteFood(id: string): Promise<{ success: boolean; message: string }> {
    return request(`/api/admin/foods/${id}`, {
      method: 'DELETE',
    });
  },

  // -------------------------------------------------------------
  // 4. COUPONS SYSTEM (تخفیف‌های زمان‌دار، اولین سفارش، کف خرید، سقف تخفیف، کمپینی، اختصاصی، یکبار مصرف)
  // -------------------------------------------------------------
  async verifyCoupon(params: {
    code: string;
    phone?: string;
    orderAmount: number;
  }): Promise<{ success: boolean; coupon: DiscountCoupon; discountAmount: number; finalAmount: number; message: string }> {
    return request('/api/coupons/verify', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async getCoupons(): Promise<DiscountCoupon[]> {
    return request('/api/coupons');
  },

  async adminGetCoupons(): Promise<DiscountCoupon[]> {
    return request('/api/admin/coupons');
  },

  async adminCreateCoupon(data: Partial<DiscountCoupon>): Promise<{ success: boolean; message: string; coupon: DiscountCoupon }> {
    return request('/api/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async adminDeleteCoupon(id: string): Promise<{ success: boolean; message: string }> {
    return request(`/api/admin/coupons/${id}`, {
      method: 'DELETE',
    });
  },

  async adminToggleCoupon(id: string): Promise<{ success: boolean; message: string; coupon: DiscountCoupon }> {
    return request(`/api/admin/coupons/${id}/toggle`, {
      method: 'POST',
    });
  },

  // -------------------------------------------------------------
  // 5. ORDERS & TRANSACTIONS (سفارشات، سوابق خرید، پیگیری، تغییر وضعیت)
  // -------------------------------------------------------------
  async createOrder(data: Partial<Order>): Promise<{ success: boolean; message: string; order: Order }> {
    return request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMyOrders(params: { phone?: string; userId?: string }): Promise<Order[]> {
    const query = new URLSearchParams();
    if (params.phone) query.set('phone', params.phone);
    if (params.userId) query.set('userId', params.userId);
    return request(`/api/orders/my-orders?${query.toString()}`);
  },

  async trackOrder(orderId: string): Promise<Order> {
    return request(`/api/orders/track/${orderId}`);
  },

  async adminGetOrders(status?: string): Promise<Order[]> {
    const query = new URLSearchParams();
    if (status) query.set('status', status);
    return request(`/api/admin/orders?${query.toString()}`);
  },

  async adminUpdateOrderStatus(
    orderId: string,
    params: { status: string; note?: string; etaMinutes?: number }
  ): Promise<{ success: boolean; message: string; order: Order }> {
    return request(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify(params),
    });
  },

  // -------------------------------------------------------------
  // 6. ADMIN USERS & CUSTOMERS (مدیریت کاربران، افزودن، ویرایش و نقش)
  // -------------------------------------------------------------
  async adminGetUsers(): Promise<UserProfile[]> {
    return request('/api/admin/users');
  },

  async adminCreateUser(data: Partial<UserProfile>): Promise<{ success: boolean; message: string; user: UserProfile }> {
    return request('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async adminUpdateUser(userId: string, data: Partial<UserProfile>): Promise<{ success: boolean; message: string; user: UserProfile }> {
    return request(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async adminUpdateUserRole(userId: string, role: 'customer' | 'admin'): Promise<{ success: boolean; message: string; user: UserProfile }> {
    return request(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  async adminDeleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    return request(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }
};
