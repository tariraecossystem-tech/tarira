import React, { useState } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  Briefcase,
  Wrench,
  Users,
  ShieldCheck,
  Send,
  MessageCircle,
  Phone,
  Clock,
  Sparkles,
  MapPin
} from 'lucide-react';

export interface HireOrOpenJobPayload {
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  serviceUnit: 'connect' | 'recruit' | 'outsourcing';
  jobTitle: string;
  headcount: number;
  location: string;
  workModel: 'Presencial' | 'Híbrido' | 'Remoto';
  urgency: 'Imediata (24h - 48h)' | 'Esta Semana' | 'Próximo Mês';
  description: string;
}

interface TariraHireOrOpenJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUnit?: 'connect' | 'recruit' | 'outsourcing';
  onLogAudit?: (action: string, details: string) => void;
  currentLang?: 'pt' | 'en';
}

export const TariraHireOrOpenJobModal: React.FC<TariraHireOrOpenJobModalProps> = ({
  isOpen,
  onClose,
  defaultUnit = 'recruit',
  onLogAudit,
  currentLang = 'pt'
}) => {
  const [form, setForm] = useState<HireOrOpenJobPayload>({
    companyName: '',
    contactPerson: '',
    contactPhone: '+258 ',
    contactEmail: '',
    serviceUnit: defaultUnit,
    jobTitle: '',
    headcount: 1,
    location: 'Maputo',
    workModel: 'Presencial',
    urgency: 'Imediata (24h - 48h)',
    description: ''
  });

  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!form.companyName.trim()) {
      setErrorMessage(currentLang === 'pt' ? 'Por favor indique o nome da empresa.' : 'Please provide company name.');
      return;
    }
    if (!form.contactPerson.trim()) {
      setErrorMessage(currentLang === 'pt' ? 'Por favor indique o nome do responsável.' : 'Please provide contact person.');
      return;
    }
    if (!form.contactPhone.trim() || form.contactPhone.trim() === '+258') {
      setErrorMessage(currentLang === 'pt' ? 'Por favor indique um contacto de telefone ou WhatsApp.' : 'Please provide phone or WhatsApp contact.');
      return;
    }
    if (!form.jobTitle.trim()) {
      setErrorMessage(currentLang === 'pt' ? 'Por favor indique a especialidade ou título da vaga.' : 'Please provide job title or specialty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const randArr = new Uint32Array(1);
      crypto.getRandomValues(randArr);
      const refCode = `REQ-TARIRA-${new Date().getFullYear()}-${1000 + (randArr[0] % 9000)}`;
      const savedData = {
        ...form,
        refCode,
        createdAt: new Date().toISOString(),
        status: 'pending_review'
      };

      // Persist in localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('tarira_corporate_job_requests') || '[]');
        existing.unshift(savedData);
        localStorage.setItem('tarira_corporate_job_requests', JSON.stringify(existing.slice(0, 50)));
      } catch (err) {
        console.error('Failed to save job request to localStorage:', err);
      }

      if (onLogAudit) {
        onLogAudit(
          'REQUISICAO_VAGA_CRIADA',
          `Empresa: ${form.companyName}, Vaga: ${form.jobTitle}, Ref: ${refCode}, Unidade: ${form.serviceUnit}`
        );
      }

      setSubmittedRef(refCode);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const message = encodeURIComponent(
      `Olá Central TARIRA, gostaria de abrir uma requisição de profissionais para a empresa ${form.companyName || 'minha empresa'} (Vaga: ${form.jobTitle || 'A definir'}, Ref: ${submittedRef || 'Nova Requisição'}).`
    );
    window.open(`https://wa.me/258871425316?text=${message}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#172554] text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-400/20 border border-blue-300/30 text-blue-200 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              SLA Rápido 24h-48h • Garantia de Reposição
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-white leading-tight">
            {currentLang === 'pt' ? 'Precisa de contratar ou abrir uma vaga?' : 'Need to hire or post a vacancy?'}
          </h2>

          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-lg leading-relaxed">
            {currentLang === 'pt'
              ? 'A Tarira apresenta profissionais testados, referenciados e homologados prontos para atuar em Moçambique, sem desperdício de tempo e com segurança jurídica.'
              : 'Tarira delivers vetted, qualified candidates ready to work in Mozambique, backed by replacement guarantees and labor law compliance.'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {submittedRef ? (
            /* Success confirmation screen */
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Requisição Registada com Sucesso
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Obrigado, a sua solicitação foi recebida!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  A nossa equipa comercial e de Recrutamento & Seleção já iniciou a análise da vaga. 
                  Entraremos em contacto dentro de <strong>2 horas úteis</strong> para apresentar a proposta e a shortlist homologada.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-blue-200/60 pb-2">
                  <span className="text-slate-500 font-mono">Código de Referência:</span>
                  <span className="font-mono font-bold text-[#172554] bg-white px-2 py-0.5 rounded border border-blue-200">
                    {submittedRef}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-200/60 pb-2">
                  <span className="text-slate-500">Empresa:</span>
                  <span className="font-bold text-slate-800">{form.companyName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-200/60 pb-2">
                  <span className="text-slate-500">Vaga / Perfil:</span>
                  <span className="font-bold text-slate-800">{form.jobTitle} ({form.headcount} vaga{form.headcount > 1 ? 's' : ''})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Urgência:</span>
                  <span className="font-bold text-emerald-700">{form.urgency}</span>
                </div>
              </div>

              {/* Instant WhatsApp / Phone actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Acompanhar via WhatsApp (+258 87 142 5316)</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#172554] font-bold text-xs uppercase tracking-wider transition-all border border-slate-300 flex items-center justify-center cursor-pointer"
                >
                  <span>Concluir e Fechar</span>
                </button>
              </div>
            </div>
          ) : (
            /* Requisition Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Highlight Guarantees Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-slate-700 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#172554] shrink-0" />
                  <span><strong>Entrega Rápida:</strong> Shortlist em 24h a 48h</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#172554] shrink-0" />
                  <span><strong>Garantia:</strong> Reposição sem encargos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#172554] shrink-0" />
                  <span><strong>Conformidade:</strong> Lei 13/2023</span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Service Unit Choice */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono block mb-2">
                  Qual é o tipo de necessidade da sua empresa? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, serviceUnit: 'connect' }))}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      form.serviceUnit === 'connect'
                        ? 'bg-blue-50 border-[#172554] ring-2 ring-[#172554]/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-[#172554] mb-1">
                      <Wrench className="w-4 h-4 text-[#172554]" />
                      <span>Tarira Connect</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-tight">
                      Técnicos de campo, eletricistas, AVAC, canalização, serviços práticos diários.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, serviceUnit: 'recruit' }))}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      form.serviceUnit === 'recruit'
                        ? 'bg-blue-50 border-[#172554] ring-2 ring-[#172554]/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-[#172554] mb-1">
                      <Briefcase className="w-4 h-4 text-[#172554]" />
                      <span>Tarira Recruit</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-tight">
                      Quadros corporativos, TI, gestão, engenharia, finanças e contratação definitiva.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, serviceUnit: 'outsourcing' }))}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      form.serviceUnit === 'outsourcing'
                        ? 'bg-blue-50 border-[#172554] ring-2 ring-[#172554]/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-[#172554] mb-1">
                      <Users className="w-4 h-4 text-[#172554]" />
                      <span>Outsourcing (RPO)</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-tight">
                      Outsourcing de equipas inteiras, gestão de folha e processos sazonais.
                    </p>
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nome da Empresa / Organização *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.companyName}
                    onChange={(e) => setForm(f => ({ ...f, companyName: e.target.value }))}
                    placeholder="Ex: Moz Logística, Lda"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#172554]/30 focus:border-[#172554] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nome do Responsável / Solicitante *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.contactPerson}
                    onChange={(e) => setForm(f => ({ ...f, contactPerson: e.target.value }))}
                    placeholder="Ex: Dra. Ana Cossa (Diretora de RH)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#172554]/30 focus:border-[#172554] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Telefone / WhatsApp Comercial *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.contactPhone}
                    onChange={(e) => setForm(f => ({ ...f, contactPhone: e.target.value }))}
                    placeholder="+258 84/87 000 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#172554]/30 focus:border-[#172554] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    E-mail Institucional *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.contactEmail}
                    onChange={(e) => setForm(f => ({ ...f, contactEmail: e.target.value }))}
                    placeholder="rh@empresa.co.mz"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#172554]/30 focus:border-[#172554] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Título da Vaga / Especialidade Desejada *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.jobTitle}
                    onChange={(e) => setForm(f => ({ ...f, jobTitle: e.target.value }))}
                    placeholder="Ex: Engenheiro de Redes, Técnico AVAC, Contabilista"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#172554]/30 focus:border-[#172554] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Quantidade de Profissionais (Headcount)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={form.headcount}
                    onChange={(e) => setForm(f => ({ ...f, headcount: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#172554]/30 focus:border-[#172554] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Localidade / Província
                  </label>
                  <select
                    value={form.location}
                    onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#172554]/30 focus:border-[#172554] outline-none transition-all bg-white"
                  >
                    <option value="Maputo">Maputo Cidade</option>
                    <option value="Matola">Matola / Província de Maputo</option>
                    <option value="Beira">Beira (Sofala)</option>
                    <option value="Nampula">Nampula</option>
                    <option value="Tete">Tete</option>
                    <option value="Cabo Delgado">Cabo Delgado (Pemba / Palma)</option>
                    <option value="Inhambane">Inhambane</option>
                    <option value="Gaza">Gaza (Xai-Xai)</option>
                    <option value="Outra Província">Outra Província</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Urgência de Colocação
                  </label>
                  <select
                    value={form.urgency}
                    onChange={(e) => setForm(f => ({ ...f, urgency: e.target.value as any }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#172554]/30 focus:border-[#172554] outline-none transition-all bg-white"
                  >
                    <option value="Imediata (24h - 48h)">Imediata (24h - 48h)</option>
                    <option value="Esta Semana">Esta Semana (3 a 5 dias)</option>
                    <option value="Próximo Mês">Próximo Mês / Planeamento</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Requisitos Principais ou Observações (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Descreva experiência mínima exigida, ferramentas de trabalho, requisitos de carta de condução ou detalhes específicos..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#172554]/30 focus:border-[#172554] outline-none transition-all resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#172554] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#172554] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'A processar...' : 'Submeter Requisição de Vaga'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                  title="Falar imediatamente com o consultor de plantão no WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp Direto</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
