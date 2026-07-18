"use client";

import { useState, useEffect, useCallback } from "react";

import HomePage from "@/app/ui/home/home-page";
import Nav from "@/app/ui/shared/nav";
import ProductDetailPage from "@/app/ui/product/product-detail-page";
import ShoppingCartPage from "@/app/ui/cart/shopping-cart-page";
import AuthPage from "@/app/ui/auth/auth-page";
import UserProfilePage from "@/app/ui/profile/user-profile-page";

import { Product, CartItem, AuthTab, ProfileSection, View } from "@/app/lib/definitions";
import { 
  PRODUCTS, INITIAL_CART
} from "@/app/lib/placeholder-data";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const toggleWishlist = useCallback((id: number) => {
    setWishlist((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }, []);

  const addToCart = useCallback((product?: Product) => {
    const p = product ?? PRODUCTS[0];
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === p.id && i.size === (p.sizes[0] ?? "M"));
      if (existing) {
        return prev.map((i) => i.cartId === existing.cartId ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { cartId: `ci-${Date.now()}`, product: p, size: p.sizes[0] ?? "M", color: p.colors[0], qty: 1 }];
    });
  }, []);

  const changeQty = useCallback((cartId: string, delta: number) => {
    setCartItems((prev) => prev.map((i) => i.cartId === cartId ? { ...i, qty: Math.max(1, Math.min(i.product.stock ?? 10, i.qty + delta)) } : i));
  }, []);

  const removeItem = useCallback((cartId: string) => {
    setTimeout(() => setCartItems((prev) => prev.filter((i) => i.cartId !== cartId)), 350);
  }, []);

  const saveForLater = useCallback((cartId: string) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.cartId === cartId);
      if (item) setSavedItems((s) => [...s, item]);
      return prev.filter((i) => i.cartId !== cartId);
    });
  }, []);

  const moveToCart = useCallback((cartId: string) => {
    setSavedItems((prev) => {
      const item = prev.find((i) => i.cartId === cartId);
      if (item) setCartItems((c) => [...c, { ...item, cartId: `ci-${Date.now()}` }]);
      return prev.filter((i) => i.cartId !== cartId);
    });
  }, []);

  const removeSaved = useCallback((cartId: string) => {
    setSavedItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }, []);

  const selectProduct = useCallback((p: Product) => {
    setSelectedProduct(p);
    setView("product");
    window.scrollTo({ top: 0 });
  }, []);

  const goHome = useCallback(() => {
    setView("home");
    setSelectedProduct(null);
  }, []);

  const openCart = useCallback(() => {
    setView("cart");
    window.scrollTo({ top: 0 });
  }, []);

  const [authDefaultTab, setAuthDefaultTab] = useState<AuthTab>("login");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // demo: starts logged in
  const openAuth = useCallback((tab: AuthTab = "login") => {
    if (isLoggedIn) { setView("profile"); window.scrollTo({ top: 0 }); return; }
    setAuthDefaultTab(tab);
    setView("auth");
    window.scrollTo({ top: 0 });
  }, [isLoggedIn]);

  const openProfile = useCallback(() => {
    setView("profile");
    window.scrollTo({ top: 0 });
  }, []);

  const relatedProducts = selectedProduct
    ? PRODUCTS.filter((p) => p.id !== selectedProduct.id && (p.category === selectedProduct.category || p.id % 3 === selectedProduct.id % 3)).slice(0, 4)
    : [];

  // Auth page has its own full-screen layout — no shared Nav
  if (view === "auth") {
    return (
      <div className="min-h-screen font-[Plus_Jakarta_Sans,sans-serif] overflow-x-hidden">
        <AuthPage defaultTab={authDefaultTab} onGoHome={goHome} onSuccess={() => { setIsLoggedIn(true); setView("profile"); window.scrollTo({ top: 0 }); }} />
      </div>
    );
  }

  // Profile page also uses its own layout (with shared Nav on top)
  if (view === "profile") {
    return (
      <div className="min-h-screen font-[Plus_Jakarta_Sans,sans-serif] overflow-x-hidden">
        <Nav scrolled={scrolled} cartCount={cartCount} wishlistSize={wishlist.size} onGoHome={goHome} onCart={openCart} onAuth={openAuth} />
        <UserProfilePage onGoHome={goHome} wishlistSize={wishlist.size} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-[Plus_Jakarta_Sans,sans-serif] overflow-x-hidden">
      <Nav scrolled={scrolled} cartCount={cartCount} wishlistSize={wishlist.size} onGoHome={goHome} onCart={openCart} onAuth={openAuth} />

      {view === "home" && (
        <HomePage wishlist={wishlist} onWishlist={toggleWishlist} onCart={() => addToCart()} onSelect={selectProduct} />
      )}

      {view === "product" && selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          wishlist={wishlist}
          onWishlist={toggleWishlist}
          onCart={() => addToCart(selectedProduct)}
          onGoHome={goHome}
          relatedProducts={relatedProducts}
          onSelect={selectProduct}
        />
      )}

      {view === "cart" && (
        <ShoppingCartPage
          cartItems={cartItems}
          savedItems={savedItems}
          wishlist={wishlist}
          onQty={changeQty}
          onRemove={removeItem}
          onSave={saveForLater}
          onMoveToCart={moveToCart}
          onRemoveSaved={removeSaved}
          onWishlist={toggleWishlist}
          onSelectProduct={selectProduct}
          onGoHome={goHome}
          onAddProduct={(p) => addToCart(p)}
        />
      )}
    </div>
  );
}
