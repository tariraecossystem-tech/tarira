import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  Search, 
  Bell, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Filter, 
  GraduationCap, 
  HardHat, 
  Send, 
  ShieldCheck, 
  Mail, 
  MessageSquare,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  FileCheck,
  LogIn,
  UserPlus
} from 'lucide-react';

export interface TariraJobsViewProps {
  currentLang: 'pt' | 'en';
  onNavigateToApply: (type: 'spontaneous' | 'technician') => void;
  onOpenCommercialModal: () => void;
  onNavigateToFaqs: () => void;
  onOpenAuthModal?: (mode: 'signin' | 'signup', reason?: string, initialRole?: any) => void;
}

interface PreparationArea {
  id: string;
  title: string;
  category: 'quadros' | 'oficios';
  department: string;
  location: string;
  type: string;
  status: 'sourcing' | 'screening' | 'upcoming';
  statusLabel: string;
  summary: string;
  requirements: string[];
  expectedOpenings: string;
}

const PREPARATION_AREAS: PreparationArea[] = [
  {
    id: 'tech-dev',
    title: 'Engenharia de Software, Cloud & DevOps',
    category: 'quadros',
    department: 'Tecnologia & Sistemas de Informação',
    location: 'Maputo / Híbrido / Remoto',
    type: 'Tempo Inteiro',
    status: 'sourcing',
    statusLabel: 'Sourcing Ativo & Shortlist',
    summary: 'Triagem e credenciação de desenvolvedores Full-stack (React, Node, TypeScript), engenheiros de dados e administradores de sistemas cloud para projetos bancários e corporativos.',
    requirements: ['Formação superior em TI ou experiência comprovada', 'Domínio de JavaScript/TypeScript, SQL e Git', 'Capacidade de resolução autónoma de problemas'],
    expectedOpenings: '3 - 5 vagas previstas para o próximo trimestre'
  },
  {
    id: 'tech-clima',
    title: 'Técnicos de Climatização, Refrigeração & AVAC',
    category: 'oficios',
    department: 'Manutenção Técnica Industrial',
    location: 'Maputo e Matola',
    type: 'Prestação / Tempo Inteiro',
    status: 'sourcing',
    statusLabel: 'Triagem & Verificação Ativa',
    summary: 'Homologação técnica de especialistas em instalação, manutenção preventiva e reparação de centrais de ar condicionado, câmaras frigoríficas e sistemas de ventilação.',
    requirements: ['Certificação profissional ou carteira técnica', 'Mínimo de 2 anos de prática em campo', 'Conhecimentos de segurança no trabalho e normas de gás'],
    expectedOpenings: 'Equipas volantes para contratos corporativos e residenciais'
  },
  {
    id: 'finance-audit',
    title: 'Contabilidade, Auditoria & Finanças Corporativas',
    category: 'quadros',
    department: 'Finanças & Conformidade Fiscal',
    location: 'Maputo (Presencial)',
    type: 'Tempo Inteiro',
    status: 'screening',
    statusLabel: 'Fase de Homologação de Quadros',
    summary: 'Pré-seleção de contabilistas certificados e analistas financeiros para empresas de logística, retalho e consultoria com conhecimento das normas moçambicanas (PGC-NIRF).',
    requirements: ['Licenciatura em Contabilidade, Gestão ou Auditoria', 'Inscrição na OCAM ou experiência sólida comprovada', 'Domínio de softwares Primavera / SAP'],
    expectedOpenings: '2 - 4 posições corporativas'
  },
  {
    id: 'elec-industrial',
    title: 'Eletricistas de Baixa e Média Tensão & Automação',
    category: 'oficios',
    department: 'Eletrotecnia & Instalações',
    location: 'Maputo, Matola e Beira',
    type: 'Intervenção / Contrato',
    status: 'sourcing',
    statusLabel: 'Sourcing Ativo & Shortlist',
    summary: 'Banco de técnicos credenciados para montagem de quadros elétricos, grupos geradores, inversores solares e sistemas elétricos de condomínios e indústrias.',
    requirements: ['Curso profissional (IFPELAC ou equivalente)', 'Capacidade de leitura de diagramas elétricos', 'Rigor em segurança e equipamentos de proteção (EPI)'],
    expectedOpenings: 'Atendimentos contínuos via Tarira Connect'
  },
  {
    id: 'ops-logistics',
    title: 'Gestão de Logística, Armazém & Suprimentos',
    category: 'quadros',
    department: 'Operações & Supply Chain',
    location: 'Maputo, Beira e Nacala',
    type: 'Tempo Inteiro',
    status: 'screening',
    statusLabel: 'Triagem em Curso',
    summary: 'Seleção prévia de gestores de stock, coordenadores de despacho aduaneiro e supervisores de distribuição para operadoras logísticas.',
    requirements: ['Experiência em controlo de inventário e WMS', 'Conhecimento de procedimentos aduaneiros e frete', 'Liderança de equipas de armazém'],
    expectedOpenings: 'Pré-requisitos de empresas parceiras em fase final'
  },
  {
    id: 'civil-plumbing',
    title: 'Construção Civil, Canalização & Manutenção Predial',
    category: 'oficios',
    department: 'Obras & Infraestruturas',
    location: 'Maputo e Matola',
    type: 'Por Projeto / Permanente',
    status: 'upcoming',
    statusLabel: 'Abertura Iminente',
    summary: 'Cadastro e validação técnica de canalizadores industriais, pintores especializados e pedreiros para manutenção estrutural em imóveis corporativos.',
    requirements: ['Experiência comprovada em canalização predial e esgotos', 'Disponibilidade para deslocações', 'Registo de obras anteriores com boas referências'],
    expectedOpenings: 'Integração direta nas equipas do ecossistema'
  },
  {
    id: 'commercial-b2b',
    title: 'Comercial B2B, Vendas & Gestão de Contas',
    category: 'quadros',
    department: 'Desenvolvimento Comercial',
    location: 'Maputo',
    type: 'Tempo Inteiro',
    status: 'sourcing',
    statusLabel: 'Sourcing Ativo',
    summary: 'Talentos focados em negociação executiva, prospeção empresarial e retenção de contas B2B com carteira de contactos estabelecida.',
    requirements: ['Excelência em comunicação oral e escrita em português', 'Orientação rigorosa para metas e KPIs', 'Perfil dinâmico e proativo'],
    expectedOpenings: '3 posições abertas para parceiros do ecossistema'
  },
  {
    id: 'hr-talent',
    title: 'Recursos Humanos, R&S & Administração de Pessoal',
    category: 'quadros',
    department: 'Gestão de Pessoas (People & Culture)',
    location: 'Maputo / Híbrido',
    type: 'Tempo Inteiro',
    status: 'upcoming',
    statusLabel: 'Brevemente',
    summary: 'Técnicos e coordenadores de RH especializados na Lei do Trabalho de Moçambique, processamento salarial, INSS, IRPS e triagem comportamental.',
    requirements: ['Licenciatura em RH, Psicologia Organizacional ou Direito', 'Domínio da legislação laboral moçambicana', 'Experiência em plataformas de ATS e gestão de pessoal'],
    expectedOpenings: 'Integração em regime de Outsourcing'
  }
];

