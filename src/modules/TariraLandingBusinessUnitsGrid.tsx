import React, { useState, useEffect } from "react";
import {
  TariraConnectIcon,
  TariraRecruitIcon,
  TariraOutsourcingIcon,
  TariraConsultingIcon,
  TariraStudioIcon
} from "../components/TariraUnitIcons";

export interface TariraLandingBusinessUnitsGridProps {
  onNavigate: (id: "connect" | "recrute" | "business" | "consultoria" | "studio" | string) => void;
  currentLang?: "pt" | "en";
}

interface UnitItem {
  id: "connect" | "recrute" | "business" | "consultoria" | "studio";
  name: string;
  badge: { pt: string; en: string };
  badgeSub?: { pt: string; en: string };
  description: { pt: string; en: string };
  highlights: { pt: string[]; en: string[] };
  icon: (active: boolean) => React.ReactNode;
}

const UNITS_LIST: UnitItem[] = [
  {
    id: "connect",
    name: "Tarira Connect",
    badge: { pt: "Técnicos de Campo", en: "Field Technicians" },
    icon: (active) => (
      <TariraConnectIcon
        size={24}
        className={`transition-colors duration-300 ${active ? "text-white" : "text-brand"}`}
      />
    ),
    description: {
      pt: "Eletricistas, canalizadores, técnicos de AVAC e serviços ao lar em Maputo e Matola, com identificação validada e acompanhamento da intervenção.",
      en: "Electricians, plumbers, HVAC technicians and domestic facility services across Maputo and Matola, with verified identity and direct supervision."
    },
    highlights: {
      pt: ["Identidade verificada", "Maputo e Matola", "Substituição se o técnico falhar"],
      en: ["Verified identity", "Maputo & Matola", "Immediate technician replacement"]
    }
  },
  {
    id: "recrute",
    name: "Tarira Recruit",
    badge: { pt: "Recrutamento & Seleção", en: "Recruitment & Selection" },
    icon: (active) => (
      <TariraRecruitIcon
        size={24}
        className={`transition-colors duration-300 ${active ? "text-white" : "text-brand"}`}
      />
    ),
    description: {
      pt: "Pesquisa e seleção de quadros técnicos, administrativos e de direção para empresas em Moçambique, com entrevistas presenciais e verificação de referências.",
      en: "Executive search and candidate recruitment for technical, managerial and staff positions in Mozambique, with in-person vetting and credential checks."
    },
    highlights: {
      pt: ["Triagem documental", "Entrevistas técnicas", "Garantia contratual de reposição"],
      en: ["Credential screening", "Technical interviews", "Contractual replacement guarantee"]
    }
  },
  {
    id: "business",
    name: "Tarira Outsourcing",
    badge: { pt: "Outsourcing B2B", en: "B2B Staff Outsourcing" },
    badgeSub: { pt: "RPO & Equipas", en: "RPO & Teams" },
    icon: (active) => (
      <TariraOutsourcingIcon
        size={24}
        className={`transition-colors duration-300 ${active ? "text-white" : "text-brand"}`}
      />
    ),
    description: {
      pt: "Alocação e gestão administrativa de equipas operacionais, processamento salarial, obrigações de INSS/IRPS e supervisão presencial.",
      en: "Operational workforce allocation and administration, payroll processing, statutory INSS/IRPS compliance and on-site oversight."
    },
    highlights: {
      pt: ["Folha salarial e INSS", "Supervisão no terreno", "Gestão de assiduidade"],
      en: ["Payroll & INSS compliance", "On-site supervision", "Attendance management"]
    }
  },
  {
    id: "consultoria",
    name: "Tarira Consulting",
    badge: { pt: "Organização & Processos", en: "Operations & Org Design" },
    icon: (active) => (
      <TariraConsultingIcon
        size={24}
        className={`transition-colors duration-300 ${active ? "text-white" : "text-brand"}`}
      />
    ),
    description: {
      pt: "Diagnóstico de operações, desenho de organogramas, grelhas salariais e revisão de procedimentos internos para PMEs e operações em crescimento.",
      en: "Operational diagnostics, organizational restructuring, salary grids and internal standard operating procedures for SMEs."
    },
    highlights: {
      pt: ["Mapeamento de funções", "Revisão operacional", "Estruturação de equipas"],
      en: ["Role mapping", "Operational reviews", "Team structuring"]
    }
  },
  {
    id: "studio",
    name: "Tarira Studio",
    badge: { pt: "Software & Integrações", en: "Software & Integrations" },
    icon: (active) => (
      <TariraStudioIcon
        size={24}
        className={`transition-colors duration-300 ${active ? "text-white" : "text-brand"}`}
      />
    ),
    description: {
      pt: "Desenvolvimento de portais internos, integração de pagamentos móveis (M-Pesa e e-Mola) e automação de fluxos de trabalho.",
      en: "Custom business web applications, mobile money API integrations (M-Pesa & e-Mola) and automated operational workflows."
    },
    highlights: {
      pt: ["Integrações M-Pesa / e-Mola", "Sistemas à medida", "Código entregue ao cliente"],
      en: ["M-Pesa & e-Mola integration", "Tailored software", "Client-owned deliverables"]
    }
  }
];

