import React, { useState, useMemo, useEffect } from "react";
import { useBodyScrollLock } from "./useBodyScrollLock";
import { 
  ArrowLeft,
  Search, 
  X, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  CheckCircle2, 
  UserCheck, 
  FileText, 
  ExternalLink, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Eye,
  Calendar,
  Check,
  PhoneCall,
  Zap,
  Wrench,
  Clock,
  Car,
  AlertTriangle,
  Award,
  Star,
  Layers,
  FileCheck,
  Phone,
  MessageSquare,
  Users,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserPlus,
  Lock,
  Info
} from "lucide-react";
import { Candidate } from "./types";
import { AccessRestrictedModal } from "./AccessRestrictedModal";
import { SERVICES } from "./data";
import { VerticalOrbitBadge, TypewriterPromise } from "./TariraVisualEffects";

interface TariraTechniciansDirectoryProps {
  candidates: Candidate[];
  setActiveTab: (tab: string) => void;
  onGoBack?: () => void;
  onSelectCandidate?: (candidate: Candidate) => void;
  onViewCandidate?: (candidate: Candidate) => void;
  onViewPortfolio?: (candidate: Candidate) => void;
  onRequestBriefing?: () => void;
  onContactCommercial?: () => void;
  checkAccess?: (action: string) => boolean;
  currentLang?: "pt" | "en";
  initialCategory?: string;
  userRole?: "admin" | "empresa" | "condominio" | "lar" | "prestador" | "guest";
  userEmail?: string;
  currentCandidateId?: string | null;
  onOpenRegisterModal?: (role?: "lar" | "company" | "provider") => void;
  onSwitchRoleTest?: (role: "admin" | "empresa" | "condominio" | "lar" | "prestador" | "guest") => void;
}

// Canonical 8 Service Categories matching the 35 Structured Services of TARIRA Connect
export const TECHNICIAN_CATEGORIES = [
  { 
    id: "all", 
    alias: ["all", "tech_trades", "elite_hub"],
    label: "Todos os Ofícios & Técnicos", 
    icon: "🌐",
    description: "Catálogo unificado de técnicos de campo, artífices e apoio ao lar homologados pela TARIRA Connect",
    services: []
  },
  { 
    id: "domesticos", 
    alias: ["dom", "domesticos", "servicos_domesticos", "babas", "dom2", "cuidados", "baba"],
    label: "Serviços Domésticos", 
    icon: "🧹",
    description: "Empregadas domésticas, babás, cozinheiros, passadeiras, cuidadores de idosos e gestão integrada do lar",
    services: [
      "Empregada doméstica (diarista ou mensal)",
      "Cozinheiro(a) doméstico(a)",
      "Passadeira / engomadoria ao domicílio",
      "Lavandaria ao domicílio",
      "Motorista particular",
      "Segurança doméstica / guarda-costas residencial",
      "Cuidador(a) de idosos",
      "Babá / ama para crianças",
      "Ama especializada em recém-nascidos",
      "Explicador / apoio escolar (ATL)",
      "Cuidador(a) de pessoas com necessidades especiais",
      "Governanta doméstica"
    ]
  },
  { 
    id: "limpeza", 
    alias: ["limp", "limpeza", "limpeza_especializada", "limpeza_higienizacao", "limpeza_tecnica"],
    label: "Limpeza Especializada", 
    icon: "✨",
    description: "Limpeza pós-obra, escritórios, estofos, fossas sépticas, vidros, desinfestação e caixas de água",
    services: [
      "Limpeza pós-obra",
      "Limpeza de escritórios e espaços comerciais",
      "Limpeza de estofos, sofás e tapetes",
      "Limpeza de fossas sépticas e tanques",
      "Limpeza de vidros e fachadas",
      "Desinfestação (baratas, ratos, térmitas)",
      "Limpeza e desinfeção de caixas de água"
    ]
  },
  { 
    id: "manutencao", 
    alias: ["man", "manutencao", "manutencao_reparacoes", "canal", "avac", "mec", "elet", "eletricidade", "eletricistas", "solar"],
    label: "Manutenção & Reparações", 
    icon: "🔧",
    description: "Eletricistas, canalizadores, climatização AC, eletrodomésticos, geradores, caixilharia e portões automáticos",
    services: [
      "Eletricista residencial e industrial",
      "Canalizador / picheleiro",
      "Técnico de climatização (ar condicionado)",
      "Técnico de eletrodomésticos",
      "Técnico de geradores",
      "Montador de Caixilharia de Alumínio (portas e janelas)",
      "Serralheiro",
      "Técnico de portões automáticos e motorização"
    ]
  },
  { 
    id: "carpintaria", 
    alias: ["carp", "carpintaria", "carpintaria_marcenaria"],
    label: "Carpintaria & Marcenaria", 
    icon: "🪚",
    description: "Mobiliário sob medida, acabamentos em madeira, restauro, pavimentos laminados e estruturas de madeira",
    services: [
      "Carpinteiro de mobiliário sob medida",
      "Marceneiro de acabamentos (portas, roupeiros, cozinhas)",
      "Restauro de móveis antigos",
      "Instalação de pavimentos em madeira/laminado",
      "Construção de estruturas em madeira (telhados, pérgolas, decks)"
    ]
  },
  { 
    id: "construcao", 
    alias: ["obra", "construcao", "construcao_obras", "pint", "pintura"],
    label: "Construção & Obras", 
    icon: "🧱",
    description: "Pedreiros, pintores, ladrilhadores, gesseiros, soldadores, empreiteiros e impermeabilização",
    services: [
      "Pedreiro / construtor civil",
      "Pintor de interiores e exteriores",
      "Ladrilhador (colocação de azulejos e cerâmica)",
      "Gesseiro / estucador",
      "Soldador e estruturas metálicas",
      "Empreiteiro (pequenas e médias obras)",
      "Técnico de impermeabilização de telhados e lajes"
    ]
  },
  { 
    id: "jardinagem", 
    alias: ["jard", "jardinagem", "jardinagem_exteriores"],
    label: "Jardinagem & Exteriores", 
    icon: "🌿",
    description: "Jardineiros, poda de árvores, rega automática, limpeza de quintais e terrenos, muros e piscinas",
    services: [
      "Jardineiro / paisagismo",
      "Poda e corte de árvores",
      "Instalação de rega automática",
      "Limpeza de quintais e terrenos",
      "Construção de muros e vedações",
      "Manutenção de piscinas (piscineiro)"
    ]
  },
  { 
    id: "tech", 
    alias: ["tech", "elite_tech", "cctv", "seguranca", "internet"],
    label: "Elite Tech", 
    icon: "⚡",
    description: "Instalação técnica de câmaras CCTV, antenas parabólicas DSTV/GOtv e redes de Internet Wi-Fi/dados",
    services: [
      "Montador de Câmaras de Segurança (CCTV)",
      "Instalador de Antenas Parabólicas (DSTV, GOtv)",
      "Instalador de Internet (Wi-Fi / Dados)"
    ]
  }
];

// Helper to normalize strings for accent-insensitive, case-insensitive, robust multi-token search
const normalizeText = (str: string = "") => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

export const TECHNICIAN_SEARCH_SUGGESTIONS = [
  "Eletricista",
  "Canalizador",
  "Climatização",
  "Pintor",
  "Pedreiro",
  "Jardinagem",
  "Carpintaria",
  "Geradores",
  "Limpeza",
  "Babá",
  "Cozinheira",
  "CCTV",
  "Polana",
  "Matola",
  "Khongolote",
  "Zimpeto",
  "Costa do Sol",
  "Triunfo"
];

// Sem perfis de teste ou mockups — o directório arranca limpo e preenchido apenas por técnicos reais registados
export const FALLBACK_SEED_TECHNICIANS: Candidate[] = [];

