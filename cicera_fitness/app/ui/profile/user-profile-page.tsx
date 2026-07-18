import { useState, useEffect } from "react";
import { X, User, Package, Heart, MapPin, CreditCard, Bell, ShieldCheck, Headphones, Tag, Star, Zap, Truck, Check, ShoppingCart, Trash2, RefreshCw, Plus, AlertCircle, ChevronRight, Menu } from "lucide-react";
import { MOCK_USER, MOCK_ADDRESSES, MOCK_PAYMENTS, MOCK_COUPONS, MOCK_ORDERS, PRODUCTS } from "@/app/lib/placeholder-data";
import StatCard from "@/app/ui/profile/stat-card";
import Toggle from "@/app/ui/profile/toggle";
import { fmt } from "@/app/lib/utils";
import { ProfileSection } from "@/app/lib/definitions";

export default function UserProfilePage({ onGoHome, wishlistSize }: { onGoHome: () => void; wishlistSize: number }) {
  const [section, setSection] = useState<ProfileSection>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // personal info form
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...MOCK_USER });
  const [savedMsg, setSavedMsg] = useState(false);

  // addresses
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [addingAddress, setAddingAddress] = useState(false);

  // payments
  const [payments, setPayments] = useState(MOCK_PAYMENTS);

  // notifications
  const [notifs, setNotifs] = useState({
    emailPromos: true, orderUpdates: true, shipping: true,
    newCollection: false, discounts: true, newsletter: true, recommendations: false,
  });

  // security
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurPw, setShowCurPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  // coupon copy
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const copyCoupon = (code: string) => { setCopiedCoupon(code); setTimeout(() => setCopiedCoupon(null), 2000); };

  // avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const pwStrength = [/[A-Z]/.test(newPw), /[a-z]/.test(newPw), /\d/.test(newPw), newPw.length >= 8, /[!@#$%^&*]/.test(newPw)].filter(Boolean).length;

  const navItems: { key: ProfileSection; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Minha Conta", icon: <User size={16} /> },
    { key: "orders", label: "Meus Pedidos", icon: <Package size={16} /> },
    { key: "wishlist", label: "Lista de Desejos", icon: <Heart size={16} /> },
    { key: "addresses", label: "Endereços", icon: <MapPin size={16} /> },
    { key: "payments", label: "Pagamentos", icon: <CreditCard size={16} /> },
    { key: "notifications", label: "Notificações", icon: <Bell size={16} /> },
    { key: "security", label: "Privacidade e Segurança", icon: <ShieldCheck size={16} /> },
    { key: "support", label: "Suporte", icon: <Headphones size={16} /> },
  ];

  const savePersonalInfo = () => { setSavedMsg(true); setEditMode(false); setTimeout(() => setSavedMsg(false), 3000); };

  const EyeToggle = ({ v, set }: { v: boolean; set: (x: boolean) => void }) => (
    <button type="button" onClick={() => set(!v)} className="text-gray-400 hover:text-gray-700 transition-colors">
      {v
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  );

  // ── Section renderers ─────────────────────────────────────────────────────

  const renderOverview = () => (
    <div className="flex flex-col gap-6">
      {/* Profile card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-[#FFD400] flex items-center justify-center text-[#121212] font-black text-3xl overflow-hidden">
              {avatarPreview ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" /> : "A"}
            </div>
            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#121212] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#2B2B2B] transition-colors shadow-md">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = (ev) => setAvatarPreview(ev.target?.result as string); r.readAsDataURL(f); } }} />
            </label>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-[#121212] text-xl">{formData.firstName} {formData.lastName}</h3>
              <span className="bg-[#FFD400] text-[#121212] text-xs font-bold px-2.5 py-0.5 rounded-full">⭐ {MOCK_USER.loyalty}</span>
            </div>
            <p className="text-gray-500 text-sm mt-0.5">{formData.email}</p>
            <p className="text-gray-500 text-sm">{formData.phone}</p>
            <p className="text-xs text-gray-400 mt-1">Membro desde {MOCK_USER.memberSince}</p>
          </div>
          <button onClick={() => setEditMode(true)} className="flex items-center gap-2 border-2 border-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl hover:border-[#121212] transition-all text-sm shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar perfil
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Pedidos" value={12} sub="concluídos" icon={<Package size={16} className="text-[#121212]" />} />
        <StatCard label="Favoritos" value={wishlistSize || 5} sub="produtos" icon={<Heart size={16} className="text-[#121212]" />} />
        <StatCard label="Cupons" value={2} sub="disponíveis" icon={<Tag size={16} className="text-[#121212]" />} />
        <StatCard label="Pontos" value="1.240" sub="fidelidade" icon={<Star size={16} className="text-[#121212]" />} />
        <StatCard label="Economizou" value="R$347" sub="em descontos" icon={<Zap size={16} className="text-[#121212]" />} />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-bold text-[#121212] mb-4">Ações rápidas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Meus Pedidos", icon: <Package size={18} />, action: () => setSection("orders") },
            { label: "Lista de Desejos", icon: <Heart size={18} />, action: () => setSection("wishlist") },
            { label: "Continuar Comprando", icon: <ShoppingCart size={18} />, action: onGoHome },
            { label: "Rastrear Entrega", icon: <Truck size={18} />, action: () => setSection("orders") },
            { label: "Meus Cupons", icon: <Tag size={18} />, action: () => {} },
            { label: "Suporte", icon: <Headphones size={18} />, action: () => setSection("support") },
          ].map(({ label, icon, action }) => (
            <button key={label} onClick={action} className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-[#FFD400] hover:shadow-md transition-all group text-left">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-[#FFD400] group-hover:text-[#121212] transition-all shrink-0">{icon}</div>
              <span className="font-semibold text-[#121212] text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Coupons */}
      <div>
        <h3 className="font-bold text-[#121212] mb-4">Seus cupons</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {MOCK_COUPONS.map((c) => (
            <div key={c.code} className="bg-white rounded-2xl p-4 border-2 border-dashed border-[#FFD400] flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-[Barlow_Condensed,sans-serif] text-xl font-black text-[#121212]">{c.code}</span>
                  <span className="bg-[#FFD400] text-[#121212] text-xs font-bold px-2 py-0.5 rounded-full">{c.discount}</span>
                </div>
                <p className="text-xs text-gray-500">{c.desc}</p>
                <p className="text-xs text-gray-400 mt-0.5">Válido até {c.expiry}</p>
              </div>
              <button onClick={() => copyCoupon(c.code)} className={`shrink-0 flex items-center gap-1.5 font-bold text-xs px-3 py-2 rounded-xl transition-all ${copiedCoupon === c.code ? "bg-green-100 text-green-600" : "bg-[#F5F5F5] text-[#121212] hover:bg-[#FFD400]"}`}>
                {copiedCoupon === c.code ? <><Check size={12} />Copiado!</> : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copiar</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[#121212] text-lg">Informações pessoais</h3>
        {!editMode && (
          <button onClick={() => setEditMode(true)} className="flex items-center gap-2 text-sm font-semibold text-[#121212] border-2 border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#FFD400] transition-all">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar
          </button>
        )}
      </div>
      {savedMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-green-700 text-sm font-semibold">
          <Check size={15} /> Informações salvas com sucesso!
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { label: "Nome", key: "firstName", placeholder: "Seu nome" },
          { label: "Sobrenome", key: "lastName", placeholder: "Seu sobrenome" },
          { label: "CPF", key: "cpf", placeholder: "000.000.000-00" },
          { label: "E-mail", key: "email", placeholder: "seu@email.com" },
          { label: "Telefone", key: "phone", placeholder: "(11) 99999-9999" },
          { label: "Data de nascimento", key: "dob", placeholder: "DD/MM/AAAA" },
        ].map(({ label, key, placeholder }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-[#121212]">{label}</label>
            <input
              value={formData[key as keyof typeof formData] ?? ""}
              onChange={(e) => setFormData((d) => ({ ...d, [key]: e.target.value }))}
              placeholder={placeholder}
              disabled={!editMode}
              className={`border-2 rounded-xl px-4 py-3 text-sm outline-none transition-all ${editMode ? "border-gray-200 focus:border-[#FFD400] bg-white" : "border-gray-100 bg-gray-50 text-gray-600 cursor-not-allowed"}`}
            />
          </div>
        ))}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-[#121212]">Gênero (opcional)</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData((d) => ({ ...d, gender: e.target.value }))}
            disabled={!editMode}
            className={`border-2 rounded-xl px-4 py-3 text-sm outline-none transition-all ${editMode ? "border-gray-200 focus:border-[#FFD400] bg-white" : "border-gray-100 bg-gray-50 text-gray-600 cursor-not-allowed"}`}
          >
            <option>Feminino</option><option>Masculino</option><option>Não-binário</option><option>Prefiro não informar</option>
          </select>
        </div>
      </div>
      {editMode && (
        <div className="flex gap-3 mt-6 flex-wrap">
          <button onClick={savePersonalInfo} className="flex items-center gap-2 bg-[#FFD400] text-[#121212] font-black px-6 py-3 rounded-xl hover:bg-yellow-300 transition-all">
            <Check size={15} /> Salvar alterações
          </button>
          <button onClick={() => { setEditMode(false); setFormData({ ...MOCK_USER }); }} className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold px-6 py-3 rounded-xl hover:border-gray-400 transition-all">
            <X size={15} /> Cancelar
          </button>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="flex flex-col gap-4">
      {MOCK_ORDERS.map((o) => {
        const statusColor: Record<string, string> = {
          "Entregue": "bg-green-100 text-green-700",
          "Em trânsito": "bg-blue-100 text-blue-700",
          "Cancelado": "bg-red-100 text-red-600",
        };
        return (
          <div key={o.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-4 items-center flex-wrap sm:flex-nowrap">
            <img src={o.img} alt="Produto" className="w-16 h-16 rounded-xl object-cover shrink-0 bg-gray-100" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-[#121212]">{o.id}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor[o.status] ?? "bg-gray-100 text-gray-600"}`}>{o.status}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{o.date} · {o.items} {o.items === 1 ? "item" : "itens"}</p>
              <p className="font-bold text-[#121212] mt-1">R$ {fmt(o.total)}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button className="text-xs font-semibold border-2 border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#121212] transition-all flex items-center gap-1"><Package size={12} /> Detalhes</button>
              {o.status === "Em trânsito" && <button className="text-xs font-semibold bg-[#FFD400] text-[#121212] px-3 py-1.5 rounded-lg hover:bg-yellow-300 transition-all flex items-center gap-1"><Truck size={12} /> Rastrear</button>}
              {o.status === "Entregue" && <button className="text-xs font-semibold border-2 border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#121212] transition-all flex items-center gap-1"><RefreshCw size={12} /> Recomprar</button>}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderWishlist = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {PRODUCTS.slice(0, 6).map((p) => (
        <div key={p.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="relative aspect-[3/4] bg-[#F5F5F5] overflow-hidden">
            <img src={p.img.replace("w=700&h=900", "w=300&h=400")} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
            <button className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
              <Heart size={13} className="fill-red-500 text-red-500" />
            </button>
          </div>
          <div className="p-3">
            <p className="text-xs font-semibold text-[#121212] leading-tight line-clamp-1">{p.name}</p>
            <p className="font-black text-[#121212] mt-1">R$ {fmt(p.price)}</p>
            <button onClick={onGoHome} className="w-full mt-2 bg-[#121212] text-white font-bold text-xs py-2 rounded-lg hover:bg-[#2B2B2B] transition-colors">
              Ver produto
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAddresses = () => (
    <div className="flex flex-col gap-4">
      {addresses.map((addr) => (
        <div key={addr.id} className={`bg-white rounded-2xl p-5 border-2 shadow-sm ${addr.isDefault ? "border-[#FFD400]" : "border-gray-100"}`}>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-[#121212]">{addr.nickname}</p>
                {addr.isDefault && <span className="text-[10px] bg-[#FFD400] text-[#121212] font-bold px-2 py-0.5 rounded-full">Padrão</span>}
              </div>
              <p className="text-sm text-gray-600">{addr.name}</p>
              <p className="text-sm text-gray-600">{addr.street}</p>
              <p className="text-sm text-gray-600">{addr.city}, {addr.state} · {addr.zip}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {!addr.isDefault && (
                <button onClick={() => setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === addr.id })))} className="text-xs font-semibold border-2 border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#FFD400] transition-all">
                  Definir padrão
                </button>
              )}
              <button className="text-xs font-semibold border-2 border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#121212] transition-all">Editar</button>
              <button onClick={() => setAddresses((prev) => prev.filter((a) => a.id !== addr.id))} className="text-xs font-semibold border-2 border-red-100 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </div>
      ))}
      {addresses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <MapPin size={36} className="text-gray-200 mx-auto mb-3" />
          <p className="font-semibold text-gray-500">Nenhum endereço salvo</p>
          <p className="text-xs text-gray-400 mt-1">Adicione um endereço para agilizar suas compras</p>
        </div>
      )}
      <button onClick={() => setAddingAddress(true)} className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 text-gray-600 font-semibold py-4 rounded-2xl hover:border-[#FFD400] hover:text-[#121212] transition-all">
        <Plus size={16} /> Adicionar endereço
      </button>
      {addingAddress && (
        <div className="bg-white rounded-2xl p-5 border-2 border-[#FFD400] shadow-sm">
          <h4 className="font-bold text-[#121212] mb-4">Novo endereço</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {["Apelido (ex: Casa)", "Nome do destinatário", "Endereço completo", "Cidade", "Estado", "CEP"].map((pl) => (
              <input key={pl} placeholder={pl} className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FFD400] transition-colors" />
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setAddingAddress(false)} className="flex-1 bg-[#FFD400] text-[#121212] font-bold py-3 rounded-xl hover:bg-yellow-300 transition-all text-sm">Salvar endereço</button>
            <button onClick={() => setAddingAddress(false)} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:border-gray-400 transition-all text-sm">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderPayments = () => (
    <div className="flex flex-col gap-4">
      {payments.map((pm) => (
        <div key={pm.id} className={`bg-white rounded-2xl p-5 border-2 shadow-sm flex items-center gap-4 flex-wrap sm:flex-nowrap ${pm.isDefault ? "border-[#FFD400]" : "border-gray-100"}`}>
          <div className="w-12 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: pm.color + "20", border: `2px solid ${pm.color}40` }}>
            <span className="text-xs font-black" style={{ color: pm.color }}>{pm.type === "PIX" ? "PIX" : pm.type[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-[#121212]">{pm.type}{pm.last4 ? ` ···· ${pm.last4}` : ""}</p>
              {pm.isDefault && <span className="text-[10px] bg-[#FFD400] text-[#121212] font-bold px-2 py-0.5 rounded-full">Padrão</span>}
            </div>
            {pm.expiry && <p className="text-xs text-gray-400 mt-0.5">Válido até {pm.expiry}</p>}
            {pm.type === "PIX" && <p className="text-xs text-gray-400 mt-0.5">Pagamento instantâneo</p>}
          </div>
          <div className="flex gap-2 flex-wrap">
            {!pm.isDefault && <button onClick={() => setPayments((prev) => prev.map((p) => ({ ...p, isDefault: p.id === pm.id })))} className="text-xs font-semibold border-2 border-gray-200 px-3 py-1.5 rounded-lg hover:border-[#FFD400] transition-all">Padrão</button>}
            <button onClick={() => setPayments((prev) => prev.filter((p) => p.id !== pm.id))} className="text-xs font-semibold border-2 border-red-100 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"><Trash2 size={12} /></button>
          </div>
        </div>
      ))}
      <button className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 text-gray-600 font-semibold py-4 rounded-2xl hover:border-[#FFD400] hover:text-[#121212] transition-all">
        <Plus size={16} /> Adicionar forma de pagamento
      </button>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {[
        { key: "emailPromos", label: "Promoções por e-mail", desc: "Receba ofertas e descontos exclusivos" },
        { key: "orderUpdates", label: "Atualizações de pedidos", desc: "Confirmações e status dos seus pedidos" },
        { key: "shipping", label: "Notificações de entrega", desc: "Alertas de envio e entrega" },
        { key: "newCollection", label: "Novas coleções", desc: "Seja a primeira a saber sobre lançamentos" },
        { key: "discounts", label: "Alertas de desconto", desc: "Quando produtos da sua lista entrarem em promoção" },
        { key: "newsletter", label: "Newsletter", desc: "Conteúdo de moda fitness e lifestyle" },
        { key: "recommendations", label: "Recomendações personalizadas", desc: "Produtos baseados no seu histórico" },
      ].map(({ key, label, desc }, i, arr) => (
        <div key={key} className={`flex items-center justify-between px-5 py-4 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
          <div>
            <p className="font-semibold text-[#121212] text-sm">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
          </div>
          <Toggle on={notifs[key as keyof typeof notifs]} onToggle={() => setNotifs((n) => ({ ...n, [key]: !n[key as keyof typeof notifs] }))} />
        </div>
      ))}
    </div>
  );

  const renderSecurity = () => (
    <div className="flex flex-col gap-5">
      {/* Security status */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-[#121212] mb-4">Status de segurança</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "E-mail verificado", ok: true, value: formData.email },
            { label: "Telefone verificado", ok: true, value: formData.phone },
            { label: "Força da senha", ok: true, value: "Forte" },
            { label: "Autenticação em 2 fatores", ok: twoFA, value: twoFA ? "Ativada" : "Desativada" },
            { label: "Último acesso", ok: true, value: "Hoje, 14h32" },
            { label: "Sessões ativas", ok: true, value: "2 dispositivos" },
          ].map(({ label, ok, value }) => (
            <div key={label} className="flex items-center gap-3 bg-[#F5F5F5] rounded-xl p-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${ok ? "bg-green-100" : "bg-red-100"}`}>
                {ok ? <Check size={13} className="text-green-600" /> : <AlertCircle size={13} className="text-red-500" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-semibold text-[#121212] truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-[#121212] mb-4">Alterar senha</h3>
        {pwSaved && <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-green-700 text-sm font-semibold"><Check size={14} /> Senha alterada com sucesso!</div>}
        <div className="flex flex-col gap-3 max-w-md">
          {[
            { label: "Senha atual", val: curPw, set: setCurPw, vis: showCurPw, setVis: setShowCurPw },
            { label: "Nova senha", val: newPw, set: setNewPw, vis: showNewPw, setVis: setShowNewPw },
            { label: "Confirmar nova senha", val: confirmPw, set: setConfirmPw, vis: showNewPw, setVis: setShowNewPw },
          ].map(({ label, val, set, vis, setVis }) => (
            <div key={label} className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#121212]">{label}</label>
              <div className="relative">
                <input type={vis ? "text" : "password"} value={val} onChange={(e) => set(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:border-[#FFD400] transition-colors" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2"><EyeToggle v={vis} set={setVis} /></div>
              </div>
            </div>
          ))}
          {newPw.length > 0 && (
            <div>
              <div className="flex gap-1 mb-1">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength ? ["","bg-red-400","bg-orange-400","bg-yellow-400","bg-green-400","bg-green-500"][pwStrength] : "bg-gray-200"}`} />
                ))}
              </div>
            </div>
          )}
          <button onClick={() => { setPwSaved(true); setCurPw(""); setNewPw(""); setConfirmPw(""); setTimeout(() => setPwSaved(false), 3000); }} className="bg-[#FFD400] text-[#121212] font-black py-3 rounded-xl hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 text-sm mt-1">
            <ShieldCheck size={15} /> Salvar nova senha
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-bold text-[#121212]">Autenticação em 2 fatores</h3>
          <p className="text-sm text-gray-500 mt-0.5">Adiciona uma camada extra de segurança à sua conta</p>
          <span className={`text-xs font-bold mt-1 inline-block ${twoFA ? "text-green-600" : "text-gray-400"}`}>{twoFA ? "✓ Ativada" : "Desativada"}</span>
        </div>
        <Toggle on={twoFA} onToggle={() => setTwoFA((v) => !v)} />
      </div>

      {/* Danger zone */}
      <div className="bg-red-50 rounded-2xl border-2 border-red-100 p-5">
        <h3 className="font-bold text-red-600 mb-1">Zona de perigo</h3>
        <p className="text-sm text-red-400 mb-4">Esta ação é permanente e não pode ser desfeita.</p>
        <button onClick={() => setDeleteModal(true)} className="flex items-center gap-2 border-2 border-red-400 text-red-600 font-bold px-5 py-2.5 rounded-xl hover:bg-red-100 transition-all text-sm">
          <Trash2 size={14} /> Excluir minha conta
        </button>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: "❓", label: "Central de Ajuda", desc: "Respostas para as dúvidas mais frequentes", action: "Acessar FAQ" },
          { icon: "💬", label: "Chat ao Vivo", desc: "Converse com nossa equipe em tempo real", action: "Iniciar chat" },
          { icon: "📞", label: "Falar no WhatsApp", desc: "(11) 99999-9999 · Seg–Sex 9h–18h", action: "Abrir WhatsApp" },
          { icon: "✉️", label: "Enviar E-mail", desc: "contato@cicerafitness.com.br", action: "Enviar mensagem" },
          { icon: "🔄", label: "Devoluções e Trocas", desc: "Saiba como trocar ou devolver produtos", action: "Ver política" },
          { icon: "🚚", label: "Informações de Entrega", desc: "Prazos, regiões e formas de envio", action: "Ver fretes" },
        ].map(({ icon, label, desc, action }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-4 items-start hover:border-[#FFD400] transition-all group cursor-pointer">
            <span className="text-2xl shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#121212] text-sm">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">{desc}</p>
              <p className="text-xs font-semibold text-[#FFD400] mt-2 group-hover:underline">{action} →</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const sectionContent: Record<ProfileSection, React.ReactNode> = {
    overview: renderOverview(),
    orders: renderOrders(),
    wishlist: renderWishlist(),
    addresses: renderAddresses(),
    payments: renderPayments(),
    notifications: renderNotifications(),
    security: renderSecurity(),
    support: renderSupport(),
  };

  const sectionTitles: Record<ProfileSection, [string, string]> = {
    overview: ["Minha Conta", "Gerencie suas informações e preferências"],
    orders: ["Meus Pedidos", "Histórico de compras e rastreamento"],
    wishlist: ["Lista de Desejos", "Produtos que você salvou"],
    addresses: ["Endereços", "Gerencie seus endereços de entrega"],
    payments: ["Pagamentos", "Formas de pagamento salvas"],
    notifications: ["Notificações", "Controle o que você recebe"],
    security: ["Privacidade e Segurança", "Mantenha sua conta protegida"],
    support: ["Suporte", "Estamos aqui para ajudar"],
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <button onClick={onGoHome} className="hover:text-[#FFD400] transition-colors">Home</button>
            <ChevronRight size={12} />
            <span className="text-[#121212] font-medium">Minha Conta</span>
          </nav>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-gray-500">Bem-vinda de volta, <span className="font-bold text-[#FFD400]">{formData.firstName}</span>!</p>
              <h1 className="font-[Barlow_Condensed,sans-serif] text-4xl font-black uppercase text-[#121212]">{sectionTitles[section][0]}</h1>
              <p className="text-gray-500 text-sm mt-0.5">{sectionTitles[section][1]}</p>
            </div>
            {/* Mobile nav button */}
            <button onClick={() => setMobileNavOpen(true)} className="lg:hidden flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold px-4 py-2 rounded-xl text-sm hover:border-[#121212] transition-all">
              <Menu size={16} /> Menu da conta
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8 items-start">

          {/* ── Sidebar desktop ────────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-2 sticky top-24">
            {/* Profile mini */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#FFD400] flex items-center justify-center font-black text-[#121212] shrink-0 overflow-hidden">
                {avatarPreview ? <img src={avatarPreview} alt="" className="w-full h-full object-cover" /> : formData.firstName[0]}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[#121212] text-sm truncate">{formData.firstName} {formData.lastName}</p>
                <p className="text-xs text-[#FFD400] font-semibold">{MOCK_USER.loyalty}</p>
              </div>
            </div>

            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {navItems.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setSection(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all border-b border-gray-50 last:border-0 text-left ${section === key ? "bg-[#FFD400] text-[#121212]" : "text-gray-600 hover:bg-[#F5F5F5] hover:text-[#121212]"}`}
                >
                  <span className={section === key ? "text-[#121212]" : "text-gray-400"}>{icon}</span>
                  {label}
                  {section === key && <ChevronRight size={14} className="ml-auto" />}
                </button>
              ))}
              <button onClick={onGoHome} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all border-t border-gray-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sair da conta
              </button>
            </nav>
          </aside>

          {/* ── Main content ───────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Personal info form always visible in overview */}
            {section === "overview" && (
              <>
                {sectionContent.overview}
                <div className="mt-2">{renderPersonalInfo()}</div>
              </>
            )}
            {section !== "overview" && sectionContent[section]}
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
          <div className="relative w-72 bg-white h-full flex flex-col shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FFD400] flex items-center justify-center font-black text-[#121212] overflow-hidden shrink-0">
                  {avatarPreview ? <img src={avatarPreview} alt="" className="w-full h-full object-cover" /> : formData.firstName[0]}
                </div>
                <div>
                  <p className="font-bold text-[#121212] text-sm">{formData.firstName}</p>
                  <p className="text-xs text-[#FFD400] font-semibold">{MOCK_USER.loyalty}</p>
                </div>
              </div>
              <button onClick={() => setMobileNavOpen(false)} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center"><X size={15} /></button>
            </div>
            <nav className="flex flex-col p-3 gap-1 flex-1">
              {navItems.map(({ key, label, icon }) => (
                <button key={key} onClick={() => { setSection(key); setMobileNavOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${section === key ? "bg-[#FFD400] text-[#121212]" : "text-gray-600 hover:bg-[#F5F5F5]"}`}>
                  <span>{icon}</span>{label}
                </button>
              ))}
            </nav>
            <div className="p-3 border-t border-gray-100">
              <button onClick={onGoHome} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sair da conta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete account modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModal(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl p-8 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={26} className="text-red-500" />
            </div>
            <h3 className="font-[Barlow_Condensed,sans-serif] text-2xl font-black uppercase text-[#121212] mb-2">Excluir conta?</h3>
            <p className="text-gray-500 text-sm mb-5 leading-relaxed">Esta ação é permanente. Todos os seus dados, pedidos e preferências serão excluídos e não poderão ser recuperados.</p>
            <input type="password" placeholder="Confirme sua senha" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 transition-colors mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(false)} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:border-gray-400 transition-all text-sm">Cancelar</button>
              <button className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-all text-sm">Excluir conta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}