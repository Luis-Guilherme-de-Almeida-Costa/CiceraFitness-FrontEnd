import { useState } from "react";
import { Zap, Search, User, Heart, ShoppingCart, Menu, X, ChevronRight } from "lucide-react";
import { AuthTab } from "@/app/lib/definitions";

export default function Nav({
  scrolled, cartCount, wishlistSize, onGoHome, onCart, onAuth,
}: {
  scrolled: boolean;
  cartCount: number;
  wishlistSize: number;
  onGoHome: () => void;
  onCart: () => void;
  onAuth: (tab?: AuthTab) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navLinks = ["Novidades", "Promoções", "Categorias", "Sobre Nós", "Contato"];

  return (
    <>
      <div className="bg-[#121212] text-white text-center text-xs py-2.5 px-4 font-medium tracking-wide">
        🚚 Frete grátis acima de R$199 · PIX com 10% de desconto · Parcelamento em até 12x
      </div>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white"} border-b border-black/5`}>
        <nav className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
          <button onClick={onGoHome} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#FFD400] rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-[#121212] fill-current" />
            </div>
            <span className="font-[Barlow_Condensed,sans-serif] text-2xl font-black tracking-tight text-[#121212] uppercase">
              Cicera<span className="text-[#FFD400]">.</span>
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((l) => (
              <button key={l} className="text-sm font-medium text-gray-700 hover:text-[#121212] transition-colors relative group">
                {l}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#FFD400] group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {searchOpen ? (
              <div className="hidden sm:flex items-center border-2 border-[#FFD400] rounded-full px-3 py-1.5 gap-2">
                <Search size={15} className="text-gray-500" />
                <input autoFocus placeholder="Buscar produtos..." className="outline-none text-sm w-36 bg-transparent" onBlur={() => setSearchOpen(false)} />
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="w-9 h-9 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center transition-colors">
                <Search size={18} className="text-[#121212]" />
              </button>
            )}
            <button onClick={() => onAuth("login")} className="hidden sm:flex w-9 h-9 rounded-full hover:bg-[#F5F5F5] items-center justify-center transition-colors">
              <User size={18} className="text-[#121212]" />
            </button>
            <button className="hidden sm:flex w-9 h-9 rounded-full hover:bg-[#F5F5F5] items-center justify-center relative transition-colors">
              <Heart size={18} className="text-[#121212]" />
              {wishlistSize > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{wishlistSize}</span>}
            </button>
            <button onClick={onCart} className="flex items-center gap-2 bg-[#121212] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#2B2B2B] transition-colors relative">
              <ShoppingCart size={15} />
              <span className="hidden sm:inline">Carrinho</span>
              {cartCount > 0 && <span className="w-5 h-5 bg-[#FFD400] text-[#121212] text-xs font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <button onClick={() => setMobileOpen(true)} className="lg:hidden w-9 h-9 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center transition-colors">
              <Menu size={20} className="text-[#121212]" />
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative ml-auto w-72 bg-white h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-black/5">
              <span className="font-[Barlow_Condensed,sans-serif] text-xl font-black uppercase">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center"><X size={16} /></button>
            </div>
            <div className="flex flex-col p-5 gap-1">
              {navLinks.map((l) => (
                <button key={l} className="py-3 px-3 text-base font-medium text-gray-800 hover:bg-[#F5F5F5] rounded-xl transition-colors flex items-center justify-between">
                  {l} <ChevronRight size={16} className="text-gray-400" />
                </button>
              ))}
            </div>
            <div className="mt-auto p-5 border-t border-black/5 flex gap-3">
              <button onClick={() => { setMobileOpen(false); onAuth("login"); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-black/10 rounded-xl text-sm font-medium hover:bg-[#F5F5F5] transition-colors"><User size={16} /> Entrar</button>
              <button onClick={() => { setMobileOpen(false); onAuth("register"); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#FFD400] rounded-xl text-sm font-bold hover:bg-yellow-300 transition-colors">Cadastrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}