import { X } from "lucide-react";
import { CartItem } from "@/app/lib/definitions";
import { COLOR_LABELS } from "@/app/lib/placeholder-data";
import { fmt } from "@/app/lib/utils";

export default function SavedItemCard({ item, onMoveToCart, onRemove }: {
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