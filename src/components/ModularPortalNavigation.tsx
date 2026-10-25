import React from 'react';
import { 
  Building2, 
  Search, 
  Menu, 
  MoreVertical,
  X, 
  ChevronRight, 
  ChevronDown,
  Code2,
  Sparkles,
  Briefcase, 
  Lock,
  CheckCircle2,
  Users,
  ShieldCheck,
  Home,
  HardHat,
  GraduationCap,
  Wrench,
  LogOut,
  LogIn,
  UserPlus,
  Compass,
  FileText,
  Layers,
  BarChart3,
  Plus,
  HelpCircle
} from 'lucide-react';
import { TariraLogo } from './TariraLogo';
import {
  TariraConnectIcon,
  TariraRecruitIcon,
  TariraOutsourcingIcon,
  TariraConsultingIcon,
  TariraStudioIcon
} from './TariraUnitIcons';

export interface ModularPortalNavigationProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  currentLang: 'pt' | 'en';
  isUserLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  supabaseUser: any;
  supabaseProfile: any;
  selectedClient: any;
  selectedProfessional: any;
  onSignOut: () => void;
  onOpenAuthModal: (mode: 'signin' | 'signup', reason?: string, initialRole?: any) => void;
  onOpenCommercialModal: () => void;
  onOpenSolutionsDropdown: () => void;
  isSolutionsDropdownOpen: boolean;
  onCloseSolutionsDropdown: () => void;
  onNavigateToEcosystem: (unitId: string) => void;
  setClientSelectedCategory: (category: string) => void;
  headerSearchInput: string;
  setHeaderSearchInput: (text: string) => void;
  onSearchSubmit: (text: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onToggleLang?: (lang: 'pt' | 'en') => void;
  onOpenTestAccounts?: () => void;
}

