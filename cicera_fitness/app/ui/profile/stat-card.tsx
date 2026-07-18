export default function StatCard({ label, value, sub, icon }: { label: string; value: string | number; sub?: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col gap-2 border border-gray-100 shadow-sm">
      <div className="w-9 h-9 bg-[#FFD400] rounded-xl flex items-center justify-center">{icon}</div>
      <p className="font-[Barlow_Condensed,sans-serif] text-2xl font-black text-[#121212] leading-none">{value}</p>
      <div>
        <p className="text-xs font-semibold text-gray-700">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}