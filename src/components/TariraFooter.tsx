import React from 'react';
import { Mail, Linkedin, MessageCircle, Instagram } from 'lucide-react';
import {
  TariraConnectIcon,
  TariraRecruitIcon,
  TariraOutsourcingIcon,
  TariraConsultingIcon,
  TariraStudioIcon,
} from './TariraUnitIcons';
import { Lang, t } from '../data/translations';

export interface TariraFooterProps {
  currentLang: Lang;
  setActiveTab: (tab: any) => void;
  onNavigateToEcosystem?: (unitId: string) => void;
  setAboutActiveSection?: (section: 'about' | 'careers' | 'contact') => void;
  setClientSelectedCategory?: (cat: string) => void;
  setIsLegalModalOpen?: (open: boolean) => void;
  onOpenLegalModal?: () => void;
  onOpenCommercialModal?: () => void;
  socialLinks?: {
    email?: string;
    linkedin?: string;
    whatsapp?: string;
    instagram?: string;
    phone1?: string;
    phone2?: string;
  };
}

export const TariraFooter: React.FC<TariraFooterProps> = ({
  currentLang,
  setActiveTab,
  onNavigateToEcosystem,
  setAboutActiveSection,
  setClientSelectedCategory,
  setIsLegalModalOpen,
  onOpenLegalModal,
  onOpenCommercialModal,
  socialLinks = {},
}) => {
  const email = socialLinks.email || 'tarira.ecossistema@gmail.com';
  const linkedin = socialLinks.linkedin || 'https://www.linkedin.com/in/tarira-ecossistema';
  const whatsapp = socialLinks.whatsapp || 'https://wa.me/258871425316?text=Ol%C3%A1%20TARIRA,%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es';
  const instagram = socialLinks.instagram || 'https://www.instagram.com/tarira.weoversee';
  const phone1 = socialLinks.phone1 || '+258 87 142 5316';

  const navigateUnit = (unitId: string) => {
    if (onNavigateToEcosystem) {
      onNavigateToEcosystem(unitId);
    } else {
      if (unitId === 'connect') setActiveTab('connect_sub');
      else if (unitId === 'recrute') setActiveTab('recruit_sub');
      else if (unitId === 'business') setActiveTab('business_sub');
      else if (unitId === 'consultoria') setActiveTab('consulting_sub');
      else if (unitId === 'studio') setActiveTab('studio_sub');
    }
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAboutSection = (section: 'about' | 'careers' | 'contact') => {
    if (setAboutActiveSection) setAboutActiveSection(section);
    setActiveTab('about');
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#1A3478] px-4 sm:px-6 py-12 bg-[#172554] text-white mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Column 1: Branding, Purpose & Socials */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-col">
            <span className="text-white font-serif text-2xl tracking-[0.2em] font-extrabold block">
              TARIRA
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-200 mt-0.5">
              {currentLang === 'pt' ? 'Supervisão Operacional & Capital Humano' : 'Operational Oversight & Human Capital'}
            </span>
          </div>
          
          <p className="text-xs text-blue-100 leading-relaxed max-w-md font-normal">
            {t('footer_desc', currentLang)}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a
              href={`mailto:${email}?subject=${encodeURIComponent('Contacto via Portal TARIRA')}`}
              aria-label="Email TARIRA"
              title={`Email: ${email}`}
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white text-white hover:text-[#172554] border border-white/20 flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn TARIRA"
              title="LinkedIn Oficial"
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white text-white hover:text-[#172554] border border-white/20 flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp TARIRA"
              title={`WhatsApp: ${phone1}`}
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white text-white hover:text-[#172554] border border-white/20 flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram TARIRA"
              title="Instagram Oficial"
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white text-white hover:text-[#172554] border border-white/20 flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          <div className="text-xs text-blue-200/80 font-mono pt-1">
            <span>📍 Maputo & Matola, Moçambique</span>
            <span className="mx-2">·</span>
            <span>📞 {phone1}</span>
          </div>
        </div>

        {/* Column 2: Unidades Operacionais */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 font-mono border-b border-white/20 pb-1">
            {t('footer_units', currentLang)}
          </h4>
          <ul className="space-y-2 text-xs">
            {[
              { id: 'connect', label: 'TARIRA Connect', icon: <TariraConnectIcon size={14} className="text-[#172554]" /> },
              { id: 'recrute', label: 'TARIRA Recruit', icon: <TariraRecruitIcon size={14} className="text-[#172554]" /> },
              { id: 'business', label: 'TARIRA Outsourcing', icon: <TariraOutsourcingIcon size={14} className="text-[#172554]" /> },
              { id: 'consultoria', label: 'TARIRA Consulting', icon: <TariraConsultingIcon size={14} className="text-[#172554]" /> },
              { id: 'studio', label: 'TARIRA Studio', icon: <TariraStudioIcon size={14} className="text-[#172554]" /> },
            ].map((unit) => (
              <li key={unit.id}>
                <button
                  type="button"
                  onClick={() => navigateUnit(unit.id)}
                  className="w-full text-left bg-white text-[#172554] px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs hover:bg-blue-50 transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <span className="shrink-0">{unit.icon}</span>
                    <span>{unit.label}</span>
                  </span>
                  <span className="text-blue-400 group-hover:text-[#172554] transition-colors">→</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Empresa, Links & Suporte */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 font-mono border-b border-white/20 pb-1">
            {t('footer_company', currentLang)}
          </h4>
          <ul className="space-y-2.5 text-xs text-blue-100 font-medium">
            <li>
              <button
                type="button"
                onClick={() => navigateToAboutSection('about')}
                className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
              >
                <span>ℹ️</span> {t('nav_about', currentLang)}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('vagas');
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
              >
                <span>💼</span> {t('nav_jobs', currentLang)}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('services');
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
              >
                <span>📋</span> {t('nav_services', currentLang)}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  if (setClientSelectedCategory) setClientSelectedCategory('tech_trades');
                  setActiveTab('client_find');
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
              >
                <span>🔧</span> {t('nav_technicians', currentLang)}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('profissionais');
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
              >
                <span>🎓</span> {t('nav_talents', currentLang)}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('faqs');
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
              >
                <span>❓</span> {t('nav_faqs', currentLang)}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigateToAboutSection('contact')}
                className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
              >
                <span>📞</span> {currentLang === 'pt' ? 'Contacto Directo' : 'Direct Contact'}
              </button>
            </li>
            {(onOpenLegalModal || setIsLegalModalOpen) && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenLegalModal) onOpenLegalModal();
                    else setIsLegalModalOpen?.(true);
                  }}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer text-blue-200"
                >
                  <span>🔒</span> {t('footer_terms', currentLang)}
                </button>
              </li>
            )}
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-blue-100">
        <span>
          © 2026 TARIRA · Moçambique · {t('footer_rights', currentLang)}
        </span>
        <span className="font-mono text-xs tracking-wider text-white font-semibold">
          {t('footer_alliance', currentLang)}
        </span>
      </div>
    </footer>
  );
};
