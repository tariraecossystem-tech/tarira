import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  Sparkles, 
  Building2, 
  GraduationCap, 
  HardHat, 
  ShieldCheck, 
  MessageCircle, 
  Mail, 
  CheckCircle2, 
  Phone,
  ArrowRight,
  FileText,
  Briefcase,
  Users,
  Layers,
  Laptop,
  Compass,
  Eye,
  Camera,
  LogIn,
  UserPlus
} from 'lucide-react';

export interface TariraFaqsViewProps {
  currentLang: 'pt' | 'en';
  onNavigateToApply: (type: 'spontaneous' | 'technician') => void;
  onNavigateToJobs: () => void;
  onOpenCommercialModal: () => void;
  onOpenAuthModal?: (mode: 'signin' | 'signup', reason?: string, initialRole?: any) => void;
}

interface FaqItem {
  id: string;
  category: 'units' | 'outsourcing' | 'consulting_studio' | 'candidates' | 'companies' | 'compliance';
  question: string;
  answer: string;
  badge?: string;
}

const BUSINESS_UNITS = [
  {
    id: 'recruit',
    name: 'Tarira Recruit',
    tagline: 'Recrutamento & Seleção de Quadros',
    icon: GraduationCap,
    color: 'from-blue-600 to-indigo-600',
    description: 'Gestão de processos de atração, triagem técnica, homologação e entrevistas de quadros e executivos com garantia contratual de reposição.'
  },
  {
    id: 'connect',
    name: 'Tarira Connect',
    tagline: 'Técnicos de Ofício & Manutenções',
    icon: HardHat,
    color: 'from-amber-500 to-orange-600',
    description: 'Rede geolocalizada de profissionais de ofício verificados (eletricistas, AVAC, pichelaria, frio industrial) para intervenções rápidas ou alocação contínua.'
  },
  {
    id: 'outsourcing',
    name: 'Tarira Outsourcing (RPO)',
    tagline: 'Terceirização & Gestão Laboral',
    icon: Users,
    color: 'from-emerald-600 to-teal-700',
    description: 'Recruitment Process Outsourcing (RPO), gestão integral de folha de pagamento, retenções fiscais (IRPS/INSS), subcontratação e gestão de contratos laborais.'
  },
  {
    id: 'consulting',
    name: 'Tarira Consulting',
    tagline: 'Consultoria de Gestão & Conformidade',
    icon: Compass,
    color: 'from-purple-600 to-indigo-700',
    description: 'Auditoria de processos de RH, reestruturação organizacional, assessoria jurídica laboral segundo a Lei do Trabalho 13/2023 e otimização de back-office.'
  },
  {
    id: 'studio',
    name: 'Tarira Studio',
    tagline: 'Soluções Digitais & Vitrine Axofacil',
    icon: Laptop,
    color: 'from-sky-500 to-blue-700',
    description: 'Desenvolvimento de software à medida, micro-SaaS, plataformas corporativas e vitrines digitais de produtos e serviços para empresas moçambicanas.'
  }
];

