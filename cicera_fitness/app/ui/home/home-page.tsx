'use client'

import { useState, useRef, useEffect, useCallback } from "react";
import { PRODUCTS, CATEGORIES, NEW_ARRIVALS, TESTIMONIALS, INSTAGRAM_IMGS } from '@/app/lib/placeholder-data';
import { fmt } from "@/app/lib/utils";
import ProductCard from "./product-card";
import { Product } from "@/app/lib/definitions";
import {
  ShoppingCart, ChevronRight,
  Star, Truck, ShieldCheck, Award, Headphones, Instagram,
  ChevronLeft, Zap, ArrowRight, Check, Mail, Phone,
  Clock
} from "lucide-react";

export default function HomePage({ wishlist, onWishlist, onCart, onSelect }: {
  wishlist: Set<number>;
  onWishlist: (id: number) => void;
  onCart: () => void;
  onSelect: (p: Product) => void;
}) {
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [activeTab, setActiveTab] = useState<"todos" | "leggings" | "tops" | "conjuntos">("todos");

  const filtered = activeTab === "todos" ? PRODUCTS
    : activeTab === "leggings" ? PRODUCTS.filter((p) => p.name.toLowerCase().includes("legging"))
    : activeTab === "tops" ? PRODUCTS.filter((p) => p.name.toLowerCase().includes("top"))
    : PRODUCTS.filter((p) => p.name.toLowerCase().includes("conjunto"));

  return (
    <>
      {/* Hero */}
      <section className="bg-[#121212] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 min-h-[88vh] lg:min-h-[80vh]">
          <div className="flex flex-col justify-center py-16 lg:py-24 z-10 relative">
            <span className="inline-flex items-center gap-2 text-[#FFD400] font-semibold text-sm uppercase tracking-widest mb-6">
              <span className="w-8 h-0.5 bg-[#FFD400]" /> Coleção 2025
            </span>
            <h1 className="font-[Barlow_Condensed,sans-serif] text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-none uppercase mb-6">
              Vista sua<br /><span className="text-[#FFD400]">melhor</span><br />versão.
            </h1>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed mb-10">
              Roupas fitness premium para mulheres que não abrem mão de estilo e performance. Do treino ao dia a dia.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => document.getElementById("bestsellers")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 bg-[#FFD400] text-[#121212] font-bold px-8 py-4 rounded-full hover:bg-yellow-300 transition-all hover:scale-[1.02] text-base">
                Comprar Agora <ArrowRight size={18} />
              </button>
              <button onClick={() => document.getElementById("new")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-4 rounded-full hover:border-[#FFD400] hover:text-[#FFD400] transition-all text-base">
                Ver Novidades
              </button>
            </div>
            <div className="flex gap-6 mt-12 pt-8 border-t border-white/10">
              {[["4.9★", "18k+ avaliações"], ["48h", "Entrega expressa"], ["30d", "Troca grátis"]].map(([a, b]) => (
                <div key={a}>
                  <p className="text-[#FFD400] font-bold text-lg leading-none">{a}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{b}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFD400]/10 rounded-full blur-3xl" />
            <div className="absolute right-20 bottom-0 top-0 flex items-end">
              <img src="https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=520&h=780&fit=crop&auto=format" alt="Modelo Cicera Fitness" className="h-[90%] w-auto object-cover rounded-t-[200px] shadow-2xl" />
            </div>
            <div className="absolute top-16 right-8 bg-white rounded-2xl p-3 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFD400] rounded-xl flex items-center justify-center"><Star size={18} className="fill-[#121212] text-[#121212]" /></div>
              <div><p className="text-xs text-gray-500 leading-none">Avaliação média</p><p className="font-bold text-[#121212] text-base leading-tight mt-0.5">4.9 / 5.0</p></div>
            </div>
            <div className="absolute bottom-24 left-8 bg-[#FFD400] rounded-2xl py-2.5 px-4 shadow-xl">
              <p className="text-[#121212] font-black text-lg leading-none">-30%</p>
              <p className="text-[#121212]/70 text-xs font-medium">em toda a coleção</p>
            </div>
          </div>
        </div>
        <div className="lg:hidden relative h-72 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=800&h=600&fit=crop&auto=format" alt="Modelo Cicera Fitness" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[#FFD400] text-sm font-semibold uppercase tracking-widest">Explorar</span>
            <h2 className="font-[Barlow_Condensed,sans-serif] text-4xl lg:text-5xl font-black uppercase text-[#121212] mt-1">Categorias</h2>
          </div>
          <a href="#" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#121212] transition-colors">Ver todas <ChevronRight size={16} /></a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-[#F5F5F5] cursor-pointer">
              <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-bold text-sm leading-tight">{cat.name}</p>
                <p className="text-white/60 text-xs mt-0.5">{cat.count} peças</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section id="bestsellers" className="py-16 lg:py-24 bg-[#F5F5F5]">
        <div className="px-4 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[#FFD400] text-sm font-semibold uppercase tracking-widest">Mais vendidos</span>
              <h2 className="font-[Barlow_Condensed,sans-serif] text-4xl lg:text-5xl font-black uppercase text-[#121212] mt-1">Best Sellers</h2>
            </div>
          </div>
          <div className="flex gap-2 mb-8 flex-wrap">
            {(["todos", "leggings", "tops", "conjuntos"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${activeTab === tab ? "bg-[#121212] text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>{tab}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map((p) => <ProductCard key={p.id} product={p} wishlist={wishlist} onWishlist={onWishlist} onCart={onCart} onSelect={onSelect} />)}
          </div>
          <div className="text-center mt-10">
            <a href="#" className="inline-flex items-center gap-2 border-2 border-[#121212] text-[#121212] font-bold px-8 py-3.5 rounded-full hover:bg-[#121212] hover:text-white transition-all">
              Ver todos os produtos <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-[#FFD400] py-14 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[#121212]/60 font-semibold uppercase tracking-widest text-sm mb-2">Oferta especial</p>
            <h2 className="font-[Barlow_Condensed,sans-serif] text-5xl lg:text-6xl font-black uppercase text-[#121212] leading-none">Semana Fitness<br />Até 40% OFF</h2>
          </div>
          <div className="flex gap-3">
            {[["02","Dias"],["14","Horas"],["37","Min"]].map(([n,l]) => (
              <div key={l} className="text-center bg-[#121212] text-white rounded-2xl px-8 py-4">
                <p className="text-4xl font-black font-[Barlow_Condensed,sans-serif]">{n}</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">{l}</p>
              </div>
            ))}
          </div>
          <a href="#" className="inline-flex items-center gap-2 bg-[#121212] text-white font-bold px-8 py-4 rounded-full hover:bg-[#2B2B2B] transition-all text-base whitespace-nowrap">
            Aproveitar agora <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* New Arrivals */}
      <section id="new" className="py-16 lg:py-24 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[#FFD400] text-sm font-semibold uppercase tracking-widest">Acabou de chegar</span>
            <h2 className="font-[Barlow_Condensed,sans-serif] text-4xl lg:text-5xl font-black uppercase text-[#121212] mt-1">Novidades</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCarouselIdx((i) => Math.max(0, i - 1))} disabled={carouselIdx === 0} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#FFD400] disabled:opacity-30 transition-colors"><ChevronLeft size={18} /></button>
            <button onClick={() => setCarouselIdx((i) => Math.min(NEW_ARRIVALS.length - 1, i + 1))} disabled={carouselIdx >= NEW_ARRIVALS.length - 1} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#FFD400] disabled:opacity-30 transition-colors"><ChevronRight size={18} /></button>
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="flex gap-5 transition-transform duration-400" style={{ transform: `translateX(calc(-${carouselIdx} * (100% / 4 + 5px)))` }}>
            {NEW_ARRIVALS.map((item) => (
              <div key={item.id} className="group min-w-[calc(50%-10px)] sm:min-w-[calc(33.33%-14px)] lg:min-w-[calc(25%-15px)] shrink-0 cursor-pointer" onClick={() => onSelect(item)}>
                <div className="relative overflow-hidden rounded-2xl bg-[#F5F5F5] aspect-[3/4] mb-4">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 left-3"><span className="bg-[#121212] text-[#FFD400] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Novo</span></div>
                  <button onClick={(e) => { e.stopPropagation(); onCart(); }} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-[#121212] font-bold text-xs px-5 py-2.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap shadow-lg flex items-center gap-1.5">
                    <ShoppingCart size={13} /> Adicionar
                  </button>
                </div>
                <h3 className="font-semibold text-[#121212] text-sm">{item.name}</h3>
                <p className="text-gray-500 text-sm mt-0.5">R$ {fmt(item.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Buy */}
      <section className="bg-[#121212] py-16 lg:py-24 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#FFD400] text-sm font-semibold uppercase tracking-widest">Nossos diferenciais</span>
            <h2 className="font-[Barlow_Condensed,sans-serif] text-4xl lg:text-5xl font-black uppercase text-white mt-2">Por que escolher a Cicera?</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Entrega Rápida", desc: "Receba em até 2 dias úteis nas principais capitais" },
              { icon: ShieldCheck, title: "Pagamento Seguro", desc: "Ambiente 100% seguro com criptografia SSL" },
              { icon: Award, title: "Alta Qualidade", desc: "Tecidos premium selecionados por especialistas" },
              { icon: Headphones, title: "Suporte 24/7", desc: "Atendimento via WhatsApp, chat e e-mail" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 bg-[#FFD400] rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"><Icon size={22} className="text-[#121212]" /></div>
                <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 px-4 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#FFD400] text-sm font-semibold uppercase tracking-widest">Clientes satisfeitas</span>
            <h2 className="font-[Barlow_Condensed,sans-serif] text-4xl lg:text-5xl font-black uppercase text-[#121212] mt-2">O que dizem sobre nós</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-[#F5F5F5] rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < t.rating ? "fill-[#FFD400] text-[#FFD400]" : "fill-gray-200 text-gray-200"} />)}</div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-black/5">
                  <div className="w-9 h-9 bg-[#FFD400] rounded-full flex items-center justify-center font-bold text-[#121212] text-sm shrink-0">{t.avatar}</div>
                  <div><p className="font-semibold text-[#121212] text-sm">{t.name}</p><p className="text-gray-400 text-xs">{t.city}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="py-16 lg:py-24 px-4 lg:px-8 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#FFD400] text-sm font-semibold uppercase tracking-widest">Siga a gente</span>
            <h2 className="font-[Barlow_Condensed,sans-serif] text-4xl lg:text-5xl font-black uppercase text-[#121212] mt-2">@cicerafitness</h2>
            <p className="text-gray-500 text-sm mt-2">Mostre seu look e marque <strong>#CiceraFitness</strong></p>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
            {INSTAGRAM_IMGS.map((src, i) => (
              <a key={i} href="#" className="group relative overflow-hidden rounded-xl aspect-square bg-gray-200">
                <img src={src} alt={`Post ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Instagram size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 lg:py-24 px-4 lg:px-8 bg-[#121212]">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-[#FFD400] text-sm font-semibold uppercase tracking-widest">Fique por dentro</span>
          <h2 className="font-[Barlow_Condensed,sans-serif] text-4xl lg:text-5xl font-black uppercase text-white mt-2 mb-3">Receba ofertas exclusivas</h2>
          <p className="text-gray-400 text-sm mb-8">Cadastre-se e ganhe <strong className="text-[#FFD400]">10% OFF</strong> na primeira compra.</p>
          {newsletterDone ? (
            <div className="flex items-center justify-center gap-3 text-[#FFD400] font-semibold">
              <div className="w-8 h-8 bg-[#FFD400] rounded-full flex items-center justify-center"><Check size={16} className="text-[#121212]" /></div>
              Obrigada! Seu cupom foi enviado.
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setNewsletterDone(true); }} className="flex gap-2">
              <input type="email" required placeholder="Seu melhor e-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-gray-500 rounded-full px-5 py-3.5 text-sm outline-none focus:border-[#FFD400] transition-colors" />
              <button type="submit" className="bg-[#FFD400] text-[#121212] font-bold px-6 py-3.5 rounded-full hover:bg-yellow-300 transition-colors whitespace-nowrap flex items-center gap-2 text-sm">
                <Mail size={14} /> 10% OFF
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 grid grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#FFD400] rounded-lg flex items-center justify-center"><Zap size={16} className="text-[#121212] fill-current" /></div>
              <span className="font-[Barlow_Condensed,sans-serif] text-2xl font-black tracking-tight uppercase">Cicera<span className="text-[#FFD400]">.</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">Roupas fitness premium para mulheres que valorizam qualidade, estilo e conforto. Feito no Brasil, para o mundo.</p>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <span className="flex items-center gap-2 hover:text-[#FFD400] transition-colors cursor-pointer"><Phone size={14} /> (11) 99999-9999</span>
              <span className="flex items-center gap-2 hover:text-[#FFD400] transition-colors cursor-pointer"><Mail size={14} /> contato@cicerafitness.com.br</span>
              <span className="flex items-center gap-2"><Clock size={14} /> Seg–Sex 9h–18h</span>
            </div>
          </div>
          {[
            { title: "Categorias", links: ["Leggings","Tops","Shorts","Conjuntos","Camisetas","Acessórios"] },
            { title: "Atendimento", links: ["Central de Ajuda","Rastrear Pedido","Trocas e Devoluções","Tamanhos","Contato"] },
            { title: "Empresa", links: ["Sobre Nós","Blog","Parceiros","Trabalhe Conosco","Privacidade","Termos de Uso"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((l) => <li key={l}><a href="#" className="text-gray-400 text-sm hover:text-[#FFD400] transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 px-4 lg:px-8 py-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">© 2025 Cicera Fitness. Todos os direitos reservados.</p>
          <div className="flex items-center gap-3">
            {["Pix","Visa","Master","Amex","Boleto"].map((m) => <span key={m} className="bg-white/10 text-gray-300 text-[10px] font-bold px-2 py-1 rounded">{m}</span>)}
          </div>
        </div>
      </footer>

      {/* WhatsApp */}
      <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-xl hover:bg-green-400 hover:scale-110 transition-all">
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>
    </>
  );
}