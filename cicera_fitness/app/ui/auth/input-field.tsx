import { AlertCircle } from "lucide-react";

export default function InputField({
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