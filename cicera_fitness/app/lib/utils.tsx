import { ShoppingCart, Heart, Star } from "lucide-react";

export function fmt(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} className={s <= Math.round(rating) ? "fill-[#FFD400] text-[#FFD400]" : "fill-gray-200 text-gray-200"} />
      ))}
    </div>
  );
}

export function BadgePill({ label }: { label: string }) {
  const map: Record<string, string> = {
    "Mais Vendido": "bg-[#FFD400] text-[#121212]",
    "Novidade": "bg-[#121212] text-white",
    "Destaque": "bg-[#FFD400] text-[#121212]",
    "Promoção": "bg-red-500 text-white",
    "Lançamento": "bg-[#2B2B2B] text-white",
    "Novo": "bg-[#121212] text-[#FFD400]",
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${map[label] ?? "bg-gray-200 text-gray-700"}`}>
      {label}
    </span>
  );
}