export const TariraJobsView: React.FC<TariraJobsViewProps> = ({
  currentLang,
  onNavigateToApply,
  onOpenCommercialModal,
  onNavigateToFaqs,
  onOpenAuthModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'quadros' | 'oficios'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Job Alert Subscription State
  const [alertEmail, setAlertEmail] = useState<string>('');
  const [alertPhone, setAlertPhone] = useState<string>('');
  const [alertName, setAlertName] = useState<string>('');
  const [alertArea, setAlertArea] = useState<string>('all');
  const [alertSubmitted, setAlertSubmitted] = useState<boolean>(false);
  const [alertError, setAlertError] = useState<string>('');

  const filteredAreas = useMemo(() => {
    return PREPARATION_AREAS.filter((area) => {
      const matchesCategory = selectedCategory === 'all' || area.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        area.title.toLowerCase().includes(q) || 
        area.department.toLowerCase().includes(q) || 
        area.summary.toLowerCase().includes(q) ||
        area.requirements.some(r => r.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertError('');
    if (!alertEmail.trim() && !alertPhone.trim()) {
      setAlertError('Por favor indique pelo menos um endereço de e-mail ou número de telefone/WhatsApp.');
      return;
    }
    if (!alertName.trim()) {
      setAlertError('Por favor informe o seu nome completo.');
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem('tarira_job_alerts') || '[]');
      existing.push({
        name: alertName.trim(),
        email: alertEmail.trim(),
        phone: alertPhone.trim(),
        area: alertArea,
        date: new Date().toISOString()
      });
      localStorage.setItem('tarira_job_alerts', JSON.stringify(existing));
    } catch (e) {
      console.warn('Erro ao salvar alerta de vagas:', e);
    }

    setAlertSubmitted(true);
  };

  return (
    <div className="w-full bg-[#f8fafc] text-slate-900 min-h-screen">
      {/* 1. Header Hero Section */}
      <section className="bg-gradient-to-b from-[#172554] via-[#1e3a8a] to-[#172554] text-white px-4 sm:px-6 py-14 sm:py-20 relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10 space-y-6 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-400/15 border border-blue-300/30 text-blue-200 text-xs font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              Portal de Oportunidades & Vagas
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Banco de Talentos 100% Ativo
            </span>
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight leading-tight text-white !text-white">
              Oportunidades, Vagas & <span className="text-white !text-white">Carreiras</span>
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
              A <strong>Tarira</strong> conecta talentos, quadros corporativos e técnicos de ofícios a empresas líderes em Moçambique. 
              Aqui os profissionais credenciam-se e as empresas contratam com garantia de aptidão e segurança operacional.
            </p>

            {/* Quick Action Navigation Bar in Hero */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#172554] hover:bg-blue-50 font-black text-xs transition-all cursor-pointer shadow-md active:scale-95 border border-white"
                    title="Abrir Modal para Criar Nova Conta"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#172554] stroke-[2.5]" />
                    <span className="text-[#172554] font-black">Criar Conta</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Status Banner - Transparent and Honest */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-4xl shadow-xl">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-400/20 border border-blue-300/30 text-blue-200 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>Fase Atual: Credenciação de Vagas & Formação de Shortlists</span>
                </h4>
                <p className="text-xs text-blue-100/80 leading-relaxed mt-0.5">
                  As vagas corporativas públicas abrem gradualmente à medida que as empresas parceiras finalizam as requisições. 
                  <strong> Os candidatos registados no banco da Tarira têm prioridade absoluta nas primeiras entrevistas!</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={() => onNavigateToApply('spontaneous')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-[#172554] hover:bg-blue-50 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4 text-[#172554]" />
                <span>Registar no Banco de Talentos</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Fast Decision Panels: For Candidates & For Employers */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card A: For Candidates */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-lg space-y-4 hover:border-blue-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#172554] flex items-center justify-center font-bold text-xl">
                🎓
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-blue-600 uppercase block">Para Profissionais & Técnicos</span>
                <h3 className="text-lg font-bold text-slate-900">Como funciona o registo na Tarira</h3>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              O seu perfil é analisado por especialistas, os seus documentos são verificados e fica visível para empresas e diretores de recursos humanos à procura de profissionais qualificados.
            </p>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>100% Gratuito</strong> para o candidato em todas as fases de triagem</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Selo de Verificação Técnica e Validação Documental</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Recomendação prioritária em shortlists corporativas</span>
              </li>
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => onNavigateToApply('spontaneous')}
                className="px-4 py-2.5 rounded-xl bg-[#172554] hover:bg-[#1e3a8a] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Registo de Quadro / Talento</span>
              </button>
              <button
                onClick={() => onNavigateToApply('technician')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <HardHat className="w-4 h-4 text-[#172554]" />
                <span>Registo de Técnico de Ofício</span>
              </button>
            </div>
          </div>

          {/* Card B: For Employers */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-lg space-y-4 hover:border-blue-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#172554] flex items-center justify-center font-bold text-xl">
                🏢
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-blue-600 uppercase block">Para Empresas & Recrutadores</span>
                <h3 className="text-lg font-bold text-slate-900">Precisa de contratar ou abrir uma vaga?</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Não perca semanas a triar centenas de currículos sem garantias. A Tarira apresenta profissionais testados, referenciados e prontos para atuar em 24h a 48h.
            </p>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>SLA Rápido:</strong> Shortlist homologada entregue em 24h a 48h</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Garantia de reposição sem custos durante o período probatório</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Suporte a modelos de Recrutamento Direto ou Outsourcing (RPO)</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onOpenCommercialModal}
                className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-[#172554] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#172554] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Building2 className="w-4 h-4" />
                <span>Requisitar Profissionais / Publicar Vaga</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Areas in Preparation & Active Sourcing Filterable Catalog */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#172554]" />
              <span className="text-xs font-mono font-bold uppercase text-blue-800 tracking-wider">Áreas & Especialidades</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Processos em Preparação & Sourcing Ativo
            </h2>
            <p className="text-xs text-slate-500">
              Consulte as principais áreas em que a Tarira está atualmente a triar e credenciar quadros e técnicos.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white text-[#172554] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas as Áreas ({PREPARATION_AREAS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('quadros')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedCategory === 'quadros'
                  ? 'bg-white text-[#172554] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Talentos & Quadros</span>
            </button>
            <button
              onClick={() => setSelectedCategory('oficios')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedCategory === 'oficios'
                  ? 'bg-white text-[#172554] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Técnicos de Ofício</span>
            </button>
          </div>
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar especialidade, tecnologia ou setor (ex: eletricista, contabilidade, React, logística)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
          />
        </div>

        {/* Grid of Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredAreas.map((area) => (
            <div
              key={area.id}
              className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#172554] border border-blue-200 uppercase inline-block mb-1.5">
                      {area.department}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {area.title}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                    area.status === 'sourcing' 
                      ? 'bg-blue-50 text-[#172554] border-blue-300'
                      : area.status === 'screening'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {area.statusLabel}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {area.summary}
                </p>

                {/* Location and contract type */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {area.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {area.type}
                  </span>
                </div>

                {/* Requirements Checklist */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                    Critérios de Triagem & Homologação
                  </span>
                  <ul className="space-y-1">
                    {area.requirements.map((req, i) => (
                      <li key={i} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-blue-600 mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500 font-medium">
                  {area.expectedOpenings}
                </span>

                <button
                  onClick={() => onNavigateToApply(area.category === 'quadros' ? 'spontaneous' : 'technician')}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#172554] hover:bg-[#1e3a8a] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <span>Candidatar a esta Área</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAreas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#172554] flex items-center justify-center mx-auto text-xl font-bold">
              🔍
            </div>
            <h4 className="text-sm font-bold text-slate-900">Nenhuma área encontrada para esta pesquisa</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Mesmo que a sua especialidade exata não esteja listada acima, aceitamos candidaturas espontâneas para todas as carreiras em Moçambique.
            </p>
            <button
              onClick={() => onNavigateToApply('spontaneous')}
              className="px-5 py-2.5 rounded-xl bg-[#172554] text-white text-xs font-bold hover:bg-blue-900 transition-all cursor-pointer"
            >
              Fazer Candidatura Geral
            </button>
          </div>
        )}
      </section>

      {/* 4. Interactive Job Alert Box (Email / WhatsApp Subscription) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-gradient-to-r from-blue-900 via-[#172554] to-blue-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Bell className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-blue-200">
                Alerta de Novas Vagas
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-snug">
              Seja o primeiro a ser notificado quando uma empresa parceira publicar uma vaga
            </h3>

            <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed">
              Registe o seu contacto para receber alertas diretamente via WhatsApp e E-mail sempre que houver requisições abertas na sua área de competência.
            </p>

            {alertSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 space-y-1">
                <h5 className="font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Alerta registado com sucesso!
                </h5>
                <p className="text-xs text-emerald-100/90">
                  O seu contacto foi adicionado à lista de notificações prioritárias da Tarira. Entraremos em contacto assim que houver novas oportunidades.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAlertSubmit} className="space-y-3 pt-2">
                {alertError && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-xs">
                    {alertError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    required
                    value={alertName}
                    onChange={(e) => setAlertName(e.target.value)}
                    placeholder="Seu Nome Completo"
                    className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 text-xs focus:outline-none focus:bg-white focus:text-[#172554]"
                  />
                  <input
                    type="email"
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    placeholder="Seu E-mail"
                    className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 text-xs focus:outline-none focus:bg-white focus:text-[#172554]"
                  />
                  <input
                    type="tel"
                    value={alertPhone}
                    onChange={(e) => setAlertPhone(e.target.value)}
                    placeholder="WhatsApp (+258 ...)"
                    className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 text-xs focus:outline-none focus:bg-white focus:text-[#172554]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                  <select
                    value={alertArea}
                    onChange={(e) => setAlertArea(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:bg-white focus:text-[#172554]"
                  >
                    <option value="all" className="text-slate-800">Todas as Áreas de Oportunidade</option>
                    <option value="tech" className="text-slate-800">Tecnologia, Software & Dados</option>
                    <option value="oficios" className="text-slate-800">Técnicos de Campo & Ofícios</option>
                    <option value="finance" className="text-slate-800">Finanças, Auditoria & Contabilidade</option>
                    <option value="ops" className="text-slate-800">Logística & Operações</option>
                    <option value="commercial" className="text-slate-800">Comercial & Vendas B2B</option>
                  </select>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-[#172554] text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-[#172554]" />
                    <span>Activar Alertas</span>
                  </button>
                </div>
                <span className="text-[10px] text-blue-200/70 block">
                  🔒 Garantimos 100% de privacidade dos seus dados. Sem spam.
                </span>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions Quick Bridge */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
            <HelpCircle className="w-4 h-4 text-[#172554]" />
            <span>Ficou com dúvidas sobre o processo de candidatura ou recrutamento?</span>
          </h4>
          <p className="text-xs text-slate-500">
            Consulte o nosso guia detalhado com perguntas e respostas sobre validação de diplomas, prazos e custos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onNavigateToFaqs}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-blue-400 text-slate-800 hover:text-[#172554] text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Consultar Perguntas Frequentes (FAQs)</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#172554]" />
          </button>

          {onOpenAuthModal && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuthModal('signin')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#172554] text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-[#172554]" />
                <span>Entrar</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAuthModal('signup')}
                className="px-4 py-2.5 rounded-xl bg-[#172554] hover:bg-blue-900 text-white font-black text-xs transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                <span>Criar Conta</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
