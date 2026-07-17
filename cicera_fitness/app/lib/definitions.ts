export type View = "home" | "product" | "cart" | "auth" | "profile";
export type ProfileSection = "overview" | "orders" | "wishlist" | "addresses" | "payments" | "notifications" | "security" | "support";
export type AuthTab = "login" | "register";
export type AuthStep = "form" | "loading" | "verify" | "success";

export interface CartItem {
  cartId: string;
  product: Product;
  size: string;
  color: string;
  qty: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  badge: string | null;
  img: string;
  imgs?: string[];
  sizes: string[];
  colors: string[];
  sku?: string;
  stock?: number;
  description?: string;
  category?: string;
}