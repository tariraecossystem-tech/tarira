import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  X, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Send, 
  AlertCircle, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  FileText,
  HardHat,
  GraduationCap
} from "lucide-react";

export interface JobVacancy {
  id: string;
  title: string;
  category: 'quadros' | 'oficios';
  department: string;
  location: string;
  province?: string;
  type: string;
  contractDuration?: string;
  isLongTermTechnicalContract?: boolean;
  status: 'sourcing' | 'screening' | 'upcoming' | 'closed';
  statusLabel?: string;
  summary: string;
  requirements: string[];
  expectedOpenings: string;
  isMockup?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface TariraJobApplicationModalProps {
  isOpen: boolean;
  job: JobVacancy | null;
  candidateProfile?: any;
  onClose: () => void;
  onSuccess?: (application: any) => void;
  onNavigateToCreateProfile?: () => void;
  currentLang?: "pt" | "en";
}

export const TariraJobApplicationModal: React.FC<TariraJobApplicationModalProps> = ({
  isOpen,
  job,
  candidateProfile,
  onClose,
  onSuccess,
  onNavigateToCreateProfile,
  currentLang = "pt"
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("Maputo Cidade");
  const [experienceYears, setExperienceYears] = useState("1 a 3 anos");
  const [salaryExpectation, setSalaryExpectation] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [cvLink, setCvLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [applicationRef, setApplicationRef] = useState("");
  const [formError, setFormError] = useState("");

  // Pre-fill if candidate profile is provided or stored in localStorage
  useEffect(() => {
    if (candidateProfile) {
      if (candidateProfile.name) setFullName(candidateProfile.name);
      if (candidateProfile.email) setEmail(candidateProfile.email);
      if (candidateProfile.phone) setPhone(candidateProfile.phone);
      if (candidateProfile.province || candidateProfile.location) {
        setProvince(candidateProfile.province || candidateProfile.location);
      }
      if (candidateProfile.experienceYears) {
        setExperienceYears(candidateProfile.experienceYears);
      }
    } else {
      try {
        const storedProfile = localStorage.getItem("tarira_candidate_profile");
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          if (parsed.name) setFullName(parsed.name);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.province) setProvince(parsed.province);
        }
      } catch (e) {
        // ignore
      }
    }
    setSubmittedSuccess(false);
    setFormError("");
  }, [isOpen, job, candidateProfile]);

  if (!isOpen || !job) return null;

  const isConnectTechnical = job.category === 'oficios';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fullName.trim()) {
      setFormError("Por favor informe o seu nome completo.");
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setFormError("Por favor indique pelo menos um contacto (telefone/WhatsApp ou e-mail).");
      return;
    }

    setIsSubmitting(true);
    const refCode = `TAR-VAGA-${Date.now().toString().slice(-6)}`;

    const newApplication = {
      id: `app-${Date.now()}`,
      refCode,
      jobId: job.id,
      jobTitle: job.title,
      jobCategory: job.category,
      jobDepartment: job.department,
      jobLocation: job.location,
      jobProvince: job.province || province,
      jobContractDuration: job.contractDuration || job.type,
      isLongTermTechnicalContract: isConnectTechnical,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      applicantProvince: province,
      experienceYears,
      salaryExpectation: salaryExpectation.trim(),
      coverNote: coverNote.trim(),
      cvLink: cvLink.trim(),
      status: "Em Triagem",
      submittedAt: new Date().toISOString()
    };

    try {
      // 1. Save to local storage for instant candidate account sync
      const existing = JSON.parse(localStorage.getItem("tarira_user_job_applications") || "[]");
      existing.unshift(newApplication);
      localStorage.setItem("tarira_user_job_applications", JSON.stringify(existing));

      // 2. Remove pending banner lock once submitted
      localStorage.removeItem("tarira_pending_job_application");

      // 3. Optional POST to backend if running
      try {
        await fetch("/api/job-applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newApplication)
        });
      } catch (apiErr) {
        console.warn("Backend sync notice (offline or local fallback):", apiErr);
      }

