import { useState, useEffect } from "react";
import { Gift, Award, RefreshCw, Lock, ShieldCheck, Star, ArrowRight, Trash2, Tag, AlertCircle, Truck, Check, ChevronUp, ChevronDown, ShoppingCart, ChevronRight, Plus, Heart } from "lucide-react";
import { fmt } from "@/app/lib/utils";
import { CartItem, Product } from "@/app/lib/definitions";
import { PRODUCTS, COUPONS } from "@/app/lib/placeholder-data";
import CartItemCard from "@/app/ui/cart/cart-item-card";
import SavedItemCard from "@/app/ui/cart/saved-item-card";

export default function ShoppingCartPage({
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