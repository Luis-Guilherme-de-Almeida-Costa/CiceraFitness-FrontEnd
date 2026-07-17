'use client';

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between py-4 text-left group">
        <span className="font-semibold text-[#121212] text-sm group-hover:text-[#FFD400] transition-colors">{title}</span>
        {open ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
      </button>
      {open && <div className="pb-4 text-sm text-gray-600 leading-relaxed">{children}</div>}
    </div>
  );
}