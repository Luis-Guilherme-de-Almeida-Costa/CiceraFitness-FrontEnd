"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShoppingCart, Heart, Menu, X, User, ChevronRight,
  Star, Truck, ShieldCheck, Award, Headphones,
  Zap, ArrowRight, Check, Mail,
  Minus, Plus, ChevronDown, ChevronUp,
  AlertCircle,Trash2,
  Bookmark, Tag, Lock, RefreshCw, Gift,
  Package, MapPin, CreditCard, Bell,
} from "lucide-react";

import HomePage from "@/app/ui/home/home-page";
import Nav from "@/app/ui/shared/nav";

import { fmt } from "@/app/lib/utils";
import { Product, CartItem, AuthStep, AuthTab, ProfileSection, View } from "@/app/lib/definitions";
import { 
  PRODUCTS, COLOR_LABELS, INITIAL_CART, COUPONS, MOCK_ADDRESSES, MOCK_COUPONS, MOCK_ORDERS, MOCK_PAYMENTS, MOCK_USER
} from "@/app/lib/placeholder-data";

// ─── Shopping Cart Page ───────────────────────────────────────────────────────

function CartItemCard({
  item, onQty, onRemove, onSave, onWishlist, wishlist,
}: {
  item: CartItem;
  onQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onSave: (id: string) => void;
  onWishlist: (id: number) => void;
  wishlist: Set<number>;
}) {
  const [removing, setRemoving] = useState(false);
  const stock = item.product.stock ?? 10;
  const lowStock = stock <= 5;
  const total = item.product.price * item.qty;

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.cartId), 320);
  };

  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 transition-all duration-300 ${removing ? "opacity-0 scale-95 -translate-x-4" : "opacity-100"}`}>
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-[#F5F5F5] shrink-0">
          <img src={item.product.img.replace("w=700&h=900", "w=200&h=260")} alt={item.product.name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">{item.product.category}</p>
              <h3 className="font-bold text-[#121212] text-sm sm:text-base leading-tight mt-0.5">{item.product.name}</h3>
            </div>
            <button onClick={handleRemove} className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shrink-0">
              <Trash2 size={14} />
            </button>
          </div>

          {/* Variant info */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              Cor: <span className="inline-block w-3 h-3 rounded-full border border-gray-200 ml-1" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-[#121212]">{COLOR_LABELS[item.color] ?? item.color}</span>
            </span>
            <span className="text-gray-200">|</span>
            <span className="text-xs text-gray-500">Tam: <span className="font-medium text-[#121212]">{item.size}</span></span>
          </div>

          {/* Price row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#121212] text-base">R$ {fmt(item.product.price)}</span>
            {item.product.discount > 0 && (
              <>
                <span className="text-xs text-gray-400 line-through">R$ {fmt(item.product.originalPrice)}</span>
                <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">-{item.product.discount}%</span>
              </>
            )}
          </div>

          {/* Stock warning */}
          {lowStock && (
            <p className="text-xs text-orange-500 font-semibold flex items-center gap-1">
              <AlertCircle size={11} /> Apenas {stock} em estoque
            </p>
          )}

          {/* Estimated delivery */}
          <p className="text-xs text-green-600 flex items-center gap-1">
            <Truck size={11} /> Entrega estimada: <span className="font-semibold">5–8 dias úteis</span>
          </p>

          {/* Bottom row: qty + actions + total */}
          <div className="flex items-center justify-between flex-wrap gap-3 mt-1">
            <div className="flex items-center gap-3">
              {/* Qty selector */}
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => onQty(item.cartId, -1)} disabled={item.qty <= 1} className="w-8 h-8 flex items-center justify-center hover:bg-[#F5F5F5] disabled:opacity-30 transition-colors">
                  <Minus size={13} />
                </button>
                <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                <button onClick={() => onQty(item.cartId, 1)} disabled={item.qty >= stock} className="w-8 h-8 flex items-center justify-center hover:bg-[#F5F5F5] disabled:opacity-30 transition-colors">
                  <Plus size={13} />
                </button>
              </div>

              {/* Save for later */}
              <button onClick={() => onSave(item.cartId)} className="text-xs text-gray-500 hover:text-[#121212] flex items-center gap-1 transition-colors font-medium">
                <Bookmark size={12} /> Salvar
              </button>

              {/* Wishlist */}
              <button onClick={() => onWishlist(item.product.id)} className={`text-xs flex items-center gap-1 transition-colors font-medium ${wishlist.has(item.product.id) ? "text-red-500" : "text-gray-500 hover:text-red-400"}`}>
                <Heart size={12} className={wishlist.has(item.product.id) ? "fill-red-500" : ""} /> Favoritar
              </button>
            </div>

            {/* Item total */}
            <span className="font-black text-[#121212] text-base">R$ {fmt(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SavedItemCard({ item, onMoveToCart, onRemove }: {
  item: CartItem;
  onMoveToCart: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 flex gap-3 border border-gray-100 shadow-sm">
      <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#F5F5F5] shrink-0">
        <img src={item.product.img.replace("w=700&h=900", "w=120&h=150")} alt={item.product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[#121212] text-sm leading-tight">{item.product.name}</h4>
        <p className="text-sm font-bold text-[#121212] mt-1">R$ {fmt(item.product.price)}</p>
        <p className="text-xs text-gray-400 mt-0.5">Tam {item.size} · {COLOR_LABELS[item.color] ?? item.color}</p>
        <div className="flex gap-2 mt-2">
          <button onClick={() => onMoveToCart(item.cartId)} className="flex-1 bg-[#FFD400] text-[#121212] font-bold text-xs py-1.5 rounded-lg hover:bg-yellow-300 transition-colors">
            Mover p/ carrinho
          </button>
          <button onClick={() => onRemove(item.cartId)} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ShoppingCartPage({
  cartItems, savedItems, wishlist,
  onQty, onRemove, onSave, onMoveToCart, onRemoveSaved,
  onWishlist, onSelectProduct, onGoHome, onAddProduct,
}: {
  cartItems: CartItem[];
  savedItems: CartItem[];
  wishlist: Set<number>;
  onQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onSave: (id: string) => void;
  onMoveToCart: (id: string) => void;
  onRemoveSaved: (id: string) => void;
  onWishlist: (id: number) => void;
  onSelectProduct: (p: Product) => void;
  onGoHome: () => void;
  onAddProduct: (p: Product) => void;
}) {
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState(false);
  const [cep, setCep] = useState("");
  const [shippingCalc, setShippingCalc] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<number>(0);
  const [summaryOpen, setSummaryOpen] = useState(false); // mobile accordion

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
  const originalTotal = cartItems.reduce((s, i) => s + i.product.originalPrice * i.qty, 0);
  const productDiscount = originalTotal - subtotal;
  const couponDiscount = appliedCoupon ? subtotal * (COUPONS[appliedCoupon] / 100) : 0;
  const shippingCost = shippingCalc ? [0, 14.90, 24.90][selectedShipping] : 0;
  const total = subtotal - couponDiscount + shippingCost;
  const pixTotal = total * 0.9;
  const itemCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const shippingOptions = [
    { label: "PAC", time: "5–8 dias úteis", price: 0 },
    { label: "SEDEX", time: "1–2 dias úteis", price: 14.90 },
    { label: "SEDEX 10", time: "Próximo dia útil", price: 24.90 },
  ];

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError(false);
    } else {
      setCouponError(true);
      setAppliedCoupon(null);
    }
  };

  const recommendations = PRODUCTS.filter(
    (p) => !cartItems.some((ci) => ci.product.id === p.id)
  ).slice(0, 5);

  // Empty state
  if (cartItems.length === 0 && savedItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-24 h-24 bg-[#F5F5F5] rounded-full flex items-center justify-center mb-6">
          <ShoppingCart size={40} className="text-gray-300" />
        </div>
        <h2 className="font-[Barlow_Condensed,sans-serif] text-4xl font-black uppercase text-[#121212] mb-3">
          Seu carrinho está vazio
        </h2>
        <p className="text-gray-500 max-w-sm mb-8">
          Explore nossa coleção e encontre a roupa perfeita para seu treino.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={onGoHome} className="flex items-center gap-2 bg-[#FFD400] text-[#121212] font-bold px-8 py-4 rounded-full hover:bg-yellow-300 transition-all">
            <ArrowRight size={17} /> Ver produtos
          </button>
          <button onClick={onGoHome} className="flex items-center gap-2 border-2 border-[#121212] text-[#121212] font-semibold px-8 py-4 rounded-full hover:bg-[#121212] hover:text-white transition-all">
            Best Sellers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-32 lg:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <button onClick={onGoHome} className="hover:text-[#FFD400] transition-colors">Home</button>
            <ChevronRight size={12} />
            <span className="text-[#121212] font-medium">Carrinho</span>
          </nav>
          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <h1 className="font-[Barlow_Condensed,sans-serif] text-4xl lg:text-5xl font-black uppercase text-[#121212]">
                Seu Carrinho
              </h1>
              <p className="text-gray-500 text-sm mt-1">Revise seus itens antes de finalizar a compra</p>
            </div>
            <span className="bg-[#FFD400] text-[#121212] font-bold text-sm px-4 py-1.5 rounded-full mb-0.5">
              {itemCount} {itemCount === 1 ? "item" : "itens"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 items-start">

          {/* ── LEFT COLUMN ──────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Cart items */}
            {cartItems.length > 0 ? (
              <div className="flex flex-col gap-3">
                {cartItems.map((item) => (
                  <CartItemCard
                    key={item.cartId}
                    item={item}
                    onQty={onQty}
                    onRemove={onRemove}
                    onSave={onSave}
                    onWishlist={onWishlist}
                    wishlist={wishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                <ShoppingCart size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Nenhum item no carrinho.</p>
                <button onClick={onGoHome} className="mt-4 text-sm text-[#FFD400] font-bold hover:underline">Continuar comprando →</button>
              </div>
            )}

            {/* Cart actions */}
            {cartItems.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                <button onClick={onGoHome} className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold px-5 py-2.5 rounded-full hover:border-[#121212] hover:text-[#121212] transition-all text-sm">
                  <ArrowRight size={15} className="rotate-180" /> Continuar comprando
                </button>
                <button onClick={() => cartItems.forEach((i) => onRemove(i.cartId))} className="flex items-center gap-2 border-2 border-red-200 text-red-500 font-semibold px-5 py-2.5 rounded-full hover:bg-red-50 transition-all text-sm">
                  <Trash2 size={14} /> Limpar carrinho
                </button>
              </div>
            )}

            {/* Coupon */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#FFD400] rounded-lg flex items-center justify-center shrink-0">
                  <Tag size={15} className="text-[#121212]" />
                </div>
                <h3 className="font-bold text-[#121212]">Cupom de desconto</h3>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-700">{appliedCoupon} aplicado!</p>
                      <p className="text-xs text-green-600">{COUPONS[appliedCoupon]}% de desconto</p>
                    </div>
                  </div>
                  <button onClick={() => { setAppliedCoupon(null); setCoupon(""); }} className="text-xs text-gray-500 hover:text-red-500 transition-colors font-medium">
                    Remover
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      value={coupon}
                      onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponError(false); }}
                      placeholder="Ex: CICERA10"
                      className={`flex-1 border-2 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${couponError ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-[#FFD400]"}`}
                    />
                    <button onClick={applyCoupon} className="bg-[#121212] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#2B2B2B] transition-colors text-sm whitespace-nowrap">
                      Aplicar
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                      <AlertCircle size={11} /> Cupom inválido ou expirado.
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">Tente: CICERA10 · FITNESS20 · PROMO15</p>
                </>
              )}
            </div>

            {/* Shipping calculator */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#FFD400] rounded-lg flex items-center justify-center shrink-0">
                  <Truck size={15} className="text-[#121212]" />
                </div>
                <h3 className="font-bold text-[#121212]">Calcular frete</h3>
              </div>
              <div className="flex gap-2 mb-3">
                <input
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2"))}
                  placeholder="00000-000"
                  maxLength={9}
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#FFD400] transition-colors"
                />
                <button onClick={() => setShippingCalc(true)} className="bg-[#121212] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#2B2B2B] transition-colors text-sm">
                  Calcular
                </button>
              </div>
              {shippingCalc && (
                <div className="flex flex-col gap-2">
                  {shippingOptions.map((opt, i) => (
                    <label key={opt.label} className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedShipping === i ? "border-[#FFD400] bg-[#FFD400]/5" : "border-gray-100 hover:border-gray-300"}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" checked={selectedShipping === i} onChange={() => setSelectedShipping(i)} className="accent-[#FFD400]" />
                        <div>
                          <p className="text-sm font-bold text-[#121212]">{opt.label}</p>
                          <p className="text-xs text-gray-500">{opt.time}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${opt.price === 0 ? "text-green-600" : "text-[#121212]"}`}>
                        {opt.price === 0 ? "Grátis" : `R$ ${fmt(opt.price)}`}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Saved for later */}
            {savedItems.length > 0 && (
              <div>
                <h3 className="font-[Barlow_Condensed,sans-serif] text-2xl font-black uppercase text-[#121212] mb-4">
                  Salvos para depois ({savedItems.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {savedItems.map((item) => (
                    <SavedItemCard key={item.cartId} item={item} onMoveToCart={onMoveToCart} onRemove={onRemoveSaved} />
                  ))}
                </div>
              </div>
            )}

            {/* Recommended */}
            <div>
              <h3 className="font-[Barlow_Condensed,sans-serif] text-2xl font-black uppercase text-[#121212] mb-4">
                Você também pode gostar
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                {recommendations.map((p) => (
                  <div key={p.id} className="group min-w-[160px] sm:min-w-[180px] shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all" onClick={() => onSelectProduct(p)}>
                    <div className="relative aspect-[3/4] bg-[#F5F5F5] overflow-hidden">
                      <img src={p.img.replace("w=700&h=900", "w=240&h=320")} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                      <button onClick={(e) => { e.stopPropagation(); onWishlist(p.id); }} className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                        <Heart size={12} className={wishlist.has(p.id) ? "fill-red-500 text-red-500" : "text-gray-400"} />
                      </button>
                    </div>
                    <div className="p-3">
                      <div className="flex gap-0.5 mb-1">{[1,2,3,4,5].map((s) => <Star key={s} size={10} className={s <= Math.round(p.rating) ? "fill-[#FFD400] text-[#FFD400]" : "fill-gray-100 text-gray-100"} />)}</div>
                      <p className="text-xs font-semibold text-[#121212] leading-tight line-clamp-2">{p.name}</p>
                      <p className="text-sm font-black text-[#121212] mt-1">R$ {fmt(p.price)}</p>
                      <button onClick={(e) => { e.stopPropagation(); onAddProduct(p); }} className="w-full mt-2 bg-[#FFD400] text-[#121212] font-bold text-xs py-2 rounded-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-1">
                        <Plus size={12} /> Adicionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Order Summary ───────────────────────────────── */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-4">
            {/* Mobile summary toggle */}
            <button onClick={() => setSummaryOpen((o) => !o)} className="lg:hidden flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
              <span className="font-bold text-[#121212]">Resumo do pedido</span>
              <div className="flex items-center gap-3">
                <span className="font-black text-lg text-[#121212]">R$ {fmt(total)}</span>
                {summaryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            {/* Summary card */}
            <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${!summaryOpen ? "hidden lg:block" : ""}`}>
              <div className="px-5 py-5 border-b border-gray-100">
                <h3 className="font-bold text-[#121212] text-lg">Resumo do pedido</h3>
              </div>

              <div className="px-5 py-4 flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({itemCount} {itemCount === 1 ? "item" : "itens"})</span>
                  <span className="font-semibold text-[#121212]">R$ {fmt(subtotal)}</span>
                </div>
                {productDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Desconto produtos</span>
                    <span className="font-semibold text-green-600">-R$ {fmt(productDiscount)}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><Tag size={11} /> Cupom {appliedCoupon}</span>
                    <span className="font-semibold text-green-600">-R$ {fmt(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Frete</span>
                  <span className={`font-semibold ${shippingCost === 0 && shippingCalc ? "text-green-600" : "text-[#121212]"}`}>
                    {!shippingCalc ? "Calcule acima" : shippingCost === 0 ? "Grátis" : `R$ ${fmt(shippingCost)}`}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-1">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-[#121212]">Total</span>
                    <div className="text-right">
                      <p className="font-black text-2xl text-[#121212]">R$ {fmt(total)}</p>
                      <p className="text-xs text-gray-500">{!appliedCoupon ? "ou " : ""}<span className="text-green-600 font-semibold">R$ {fmt(pixTotal)}</span> no PIX</p>
                    </div>
                  </div>
                </div>

                {/* Installment */}
                <div className="bg-[#F5F5F5] rounded-xl p-3 text-xs text-center text-gray-500">
                  ou em até <strong className="text-[#121212]">6x R$ {fmt(total / 6)}</strong> sem juros no cartão
                </div>
              </div>

              {/* Payment methods */}
              <div className="px-5 pb-4">
                <p className="text-xs text-gray-400 mb-2 font-medium">Formas de pagamento</p>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { label: "PIX", color: "bg-[#32BCAD] text-white" },
                    { label: "Visa", color: "bg-[#1A1F71] text-white" },
                    { label: "Master", color: "bg-[#EB001B] text-white" },
                    { label: "Boleto", color: "bg-gray-600 text-white" },
                    { label: "Amex", color: "bg-[#007BC1] text-white" },
                  ].map((m) => (
                    <span key={m.label} className={`text-[10px] font-bold px-2 py-1 rounded ${m.color}`}>{m.label}</span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="px-5 pb-5 flex flex-col gap-3">
                <button className="w-full flex items-center justify-center gap-2 bg-[#FFD400] text-[#121212] font-black py-4 rounded-xl hover:bg-yellow-300 transition-all active:scale-[0.98] text-base">
                  <Lock size={16} /> Finalizar Compra
                </button>
                <button onClick={onGoHome} className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:border-[#121212] hover:text-[#121212] transition-all text-sm">
                  <ArrowRight size={15} className="rotate-180" /> Continuar comprando
                </button>
                <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                  <ShieldCheck size={12} className="text-green-500" />
                  Compra 100% segura com pagamento criptografado
                </p>
              </div>

              {/* Trust */}
              <div className="border-t border-gray-100 px-5 py-4 grid grid-cols-2 gap-2">
                {[
                  { icon: ShieldCheck, text: "Pagamento seguro" },
                  { icon: Truck, text: "Entrega rápida" },
                  { icon: RefreshCw, text: "Troca em 30 dias" },
                  { icon: Award, text: "Qualidade garantida" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Icon size={12} className="text-[#FFD400] shrink-0" /> {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Promo gift box */}
            <div className="bg-[#121212] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFD400] rounded-xl flex items-center justify-center shrink-0">
                <Gift size={18} className="text-[#121212]" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Frete grátis acima de R$199!</p>
                {subtotal < 199 ? (
                  <p className="text-gray-400 text-xs">Faltam <span className="text-[#FFD400] font-semibold">R$ {fmt(199 - subtotal)}</span> para frete grátis</p>
                ) : (
                  <p className="text-green-400 text-xs font-semibold flex items-center gap-1"><Check size={11} /> Você ganhou frete grátis!</p>
                )}
              </div>
            </div>

            {/* Free shipping progress bar */}
            {subtotal < 199 && (
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-500">Progresso para frete grátis</span>
                  <span className="font-bold text-[#121212]">R$ {fmt(subtotal)} / R$ 199</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFD400] rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (subtotal / 199) * 100)}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-100 px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{itemCount} {itemCount === 1 ? "item" : "itens"}</span>
          <span className="font-black text-lg text-[#121212]">R$ {fmt(total)}</span>
        </div>
        <button className="w-full flex items-center justify-center gap-2 bg-[#FFD400] text-[#121212] font-black py-4 rounded-xl text-base">
          <Lock size={16} /> Finalizar Compra
        </button>
      </div>

      {/* WhatsApp */}
      <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="fixed bottom-24 right-6 z-40 lg:bottom-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-xl hover:bg-green-400 hover:scale-110 transition-all">
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>
    </div>
  );
}

// ─── Auth Page ────────────────────────────────────────────────────────────────

function PasswordStrengthItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 text-xs transition-colors ${ok ? "text-green-600" : "text-gray-400"}`}>
      <span className={`w-4 h-4 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${ok ? "border-green-500 bg-green-500" : "border-gray-300"}`}>
        {ok && <Check size={9} className="text-white" />}
      </span>
      {label}
    </li>
  );
}

function InputField({
  label, type = "text", value, onChange, placeholder, error, autoComplete, suffix,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; error?: string; autoComplete?: string; suffix?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-[#121212]">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition-all bg-white
            ${error ? "border-red-400 bg-red-50 focus:border-red-500" : "border-gray-200 focus:border-[#FFD400]"}
            ${suffix ? "pr-11" : ""}`}
        />
        {suffix && <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

function SocialBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all">
      {icon} {label}
    </button>
  );
}

function AuthPage({
  defaultTab = "login",
  onGoHome,
  onSuccess,
}: {
  defaultTab?: AuthTab;
  onGoHome: () => void;
  onSuccess: () => void;
}) {
  const [tab, setTab] = useState<AuthTab>(defaultTab);
  const [step, setStep] = useState<AuthStep>("form");
  const [forgotOpen, setForgotOpen] = useState(false);

  // login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginPwVisible, setLoginPwVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // register fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [regPw, setRegPw] = useState("");
  const [regPwConfirm, setRegPwConfirm] = useState("");
  const [regPwVisible, setRegPwVisible] = useState(false);
  const [regPwConfirmVisible, setRegPwConfirmVisible] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [terms, setTerms] = useState(false);
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  // forgot password modal
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => { setTab(defaultTab); }, [defaultTab]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  // Password strength checks
  const pwChecks = {
    length: regPw.length >= 8,
    upper: /[A-Z]/.test(regPw),
    lower: /[a-z]/.test(regPw),
    number: /\d/.test(regPw),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(regPw),
  };
  const pwStrength = Object.values(pwChecks).filter(Boolean).length;
  const pwStrengthLabel = ["", "Muito fraca", "Fraca", "Razoável", "Forte", "Muito forte"][pwStrength];
  const pwStrengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-500"][pwStrength];

  const validateLogin = () => {
    const errs: Record<string, string> = {};
    if (!loginEmail) errs.email = "Email obrigatório";
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) errs.email = "Email inválido";
    if (!loginPw) errs.password = "Senha obrigatória";
    else if (loginPw.length < 6) errs.password = "Senha incorreta";
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateRegister = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "Nome obrigatório";
    if (!lastName.trim()) errs.lastName = "Sobrenome obrigatório";
    if (!regEmail) errs.email = "Email obrigatório";
    else if (!/\S+@\S+\.\S+/.test(regEmail)) errs.email = "Email inválido";
    if (!regPw) errs.password = "Senha obrigatória";
    else if (pwStrength < 3) errs.password = "Senha muito fraca";
    if (regPwConfirm !== regPw) errs.confirm = "As senhas não coincidem";
    if (!terms) errs.terms = "Aceite os termos para continuar";
    setRegErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = () => {
    if (!validateLogin()) return;
    setStep("loading");
    setTimeout(() => setStep("success"), 1800);
  };

  const handleRegister = () => {
    if (!validateRegister()) return;
    setStep("loading");
    setTimeout(() => setStep("verify"), 1800);
  };

  const switchTab = (t: AuthTab) => {
    setTab(t);
    setLoginErrors({});
    setRegErrors({});
    setStep("form");
  };

  // ── Eye icon helper ──────────────────────────────────────────────────────
  const EyeBtn = ({ visible, onToggle }: { visible: boolean; onToggle: () => void }) => (
    <button type="button" onClick={onToggle} className="text-gray-400 hover:text-[#121212] transition-colors">
      {visible
        ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  );

  // ── Success screen ───────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[#FFD400] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-[#121212]" />
          </div>
          <h2 className="font-[Barlow_Condensed,sans-serif] text-4xl font-black uppercase text-[#121212] mb-3">
            Bem-vinda à Cicera!
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Sua conta foi criada com sucesso. Aproveite frete grátis e descontos exclusivos para membros.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={onGoHome} className="w-full bg-[#FFD400] text-[#121212] font-black py-4 rounded-xl hover:bg-yellow-300 transition-all flex items-center justify-center gap-2">
              <ArrowRight size={17} /> Continuar comprando
            </button>
            <button className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl hover:border-[#121212] transition-all">
              Ir para minha conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Email verification screen ────────────────────────────────────────────
  if (step === "verify") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={36} className="text-[#FFD400]" />
          </div>
          <h2 className="font-[Barlow_Condensed,sans-serif] text-3xl font-black uppercase text-[#121212] mb-3">
            Verifique seu e-mail
          </h2>
          <p className="text-gray-500 mb-2 leading-relaxed">
            Enviamos um link de confirmação para
          </p>
          <p className="font-bold text-[#121212] mb-8">{regEmail}</p>
          <div className="bg-[#F5F5F5] rounded-2xl p-4 mb-6 text-sm text-gray-500">
            Não recebeu? Verifique sua pasta de spam ou solicite um novo e-mail.
          </div>
          <div className="flex flex-col gap-3">
            <button className="w-full bg-[#FFD400] text-[#121212] font-black py-4 rounded-xl hover:bg-yellow-300 transition-all">
              Reenviar e-mail
            </button>
            <button onClick={() => setStep("form")} className="text-sm text-gray-500 hover:text-[#121212] transition-colors font-medium">
              Alterar e-mail de cadastro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* ── Left panel — desktop only ──────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1645810798586-08e892108d67?w=900&h=1200&fit=crop&auto=format"
          alt="Cicera Fitness lifestyle"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#121212]/90 via-[#121212]/70 to-[#FFD400]/30" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16">
          {/* Logo */}
          <button onClick={onGoHome} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#FFD400] rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-[#121212] fill-current" />
            </div>
            <span className="font-[Barlow_Condensed,sans-serif] text-3xl font-black uppercase text-white">
              Cicera<span className="text-[#FFD400]">.</span>
            </span>
          </button>

          {/* Hero copy */}
          <div>
            <span className="inline-flex items-center gap-2 text-[#FFD400] font-semibold text-sm uppercase tracking-widest mb-5">
              <span className="w-6 h-0.5 bg-[#FFD400]" /> Bem-vinda de volta
            </span>
            <h2 className="font-[Barlow_Condensed,sans-serif] text-5xl xl:text-6xl font-black uppercase text-white leading-none mb-5">
              Vista sua<br /><span className="text-[#FFD400]">melhor</span><br />versão.
            </h2>
            <p className="text-gray-300 text-base leading-relaxed max-w-sm">
              Descubra roupas fitness premium desenvolvidas para conforto, confiança e alta performance.
            </p>

            {/* Social proof */}
            <div className="flex gap-6 mt-10 pt-8 border-t border-white/10">
              {[["18k+", "Clientes"], ["4.9★", "Avaliação"], ["30d", "Troca grátis"]].map(([n, l]) => (
                <div key={l}>
                  <p className="text-[#FFD400] font-black text-xl leading-none">{n}</p>
                  <p className="text-gray-400 text-xs mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom trust */}
          <div className="flex flex-wrap gap-3">
            {["🔒 Compra segura", "🚚 Entrega rápida", "🔄 Troca grátis"].map((t) => (
              <span key={t} className="text-xs text-white/70 bg-white/10 px-3 py-1.5 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — auth card ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-start lg:justify-center overflow-y-auto py-8 px-4 sm:px-8">
        {/* Mobile logo */}
        <button onClick={onGoHome} className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#FFD400] rounded-lg flex items-center justify-center">
            <Zap size={15} className="text-[#121212] fill-current" />
          </div>
          <span className="font-[Barlow_Condensed,sans-serif] text-2xl font-black uppercase text-[#121212]">
            Cicera<span className="text-[#FFD400]">.</span>
          </span>
        </button>

        <div className="w-full max-w-[440px]">
          {/* Tab switcher */}
          <div className="bg-[#F5F5F5] rounded-2xl p-1 flex mb-8">
            {(["login", "register"] as AuthTab[]).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  tab === t ? "bg-white text-[#121212] shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          {/* ── LOGIN FORM ────────────────────────────────────────────── */}
          {tab === "login" && step === "form" && (
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="font-[Barlow_Condensed,sans-serif] text-4xl font-black uppercase text-[#121212]">
                  Entrar
                </h1>
                <p className="text-gray-500 text-sm mt-1">Acesse sua conta Cicera Fitness</p>
              </div>

              <div className="flex flex-col gap-4">
                <InputField
                  label="E-mail"
                  type="email"
                  value={loginEmail}
                  onChange={setLoginEmail}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  error={loginErrors.email}
                />
                <InputField
                  label="Senha"
                  type={loginPwVisible ? "text" : "password"}
                  value={loginPw}
                  onChange={setLoginPw}
                  placeholder="Sua senha"
                  autoComplete="current-password"
                  error={loginErrors.password}
                  suffix={<EyeBtn visible={loginPwVisible} onToggle={() => setLoginPwVisible((v) => !v)} />}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setRememberMe((v) => !v)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${rememberMe ? "bg-[#FFD400] border-[#FFD400]" : "border-gray-300 hover:border-[#FFD400]"}`}
                  >
                    {rememberMe && <Check size={11} className="text-[#121212]" />}
                  </div>
                  <span className="text-sm text-gray-600">Lembrar de mim</span>
                </label>
                <button onClick={() => setForgotOpen(true)} className="text-sm text-[#121212] font-semibold hover:text-[#FFD400] transition-colors underline underline-offset-2">
                  Esqueci a senha
                </button>
              </div>

              <button onClick={handleLogin} className="w-full bg-[#FFD400] text-[#121212] font-black py-4 rounded-xl hover:bg-yellow-300 transition-all active:scale-[0.98] text-base flex items-center justify-center gap-2">
                Entrar na minha conta <ArrowRight size={17} />
              </button>

              <div className="flex items-center gap-3">
                <span className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">ou continue com</span>
                <span className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="flex gap-3">
                <SocialBtn icon={<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>} label="Google" />
                <SocialBtn icon={<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>} label="Facebook" />
                <SocialBtn icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.453 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>} label="Apple" />
              </div>

              <p className="text-center text-sm text-gray-500">
                Não tem conta?{" "}
                <button onClick={() => switchTab("register")} className="font-bold text-[#121212] hover:text-[#FFD400] transition-colors underline underline-offset-2">
                  Criar conta grátis
                </button>
              </p>
            </div>
          )}

          {/* ── REGISTER FORM ─────────────────────────────────────────── */}
          {tab === "register" && step === "form" && (
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="font-[Barlow_Condensed,sans-serif] text-4xl font-black uppercase text-[#121212]">
                  Criar conta
                </h1>
                <p className="text-gray-500 text-sm mt-1">Junte-se a mais de 18 mil clientes</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Nome" value={firstName} onChange={setFirstName} placeholder="Ana" error={regErrors.firstName} />
                  <InputField label="Sobrenome" value={lastName} onChange={setLastName} placeholder="Silva" error={regErrors.lastName} />
                </div>
                <InputField label="E-mail" type="email" value={regEmail} onChange={setRegEmail} placeholder="seu@email.com" autoComplete="email" error={regErrors.email} />
                <InputField
                  label="Telefone"
                  type="tel"
                  value={phone}
                  onChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"))}
                  placeholder="(11) 99999-9999"
                />
                <div className="flex flex-col gap-1">
                  <InputField
                    label="Senha"
                    type={regPwVisible ? "text" : "password"}
                    value={regPw}
                    onChange={setRegPw}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    error={regErrors.password}
                    suffix={<EyeBtn visible={regPwVisible} onToggle={() => setRegPwVisible((v) => !v)} />}
                  />
                  {/* Strength bar */}
                  {regPw.length > 0 && (
                    <div className="mt-1">
                      <div className="flex gap-1 mb-1.5">
                        {[1,2,3,4,5].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength ? pwStrengthColor : "bg-gray-200"}`} />
                        ))}
                      </div>
                      <p className={`text-xs font-semibold ${["","text-red-500","text-orange-500","text-yellow-600","text-green-500","text-green-600"][pwStrength]}`}>
                        {pwStrengthLabel}
                      </p>
                      <ul className="mt-2 space-y-1">
                        <PasswordStrengthItem ok={pwChecks.length} label="Mínimo 8 caracteres" />
                        <PasswordStrengthItem ok={pwChecks.upper} label="Letra maiúscula" />
                        <PasswordStrengthItem ok={pwChecks.lower} label="Letra minúscula" />
                        <PasswordStrengthItem ok={pwChecks.number} label="Número" />
                        <PasswordStrengthItem ok={pwChecks.special} label="Caractere especial (!@#$...)" />
                      </ul>
                    </div>
                  )}
                </div>
                <InputField
                  label="Confirmar senha"
                  type={regPwConfirmVisible ? "text" : "password"}
                  value={regPwConfirm}
                  onChange={setRegPwConfirm}
                  placeholder="Repita sua senha"
                  autoComplete="new-password"
                  error={regErrors.confirm}
                  suffix={<EyeBtn visible={regPwConfirmVisible} onToggle={() => setRegPwConfirmVisible((v) => !v)} />}
                />
                {regPwConfirm && regPwConfirm === regPw && (
                  <p className="text-xs text-green-600 flex items-center gap-1 -mt-2">
                    <Check size={11} /> Senhas coincidem
                  </p>
                )}
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col gap-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div onClick={() => setNewsletter((v) => !v)} className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${newsletter ? "bg-[#FFD400] border-[#FFD400]" : "border-gray-300 hover:border-[#FFD400]"}`}>
                    {newsletter && <Check size={11} className="text-[#121212]" />}
                  </div>
                  <span className="text-sm text-gray-600 leading-tight">Quero receber novidades, promoções e ofertas exclusivas por e-mail</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <div onClick={() => setTerms((v) => !v)} className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${terms ? "bg-[#FFD400] border-[#FFD400]" : regErrors.terms ? "border-red-400" : "border-gray-300 hover:border-[#FFD400]"}`}>
                    {terms && <Check size={11} className="text-[#121212]" />}
                  </div>
                  <span className="text-sm text-gray-600 leading-tight">
                    Li e aceito os{" "}
                    <a href="#" className="font-semibold text-[#121212] underline underline-offset-2 hover:text-[#FFD400] transition-colors">Termos de Uso</a>
                    {" "}e a{" "}
                    <a href="#" className="font-semibold text-[#121212] underline underline-offset-2 hover:text-[#FFD400] transition-colors">Política de Privacidade</a>
                  </span>
                </label>
                {regErrors.terms && <p className="text-xs text-red-500 flex items-center gap-1 -mt-1"><AlertCircle size={11} /> {regErrors.terms}</p>}
              </div>

              <button onClick={handleRegister} className="w-full bg-[#FFD400] text-[#121212] font-black py-4 rounded-xl hover:bg-yellow-300 transition-all active:scale-[0.98] text-base flex items-center justify-center gap-2">
                Criar minha conta <ArrowRight size={17} />
              </button>

              <div className="flex items-center gap-3">
                <span className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">ou continue com</span>
                <span className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="flex gap-3">
                <SocialBtn icon={<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>} label="Google" />
                <SocialBtn icon={<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>} label="Facebook" />
                <SocialBtn icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.453 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>} label="Apple" />
              </div>

              <p className="text-center text-sm text-gray-500">
                Já tem conta?{" "}
                <button onClick={() => switchTab("login")} className="font-bold text-[#121212] hover:text-[#FFD400] transition-colors underline underline-offset-2">
                  Entrar
                </button>
              </p>
            </div>
          )}

          {/* ── LOADING STATE ─────────────────────────────────────────── */}
          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <div className="w-16 h-16 border-4 border-[#F5F5F5] border-t-[#FFD400] rounded-full animate-spin" />
              <p className="font-semibold text-[#121212]">
                {tab === "login" ? "Autenticando..." : "Criando sua conta..."}
              </p>
              <p className="text-sm text-gray-400">Aguarde um momento</p>
            </div>
          )}

          {/* Trust bar */}
          {step === "form" && (
            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-2">
              {[
                { icon: <Lock size={13} className="text-[#FFD400]" />, text: "Login criptografado" },
                { icon: <ShieldCheck size={13} className="text-[#FFD400]" />, text: "Autenticação segura" },
                { icon: <User size={13} className="text-[#FFD400]" />, text: "Privacidade protegida" },
                { icon: <Zap size={13} className="text-[#FFD400]" />, text: "Loja oficial" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-gray-500">
                  {icon} {text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Forgot Password Modal ──────────────────────────────────────────── */}
      {forgotOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setForgotOpen(false); setForgotSent(false); setForgotEmail(""); }} />
          <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl p-8">
            <button onClick={() => { setForgotOpen(false); setForgotSent(false); setForgotEmail(""); }} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-gray-200 transition-colors">
              <X size={15} />
            </button>

            {forgotSent ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FFD400] rounded-full flex items-center justify-center mx-auto mb-5">
                  <Check size={28} className="text-[#121212]" />
                </div>
                <h3 className="font-[Barlow_Condensed,sans-serif] text-2xl font-black uppercase text-[#121212] mb-2">E-mail enviado!</h3>
                <p className="text-gray-500 text-sm mb-6">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
                <button onClick={() => { setForgotOpen(false); setForgotSent(false); setForgotEmail(""); }} className="w-full bg-[#FFD400] text-[#121212] font-bold py-3.5 rounded-xl hover:bg-yellow-300 transition-all">
                  Fechar
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center mb-5">
                  <Lock size={22} className="text-[#FFD400]" />
                </div>
                <h3 className="font-[Barlow_Condensed,sans-serif] text-2xl font-black uppercase text-[#121212] mb-1">Esqueceu a senha?</h3>
                <p className="text-gray-500 text-sm mb-6">Digite seu e-mail e enviaremos um link para redefinir sua senha.</p>
                <div className="flex flex-col gap-4">
                  <InputField
                    label="E-mail cadastrado"
                    type="email"
                    value={forgotEmail}
                    onChange={setForgotEmail}
                    placeholder="seu@email.com"
                  />
                  <button
                    onClick={() => forgotEmail && setForgotSent(true)}
                    disabled={!forgotEmail}
                    className="w-full bg-[#FFD400] text-[#121212] font-bold py-3.5 rounded-xl hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <Mail size={15} /> Enviar link de recuperação
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── User Profile Page ────────────────────────────────────────────────────────

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${on ? "bg-[#FFD400]" : "bg-gray-200"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function StatCard({ label, value, sub, icon }: { label: string; value: string | number; sub?: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col gap-2 border border-gray-100 shadow-sm">
      <div className="w-9 h-9 bg-[#FFD400] rounded-xl flex items-center justify-center">{icon}</div>
      <p className="font-[Barlow_Condensed,sans-serif] text-2xl font-black text-[#121212] leading-none">{value}</p>
      <div>
        <p className="text-xs font-semibold text-gray-700">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-[Barlow_Condensed,sans-serif] text-3xl font-black uppercase text-[#121212]">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function UserProfilePage({ onGoHome, wishlistSize }: { onGoHome: () => void; wishlistSize: number }) {
  const [section, setSection] = useState<ProfileSection>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // personal info form
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...MOCK_USER });
  const [savedMsg, setSavedMsg] = useState(false);

  // addresses
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [addingAddress, setAddingAddress] = useState(false);

  // payments
  const [payments, setPayments] = useState(MOCK_PAYMENTS);

  // notifications
  const [notifs, setNotifs] = useState({
    emailPromos: true, orderUpdates: true, shipping: true,
    newCollection: false, discounts: true, newsletter: true, recommendations: false,
  });

  // security
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurPw, setShowCurPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  // coupon copy
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const copyCoupon = (code: string) => { setCopiedCoupon(code); setTimeout(() => setCopiedCoupon(null), 2000); };

  // avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const pwStrength = [/[A-Z]/.test(newPw), /[a-z]/.test(newPw), /\d/.test(newPw), newPw.length >= 8, /[!@#$%^&*]/.test(newPw)].filter(Boolean).length;

  const navItems: { key: ProfileSection; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Minha Conta", icon: <User size={16} /> },
    { key: "orders", label: "Meus Pedidos", icon: <Package size={16} /> },
    { key: "wishlist", label: "Lista de Desejos", icon: <Heart size={16} /> },
    { key: "addresses", label: "Endereços", icon: <MapPin size={16} /> },
    { key: "payments", label: "Pagamentos", icon: <CreditCard size={16} /> },
    { key: "notifications", label: "Notificações", icon: <Bell size={16} /> },
    { key: "security", label: "Privacidade e Segurança", icon: <ShieldCheck size={16} /> },
    { key: "support", label: "Suporte", icon: <Headphones size={16} /> },
  ];

  const savePersonalInfo = () => { setSavedMsg(true); setEditMode(false); setTimeout(() => setSavedMsg(false), 3000); };

  const EyeToggle = ({ v, set }: { v: boolean; set: (x: boolean) => void }) => (
    <button type="button" onClick={() => set(!v)} className="text-gray-400 hover:text-gray-700 transition-colors">
      {v
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  );

  // ── Section renderers ─────────────────────────────────────────────────────

  const renderOverview = () => (
    <div className="flex flex-col gap-6">
      {/* Profile card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-[#FFD400] flex items-center justify-center text-[#121212] font-black text-3xl overflow-hidden">
              {avatarPreview ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" /> : "A"}
            </div>
            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#121212] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#2B2B2B] transition-colors shadow-md">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = (ev) => setAvatarPreview(ev.target?.result as string); r.readAsDataURL(f); } }} />
            </label>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-[#121212] text-xl">{formData.firstName} {formData.lastName}</h3>
              <span className="bg-[#FFD400] text-[#121212] text-xs font-bold px-2.5 py-0.5 rounded-full">⭐ {MOCK_USER.loyalty}</span>
            </div>
            <p className="text-gray-500 text-sm mt-0.5">{formData.email}</p>
            <p className="text-gray-500 text-sm">{formData.phone}</p>
            <p className="text-xs text-gray-400 mt-1">Membro desde {MOCK_USER.memberSince}</p>
          </div>
          <button onClick={() => setEditMode(true)} className="flex items-center gap-2 border-2 border-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl hover:border-[#121212] transition-all text-sm shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar perfil
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Pedidos" value={12} sub="concluídos" icon={<Package size={16} className="text-[#121212]" />} />
        <StatCard label="Favoritos" value={wishlistSize || 5} sub="produtos" icon={<Heart size={16} className="text-[#121212]" />} />
        <StatCard label="Cupons" value={2} sub="disponíveis" icon={<Tag size={16} className="text-[#121212]" />} />
        <StatCard label="Pontos" value="1.240" sub="fidelidade" icon={<Star size={16} className="text-[#121212]" />} />
        <StatCard label="Economizou" value="R$347" sub="em descontos" icon={<Zap size={16} className="text-[#121212]" />} />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-bold text-[#121212] mb-4">Ações rápidas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Meus Pedidos", icon: <Package size={18} />, action: () => setSection("orders") },
            { label: "Lista de Desejos", icon: <Heart size={18} />, action: () => setSection("wishlist") },
            { label: "Continuar Comprando", icon: <ShoppingCart size={18} />, action: onGoHome },
            { label: "Rastrear Entrega", icon: <Truck size={18} />, action: () => setSection("orders") },
            { label: "Meus Cupons", icon: <Tag size={18} />, action: () => {} },
            { label: "Suporte", icon: <Headphones size={18} />, action: () => setSection("support") },
          ].map(({ label, icon, action }) => (
            <button key={label} onClick={action} className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-[#FFD400] hover:shadow-md transition-all group text-left">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-[#FFD400] group-hover:text-[#121212] transition-all shrink-0">{icon}</div>
              <span className="font-semibold text-[#121212] text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Coupons */}
      <div>
        <h3 className="font-bold text-[#121212] mb-4">Seus cupons</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {MOCK_COUPONS.map((c) => (
            <div key={c.code} className="bg-white rounded-2xl p-4 border-2 border-dashed border-[#FFD400] flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-[Barlow_Condensed,sans-serif] text-xl font-black text-[#121212]">{c.code}</span>
                  <span className="bg-[#FFD400] text-[#121212] text-xs font-bold px-2 py-0.5 rounded-full">{c.discount}</span>
                </div>
                <p className="text-xs text-gray-500">{c.desc}</p>
                <p className="text-xs text-gray-400 mt-0.5">Válido até {c.expiry}</p>
              </div>
              <button onClick={() => copyCoupon(c.code)} className={`shrink-0 flex items-center gap-1.5 font-bold text-xs px-3 py-2 rounded-xl transition-all ${copiedCoupon === c.code ? "bg-green-100 text-green-600" : "bg-[#F5F5F5] text-[#121212] hover:bg-[#FFD400]"}`}>
                {copiedCoupon === c.code ? <><Check size={12} />Copiado!</> : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copiar</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[#121212] text-lg">Informações pessoais</h3>
        {!editMode && (
          <button onClick={() => setEditMode(true)} className="flex items-center gap-2 text-sm font-semibold text-[#121212] border-2 border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#FFD400] transition-all">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar
          </button>
        )}
      </div>
      {savedMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-green-700 text-sm font-semibold">
          <Check size={15} /> Informações salvas com sucesso!
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { label: "Nome", key: "firstName", placeholder: "Seu nome" },
          { label: "Sobrenome", key: "lastName", placeholder: "Seu sobrenome" },
          { label: "CPF", key: "cpf", placeholder: "000.000.000-00" },
          { label: "E-mail", key: "email", placeholder: "seu@email.com" },
          { label: "Telefone", key: "phone", placeholder: "(11) 99999-9999" },
          { label: "Data de nascimento", key: "dob", placeholder: "DD/MM/AAAA" },
        ].map(({ label, key, placeholder }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-[#121212]">{label}</label>
            <input
              value={formData[key as keyof typeof formData] ?? ""}
              onChange={(e) => setFormData((d) => ({ ...d, [key]: e.target.value }))}
              placeholder={placeholder}
              disabled={!editMode}
              className={`border-2 rounded-xl px-4 py-3 text-sm outline-none transition-all ${editMode ? "border-gray-200 focus:border-[#FFD400] bg-white" : "border-gray-100 bg-gray-50 text-gray-600 cursor-not-allowed"}`}
            />
          </div>
        ))}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-[#121212]">Gênero (opcional)</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData((d) => ({ ...d, gender: e.target.value }))}
            disabled={!editMode}
            className={`border-2 rounded-xl px-4 py-3 text-sm outline-none transition-all ${editMode ? "border-gray-200 focus:border-[#FFD400] bg-white" : "border-gray-100 bg-gray-50 text-gray-600 cursor-not-allowed"}`}
          >
            <option>Feminino</option><option>Masculino</option><option>Não-binário</option><option>Prefiro não informar</option>
          </select>
        </div>
      </div>
      {editMode && (
        <div className="flex gap-3 mt-6 flex-wrap">
          <button onClick={savePersonalInfo} className="flex items-center gap-2 bg-[#FFD400] text-[#121212] font-black px-6 py-3 rounded-xl hover:bg-yellow-300 transition-all">
            <Check size={15} /> Salvar alterações
          </button>
          <button onClick={() => { setEditMode(false); setFormData({ ...MOCK_USER }); }} className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold px-6 py-3 rounded-xl hover:border-gray-400 transition-all">
            <X size={15} /> Cancelar
          </button>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="flex flex-col gap-4">
      {MOCK_ORDERS.map((o) => {
        const statusColor: Record<string, string> = {
          "Entregue": "bg-green-100 text-green-700",
          "Em trânsito": "bg-blue-100 text-blue-700",
          "Cancelado": "bg-red-100 text-red-600",
        };
        return (
          <div key={o.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-4 items-center flex-wrap sm:flex-nowrap">
            <img src={o.img} alt="Produto" className="w-16 h-16 rounded-xl object-cover shrink-0 bg-gray-100" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-[#121212]">{o.id}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor[o.status] ?? "bg-gray-100 text-gray-600"}`}>{o.status}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{o.date} · {o.items} {o.items === 1 ? "item" : "itens"}</p>
              <p className="font-bold text-[#121212] mt-1">R$ {fmt(o.total)}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button className="text-xs font-semibold border-2 border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#121212] transition-all flex items-center gap-1"><Package size={12} /> Detalhes</button>
              {o.status === "Em trânsito" && <button className="text-xs font-semibold bg-[#FFD400] text-[#121212] px-3 py-1.5 rounded-lg hover:bg-yellow-300 transition-all flex items-center gap-1"><Truck size={12} /> Rastrear</button>}
              {o.status === "Entregue" && <button className="text-xs font-semibold border-2 border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#121212] transition-all flex items-center gap-1"><RefreshCw size={12} /> Recomprar</button>}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderWishlist = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {PRODUCTS.slice(0, 6).map((p) => (
        <div key={p.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="relative aspect-[3/4] bg-[#F5F5F5] overflow-hidden">
            <img src={p.img.replace("w=700&h=900", "w=300&h=400")} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
            <button className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
              <Heart size={13} className="fill-red-500 text-red-500" />
            </button>
          </div>
          <div className="p-3">
            <p className="text-xs font-semibold text-[#121212] leading-tight line-clamp-1">{p.name}</p>
            <p className="font-black text-[#121212] mt-1">R$ {fmt(p.price)}</p>
            <button onClick={onGoHome} className="w-full mt-2 bg-[#121212] text-white font-bold text-xs py-2 rounded-lg hover:bg-[#2B2B2B] transition-colors">
              Ver produto
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAddresses = () => (
    <div className="flex flex-col gap-4">
      {addresses.map((addr) => (
        <div key={addr.id} className={`bg-white rounded-2xl p-5 border-2 shadow-sm ${addr.isDefault ? "border-[#FFD400]" : "border-gray-100"}`}>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-[#121212]">{addr.nickname}</p>
                {addr.isDefault && <span className="text-[10px] bg-[#FFD400] text-[#121212] font-bold px-2 py-0.5 rounded-full">Padrão</span>}
              </div>
              <p className="text-sm text-gray-600">{addr.name}</p>
              <p className="text-sm text-gray-600">{addr.street}</p>
              <p className="text-sm text-gray-600">{addr.city}, {addr.state} · {addr.zip}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {!addr.isDefault && (
                <button onClick={() => setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === addr.id })))} className="text-xs font-semibold border-2 border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#FFD400] transition-all">
                  Definir padrão
                </button>
              )}
              <button className="text-xs font-semibold border-2 border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#121212] transition-all">Editar</button>
              <button onClick={() => setAddresses((prev) => prev.filter((a) => a.id !== addr.id))} className="text-xs font-semibold border-2 border-red-100 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </div>
      ))}
      {addresses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <MapPin size={36} className="text-gray-200 mx-auto mb-3" />
          <p className="font-semibold text-gray-500">Nenhum endereço salvo</p>
          <p className="text-xs text-gray-400 mt-1">Adicione um endereço para agilizar suas compras</p>
        </div>
      )}
      <button onClick={() => setAddingAddress(true)} className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 text-gray-600 font-semibold py-4 rounded-2xl hover:border-[#FFD400] hover:text-[#121212] transition-all">
        <Plus size={16} /> Adicionar endereço
      </button>
      {addingAddress && (
        <div className="bg-white rounded-2xl p-5 border-2 border-[#FFD400] shadow-sm">
          <h4 className="font-bold text-[#121212] mb-4">Novo endereço</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {["Apelido (ex: Casa)", "Nome do destinatário", "Endereço completo", "Cidade", "Estado", "CEP"].map((pl) => (
              <input key={pl} placeholder={pl} className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FFD400] transition-colors" />
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setAddingAddress(false)} className="flex-1 bg-[#FFD400] text-[#121212] font-bold py-3 rounded-xl hover:bg-yellow-300 transition-all text-sm">Salvar endereço</button>
            <button onClick={() => setAddingAddress(false)} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:border-gray-400 transition-all text-sm">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderPayments = () => (
    <div className="flex flex-col gap-4">
      {payments.map((pm) => (
        <div key={pm.id} className={`bg-white rounded-2xl p-5 border-2 shadow-sm flex items-center gap-4 flex-wrap sm:flex-nowrap ${pm.isDefault ? "border-[#FFD400]" : "border-gray-100"}`}>
          <div className="w-12 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: pm.color + "20", border: `2px solid ${pm.color}40` }}>
            <span className="text-xs font-black" style={{ color: pm.color }}>{pm.type === "PIX" ? "PIX" : pm.type[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-[#121212]">{pm.type}{pm.last4 ? ` ···· ${pm.last4}` : ""}</p>
              {pm.isDefault && <span className="text-[10px] bg-[#FFD400] text-[#121212] font-bold px-2 py-0.5 rounded-full">Padrão</span>}
            </div>
            {pm.expiry && <p className="text-xs text-gray-400 mt-0.5">Válido até {pm.expiry}</p>}
            {pm.type === "PIX" && <p className="text-xs text-gray-400 mt-0.5">Pagamento instantâneo</p>}
          </div>
          <div className="flex gap-2 flex-wrap">
            {!pm.isDefault && <button onClick={() => setPayments((prev) => prev.map((p) => ({ ...p, isDefault: p.id === pm.id })))} className="text-xs font-semibold border-2 border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#FFD400] transition-all">Padrão</button>}
            <button onClick={() => setPayments((prev) => prev.filter((p) => p.id !== pm.id))} className="text-xs font-semibold border-2 border-red-100 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"><Trash2 size={12} /></button>
          </div>
        </div>
      ))}
      <button className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 text-gray-600 font-semibold py-4 rounded-2xl hover:border-[#FFD400] hover:text-[#121212] transition-all">
        <Plus size={16} /> Adicionar forma de pagamento
      </button>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {[
        { key: "emailPromos", label: "Promoções por e-mail", desc: "Receba ofertas e descontos exclusivos" },
        { key: "orderUpdates", label: "Atualizações de pedidos", desc: "Confirmações e status dos seus pedidos" },
        { key: "shipping", label: "Notificações de entrega", desc: "Alertas de envio e entrega" },
        { key: "newCollection", label: "Novas coleções", desc: "Seja a primeira a saber sobre lançamentos" },
        { key: "discounts", label: "Alertas de desconto", desc: "Quando produtos da sua lista entrarem em promoção" },
        { key: "newsletter", label: "Newsletter", desc: "Conteúdo de moda fitness e lifestyle" },
        { key: "recommendations", label: "Recomendações personalizadas", desc: "Produtos baseados no seu histórico" },
      ].map(({ key, label, desc }, i, arr) => (
        <div key={key} className={`flex items-center justify-between px-5 py-4 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
          <div>
            <p className="font-semibold text-[#121212] text-sm">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
          </div>
          <Toggle on={notifs[key as keyof typeof notifs]} onToggle={() => setNotifs((n) => ({ ...n, [key]: !n[key as keyof typeof notifs] }))} />
        </div>
      ))}
    </div>
  );

  const renderSecurity = () => (
    <div className="flex flex-col gap-5">
      {/* Security status */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-[#121212] mb-4">Status de segurança</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "E-mail verificado", ok: true, value: formData.email },
            { label: "Telefone verificado", ok: true, value: formData.phone },
            { label: "Força da senha", ok: true, value: "Forte" },
            { label: "Autenticação em 2 fatores", ok: twoFA, value: twoFA ? "Ativada" : "Desativada" },
            { label: "Último acesso", ok: true, value: "Hoje, 14h32" },
            { label: "Sessões ativas", ok: true, value: "2 dispositivos" },
          ].map(({ label, ok, value }) => (
            <div key={label} className="flex items-center gap-3 bg-[#F5F5F5] rounded-xl p-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${ok ? "bg-green-100" : "bg-red-100"}`}>
                {ok ? <Check size={13} className="text-green-600" /> : <AlertCircle size={13} className="text-red-500" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-semibold text-[#121212] truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-[#121212] mb-4">Alterar senha</h3>
        {pwSaved && <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-green-700 text-sm font-semibold"><Check size={14} /> Senha alterada com sucesso!</div>}
        <div className="flex flex-col gap-3 max-w-md">
          {[
            { label: "Senha atual", val: curPw, set: setCurPw, vis: showCurPw, setVis: setShowCurPw },
            { label: "Nova senha", val: newPw, set: setNewPw, vis: showNewPw, setVis: setShowNewPw },
            { label: "Confirmar nova senha", val: confirmPw, set: setConfirmPw, vis: showNewPw, setVis: setShowNewPw },
          ].map(({ label, val, set, vis, setVis }) => (
            <div key={label} className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#121212]">{label}</label>
              <div className="relative">
                <input type={vis ? "text" : "password"} value={val} onChange={(e) => set(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:border-[#FFD400] transition-colors" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2"><EyeToggle v={vis} set={setVis} /></div>
              </div>
            </div>
          ))}
          {newPw.length > 0 && (
            <div>
              <div className="flex gap-1 mb-1">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength ? ["","bg-red-400","bg-orange-400","bg-yellow-400","bg-green-400","bg-green-500"][pwStrength] : "bg-gray-200"}`} />
                ))}
              </div>
            </div>
          )}
          <button onClick={() => { setPwSaved(true); setCurPw(""); setNewPw(""); setConfirmPw(""); setTimeout(() => setPwSaved(false), 3000); }} className="bg-[#FFD400] text-[#121212] font-black py-3 rounded-xl hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 text-sm mt-1">
            <ShieldCheck size={15} /> Salvar nova senha
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-bold text-[#121212]">Autenticação em 2 fatores</h3>
          <p className="text-sm text-gray-500 mt-0.5">Adiciona uma camada extra de segurança à sua conta</p>
          <span className={`text-xs font-bold mt-1 inline-block ${twoFA ? "text-green-600" : "text-gray-400"}`}>{twoFA ? "✓ Ativada" : "Desativada"}</span>
        </div>
        <Toggle on={twoFA} onToggle={() => setTwoFA((v) => !v)} />
      </div>

      {/* Danger zone */}
      <div className="bg-red-50 rounded-2xl border-2 border-red-100 p-5">
        <h3 className="font-bold text-red-600 mb-1">Zona de perigo</h3>
        <p className="text-sm text-red-400 mb-4">Esta ação é permanente e não pode ser desfeita.</p>
        <button onClick={() => setDeleteModal(true)} className="flex items-center gap-2 border-2 border-red-400 text-red-600 font-bold px-5 py-2.5 rounded-xl hover:bg-red-100 transition-all text-sm">
          <Trash2 size={14} /> Excluir minha conta
        </button>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: "❓", label: "Central de Ajuda", desc: "Respostas para as dúvidas mais frequentes", action: "Acessar FAQ" },
          { icon: "💬", label: "Chat ao Vivo", desc: "Converse com nossa equipe em tempo real", action: "Iniciar chat" },
          { icon: "📞", label: "Falar no WhatsApp", desc: "(11) 99999-9999 · Seg–Sex 9h–18h", action: "Abrir WhatsApp" },
          { icon: "✉️", label: "Enviar E-mail", desc: "contato@cicerafitness.com.br", action: "Enviar mensagem" },
          { icon: "🔄", label: "Devoluções e Trocas", desc: "Saiba como trocar ou devolver produtos", action: "Ver política" },
          { icon: "🚚", label: "Informações de Entrega", desc: "Prazos, regiões e formas de envio", action: "Ver fretes" },
        ].map(({ icon, label, desc, action }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-4 items-start hover:border-[#FFD400] transition-all group cursor-pointer">
            <span className="text-2xl shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#121212] text-sm">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">{desc}</p>
              <p className="text-xs font-semibold text-[#FFD400] mt-2 group-hover:underline">{action} →</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const sectionContent: Record<ProfileSection, React.ReactNode> = {
    overview: renderOverview(),
    orders: renderOrders(),
    wishlist: renderWishlist(),
    addresses: renderAddresses(),
    payments: renderPayments(),
    notifications: renderNotifications(),
    security: renderSecurity(),
    support: renderSupport(),
  };

  const sectionTitles: Record<ProfileSection, [string, string]> = {
    overview: ["Minha Conta", "Gerencie suas informações e preferências"],
    orders: ["Meus Pedidos", "Histórico de compras e rastreamento"],
    wishlist: ["Lista de Desejos", "Produtos que você salvou"],
    addresses: ["Endereços", "Gerencie seus endereços de entrega"],
    payments: ["Pagamentos", "Formas de pagamento salvas"],
    notifications: ["Notificações", "Controle o que você recebe"],
    security: ["Privacidade e Segurança", "Mantenha sua conta protegida"],
    support: ["Suporte", "Estamos aqui para ajudar"],
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <button onClick={onGoHome} className="hover:text-[#FFD400] transition-colors">Home</button>
            <ChevronRight size={12} />
            <span className="text-[#121212] font-medium">Minha Conta</span>
          </nav>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-gray-500">Bem-vinda de volta, <span className="font-bold text-[#FFD400]">{formData.firstName}</span>!</p>
              <h1 className="font-[Barlow_Condensed,sans-serif] text-4xl font-black uppercase text-[#121212]">{sectionTitles[section][0]}</h1>
              <p className="text-gray-500 text-sm mt-0.5">{sectionTitles[section][1]}</p>
            </div>
            {/* Mobile nav button */}
            <button onClick={() => setMobileNavOpen(true)} className="lg:hidden flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold px-4 py-2 rounded-xl text-sm hover:border-[#121212] transition-all">
              <Menu size={16} /> Menu da conta
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8 items-start">

          {/* ── Sidebar desktop ────────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-2 sticky top-24">
            {/* Profile mini */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#FFD400] flex items-center justify-center font-black text-[#121212] shrink-0 overflow-hidden">
                {avatarPreview ? <img src={avatarPreview} alt="" className="w-full h-full object-cover" /> : formData.firstName[0]}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[#121212] text-sm truncate">{formData.firstName} {formData.lastName}</p>
                <p className="text-xs text-[#FFD400] font-semibold">{MOCK_USER.loyalty}</p>
              </div>
            </div>

            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {navItems.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setSection(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all border-b border-gray-50 last:border-0 text-left ${section === key ? "bg-[#FFD400] text-[#121212]" : "text-gray-600 hover:bg-[#F5F5F5] hover:text-[#121212]"}`}
                >
                  <span className={section === key ? "text-[#121212]" : "text-gray-400"}>{icon}</span>
                  {label}
                  {section === key && <ChevronRight size={14} className="ml-auto" />}
                </button>
              ))}
              <button onClick={onGoHome} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all border-t border-gray-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sair da conta
              </button>
            </nav>
          </aside>

          {/* ── Main content ───────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Personal info form always visible in overview */}
            {section === "overview" && (
              <>
                {sectionContent.overview}
                <div className="mt-2">{renderPersonalInfo()}</div>
              </>
            )}
            {section !== "overview" && sectionContent[section]}
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
          <div className="relative w-72 bg-white h-full flex flex-col shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FFD400] flex items-center justify-center font-black text-[#121212] overflow-hidden shrink-0">
                  {avatarPreview ? <img src={avatarPreview} alt="" className="w-full h-full object-cover" /> : formData.firstName[0]}
                </div>
                <div>
                  <p className="font-bold text-[#121212] text-sm">{formData.firstName}</p>
                  <p className="text-xs text-[#FFD400] font-semibold">{MOCK_USER.loyalty}</p>
                </div>
              </div>
              <button onClick={() => setMobileNavOpen(false)} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center"><X size={15} /></button>
            </div>
            <nav className="flex flex-col p-3 gap-1 flex-1">
              {navItems.map(({ key, label, icon }) => (
                <button key={key} onClick={() => { setSection(key); setMobileNavOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${section === key ? "bg-[#FFD400] text-[#121212]" : "text-gray-600 hover:bg-[#F5F5F5]"}`}>
                  <span>{icon}</span>{label}
                </button>
              ))}
            </nav>
            <div className="p-3 border-t border-gray-100">
              <button onClick={onGoHome} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sair da conta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete account modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModal(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl p-8 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={26} className="text-red-500" />
            </div>
            <h3 className="font-[Barlow_Condensed,sans-serif] text-2xl font-black uppercase text-[#121212] mb-2">Excluir conta?</h3>
            <p className="text-gray-500 text-sm mb-5 leading-relaxed">Esta ação é permanente. Todos os seus dados, pedidos e preferências serão excluídos e não poderão ser recuperados.</p>
            <input type="password" placeholder="Confirme sua senha" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 transition-colors mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(false)} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:border-gray-400 transition-all text-sm">Cancelar</button>
              <button className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-all text-sm">Excluir conta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

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
