export default function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${on ? "bg-[#FFD400]" : "bg-gray-200"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}