export const ModularPortalNavigation: React.FC<ModularPortalNavigationProps> = ({
  activeTab,
  setActiveTab,
  currentLang,
  isUserLoggedIn,
  isAdminLoggedIn,
  supabaseUser,
  supabaseProfile,
  selectedClient,
  selectedProfessional,
  onSignOut,
  onOpenAuthModal,
  onOpenCommercialModal,
  onOpenSolutionsDropdown,
  isSolutionsDropdownOpen,
  onCloseSolutionsDropdown,
  onNavigateToEcosystem,
  setClientSelectedCategory,
  headerSearchInput,
  setHeaderSearchInput,
  onSearchSubmit,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onToggleLang,
}) => {
  // Check if any user profile/account or administrator is logged in via actual authentication
  const isUserAuthenticated = Boolean(
    isAdminLoggedIn ||
    supabaseUser ||
    (supabaseProfile && (supabaseProfile.email || supabaseProfile.id || supabaseProfile.name))
  );

  const getUserRoleAndProfileDetails = () => {
    // 1. Administrador Geral (Master)
    const isAdm = Boolean(
      isAdminLoggedIn ||
      supabaseProfile?.role === 'admin' ||
      supabaseUser?.user_metadata?.role === 'admin' ||
      (supabaseUser?.email && (
        supabaseUser.email.toLowerCase().includes('tarira.ecossistema@gmail.com') ||
        supabaseUser.email.toLowerCase().includes('tariraecossystem@gmail.com') ||
        supabaseUser.email.toLowerCase().includes('tarira')
      )) ||
      (supabaseProfile?.email && (
        supabaseProfile.email.toLowerCase().includes('tarira.ecossistema@gmail.com') ||
        supabaseProfile.email.toLowerCase().includes('tariraecossystem@gmail.com') ||
        supabaseProfile.email.toLowerCase().includes('tarira')
      ))
    );

    if (isAdm) {
      const adminName =
        supabaseProfile?.name ||
        supabaseUser?.user_metadata?.full_name ||
        (supabaseUser?.email ? supabaseUser.email.split('@')[0] : 'Administrador Master TARIRA');
      return {
        roleKey: 'admin',
        roleLabel: currentLang === 'pt' ? 'Administrador' : 'Administrator',
        displayName: adminName,
        specialty: null,
        fullTitle: `${currentLang === 'pt' ? 'Administrador' : 'Administrator'}: ${adminName}`,
        icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />,
        badgeStyle: 'bg-white/20 text-white border-white/40'
      };
    }

    const rawRole = (
      supabaseProfile?.role ||
      (supabaseUser?.user_metadata?.role as string) ||
      ''
    ).toLowerCase();

    // 2. Condomínio (Gestão Predial & Comum)
    if (rawRole === 'condominio' || rawRole === 'condo') {
      const condoName =
        supabaseProfile?.condo_name ||
        supabaseProfile?.name ||
        supabaseUser?.user_metadata?.full_name ||
        (currentLang === 'pt' ? 'Condomínio Residencial' : 'Condominium');
      return {
        roleKey: 'condominio',
        roleLabel: currentLang === 'pt' ? 'Condomínio' : 'Condominium',
        displayName: condoName,
        specialty: null,
        fullTitle: `${currentLang === 'pt' ? 'Condomínio' : 'Condo'}: ${condoName}`,
        icon: <Building2 className="w-3.5 h-3.5 text-blue-200" />,
        badgeStyle: 'bg-white/20 hover:bg-white/30 text-white border-white/40'
      };
    }

    // 3. Lar Particular (Residencial / Habitação)
    if (
      rawRole === 'lar' ||
      rawRole === 'particular' ||
      rawRole === 'residential' ||
      rawRole === 'individual'
    ) {
      const personName =
        supabaseProfile?.name ||
        supabaseUser?.user_metadata?.full_name ||
        (supabaseUser?.email ? supabaseUser.email.split('@')[0] : (currentLang === 'pt' ? 'Particular' : 'Resident'));
      return {
        roleKey: 'lar',
        roleLabel: currentLang === 'pt' ? 'Particular' : 'Individual',
        displayName: personName,
        specialty: null,
        fullTitle: `${currentLang === 'pt' ? 'Particular' : 'Individual'}: ${personName}`,
        icon: <Home className="w-3.5 h-3.5 text-emerald-300" />,
        badgeStyle: 'bg-white/20 hover:bg-white/30 text-white border-white/40'
      };
    }

    // 4. Profissional (TARIRA Recruit / Executivos e Quadros)
    if (
      rawRole === 'profissional' ||
      rawRole === 'professional' ||
      rawRole === 'candidato'
    ) {
      const profName =
        supabaseProfile?.name ||
        supabaseUser?.user_metadata?.full_name ||
        (supabaseUser?.email ? supabaseUser.email.split('@')[0] : (currentLang === 'pt' ? 'Profissional' : 'Professional'));
      const rawSpec = supabaseProfile?.category || (currentLang === 'pt' ? 'Quadro Técnico & Gestão' : 'Professional');
      const cleanSpec = rawSpec === 'prof' || rawSpec === 'elite_hub' ? (currentLang === 'pt' ? 'Gestão & TI' : 'Management & IT') : rawSpec;

      return {
        roleKey: 'profissional',
        roleLabel: currentLang === 'pt' ? 'Profissional' : 'Professional',
        displayName: profName,
        specialty: cleanSpec,
        fullTitle: `${currentLang === 'pt' ? 'Profissional' : 'Professional'}: ${profName} (${cleanSpec})`,
        icon: <Briefcase className="w-3.5 h-3.5 text-blue-200" />,
        badgeStyle: 'bg-white/20 hover:bg-white/30 text-white border-white/40'
      };
    }

    // 5. Técnico (TARIRA Connect / Manutenção e Campo)
    if (
      rawRole === 'prestador' ||
      rawRole === 'tecnico' ||
      rawRole === 'technician' ||
      rawRole === 'provider'
    ) {
      const techName =
        supabaseProfile?.name ||
        supabaseUser?.user_metadata?.full_name ||
        (supabaseUser?.email ? supabaseUser.email.split('@')[0] : (currentLang === 'pt' ? 'Técnico Credenciado' : 'Field Technician'));
      const rawSpec = supabaseProfile?.category || (currentLang === 'pt' ? 'Técnico Especialista' : 'Field Specialist');
      const cleanSpec = rawSpec === 'tech' ? (currentLang === 'pt' ? 'Técnico de Campo' : 'Field Tech')
        : rawSpec === 'dom' ? (currentLang === 'pt' ? 'Apoio ao Lar' : 'Home Support')
        : rawSpec === 'jard' ? (currentLang === 'pt' ? 'Jardinagem' : 'Gardening')
        : rawSpec;

      return {
        roleKey: 'tecnico',
        roleLabel: currentLang === 'pt' ? 'Técnico' : 'Technician',
        displayName: techName,
        specialty: cleanSpec,
        fullTitle: `${currentLang === 'pt' ? 'Técnico' : 'Technician'}: ${techName} (${cleanSpec})`,
        icon: <Wrench className="w-3.5 h-3.5 text-blue-200" />,
        badgeStyle: 'bg-white/20 hover:bg-white/30 text-white border-white/40'
      };
    }

    // 6. Empresa (Corporativo B2B)
    if (rawRole === 'empresa' || rawRole === 'company' || rawRole === 'corporate') {
      const compName =
        supabaseProfile?.company_name ||
        supabaseProfile?.name ||
        supabaseUser?.user_metadata?.full_name ||
        (supabaseUser?.email ? supabaseUser.email.split('@')[0] : (currentLang === 'pt' ? 'Empresa Cliente' : 'Corporate Client'));
      return {
        roleKey: 'empresa',
        roleLabel: currentLang === 'pt' ? 'Empresa' : 'Company',
        displayName: compName,
        specialty: supabaseProfile?.company_sector || null,
        fullTitle: `${currentLang === 'pt' ? 'Empresa' : 'Company'}: ${compName}`,
        icon: <Building2 className="w-3.5 h-3.5 text-blue-200" />,
        badgeStyle: 'bg-white/20 hover:bg-white/30 text-white border-white/40'
      };
    }

    // 7. Fallback para utilizador autenticado genérico
    const fallbackName =
      supabaseProfile?.name ||
      supabaseUser?.user_metadata?.full_name ||
      (supabaseUser?.email ? supabaseUser.email.split('@')[0] : (currentLang === 'pt' ? 'Particular' : 'Individual'));
    return {
      roleKey: 'lar',
      roleLabel: currentLang === 'pt' ? 'Particular' : 'Individual',
      displayName: fallbackName,
      specialty: null,
      fullTitle: `${currentLang === 'pt' ? 'Particular' : 'Individual'}: ${fallbackName}`,
      icon: <Home className="w-3.5 h-3.5 text-emerald-400" />,
      badgeStyle: 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border-emerald-500/50'
    };
  };

  const roleInfo = getUserRoleAndProfileDetails();

  // Contas de Técnico/Profissional (candidatos) não precisam de navegar para os
  // catálogos de "Técnicos de Campo" / "Talentos e Quadros" — esses menus servem
  // para clientes procurarem e contratarem candidatos, não para o próprio candidato.
  // Escondê-los reduz o menu ao que é realmente necessário no fluxo do técnico.
  const isCandidateRole = isUserAuthenticated && (roleInfo.roleKey === 'tecnico' || roleInfo.roleKey === 'profissional');

  const handleDashboardNavigation = () => {
    if (roleInfo.roleKey === 'admin') {
      setActiveTab('admin');
    } else if (roleInfo.roleKey === 'tecnico' || roleInfo.roleKey === 'profissional') {
      setActiveTab('professional_profile');
    } else {
      setActiveTab('company');
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#172554] border-b border-blue-900/80 shadow-[0_8px_30px_rgba(30,58,138,0.28)] px-2 sm:px-4 xl:px-6 py-1 sm:py-1.5 transition-colors duration-300 text-white">
        {/* TOP MINI STATUS BAR (Ultra-compact with luminous balance) */}
        <div className="flex items-center justify-between text-xs pb-1 border-b border-blue-800/60 w-full overflow-visible relative">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate text-white">
            <span className="flex items-center gap-1.5 text-white font-mono font-bold tracking-wide shrink-0 text-xs sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              PORTAL TARIRA <span className="hidden xs:inline">• 2026</span>
            </span>
          </div>

          {/* Right side: Language Toggle & Status */}
          <div className="flex items-center gap-2 sm:gap-3 font-sans shrink-0">
            {/* Bilingual Toggle (PT / EN) */}
            <div className="flex items-center bg-white/15 border border-white/25 rounded-full p-0.5 text-xs font-mono shadow-xs">
              <button
                type="button"
                onClick={() => onToggleLang && onToggleLang('pt')}
                className={`px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                  currentLang === 'pt'
                    ? 'bg-white text-[#172554] shadow-xs'
                    : 'text-blue-100 hover:text-white'
                }`}
                title="Mudar idioma para Português"
              >
                PT
              </button>
              <button
                type="button"
                onClick={() => onToggleLang && onToggleLang('en')}
                className={`px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-white text-[#172554] shadow-xs'
                    : 'text-blue-100 hover:text-white'
                }`}
                title="Switch language to English"
              >
                EN
              </button>
            </div>

            <span className="hidden sm:flex items-center gap-1.5 text-xs text-white font-mono px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-800/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Maputo & Matola, MZ • 24/7</span>
            </span>
          </div>
        </div>

        {/* MAIN HEADER ROW */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 xl:gap-3 pt-1 w-full min-w-0">
          {/* Logo - Marca e Identidade Visual: Ícone + TARIRA no Mobile (compacto e limpo), com Slogans completos a partir de tablet/desktop */}
          <div 
            id="header-tarira-brand-logo"
            className="flex items-center cursor-pointer shrink-0" 
            onClick={() => setActiveTab('landing')}
            title="TARIRA - Início"
          >
            <div className="hidden sm:block">
              <TariraLogo lightBg={false} size="xs" align="left" withSlogan={true} />
            </div>
            <div className="block sm:hidden">
              <TariraLogo lightBg={false} size="xs" align="left" withSlogan={false} />
            </div>
          </div>

          {/* Desktop Navigation Links - Menu Original: Início, Sobre, Serviços, Técnicos de Campo, Talentos e Quadros */}
          {/* Desktop Navigation Links - Inspirado em headhunting.co.mz: Início, Sobre Nós e Dropdown de Soluções & Serviços */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 shrink min-w-0">
            {/* 1. Início */}
            <button
              id="desktop-nav-home-btn"
              onClick={() => {
                setActiveTab('landing');
                onCloseSolutionsDropdown();
              }}
              className={`px-3 py-1.5 rounded-full text-xs xl:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === 'landing'
                  ? 'bg-white text-[#172554] shadow-md font-bold'
                  : 'text-white hover:text-white hover:bg-white/15 font-bold'
              }`}
            >
              {currentLang === 'pt' ? 'Início' : 'Home'}
            </button>

            {/* 2. Sobre Nós */}
            <button
              id="desktop-nav-about-btn"
              onClick={() => {
                setActiveTab('about');
                onCloseSolutionsDropdown();
              }}
              className={`px-3 py-1.5 rounded-full text-xs xl:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === 'about'
                  ? 'bg-white text-[#172554] shadow-md font-bold'
                  : 'text-white hover:text-white hover:bg-white/15 font-bold'
              }`}
            >
              {currentLang === 'pt' ? 'Sobre Nós' : 'About Us'}
            </button>

            {/* 3. Soluções & Serviços (Dropdown que reúne todas as unidades e portais) */}
            <div className="relative">
              <button
                id="desktop-nav-solutions-btn"
                type="button"
                onClick={() => {
                  if (isSolutionsDropdownOpen) {
                    onCloseSolutionsDropdown();
                  } else {
                    onOpenSolutionsDropdown();
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-xs xl:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap border ${
                  isSolutionsDropdownOpen || ['services', 'client_find', 'profissionais', 'vagas', 'faqs', 'connect_sub', 'recruit_sub', 'business_sub', 'consulting_sub', 'studio_sub', 'spontaneous_apply'].includes(activeTab)
                    ? 'bg-white text-[#172554] border-white shadow-md font-bold'
                    : 'text-white hover:text-white hover:bg-white/15 border-transparent font-bold'
                }`}
                title={currentLang === 'pt' ? 'Ver todas as unidades e serviços' : 'View all units and services'}
              >
                <Layers className={`w-3.5 h-3.5 ${
                  isSolutionsDropdownOpen || ['services', 'client_find', 'profissionais', 'vagas', 'faqs', 'connect_sub', 'recruit_sub', 'business_sub', 'consulting_sub', 'studio_sub', 'spontaneous_apply'].includes(activeTab)
                    ? 'text-[#172554]'
                    : 'text-blue-200'
                }`} />
                <span>{currentLang === 'pt' ? 'Soluções & Serviços' : 'Solutions & Services'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSolutionsDropdownOpen ? 'rotate-180 text-[#172554]' : 'text-white'}`} />
              </button>

              {isSolutionsDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2.5 w-[580px] bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.28)] p-4 z-50 animate-fade-up text-slate-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 pb-2.5 mb-2.5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#172554] uppercase tracking-wider block">
                        {currentLang === 'pt' ? 'Soluções Integradas TARIRA' : 'TARIRA Integrated Solutions'}
                      </span>
                      <p className="text-[11px] text-slate-500 font-normal">
                        {currentLang === 'pt' ? '5 Unidades Especializadas & Acessos Diretos em Moçambique' : '5 Specialized Units & Direct Portals in Mozambique'}
                      </p>
                    </div>
                    <button 
                      onClick={onCloseSolutionsDropdown}
                      className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                      title={currentLang === 'pt' ? 'Fechar menu' : 'Close menu'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Coluna 1: As 5 Unidades */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                        {currentLang === 'pt' ? 'Unidades de Negócio' : 'Business Units'}
                      </span>
                      {[
                        { id: 'connect', name: 'TARIRA Connect', desc: currentLang === 'pt' ? 'Técnicos & Ofícios ao Domicílio' : 'Field Technicians & Home Services', icon: <TariraConnectIcon size={16} className="text-[#172554]" /> },
                        { id: 'recrute', name: 'TARIRA Recruit', desc: currentLang === 'pt' ? 'Recrutamento & Executive Search' : 'Recruitment & Executive Search', icon: <TariraRecruitIcon size={16} className="text-[#172554]" /> },
                        { id: 'business', name: 'TARIRA Outsourcing', desc: currentLang === 'pt' ? 'Gestão de Mão-de-Obra & BPO' : 'Workforce Management & BPO', icon: <TariraOutsourcingIcon size={16} className="text-[#172554]" /> },
                        { id: 'consultoria', name: 'TARIRA Consulting', desc: currentLang === 'pt' ? 'Auditoria de Processos de RH' : 'HR Consulting & Audits', icon: <TariraConsultingIcon size={16} className="text-[#172554]" /> },
                        { id: 'studio', name: 'TARIRA Studio', desc: currentLang === 'pt' ? 'Engenharia de Plataformas Digitais' : 'Digital Platform Engineering', icon: <TariraStudioIcon size={16} className="text-[#172554]" /> },
                      ].map((unit) => (
                        <button
                          key={unit.id}
                          onClick={() => {
                            onNavigateToEcosystem(unit.id);
                            onCloseSolutionsDropdown();
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 transition-all flex items-start gap-2.5 group cursor-pointer"
                        >
                          <div className="p-1 rounded-md bg-slate-100 group-hover:bg-white border border-slate-200 shrink-0 mt-0.5">
                            {unit.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-900 block truncate">
                              {unit.name}
                            </span>
                            <span className="text-[11px] text-slate-500 block truncate font-normal">
                              {unit.desc}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Coluna 2: Portais & Acessos Diretos */}
                    <div className="space-y-1 border-l border-slate-100 pl-3">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                        {currentLang === 'pt' ? 'Portais & Acessos Rápidos' : 'Portals & Quick Links'}
                      </span>
                      {[
                        {
                          label: currentLang === 'pt' ? 'Vagas & Oportunidades' : 'Jobs & Opportunities',
                          desc: currentLang === 'pt' ? 'Portal de vagas em aberto' : 'Open job positions portal',
                          icon: <Briefcase className="w-4 h-4 text-blue-700" />,
                          action: () => { setActiveTab('vagas'); onCloseSolutionsDropdown(); }
                        },
                        {
                          label: currentLang === 'pt' ? 'Técnicos de Campo' : 'Field Technicians',
                          desc: currentLang === 'pt' ? 'Eletricistas, AVAC, canalizadores' : 'Electricians, HVAC, plumbers',
                          icon: <HardHat className="w-4 h-4 text-amber-600" />,
                          action: () => { setClientSelectedCategory('tech_trades'); setActiveTab('client_find'); onCloseSolutionsDropdown(); }
                        },
                        {
                          label: currentLang === 'pt' ? 'Talentos e Quadros' : 'Talent & Executives',
                          desc: currentLang === 'pt' ? 'Analistas e gestores homologados' : 'Vetted analysts and managers',
                          icon: <GraduationCap className="w-4 h-4 text-indigo-600" />,
                          action: () => { setActiveTab('profissionais'); onCloseSolutionsDropdown(); }
                        },
                        {
                          label: currentLang === 'pt' ? 'Serviços & Preçário' : 'Services & Pricing',
                          desc: currentLang === 'pt' ? '35+ especialidades estruturadas' : '35+ structured services',
                          icon: <Wrench className="w-4 h-4 text-emerald-600" />,
                          action: () => { setActiveTab('services'); onCloseSolutionsDropdown(); }
                        },
                        {
                          label: currentLang === 'pt' ? 'Perguntas Frequentes (FAQs)' : 'FAQs & Support',
                          desc: currentLang === 'pt' ? 'Dúvidas, garantias e processos' : 'Questions, guarantees & help',
                          icon: <HelpCircle className="w-4 h-4 text-sky-600" />,
                          action: () => { setActiveTab('faqs'); onCloseSolutionsDropdown(); }
                        },
                        {
                          label: currentLang === 'pt' ? 'Candidatura Espontânea' : 'Open Application',
                          desc: currentLang === 'pt' ? 'Registo no banco de talentos' : 'Join our talent pool',
                          icon: <Sparkles className="w-4 h-4 text-purple-600" />,
                          action: () => { setActiveTab('spontaneous_apply'); onCloseSolutionsDropdown(); }
                        },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={item.action}
                          className="w-full text-left p-1.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 group cursor-pointer"
                        >
                          <div className="shrink-0 p-1 rounded-md bg-slate-100 group-hover:bg-white border border-slate-200">
                            {item.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-900 block truncate">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate font-normal">
                              {item.desc}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right side search, commercial & 🌟 AUTH BUTTONS + THREE DOTS MENU
              NOTA DE RESPONSIVIDADE: este contentor já NÃO usa "shrink-0" —
              em ecrãs estreitos (telemóvel) isso obrigava toda a fila a
              manter a sua largura total, o que empurrava o botão de "três
              pontinhos" (e por vezes o botão "Sair") para fora da área
              visível do ecrã, sem scroll horizontal para o alcançar. Agora o
              contentor pode encolher (min-w-0) e o bloco de autenticação
              abaixo tem o seu próprio scroll horizontal interno, garantindo
              que o botão de três pontinhos — o mais importante em mobile —
              nunca fica escondido. */}
          <div className="flex items-center gap-1 sm:gap-2 xl:gap-2.5 shrink-0 justify-end ml-auto">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit(headerSearchInput);
              }}
              className="hidden 2xl:flex items-center relative"
            >
              <Search className="w-3.5 h-3.5 text-blue-200 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={headerSearchInput}
                onChange={(e) => setHeaderSearchInput(e.target.value)}
                placeholder={currentLang === 'pt' ? 'Pesquisar no portal...' : 'Search portal...'}
                className="bg-white/15 border border-white/25 rounded-full pl-8 pr-3 py-1 text-xs text-white placeholder:text-white/60 focus:outline-none focus:bg-white focus:text-[#172554] focus:placeholder:text-[#172554]/50 w-36 xl:w-44 transition-all shadow-xs"
              />
            </form>

            {/* Contact Commercial Button (Only visible on wide 2xl screens to leave room for auth controls) */}
            <button
              id="header-commercial-btn"
              type="button"
              onClick={onOpenCommercialModal}
              className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 hover:bg-white text-white hover:text-[#172554] border border-white/30 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              title="Aceder à Gestão Comercial B2B"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{currentLang === 'pt' ? 'Comercial' : 'Sales'}</span>
            </button>

            {/* 🌟 AUTHENTICATION / ACCOUNT PORTAL CONTROLS */}
            <div className="flex items-center shrink-0">
            {isUserAuthenticated ? (
              /* Authenticated Controls */
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* 🛡️ PERFIL ADMINISTRADOR: INDICADOR INTERATIVO QUE ABRE O PAINEL DE GESTÃO + BOTÃO SAIR */}
                {roleInfo.roleKey === 'admin' ? (
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink min-w-0">
                    <button
                      type="button"
                      id="header-admin-profile-badge"
                      onClick={() => setActiveTab('admin')}
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs min-w-0 shrink cursor-pointer active:scale-95 border ${
                        activeTab === 'admin' || activeTab === 'central' || activeTab === 'central_ops'
                          ? 'bg-white text-[#172554] border-white shadow-md'
                          : 'bg-white/15 hover:bg-white/25 text-white border-white/30'
                      }`}
                      title={currentLang === 'pt' ? 'Ir para a Página de Gestão do Administrador' : 'Open Administrator Management Dashboard'}
                    >
                      <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${
                        activeTab === 'admin' || activeTab === 'central' || activeTab === 'central_ops'
                          ? 'text-[#172554]'
                          : 'text-blue-200'
                      }`} />
                      <span className="font-extrabold uppercase text-xs tracking-wide truncate">
                        {currentLang === 'pt' ? 'Administrador' : 'Administrator'}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 ring-2 ring-emerald-950 ml-0.5" title="Sessão Activa"></span>
                    </button>

                    {/* O ÚNICO BOTÃO DISPONÍVEL NO PAINEL ADMINISTRADOR: SAIR */}
                    <button
                      id="top-btn-logout"
                      onClick={() => {
                        onSignOut();
                        setActiveTab('landing');
                      }}
                      className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 shadow-md active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
                      title={currentLang === 'pt' ? 'Terminar Sessão e Voltar ao Menu Principal' : 'Log out and return to main menu'}
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-200 shrink-0" />
                      <span className="hidden xs:inline font-bold">{currentLang === 'pt' ? 'Sair' : 'Log out'}</span>
                    </button>
                  </div>
                ) : (
                  /* Outros perfis autenticados (Empresa, Lar, Condomínio, Prestador) */
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink min-w-0">
                    <button
                      id="header-auth-dashboard-btn"
                      onClick={handleDashboardNavigation}
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer border shadow-xs active:scale-95 min-w-0 shrink max-w-[92px] xs:max-w-[130px] sm:max-w-[220px] 2xl:max-w-[380px] ${
                        activeTab === 'company' || activeTab === 'professional_profile'
                          ? 'bg-white !text-[#172554] text-[#172554] border-white shadow-md'
                          : roleInfo.badgeStyle
                      }`}
                      title={`${roleInfo.fullTitle} - ${currentLang === 'pt' ? 'Clique para aceder ao painel' : 'Click to view dashboard'}`}
                    >
                      <span className="shrink-0">{roleInfo.icon}</span>
                      <span className={`font-bold uppercase text-xs sm:text-xs shrink-0 ${
                        activeTab === 'company' || activeTab === 'professional_profile'
                          ? '!text-[#172554] text-[#172554]'
                          : 'text-white'
                      }`}>
                        {roleInfo.roleLabel}:
                      </span>
                      <span className={`truncate font-extrabold text-xs sm:text-xs ${
                        activeTab === 'company' || activeTab === 'professional_profile'
                          ? '!text-[#172554] text-[#172554]'
                          : 'text-slate-100'
                      }`}>
                        {roleInfo.displayName}
                      </span>
                      {roleInfo.specialty && (
                        <span className={`hidden sm:inline text-xs truncate font-medium ${
                          activeTab === 'company' || activeTab === 'professional_profile'
                            ? '!text-[#3B5998] text-[#3B5998]'
                            : 'text-slate-300/80'
                        }`}>
                          ({roleInfo.specialty})
                        </span>
                      )}
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 ring-2 ring-emerald-950 ml-0.5" title="Sessão Activa"></span>
                    </button>

                    <button
                      id="top-btn-logout"
                      onClick={() => {
                        onSignOut();
                        setActiveTab('landing');
                      }}
                      className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full text-xs font-bold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-600 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 whitespace-nowrap"
                      title={currentLang === 'pt' ? 'Terminar Sessão (Sair da Conta)' : 'Log out'}
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-300 hover:text-white shrink-0" />
                      <span className="hidden xs:inline font-bold">{currentLang === 'pt' ? 'Sair' : 'Log out'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Public / Visitor Authentication CTAs: [Entrar] + [Criar Conta] organizados perfeitamente */
              <div className="flex items-center gap-1 sm:gap-2 shrink-0 z-10">
                <button
                  id="header-btn-signin"
                  onClick={() => onOpenAuthModal('signin')}
                  className="flex items-center gap-1 text-white hover:text-white font-bold py-1 sm:py-1.5 px-2 sm:px-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 transition-all text-xs cursor-pointer shadow-xs shrink-0 whitespace-nowrap active:scale-95"
                  title={currentLang === 'pt' ? 'Iniciar Sessão (Entrar)' : 'Sign In'}
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                  <span className="font-bold">{currentLang === 'pt' ? 'Entrar' : 'Sign In'}</span>
                </button>

                <button
                  id="header-btn-signup"
                  onClick={() => onOpenAuthModal('signup')}
                  className="flex items-center gap-1 !text-[#172554] text-[#172554] font-bold py-1 sm:py-1.5 px-2 sm:px-4 rounded-full bg-white hover:bg-blue-50 shadow-md transition-all text-xs cursor-pointer shrink-0 whitespace-nowrap border border-white hover:scale-[1.02] active:scale-95"
                  title="Criar Nova Conta no Portal TARIRA"
                >
                  <UserPlus className="w-3.5 h-3.5 !text-[#172554] text-[#172554] stroke-[2.5] shrink-0" />
                  <span className="!text-[#172554] text-[#172554] font-bold hidden xs:inline">{currentLang === 'pt' ? 'Criar Conta' : 'Sign Up'}</span>
                  <span className="!text-[#172554] text-[#172554] font-bold xs:hidden">{currentLang === 'pt' ? 'Registo' : 'Sign Up'}</span>
                </button>
              </div>
            )}
            </div>

            {/* 🌟 MENU DE TRÊS PONTINHOS (Sempre visível no Mobile e Tablet) */}
            <button
              id="mobile-three-dots-trigger-btn"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center p-1.5 sm:p-2 rounded-xl bg-white text-[#172554] font-bold border border-white shadow-md active:scale-95 transition-all cursor-pointer shrink-0 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] z-20 ml-0.5"
              title={isMobileMenuOpen ? 'Fechar Menu' : 'Abrir Menu (Três Pontinhos)'}
              aria-label="Abrir Menu de Três Pontinhos"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#172554] stroke-[3]" />
              ) : (
                <MoreVertical className="w-5 h-5 text-[#172554] stroke-[3]" />
              )}
            </button>
          </div>
        </div>

        {/* 📱 MOBILE & TABLET MAIN NAVIGATION: EXACTLY 3 MAIN MENUS (INÍCIO, SOBRE NÓS, SOLUÇÕES & SERVIÇOS) */}
        <div className="flex lg:hidden flex-col gap-1.5 pt-1 pb-1 w-full relative">
          <div className="flex items-center justify-between gap-1.5 w-full">
            {/* 1. Início */}
            <button
              id="mobile-nav-home-btn"
              onClick={() => {
                onCloseSolutionsDropdown();
                setActiveTab('landing');
              }}
              className={`flex-1 py-1.5 px-2.5 rounded-full text-xs font-bold uppercase tracking-wider border whitespace-nowrap cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                activeTab === 'landing' && !isSolutionsDropdownOpen
                  ? 'bg-white text-[#172554] border-white font-bold shadow-sm'
                  : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
              }`}
            >
              <Home className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{currentLang === 'pt' ? 'Início' : 'Home'}</span>
            </button>

            {/* 2. Sobre Nós */}
            <button
              id="mobile-nav-about-btn"
              onClick={() => {
                onCloseSolutionsDropdown();
                setActiveTab('about');
              }}
              className={`flex-1 py-1.5 px-2.5 rounded-full text-xs font-bold uppercase tracking-wider border whitespace-nowrap cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                activeTab === 'about' && !isSolutionsDropdownOpen
                  ? 'bg-white text-[#172554] border-white font-bold shadow-sm'
                  : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{currentLang === 'pt' ? 'Sobre Nós' : 'About Us'}</span>
            </button>

            {/* 3. Soluções & Serviços ▾ */}
            <button
              id="mobile-nav-solutions-btn"
              type="button"
              onClick={() => {
                if (isSolutionsDropdownOpen) {
                  onCloseSolutionsDropdown();
                } else {
                  onOpenSolutionsDropdown();
                }
              }}
              className={`flex-[1.3] py-1.5 px-2.5 rounded-full text-xs font-bold uppercase tracking-wider border whitespace-nowrap cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                isSolutionsDropdownOpen || ['services', 'client_find', 'profissionais', 'vagas', 'faqs', 'connect_sub', 'recruit_sub', 'business_sub', 'consulting_sub', 'studio_sub', 'spontaneous_apply'].includes(activeTab)
                  ? 'bg-white text-[#172554] border-white font-bold shadow-sm'
                  : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{currentLang === 'pt' ? 'Soluções & Serviços' : 'Solutions & Services'}</span>
              <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isSolutionsDropdownOpen ? 'rotate-180 text-[#172554]' : 'text-white'}`} />
            </button>

            {/* Admin Pill (Only rendered when Admin is actively authenticated) */}
            {isAdminLoggedIn && (
              <button
                id="mobile-pill-admin-btn"
                onClick={() => {
                  onCloseSolutionsDropdown();
                  setActiveTab('admin');
                }}
                className={`py-1.5 px-2.5 rounded-full text-xs font-bold uppercase tracking-wider border whitespace-nowrap cursor-pointer transition-all shadow-sm shrink-0 flex items-center gap-1 ${
                  activeTab === 'admin' || activeTab === 'central' || activeTab === 'central_ops'
                    ? 'bg-white text-[#172554] border-white font-bold'
                    : 'bg-white/20 text-white border-white/35 hover:bg-white/30 font-bold'
                }`}
                title="Aceder ao Painel de Administrador Geral"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            )}
          </div>

          {/* 📱 MOBILE / TABLET SOLUTIONS & SERVICES EXPANDED DROPDOWN */}
          {isSolutionsDropdownOpen && (
            <div 
              className="w-full bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 mt-1 text-slate-800 animate-fade-up z-50 max-h-[75vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono font-bold text-[#172554] uppercase tracking-wider block">
                    {currentLang === 'pt' ? 'Soluções Integradas TARIRA' : 'TARIRA Integrated Solutions'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {currentLang === 'pt' ? '5 Unidades Especializadas & Acessos Diretos' : '5 Specialized Units & Direct Portals'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onCloseSolutionsDropdown}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Seção 1: 5 Unidades */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block px-1 mb-1">
                  {currentLang === 'pt' ? 'Unidades de Negócio' : 'Business Units'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {[
                    { id: 'connect', name: 'TARIRA Connect', desc: currentLang === 'pt' ? 'Técnicos & Ofícios ao Domicílio' : 'Field Technicians & Home Services', icon: <TariraConnectIcon size={16} className="text-[#172554]" /> },
                    { id: 'recrute', name: 'TARIRA Recruit', desc: currentLang === 'pt' ? 'Recrutamento & Executive Search' : 'Recruitment & Executive Search', icon: <TariraRecruitIcon size={16} className="text-[#172554]" /> },
                    { id: 'business', name: 'TARIRA Outsourcing', desc: currentLang === 'pt' ? 'Gestão de Mão-de-Obra & BPO' : 'Workforce Management & BPO', icon: <TariraOutsourcingIcon size={16} className="text-[#172554]" /> },
                    { id: 'consultoria', name: 'TARIRA Consulting', desc: currentLang === 'pt' ? 'Auditoria de Processos de RH' : 'HR Consulting & Audits', icon: <TariraConsultingIcon size={16} className="text-[#172554]" /> },
                    { id: 'studio', name: 'TARIRA Studio', desc: currentLang === 'pt' ? 'Engenharia de Plataformas Digitais' : 'Digital Platform Engineering', icon: <TariraStudioIcon size={16} className="text-[#172554]" /> },
                  ].map((unit) => (
                    <button
                      key={unit.id}
                      onClick={() => {
                        onNavigateToEcosystem(unit.id);
                        onCloseSolutionsDropdown();
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 transition-all flex items-start gap-2.5 group cursor-pointer"
                    >
                      <div className="p-1 rounded-md bg-slate-100 group-hover:bg-white border border-slate-200 shrink-0 mt-0.5">
                        {unit.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-900 block truncate">
                          {unit.name}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate font-normal">
                          {unit.desc}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seção 2: Portais & Acessos Rápidos */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block px-1 mb-1">
                  {currentLang === 'pt' ? 'Portais & Acessos Rápidos' : 'Portals & Quick Links'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {[
                    {
                      label: currentLang === 'pt' ? 'Vagas & Oportunidades' : 'Jobs & Opportunities',
                      desc: currentLang === 'pt' ? 'Portal de vagas em aberto' : 'Open job positions portal',
                      icon: <Briefcase className="w-4 h-4 text-blue-700" />,
                      action: () => { setActiveTab('vagas'); onCloseSolutionsDropdown(); }
                    },
                    {
                      label: currentLang === 'pt' ? 'Técnicos de Campo' : 'Field Technicians',
                      desc: currentLang === 'pt' ? 'Eletricistas, AVAC, canalizadores' : 'Electricians, HVAC, plumbers',
                      icon: <HardHat className="w-4 h-4 text-amber-600" />,
                      action: () => { setClientSelectedCategory('tech_trades'); setActiveTab('client_find'); onCloseSolutionsDropdown(); }
                    },
                    {
                      label: currentLang === 'pt' ? 'Talentos e Quadros' : 'Talent & Executives',
                      desc: currentLang === 'pt' ? 'Analistas e gestores homologados' : 'Vetted analysts and managers',
                      icon: <GraduationCap className="w-4 h-4 text-indigo-600" />,
                      action: () => { setActiveTab('profissionais'); onCloseSolutionsDropdown(); }
                    },
                    {
                      label: currentLang === 'pt' ? 'Serviços & Preçário' : 'Services & Pricing',
                      desc: currentLang === 'pt' ? '35+ especialidades estruturadas' : '35+ structured services',
                      icon: <Wrench className="w-4 h-4 text-emerald-600" />,
                      action: () => { setActiveTab('services'); onCloseSolutionsDropdown(); }
                    },
                    {
                      label: currentLang === 'pt' ? 'Perguntas Frequentes (FAQs)' : 'FAQs & Support',
                      desc: currentLang === 'pt' ? 'Dúvidas, garantias e processos' : 'Questions, guarantees & help',
                      icon: <HelpCircle className="w-4 h-4 text-sky-600" />,
                      action: () => { setActiveTab('faqs'); onCloseSolutionsDropdown(); }
                    },
                    {
                      label: currentLang === 'pt' ? 'Candidatura Espontânea' : 'Open Application',
                      desc: currentLang === 'pt' ? 'Registo no banco de talentos' : 'Join our talent pool',
                      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
                      action: () => { setActiveTab('spontaneous_apply'); onCloseSolutionsDropdown(); }
                    },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={item.action}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2.5 group cursor-pointer border border-transparent hover:border-slate-200"
                    >
                      <div className="shrink-0 p-1 rounded-md bg-slate-100 group-hover:bg-white border border-slate-200">
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-900 block truncate">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate font-normal">
                          {item.desc}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
