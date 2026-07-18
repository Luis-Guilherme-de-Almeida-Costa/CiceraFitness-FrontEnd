import { useState, useEffect } from "react";
import { X, Zap, Check, Mail, ArrowRight, AlertCircle, ShieldCheck, User, Lock } from "lucide-react";
import InputField from "@/app/ui/auth/input-field";
import PasswordStrengthItem from "@/app/ui/auth/password-strength-item";
import SocialBtn from "@/app/ui/auth/social-btn";
import { AuthTab, AuthStep } from "@/app/lib/definitions";
import { fmt } from "@/app/lib/utils";

export default function AuthPage({
  defaultTab = "login",
  onGoHome,
  onSuccess,
}: {
  defaultTab?: AuthTab;
  onGoHome: () => void;
  onSuccess: () => void;
}) {
  const [tab, setTab] = useState<AuthTab>(defaultTab);
  const [step, setStep] = useState<AuthStep>("form");
  const [forgotOpen, setForgotOpen] = useState(false);

  // login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginPwVisible, setLoginPwVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // register fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [regPw, setRegPw] = useState("");
  const [regPwConfirm, setRegPwConfirm] = useState("");
  const [regPwVisible, setRegPwVisible] = useState(false);
  const [regPwConfirmVisible, setRegPwConfirmVisible] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [terms, setTerms] = useState(false);
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  // forgot password modal
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => { setTab(defaultTab); }, [defaultTab]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  // Password strength checks
  const pwChecks = {
    length: regPw.length >= 8,
    upper: /[A-Z]/.test(regPw),
    lower: /[a-z]/.test(regPw),
    number: /\d/.test(regPw),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(regPw),
  };
  const pwStrength = Object.values(pwChecks).filter(Boolean).length;
  const pwStrengthLabel = ["", "Muito fraca", "Fraca", "Razoável", "Forte", "Muito forte"][pwStrength];
  const pwStrengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-500"][pwStrength];

  const validateLogin = () => {
    const errs: Record<string, string> = {};
    if (!loginEmail) errs.email = "Email obrigatório";
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) errs.email = "Email inválido";
    if (!loginPw) errs.password = "Senha obrigatória";
    else if (loginPw.length < 6) errs.password = "Senha incorreta";
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateRegister = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "Nome obrigatório";
    if (!lastName.trim()) errs.lastName = "Sobrenome obrigatório";
    if (!regEmail) errs.email = "Email obrigatório";
    else if (!/\S+@\S+\.\S+/.test(regEmail)) errs.email = "Email inválido";
    if (!regPw) errs.password = "Senha obrigatória";
    else if (pwStrength < 3) errs.password = "Senha muito fraca";
    if (regPwConfirm !== regPw) errs.confirm = "As senhas não coincidem";
    if (!terms) errs.terms = "Aceite os termos para continuar";
    setRegErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = () => {
    if (!validateLogin()) return;
    setStep("loading");
    setTimeout(() => setStep("success"), 1800);
  };

  const handleRegister = () => {
    if (!validateRegister()) return;
    setStep("loading");
    setTimeout(() => setStep("verify"), 1800);
  };

  const switchTab = (t: AuthTab) => {
    setTab(t);
    setLoginErrors({});
    setRegErrors({});
    setStep("form");
  };

  // ── Eye icon helper ──────────────────────────────────────────────────────
  const EyeBtn = ({ visible, onToggle }: { visible: boolean; onToggle: () => void }) => (
    <button type="button" onClick={onToggle} className="text-gray-400 hover:text-[#121212] transition-colors">
      {visible
        ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  );

  // ── Success screen ───────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[#FFD400] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-[#121212]" />
          </div>
          <h2 className="font-[Barlow_Condensed,sans-serif] text-4xl font-black uppercase text-[#121212] mb-3">
            Bem-vinda à Cicera!
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Sua conta foi criada com sucesso. Aproveite frete grátis e descontos exclusivos para membros.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={onGoHome} className="w-full bg-[#FFD400] text-[#121212] font-black py-4 rounded-xl hover:bg-yellow-300 transition-all flex items-center justify-center gap-2">
              <ArrowRight size={17} /> Continuar comprando
            </button>
            <button className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl hover:border-[#121212] transition-all">
              Ir para minha conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Email verification screen ────────────────────────────────────────────
  if (step === "verify") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={36} className="text-[#FFD400]" />
          </div>
          <h2 className="font-[Barlow_Condensed,sans-serif] text-3xl font-black uppercase text-[#121212] mb-3">
            Verifique seu e-mail
          </h2>
          <p className="text-gray-500 mb-2 leading-relaxed">
            Enviamos um link de confirmação para
          </p>
          <p className="font-bold text-[#121212] mb-8">{regEmail}</p>
          <div className="bg-[#F5F5F5] rounded-2xl p-4 mb-6 text-sm text-gray-500">
            Não recebeu? Verifique sua pasta de spam ou solicite um novo e-mail.
          </div>
          <div className="flex flex-col gap-3">
            <button className="w-full bg-[#FFD400] text-[#121212] font-black py-4 rounded-xl hover:bg-yellow-300 transition-all">
              Reenviar e-mail
            </button>
            <button onClick={() => setStep("form")} className="text-sm text-gray-500 hover:text-[#121212] transition-colors font-medium">
              Alterar e-mail de cadastro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* ── Left panel — desktop only ──────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1645810798586-08e892108d67?w=900&h=1200&fit=crop&auto=format"
          alt="Cicera Fitness lifestyle"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#121212]/90 via-[#121212]/70 to-[#FFD400]/30" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16">
          {/* Logo */}
          <button onClick={onGoHome} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#FFD400] rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-[#121212] fill-current" />
            </div>
            <span className="font-[Barlow_Condensed,sans-serif] text-3xl font-black uppercase text-white">
              Cicera<span className="text-[#FFD400]">.</span>
            </span>
          </button>

          {/* Hero copy */}
          <div>
            <span className="inline-flex items-center gap-2 text-[#FFD400] font-semibold text-sm uppercase tracking-widest mb-5">
              <span className="w-6 h-0.5 bg-[#FFD400]" /> Bem-vinda de volta
            </span>
            <h2 className="font-[Barlow_Condensed,sans-serif] text-5xl xl:text-6xl font-black uppercase text-white leading-none mb-5">
              Vista sua<br /><span className="text-[#FFD400]">melhor</span><br />versão.
            </h2>
            <p className="text-gray-300 text-base leading-relaxed max-w-sm">
              Descubra roupas fitness premium desenvolvidas para conforto, confiança e alta performance.
            </p>

            {/* Social proof */}
            <div className="flex gap-6 mt-10 pt-8 border-t border-white/10">
              {[["18k+", "Clientes"], ["4.9★", "Avaliação"], ["30d", "Troca grátis"]].map(([n, l]) => (
                <div key={l}>
                  <p className="text-[#FFD400] font-black text-xl leading-none">{n}</p>
                  <p className="text-gray-400 text-xs mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom trust */}
          <div className="flex flex-wrap gap-3">
            {["🔒 Compra segura", "🚚 Entrega rápida", "🔄 Troca grátis"].map((t) => (
              <span key={t} className="text-xs text-white/70 bg-white/10 px-3 py-1.5 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — auth card ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-start lg:justify-center overflow-y-auto py-8 px-4 sm:px-8">
        {/* Mobile logo */}
        <button onClick={onGoHome} className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#FFD400] rounded-lg flex items-center justify-center">
            <Zap size={15} className="text-[#121212] fill-current" />
          </div>
          <span className="font-[Barlow_Condensed,sans-serif] text-2xl font-black uppercase text-[#121212]">
            Cicera<span className="text-[#FFD400]">.</span>
          </span>
        </button>

        <div className="w-full max-w-[440px]">
          {/* Tab switcher */}
          <div className="bg-[#F5F5F5] rounded-2xl p-1 flex mb-8">
            {(["login", "register"] as AuthTab[]).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  tab === t ? "bg-white text-[#121212] shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          {/* ── LOGIN FORM ────────────────────────────────────────────── */}
          {tab === "login" && step === "form" && (
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="font-[Barlow_Condensed,sans-serif] text-4xl font-black uppercase text-[#121212]">
                  Entrar
                </h1>
                <p className="text-gray-500 text-sm mt-1">Acesse sua conta Cicera Fitness</p>
              </div>

              <div className="flex flex-col gap-4">
                <InputField
                  label="E-mail"
                  type="email"
                  value={loginEmail}
                  onChange={setLoginEmail}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  error={loginErrors.email}
                />
                <InputField
                  label="Senha"
                  type={loginPwVisible ? "text" : "password"}
                  value={loginPw}
                  onChange={setLoginPw}
                  placeholder="Sua senha"
                  autoComplete="current-password"
                  error={loginErrors.password}
                  suffix={<EyeBtn visible={loginPwVisible} onToggle={() => setLoginPwVisible((v) => !v)} />}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setRememberMe((v) => !v)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${rememberMe ? "bg-[#FFD400] border-[#FFD400]" : "border-gray-300 hover:border-[#FFD400]"}`}
                  >
                    {rememberMe && <Check size={11} className="text-[#121212]" />}
                  </div>
                  <span className="text-sm text-gray-600">Lembrar de mim</span>
                </label>
                <button onClick={() => setForgotOpen(true)} className="text-sm text-[#121212] font-semibold hover:text-[#FFD400] transition-colors underline underline-offset-2">
                  Esqueci a senha
                </button>
              </div>

              <button onClick={handleLogin} className="w-full bg-[#FFD400] text-[#121212] font-black py-4 rounded-xl hover:bg-yellow-300 transition-all active:scale-[0.98] text-base flex items-center justify-center gap-2">
                Entrar na minha conta <ArrowRight size={17} />
              </button>

              <div className="flex items-center gap-3">
                <span className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">ou continue com</span>
                <span className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="flex gap-3">
                <SocialBtn icon={<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>} label="Google" />
                <SocialBtn icon={<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>} label="Facebook" />
                <SocialBtn icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.453 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>} label="Apple" />
              </div>

              <p className="text-center text-sm text-gray-500">
                Não tem conta?{" "}
                <button onClick={() => switchTab("register")} className="font-bold text-[#121212] hover:text-[#FFD400] transition-colors underline underline-offset-2">
                  Criar conta grátis
                </button>
              </p>
            </div>
          )}

          {/* ── REGISTER FORM ─────────────────────────────────────────── */}
          {tab === "register" && step === "form" && (
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="font-[Barlow_Condensed,sans-serif] text-4xl font-black uppercase text-[#121212]">
                  Criar conta
                </h1>
                <p className="text-gray-500 text-sm mt-1">Junte-se a mais de 18 mil clientes</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Nome" value={firstName} onChange={setFirstName} placeholder="Ana" error={regErrors.firstName} />
                  <InputField label="Sobrenome" value={lastName} onChange={setLastName} placeholder="Silva" error={regErrors.lastName} />
                </div>
                <InputField label="E-mail" type="email" value={regEmail} onChange={setRegEmail} placeholder="seu@email.com" autoComplete="email" error={regErrors.email} />
                <InputField
                  label="Telefone"
                  type="tel"
                  value={phone}
                  onChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"))}
                  placeholder="(11) 99999-9999"
                />
                <div className="flex flex-col gap-1">
                  <InputField
                    label="Senha"
                    type={regPwVisible ? "text" : "password"}
                    value={regPw}
                    onChange={setRegPw}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    error={regErrors.password}
                    suffix={<EyeBtn visible={regPwVisible} onToggle={() => setRegPwVisible((v) => !v)} />}
                  />
                  {/* Strength bar */}
                  {regPw.length > 0 && (
                    <div className="mt-1">
                      <div className="flex gap-1 mb-1.5">
                        {[1,2,3,4,5].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength ? pwStrengthColor : "bg-gray-200"}`} />
                        ))}
                      </div>
                      <p className={`text-xs font-semibold ${["","text-red-500","text-orange-500","text-yellow-600","text-green-500","text-green-600"][pwStrength]}`}>
                        {pwStrengthLabel}
                      </p>
                      <ul className="mt-2 space-y-1">
                        <PasswordStrengthItem ok={pwChecks.length} label="Mínimo 8 caracteres" />
                        <PasswordStrengthItem ok={pwChecks.upper} label="Letra maiúscula" />
                        <PasswordStrengthItem ok={pwChecks.lower} label="Letra minúscula" />
                        <PasswordStrengthItem ok={pwChecks.number} label="Número" />
                        <PasswordStrengthItem ok={pwChecks.special} label="Caractere especial (!@#$...)" />
                      </ul>
                    </div>
                  )}
                </div>
                <InputField
                  label="Confirmar senha"
                  type={regPwConfirmVisible ? "text" : "password"}
                  value={regPwConfirm}
                  onChange={setRegPwConfirm}
                  placeholder="Repita sua senha"
                  autoComplete="new-password"
                  error={regErrors.confirm}
                  suffix={<EyeBtn visible={regPwConfirmVisible} onToggle={() => setRegPwConfirmVisible((v) => !v)} />}
                />
                {regPwConfirm && regPwConfirm === regPw && (
                  <p className="text-xs text-green-600 flex items-center gap-1 -mt-2">
                    <Check size={11} /> Senhas coincidem
                  </p>
                )}
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col gap-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div onClick={() => setNewsletter((v) => !v)} className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${newsletter ? "bg-[#FFD400] border-[#FFD400]" : "border-gray-300 hover:border-[#FFD400]"}`}>
                    {newsletter && <Check size={11} className="text-[#121212]" />}
                  </div>
                  <span className="text-sm text-gray-600 leading-tight">Quero receber novidades, promoções e ofertas exclusivas por e-mail</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <div onClick={() => setTerms((v) => !v)} className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${terms ? "bg-[#FFD400] border-[#FFD400]" : regErrors.terms ? "border-red-400" : "border-gray-300 hover:border-[#FFD400]"}`}>
                    {terms && <Check size={11} className="text-[#121212]" />}
                  </div>
                  <span className="text-sm text-gray-600 leading-tight">
                    Li e aceito os{" "}
                    <a href="#" className="font-semibold text-[#121212] underline underline-offset-2 hover:text-[#FFD400] transition-colors">Termos de Uso</a>
                    {" "}e a{" "}
                    <a href="#" className="font-semibold text-[#121212] underline underline-offset-2 hover:text-[#FFD400] transition-colors">Política de Privacidade</a>
                  </span>
                </label>
                {regErrors.terms && <p className="text-xs text-red-500 flex items-center gap-1 -mt-1"><AlertCircle size={11} /> {regErrors.terms}</p>}
              </div>

              <button onClick={handleRegister} className="w-full bg-[#FFD400] text-[#121212] font-black py-4 rounded-xl hover:bg-yellow-300 transition-all active:scale-[0.98] text-base flex items-center justify-center gap-2">
                Criar minha conta <ArrowRight size={17} />
              </button>

              <div className="flex items-center gap-3">
                <span className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">ou continue com</span>
                <span className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="flex gap-3">
                <SocialBtn icon={<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>} label="Google" />
                <SocialBtn icon={<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>} label="Facebook" />
                <SocialBtn icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.453 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>} label="Apple" />
              </div>

              <p className="text-center text-sm text-gray-500">
                Já tem conta?{" "}
                <button onClick={() => switchTab("login")} className="font-bold text-[#121212] hover:text-[#FFD400] transition-colors underline underline-offset-2">
                  Entrar
                </button>
              </p>
            </div>
          )}

          {/* ── LOADING STATE ─────────────────────────────────────────── */}
          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <div className="w-16 h-16 border-4 border-[#F5F5F5] border-t-[#FFD400] rounded-full animate-spin" />
              <p className="font-semibold text-[#121212]">
                {tab === "login" ? "Autenticando..." : "Criando sua conta..."}
              </p>
              <p className="text-sm text-gray-400">Aguarde um momento</p>
            </div>
          )}

          {/* Trust bar */}
          {step === "form" && (
            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-2">
              {[
                { icon: <Lock size={13} className="text-[#FFD400]" />, text: "Login criptografado" },
                { icon: <ShieldCheck size={13} className="text-[#FFD400]" />, text: "Autenticação segura" },
                { icon: <User size={13} className="text-[#FFD400]" />, text: "Privacidade protegida" },
                { icon: <Zap size={13} className="text-[#FFD400]" />, text: "Loja oficial" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-gray-500">
                  {icon} {text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Forgot Password Modal ──────────────────────────────────────────── */}
      {forgotOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setForgotOpen(false); setForgotSent(false); setForgotEmail(""); }} />
          <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl p-8">
            <button onClick={() => { setForgotOpen(false); setForgotSent(false); setForgotEmail(""); }} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-gray-200 transition-colors">
              <X size={15} />
            </button>

            {forgotSent ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FFD400] rounded-full flex items-center justify-center mx-auto mb-5">
                  <Check size={28} className="text-[#121212]" />
                </div>
                <h3 className="font-[Barlow_Condensed,sans-serif] text-2xl font-black uppercase text-[#121212] mb-2">E-mail enviado!</h3>
                <p className="text-gray-500 text-sm mb-6">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
                <button onClick={() => { setForgotOpen(false); setForgotSent(false); setForgotEmail(""); }} className="w-full bg-[#FFD400] text-[#121212] font-bold py-3.5 rounded-xl hover:bg-yellow-300 transition-all">
                  Fechar
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center mb-5">
                  <Lock size={22} className="text-[#FFD400]" />
                </div>
                <h3 className="font-[Barlow_Condensed,sans-serif] text-2xl font-black uppercase text-[#121212] mb-1">Esqueceu a senha?</h3>
                <p className="text-gray-500 text-sm mb-6">Digite seu e-mail e enviaremos um link para redefinir sua senha.</p>
                <div className="flex flex-col gap-4">
                  <InputField
                    label="E-mail cadastrado"
                    type="email"
                    value={forgotEmail}
                    onChange={setForgotEmail}
                    placeholder="seu@email.com"
                  />
                  <button
                    onClick={() => forgotEmail && setForgotSent(true)}
                    disabled={!forgotEmail}
                    className="w-full bg-[#FFD400] text-[#121212] font-bold py-3.5 rounded-xl hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <Mail size={15} /> Enviar link de recuperação
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