      setApplicationRef(refCode);
      setSubmittedSuccess(true);
      if (onSuccess) {
        onSuccess(newApplication);
      }
    } catch (err: any) {
      setFormError("Ocorreu um erro ao processar a sua candidatura. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-6 animate-scale-up text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#172554] p-5 sm:p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
              isConnectTechnical ? 'bg-blue-400/20 text-blue-200 border border-blue-300/30' : 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/30'
            }`}>
              {isConnectTechnical ? (
                <>
                  <HardHat className="w-3.5 h-3.5" />
                  <span>TARIRA Connect · Contrato Técnico (&gt; 3 Meses)</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>TARIRA Recruit · Vaga Corporativa</span>
                </>
              )}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
            Candidatar a: {job.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-blue-200 mt-2 font-medium">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-300" />
              {job.department}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-300" />
              {job.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-bold text-white bg-blue-900/60 px-2 py-0.5 rounded-md">
              <Clock className="w-3.5 h-3.5 text-blue-300" />
              {job.contractDuration || job.type}
            </span>
          </div>
        </div>

        {/* Informational Guidance regarding Connect vs Recruit */}
        {isConnectTechnical && (
          <div className="bg-blue-50 border-b border-blue-200/80 px-5 sm:px-6 py-3 flex items-start gap-2.5 text-xs text-[#172554] leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Regime Contratual Técnico Estruturado (&gt; 3 Meses):</span> Esta vaga é destinada a contratos continuados com condomínios, indústrias e clientes corporativos geridos pela Tarira Connect. Não se trata de uma requisição de serviço pontual ou avulso.
            </div>
          </div>
        )}

        {submittedSuccess ? (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-slate-900">
                Candidatura Submetida com Sucesso!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                A sua candidatura à vaga <strong>{job.title}</strong> foi registada e encaminhada para a equipa de triagem da Tarira.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-500 font-mono text-xs">
                <span>Referência:</span>
                <span className="font-bold text-slate-900">{applicationRef}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-xs">
                <span>Candidato:</span>
                <span className="font-medium text-slate-800">{fullName}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-xs">
                <span>Tipo:</span>
                <span className="font-bold text-blue-800">
                  {isConnectTechnical ? 'Contrato Técnico (> 3 Meses)' : 'Vaga Corporativa Recruit'}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-xs">
                <span>Estado:</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold font-mono text-xs">
                  Em Triagem & Validação
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#172554] text-white text-xs font-bold hover:bg-[#1A3478] transition-all cursor-pointer shadow-sm"
              >
                Concluir & Fechar
              </button>

              {onNavigateToCreateProfile && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToCreateProfile();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white border border-slate-300 text-[#172554] text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Ver Perfil e Minhas Candidaturas
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome e apelido"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Contacto Telefónico / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+258 84/87 000 0000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  E-mail Profissional
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Província de Residência *
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  <option value="Maputo Cidade">Maputo Cidade</option>
                  <option value="Maputo Província">Maputo Província (Matola)</option>
                  <option value="Gaza">Gaza (Xai-Xai)</option>
                  <option value="Inhambane">Inhambane</option>
                  <option value="Sofala">Sofala (Beira)</option>
                  <option value="Manica">Manica (Chimoio)</option>
                  <option value="Tete">Tete</option>
                  <option value="Zambézia">Zambézia (Quelimane)</option>
                  <option value="Nampula">Nampula</option>
                  <option value="Cabo Delgado">Cabo Delgado (Pemba)</option>
                  <option value="Niassa">Niassa (Lichinga)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tempo de Prática / Experiência *
                </label>
                <select
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  <option value="Menos de 1 ano">Menos de 1 ano (Iniciante / Júnior)</option>
                  <option value="1 a 3 anos">1 a 3 anos (Técnico / Pleno)</option>
                  <option value="3 a 5 anos">3 a 5 anos (Experiente / Sénior)</option>
                  <option value="Mais de 5 anos">Mais de 5 anos (Especialista / Mestre)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Compensação / Pretensão Salarial (MZN)
                </label>
                <input
                  type="text"
                  value={salaryExpectation}
                  onChange={(e) => setSalaryExpectation(e.target.value)}
                  placeholder="Ex: 25.000 a 35.000 MT / Negociável"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Resumo de Competências & Experiência Prévia</span>
                <span className="text-xs text-slate-400 font-normal">Opcional, mas recomendado</span>
              </label>
              <textarea
                rows={3}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Descreva brevemente projetos, obras ou responsabilidades que já desempenhou nesta área..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Link do Currículo / Certificados / Portfólio (Google Drive, LinkedIn, etc.)
              </label>
              <input
                type="url"
                value={cvLink}
                onChange={(e) => setCvLink(e.target.value)}
                placeholder="https://drive.google.com/... ou https://linkedin.com/in/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Protegido pelo Ecossistema TARIRA
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#172554] hover:bg-[#1A3478] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "A Submeter..." : "Confirmar Candidatura"}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