const CONNECT_HERO_SLIDES = [
  {
    id: "slide-elec",
    url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1600",
    tag: "Eletricidade & Manutenção Predial",
    highlight: "Instalação, reparação de avarias e manutenção preventiva 24h"
  },
  {
    id: "slide-plumb",
    url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=1600",
    tag: "Canalização & Hidráulica Técnica",
    highlight: "Deteção de fugas, eletrobombas, esgotos e redes de água com garantia"
  },
  {
    id: "slide-hvac",
    url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=1600",
    tag: "Climatização & Refrigeração AC",
    highlight: "Manutenção preventiva, recarga de gás e montagem de splits"
  },
  {
    id: "slide-carp",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1600",
    tag: "Carpintaria, Caixilharia & Acabamentos",
    highlight: "Mobiliário sob medida, serralharia de alumínio e pinturas técnicas"
  }
];

export const TariraTechniciansDirectory: React.FC<TariraTechniciansDirectoryProps> = ({
  candidates,
  setActiveTab,
  onGoBack,
  onSelectCandidate,
  onViewCandidate,
  onViewPortfolio,
  onRequestBriefing,
  onContactCommercial,
  checkAccess,
  currentLang = "pt",
  initialCategory = "all",
  userRole = "guest",
  userEmail,
  currentCandidateId,
  onOpenRegisterModal,
  onSwitchRoleTest,
}) => {
  const [selectedTradeCategory, setSelectedTradeCategory] = useState<string>(initialCategory);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [onlyAvailableNow, setOnlyAvailableNow] = useState<boolean>(false);
  const [onlyEmergency, setOnlyEmergency] = useState<boolean>(false);
  const [onlyOwnTransport, setOnlyOwnTransport] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"rating" | "experience" | "rate_asc">("rating");
  
  // Local profile details modal state
  const [localModalCandidate, setLocalModalCandidate] = useState<Candidate | null>(null);

  // RBAC Role Gate Modal State
  const [isRoleGateModalOpen, setIsRoleGateModalOpen] = useState<boolean>(false);
  const [roleGateAction, setRoleGateAction] = useState<"perfil" | "portfolio" | "requisitar">("perfil");
  const [roleGateCandidate, setRoleGateCandidate] = useState<Candidate | null>(null);

  // Bloqueia a rolagem do fundo enquanto o perfil ou o aviso de acesso estão abertos
  useBodyScrollLock(
    !!localModalCandidate || isRoleGateModalOpen,
    `${localModalCandidate?.id ?? ""}|${roleGateCandidate?.id ?? ""}|${roleGateAction}`
  );

  // Hero slideshow state
  const [heroSlideIndex, setHeroSlideIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % CONNECT_HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const CITIES = [
    { id: "all", label: currentLang === "pt" ? "Todas as Cidades & Regiões" : "All Cities & Regions" },
    { id: "Maputo", label: "Maputo (Cidade & Bairros)" },
    { id: "Matola", label: "Matola & Machava" },
    { id: "Beira", label: "Beira (Sofala)" },
    { id: "Nampula", label: "Nampula" },
    { id: "Tete", label: "Tete" },
    { id: "Pemba", label: "Pemba (Cabo Delgado)" },
  ];

  // Get active category object
  const currentCategoryObj = useMemo(() => {
    return TECHNICIAN_CATEGORIES.find(c => 
      c.id === selectedTradeCategory || 
      (c.alias && c.alias.includes(selectedTradeCategory))
    ) || TECHNICIAN_CATEGORIES[0];
  }, [selectedTradeCategory]);

  // Dynamic specialties available for the selected category (or all 35 services if 'all')
  const availableSpecialties = useMemo(() => {
    if (selectedTradeCategory !== "all" && currentCategoryObj && currentCategoryObj.services.length > 0) {
      return currentCategoryObj.services;
    }
    // Collect all services from all categories (35 services)
    const allServices: string[] = [];
    TECHNICIAN_CATEGORIES.forEach(c => {
      if (c.services && c.services.length > 0) {
        allServices.push(...c.services);
      }
    });
    return allServices;
  }, [selectedTradeCategory, currentCategoryObj]);

  // Utiliza apenas os candidatos reais fornecidos pela plataforma. Já não recorremos
  // a perfis de exemplo/demo como reserva — se a lista estiver vazia, o ecrã mostra
  // o estado "Nenhum técnico encontrado", pronto para receber perfis reais.
  const allTechnicians = useMemo(() => {
    return candidates || [];
  }, [candidates]);

  // Filter candidate pool strictly for field technicians, trades and domestic specialists
  const filteredTechnicians = useMemo(() => {
    return allTechnicians
      .filter((c) => c.status === "approved" || !c.status || c.status === "pending")
      .filter((c) => {
        // STRICT RULE: Exclude any corporate / white-collar / office / recruit candidates
        // (Senior DEIA, Data Solution Architect, Cybersecurity, DevOps, Legal, Accounting, HR, BPO, etc.)
        // REGRA PRINCIPAL: "isProfessional" é o campo decisivo — sempre que vier
        // definido, respeitamo-lo e nunca o sobrepomos com heurísticas de texto.
        if (c.category === "recruitment" || c.category === "prof" || c.isProfessional === true) {
          return false;
        }

        const t = (c.title || "").toLowerCase();
        const b = (c.bio || "").toLowerCase();
        const s = (c.subCategory || "").toLowerCase();
        const cat = (c.category || "").toLowerCase();
        const skillsTxt = (c.skills || []).join(" ").toLowerCase();
        const fullTxt = `${t} ${b} ${s} ${cat} ${skillsTxt}`;

        // Fallback apenas para registos legados sem isProfessional definido
        // (undefined) — nunca aplicado quando isProfessional === false, para não
        // fazer desaparecer um perfil de técnico de ofício legítimo e já confirmado.
        if (c.isProfessional !== false) {
          const isOfficeCorporateKeyword = [
            "senior ai",
            "data solution",
            "data solutions",
            "architect",
            "cibersegurança",
            "cybersecurity",
            "soc analyst",
            "cloud & devops",
            "cloud architect",
            "compliance & kyc",
            "atendimento ao cliente / bpo",
            "gestão executiva & rh",
            "marketing digital",
            "software engineer",
            "full stack",
            "frontend developer",
            "backend developer",
            "advogado",
            "auditor financeiro",
            "controller financeiro"
          ].some(term => fullTxt.includes(term));

          if (isOfficeCorporateKeyword && !fullTxt.includes("eletricista") && !fullTxt.includes("canalizador") && !fullTxt.includes("carpinteiro") && !fullTxt.includes("pintor") && !fullTxt.includes("obras")) {
            return false;
          }
        }

        // City filter
        if (selectedCity !== "all") {
          const cCity = normalizeText(c.city || "");
          const cRes = normalizeText(c.residence || "");
          const targetCity = normalizeText(selectedCity);
          if (!cCity.includes(targetCity) && !cRes.includes(targetCity)) {
            return false;
          }
        }

        // Emergency filter
        if (onlyEmergency && !c.availableForEmergency) {
          return false;
        }

        // Available now filter
        if (onlyAvailableNow && !c.availableNow) {
          return false;
        }

        // Own transport filter
        if (onlyOwnTransport && !c.ownTransport) {
          return false;
        }

        // Trade Category filter based on the 8 Canonical Categories
        if (selectedTradeCategory !== "all" && selectedTradeCategory !== "tech_trades" && selectedTradeCategory !== "elite_hub") {
          // REGRA PRINCIPAL: se o campo "category" do candidato já corresponde a
          // um dos 8 ids/aliases canónicos (ex.: "limpeza_especializada",
          // "manutencao_reparacoes", "construcao_obras", "elite_tech"), essa é a
          // categoria definitiva do candidato e ele só aparece nela — nunca
          // recorremos à pesquisa de texto/palavras-chave neste caso. Isto evita
          // que uma especialidade como "Limpeza pós-obra" (contém "obra") ou
          // "caixas de água" (contém "água") faça um técnico de Limpeza aparecer
          // também em Construção & Obras ou Manutenção & Reparações.
          const resolvedCandidateCategory = TECHNICIAN_CATEGORIES.find(
            (tc) => tc.id !== "all" && (tc.id === cat || (tc.alias && tc.alias.includes(cat)))
          );

          if (resolvedCandidateCategory) {
            if (resolvedCandidateCategory.id !== currentCategoryObj.id) {
              return false;
            }
          } else if (selectedTradeCategory === "eletricistas" || selectedTradeCategory === "elet") {
            const matchesElet = fullTxt.includes("eletric") || fullTxt.includes("solar") || fullTxt.includes("energia") || fullTxt.includes("quadro") || fullTxt.includes("cctv") || fullTxt.includes("cerca");
            if (!matchesElet) return false;
          } else if (selectedTradeCategory === "manutencao" || selectedTradeCategory === "man") {
            const matchesMan = fullTxt.includes("canaliz") || fullTxt.includes("água") || fullTxt.includes("hidráulic") || fullTxt.includes("bomba") || fullTxt.includes("esgoto") || fullTxt.includes("fuga") || fullTxt.includes("avac") || fullTxt.includes("ar condicionado") || fullTxt.includes("climatiz") || fullTxt.includes("gerador") || fullTxt.includes("mecânic") || fullTxt.includes("móve");
            if (!matchesMan) return false;
          } else if (selectedTradeCategory === "carpintaria" || selectedTradeCategory === "carp") {
            const matchesCarp = fullTxt.includes("carpin") || fullTxt.includes("marcen") || fullTxt.includes("madeira") || fullTxt.includes("armário") || fullTxt.includes("cozinha") || fullTxt.includes("deck") || fullTxt.includes("afagamento");
            if (!matchesCarp) return false;
          } else if (selectedTradeCategory === "construcao" || selectedTradeCategory === "obra") {
            const matchesObra = fullTxt.includes("pedreiro") || fullTxt.includes("alvenaria") || fullTxt.includes("porcelanato") || fullTxt.includes("construção civil") || fullTxt.includes("impermeabiliz") || fullTxt.includes("pintor") || fullTxt.includes("pintura") || fullTxt.includes("pladur") || fullTxt.includes("telhado") || fullTxt.includes("empreiteiro") || fullTxt.includes("ladrilhad") || fullTxt.includes("gesseiro") || fullTxt.includes("soldador");
            if (!matchesObra) return false;
          } else if (selectedTradeCategory === "jardinagem" || selectedTradeCategory === "jard") {
            const matchesJard = fullTxt.includes("jard") || fullTxt.includes("paisag") || fullTxt.includes("rega") || fullTxt.includes("relva") || fullTxt.includes("árvore") || fullTxt.includes("piscina") || fullTxt.includes("quintal");
            if (!matchesJard) return false;
          } else if (selectedTradeCategory === "limpeza" || selectedTradeCategory === "limp") {
            const matchesLimp = fullTxt.includes("limpeza") || fullTxt.includes("pós-obra") || fullTxt.includes("higieniz") || fullTxt.includes("desinfe") || fullTxt.includes("estofado") || fullTxt.includes("vidro");
            if (!matchesLimp) return false;
          } else if (selectedTradeCategory === "domesticos" || selectedTradeCategory === "dom") {
            const matchesDom = fullTxt.includes("doméstic") || fullTxt.includes("cozinheira") || fullTxt.includes("governanta") || fullTxt.includes("arrumação") || fullTxt.includes("engomadoria") || fullTxt.includes("lar");
            if (!matchesDom) return false;
          } else if (selectedTradeCategory === "babas" || selectedTradeCategory === "dom2") {
            const matchesBabas = fullTxt.includes("babá") || fullTxt.includes("baba") || fullTxt.includes("infantil") || fullTxt.includes("criança") || fullTxt.includes("idoso") || fullTxt.includes("geriátric") || fullTxt.includes("cuidador") || fullTxt.includes("motorista");
            if (!matchesBabas) return false;
          } else if (selectedTradeCategory === "tech" || selectedTradeCategory === "elite_tech") {
            // Categoria "Elite Tech" não tinha nenhum ramo de filtragem — por isso
            // mostrava TODOS os técnicos sem filtrar, incluindo os de outras
            // categorias (ex.: Limpeza). Agora filtra corretamente por CCTV,
            // antenas/DSTV e instalação de internet/redes.
            const matchesTech = fullTxt.includes("cctv") || fullTxt.includes("câmara") || fullTxt.includes("camera") || fullTxt.includes("antena") || fullTxt.includes("dstv") || fullTxt.includes("gotv") || fullTxt.includes("wifi") || fullTxt.includes("wi-fi") || fullTxt.includes("internet") || fullTxt.includes("rede");
            if (!matchesTech) return false;
          }
        }

        // Specialty filter
        if (selectedSpecialty !== "all") {
          const specNorm = normalizeText(selectedSpecialty);
          const specTerms = specNorm.split(/[\s,&/]+/).filter(t => t.length > 3);
          const matchesSpecialty = specTerms.some(term => fullTxt.includes(term));
          if (!matchesSpecialty) {
            return false;
          }
        }

        // Robust normalized multi-token search for Technicians:
        // Covers Candidate Name, Trade (Ofício), Skill (Habilidade), and Neighborhood (Bairro)
        const nameText = `${c.name || ""} ${c.surname || ""}`;
        const titleText = c.title || "";
        const subCatText = c.subCategory || "";
        const categoryText = c.category || "";
        const bioText = c.bio || "";
        const whyWorkText = c.whyWork || "";
        const skillsText = (c.skills || []).join(" ");
        const valuesText = (c.personalValues || []).join(" ");
        const cityText = c.city || "";
        const residenceText = c.residence || "";
        const addressText = c.addressZone || "";
        const docsText = (c.documents || []).map(d => `${d.title} ${d.issuer}`).join(" ");

        // Expand synonyms for trades (ofícios), skills (habilidades) and neighborhoods (bairros)
        let synonyms = "";
        const combinedText = normalizeText(`${nameText} ${titleText} ${subCatText} ${categoryText} ${skillsText} ${bioText} ${cityText} ${residenceText}`);

        // Ofício: Eletricistas / Energia Solar
        if (combinedText.includes("eletric") || combinedText.includes("solar") || combinedText.includes("energia") || combinedText.includes("inversor") || combinedText.includes("disjuntor")) {
          synonyms += " eletricista electricista solar fotovoltaica inversor gerador quadro eletrico trifasico disjuntor cablagem fusiveis cerca eletrica automacao piquete iluminacao curto-circuito";
        }

        // Ofício: Canalizadores / Hidráulica / Bombas de água
        if (combinedText.includes("canaliz") || combinedText.includes("hidraul") || combinedText.includes("bomba") || combinedText.includes("picheleiro") || combinedText.includes("agua") || combinedText.includes("fuga") || combinedText.includes("esgoto")) {
          synonyms += " canalizador canalizacao picheleiro fontanaria hidraulica agua eletrobomba bomba de agua pressurizador fuga esgoto tubagem ppr termofusao torneira autoclismo sanita ralo fossa infiltracao desentupimento";
        }

        // Ofício: Climatização / AVAC / Refrigeração
        if (combinedText.includes("climatiz") || combinedText.includes("ar condicionado") || combinedText.includes("avac") || combinedText.includes("refriger") || combinedText.includes("frio") || combinedText.includes("split")) {
          synonyms += " climatizacao climatizador ar condicionado avac refrigeracao frio split inverter gas freon r410 r32 compressor camara frigorifica ventilacao higienizacao";
        }

        // Ofício: Pintores / Revestimentos / Microcimento
        if (combinedText.includes("pint") || combinedText.includes("microcimento") || combinedText.includes("impermeabiliz") || combinedText.includes("humidade") || combinedText.includes("verniz")) {
          synonyms += " pintor pintura microcimento tinta verniz lacagem impermeabilizacao paredes fachada teto salitre lixar anti-humidade betao afagado epoxi";
        }

        // Ofício: Pedreiros / Construção / Alvenaria / Cerâmica / Pladur
        if (combinedText.includes("obra") || combinedText.includes("constru") || combinedText.includes("pedreiro") || combinedText.includes("alvenaria") || combinedText.includes("porcelanato") || combinedText.includes("ceramica") || combinedText.includes("pladur")) {
          synonyms += " pedreiro pedreiros construcao civil obras alvenaria porcelanato ceramica ladrilhador ladrilho azulejo mosaico cimento betao armado pladur drywall teto falso reboco fundacao telhado laje";
        }

        // Ofício: Jardinagem / Paisagismo / Piscinas
        if (combinedText.includes("jard") || combinedText.includes("paisag") || combinedText.includes("relva") || combinedText.includes("rega") || combinedText.includes("piscina") || combinedText.includes("arvore")) {
          synonyms += " jardineiro jardineiros jardinagem paisagismo relva rega irrigacao aspersao poda arvore plantas adubo quintal piscina tratamento de piscina";
        }

        // Ofício: Carpintaria / Marcenaria
        if (combinedText.includes("carpin") || combinedText.includes("marcen") || combinedText.includes("madeira") || combinedText.includes("armario") || combinedText.includes("soalho") || combinedText.includes("deck")) {
          synonyms += " carpinteiro marceneiro carpintaria marcenaria madeira moveis mobilia armarios cozinha roupeiro deck portas fechaduras fechadura digital soalho afagamento chanfuta umbila";
        }

        // Ofício: Mecânica / Geradores
        if (combinedText.includes("mecanic") || combinedText.includes("gerador") || combinedText.includes("diesel") || combinedText.includes("qta") || combinedText.includes("perkins")) {
          synonyms += " mecanico mecanica gerador geradores grupo eletrogeneo motor diesel perkins cummins quadro qta combustivel manutencao de geradores piquete";
        }

        // Ofício: Limpeza Profissional & Pós-Obra
        if (combinedText.includes("limp") || combinedText.includes("pos-obra") || combinedText.includes("higieniz") || combinedText.includes("estofado") || combinedText.includes("sofa")) {
          synonyms += " limpeza diarista faxina faxineira limpadora pos-obra higienizacao estofados sofa colchao tapetes vidros fachadas desinfeccao desengorduramento escritorio sanitizacao";
        }

        // Ofício: Serviços Domésticos / Cozinheiros / Governantas
        if (combinedText.includes("domest") || combinedText.includes("cozinh") || combinedText.includes("governant") || combinedText.includes("engomad") || combinedText.includes("lar")) {
          synonyms += " domestica empregada cozinheira cozinheiro culinaria gastronomia governanta arrumacao engomadoria lavandaria gestao do lar motorista particular diarista residencial";
        }

        // Ofício: Babás / Cuidadores / Cuidados Infantis & Idosos
        if (combinedText.includes("baba") || combinedText.includes("cuid") || combinedText.includes("infantil") || combinedText.includes("crianca") || combinedText.includes("idoso") || combinedText.includes("pedagog")) {
          synonyms += " baba babá cuidadora cuidador ama infantil crianca criancas bebes berçario apoio escolar explicador pedagogico primeiros socorros idoso idosos geriatrico necessidades especiais";
        }

        // Ofício: CCTV / Antenas / Redes / Telecom / Caixilharia / Portões
        if (combinedText.includes("cctv") || combinedText.includes("camera") || combinedText.includes("antena") || combinedText.includes("dstv") || combinedText.includes("wifi") || combinedText.includes("internet") || combinedText.includes("alarme") || combinedText.includes("portao") || combinedText.includes("caixilharia") || combinedText.includes("serralh")) {
          synonyms += " cctv camera cameras de seguranca instalador antenas parabolica dstv gotv internet wifi redes cabo de rede fibra alarme interfone portao automatico caixilharia aluminio serralharia motor centurion";
        }

        // Bairros expansion:
        if (combinedText.includes("polana") || combinedText.includes("canico")) {
          synonyms += " polana polana canico bairro da polana maputo cidade";
        }
        if (combinedText.includes("matola") || combinedText.includes("machava") || combinedText.includes("fomento") || combinedText.includes("khongolote") || combinedText.includes("liberdade")) {
          synonyms += " matola machava fomento khongolote liberdade matola gare grande maputo";
        }
        if (combinedText.includes("jardim") || combinedText.includes("alto mae") || combinedText.includes("chamanculo") || combinedText.includes("malhangalene") || combinedText.includes("maxaquene") || combinedText.includes("mavalane")) {
          synonyms += " jardim bairro do jardim alto mae chamanculo malhangalene maxaquene mavalane maputo cidade";
        }
        if (combinedText.includes("triunfo") || combinedText.includes("costa do sol") || combinedText.includes("sommerschield") || combinedText.includes("albazine") || combinedText.includes("zimpeto") || combinedText.includes("marracuene")) {
          synonyms += " triunfo bairro do triunfo costa do sol sommerschield albazine zimpeto marracuene circular maputo";
        }

        const candidateCorpus = normalizeText([
          nameText,
          titleText,
          subCatText,
          categoryText,
          bioText,
          whyWorkText,
          skillsText,
          valuesText,
          cityText,
          residenceText,
          addressText,
          docsText,
          synonyms
        ].join(" "));

        // Multi-token search matching for query (matches candidate name, trade/ofício, skill/habilidade, or neighborhood/bairro)
        const queryTokens = normalizeText(searchQuery).split(/\s+/).filter((t) => t.length > 0);
        const matchesQuery = queryTokens.length === 0 || queryTokens.every((token) => candidateCorpus.includes(token));

        if (!matchesQuery) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          return (b.rating || 4.8) - (a.rating || 4.8);
        }
        if (sortBy === "experience") {
          return (b.experienceYears || 0) - (a.experienceYears || 0);
        }
        if (sortBy === "rate_asc") {
          return (a.rateMzn || a.hourlyRate || 1500) - (b.rateMzn || b.hourlyRate || 1500);
        }
        return 0;
      });
  }, [allTechnicians, selectedTradeCategory, selectedSpecialty, selectedCity, onlyEmergency, onlyAvailableNow, onlyOwnTransport, searchQuery, sortBy]);

  const [internalRole, setInternalRole] = useState<typeof userRole | null>(null);
  const effectiveUserRole = internalRole || userRole || "guest";
  const isGuest = !effectiveUserRole || effectiveUserRole === "guest";
  const isLar = effectiveUserRole === "lar";
  const isB2B = effectiveUserRole === "empresa" || effectiveUserRole === "condominio";
  const isAdmin = effectiveUserRole === "admin";
  const isPrestador = effectiveUserRole === "prestador";

  // RBAC Access Matrix: Authenticated clients (Lar/Particular, Empresa, Condomínio, Admin) have access!
  const hasAccountAccess = isLar || isB2B || isAdmin;

  // Identifica se o cartão pertence ao próprio utilizador autenticado
  const isOwnCandidate = (tech: Candidate): boolean => {
    if (!tech) return false;
    if (currentCandidateId && (tech.id === currentCandidateId || (tech as any).candidate_id === currentCandidateId)) {
      return true;
    }
    const myEmail = (userEmail || "").toLowerCase().trim();
    if (myEmail && tech.email && tech.email.toLowerCase().trim() === myEmail) {
      return true;
    }
    return false;
  };

  // RBAC Regras de Visualização dos Botões (Perfil, Portfólio e Requisitar):
  // 1. Cada usuário ao entrar na página consegue apenas ver a sua informação (perfil, portfólio e recrutar) e não de outros usuários;
  // 2. O administrador e a central têm visão da informação geral do fluxo dos cards;
  // 3. O perfil empresa e condomínio vê toda a info (perfil, portfólio e recrutar) das páginas técnicos de campo e talentos e quadros;
  // 4. O perfil lar/particular vê apenas a informação dos cards da página técnicos de campo.
  const canViewTechnicianActions = (tech: Candidate): boolean => {
    // 2. O administrador e a central têm visão da informação geral do fluxo dos cards
    if (isAdmin) return true;

    // 3. O perfil empresa e condomínio vê toda a info (perfil, portfólio e recrutar) das páginas
    if (isB2B) return true;

    // 4. O perfil lar/particular vê a informação dos cards da página técnicos de campo
    if (isLar) return true;

    // Visitante (guest) à procura de técnicos para intervenção doméstica
    if (isGuest) return true;

    // 1. Cada usuário ao entrar na página consegue apenas ver a sua informação e não de outros usuários:
    // Prestador / Técnico: apenas vê os botões de ação no seu próprio cartão
    if (isOwnCandidate(tech)) return true;

    return false;
  };

  const handleOpenTechnician = (tech: Candidate) => {
    if (!canViewTechnicianActions(tech)) {
      setRoleGateCandidate(tech);
      setRoleGateAction("perfil");
      setIsRoleGateModalOpen(true);
      return;
    }
    if (onViewCandidate) {
      onViewCandidate(tech);
    } else {
      setLocalModalCandidate(tech);
    }
  };

  const handlePortfolioTechnician = (tech: Candidate) => {
    if (!canViewTechnicianActions(tech)) {
      setRoleGateCandidate(tech);
      setRoleGateAction("portfolio");
      setIsRoleGateModalOpen(true);
      return;
    }
    if (onViewPortfolio) {
      onViewPortfolio(tech);
    }
  };

  const handleHireTechnician = (tech: Candidate) => {
    if (!canViewTechnicianActions(tech)) {
      setRoleGateCandidate(tech);
      setRoleGateAction("requisitar");
      setIsRoleGateModalOpen(true);
      return;
    }
    if (onSelectCandidate) {
      onSelectCandidate(tech);
    } else if (setActiveTab) {
      setActiveTab("services");
    }
  };

  const currentSlide = CONNECT_HERO_SLIDES[heroSlideIndex] || CONNECT_HERO_SLIDES[0];

  return (
    <div id="s-tecnicos-directory" className="flex-1 flex flex-col w-full animate-fade-up max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-[#172554] bg-white">
      
      {/* 1. Header Navigation Bar / Breadcrumb */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200">
        <button 
          id="btn-tecnicos-go-back"
          onClick={() => onGoBack ? onGoBack() : setActiveTab("landing")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-[#172554] text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer shadow-xs active:scale-95"
          title="Voltar ao Catálogo"
        >
          <ArrowLeft className="w-4 h-4 text-[#172554]" />
          <span>← Voltar ao Catálogo de Serviços</span>
        </button>

        <div className="flex items-center gap-2">
          <button 
            id="btn-switch-to-recruitment"
            onClick={() => setActiveTab("profissionais")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#172554] border border-[#172554] text-white text-xs font-bold hover:bg-[#1A3478] transition-all cursor-pointer shadow-xs"
          >
            <span>💼 Ir para Talentos & Quadros (Recruit) →</span>
          </button>
        </div>
      </div>

      {/* 2. Page Header Hero Showcase - Dynamic High-Impact Visual Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-6 shadow-2xl border border-blue-950/40 text-white group">
        {/* Dynamic Background Image with Smooth Crossfade & Optical Navy Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentSlide.url}
            alt={currentSlide.tag}
            className="w-full h-full object-cover object-center transform scale-105 transition-all duration-1000 ease-out"
            key={currentSlide.id}
          />
          {/* Deep Navy High-Contrast Scrim Layer for perfect legibility with softened opacity */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070e22]/75 via-[#172554]/70 to-[#071330]/70 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.18),transparent_60%)]" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
          {/* Top Row: Kicker & Quick Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
                TARIRA CONNECT · TÉCNICOS DE CAMPO & OFÍCIOS
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-blue-500/25 border border-blue-400/30 text-blue-200 text-xs font-medium backdrop-blur-xs">
                {currentSlide.tag}
              </span>
            </div>

            {/* Slide Navigation Indicator Pills */}
            <div className="flex items-center gap-1.5 bg-black/30 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
              <span className="text-[10px] font-mono text-blue-200 mr-1 uppercase">Galeria:</span>
              {CONNECT_HERO_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setHeroSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    heroSlideIndex === idx ? "w-6 bg-blue-400 shadow-[0_0_8px_#60a5fa]" : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                  title={s.tag}
                />
              ))}
            </div>
          </div>

          {/* Main Title & Typewriter Hook */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 text-left space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold tracking-tight leading-tight">
                Técnicos de Campo &{" "}
                <TypewriterPromise
                  phrases={[
                    "Eletricistas Certificados",
                    "Canalizadores de Piquete 24h",
                    "Técnicos de Climatização AC",
                    "Apoio ao Lar & Domésticos",
                    "Carpinteiros & Serralheiros"
                  ]}
                  typingSpeed={85}
                  deletingSpeed={45}
                  pauseDelay={2200}
                  className="text-blue-300 drop-shadow-[0_2px_12px_rgba(37,99,235,0.5)] font-serif"
                />
              </h1>

              <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed font-normal">
                Conectamos a sua residência, condomínio ou empresa aos melhores prestadores homologados de Moçambique. 
                {currentSlide.highlight ? ` ${currentSlide.highlight}.` : ""} Garantia de 30 dias com custódia segura escrow.
              </p>

              {/* Real-Time Live Ticker & Trust Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-mono backdrop-blur-sm shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-bold text-emerald-300">Piquete Ativo:</span>
                  <span className="text-[11px] text-blue-100">Despacho médio em até 45 min</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-mono backdrop-blur-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                  <span className="text-[11px] text-blue-100">Garantia 30 Dias Certificada</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-mono backdrop-blur-sm">
                  <Star className="w-3.5 h-3.5 text-blue-300 fill-blue-300" />
                  <span className="text-[11px] text-blue-100">4.9/5 em 2.450+ Avaliações</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Orbit Badge & Quick Action Buttons */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4">
              <div className="hidden sm:block">
                <VerticalOrbitBadge text="CONNECT" subtext="24/7 SLA" size="md" variant="glass" />
              </div>

              <div className="flex flex-col gap-2.5 w-full sm:w-auto">
                <button 
                  id="btn-request-urgent-piquete"
                  onClick={() => {
                    setOnlyEmergency(true);
                    setSelectedTradeCategory("all");
                  }}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#172554] hover:brightness-110 text-white text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  <Zap className="w-4 h-4 text-white animate-pulse" />
                  <span>Piquete Urgente 24 Horas</span>
                </button>
                <button 
                  id="btn-request-team-briefing"
                  onClick={() => onRequestBriefing ? onRequestBriefing() : setActiveTab("landing")}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#172554] text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <FileCheck className="w-4 h-4 text-[#172554]" />
                  <span>📋 Solicitar Equipa ou Projeto</span>
                </button>
              </div>
            </div>
          </div>

          {/* Integrated RBAC Status & Simulation Test Bar */}
          <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-blue-300 font-mono text-[11px] font-bold">Estado de Acesso RBAC:</span>
              {isAdmin && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-200 font-bold text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Administrador: Acesso Total
                </span>
              )}
              {isB2B && !isAdmin && (
                <span className="px-2.5 py-1 rounded-full bg-blue-500/30 border border-blue-400 text-blue-200 font-bold text-[11px] flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Conta {effectiveUserRole === "empresa" ? "Empresa" : "Condomínio"}: Acesso B2B Ativo
                </span>
              )}
              {isLar && (
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/30 border border-indigo-400 text-indigo-200 font-bold text-[11px] flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" /> Conta Lar: Acesso Total a Técnicos
                </span>
              )}
              {isPrestador && (
                <span className="px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-blue-100 font-bold text-[11px] flex items-center gap-1.5 backdrop-blur-md">
                  <Wrench className="w-3.5 h-3.5 text-blue-200" /> Prestador Homologado
                </span>
              )}
              {isGuest && (
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-white font-semibold text-[11px] flex items-center gap-1.5 backdrop-blur-md shadow-xs">
                  <Users className="w-3.5 h-3.5 text-blue-200" /> Visitante: Consulta Livre • Criar Conta para Requisitar
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-blue-200/80">Simular Papel:</span>
              <button
                type="button"
                onClick={() => {
                  setInternalRole("guest");
                  if (onSwitchRoleTest) onSwitchRoleTest("guest");
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  isGuest ? "bg-white text-[#172554] shadow-xs" : "bg-white/10 hover:bg-white/20 text-white"
                }`}
                title="Simular visitante sem conta (Guest)"
              >
                Visitante
              </button>
              <button
                type="button"
                onClick={() => {
                  setInternalRole("lar");
                  if (onSwitchRoleTest) onSwitchRoleTest("lar");
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  isLar ? "bg-white text-[#172554] shadow-xs" : "bg-white/10 hover:bg-white/20 text-white"
                }`}
                title="Simular cliente com conta (Lar)"
              >
                (Lar)
              </button>
              <button
                type="button"
                onClick={() => {
                  setInternalRole("empresa");
                  if (onSwitchRoleTest) onSwitchRoleTest("empresa");
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  effectiveUserRole === "empresa" ? "bg-white text-[#172554] shadow-xs" : "bg-white/10 hover:bg-white/20 text-white"
                }`}
                title="Simular conta Empresa B2B"
              >
                Empresa
              </button>
              <button
                type="button"
                onClick={() => {
                  setInternalRole("condominio");
                  if (onSwitchRoleTest) onSwitchRoleTest("condominio");
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  effectiveUserRole === "condominio" ? "bg-white text-[#172554] shadow-xs" : "bg-white/10 hover:bg-white/20 text-white"
                }`}
                title="Simular conta Condomínio"
              >
                Condomínio
              </button>
              <button
                type="button"
                onClick={() => {
                  setInternalRole("prestador");
                  if (onSwitchRoleTest) onSwitchRoleTest("prestador");
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  isPrestador ? "bg-white text-[#172554] shadow-xs" : "bg-white/10 hover:bg-white/20 text-white"
                }`}
                title="Simular prestador / técnico homologado"
              >
                Prestador
              </button>
              <button
                type="button"
                onClick={() => {
                  setInternalRole("admin");
                  if (onSwitchRoleTest) onSwitchRoleTest("admin");
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  isAdmin ? "bg-white text-[#172554] shadow-xs" : "bg-white/10 hover:bg-white/20 text-white"
                }`}
                title="Simular Administrador"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & Search */}
      <div id="candidate-search-section" className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 mb-6 shadow-xs space-y-4 text-left text-[#172554]">
        
        {/* Row 1: Search and dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="relative md:col-span-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#172554]" />
            <input 
              id="input-search-technicians"
              type="text"
              placeholder="Pesquisar por nome, ofício, habilidade ou bairro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-slate-200 text-[#172554] placeholder:text-slate-400 text-xs font-medium focus:border-[#172554] focus:outline-hidden transition-all shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#172554]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Specialty Filter Dropdown (matching 35 structured services) */}
          <div className="md:col-span-4">
            <select
              id="select-specialty-filter"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-[#172554] text-xs font-medium focus:border-[#172554] focus:outline-hidden transition-all cursor-pointer shadow-xs"
            >
              <option value="all">⭐ Todos os 35 Serviços Estruturados</option>
              {availableSpecialties.map((spec, i) => (
                <option key={i} value={spec} className="text-[#172554]">
                  • {spec}
                </option>
              ))}
            </select>
          </div>

          {/* City select */}
          <div className="md:col-span-2">
            <select
              id="select-city-filter"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-[#172554] text-xs font-medium focus:border-[#172554] focus:outline-hidden transition-all cursor-pointer shadow-xs"
            >
              {CITIES.map(c => (
                <option key={c.id} value={c.id} className="text-[#172554]">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By select */}
          <div className="md:col-span-2">
            <select
              id="select-sort-technicians"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-[#172554] text-xs font-medium focus:border-[#172554] focus:outline-hidden transition-all cursor-pointer shadow-xs"
            >
              <option value="rating" className="text-[#172554]">⭐ Melhor Avaliados</option>
              <option value="experience" className="text-[#172554]">🏆 Mais Experientes</option>
              <option value="rate_asc" className="text-[#172554]">💰 Menor Tarifa/Hora</option>
            </select>
          </div>
        </div>

        {/* Quick Suggestion Pills for Technicians */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
          <span className="text-[11px] text-[#3B5998] font-medium mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#172554]" />
            {currentLang === "pt" ? "Sugestões de busca:" : "Quick suggestions:"}
          </span>
          {TECHNICIAN_SEARCH_SUGGESTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSearchQuery(tag)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                searchQuery.toLowerCase() === tag.toLowerCase()
                  ? "bg-[#172554] text-white border-[#172554] font-bold"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:text-[#172554]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Active Search Feedback */}
        {searchQuery.trim() && (
          <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#172554]">
            <div className="flex items-center gap-2 text-[#172554]">
              <Search className="w-3.5 h-3.5 text-[#172554] shrink-0" />
              <span>
                {currentLang === "pt"
                  ? `A pesquisar por "${searchQuery}" em nomes de candidatos, ofícios, habilidades e bairros (${filteredTechnicians.length} ${filteredTechnicians.length === 1 ? "técnico encontrado" : "técnicos encontrados"})`
                  : `Searching for "${searchQuery}" in candidate names, trades, skills and neighborhoods (${filteredTechnicians.length} found)`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-[#172554] hover:text-blue-700 font-bold text-xs underline cursor-pointer"
            >
              {currentLang === "pt" ? "Limpar pesquisa ✕" : "Clear ✕"}
            </button>
          </div>
        )}

        {/* Row 2: 8 Service Category Navigation Tabs */}
        <div className="border-t border-slate-200 pt-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#172554] font-black font-mono">
              Categorias de Serviços de Campo (TARIRA Connect)
            </span>
            <span className="text-[11px] text-[#3B5998] font-medium">
              {filteredTechnicians.length} técnico(s) encontrado(s)
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
            {TECHNICIAN_CATEGORIES.map((cat) => {
              const isActive = selectedTradeCategory === cat.id || (cat.alias && cat.alias.includes(selectedTradeCategory));
              return (
                <button
                  key={cat.id}
                  id={`btn-cat-${cat.id}`}
                  onClick={() => {
                    setSelectedTradeCategory(cat.id);
                    setSelectedSpecialty("all");
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                    isActive
                      ? "bg-[#172554] text-white border-[#172554] shadow-sm scale-[1.02]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-[#172554] hover:!text-white hover:border-[#172554] hover:shadow-xs"
                  }`}
                >
                  <div className="text-base leading-none">{cat.icon}</div>
                  <div>{cat.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Quick filter toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setOnlyAvailableNow(!onlyAvailableNow)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                onlyAvailableNow 
                  ? "bg-blue-50 border-blue-300 text-[#172554] font-bold" 
                  : "bg-white border-slate-200 text-slate-600 hover:text-[#172554]"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${onlyAvailableNow ? "bg-[#172554] animate-pulse" : "bg-slate-400"}`} />
              <span>Disponível Hoje</span>
            </button>

            <button
              onClick={() => setOnlyEmergency(!onlyEmergency)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                onlyEmergency 
                  ? "bg-slate-100 border-slate-300 text-[#172554] font-bold" 
                  : "bg-white border-slate-200 text-slate-600 hover:text-[#172554]"
              }`}
            >
              <Zap className="w-3 h-3 text-[#172554]" />
              <span>Piquete Urgente</span>
            </button>

            <button
              onClick={() => setOnlyOwnTransport(!onlyOwnTransport)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                onlyOwnTransport 
                  ? "bg-blue-50 border-blue-300 text-[#172554] font-bold" 
                  : "bg-white border-slate-200 text-slate-600 hover:text-[#172554]"
              }`}
            >
              <Car className="w-3 h-3 text-[#172554]" />
              <span>Transporte Próprio</span>
            </button>
          </div>

          {(searchQuery || selectedTradeCategory !== "all" || selectedSpecialty !== "all" || selectedCity !== "all" || onlyAvailableNow || onlyEmergency || onlyOwnTransport) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTradeCategory("all");
                setSelectedSpecialty("all");
                setSelectedCity("all");
                setOnlyAvailableNow(false);
                setOnlyEmergency(false);
                setOnlyOwnTransport(false);
              }}
              className="text-[#172554] hover:text-blue-700 underline font-semibold text-[11px] cursor-pointer"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>
      </div>

      {/* 4. Active Category Context Banner */}
      {selectedTradeCategory !== "all" && currentCategoryObj && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-white rounded-xl border border-blue-200 shadow-xs">{currentCategoryObj.icon}</span>
            <div>
              <h3 className="text-sm font-bold text-[#172554]">{currentCategoryObj.label}</h3>
              <p className="text-xs text-[#3B5998]">{currentCategoryObj.description}</p>
            </div>
          </div>
          <button 
            onClick={() => setSelectedTradeCategory("all")}
            className="text-xs text-[#172554] hover:bg-slate-50 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-xs whitespace-nowrap cursor-pointer font-bold"
          >
            Ver todos os ofícios ✕
          </button>
        </div>
      )}

      {/* 5. Technicians Grid */}
      {filteredTechnicians.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center my-6 shadow-xs text-[#172554]">
          <Wrench className="w-12 h-12 text-[#172554]/40 mx-auto mb-3" />
          <h3 className="font-serif text-lg text-[#172554] font-bold mb-1">Nenhum técnico encontrado com estes filtros</h3>
          <p className="text-xs text-[#3B5998] max-w-md mx-auto mb-5">
            Tente expandir a pesquisa ou redefinir a categoria de ofício para encontrar outros técnicos homologados.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedTradeCategory("all");
              setSelectedSpecialty("all");
              setSelectedCity("all");
              setOnlyAvailableNow(false);
              setOnlyEmergency(false);
              setOnlyOwnTransport(false);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#172554] text-white text-xs font-bold hover:bg-[#1A3478] transition-all cursor-pointer shadow-sm"
          >
            Ver Todos os Técnicos de Ofício
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTechnicians.map((tech) => {
            const fullName = `${tech.name} ${tech.surname || ""}`.trim();
            const rating = tech.rating || 4.9;
            const completedJobs = tech.completedJobs || Math.floor(40 + (tech.experienceYears || 5) * 12);
            const rateMzn = tech.rateMzn || (tech.rate ? tech.rate * 60 : 1500);
            const verifiedDocs = tech.documents ? tech.documents.filter(d => d.status === "verified").length : 3;

            return (
              <div 
                key={tech.id}
                id={`card-tech-${tech.id}`}
                className="bg-white rounded-3xl border border-slate-200 hover:border-blue-400 p-5 transition-all hover:shadow-lg flex flex-col justify-between group shadow-xs text-left text-[#172554]"
              >
                <div>
                  {/* Top row: Badges & Rating */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#172554] text-[10px] font-mono font-bold">
                      <ShieldCheck className="w-3 h-3 text-[#172554]" />
                      HOMOLOGADO TARIRA
                    </span>

                    <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 text-[#172554] text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-[#172554] text-[#172554]" />
                      <span>{rating.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-500">({completedJobs})</span>
                    </div>
                  </div>

                  {/* Profile Header: Photo + Name + Title */}
                  <div className="flex items-start gap-3.5 mb-3.5">
                    <div className="relative shrink-0">
                      <img 
                        src={tech.photo || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=400"}
                        alt={fullName}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 group-hover:border-blue-400 transition-all shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                      {tech.availableNow && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#172554] border-2 border-white rounded-full" title="Disponível Hoje" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-base font-bold text-[#172554] group-hover:text-blue-700 transition-colors truncate">
                        {fullName}
                      </h3>
                      <p className="text-xs text-[#3B5998] font-semibold line-clamp-2 mt-0.5">
                        {tech.title}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                        <MapPin className="w-3 h-3 text-[#172554] shrink-0" />
                        <span className="truncate">
                          {tech.residence 
                            ? `${tech.residence}${tech.city && !tech.residence.toLowerCase().includes(tech.city.toLowerCase()) ? ` · ${tech.city}` : ""}`
                            : (tech.city || "Maputo, Moçambique")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badges / Highlights */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {tech.availableForEmergency && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[#172554] text-[10px] font-bold flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 text-[#172554]" /> Piquete 24h
                      </span>
                    )}
                    {tech.experienceYears && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-semibold flex items-center gap-1">
                        <Award className="w-2.5 h-2.5 text-[#172554]" /> {tech.experienceYears} anos exp.
                      </span>
                    )}
                    {tech.ownTransport && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-semibold flex items-center gap-1">
                        <Car className="w-2.5 h-2.5 text-slate-500" /> Viatura própria
                      </span>
                    )}
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    {tech.bio || "Técnico especialista com rigor de execução, credenciação técnica e garantia em todos os trabalhos realizados."}
                  </p>

                  {/* Skills tags */}
                  {tech.skills && tech.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tech.skills.slice(0, 3).map((sk, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-blue-50 text-[#172554] text-[10px] border border-blue-200 truncate max-w-[200px] font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                      {tech.skills.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200 text-[10px]">
                          +{tech.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Card Footer: Price + Actions */}
                <div className="border-t border-slate-100 pt-3.5 mt-2 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Estimativa Base</span>
                      <span className="text-sm font-bold text-[#172554] font-mono">
                        {rateMzn.toLocaleString()} MZN
                        <span className="text-[10px] text-slate-500 font-normal"> / intervenção</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#172554] font-medium flex items-center gap-1 justify-end">
                        <CheckCircle2 className="w-3 h-3 text-[#172554]" />
                        Garantia 30 Dias
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {verifiedDocs} Docs Verificados
                      </span>
                    </div>
                  </div>

                  {isOwnCandidate(tech) && effectiveUserRole === "prestador" ? (
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        id={`btn-view-tech-${tech.id}`}
                        onClick={() => handleOpenTechnician(tech)}
                        className="py-2 px-2 rounded-xl bg-white hover:bg-slate-50 text-[#172554] text-xs font-bold border border-slate-200 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95"
                        title="Ver o Meu Perfil Detalhado"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#172554]" />
                        <span>Meu Perfil</span>
                      </button>

                      <button
                        type="button"
                        id={`btn-portfolio-tech-${tech.id}`}
                        onClick={() => handlePortfolioTechnician(tech)}
                        className="py-2 px-2 rounded-xl bg-white hover:bg-slate-50 text-[#172554] text-xs font-bold border border-slate-200 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95"
                        title="Ver o Meu Portfólio de Obras"
                      >
                        <Layers className="w-3.5 h-3.5 text-[#172554]" />
                        <span>Meu Portfólio</span>
                      </button>

                      <button
                        type="button"
                        id={`btn-manage-tech-${tech.id}`}
                        onClick={() => setActiveTab("professional_profile")}
                        className="py-2 px-2 rounded-xl bg-[#172554] hover:bg-[#1A3478] text-white border border-[#172554] text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95"
                        title="Gerir o Meu Perfil Pessoal"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-white" />
                        <span>Gerir Perfil</span>
                      </button>
                    </div>
                  ) : (
                    (() => {
                      // Os botões são SEMPRE visíveis. Quem não tem permissão vê um cadeado
                      // e, ao clicar, recebe o aviso de acesso (a informação em si fica protegida).
                      const locked = !canViewTechnicianActions(tech);
                      const lockTitle = "Acesso reservado a Clientes (Lar, Empresa ou Condomínio)";
                      return (
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            id={`btn-view-tech-${tech.id}`}
                            onClick={() => handleOpenTechnician(tech)}
                            className="py-2 px-2 rounded-xl bg-white hover:bg-slate-50 text-[#172554] text-xs font-bold border border-slate-200 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95"
                            title={locked ? lockTitle : "Ver Perfil Detalhado & Dossiê"}
                          >
                            <Eye className="w-3.5 h-3.5 text-[#172554]" />
                            <span>Perfil</span>
                          </button>

                          <button
                            type="button"
                            id={`btn-portfolio-tech-${tech.id}`}
                            onClick={() => handlePortfolioTechnician(tech)}
                            className="py-2 px-2 rounded-xl bg-white hover:bg-slate-50 text-[#172554] text-xs font-bold border border-slate-200 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95"
                            title={locked ? lockTitle : "Ver Portfólio de Obras & Projetos"}
                          >
                            <Layers className="w-3.5 h-3.5 text-[#172554]" />
                            <span>Portfólio</span>
                          </button>

                          <button
                            type="button"
                            id={`btn-hire-tech-${tech.id}`}
                            onClick={() => handleHireTechnician(tech)}
                            className="py-2 px-2 rounded-xl bg-[#172554] hover:bg-[#1A3478] text-white border border-[#172554] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95"
                            title={locked ? lockTitle : "Requisitar intervenção do técnico (Abrir Formulário)"}
                          >
                            <Zap className="w-3.5 h-3.5 text-blue-200 fill-blue-200" />
                            <span>Requisitar</span>
                          </button>
                        </div>
                      );
                    })()
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 6. Guarantee & Assurance Footer */}
      <div className="mt-12 rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs text-[#172554]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-[#172554] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#172554] mb-1">Triagem & Homologação Rigorosa</h4>
              <p className="text-xs text-[#3B5998] leading-relaxed">
                Verificação de registo criminal, identidade biométrica, certificações técnicas e referências no terreno.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-[#172554] shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#172554] mb-1">Garantia Técnica de 30 Dias</h4>
              <p className="text-xs text-[#3B5998] leading-relaxed">
                Se o serviço apresentar qualquer anomalia no prazo de 30 dias, reparamos ou substituímos sem custos adicionais.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-[#172554] shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#172554] mb-1">Pagamento Seguro em Escrow</h4>
              <p className="text-xs text-[#3B5998] leading-relaxed">
                O seu pagamento (M-Pesa, E-Mola ou Cartão) fica protegido pela TARIRA e só é libertado ao técnico após a sua validação.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Local Profile Modal (Fallback if external viewer is not passed) */}
      {localModalCandidate && (
        <div 
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setLocalModalCandidate(null)}
        >
          <div 
            data-modal-scroll 
            className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl text-left text-[#172554] animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={localModalCandidate.photo || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=400"}
                  alt={localModalCandidate.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#172554] border border-blue-200 uppercase">
                    Técnico de Ofício & Campo
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#172554] mt-1">
                    {localModalCandidate.name} {localModalCandidate.surname || ""}
                  </h3>
                  <p className="text-xs text-slate-500">📍 {localModalCandidate.city || "Maputo"}, Moçambique</p>
                </div>
              </div>
              <button 
                onClick={() => setLocalModalCandidate(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-1">Especialidade / Ofício</h4>
                <p className="text-sm font-bold text-[#172554]">{localModalCandidate.title || localModalCandidate.category || "Técnico Especializado"}</p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-1">Biografia Profissional</h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {localModalCandidate.bio || "Técnico homologado e certificado pelo ecossistema TARIRA Connect."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">Avaliação</span>
                  <span className="text-sm font-bold text-[#172554]">{localModalCandidate.rating?.toFixed(1) || "5.0"} ⭐</span>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">Match Score AI</span>
                  <span className="text-sm font-bold text-[#172554]">{localModalCandidate.matchScore || 95}%</span>
                </div>
              </div>

              {localModalCandidate.skills && localModalCandidate.skills.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">Competências</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {localModalCandidate.skills.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[#172554] text-xs font-medium">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Logística de Atendimento */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">Zona / Bairro</span>
                  <span className="text-sm font-bold text-[#172554]">
                    📍 {localModalCandidate.residence || localModalCandidate.addressZone || localModalCandidate.city || "Maputo"}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">Transporte Próprio</span>
                  <span className="text-sm font-bold text-[#172554]">
                    {localModalCandidate.ownTransport ? "✅ Sim" : "— Não informado"}
                  </span>
                </div>
              </div>

              {/* Tarifa e Disponibilidade */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">Taxa de Intervenção</span>
                  <span className="text-sm font-bold text-[#172554]">
                    {localModalCandidate.rateMzn 
                      ? `${localModalCandidate.rateMzn.toLocaleString()} MZN / intervenção` 
                      : localModalCandidate.hourlyRate 
                      ? `${localModalCandidate.hourlyRate.toLocaleString()} MZN / hora` 
                      : "Tarifa sob consulta"}
                  </span>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">Disponibilidade</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {localModalCandidate.availableNow !== false ? "🟢 Imediata / Activo" : "🟡 Com Agendamento"}
                  </span>
                </div>
              </div>

              {/* Bloco de Ação / Formulário de Requisição Directo */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#172554]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#172554] font-mono">
                      Formulário de Requisição de Intervenção
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded-full">
                    ✓ Garantia 30 Dias TARIRA
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Preencha o formulário de requisição técnica com a morada do serviço, tipo de urgência, descrição e fotografia ou áudio da avaria com proteção de pagamento em Escrow.
                </p>
                <button
                  type="button"
                  id={`btn-open-form-fallback-${localModalCandidate.id}`}
                  onClick={() => {
                    const target = localModalCandidate;
                    setLocalModalCandidate(null);
                    handleHireTechnician(target);
                  }}
                  className="w-full py-3 rounded-xl bg-[#172554] hover:bg-[#1A3478] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <Briefcase className="w-4 h-4 text-white" />
                  <span>Abrir Formulário de Requisição do Técnico</span>
                </button>
              </div>

              {/* Acções Principais do Dossiê */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setLocalModalCandidate(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Fechar
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  {onViewPortfolio && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = localModalCandidate;
                        setLocalModalCandidate(null);
                        handlePortfolioTechnician(target);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#172554] text-xs font-bold border border-blue-200 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                      title="Consultar Portfólio de Obras e Projetos"
                    >
                      <Layers className="w-4 h-4 text-[#172554]" />
                      <span>Ver Portfólio de Obras</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const target = localModalCandidate;
                      setLocalModalCandidate(null);
                      handleHireTechnician(target);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#172554] hover:bg-[#1A3478] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2 active:scale-95"
                    title="Abrir Formulário de Requisição do Técnico"
                  >
                    <Briefcase className="w-4 h-4 text-white" />
                    <span>Requisitar Técnico (Abrir Formulário)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Modal de Acesso Restrito (nota de permissões) */}
      <AccessRestrictedModal
        isOpen={isRoleGateModalOpen}
        onClose={() => {
          setIsRoleGateModalOpen(false);
          setRoleGateCandidate(null);
        }}
        variant="prestador"
        action={roleGateAction}
        candidate={roleGateCandidate}
        message="Acesso reservado a Clientes (Lar, Empresa ou Condomínio)."
        description="Como técnico / prestador registado, só pode ver e gerir o seu próprio perfil e portfólio."
        onGoMyProfile={() => setActiveTab("professional_profile")}
      />

    </div>
  );
};
