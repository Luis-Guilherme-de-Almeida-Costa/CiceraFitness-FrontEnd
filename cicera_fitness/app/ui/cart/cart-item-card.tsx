import { useState } from "react";
import { Minus, Plus, Trash2, Bookmark, Heart, AlertCircle, Truck } from "lucide-react";
import { fmt } from "@/app/lib/utils";
import { CartItem } from "@/app/lib/definitions";
import { COLOR_LABELS } from "@/app/lib/placeholder-data";

export default function CartItemCard({
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