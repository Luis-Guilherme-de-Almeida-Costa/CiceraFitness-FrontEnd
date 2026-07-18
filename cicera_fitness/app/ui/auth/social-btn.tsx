export default function SocialBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all">
      {icon} {label}
    </button>
  );
}