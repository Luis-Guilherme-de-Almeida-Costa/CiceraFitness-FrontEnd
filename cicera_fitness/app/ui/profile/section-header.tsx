export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-[Barlow_Condensed,sans-serif] text-3xl font-black uppercase text-[#121212]">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}