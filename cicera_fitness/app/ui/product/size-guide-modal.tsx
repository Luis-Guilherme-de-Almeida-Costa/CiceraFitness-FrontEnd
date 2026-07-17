import { User, X } from "lucide-react";

export default function SizeGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
          <h3 className="font-[Barlow_Condensed,sans-serif] text-2xl font-black uppercase">Guia de Tamanhos</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-gray-200 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-6">
          {/* Body diagram placeholder */}
          <div className="bg-[#F5F5F5] rounded-2xl h-40 flex items-center justify-center mb-6">
            <div className="text-center text-gray-400">
              <User size={48} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Meça busto, cintura e quadril</p>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[#FFD400]">
                {["Tamanho", "Busto (cm)", "Cintura (cm)", "Quadril (cm)"].map((h) => (
                  <th key={h} className="text-left pb-2 font-bold text-[#121212] text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[["P", "80–84", "62–66", "88–92"], ["M", "85–89", "67–71", "93–97"], ["G", "90–95", "72–77", "98–103"], ["GG", "96–102", "78–84", "104–110"], ["XGG", "103–110", "85–92", "111–118"]].map(([sz, ...vals]) => (
                <tr key={sz} className="border-b border-gray-100 hover:bg-[#F5F5F5] transition-colors">
                  <td className="py-2.5 font-bold text-[#121212]">{sz}</td>
                  {vals.map((v, i) => <td key={i} className="py-2.5 text-gray-600">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 mt-4">* Medidas em centímetros. Em caso de dúvida, prefira o tamanho maior.</p>
        </div>
      </div>
    </div>
  );
}