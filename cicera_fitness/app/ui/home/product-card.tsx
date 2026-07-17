'use client'

import { useState } from "react";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Product } from "@/app/lib/definitions";
import { Stars, fmt, BadgePill } from "@/app/lib/utils";

export default function ProductCard({ product, wishlist, onWishlist, onCart, onSelect }: {
  product: Product;
  wishlist: Set<number>;
  onWishlist: (id: number) => void;
  onCart: () => void;
  onSelect: (p: Product) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(product)}
    >
      <div className="relative overflow-hidden bg-[#F5F5F5] aspect-[4/5]">
        <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className={`absolute inset-0 bg-black/20 flex items-end justify-center pb-4 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <button onClick={(e) => { e.stopPropagation(); onCart(); }} className="bg-[#FFD400] text-[#121212] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-yellow-300 transition-colors flex items-center gap-2">
            <ShoppingCart size={14} /> Adicionar
          </button>
        </div>
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.badge && <BadgePill label={product.badge} />}
          <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">-{product.discount}%</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onWishlist(product.id); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm">
          <Heart size={15} className={wishlist.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-500"} />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-1.5">
        <div className="flex items-center gap-2"><Stars rating={product.rating} size={12} /><span className="text-xs text-gray-400">({product.reviews})</span></div>
        <h3 className="font-semibold text-[#121212] text-sm leading-tight">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#121212]">R$ {fmt(product.price)}</span>
          <span className="text-xs text-gray-400 line-through">R$ {fmt(product.originalPrice)}</span>
        </div>
        <p className="text-xs text-green-600 font-medium">PIX R$ {fmt(product.price * 0.9)} (10% off)</p>
        <p className="text-xs text-gray-500">ou 3x R$ {fmt(product.price / 3)} sem juros</p>
        <div className="flex gap-1 mt-1 flex-wrap">
          {product.sizes.map((s) => (
            <span key={s} className="text-[10px] border border-gray-200 rounded px-1.5 py-0.5 text-gray-600 hover:border-[#FFD400] hover:text-[#121212] cursor-pointer transition-colors">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}