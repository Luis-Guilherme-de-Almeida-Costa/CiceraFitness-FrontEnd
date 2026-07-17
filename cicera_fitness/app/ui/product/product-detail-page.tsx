'use client'

import { Product } from "@/app/lib/definitions";
import { PRODUCT_REVIEWS } from "@/app/lib/placeholder-data"
import { fmt, BadgePill, Stars } from "@/app/lib/utils"
import { useEffect, useRef, useState } from "react";
import {
  ShoppingCart, Heart, X, ChevronRight,
  Star, Truck, ShieldCheck, Award, Headphones,
  ChevronLeft, Zap, Check, Share2, Minus, Plus,
  RotateCcw, AlertCircle, ThumbsUp, ZoomIn,
} from "lucide-react";
import Accordion from "@/app/ui/shared/accordion";
import ProductCard from "@/app/ui/home/product-card";

export default function ProductDetailPage({
  product, wishlist, onWishlist, onCart, onGoHome, relatedProducts, onSelect,
}: {
  product: Product;
  wishlist: Set<number>;
  onWishlist: (id: number) => void;
  onCart: () => void;
  onGoHome: () => void;
  relatedProducts: Product[];
  onSelect: (p: Product) => void;
}) {
  const imgs = product.imgs ?? [product.img];
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [cep, setCep] = useState("");
  const [shippingCalc, setShippingCalc] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<"descricao" | "especificacoes" | "cuidados">("descricao");

  // mobile swipe
  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (diff > 50) setActiveImg((i) => Math.min(imgs.length - 1, i + 1));
    else if (diff < -50) setActiveImg((i) => Math.max(0, i - 1));
    touchStart.current = null;
  };

  // scroll to top on mount
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const outOfStock = (product.stock ?? 10) === 0;
  const lowStock = (product.stock ?? 10) > 0 && (product.stock ?? 10) <= 5;
  const pix = product.price * 0.9;
  const install3 = product.price / 3;
  const install12 = product.price / 12;

  const colorLabels: Record<string, string> = {
    "#121212": "Preto", "#2B2B2B": "Grafite", "#FFD400": "Amarelo",
    "#ffffff": "Branco", "#6B7280": "Cinza",
  };

  const ratingCounts = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: PRODUCT_REVIEWS.filter((r) => r.rating === s).length,
    pct: Math.round((PRODUCT_REVIEWS.filter((r) => r.rating === s).length / PRODUCT_REVIEWS.length) * 100),
  }));

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
          <button onClick={onGoHome} className="hover:text-[#FFD400] transition-colors">Home</button>
          <ChevronRight size={12} />
          <span className="hover:text-[#121212] cursor-pointer">Roupas Fitness</span>
          <ChevronRight size={12} />
          <span className="hover:text-[#121212] cursor-pointer">{product.category}</span>
          <ChevronRight size={12} />
          <span className="text-[#121212] font-medium truncate max-w-[180px]">{product.name}</span>
        </nav>
      </div>

      {/* Main product section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] gap-10 lg:gap-16">

          {/* ── LEFT: Gallery ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Desktop: thumbnails + main */}
            <div className="hidden lg:flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-3 w-20 shrink-0">
                {imgs.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-[#FFD400] shadow-md" : "border-transparent hover:border-gray-300"}`}
                  >
                    <img src={src.replace("w=700&h=900", "w=100&h=100")} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
                {/* Video placeholder */}
                <button className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors">
                  <div className="text-center">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-0.5">
                      <ChevronRight size={10} className="text-gray-500 ml-0.5" />
                    </div>
                    <span className="text-[9px] text-gray-400">Vídeo</span>
                  </div>
                </button>
              </div>
              {/* Main image */}
              <div
                className="relative flex-1 rounded-3xl overflow-hidden bg-[#F5F5F5] aspect-[3/4] group cursor-zoom-in"
                onClick={() => setZoom(true)}
              >
                <img src={imgs[activeImg]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {/* Prev / Next */}
                {imgs.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); setActiveImg((i) => Math.max(0, i - 1)); }} disabled={activeImg === 0} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white disabled:opacity-30 transition-all">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setActiveImg((i) => Math.min(imgs.length - 1, i + 1)); }} disabled={activeImg === imgs.length - 1} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white disabled:opacity-30 transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
                {/* Counter */}
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  {activeImg + 1}/{imgs.length}
                </div>
                {/* Zoom hint */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <ZoomIn size={14} className="text-[#121212]" />
                </div>
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.badge && <BadgePill label={product.badge} />}
                  <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit">-{product.discount}%</span>
                </div>
              </div>
            </div>

            {/* Mobile: swipeable carousel */}
            <div className="lg:hidden relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#F5F5F5]" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <img src={imgs[activeImg]} alt={product.name} className="w-full h-full object-cover transition-opacity duration-300" />
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {imgs.map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImg ? "bg-[#FFD400] w-4" : "bg-white/60"}`} />
                ))}
              </div>
              <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                {product.badge && <BadgePill label={product.badge} />}
                <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">-{product.discount}%</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Info ───────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* Brand + category */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#FFD400] uppercase tracking-widest">Cicera Fitness</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">{product.category}</span>
            </div>

            {/* Title */}
            <h1 className="font-[Barlow_Condensed,sans-serif] text-4xl lg:text-5xl font-black uppercase text-[#121212] leading-tight">
              {product.name}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-3 flex-wrap">
              <Stars rating={product.rating} size={16} />
              <span className="font-bold text-[#121212] text-sm">{product.rating}</span>
              <button className="text-sm text-gray-500 hover:text-[#121212] underline underline-offset-2 transition-colors">
                {product.reviews} avaliações
              </button>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-400">+1.2k vendidos</span>
            </div>

            {/* SKU */}
            <p className="text-xs text-gray-400">SKU: {product.sku}</p>

            {/* Pricing */}
            <div className="bg-[#F5F5F5] rounded-2xl p-5 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-[#121212]">R$ {fmt(product.price)}</span>
                <span className="text-base text-gray-400 line-through">R$ {fmt(product.originalPrice)}</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{product.discount}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#32BCAD] rounded flex items-center justify-center shrink-0">
                  <span className="text-white text-[8px] font-black">PIX</span>
                </div>
                <span className="text-green-600 font-bold">R$ {fmt(pix)}</span>
                <span className="text-xs text-gray-500">(10% off no PIX)</span>
              </div>
              <p className="text-xs text-gray-500">ou <strong className="text-[#121212]">3x R$ {fmt(install3)}</strong> sem juros</p>
              <p className="text-xs text-gray-500">ou <strong className="text-[#121212]">12x R$ {fmt(install12)}</strong> no cartão</p>
            </div>

            {/* Color selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-[#121212]">Cor: <span className="font-normal text-gray-600">{colorLabels[product.colors[selectedColor]] ?? product.colors[selectedColor]}</span></span>
              </div>
              <div className="flex gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(i)}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${selectedColor === i ? "border-[#FFD400] scale-110 shadow-md" : "border-gray-200 hover:border-gray-400"}`}
                    style={{ backgroundColor: c }}
                    title={colorLabels[c] ?? c}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-[#121212]">Tamanho: <span className="font-normal text-gray-600">{selectedSize ?? "Selecione"}</span></span>
                <button onClick={() => setShowSizeGuide(true)} className="text-xs text-[#FFD400] font-semibold hover:underline underline-offset-2">
                  Guia de tamanhos
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => {
                  const unavail = s === "XGG" && product.id === 1; // demo: one size unavailable
                  return (
                    <button
                      key={s}
                      disabled={unavail}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[48px] h-12 rounded-xl text-sm font-bold border-2 transition-all ${
                        unavail
                          ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50 line-through"
                          : selectedSize === s
                          ? "border-[#FFD400] bg-[#FFD400] text-[#121212]"
                          : "border-gray-200 text-gray-700 hover:border-[#121212]"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {/* Stock warning */}
              {lowStock && (
                <div className="flex items-center gap-1.5 mt-3 text-orange-500">
                  <AlertCircle size={13} />
                  <span className="text-xs font-semibold">Apenas {product.stock} unidades disponíveis!</span>
                </div>
              )}
              {outOfStock && (
                <div className="flex items-center gap-1.5 mt-3 text-red-500">
                  <AlertCircle size={13} />
                  <span className="text-xs font-semibold">Produto esgotado · Previsão de reposição: 30 dias</span>
                </div>
              )}
              {!outOfStock && !lowStock && (
                <div className="flex items-center gap-1.5 mt-3 text-green-600">
                  <Check size={13} />
                  <span className="text-xs font-semibold">Em estoque · Pronto para envio</span>
                </div>
              )}
            </div>

            {/* Quantity + CTA */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Qty */}
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-11 flex items-center justify-center hover:bg-[#F5F5F5] transition-colors">
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center text-sm font-bold">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock ?? 10, q + 1))} className="w-10 h-11 flex items-center justify-center hover:bg-[#F5F5F5] transition-colors">
                  <Plus size={15} />
                </button>
              </div>
              {/* Add to cart */}
              <button
                disabled={outOfStock}
                onClick={onCart}
                className="flex-1 min-w-[160px] flex items-center justify-center gap-2 bg-[#121212] text-white font-bold py-3.5 rounded-xl hover:bg-[#2B2B2B] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                <ShoppingCart size={17} /> Adicionar ao Carrinho
              </button>
            </div>

            {/* Buy now */}
            <button
              disabled={outOfStock}
              className="w-full flex items-center justify-center gap-2 bg-[#FFD400] text-[#121212] font-bold py-4 rounded-xl hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] text-base"
            >
              <Zap size={17} className="fill-current" /> Comprar Agora
            </button>

            {/* Wishlist + Share */}
            <div className="flex gap-3">
              <button onClick={() => onWishlist(product.id)} className={`flex-1 flex items-center justify-center gap-2 border-2 py-3 rounded-xl text-sm font-semibold transition-all ${wishlist.has(product.id) ? "border-red-400 text-red-500 bg-red-50" : "border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-400"}`}>
                <Heart size={15} className={wishlist.has(product.id) ? "fill-red-500" : ""} />
                {wishlist.has(product.id) ? "Salvo" : "Favoritar"}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:border-gray-400 transition-all">
                <Share2 size={15} /> Compartilhar
              </button>
            </div>

            {/* Shipping calculator */}
            <div className="bg-[#F5F5F5] rounded-2xl p-4">
              <p className="text-sm font-bold text-[#121212] mb-3 flex items-center gap-2">
                <Truck size={15} className="text-[#FFD400]" /> Calcular Frete
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2"))}
                  maxLength={9}
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#FFD400] transition-colors"
                />
                <button onClick={() => setShippingCalc(true)} className="bg-[#121212] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2B2B2B] transition-colors">
                  Calcular
                </button>
              </div>
              {shippingCalc && (
                <div className="mt-3 flex flex-col gap-2">
                  {[
                    { label: "PAC", time: "5–8 dias úteis", price: "Grátis", free: true },
                    { label: "SEDEX", time: "1–2 dias úteis", price: "R$ 14,90", free: false },
                    { label: "SEDEX 10", time: "Próximo dia útil", price: "R$ 24,90", free: false },
                  ].map((opt) => (
                    <div key={opt.label} className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-gray-100">
                      <div>
                        <p className="text-sm font-bold text-[#121212]">{opt.label}</p>
                        <p className="text-xs text-gray-500">{opt.time}</p>
                      </div>
                      <span className={`text-sm font-bold ${opt.free ? "text-green-600" : "text-[#121212]"}`}>{opt.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trust row */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: ShieldCheck, text: "Compra 100% segura" },
                { icon: RotateCcw, text: "Troca grátis em 30 dias" },
                { icon: Award, text: "Qualidade garantida" },
                { icon: Headphones, text: "Suporte 24/7" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
                  <Icon size={14} className="text-[#FFD400] shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabs: Description / Specs / Care ─────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Tab buttons */}
          <div className="flex border-b border-gray-100">
            {([["descricao", "Descrição"], ["especificacoes", "Especificações"], ["cuidados", "Cuidados"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === key ? "border-[#FFD400] text-[#121212]" : "border-transparent text-gray-400 hover:text-gray-700"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="py-10 max-w-3xl">
            {activeTab === "descricao" && (
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                <div>
                  <h3 className="font-bold text-[#121212] mb-3">Benefícios</h3>
                  <ul className="space-y-2">
                    {["Compressão progressiva para modelar e sustentar", "Tecido de secagem ultra-rápida", "Proteção UV50+ para treinos ao ar livre", "Cintura alta para maior conforto e suporte abdominal", "Costuras planas para evitar fricção"].map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check size={14} className="text-[#FFD400] mt-0.5 shrink-0" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[["Compressão", "Alta"], ["Respirabilidade", "Máxima"], ["Elasticidade", "4 vias"]].map(([k, v]) => (
                    <div key={k} className="bg-[#F5F5F5] rounded-xl p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{k}</p>
                      <p className="font-bold text-[#121212]">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "especificacoes" && (
              <div className="space-y-1">
                <Accordion title="Material e Composição" defaultOpen>
                  <p>78% Poliamida · 22% Elastano. Tecido Sculpting de alta performance com tecnologia anti-celulite e compressão gradual.</p>
                </Accordion>
                <Accordion title="Modelagem e Caimento">
                  <p>Cintura alta · Fit justo · Comprimento 7/8 · Fechamento por elastano embutido · Coleção Verão 2025 · Produto 100% nacional.</p>
                </Accordion>
                <Accordion title="Informações Adicionais">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[["SKU", product.sku], ["País de Origem", "Brasil"], ["Coleção", "Verão 2025"], ["Registro INMETRO", "CF-2025-001"]].map(([k, v]) => (
                      <div key={k}>
                        <p className="text-gray-400 text-xs">{k}</p>
                        <p className="font-medium text-[#121212]">{v}</p>
                      </div>
                    ))}
                  </div>
                </Accordion>
              </div>
            )}
            {activeTab === "cuidados" && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[
                  { icon: "🫧", label: "Lavar à máquina", detail: "Até 30°C" },
                  { icon: "🚫", label: "Não usar alvejante", detail: "" },
                  { icon: "🌬️", label: "Secar naturalmente", detail: "À sombra" },
                  { icon: "♨️", label: "Passar a ferro", detail: "Temp. baixa" },
                  { icon: "🧺", label: "Não usar secadora", detail: "" },
                ].map((c) => (
                  <div key={c.label} className="bg-[#F5F5F5] rounded-2xl p-4 text-center">
                    <span className="text-3xl">{c.icon}</span>
                    <p className="text-xs font-semibold text-[#121212] mt-2 leading-tight">{c.label}</p>
                    {c.detail && <p className="text-xs text-gray-400 mt-0.5">{c.detail}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Customer Reviews ─────────────────────────────────────────────── */}
      <section className="bg-[#F5F5F5] py-14">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="font-[Barlow_Condensed,sans-serif] text-4xl font-black uppercase text-[#121212] mb-8">
            Avaliações dos Clientes
          </h2>
          <div className="grid lg:grid-cols-[280px_1fr] gap-10">
            {/* Rating summary */}
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 h-fit">
              <div className="text-center">
                <p className="font-[Barlow_Condensed,sans-serif] text-6xl font-black text-[#121212]">{product.rating}</p>
                <Stars rating={product.rating} size={20} />
                <p className="text-sm text-gray-500 mt-1">{product.reviews} avaliações</p>
              </div>
              <div className="flex flex-col gap-2">
                {ratingCounts.map(({ stars, count, pct }) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-3">{stars}</span>
                    <Star size={10} className="fill-[#FFD400] text-[#FFD400] shrink-0" />
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FFD400] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-4 text-right">{count}</span>
                  </div>
                ))}
              </div>
              <button className="w-full border-2 border-[#121212] text-[#121212] font-bold py-3 rounded-xl hover:bg-[#121212] hover:text-white transition-all text-sm">
                Escrever avaliação
              </button>
            </div>

            {/* Review cards */}
            <div className="flex flex-col gap-4">
              {/* Sort */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-sm text-gray-500">{PRODUCT_REVIEWS.length} avaliações</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Ordenar:</span>
                  <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-[#FFD400] bg-white">
                    <option>Mais recentes</option>
                    <option>Mais úteis</option>
                    <option>Melhor avaliação</option>
                  </select>
                </div>
              </div>

              {PRODUCT_REVIEWS.map((r, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#FFD400] rounded-full flex items-center justify-center font-bold text-[#121212] text-sm shrink-0">
                        {r.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-[#121212] text-sm">{r.name}</p>
                          {r.verified && <span className="text-[10px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"><Check size={9} />Compra verificada</span>}
                        </div>
                        <p className="text-xs text-gray-400">{r.date}</p>
                      </div>
                    </div>
                    <Stars rating={r.rating} size={13} />
                  </div>
                  {r.photo && (
                    <img src={r.photo} alt="Foto da avaliação" className="w-16 h-16 rounded-xl object-cover" />
                  )}
                  <p className="text-sm text-gray-700 leading-relaxed">"{r.text}"</p>
                  <div className="flex items-center gap-3 pt-1 border-t border-gray-50">
                    <span className="text-xs text-gray-400">Útil?</span>
                    <button
                      onClick={() => setHelpfulClicked((prev) => { const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next; })}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border transition-all ${helpfulClicked.has(i) ? "border-[#FFD400] text-[#121212] bg-[#FFD400]/10" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}
                    >
                      <ThumbsUp size={11} /> {r.helpful + (helpfulClicked.has(i) ? 1 : 0)}
                    </button>
                  </div>
                </div>
              ))}

              <button className="w-full border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:border-[#121212] hover:text-[#121212] transition-all text-sm">
                Carregar mais avaliações
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Products ──────────────────────────────────────────────── */}
      <section className="py-14 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[#FFD400] text-sm font-semibold uppercase tracking-widest">Você também pode gostar</span>
            <h2 className="font-[Barlow_Condensed,sans-serif] text-3xl lg:text-4xl font-black uppercase text-[#121212] mt-1">Produtos Similares</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {relatedProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} wishlist={wishlist} onWishlist={onWishlist} onCart={onCart} onSelect={onSelect} />
          ))}
        </div>
      </section>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-100 px-4 py-3 flex gap-3 shadow-2xl">
        <div className="flex flex-col justify-center">
          <span className="text-xs text-gray-500 line-through">R$ {fmt(product.originalPrice)}</span>
          <span className="font-black text-lg text-[#121212] leading-tight">R$ {fmt(product.price)}</span>
        </div>
        <button disabled={outOfStock} onClick={onCart} className="flex-1 flex items-center justify-center gap-2 bg-[#121212] text-white font-bold py-3 rounded-xl disabled:opacity-40 transition-all text-sm">
          <ShoppingCart size={15} /> Adicionar
        </button>
        <button disabled={outOfStock} className="flex-1 flex items-center justify-center gap-2 bg-[#FFD400] text-[#121212] font-bold py-3 rounded-xl disabled:opacity-40 transition-all text-sm">
          <Zap size={15} className="fill-current" /> Comprar
        </button>
      </div>

      {/* WhatsApp */}
      <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="fixed bottom-20 right-6 z-40 lg:bottom-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-xl hover:bg-green-400 hover:scale-110 transition-all">
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>

      {/* Size guide modal */}
      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}

      {/* Zoom modal */}
      {zoom && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4" onClick={() => setZoom(false)}>
          <img src={imgs[activeImg]} alt={product.name} className="max-h-full max-w-full rounded-2xl object-contain" />
          <button onClick={() => setZoom(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
            <X size={20} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
}