const FAQS_DATA: FaqItem[] = [
  // Categoria 1: As 5 Unidades & Modelo da Tarira
  {
    id: 'faq-1',
    category: 'units',
    question: 'O que é a Tarira e quais são as suas 5 Unidades de Negócios?',
    answer: 'A Tarira é uma plataforma corporativa integrada de soluções de capital humano, serviços técnicos e tecnologia em Moçambique. Estruturamos a nossa atuação em cinco unidades de negócios especializadas e sinérgicas: 1) Tarira Recruit (recrutamento de quadros corporativos); 2) Tarira Connect (rede homologada de técnicos de ofício); 3) Tarira Outsourcing (RPO e gestão de equipas terceirizadas); 4) Tarira Consulting (consultoria em gestão, processos e auditoria trabalhista); e 5) Tarira Studio (soluções digitais, micro-SaaS e vitrine empresarial).',
    badge: '5 Unidades de Negócio'
  },
  {
    id: 'faq-2',
    category: 'units',
    question: 'Qual é a diferença operacional entre o Tarira Connect e o Tarira Recruit?',
    answer: 'O Tarira Connect é focado em técnicos operacionais e profissionais de ofício (como eletricistas, técnicos de AVAC/frio, canalizadores, mecânicos industriais e técnicos de telecomunicações) para contratos de prestação, intervenções de emergência e suporte de campo com tarifas claras. O Tarira Recruit gerencia processos seletivos corporativos de média e alta complexidade (analistas, engenheiros, gerentes, contabilistas e diretores), com testes de aptidão técnica, entrevistas comportamentais e garantia de reposição.',
    badge: 'Connect vs Recruit'
  },
  {
    id: 'faq-3',
    category: 'units',
    question: 'A Tarira opera apenas em Maputo ou em todas as províncias de Moçambique?',
    answer: 'Embora a sede e operações centrais estejam em Maputo e Matola, a Tarira atende projetos e requisições empresariais em todo o território moçambicano — com destaque para os corredores industriais e logísticos de Sofala (Beira), Nampula, Tete e Cabo Delgado —, além de viabilizar contratos remotos e híbridos em âmbito nacional.',
    badge: 'Cobertura Nacional'
  },

  // Categoria 2: Tarira Outsourcing (RPO)
  {
    id: 'faq-rpo-1',
    category: 'outsourcing',
    question: 'O que é o Tarira Outsourcing (RPO) e como beneficia as empresas?',
    answer: 'O Tarira Outsourcing atua na modalidade de Recruitment Process Outsourcing (RPO) e terceirização de mão de obra. A Tarira assume total ou parcialmente a gestão do departamento de atração de talentos, contratação, processamento mensal de folha salarial, recolhimento de impostos (IRPS, INSS, encargos sociais) e gestão de contratos laborais. Isso permite que a sua empresa reduza custos fixos de RH, elimine passivos trabalhistas e concentre energia na sua atividade-fim.',
    badge: 'Outsourcing & RPO'
  },
  {
    id: 'faq-rpo-2',
    category: 'outsourcing',
    question: 'Como funciona a terceirização de técnicos e equipas inteiras em projetos temporários?',
    answer: 'Quando uma empresa precisa de uma equipa técnica para paragens de manutenção, obras civis, instalações em larga escala ou auditorias temporárias, o Tarira Outsourcing monta a equipa de técnicos credenciados, fornece a gestão de pontualidade e substituição imediata, e fatura o serviço com nota fiscal e transparência completa dos encargos trabalhistas legais.',
    badge: 'Equipas Dedicadas'
  },

  // Categoria 3: Tarira Consulting & Studio
  {
    id: 'faq-cs-1',
    category: 'consulting_studio',
    question: 'Quais serviços são prestados pela unidade Tarira Consulting?',
    answer: 'A Tarira Consulting apoia empresas nacionais e internacionais estabelecidas em Moçambique na revisão e auditoria de políticas de recursos humanos, adequação à nova Lei do Trabalho (Lei 13/2023), estruturação de planos de cargos e salários, programas de avaliação de desempenho e diagnósticos de conformidade regulatória para mitigar riscos jurídicos e trabalhistas.',
    badge: 'Tarira Consulting'
  },
  {
    id: 'faq-cs-2',
    category: 'consulting_studio',
    question: 'O que é o Tarira Studio e a Vitrine Axofacil?',
    answer: 'O Tarira Studio é a nossa unidade de tecnologia e desenvolvimento de produtos digitais. Construímos aplicações web de alta performance, micro-SaaS corporativos, painéis de gestão sob medida e integramos a Vitrine Digital Axofacil, uma ferramenta desenvolvida para empresas e prestadores moçambicanos exporem os seus catálogos de produtos e serviços online com contacto direto e fácil para clientes via WhatsApp.',
    badge: 'Tarira Studio'
  },

  // Categoria 4: Para Candidatos & Profissionais
  {
    id: 'faq-4',
    category: 'candidates',
    question: 'Quanto custa para o profissional ou técnico registar-se na Tarira?',
    answer: 'O registo, a credenciação e a permanência no banco de talentos são 100% GRATUITOS para o profissional. Não cobramos taxa de inscrição nem comissão sobre o primeiro salário do candidato. O nosso modelo financeiro é sustentado exclusivamente pelas empresas contratantes que remuneram os serviços de atração e conformidade.',
    badge: '100% Gratuito'
  },
  {
    id: 'faq-5',
    category: 'candidates',
    question: 'Por que devo criar o meu perfil agora se ainda não vejo uma vaga aberta na minha área exata?',
    answer: 'Porque a vasta maioria das posições geridas pela Tarira são preenchidas por "Shortlist Rápida": quando uma empresa cliente solicita um profissional urgente ou sob confidencialidade, os nossos recrutadores pesquisam primeiro no banco de perfis já cadastrados, verificados e prontos. Quem já está registado entra automaticamente no topo da lista antes de qualquer publicação pública.',
    badge: 'Vantagem Antecipada'
  },
  {
    id: 'faq-6',
    category: 'candidates',
    question: 'Como funciona a verificação e homologação dos meus documentos (BI, certificados, carteira técnica)?',
    answer: 'Após o registo dos dados e upload de documentos (BI/Passaporte, certificados de habilitações ou carteiras profissionais como IFPELAC), a equipa de conformidade da Tarira checa a autenticidade documental, valida referências de empregos anteriores e atribui o selo de "Verificado Tarira", multiplicando o interesse das empresas pelo seu perfil.',
    badge: 'Homologação'
  },

  // Categoria 5: Para Empresas & Contratantes
  {
    id: 'faq-8',
    category: 'companies',
    question: 'Qual é o prazo de entrega (SLA) para a Tarira apresentar profissionais qualificados?',
    answer: 'Para requisições técnicas de ofício via Tarira Connect, o agendamento ou envio de técnicos homologados pode ocorrer no mesmo dia ou em até 24 horas. Para processos de seleção corporativa (Tarira Recruit), entregamos uma shortlist de 3 a 5 candidatos rigorosamente triados e entrevistados no prazo médio de 24h a 72h úteis.',
    badge: 'SLA Rápido'
  },
  {
    id: 'faq-9',
    category: 'companies',
    question: 'Que garantia a minha empresa tem caso o profissional selecionado não se adapte?',
    answer: 'Todos os processos de colocação corporativa incluem garantia contratual formal de reposição (geralmente de 30 a 90 dias). Se o profissional rescindir ou não atingir o desempenho homologado durante o período de garantia, a Tarira conduz um novo processo de seleção e substitui o profissional sem nenhuma taxa adicional de serviço.',
    badge: 'Garantia Contratual'
  },
  {
    id: 'faq-11',
    category: 'companies',
    question: 'Como a minha empresa pode solicitar uma proposta comercial ou abrir uma vaga hoje?',
    answer: 'Pode clicar no botão "Falar com Comercial" ou abrir o formulário de briefing no menu superior. Um dos nossos consultores dedicados ao setor da sua empresa entrará em contacto dentro de 2 horas úteis para alinhar os perfis necessários, modelo contratual e prazos.',
  },

  // Categoria 6: Conformidade, Imagem Pública & Privacidade
  {
    id: 'faq-terms-1',
    category: 'compliance',
    question: 'Por que é obrigatório aceitar os Termos e Condições ao criar conta na Tarira?',
    answer: 'Porque a Tarira funciona como uma montra ativa e transparente de capital humano profissional em Moçambique. Ao criar conta, o utilizador concorda expressamente com os Termos de Uso e Política de Privacidade, autorizando a exibição pública e corporativa da sua fotografia de perfil, qualificações, competências e cidade de residência no banco de talentos para que recrutadores e empresas parceiras possam visualizar e avaliar os candidatos com segurança.',
    badge: 'Termos & Imagem'
  },
  {
    id: 'faq-12',
    category: 'compliance',
    question: 'Como os dados pessoais confidenciais (número de BI, NUIT, morada exata) são protegidos?',
    answer: 'Apenas a foto profissional, o nome público, as competências técnicas e o resumo da experiência ficam visíveis na montra de talentos. Dados sensíveis e confidenciais (como número de identificação civil, anexos de documentos de identidade e morada domiciliar) ficam criptografados e com acesso restrito apenas à equipa de conformidade interna da Tarira e à empresa contratante na fase final de celebração do contrato.',
    badge: 'Privacidade & Ciber'
  },
  {
    id: 'faq-13',
    category: 'compliance',
    question: 'Quais são os métodos de pagamento aceites para serviços corporativos e intervenções técnicas?',
    answer: 'Processamos liquidações empresariais por transferência bancária com fatura e recibo fiscal oficial com NUIT, bem como pagamentos ágeis via M-Pesa Empresarial e E-Mola para liquidações operacionais imediatas de técnicos em campo.',
    badge: 'M-Pesa & Bancário'
  },
  {
    id: 'faq-14',
    category: 'compliance',
    question: 'Os modelos contratuais e intermediações cumprem a Lei do Trabalho de Moçambique?',
    answer: 'Sim. Todas as operações de recrutamento, terceirização de mão de obra (RPO) e contratos de serviços técnicos são elaboradas em rigorosa harmonia com a Lei do Trabalho de Moçambique (Lei n.º 13/2023) e diretrizes do Ministério do Trabalho e Segurança Social.',
  }
];

