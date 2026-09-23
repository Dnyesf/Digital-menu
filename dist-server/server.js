// server.ts
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var rootDir = process.cwd();
var DB_FILE = path.join(rootDir, "db_data.json");
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading DB_FILE:", err);
  }
  return {
    users: [
      {
        id: "u-admin",
        phone: "09121112233",
        fullName: "\u0645\u062F\u06CC\u0631\u06CC\u062A \u06A9\u0627\u062E \u0634\u0627\u06CC\u06AF\u0627\u0646",
        role: "admin",
        email: "admin@shaygan.ir",
        membershipLevel: "\u0637\u0644\u0627\u06CC\u06CC",
        points: 4500,
        addresses: [
          {
            id: "addr-admin-1",
            title: "\u062F\u0641\u062A\u0631 \u0645\u0631\u06A9\u0632\u06CC",
            address: "\u062A\u0647\u0631\u0627\u0646\u060C \u062E\u06CC\u0627\u0628\u0627\u0646 \u0646\u06CC\u0627\u0648\u0631\u0627\u0646\u060C \u06A9\u0627\u062E \u0634\u0627\u06CC\u06AF\u0627\u0646\u060C \u0628\u062E\u0634 \u0645\u062F\u06CC\u0631\u06CC\u062A",
            isDefault: true
          }
        ],
        joinedDate: "\u06F1\u06F4\u06F0\u06F2/\u06F0\u06F1/\u06F1\u06F5",
        favorites: ["kebab-1", "kebab-2"]
      },
      {
        id: "u-customer-1",
        phone: "09123456789",
        fullName: "\u0627\u062D\u0633\u0627\u0646 \u0645\u062D\u0645\u062F\u06CC",
        role: "customer",
        email: "ehsan@example.com",
        membershipLevel: "\u0646\u0642\u0631\u0647\u200C\u0627\u06CC",
        points: 850,
        addresses: [
          {
            id: "addr-1",
            title: "\u0645\u0646\u0632\u0644",
            address: "\u062A\u0647\u0631\u0627\u0646\u060C \u0633\u0639\u0627\u062F\u062A\u200C\u0622\u0628\u0627\u062F\u060C \u0645\u06CC\u062F\u0627\u0646 \u06A9\u0627\u062C\u060C \u062E\u06CC\u0627\u0628\u0627\u0646 \u0633\u0631\u0648 \u063A\u0631\u0628\u06CC\u060C \u067E\u0644\u0627\u06A9 \u06F2\u06F4\u060C \u0648\u0627\u062D\u062F \u06F6",
            isDefault: true
          },
          {
            id: "addr-2",
            title: "\u0645\u062D\u0644 \u06A9\u0627\u0631",
            address: "\u062A\u0647\u0631\u0627\u0646\u060C \u0648\u0646\u06A9\u060C \u062E\u06CC\u0627\u0628\u0627\u0646 \u0645\u0644\u0627\u0635\u062F\u0631\u0627\u060C \u0628\u0631\u062C \u0648\u0646\u06A9\u060C \u0637\u0628\u0642\u0647 \u06F4",
            isDefault: false
          }
        ],
        joinedDate: "\u06F1\u06F4\u06F0\u06F3/\u06F0\u06F4/\u06F1\u06F0",
        favorites: ["kebab-1", "kebab-3", "app-1"]
      }
    ],
    foods: [
      {
        id: "kebab-1",
        name: "\u0686\u0644\u0648 \u06A9\u0628\u0627\u0628 \u0634\u06CC\u0634\u0644\u06CC\u06A9 \u062F\u0631\u0628\u0627\u0631\u06CC \u0634\u0627\u06CC\u06AF\u0627\u0646",
        nameEn: "Royal Shaygan Shishlik Kebab",
        description: "\u0634\u0634 \u062A\u06A9\u0647 \u0631\u0627\u0633\u062A\u0647 \u06AF\u0648\u0633\u0641\u0646\u062F\u06CC \u0627\u0639\u0644\u0627 \u0628\u0647 \u0647\u0645\u0631\u0627\u0647 \u0627\u0633\u062A\u062E\u0648\u0627\u0646 \u062F\u0646\u062F\u0647\u060C \u062E\u0648\u0627\u0628\u0627\u0646\u062F\u0647 \u0634\u062F\u0647 \u062F\u0631 \u0632\u0639\u0641\u0631\u0627\u0646 \u0642\u0627\u0626\u0646\u0627\u062A\u060C \u06A9\u0631\u0647 \u0645\u062D\u0644\u06CC \u0648 \u0627\u062F\u0648\u06CC\u0647\u200C\u062C\u0627\u062A \u0628\u0627\u0633\u062A\u0627\u0646\u06CC\u060C \u0633\u0631\u0648 \u0628\u0627 \u0628\u0631\u0646\u062C \u062F\u0648\u062F\u06CC \u0627\u0639\u0644\u0627\u06CC \u062A\u0627\u0631\u0645",
        descriptionEn: "Six pieces of prime lamb ribs marinated in saffron and butter, served with smoked Persian rice.",
        price: 98e4,
        originalPrice: 11e5,
        discountPercent: 11,
        category: "kebab",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviewsCount: 142,
        isPopular: true,
        isChefSpecial: true,
        isAvailable: true,
        ingredients: ["\u0631\u0627\u0633\u062A\u0647 \u06AF\u0648\u0633\u0641\u0646\u062F\u06CC \u0634\u0627\u0646\u062F\u06CC\u0632\u06CC", "\u0628\u0631\u0646\u062C \u0632\u0639\u0641\u0631\u0627\u0646\u06CC \u062F\u0648\u062F\u06CC", "\u06A9\u0631\u0647 \u06AF\u0648\u0633\u0641\u0646\u062F\u06CC \u0645\u062D\u0644\u06CC", "\u06AF\u0648\u062C\u0647 \u06A9\u0628\u0627\u0628\u06CC"],
        ingredientsEn: ["Lamb ribs", "Saffron rice", "Local butter", "Grilled tomatoes"],
        preparationTime: "\u06F2\u06F5 \u062F\u0642\u06CC\u0642\u0647",
        calories: 850
      },
      {
        id: "kebab-2",
        name: "\u0686\u0644\u0648 \u06A9\u0628\u0627\u0628 \u0628\u0631\u06AF \u0634\u0627\u0647\u0646\u0634\u0627\u0647\u06CC",
        nameEn: "Imperial Barg Kebab with Smoked Rice",
        description: "\u06CC\u06A9 \u0633\u06CC\u062E \u06A9\u0628\u0627\u0628 \u0628\u0631\u06AF \u06F2\u06F8\u06F0 \u06AF\u0631\u0645\u06CC \u0641\u06CC\u0644\u0647 \u06AF\u0648\u0633\u0641\u0646\u062F\u06CC \u0645\u0631\u06CC\u0646\u06CC\u062A \u0634\u062F\u0647 \u0628\u0627 \u0622\u0628 \u067E\u06CC\u0627\u0632 \u0648 \u06AF\u0631\u062F \u0644\u06CC\u0645\u0648\u060C \u062A\u0631\u062F \u0648 \u0622\u0628\u062F\u0627\u0631",
        descriptionEn: "280g thinly sliced tenderized lamb fillet with smoked saffron rice.",
        price: 89e4,
        category: "kebab",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        reviewsCount: 98,
        isPopular: true,
        isAvailable: true,
        ingredients: ["\u0641\u06CC\u0644\u0647 \u06AF\u0648\u0633\u0641\u0646\u062F\u06CC \u0627\u0639\u0644\u0627", "\u06A9\u0631\u0647 \u062D\u06CC\u0648\u0627\u0646\u06CC", "\u0628\u0631\u0646\u062C \u06A9\u062A\u0647 \u062A\u0627\u0631\u0645"],
        ingredientsEn: ["Lamb fillet", "Clarified butter", "Rice"],
        preparationTime: "\u06F2\u06F0 \u062F\u0642\u06CC\u0642\u0647",
        calories: 780
      },
      {
        id: "kebab-3",
        name: "\u0686\u0644\u0648 \u062C\u0648\u062C\u0647 \u06A9\u0628\u0627\u0628 \u0632\u0639\u0641\u0631\u0627\u0646\u06CC \u0633\u0644\u0637\u0646\u062A\u06CC",
        nameEn: "Royal Saffron Joojeh Kebab",
        description: "\u0641\u06CC\u0644\u0647 \u0633\u06CC\u0646\u0647 \u0645\u0631\u063A \u0632\u0639\u0641\u0631\u0627\u0646\u06CC \u0628\u062F\u0648\u0646 \u0627\u0633\u062A\u062E\u0648\u0627\u0646 \u0645\u0631\u06CC\u0646\u06CC\u062A \u0634\u062F\u0647 \u0628\u0627 \u0645\u0627\u0633\u062A \u0686\u06A9\u06CC\u062F\u0647 \u0648 \u0622\u0628\u0644\u06CC\u0645\u0648 \u0634\u06CC\u0631\u0627\u0632\u06CC \u062A\u0627\u0632\u0647",
        descriptionEn: "Saffron marinated boneless chicken breast served with Persian basmati rice.",
        price: 49e4,
        originalPrice: 55e4,
        discountPercent: 11,
        category: "kebab",
        image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        reviewsCount: 76,
        isPopular: true,
        isAvailable: true,
        ingredients: ["\u0641\u06CC\u0644\u0647 \u0645\u0631\u063A \u0645\u062D\u0644\u06CC", "\u0632\u0639\u0641\u0631\u0627\u0646 \u0642\u0627\u0626\u0646\u0627\u062A", "\u0628\u0631\u0646\u062C \u0627\u06CC\u0631\u0627\u0646\u06CC", "\u06AF\u0648\u062C\u0647 \u0648 \u0641\u0644\u0641\u0644 \u06A9\u0628\u0627\u0628\u06CC"],
        ingredientsEn: ["Chicken fillet", "Saffron", "Basmati rice", "Grilled tomatoes"],
        preparationTime: "\u06F2\u06F0 \u062F\u0642\u06CC\u0642\u0647",
        calories: 620
      },
      {
        id: "stew-1",
        name: "\u0686\u0644\u0648 \u0642\u0648\u0631\u0645\u0647 \u0633\u0628\u0632\u06CC \u062C\u0627\u0627\u0641\u062A\u0627\u062F\u0647 \u0628\u0627 \u0631\u0648\u063A\u0646 \u0633\u06CC\u0627\u0647",
        nameEn: "Slow-Cooked Ghormeh Sabzi",
        description: "\u0633\u0628\u0632\u06CC \u0642\u0648\u0631\u0645\u0647 \u0633\u0631\u062E\u200C\u0634\u062F\u0647 \u06F7 \u0633\u0627\u0639\u062A\u0647 \u0628\u0627 \u0645\u063A\u0632 \u0631\u0627\u0646 \u06AF\u0648\u0633\u0641\u0646\u062F\u06CC \u0642\u0644\u0645\u200C\u062F\u0627\u0631\u060C \u0644\u06CC\u0645\u0648 \u0639\u0645\u0627\u0646\u06CC \u0627\u0635\u06CC\u0644 \u062C\u0647\u0631\u0645 \u0648 \u0644\u0648\u0628\u06CC\u0627 \u0686\u06CC\u062A\u06CC",
        descriptionEn: "Traditional 7-hour slow cooked Persian herb stew with lamb shank.",
        price: 46e4,
        category: "stew",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviewsCount: 115,
        isPopular: true,
        isTraditional: true,
        isAvailable: true,
        ingredients: ["\u06AF\u0648\u0634\u062A \u0631\u0627\u0646 \u06AF\u0648\u0633\u0641\u0646\u062F\u06CC", "\u0633\u0628\u0632\u06CC\u062C\u0627\u062A \u0645\u0639\u0637\u0631 \u0645\u062D\u0644\u06CC", "\u0644\u06CC\u0645\u0648 \u0639\u0645\u0627\u0646\u06CC \u0627\u0639\u0644\u0627", "\u0644\u0648\u0628\u06CC\u0627 \u0686\u06CC\u062A\u06CC \u062E\u0645\u06CC\u0646"],
        ingredientsEn: ["Lamb chunks", "Fresh herbs", "Dried limes", "Kidney beans"],
        preparationTime: "\u06F1\u06F5 \u062F\u0642\u06CC\u0642\u0647",
        calories: 710
      },
      {
        id: "fastfood-1",
        name: "\u0628\u0631\u06AF\u0631 \u062F\u0648\u0628\u0644 \u0630\u063A\u0627\u0644\u06CC \u062F\u0633\u062A\u200C\u0633\u0627\u0632 \u0634\u0627\u06CC\u06AF\u0627\u0646",
        nameEn: "Handcrafted Double Charcoal Burger",
        description: "\u062F\u0648 \u0644\u0627\u06CC\u0647 \u06AF\u0648\u0634\u062A \u06AF\u0648\u0633\u0627\u0644\u0647 \u062E\u0627\u0644\u0635 \u06F1\u06F6\u06F0 \u06AF\u0631\u0645\u06CC \u0628\u0627 \u067E\u0646\u06CC\u0631 \u0686\u062F\u0627\u0631 \u062F\u0648\u0628\u0644\u060C \u0633\u0633 \u0628\u0627\u0631\u0628\u06CC\u06A9\u06CC\u0648 \u062F\u0648\u062F\u06CC \u0648 \u0633\u06CC\u0628\u200C\u0632\u0645\u06CC\u0646\u06CC \u062A\u0646\u0648\u0631\u06CC",
        descriptionEn: "Double 160g handcrafted beef patty with double cheddar, smoked BBQ and fries.",
        price: 42e4,
        category: "fastfood",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        reviewsCount: 64,
        isFastfood: true,
        isAvailable: true,
        ingredients: ["\u06AF\u0648\u0634\u062A \u06AF\u0648\u0633\u0627\u0644\u0647 \u062A\u0627\u0632\u0647", "\u0646\u0627\u0646 \u0628\u0631\u06CC\u0648\u0634 \u06A9\u0646\u062C\u062F\u06CC", "\u067E\u0646\u06CC\u0631 \u0686\u062F\u0627\u0631 \u0637\u0628\u06CC\u0639\u06CC", "\u0633\u0633 \u0645\u062E\u0635\u0648\u0635 \u062F\u0648\u062F\u06CC"],
        ingredientsEn: ["Beef patty", "Brioche bun", "Cheddar cheese", "Special sauce"],
        preparationTime: "\u06F1\u06F8 \u062F\u0642\u06CC\u0642\u0647",
        calories: 890
      },
      {
        id: "app-1",
        name: "\u0645\u06CC\u0631\u0632\u0627\u0642\u0627\u0633\u0645\u06CC \u0647\u06CC\u0632\u0645\u06CC \u06AF\u06CC\u0644\u0627\u0646\u06CC \u0628\u0627 \u0646\u0627\u0646 \u0633\u0646\u06AF\u06A9 \u062F\u0627\u063A",
        nameEn: "Smoked Eggplant Mirza Ghasemi",
        description: "\u0628\u0627\u062F\u0645\u062C\u0627\u0646 \u06A9\u0628\u0627\u0628\u06CC \u0631\u0648\u06CC \u0647\u06CC\u0632\u0645 \u0628\u0627 \u0633\u06CC\u0631 \u062F\u0627\u063A\u060C \u06AF\u0648\u062C\u0647\u200C\u0641\u0631\u0646\u06AF\u06CC \u0631\u0646\u062F\u0647\u200C\u0634\u062F\u0647 \u0648 \u062A\u062E\u0645\u200C\u0645\u0631\u063A \u0645\u062D\u0644\u06CC",
        descriptionEn: "Wood-smoked eggplant dip with garlic, vine-ripened tomatoes, and eggs.",
        price: 26e4,
        category: "appetizer",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviewsCount: 88,
        isTraditional: true,
        isAvailable: true,
        ingredients: ["\u0628\u0627\u062F\u0645\u062C\u0627\u0646 \u06A9\u0628\u0627\u0628\u06CC \u062F\u0648\u062F\u06CC", "\u0633\u06CC\u0631 \u0645\u062D\u0644\u06CC", "\u06AF\u0648\u062C\u0647 \u0641\u0631\u0646\u06AF\u06CC \u062A\u0627\u0632\u0647", "\u062A\u062E\u0645\u200C\u0645\u0631\u063A \u0645\u062D\u0644\u06CC"],
        ingredientsEn: ["Smoked eggplant", "Fresh garlic", "Tomatoes", "Eggs"],
        preparationTime: "\u06F1\u06F0 \u062F\u0642\u06CC\u0642\u0647",
        calories: 340
      }
    ],
    coupons: [
      {
        id: "cp-welcome",
        code: "SHAYGANFIRST",
        title: "\u062A\u062E\u0641\u06CC\u0641 \u0648\u06CC\u0698\u0647 \u0627\u0648\u0644\u06CC\u0646 \u0633\u0641\u0627\u0631\u0634 \u06A9\u0627\u062E \u0634\u0627\u06CC\u06AF\u0627\u0646",
        type: "percent",
        amount: 25,
        maxDiscount: 2e5,
        minOrderAmount: 3e5,
        isFirstOrderOnly: true,
        validUntil: "2026-12-30",
        isCampaign: false,
        isSingleUse: true,
        usedByPhones: [],
        isActive: true,
        usageCount: 0,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "cp-festive",
        code: "NOWRUZ50",
        title: "\u062A\u062E\u0641\u06CC\u0641 \u06A9\u0645\u067E\u06CC\u0646 \u0639\u06CC\u062F\u0627\u0646\u0647 \u0634\u0627\u06CC\u06AF\u0627\u0646",
        type: "fixed",
        amount: 5e4,
        minOrderAmount: 4e5,
        isFirstOrderOnly: false,
        validUntil: "2026-08-30",
        isCampaign: true,
        campaignName: "\u062C\u0634\u0646\u0648\u0627\u0631\u0647 \u0628\u0647\u0627\u0631\u0647",
        isSingleUse: false,
        usedByPhones: [],
        isActive: true,
        usageCount: 12,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "cp-vip",
        code: "VIPGUEST",
        title: "\u06A9\u0648\u067E\u0646 \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u0645\u0634\u062A\u0631\u06CC\u0627\u0646 VIP",
        type: "percent",
        amount: 30,
        maxDiscount: 35e4,
        minOrderAmount: 6e5,
        isFirstOrderOnly: false,
        targetPhone: "09123456789",
        // اختصاصی به یک کاربر
        isSingleUse: true,
        usedByPhones: [],
        isActive: true,
        usageCount: 0,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ],
    orders: [
      {
        id: "ORD-7819",
        userId: "u-customer-1",
        customerName: "\u0627\u062D\u0633\u0627\u0646 \u0645\u062D\u0645\u062F\u06CC",
        phone: "09123456789",
        address: "\u062A\u0647\u0631\u0627\u0646\u060C \u0633\u0639\u0627\u062F\u062A\u200C\u0622\u0628\u0627\u062F\u060C \u0645\u06CC\u062F\u0627\u0646 \u06A9\u0627\u062C\u060C \u062E\u06CC\u0627\u0628\u0627\u0646 \u0633\u0631\u0648 \u063A\u0631\u0628\u06CC\u060C \u067E\u0644\u0627\u06A9 \u06F2\u06F4\u060C \u0648\u0627\u062D\u062F \u06F6",
        items: [
          {
            food: {
              id: "kebab-1",
              name: "\u0686\u0644\u0648 \u06A9\u0628\u0627\u0628 \u0634\u06CC\u0634\u0644\u06CC\u06A9 \u062F\u0631\u0628\u0627\u0631\u06CC \u0634\u0627\u06CC\u06AF\u0627\u0646",
              nameEn: "Royal Shaygan Shishlik Kebab",
              description: "",
              descriptionEn: "",
              price: 98e4,
              category: "kebab",
              image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
              rating: 4.9,
              reviewsCount: 142,
              ingredients: [],
              ingredientsEn: [],
              preparationTime: "\u06F2\u06F5 \u062F\u0642\u06CC\u0642\u0647"
            },
            quantity: 1
          },
          {
            food: {
              id: "app-1",
              name: "\u0645\u06CC\u0631\u0632\u0627\u0642\u0627\u0633\u0645\u06CC \u0647\u06CC\u0632\u0645\u06CC \u06AF\u06CC\u0644\u0627\u0646\u06CC \u0628\u0627 \u0646\u0627\u0646 \u0633\u0646\u06AF\u06A9 \u062F\u0627\u063A",
              nameEn: "Smoked Eggplant Mirza Ghasemi",
              description: "",
              descriptionEn: "",
              price: 26e4,
              category: "appetizer",
              image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
              rating: 4.9,
              reviewsCount: 88,
              ingredients: [],
              ingredientsEn: [],
              preparationTime: "\u06F1\u06F0 \u062F\u0642\u06CC\u0642\u0647"
            },
            quantity: 1
          }
        ],
        subtotal: 124e4,
        deliveryFee: 45e3,
        discount: 5e4,
        couponCode: "NOWRUZ50",
        total: 1235e3,
        deliveryType: "delivery",
        paymentMethod: "online",
        status: "delivering",
        orderTime: "\u06F1\u06F4:\u06F3\u06F5 - \u0627\u0645\u0631\u0648\u0632",
        etaMinutes: 20,
        statusHistory: [
          { status: "submitted", timestamp: "14:35", note: "\u0633\u0641\u0627\u0631\u0634 \u062F\u0631 \u0633\u06CC\u0633\u062A\u0645 \u062B\u0628\u062A \u0634\u062F" },
          { status: "confirmed", timestamp: "14:37", note: "\u062A\u0627\u06CC\u06CC\u062F \u062A\u0648\u0633\u0637 \u0645\u062F\u06CC\u0631\u06CC\u062A \u0631\u0633\u062A\u0648\u0631\u0627\u0646" },
          { status: "cooking", timestamp: "14:40", note: "\u0622\u0634\u067E\u0632\u062E\u0627\u0646\u0647 \u062F\u0631 \u062D\u0627\u0644 \u067E\u062E\u062A" },
          { status: "delivering", timestamp: "15:05", note: "\u067E\u06CC\u06A9 \u0634\u0627\u06CC\u06AF\u0627\u0646 \u062F\u0631 \u0645\u0633\u06CC\u0631 \u062A\u062D\u0648\u06CC\u0644" }
        ]
      }
    ],
    otps: {}
  };
}
var db = loadDB();
function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save DB_FILE:", err);
  }
}
function registerApiRoutes(app) {
  app.use(express.json());
  app.post("/api/auth/send-otp", (req, res) => {
    const { phone } = req.body;
    if (!phone || typeof phone !== "string" || phone.trim().length < 10) {
      return res.status(400).json({ error: "\u0634\u0645\u0627\u0631\u0647 \u062A\u0644\u0641\u0646 \u0645\u0639\u062A\u0628\u0631 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    const cleanPhone = phone.trim().replace(/^(\+98)/, "0");
    const code = Math.floor(1e4 + Math.random() * 9e4).toString();
    const expiresAt = Date.now() + 2 * 60 * 1e3;
    db.otps[cleanPhone] = { code, expiresAt };
    const existingUser = db.users.find((u) => u.phone === cleanPhone);
    console.log(`[SMS-GATEWAY] Sending 5-digit OTP to ${cleanPhone}: ${code}`);
    return res.json({
      success: true,
      message: `\u06A9\u062F \u062A\u0627\u06CC\u06CC\u062F \u06F5 \u0631\u0642\u0645\u06CC \u0627\u0631\u0633\u0627\u0644 \u0634\u062F`,
      phone: cleanPhone,
      isRegistered: !!existingUser,
      // For instant testing preview, return devCode in response
      devCode: code,
      expiresInSeconds: 120
    });
  });
  app.post("/api/auth/verify-otp", (req, res) => {
    const { phone, code, fullName, email } = req.body;
    const cleanPhone = (phone || "").trim().replace(/^(\+98)/, "0");
    if (!cleanPhone || !code) {
      return res.status(400).json({ error: "\u0634\u0645\u0627\u0631\u0647 \u062A\u0644\u0641\u0646 \u0648 \u06A9\u062F \u06F5 \u0631\u0642\u0645\u06CC \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    const storedOtp = db.otps[cleanPhone];
    if (!storedOtp) {
      return res.status(400).json({ error: "\u06A9\u062F \u062A\u0627\u06CC\u06CC\u062F \u0628\u0631\u0627\u06CC \u0627\u06CC\u0646 \u0634\u0645\u0627\u0631\u0647 \u0635\u0627\u062F\u0631 \u0646\u0634\u062F\u0647 \u06CC\u0627 \u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647 \u0627\u0633\u062A" });
    }
    if (Date.now() > storedOtp.expiresAt) {
      delete db.otps[cleanPhone];
      return res.status(400).json({ error: "\u06A9\u062F \u062A\u0627\u06CC\u06CC\u062F \u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647 \u0627\u0633\u062A. \u0644\u0637\u0641\u0627 \u0645\u062C\u062F\u062F\u0627 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062F\u0647\u06CC\u062F" });
    }
    if (storedOtp.code !== code.trim()) {
      return res.status(400).json({ error: "\u06A9\u062F \u062A\u0627\u06CC\u06CC\u062F \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0633\u062A" });
    }
    delete db.otps[cleanPhone];
    let user = db.users.find((u) => u.phone === cleanPhone);
    if (!user) {
      const isFirstUserEver = db.users.length === 0 || cleanPhone === "09121112233";
      user = {
        id: `u-${Date.now()}`,
        phone: cleanPhone,
        fullName: fullName || "\u0645\u0647\u0645\u0627\u0646 \u06AF\u0631\u0627\u0645\u06CC \u06A9\u0627\u062E \u0634\u0627\u06CC\u06AF\u0627\u0646",
        role: isFirstUserEver ? "admin" : "customer",
        email: email || "",
        membershipLevel: "\u0628\u0631\u0646\u0632\u06CC",
        points: 100,
        // welcome bonus
        addresses: [],
        joinedDate: "\u06F1\u06F4\u06F0\u06F4/\u06F0\u06F1/\u06F0\u06F1",
        favorites: []
      };
      db.users.push(user);
    } else {
      if (fullName && (!user.fullName || user.fullName === "\u0645\u0647\u0645\u0627\u0646 \u06AF\u0631\u0627\u0645\u06CC \u06A9\u0627\u062E \u0634\u0627\u06CC\u06AF\u0627\u0646")) {
        user.fullName = fullName;
      }
      if (email && !user.email) {
        user.email = email;
      }
    }
    saveDB();
    return res.json({
      success: true,
      message: "\u0648\u0631\u0648\u062F \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0646\u062C\u0627\u0645 \u0634\u062F",
      user,
      token: `token-${user.id}-${Date.now()}`
    });
  });
  app.get("/api/users/profile", (req, res) => {
    const phone = req.query.phone;
    const userId = req.query.userId;
    const user = db.users.find((u) => phone && u.phone === phone || userId && u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    }
    return res.json(user);
  });
  app.put("/api/users/profile", (req, res) => {
    const { userId, phone, fullName, email, nationalCode } = req.body;
    const user = db.users.find((u) => userId && u.id === userId || phone && u.phone === phone);
    if (!user) {
      return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    }
    if (fullName !== void 0) user.fullName = fullName;
    if (email !== void 0) user.email = email;
    if (nationalCode !== void 0) user.nationalCode = nationalCode;
    saveDB();
    return res.json({ success: true, message: "\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0628\u0631\u0648\u0632 \u0634\u062F", user });
  });
  app.post("/api/users/addresses", (req, res) => {
    const { userId, phone, title, address, isDefault } = req.body;
    const user = db.users.find((u) => userId && u.id === userId || phone && u.phone === phone);
    if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    if (!title || !address) {
      return res.status(400).json({ error: "\u0639\u0646\u0648\u0627\u0646 \u0648 \u0622\u062F\u0631\u0633 \u062F\u0642\u06CC\u0642 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    const newAddr = {
      id: `addr-${Date.now()}`,
      title,
      address,
      isDefault: isDefault || user.addresses.length === 0
    };
    if (newAddr.isDefault) {
      user.addresses.forEach((a) => {
        a.isDefault = false;
      });
    }
    user.addresses.push(newAddr);
    saveDB();
    return res.json({ success: true, message: "\u0622\u062F\u0631\u0633 \u0627\u0641\u0632\u0648\u062F\u0647 \u0634\u062F", addresses: user.addresses });
  });
  app.delete("/api/users/addresses/:addressId", (req, res) => {
    const { addressId } = req.params;
    const { userId, phone } = req.query;
    const user = db.users.find((u) => userId && u.id === userId || phone && u.phone === phone);
    if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    user.addresses = user.addresses.filter((a) => a.id !== addressId);
    if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }
    saveDB();
    return res.json({ success: true, message: "\u0622\u062F\u0631\u0633 \u062D\u0630\u0641 \u0634\u062F", addresses: user.addresses });
  });
  app.post("/api/users/favorites/toggle", (req, res) => {
    const { userId, phone, foodId } = req.body;
    const user = db.users.find((u) => userId && u.id === userId || phone && u.phone === phone);
    if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
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
  app.get("/api/foods", (req, res) => {
    const { category, isAvailable, search } = req.query;
    let list = [...db.foods];
    if (category && category !== "all") {
      list = list.filter((f) => f.category === category);
    }
    if (isAvailable !== void 0) {
      const boolVal = isAvailable === "true";
      list = list.filter((f) => (f.isAvailable ?? true) === boolVal);
    }
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q));
    }
    return res.json(list);
  });
  app.get("/api/foods/:id", (req, res) => {
    const food = db.foods.find((f) => f.id === req.params.id);
    if (!food) return res.status(404).json({ error: "\u063A\u0630\u0627 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    return res.json(food);
  });
  app.post("/api/admin/foods", (req, res) => {
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
      return res.status(400).json({ error: "\u0646\u0627\u0645 \u063A\u0630\u0627\u060C \u0642\u06CC\u0645\u062A \u0648 \u062F\u0633\u062A\u0647\u200C\u0628\u0646\u062F\u06CC \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    const newFood = {
      id: `food-${Date.now()}`,
      name,
      nameEn: nameEn || name,
      description: description || "",
      descriptionEn: descriptionEn || "",
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : void 0,
      discountPercent: discountPercent ? Number(discountPercent) : void 0,
      category,
      image: image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      rating: 5,
      reviewsCount: 1,
      isAvailable: isAvailable !== void 0 ? Boolean(isAvailable) : true,
      ingredients: Array.isArray(ingredients) ? ingredients : ingredients ? ingredients.split("\u060C") : [],
      ingredientsEn: [],
      preparationTime: preparationTime || "\u06F2\u06F0 \u062F\u0642\u06CC\u0642\u0647"
    };
    db.foods.unshift(newFood);
    saveDB();
    return res.status(201).json({ success: true, message: "\u063A\u0630\u0627\u06CC \u062C\u062F\u06CC\u062F \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062B\u0628\u062A \u0634\u062F", food: newFood });
  });
  app.put("/api/admin/foods/:id", (req, res) => {
    const { id } = req.params;
    const food = db.foods.find((f) => f.id === id);
    if (!food) return res.status(404).json({ error: "\u063A\u0630\u0627 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    const updates = req.body;
    if (updates.name !== void 0) food.name = updates.name;
    if (updates.nameEn !== void 0) food.nameEn = updates.nameEn;
    if (updates.description !== void 0) food.description = updates.description;
    if (updates.price !== void 0) food.price = Number(updates.price);
    if (updates.category !== void 0) food.category = updates.category;
    if (updates.image !== void 0) food.image = updates.image;
    if (updates.isAvailable !== void 0) food.isAvailable = Boolean(updates.isAvailable);
    if (updates.preparationTime !== void 0) food.preparationTime = updates.preparationTime;
    if (updates.discountPercent !== void 0) {
      const discount = Number(updates.discountPercent);
      if (discount > 0) {
        food.discountPercent = discount;
        if (!food.originalPrice) {
          food.originalPrice = food.price;
        }
        food.price = Math.round(food.originalPrice * (1 - discount / 100));
      } else {
        if (food.originalPrice) {
          food.price = food.originalPrice;
        }
        food.originalPrice = void 0;
        food.discountPercent = void 0;
      }
    }
    if (updates.originalPrice !== void 0) {
      food.originalPrice = updates.originalPrice ? Number(updates.originalPrice) : void 0;
    }
    saveDB();
    return res.json({ success: true, message: "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u063A\u0630\u0627 \u0628\u0631\u0648\u0632 \u0634\u062F", food });
  });
  app.delete("/api/admin/foods/:id", (req, res) => {
    const { id } = req.params;
    const initialLen = db.foods.length;
    db.foods = db.foods.filter((f) => f.id !== id);
    if (db.foods.length === initialLen) {
      return res.status(404).json({ error: "\u063A\u0630\u0627 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    }
    saveDB();
    return res.json({ success: true, message: "\u063A\u0630\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0632 \u0645\u0646\u0648 \u062D\u0630\u0641 \u0634\u062F" });
  });
  app.post("/api/coupons/verify", (req, res) => {
    const { code, phone, orderAmount } = req.body;
    if (!code || !orderAmount) {
      return res.status(400).json({ error: "\u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u0648 \u0645\u0628\u0644\u063A \u0633\u0641\u0627\u0631\u0634 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    const cleanCode = code.trim().toUpperCase();
    const coupon = db.coupons.find((c) => c.code.toUpperCase() === cleanCode);
    if (!coupon) {
      return res.status(404).json({ error: "\u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u0645\u06CC\u200C\u0628\u0627\u0634\u062F" });
    }
    if (!coupon.isActive) {
      return res.status(400).json({ error: "\u0627\u06CC\u0646 \u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u062F\u0631 \u062D\u0627\u0644 \u062D\u0627\u0636\u0631 \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0627\u0633\u062A" });
    }
    if (coupon.validUntil) {
      const now = /* @__PURE__ */ new Date();
      const expDate = new Date(coupon.validUntil);
      if (now > expDate) {
        return res.status(400).json({ error: "\u0645\u0647\u0644\u062A \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 \u0627\u06CC\u0646 \u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u0628\u0647 \u067E\u0627\u06CC\u0627\u0646 \u0631\u0633\u06CC\u062F\u0647 \u0627\u0633\u062A" });
      }
    }
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        error: `\u062D\u062F\u0627\u0642\u0644 \u0645\u0628\u0644\u063A \u0633\u0641\u0627\u0631\u0634 \u0628\u0631\u0627\u06CC \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 \u0627\u06CC\u0646 \u06A9\u062F ${coupon.minOrderAmount.toLocaleString("fa-IR")} \u062A\u0648\u0645\u0627\u0646 \u0627\u0633\u062A`
      });
    }
    if (coupon.targetPhone && phone) {
      const cleanPhone = phone.trim().replace(/^(\+98)/, "0");
      if (coupon.targetPhone !== cleanPhone) {
        return res.status(403).json({ error: "\u0627\u06CC\u0646 \u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u0648\u06CC\u0698\u0647 \u0634\u062E\u0635 \u062F\u06CC\u06AF\u0631\u06CC \u062F\u0631 \u0646\u0638\u0631 \u06AF\u0631\u0641\u062A\u0647 \u0634\u062F\u0647 \u0627\u0633\u062A" });
      }
    }
    if (coupon.isSingleUse && phone) {
      const cleanPhone = phone.trim().replace(/^(\+98)/, "0");
      if (coupon.usedByPhones?.includes(cleanPhone)) {
        return res.status(400).json({ error: "\u0634\u0645\u0627 \u0642\u0628\u0644\u0627\u064B \u0627\u0632 \u0627\u06CC\u0646 \u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0631\u062F\u0647\u200C\u0627\u06CC\u062F" });
      }
    }
    if (coupon.isFirstOrderOnly && phone) {
      const cleanPhone = phone.trim().replace(/^(\+98)/, "0");
      const userOrdersCount = db.orders.filter((o) => o.phone === cleanPhone).length;
      if (userOrdersCount > 0) {
        return res.status(400).json({ error: "\u0627\u06CC\u0646 \u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u062A\u0646\u0647\u0627 \u0648\u06CC\u0698\u0647 \u0627\u0648\u0644\u06CC\u0646 \u0633\u0641\u0627\u0631\u0634 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u062C\u062F\u06CC\u062F \u0645\u06CC\u200C\u0628\u0627\u0634\u062F" });
      }
    }
    let discountAmount = 0;
    if (coupon.type === "percent") {
      discountAmount = Math.round(orderAmount * coupon.amount / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.amount;
    }
    discountAmount = Math.min(discountAmount, orderAmount);
    return res.json({
      success: true,
      coupon,
      discountAmount,
      finalAmount: orderAmount - discountAmount,
      message: `\u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u0627\u0639\u0645\u0627\u0644 \u0634\u062F (${discountAmount.toLocaleString("fa-IR")} \u062A\u0648\u0645\u0627\u0646 \u062A\u062E\u0641\u06CC\u0641)`
    });
  });
  app.get("/api/admin/coupons", (req, res) => {
    return res.json(db.coupons);
  });
  app.post("/api/admin/coupons", (req, res) => {
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
    if (!code || !amount) {
      return res.status(400).json({ error: "\u06A9\u062F \u0648 \u0645\u0642\u062F\u0627\u0631 \u062A\u062E\u0641\u06CC\u0641 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    const cleanCode = code.trim().toUpperCase();
    if (db.coupons.some((c) => c.code.toUpperCase() === cleanCode)) {
      return res.status(400).json({ error: "\u0627\u06CC\u0646 \u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u0642\u0628\u0644\u0627 \u062B\u0628\u062A \u0634\u062F\u0647 \u0627\u0633\u062A" });
    }
    const newCoupon = {
      id: `cp-${Date.now()}`,
      code: cleanCode,
      title: title || `\u062A\u062E\u0641\u06CC\u0641 ${cleanCode}`,
      type: type || "percent",
      amount: Number(amount),
      maxDiscount: maxDiscount ? Number(maxDiscount) : void 0,
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
      isFirstOrderOnly: Boolean(isFirstOrderOnly),
      validUntil: validUntil || void 0,
      isCampaign: Boolean(isCampaign),
      campaignName: campaignName || void 0,
      targetPhone: targetPhone ? targetPhone.trim().replace(/^(\+98)/, "0") : void 0,
      isSingleUse: isSingleUse !== void 0 ? Boolean(isSingleUse) : true,
      usedByPhones: [],
      isActive: true,
      usageCount: 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.coupons.unshift(newCoupon);
    saveDB();
    return res.status(201).json({ success: true, message: "\u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u06CC\u062C\u0627\u062F \u0634\u062F", coupon: newCoupon });
  });
  app.delete("/api/admin/coupons/:id", (req, res) => {
    const { id } = req.params;
    const initialLen = db.coupons.length;
    db.coupons = db.coupons.filter((c) => c.id !== id && c.code !== id);
    if (db.coupons.length === initialLen) {
      return res.status(404).json({ error: "\u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    }
    saveDB();
    return res.json({ success: true, message: "\u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062D\u0630\u0641 \u0634\u062F" });
  });
  app.post("/api/orders", (req, res) => {
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
      paymentMethod
    } = req.body;
    if (!items || !items.length || !phone) {
      return res.status(400).json({ error: "\u0622\u06CC\u062A\u0645\u200C\u0647\u0627\u06CC \u0633\u0641\u0627\u0631\u0634 \u0648 \u0634\u0645\u0627\u0631\u0647 \u062A\u0644\u0641\u0646 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    const cleanPhone = phone.trim().replace(/^(\+98)/, "0");
    if (couponCode) {
      const coupon = db.coupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase());
      if (coupon) {
        coupon.usageCount = (coupon.usageCount || 0) + 1;
        if (!coupon.usedByPhones) coupon.usedByPhones = [];
        if (!coupon.usedByPhones.includes(cleanPhone)) {
          coupon.usedByPhones.push(cleanPhone);
        }
      }
    }
    const newOrder = {
      id: `ORD-${Math.floor(1e3 + Math.random() * 9e3)}`,
      userId,
      customerName: customerName || "\u0645\u0634\u062A\u0631\u06CC \u0634\u0627\u06CC\u06AF\u0627\u0646",
      phone: cleanPhone,
      address: address || "\u062A\u062D\u0648\u06CC\u0644 \u062D\u0636\u0648\u0631\u06CC \u062F\u0631 \u0633\u0627\u0644\u0646 \u0631\u0633\u062A\u0648\u0631\u0627\u0646",
      items,
      subtotal: Number(subtotal) || 0,
      deliveryFee: Number(deliveryFee) || 0,
      discount: Number(discount) || 0,
      couponCode,
      total: Number(total) || 0,
      deliveryType: deliveryType || "delivery",
      paymentMethod: paymentMethod || "online",
      status: "submitted",
      orderTime: (/* @__PURE__ */ new Date()).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }) + " - \u0627\u0645\u0631\u0648\u0632",
      etaMinutes: 35,
      statusHistory: [
        { status: "submitted", timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }), note: "\u0633\u0641\u0627\u0631\u0634 \u062F\u0631 \u0633\u06CC\u0633\u062A\u0645 \u062B\u0628\u062A \u0634\u062F" }
      ]
    };
    db.orders.unshift(newOrder);
    const user = db.users.find((u) => u.phone === cleanPhone || userId && u.id === userId);
    if (user) {
      const earnedPoints = Math.floor(newOrder.total / 1e4);
      user.points = (user.points || 0) + earnedPoints;
    }
    saveDB();
    return res.status(201).json({ success: true, message: "\u0633\u0641\u0627\u0631\u0634 \u0634\u0645\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062B\u0628\u062A \u06AF\u0631\u062F\u06CC\u062F", order: newOrder });
  });
  app.get("/api/orders/my-orders", (req, res) => {
    const { phone, userId } = req.query;
    if (!phone && !userId) {
      return res.status(400).json({ error: "\u0634\u0645\u0627\u0631\u0647 \u062A\u0644\u0641\u0646 \u06CC\u0627 \u0634\u0646\u0627\u0633\u0647 \u06A9\u0627\u0631\u0628\u0631 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    const cleanPhone = phone ? phone.trim().replace(/^(\+98)/, "0") : "";
    const userOrders = db.orders.filter((o) => cleanPhone && o.phone === cleanPhone || userId && o.userId === userId);
    return res.json(userOrders);
  });
  app.get("/api/orders/track/:orderId", (req, res) => {
    const { orderId } = req.params;
    const order = db.orders.find((o) => o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: "\u0633\u0641\u0627\u0631\u0634\u06CC \u0628\u0627 \u0627\u06CC\u0646 \u0634\u0646\u0627\u0633\u0647 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    }
    return res.json(order);
  });
  app.get("/api/admin/orders", (req, res) => {
    const { status } = req.query;
    let list = [...db.orders];
    if (status && typeof status === "string" && status !== "all") {
      list = list.filter((o) => o.status === status);
    }
    return res.json(list);
  });
  app.put("/api/admin/orders/:orderId/status", (req, res) => {
    const { orderId } = req.params;
    const { status, note, etaMinutes } = req.body;
    const order = db.orders.find((o) => o.id === orderId);
    if (!order) return res.status(404).json({ error: "\u0633\u0641\u0627\u0631\u0634 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    order.status = status;
    if (etaMinutes !== void 0) order.etaMinutes = Number(etaMinutes);
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
      note: note || `\u0648\u0636\u0639\u06CC\u062A \u0633\u0641\u0627\u0631\u0634 \u0628\u0647 ${status} \u062A\u063A\u06CC\u06CC\u0631 \u06CC\u0627\u0641\u062A`
    });
    saveDB();
    return res.json({ success: true, message: "\u0648\u0636\u0639\u06CC\u062A \u0633\u0641\u0627\u0631\u0634 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0628\u0631\u0648\u0632 \u0634\u062F", order });
  });
  app.get("/api/admin/users", (req, res) => {
    return res.json(db.users);
  });
  app.put("/api/admin/users/:userId/role", (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    if (role !== "customer" && role !== "admin") {
      return res.status(400).json({ error: "\u0646\u0642\u0634 \u0628\u0627\u06CC\u062F \u06CC\u0627 customer \u06CC\u0627 admin \u0628\u0627\u0634\u062F" });
    }
    const user = db.users.find((u) => u.id === userId || u.phone === userId);
    if (!user) return res.status(404).json({ error: "\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" });
    user.role = role;
    saveDB();
    return res.json({ success: true, message: `\u0646\u0642\u0634 \u06A9\u0627\u0631\u0628\u0631 \u0628\u0647 ${role === "admin" ? "\u0645\u062F\u06CC\u0631" : "\u0645\u0634\u062A\u0631\u06CC"} \u0627\u0631\u062A\u0642\u0627 \u06CC\u0627\u0641\u062A`, user });
  });
}
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3e3;
  registerApiRoutes(app);
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== "true" },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(rootDir, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(rootDir, "dist", "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend API and UI running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
export {
  registerApiRoutes
};