export const TariraLandingBusinessUnitsGrid: React.FC<TariraLandingBusinessUnitsGridProps> = ({ onNavigate, currentLang = "pt" }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const lang = currentLang === "en" ? "en" : "pt";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 w-full">
      {UNITS_LIST.map((unit, idx) => {
        const isActive = hoveredIndex === idx;

        return (
          <div
            key={unit.id}
            id={`card-ecosystem-${unit.id}`}
            onClick={() => onNavigate(unit.id)}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`group relative p-6 rounded-xl text-left transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[300px] w-full overflow-hidden ${
              isActive
                ? "bg-brand text-white border border-brand shadow-md"
                : "bg-white text-brand border border-border shadow-xs hover:border-brand"
            }`}
          >
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-colors duration-300 shrink-0 ${
                    isActive
                      ? "bg-white/15 text-white border-white/30"
                      : "bg-slate-50 text-brand border-border"
                  }`}
                >
                  {unit.icon(isActive)}
                </div>
                <div className="flex flex-col items-end text-right">
                  <span
                    className={`text-xs font-medium transition-colors duration-300 ${
                      isActive ? "text-blue-100" : "text-text-secondary"
                    }`}
                  >
                    {unit.badge[lang]}
                  </span>
                  {unit.badgeSub && (
                    <span
                      className={`text-xs font-mono mt-0.5 transition-colors duration-300 ${
                        isActive ? "text-blue-200" : "text-brand-light"
                      }`}
                    >
                      {unit.badgeSub[lang]}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <h3
                  className={`text-xl font-serif font-bold transition-colors duration-300 ${
                    isActive ? "text-white" : "text-brand"
                  }`}
                >
                  {unit.name}
                </h3>
                <p
                  className={`text-sm leading-relaxed font-sans font-normal transition-colors duration-300 ${
                    isActive ? "text-blue-50" : "text-text-secondary"
                  }`}
                >
                  {unit.description[lang]}
                </p>
              </div>

              <div className="pt-1 text-xs leading-relaxed">
                <span className={isActive ? "text-blue-100" : "text-slate-600"}>
                  {unit.highlights[lang].join(" · ")}
                </span>
              </div>
            </div>

            <div
              className={`pt-4 border-t flex items-center justify-between text-xs font-semibold transition-colors duration-300 mt-5 relative z-10 ${
                isActive ? "border-white/20 text-white" : "border-border text-brand"
              }`}
            >
              <span>{lang === "en" ? "Access unit" : "Aceder à unidade"}</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TariraLandingBusinessUnitsGrid;