export const TariraFaqsView: React.FC<TariraFaqsViewProps> = ({
  currentLang,
  onNavigateToApply,
  onNavigateToJobs,
  onOpenCommercialModal,
  onOpenAuthModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'units' | 'outsourcing' | 'consulting_studio' | 'candidates' | 'companies' | 'compliance'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-rpo-1': true,
    'faq-terms-1': true
  });

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((faq) => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        faq.question.toLowerCase().includes(q) || 
        faq.answer.toLowerCase().includes(q) ||
        (faq.badge && faq.badge.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full bg-[#f8fafc] text-slate-900 min-h-screen">
      {/* 1. Hero Header */}
      <section className="bg-gradient-to-b from-[#172554] via-[#1e3a8a] to-[#172554] text-white px-4 sm:px-6 py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-400/15 border border-blue-300/30 text-blue-200 text-xs font-mono font-bold tracking-wider uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-blue-300" />
            Centro de Conhecimento & Ajuda
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight leading-tight text-white !text-white">
            Perguntas Frequentes (FAQs)
          </h1>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
            Conheça as <strong>5 Unidades de Negócios da Tarira</strong> (Connect, Recruit, Outsourcing/RPO, Consulting e Studio), 
            o funcionamento da nossa plataforma de contratação, prazos de entrega e garantias em Moçambique.
          </p>

          {/* Quick Action Navigation Bar: Vagas, Entrar e Criar Conta */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1">
            <button
              type="button"
              onClick={onNavigateToJobs}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white !text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
              title="Aceder ao Portal de Vagas, Oportunidades & Carreiras"
            >
              <Briefcase className="w-4 h-4 text-white !text-white" />
              <span className="text-white !text-white font-extrabold">Oportunidades, Vagas & Carreiras</span>
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

          {/* Live Search Input in Hero */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquise por termos (ex: RPO, outsourcing, consulting, Studio, foto, termos, SLA, gratuito)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-4 focus:ring-blue-400/30 shadow-xl transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Visual Overview of the 5 Business Units */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 block">Estrutura Operacional</span>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                As 5 Unidades de Negócio da Tarira
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Ecossistema integrado de serviços corporativos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
            {BUSINESS_UNITS.map((unit) => {
              const IconComp = unit.icon;
              return (
                <div 
                  key={unit.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex flex-col justify-between space-y-2.5"
                >
                  <div className="space-y-2">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${unit.color} text-white flex items-center justify-center shadow-xs`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{unit.name}</h4>
                      <p className="text-[10px] font-mono text-blue-700 font-semibold">{unit.tagline}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {unit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Category Filter Navigation */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-xs flex flex-wrap items-center justify-center gap-1">
          {[
            { id: 'all', label: 'Todas as Perguntas', icon: <HelpCircle className="w-3.5 h-3.5" /> },
            { id: 'units', label: 'As 5 Unidades', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'outsourcing', label: 'Outsourcing (RPO)', icon: <Users className="w-3.5 h-3.5" /> },
            { id: 'consulting_studio', label: 'Consulting & Studio', icon: <Compass className="w-3.5 h-3.5" /> },
            { id: 'candidates', label: 'Para Candidatos', icon: <GraduationCap className="w-3.5 h-3.5" /> },
            { id: 'companies', label: 'Para Empresas', icon: <Building2 className="w-3.5 h-3.5" /> },
            { id: 'compliance', label: 'Termos & Privacidade', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#172554] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Accordion Q&A List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = Boolean(openFaqIds[faq.id]);
          return (
            <div
              key={faq.id}
              className={`bg-white border transition-all rounded-2xl overflow-hidden shadow-xs ${
                isOpen ? 'border-blue-300 ring-1 ring-blue-100 shadow-sm' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-1">
                  {faq.badge && (
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#172554] border border-blue-200 uppercase inline-block">
                      {faq.badge}
                    </span>
                  )}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </h3>
                </div>

                <div className={`p-1.5 rounded-xl bg-slate-100 text-slate-600 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-blue-50 text-[#172554]' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in">
                  <p className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 p-8 space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Nenhuma pergunta encontrada com "{searchQuery}"</h4>
            <p className="text-xs text-slate-500">
              Experimente pesquisar outro termo ou entre em contacto direto com a nossa equipa de apoio.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all cursor-pointer"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </section>

      {/* 4.5. Fast-track to Opportunities, Jobs & Careers + Authentication */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-6">
        <div className="bg-gradient-to-r from-[#1e3a8a] via-[#172554] to-[#0f172a] rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 border border-blue-400/30">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-200 block">
              Recrutamento & Talentos em Moçambique
            </span>
            <h3 className="text-lg sm:text-xl font-serif font-extrabold text-white !text-white">
              Oportunidades, Vagas & Carreiras
            </h3>
            <p className="text-xs text-blue-100/80 leading-relaxed max-w-lg">
              Explore o nosso banco de talentos, submeta a sua candidatura espontânea ou inicie sessão no portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onNavigateToJobs}
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/40 text-white !text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4 text-white !text-white" />
              <span className="text-white !text-white font-extrabold">Oportunidades, Vagas & Carreiras</span>
              <ArrowRight className="w-3.5 h-3.5 text-white !text-white" />
            </button>

            {onOpenAuthModal && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('signin')}
                  className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-400 text-white !text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-white !text-white" />
                  <span className="text-white !text-white font-bold">Entrar</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('signup')}
                  className="px-3.5 py-2.5 rounded-xl bg-white text-[#172554] hover:bg-blue-50 font-black text-xs transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5 border border-white"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#172554] stroke-[2.5]" />
                  <span className="text-[#172554] font-black">Criar Conta</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Still Have Questions Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-gradient-to-r from-blue-900 via-[#172554] to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-5">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-300">
              Apoio Direto & Atendimento Humanizado
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Ainda ficou com alguma dúvida sobre a Tarira?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-xl">
              Os nossos consultores e especialistas de atendimento estão disponíveis para esclarecer dúvidas e apresentar soluções à medida para a sua carreira ou para a sua empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <a
              href="https://wa.me/258871425316?text=Ol%C3%A1%20Tarira,%20tenho%20uma%20d%C3%BAvida%20sobre%20as%20unidades%20de%20negócio"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-[#172554] border border-white/20 transition-all flex items-center gap-3 cursor-pointer group shadow-xs"
            >
              <div className="p-2 rounded-xl bg-emerald-500/30 text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <span className="text-[10px] font-mono uppercase block text-blue-200 group-hover:text-[#172554]/70">WhatsApp Oficial</span>
                <span className="text-xs font-bold truncate block">+258 87 142 5316</span>
              </div>
            </a>

            <a
              href="mailto:tarira.ecossistema@gmail.com?subject=Pedido%20de%20Informações%20-%20Tarira"
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-[#172554] border border-white/20 transition-all flex items-center gap-3 cursor-pointer group shadow-xs"
            >
              <div className="p-2 rounded-xl bg-blue-500/30 text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <span className="text-[10px] font-mono uppercase block text-blue-200 group-hover:text-[#172554]/70">Correio Eletrónico</span>
                <span className="text-xs font-bold truncate block">tarira.ecossistema@gmail.com</span>
              </div>
            </a>

            <button
              onClick={onOpenCommercialModal}
              className="p-3.5 rounded-2xl bg-white text-[#172554] hover:bg-blue-50 transition-all flex items-center gap-3 cursor-pointer shadow-md active:scale-95"
            >
              <div className="p-2 rounded-xl bg-blue-100 text-[#172554]">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <span className="text-[10px] font-mono uppercase block text-slate-500">Atendimento B2B</span>
                <span className="text-xs font-bold truncate block">Falar com Comercial</span>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
