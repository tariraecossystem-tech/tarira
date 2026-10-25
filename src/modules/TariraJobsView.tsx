import React, { useState, useMemo, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Filter, 
  GraduationCap, 
  HardHat, 
  ShieldCheck, 
  AlertCircle, 
  HelpCircle, 
  LogIn, 
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Layers,
  FileCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { TariraJobApplicationModal, JobVacancy } from '../modals/TariraJobApplicationModal';

export interface TariraJobsViewProps {
  currentLang: 'pt' | 'en';
  onNavigateToApply: (type: 'spontaneous' | 'technician') => void;
  onOpenCommercialModal: () => void;
  onNavigateToFaqs: () => void;
  onOpenAuthModal?: (mode: 'signin' | 'signup', reason?: string, initialRole?: any) => void;
  candidateProfile?: any;
  onNavigateToProfile?: () => void;
  vacancies?: JobVacancy[];
}

const MOZAMBIQUE_PROVINCES = [
  'Todas as Províncias',
  'Maputo Cidade',
  'Maputo Província',
  'Gaza',
  'Inhambane',
  'Sofala',
  'Manica',
  'Tete',
  'Zambézia',
  'Nampula',
  'Cabo Delgado',
  'Niassa',
  'Remoto'
];

const DEFAULT_MOCKUP_IDS = new Set([
  'tech-dev', 'tech-clima', 'finance-audit', 'elec-industrial', 
  'ops-logistics', 'civil-plumbing', 'commercial-b2b', 'hr-talent', 
  'solar-renewable', 'eng-civil-nampula', 'electromech-tete', 'agri-manica'
]);

const ITEMS_PER_PAGE = 10;

export const TariraJobsView: React.FC<TariraJobsViewProps> = ({
  currentLang,
  onNavigateToApply,
  onOpenCommercialModal,
  onNavigateToFaqs,
  onOpenAuthModal,
  candidateProfile,
  onNavigateToProfile,
  vacancies
}) => {
  const [serverVacancies, setServerVacancies] = useState<JobVacancy[]>([]);
  const [isLoadingVacancies, setIsLoadingVacancies] = useState(false);

  // Carrega vagas reais do servidor se não forem passadas via props
  useEffect(() => {
    if (vacancies !== undefined) return;
    let isMounted = true;
    setIsLoadingVacancies(true);
    fetch('/api/job-vacancies?include_mockups=false')
      .then(res => res.json())
      .then(data => {
        if (isMounted && Array.isArray(data)) {
          setServerVacancies(data.filter((v: any) => !v.isMockup && !DEFAULT_MOCKUP_IDS.has(v.id)));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoadingVacancies(false);
      });
    return () => { isMounted = false; };
  }, [vacancies]);

  // Vagas ativas estritamente reais (sem mockups)
  const activeVacancies = useMemo(() => {
    const source = vacancies !== undefined ? vacancies : serverVacancies;
    return source.filter(v => !v.isMockup && !DEFAULT_MOCKUP_IDS.has(v.id));
  }, [vacancies, serverVacancies]);

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'quadros' | 'oficios'>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('Todas as Províncias');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal State for Direct Application
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobVacancy | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Resume Pending Application state from LocalStorage
  const [pendingJob, setPendingJob] = useState<any | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tarira_pending_job_application');
      if (stored) {
        setPendingJob(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedProvince, searchQuery]);

  const filteredAreas = useMemo(() => {
    return activeVacancies.filter((area) => {
      // 1. Category Filter
      const matchesCategory = selectedCategory === 'all' || area.category === selectedCategory;
      
      // 2. Province Filter
      const matchesProvince = 
        selectedProvince === 'Todas as Províncias' || 
        area.province === selectedProvince ||
        (selectedProvince === 'Maputo Província' && area.location.toLowerCase().includes('matola')) ||
        (selectedProvince === 'Remoto' && (area.province === 'Remoto' || area.location.toLowerCase().includes('remoto')));

      // 3. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        area.title.toLowerCase().includes(q) || 
        area.department.toLowerCase().includes(q) || 
        area.location.toLowerCase().includes(q) ||
        area.summary.toLowerCase().includes(q) ||
        area.requirements.some(r => r.toLowerCase().includes(q));

      return matchesCategory && matchesProvince && matchesSearch;
    });
  }, [activeVacancies, selectedCategory, selectedProvince, searchQuery]);

  // Pagination Math
  const totalPages = Math.ceil(filteredAreas.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredAreas.length);
  const paginatedAreas = useMemo(() => {
    return filteredAreas.slice(startIndex, endIndex);
  }, [filteredAreas, startIndex, endIndex]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const catalogElement = document.getElementById('catalog-section-top');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenApplicationModal = (job: JobVacancy) => {
    setSelectedJobForModal(job);
    setIsApplicationModalOpen(true);

    // Save as active pending application so user can continue from profile if interrupted
    try {
      localStorage.setItem('tarira_pending_job_application', JSON.stringify({
        id: job.id,
        title: job.title,
        category: job.category,
        department: job.department,
        location: job.location,
        province: job.province,
        type: job.type,
        timestamp: Date.now()
      }));
      setPendingJob(job);
    } catch (e) {
      // ignore
    }
  };

  const handleApplicationSuccess = (application: any) => {
    setSuccessToast(`Candidatura submetida com sucesso para "${application.jobTitle}"!`);
    setPendingJob(null);
    setTimeout(() => {
      setSuccessToast(null);
    }, 6000);
  };

  return (
    <div className="w-full bg-[#f8fafc] text-slate-900 min-h-screen">
      {/* Success Notification Banner */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-down border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
          <div className="flex-1 text-xs font-bold leading-snug">
            {successToast}
          </div>
          <button 
            onClick={() => setSuccessToast(null)}
            className="text-white/80 hover:text-white p-1 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Header Hero Section */}
      <section className="bg-gradient-to-b from-[#172554] via-[#1e3a8a] to-[#172554] text-white px-4 sm:px-6 py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10 space-y-6 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-400/15 border border-blue-300/30 text-blue-200 text-xs font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              Portal Oficial de Vagas & Oportunidades
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {filteredAreas.length} Processos Ativos
            </span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight leading-tight text-white !text-white">
              Vagas, Carreiras & Contratos Estruturados
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
              A <strong>TARIRA</strong> disponibiliza processos de recrutamento executivo e quadros corporativos (Recruit), bem como <strong>contratos técnicos de curta, média e longa duração</strong> para manutenção predial e industrial (Connect).
            </p>

            {/* Quick Action Navigation Bar in Hero */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={onNavigateToFaqs}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white !text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                title="Consultar Perguntas Frequentes (FAQs)"
              >
                <HelpCircle className="w-4 h-4 text-white !text-white" />
                <span className="text-white !text-white font-extrabold">Perguntas Frequentes (FAQs)</span>
                <ArrowRight className="w-3.5 h-3.5 text-white !text-white" />
              </button>

              {onOpenAuthModal && (
                <>
                  <button
                    type="button"
                    onClick={() => onOpenAuthModal('signin')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-400 text-white !text-white text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95"
                    title="Abrir Modal de Início de Sessão (Entrar)"
                  >
                    <LogIn className="w-3.5 h-3.5 text-white !text-white" />
                    <span className="text-white !text-white font-bold">Entrar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenAuthModal('signup')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#172554] hover:bg-blue-50 font-bold text-xs transition-all cursor-pointer shadow-md active:scale-95 border border-white"
                    title="Abrir Modal para Criar Nova Conta"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#172554] stroke-[2.5]" />
                    <span className="text-[#172554] font-bold">Criar Conta</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Pending Application Alert Banner if user started an application */}
          {pendingJob && (
            <div className="p-4 rounded-2xl bg-blue-500/20 backdrop-blur-md border border-blue-300/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-4xl shadow-lg">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-blue-400/30 flex items-center justify-center text-white shrink-0">
                  <Briefcase className="w-5 h-5 text-blue-200" />
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Tem uma candidatura em curso: {pendingJob.title}
                  </h4>
                  <p className="text-xs text-blue-100">
                    O seu perfil já foi identificado. Pode continuar e submeter os seus dados a esta vaga.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const targetJob = activeVacancies.find(j => j.id === pendingJob.id) || pendingJob;
                  handleOpenApplicationModal(targetJob);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white text-[#172554] hover:bg-blue-50 text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Continuar Candidatura
              </button>
            </div>
          )}

          {/* Distinction Banner: Connect (> 3 meses) vs Recruit */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-4xl shadow-xl">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-400/20 border border-blue-300/30 text-blue-200 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>Regimes Contratuais Distintos & Sem Mistura</span>
                </h4>
                <p className="text-xs text-blue-100/80 leading-relaxed">
                  <strong>Técnicos de Ofício (Connect):</strong> Vagas para contratos superiores a 3 meses em condomínios e indústrias (não são chamadas avulsas).<br/>
                  <strong>Talentos e Quadros (Recruit):</strong> Vagas corporativas e posições executivas permanentes.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
              <button
                onClick={() => onNavigateToApply('spontaneous')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-[#172554] hover:bg-blue-50 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4 text-[#172554]" />
                <span>Registar no Banco</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Catalog Section with Province Filter & Pagination */}
      <section id="catalog-section-top" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        
        {/* Filters Top Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#172554]" />
              <span className="text-xs font-mono font-bold uppercase text-blue-800 tracking-wider">Oportunidades em Aberto</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Vagas Abertas & Sourcing em Moçambique
            </h2>
            <p className="text-xs text-slate-500">
              Apresentando <strong>{filteredAreas.length}</strong> vagas disponíveis. Navegue pelos filtros por província e tipo de carreira.
            </p>
          </div>

          {/* Category Tabs: Todas | Talentos e Quadros | Técnicos de Ofício */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white text-[#172554] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas as Vagas ({activeVacancies.length})
            </button>
            <button
              onClick={() => setSelectedCategory('quadros')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'quadros'
                  ? 'bg-white text-[#172554] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Talentos & Quadros ({activeVacancies.filter(v => v.category === 'quadros').length})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('oficios')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'oficios'
                  ? 'bg-white text-[#172554] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Técnicos de Ofício ({activeVacancies.filter(v => v.category === 'oficios').length})</span>
            </button>
          </div>
        </div>

        {/* Search Bar + Province Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por cargo, especialidade ou palavra-chave (ex: eletricista, contabilidade, React, Beira)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
            />
          </div>

          {/* 🌟 FILTRO POR PROVÍNCIA EXIGIDO PELO UTILIZADOR */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-blue-700 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs cursor-pointer appearance-none"
            >
              {MOZAMBIQUE_PROVINCES.map((prov) => (
                <option key={prov} value={prov}>
                  {prov === 'Todas as Províncias' ? '📍 Todas as Províncias' : `📍 ${prov}`}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Active Filters Summary & Results Counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2">
            <span>A mostrar</span>
            <strong className="text-slate-800">
              {filteredAreas.length > 0 ? `${startIndex + 1}–${endIndex}` : '0'}
            </strong>
            <span>de</span>
            <strong className="text-slate-800">{filteredAreas.length}</strong>
            <span>vagas encontradas</span>
            {selectedProvince !== 'Todas as Províncias' && (
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-mono text-xs font-bold">
                Província: {selectedProvince}
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-mono text-xs font-bold">
                {selectedCategory === 'quadros' ? 'Talentos & Quadros' : 'Técnicos (> 3 Meses)'}
              </span>
            )}
          </div>

          {(selectedProvince !== 'Todas as Províncias' || selectedCategory !== 'all' || searchQuery.trim()) && (
            <button
              onClick={() => {
                setSelectedProvince('Todas as Províncias');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-blue-700 hover:text-blue-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>

        {/* 🌟 Grid of Max 10 Vacancies (GESTÃO DE ESPAÇO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {paginatedAreas.map((area) => {
            const isConnect = area.category === 'oficios';

            return (
              <div
                key={area.id}
                className="bg-white border border-blue-100/90 rounded-xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#172554] border border-blue-200 uppercase inline-block">
                          {area.department}
                        </span>

                        {/* 🌟 BADGE EXPLÍCITO DE CONTRATO TÉCNICO > 3 MESES PARA CONNECT */}
                        {isConnect ? (
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-2xs uppercase tracking-wider inline-flex items-center gap-1">
                            <HardHat className="w-3 h-3 text-white" />
                            Contrato Técnico (&gt; 3 Meses)
                          </span>
                        ) : (
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#172554] border border-blue-200 uppercase inline-flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-[#172554]" />
                            Tarira Recruit
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {area.title}
                      </h3>
                    </div>

                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                      area.status === 'sourcing' 
                        ? 'bg-blue-50 text-[#172554] border-blue-300'
                        : area.status === 'screening'
                        ? 'bg-blue-50 text-[#172554] border-blue-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {area.statusLabel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {area.summary}
                  </p>

                  {/* Informational banner if Connect to prevent confusion with emergency dispatch */}
                  {isConnect && (
                    <div className="p-2 rounded-xl bg-blue-50/80 border border-blue-200/60 text-xs text-[#172554] flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span>
                        <strong>Regime Contratual:</strong> Alocação continuada (&gt; 3 meses). Não é serviço pontual.
                      </span>
                    </div>
                  )}

                  {/* Location, Province and contract duration */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-700" />
                      <strong>{area.province || 'Moçambique'}:</strong> {area.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {area.contractDuration || area.type}
                    </span>
                  </div>

                  {/* Requirements Checklist */}
                  <div className="p-3 bg-blue-50/40 rounded-2xl border border-blue-100/80 space-y-1.5">
                    <span className="text-xs font-mono font-bold text-blue-900 uppercase tracking-wider block">
                      Critérios de Triagem & Homologação
                    </span>
                    <ul className="space-y-1">
                      {area.requirements.map((req, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-blue-600 mt-0.5 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="pt-3 border-t border-blue-100/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 font-medium">
                    {area.expectedOpenings}
                  </span>

                  {/* 🌟 BOTAO DE CANDIDATURA DIRETA QUE ABRE O MODAL DEDICADO */}
                  <button
                    onClick={() => handleOpenApplicationModal(area)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#172554] hover:bg-[#1e3a8a] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                  >
                    <span>Candidatar a esta Vaga</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Loading State */}
        {isLoadingVacancies && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8 space-y-3 shadow-xs animate-pulse">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto text-[#172554] font-bold">
              ⏳
            </div>
            <p className="text-xs text-slate-500 font-mono">A carregar oportunidades reais...</p>
          </div>
        )}

        {/* Empty State: Sem vagas abertas no momento */}
        {!isLoadingVacancies && activeVacancies.length === 0 && (
          <div className="text-center py-14 bg-white rounded-xl border border-blue-100 p-8 space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-[#172554] flex items-center justify-center mx-auto text-3xl font-bold">
              💼
            </div>
            <div className="space-y-1.5 max-w-lg mx-auto">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#172554] text-xs font-mono font-bold uppercase tracking-wider">
                Recrutamento & Seleção Tarira
              </span>
              <h3 className="text-lg font-serif font-bold text-slate-900">
                De momento não temos vagas corporativas em aberto
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A administração e equipa de R&S da <strong>TARIRA</strong> publica vagas reais aqui assim que forem abertas pelas empresas parceiras. Pode submeter a sua candidatura espontânea ou registar o seu perfil técnico no nosso banco homologado para ter prioridade nas próximas oportunidades.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center pt-3">
              <button
                type="button"
                onClick={() => onNavigateToApply('spontaneous')}
                className="px-5 py-2.5 rounded-xl bg-[#172554] hover:bg-[#1e3a8a] text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Submeter Candidatura Espontânea</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToApply('technician')}
                className="px-5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#172554] border border-blue-200 text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <HardHat className="w-4 h-4" />
                <span>Registar no Banco de Ofícios (Connect)</span>
              </button>
              <button
                type="button"
                onClick={onOpenCommercialModal}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>Abrir Requisição de Vaga (Empresas)</span>
              </button>
            </div>
          </div>
        )}

        {/* Empty State: Filtros sem resultados quando existem vagas */}
        {!isLoadingVacancies && activeVacancies.length > 0 && filteredAreas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#172554] flex items-center justify-center mx-auto text-xl font-bold">
              🔍
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Nenhuma vaga encontrada para os filtros selecionados
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Não foram encontradas vagas para a província «{selectedProvince}» na categoria selecionada. Experimente limpar os filtros ou submeter uma candidatura espontânea.
            </p>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <button
                onClick={() => {
                  setSelectedProvince('Todas as Províncias');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Limpar Todos os Filtros
              </button>
              <button
                onClick={() => onNavigateToApply('spontaneous')}
                className="px-4 py-2 rounded-xl bg-[#172554] text-white text-xs font-bold hover:bg-[#1A3478] transition-all cursor-pointer"
              >
                Registo Espontâneo no Banco
              </button>
            </div>
          </div>
        )}

        {/* 🌟 PAGINATION CONTROLS (Max 10 Vagas Visíveis por Página) */}
        {totalPages > 1 && (
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500 font-medium">
              Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> ({filteredAreas.length} vagas no total)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                    currentPage === pageNum
                      ? 'bg-[#172554] text-white shadow-xs font-bold'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <span className="hidden sm:inline">Seguinte</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </section>

      {/* 3. Dedicated Application Modal */}
      <TariraJobApplicationModal
        isOpen={isApplicationModalOpen}
        job={selectedJobForModal}
        candidateProfile={candidateProfile}
        onClose={() => setIsApplicationModalOpen(false)}
        onSuccess={handleApplicationSuccess}
        onNavigateToCreateProfile={onNavigateToProfile || (() => onNavigateToApply('spontaneous'))}
        currentLang={currentLang}
      />
    </div>
  );
};
