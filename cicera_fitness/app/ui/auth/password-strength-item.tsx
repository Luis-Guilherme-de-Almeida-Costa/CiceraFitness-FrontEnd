import { Check } from "lucide-react";

export default function PasswordStrengthItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 text-xs transition-colors ${ok ? "text-green-600" : "text-gray-400"}`}>
      <span className={`w-4 h-4 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${ok ? "border-green-500 bg-green-500" : "border-gray-300"}`}>
        {ok && <Check size={9} className="text-white" />}
      </span>
      {label}
    </li>
  );
}