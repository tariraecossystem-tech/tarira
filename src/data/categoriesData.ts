export interface CategoryTaxonomyItem {
  id: string;
  name: string;
  group: 'trades' | 'office' | 'domestic';
  icon: string;
  badge: string;
  description: string;
  specialties: string[];
}

export const CATEGORIES_TAXONOMY: CategoryTaxonomyItem[] = [
  // ──────────────── OFÍCIOS & SERVIÇOS ESTRUTURADOS (TARIRA CONNECT — 7 CATEGORIAS) ────────────────
  {
    id: 'servicos_domesticos',
    name: 'Serviços Domésticos',
    group: 'trades',
    icon: '🧹',
    badge: 'Connect · Lar & Apoio',
    description: 'Empregadas domésticas, babás, cozinheiros, passadeiras, cuidadores e gestão integrada do lar.',
    specialties: [
      'Empregada doméstica (diarista ou mensal)',
      'Cozinheiro(a) doméstico(a)',
      'Passadeira / engomadoria ao domicílio',
      'Lavandaria ao domicílio',
      'Motorista particular',
      'Segurança doméstica / guarda-costas residencial',
      'Cuidador(a) de idosos',
      'Babá / ama para crianças',
      'Ama especializada em recém-nascidos',
      'Cuidador(a) de pessoas com necessidades especiais',
      'Governanta doméstica'
    ]
  },
  {
    id: 'limpeza_especializada',
    name: 'Limpeza Especializada',
    group: 'trades',
    icon: '✨',
    badge: 'Connect · Higienização',
    description: 'Limpeza pós-obra, escritórios, estofos, fossas sépticas, vidros, desinfestação e caixas de água.',
    specialties: [
      'Limpeza pós-obra',
      'Limpeza de escritórios e espaços comerciais',
      'Limpeza de estofos, sofás e tapetes',
      'Limpeza de fossas sépticas e tanques',
      'Limpeza de vidros e fachadas',
      'Desinfestação (baratas, ratos, térmitas)',
      'Limpeza e desinfeção de caixas de água'
    ]
  },
  {
    id: 'manutencao_reparacoes',
    name: 'Manutenção & Reparações',
    group: 'trades',
    icon: '🔧',
    badge: 'Connect · Campo & Reparos',
    description: 'Eletricistas, canalizadores, climatização AC, eletrodomésticos, geradores, caixilharia e portões.',
    specialties: [
      'Eletricista residencial e industrial',
      'Canalizador / picheleiro',
      'Técnico de climatização (ar condicionado)',
      'Técnico de eletrodomésticos',
      'Técnico de geradores',
      'Montador de Caixilharia de Alumínio (portas e janelas)',
      'Serralheiro',
      'Técnico de portões automáticos e motorização'
    ]
  },
  {
    id: 'carpintaria_marcenaria',
    name: 'Carpintaria & Marcenaria',
    group: 'trades',
    icon: '🪚',
    badge: 'Connect · Oficina & Madeira',
    description: 'Móveis sob medida, acabamentos em madeira, restauro, pavimentos laminados e estruturas.',
    specialties: [
      'Carpinteiro de mobiliário sob medida',
      'Marceneiro de acabamentos (portas, roupeiros, cozinhas)',
      'Restauro de móveis antigos',
      'Instalação de pavimentos em madeira/laminado',
      'Construção de estruturas em madeira (telhados, pérgolas, decks)'
    ]
  },
  {
    id: 'construcao_obras',
    name: 'Construção & Obras',
    group: 'trades',
    icon: '🧱',
    badge: 'Connect · Obras Civis',
    description: 'Pedreiros, pintores, ladrilhadores, gesseiros, soldadores, empreiteiros e impermeabilização.',
    specialties: [
      'Pedreiro / construtor civil',
      'Pintor de interiores e exteriores',
      'Ladrilhador (colocação de azulejos e cerâmica)',
      'Gesseiro / estucador',
      'Soldador e estruturas metálicas',
      'Empreiteiro (pequenas e médias obras)',
      'Técnico de impermeabilização de telhados e lajes'
    ]
  },
  {
    id: 'jardinagem_exteriores',
    name: 'Jardinagem & Exteriores',
    group: 'trades',
    icon: '🌿',
    badge: 'Connect · Áreas Verdes',
    description: 'Jardineiros, poda de árvores, rega automática, limpeza de quintais, muros e manutenção de piscinas.',
    specialties: [
      'Jardineiro / paisagismo',
      'Poda e corte de árvores',
      'Instalação de rega automática',
      'Limpeza de quintais e terrenos',
      'Construção de muros e vedações',
      'Manutenção de piscinas (piscineiro)'
    ]
  },
  {
    id: 'elite_tech',
    name: 'Elite Tech',
    group: 'trades',
    icon: '⚡',
    badge: 'Connect · Instalação Tech',
    description: 'Instalação técnica de câmaras CCTV, antenas parabólicas DSTV/GOtv e redes Wi-Fi/dados.',
    specialties: [
      'Montador de Câmaras de Segurança (CCTV)',
      'Instalador de Antenas Parabólicas (DSTV, GOtv)',
      'Instalador de Internet (Wi-Fi / Dados)'
    ]
  },

  // ──────────────── PROFISSIONAIS DE ESCRITÓRIO & QUADROS CORPORATIVOS (TARIRA RECRUIT) ────────────────
  {
    id: 'ti_software',
    name: 'Tecnologia, Software & IT',
    group: 'office',
    icon: '💻',
    badge: 'Recruit · Corporativo',
    description: 'Desenvolvimento web/mobile, arquitetura de software, DevOps e engenharia.',
    specialties: [
      'Desenvolvimento Frontend (React, Vue, TypeScript, Tailwind)',
      'Desenvolvimento Backend & APIs (Node.js, Python, Java, Go)',
      'Engenharia de Software Fullstack',
      'Desenvolvimento Mobile (iOS, Android, React Native, Flutter)',
      'Arquitetura de Sistemas & Microsserviços',
      'Administração de Redes, Servidores & Suporte IT / Helpdesk',
      'QA, Automação de Testes & Qualidade de Software'
    ]
  },
  {
    id: 'ciberseguranca',
    name: 'Cibersegurança & Cloud',
    group: 'office',
    icon: '🛡️',
    badge: 'Recruit · Corporativo',
    description: 'Defesa cibernética, SOC, auditoria de segurança, pentesting e cloud computing.',
    specialties: [
      'Segurança Ofensiva, Ethical Hacking & Pentesting',
      'Monitorização SOC & Análise de Ameaças SIEM',
      'Arquitetura Cloud (AWS, Microsoft Azure, Google Cloud)',
      'DevSecOps, CI/CD Seguro & Automação de Infraestrutura',
      'Governança de Segurança, Normas ISO 27001 & Compliance',
      'Gestão de Identidades e Controlo de Acesso (IAM)'
    ]
  },
  {
    id: 'ia_dados',
    name: 'Inteligência Artificial, Dados & BI',
    group: 'office',
    icon: '🤖',
    badge: 'Recruit · Corporativo',
    description: 'Engenharia de dados, business intelligence, machine learning e agentes IA.',
    specialties: [
      'Engenharia de Dados & Pipelines ETL / Data Lake',
      'Análise de Negócio & Dashboards (Power BI, Tableau, SQL)',
      'Modelos de Linguagem (LLMs), Prompt Engineering & Agentes IA',
      'Machine Learning, Modelos Preditivos & Visão Computacional',
      'Governança de Dados, Big Data & Qualidade Analítica'
    ]
  },
  {
    id: 'financas_contabilidade',
    name: 'Finanças, Contabilidade & Auditoria',
    group: 'office',
    icon: '📊',
    badge: 'Recruit · Corporativo',
    description: 'Contabilidade geral moçambicana (PGC-NIRF), fiscalidade, tesouraria e auditoria.',
    specialties: [
      'Contabilidade Geral & Fiscalidade Moçambicana (IRPC, IRPS, IVA)',
      'Auditoria Financeira, Controlo Interno & Due Diligence',
      'Controlo de Gestão, Orçamentação & Reporting Executivo',
      'Gestão de Tesouraria, Contas a Receber/Pagar & Conciliação',
      'Modelação Financeira & Avaliação de Projetos de Investimento',
      'Planeamento Estratégico & Gestão de Risco Financeiro'
    ]
  },
  {
    id: 'recursos_humanos',
    name: 'Recursos Humanos & Recrutamento',
    group: 'office',
    icon: '👥',
    badge: 'Recruit · Corporativo',
    description: 'Aquisição de talentos, processamento salarial, relações laborais e desenvolvimento.',
    specialties: [
      'Recrutamento Executivo, Triagem ATS & Seleção de Talentos',
      'Processamento Salarial, Folha de Pagamento & INSS',
      'Legislação Laboral de Moçambique & Relações de Trabalho',
      'Gestão de Desempenho, KPIs & Avaliação por Competências',
      'Formação, Capacitação & Onboarding Corporativo',
      'Cultura Organizacional, Clima Laboral & Benefícios'
    ]
  },
  {
    id: 'gestao_projetos',
    name: 'Gestão, Projetos & Operações',
    group: 'office',
    icon: '📋',
    badge: 'Recruit · Corporativo',
    description: 'Gestão ágil de projetos, supply chain, compras e otimização operacional.',
    specialties: [
      'Gestão de Projetos (Metodologias Ágeis Scrum / Kanban / PMP)',
      'Coordenação de Operações & Gestão de Processos (BPM / Lean)',
      'Gestão de Compras, Negociação & Fornecedores (Procurement)',
      'Logística, Armazenagem & Gestão de Cadeia de Suprimentos',
      'Gestão de Qualidade & Certificação ISO 9001',
      'Direção Geral, Gestão Executiva & Liderança Estratégica'
    ]
  },
  {
    id: 'juridico_compliance',
    name: 'Jurídico, Legal & Compliance',
    group: 'office',
    icon: '⚖️',
    badge: 'Recruit · Corporativo',
    description: 'Direito societário, contratos, regulação moçambicana e prevenção de riscos.',
    specialties: [
      'Direito Societário, Comercial & Contratos Empresariais',
      'Compliance Regulatório, KYC & Prevenção de Branqueamento (AML)',
      'Direito do Trabalho, Contencioso & Negociação Sindical',
      'Assessoria Jurídica Imobiliária, Fundiária & DUAT',
      'Propriedade Intelectual, Marcas & Patentes',
      'Contratação Pública & Parcerias Público-Privadas (PPP)'
    ]
  },
  {
    id: 'atendimento_secretariado',
    name: 'Atendimento, Secretariado & Escritório',
    group: 'office',
    icon: '📞',
    badge: 'Recruit · Corporativo',
    description: 'Secretariado executivo, receção bilíngue, contact center e suporte executivo.',
    specialties: [
      'Secretariado Executivo de Direção & Assessoria de Administração',
      'Atendimento ao Cliente, Suporte Multicanal & Fidelização',
      'Supervisão de Contact Center & Operações de Teleatendimento',
      'Receção Corporativa, Gestão de Agendas & Protocolo',
      'Assistência Administrativa Geral & Gestão de Ficheiros',
      'Organização de Viagens, Eventos Corporativos & Logística'
    ]
  },
  {
    id: 'marketing_vendas',
    name: 'Marketing, Comercial & Vendas',
    group: 'office',
    icon: '📈',
    badge: 'Recruit · Corporativo',
    description: 'Vendas corporativas B2B, marketing digital, design gráfico e comunicação.',
    specialties: [
      'Gestão de Contas Comerciais B2B & Negociação Corporativa',
      'Marketing Digital, Gestão de Tráfego Pago & Redes Sociais',
      'Design Gráfico, Branding, Identidade Visual & UI/UX',
      'Produção de Conteúdo, Copywriting & Comunicação Institucional',
      'Relações Públicas, Assessoria de Imprensa & Eventos',
      'Pesquisa de Mercado & Expansão Comercial'
    ]
  }
];

export function getCategoriesByRole(role: 'prestador' | 'profissional' | 'lar' | 'empresa' | 'condominio' | 'all'): CategoryTaxonomyItem[] {
  if (role === 'prestador') {
    return CATEGORIES_TAXONOMY.filter(c => c.group === 'trades');
  }
  if (role === 'profissional') {
    return CATEGORIES_TAXONOMY.filter(c => c.group === 'office');
  }
  if (role === 'lar') {
    return CATEGORIES_TAXONOMY.filter(c => c.id === 'servicos_domesticos' || c.id === 'limpeza_especializada' || c.id === 'manutencao_reparacoes' || c.id === 'jardinagem_exteriores');
  }
  return CATEGORIES_TAXONOMY;
}

export function getSpecialtiesForCategory(categoryNameOrId: string): string[] {
  if (!categoryNameOrId) return [];
  const normalized = categoryNameOrId.toLowerCase().trim();
  
  const found = CATEGORIES_TAXONOMY.find(c => 
    c.name.toLowerCase() === normalized || 
    c.id.toLowerCase() === normalized ||
    c.name.toLowerCase().includes(normalized) ||
    normalized.includes(c.name.toLowerCase()) ||
    normalized.includes(c.id.toLowerCase())
  );
  
  return found ? found.specialties : [];
}

export function findCategoryItem(categoryNameOrId: string): CategoryTaxonomyItem | undefined {
  if (!categoryNameOrId) return undefined;
  const normalized = normalizeCatText(categoryNameOrId);
  if (!normalized) return undefined;

  const aliasToId: Record<string, string> = {
    dom: 'servicos_domesticos',
    dom2: 'servicos_domesticos',
    domesticos: 'servicos_domesticos',
    servicos_domesticos: 'servicos_domesticos',
    domesticos_limpeza: 'servicos_domesticos',
    babas: 'servicos_domesticos',
    baba: 'servicos_domesticos',
    cuidados: 'servicos_domesticos',
    cuidadores: 'servicos_domesticos',
    cozinha: 'servicos_domesticos',
    limp: 'limpeza_especializada',
    limpeza: 'limpeza_especializada',
    limpeza_especializada: 'limpeza_especializada',
    limpeza_higienizacao: 'limpeza_especializada',
    limpeza_tecnica: 'limpeza_especializada',
    man: 'manutencao_reparacoes',
    manutencao: 'manutencao_reparacoes',
    manutencao_reparacoes: 'manutencao_reparacoes',
    climatizacao_energia: 'manutencao_reparacoes',
    climatizacao: 'manutencao_reparacoes',
    clim: 'manutencao_reparacoes',
    mecanica_geradores: 'manutencao_reparacoes',
    auto: 'manutencao_reparacoes',
    geradores: 'manutencao_reparacoes',
    mecanica: 'manutencao_reparacoes',
    canal: 'manutencao_reparacoes',
    canalizacao: 'manutencao_reparacoes',
    avac: 'manutencao_reparacoes',
    mec: 'manutencao_reparacoes',
    elet: 'manutencao_reparacoes',
    eletricidade: 'manutencao_reparacoes',
    eletricistas: 'manutencao_reparacoes',
    serralharia: 'manutencao_reparacoes',
    solar: 'manutencao_reparacoes',
    refrigeracao: 'manutencao_reparacoes',
    'instalacao solar & energia': 'manutencao_reparacoes',
    'eletricidade & instalacoes': 'manutencao_reparacoes',
    'eletricidade & climatizacao': 'manutencao_reparacoes',
    carp: 'carpintaria_marcenaria',
    carpintaria: 'carpintaria_marcenaria',
    carpintaria_marcenaria: 'carpintaria_marcenaria',
    marcenaria: 'carpintaria_marcenaria',
    madeira: 'carpintaria_marcenaria',
    obra: 'construcao_obras',
    construcao: 'construcao_obras',
    construcao_obras: 'construcao_obras',
    'construcao & acabamentos': 'construcao_obras',
    pint: 'construcao_obras',
    pintura: 'construcao_obras',
    pintura_acabamentos: 'construcao_obras',
    revestimentos: 'construcao_obras',
    impermeabilizacao: 'construcao_obras',
    pedreiro: 'construcao_obras',
    ladrilhador: 'construcao_obras',
    pladur: 'construcao_obras',
    jard: 'jardinagem_exteriores',
    jardinagem: 'jardinagem_exteriores',
    jardinagem_exteriores: 'jardinagem_exteriores',
    jardinagem_exterior: 'jardinagem_exteriores',
    paisagismo: 'jardinagem_exteriores',
    piscinas: 'jardinagem_exteriores',
    elite_tech: 'elite_tech',
    cctv: 'elite_tech',
    seguranca: 'elite_tech',
    internet: 'elite_tech',
    'seguranca eletronica & redes': 'elite_tech',
    ti_software: 'ti_software',
    devops: 'ti_software',
    ciberseguranca: 'ciberseguranca',
    ciberseguranca_redes: 'ciberseguranca',
    cyber: 'ciberseguranca',
    ia_dados: 'ia_dados',
    dados_ia: 'ia_dados',
    ai: 'ia_dados',
    financas_contabilidade: 'financas_contabilidade',
    financas: 'financas_contabilidade',
    recursos_humanos: 'recursos_humanos',
    gestao_rh_executivo: 'recursos_humanos',
    gestao_rh: 'recursos_humanos',
    exec: 'recursos_humanos',
    gestao_projetos: 'gestao_projetos',
    engenharia_operacoes: 'gestao_projetos',
    engenharia: 'gestao_projetos',
    projetos: 'gestao_projetos',
    juridico_compliance: 'juridico_compliance',
    juridico: 'juridico_compliance',
    kyc: 'juridico_compliance',
    atendimento_secretariado: 'atendimento_secretariado',
    atendimento_bpo: 'atendimento_secretariado',
    callcenter: 'atendimento_secretariado',
    telecom_data: 'ti_software',
    telecom: 'ti_software',
    marketing_vendas: 'marketing_vendas',
    marketing: 'marketing_vendas',
  };

  if (aliasToId[normalized]) {
    const byAlias = CATEGORIES_TAXONOMY.find(c => c.id === aliasToId[normalized]);
    if (byAlias) return byAlias;
  }

  return CATEGORIES_TAXONOMY.find(c => {
    const cName = normalizeCatText(c.name);
    const cId = normalizeCatText(c.id);
    return (
      cName === normalized ||
      cId === normalized ||
      (normalized.length >= 4 && (cName.includes(normalized) || normalized.includes(cName)))
    );
  });
}

export function normalizeCatText(str?: string | null): string {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

const GENERIC_EXACT_PLACEHOLDERS = new Set([
  'especialista qualificado',
  'especialista qualificado · talentos & quadros',
  'especialista qualificado - talentos & quadros',
  'talentos & quadros corporativos',
  'talentos e quadros corporativos',
  'talentos & quadros',
  'talentos e quadros',
  'tecnico especializado',
  'tecnico especialista',
  'tecnico qualificado',
  'tecnico de campo',
  'tecnicos de campo',
  'tecnico de oficio',
  'oficios tecnicos & servicos de campo',
  'oficios tecnicos e servicos de campo',
  'profissional qualificado',
  'profissional especialista',
  'profissional especializado',
  'profissional de nivel superior',
  'recrutamento & selecao corporativa',
  'recrutamento e selecao corporativa',
  'profissional tarira',
  'talento tarira',
  'talento corporativo',
  'especialista corporativo',
  'especialista corporativo & gestao',
  'quadro corporativo & especialista',
  'prestador de servico',
  'prestador de servicos',
  'prestador homologado',
  'prestador',
  'profissional',
  'especialista',
  'tecnico',
  'candidato',
  'talento',
  'outros',
  'geral',
  'all',
  'todos',
  'tech',
  'prof',
  'recruitment',
  'recrutamento',
  'quadros',
  'n/a',
  'garantia de qualidade',
  'execucao tecnica',
  'atendimento profissional',
  'engenheiro de software & sistemas',
  'ti, engenharia de software & cloud',
  'software, web, cloud & apps',
  'tecnologia, software & gestao',
  'tecnologia software e gestao',
  'tecnologia, software & it',
  'software & gestao',
  'manutencao tecnica & reparacoes',
  'manutencao & reparacoes',
  'manutencao & reparacoes tecnicas',
  'servico de campo & manutencao',
  'servicos domesticos & limpeza'
]);

function isSingleTokenGeneric(normToken: string): boolean {
  if (!normToken) return true;
  if (GENERIC_EXACT_PLACEHOLDERS.has(normToken)) return true;
  if (
    normToken.startsWith('profissional qualificado e verificado') ||
    normToken.startsWith('profissional verificado e registado') ||
    normToken.startsWith('profissional qualificado verificado') ||
    normToken.startsWith('tecnico de oficio credenciado') ||
    normToken.startsWith('prestador qualificado e credenciado')
  ) {
    return true;
  }
  return false;
}

export function extractCleanSpecialtyParts(val?: string | null): string[] {
  if (!val) return [];
  const raw = String(val).trim();
  if (!raw) return [];

  // If this is an auto-generated bio with parenthesized specialty, extract the inside of parentheses first
  const parenMatch = raw.match(/Profissional qualificado e verificado no ecossistema TARIRA\s*\(([^)]+)\)/i);
  if (parenMatch && parenMatch[1]) {
    const inner = parenMatch[1].trim();
    if (!isSingleTokenGeneric(normalizeCatText(inner))) {
      return [inner];
    }
    return [];
  }

  const parts = raw
    .split(/\s*(?:·|•|\||—|–|\s-\s|;)\s*/)
    .map(p => p.trim())
    .filter(Boolean);

  return parts.filter(p => !isSingleTokenGeneric(normalizeCatText(p)));
}

export function isGenericTitleOrPlaceholder(val?: string | null): boolean {
  const norm = normalizeCatText(val);
  if (!norm) return true;
  if (isSingleTokenGeneric(norm)) return true;
  const cleanParts = extractCleanSpecialtyParts(val);
  return cleanParts.length === 0;
}

export function findCategoryBySpecialtyOrKeyword(
  text?: string | null,
  preferGroup?: 'trades' | 'office'
): { category: CategoryTaxonomyItem; matchedSpecialty?: string } | undefined {
  if (!text) return undefined;
  const cleanParts = extractCleanSpecialtyParts(text);
  const cleanedText = cleanParts.length > 0 ? cleanParts.join(' · ') : String(text).trim();
  const norm = normalizeCatText(cleanedText);
  if (!norm || isSingleTokenGeneric(norm)) return undefined;

  const nonDefaultOffice = CATEGORIES_TAXONOMY.filter(c => c.group === 'office' && c.id !== 'ti_software');
  const defaultOffice = CATEGORIES_TAXONOMY.filter(c => c.group === 'office' && c.id === 'ti_software');
  const nonDefaultTrades = CATEGORIES_TAXONOMY.filter(c => c.group === 'trades' && c.id !== 'manutencao_reparacoes');
  const defaultTrades = CATEGORIES_TAXONOMY.filter(c => c.group === 'trades' && c.id === 'manutencao_reparacoes');

  const pool = preferGroup === 'trades'
    ? [...nonDefaultTrades, ...defaultTrades, ...nonDefaultOffice, ...defaultOffice]
    : preferGroup === 'office'
    ? [...nonDefaultOffice, ...defaultOffice, ...nonDefaultTrades, ...defaultTrades]
    : [...nonDefaultOffice, ...nonDefaultTrades, ...defaultOffice, ...defaultTrades];

  const normParts = cleanParts.map(p => normalizeCatText(p)).filter(Boolean);

  // 1. Exact match on any clean specialty part against canonical specialties
  for (const partNorm of normParts) {
    for (const cat of pool) {
      for (const spec of cat.specialties) {
        const specNorm = normalizeCatText(spec);
        if (partNorm === specNorm) {
          return { category: cat, matchedSpecialty: spec };
        }
      }
    }
  }

  // 2. Substring match where candidate text contains a full canonical specialty (or a long clean part >= 12 chars matches a specialty)
  for (const cat of pool) {
    for (const spec of cat.specialties) {
      const specNorm = normalizeCatText(spec);
      if (specNorm.length >= 6 && norm.includes(specNorm)) {
        return { category: cat, matchedSpecialty: spec };
      }
      for (const partNorm of normParts) {
        if (partNorm.length >= 12 && specNorm.includes(partNorm)) {
          return { category: cat, matchedSpecialty: spec };
        }
      }
    }
  }

  // 3. Match against category name or ID
  for (const cat of pool) {
    const cName = normalizeCatText(cat.name);
    const cId = normalizeCatText(cat.id);
    if (norm === cName || norm === cId || normParts.some(p => p === cName || p === cId)) {
      return { category: cat };
    }
  }

  // 4. Keyword rules by group (specific categories evaluated before default catch-all categories)
  const tradeRules: Array<{ id: string; regex: RegExp }> = [
    { id: 'limpeza_especializada', regex: /limpeza pos-obra|limpeza de escritorios|limpeza de estofos|fossas septicas|limpeza de vidros|desinfestacao|caixas de agua|higienizacao|limpeza especializada|limpeza comercial|limpeza industrial/ },
    { id: 'servicos_domesticos', regex: /empregada domestica|diarista|cozinheir|passadeira|engomadoria|lavandaria|motorista particular|guarda-costas residencial|cuidador|baba\b|ama para criancas|recem-nascidos|governanta|servicos domesticos|apoio familiar/ },
    { id: 'carpintaria_marcenaria', regex: /carpint|marcen|mobiliario sob medida|restauro de moveis|pavimentos em madeira|estruturas em madeira|pergolas|decks/ },
    { id: 'construcao_obras', regex: /pedreiro|construtor civil|pintor|pintura|ladrilhador|azulejos|gesseiro|estucador|soldador|empreiteiro|impermeabilizacao|construcao & obras|construcao civil|alvenaria|pladur|mestre de obras/ },
    { id: 'jardinagem_exteriores', regex: /jardineiro|jardinagem|paisagismo|poda e corte|rega automatica|limpeza de quintais|construcao de muros|piscineiro|manutencao de piscinas/ },
    { id: 'elite_tech', regex: /cctv|camaras de seguranca|antenas parabolicas|dstv|gotv|instalador de internet|elite tech|fibra optica|redes wi-fi/ },
    { id: 'manutencao_reparacoes', regex: /eletricista|electricista|canalizador|picheleiro|climatizacao|ar condicionado|\bavac\b|eletrodomesticos|geradores|caixilharia|serralheiro|portoes automaticos|solar|fuga de agua|hidraulica|quadro eletrico|disjuntor/ },
  ];

  const officeRules: Array<{ id: string; regex: RegExp }> = [
    { id: 'financas_contabilidade', regex: /contabil|financ|auditor|fiscal|irpc|irps|\biva\b|tesouraria|orcamentacao|pgc-nirf|ifrs|ocam|controller/ },
    { id: 'recursos_humanos', regex: /recursos humanos|\brh\b|recrutamento executivo|triagem ats|processamento salarial|folha de pagamento|\binss\b|legislacao laboral|people operations|people ops|gestao de talentos|onboarding|diretor de recursos humanos/ },
    { id: 'ia_dados', regex: /inteligencia artificial|machine learning|\bllm\b|\bllms\b|\brag\b|prompt engineering|agentes ia|engenharia de dados|pipelines etl|data lake|power bi|tableau|big data|data solution|data science|cientista de dados|analista de dados|mlops|pytorch|tensorflow/ },
    { id: 'ciberseguranca', regex: /ciberseguran|cyber|pentest|ethical hacking|\bsoc\b|\bsiem\b|devsecops|iso 27001|\biam\b|seguranca ofensiva|seguranca da informacao/ },
    { id: 'gestao_projetos', regex: /gestao de projetos|project manager|\bscrum\b|\bkanban\b|\bpmp\b|coordenacao de operacoes|gestao de processos|\bbpm\b|\blean\b|procurement|compras|logistica|armazenagem|supply chain|iso 9001|direcao geral|gestor de projetos|hse/ },
    { id: 'juridico_compliance', regex: /juridic|advogad|direito|contratos|compliance|\bkyc\b|\baml\b|branqueamento|contencioso|\bduat\b|propriedade intelectual|risco bancario/ },
    { id: 'atendimento_secretariado', regex: /secretariado|atendimento ao cliente|suporte multicanal|contact center|call center|teleatendimento|rececao|recepcao|protocolo|assistencia administrativa|assistente executiv|\bcx\b|\bbpo\b|\bsac\b/ },
    { id: 'marketing_vendas', regex: /marketing|comercial|vendas|contas comerciais|\bb2b\b|trafego pago|redes sociais|design grafico|branding|ui\/ux|copywriting|relacoes publicas|comunicacao|growth/ },
    { id: 'ti_software', regex: /frontend|backend|fullstack|full stack|full-stack|software|desenvolvedor|programador|react|node|typescript|mobile|flutter|microsservicos|arquitetura cloud|aws|azure|google cloud|devops|docker|kubernetes|redes|servidores|helpdesk|\bqa\b|automacao de testes|telecom|insercao de dados|provisioning/ },
  ];

  const orderedRules = preferGroup === 'trades'
    ? [...tradeRules, ...officeRules]
    : preferGroup === 'office'
    ? [...officeRules, ...tradeRules]
    : [...officeRules, ...tradeRules];

  // Check each clean part individually first so primary specialty/title wins over later tokens
  for (const partNorm of normParts) {
    for (const rule of orderedRules) {
      if (rule.regex.test(partNorm)) {
        const cat = CATEGORIES_TAXONOMY.find(c => c.id === rule.id);
        if (cat) return { category: cat };
      }
    }
  }

  for (const rule of orderedRules) {
    if (rule.regex.test(norm)) {
      const cat = CATEGORIES_TAXONOMY.find(c => c.id === rule.id);
      if (cat) return { category: cat };
    }
  }

  return undefined;
}

export function resolveCanonicalCategoryId(
  rawCategory?: string | null,
  fallbackContextText?: string | null,
  titleOrIsProf?: string | boolean | null,
  isProfessional?: boolean
): string {
  let effectiveIsProf: boolean | undefined = isProfessional;
  let explicitTitle = '';

  if (typeof titleOrIsProf === 'boolean') {
    effectiveIsProf = titleOrIsProf;
  } else if (typeof titleOrIsProf === 'string' && titleOrIsProf.trim()) {
    explicitTitle = titleOrIsProf.trim();
  }

  const preferGroup = effectiveIsProf === true ? 'office' : effectiveIsProf === false ? 'trades' : undefined;
  const normCat = normalizeCatText(rawCategory);

  // 1. Check if rawCategory is an explicit non-default category
  const isDefaultOrGenericCat =
    !normCat ||
    normCat === 'outros' ||
    normCat === 'tech' ||
    normCat === 'prof' ||
    normCat === 'recruitment' ||
    normCat === 'recrutamento' ||
    normCat === 'quadros' ||
    normCat === 'ti_software' ||
    normCat === 'devops' ||
    normCat === 'manutencao_reparacoes' ||
    normCat === 'manutencao' ||
    normCat === 'man';

  if (!isDefaultOrGenericCat) {
    const direct = findCategoryItem(rawCategory || '');
    if (direct) {
      if (!preferGroup || direct.group === preferGroup) {
        return direct.id;
      }
    }
  }

  // 2. Try to infer from explicit title first (if non-generic)
  if (explicitTitle && !isGenericTitleOrPlaceholder(explicitTitle)) {
    const fromTitle = findCategoryBySpecialtyOrKeyword(explicitTitle, preferGroup);
    if (fromTitle && (!preferGroup || fromTitle.category.group === preferGroup)) {
      return fromTitle.category.id;
    }
  }

  // 3. Try to infer from specialization / subCategory / skills context
  if (fallbackContextText) {
    const inferred = findCategoryBySpecialtyOrKeyword(fallbackContextText, preferGroup);
    if (inferred && (!preferGroup || inferred.category.group === preferGroup)) {
      return inferred.category.id;
    }
  }

  // 4. Try combined title + context without group restriction if still unresolved
  const combinedContext = [explicitTitle, fallbackContextText].filter(Boolean).join(' · ');
  if (combinedContext) {
    const inferredAny = findCategoryBySpecialtyOrKeyword(combinedContext, preferGroup);
    if (inferredAny) return inferredAny.category.id;
  }

  if (normCat) {
    const direct = findCategoryItem(rawCategory || '');
    if (direct && (!preferGroup || direct.group === preferGroup)) {
      return direct.id;
    }
  }

  return effectiveIsProf === false ? 'manutencao_reparacoes' : 'ti_software';
}

export function resolveCandidateSpecialization(c: any): string {
  if (!c) return 'Especialista';

  const rawTitle = String(c.title || c.professional_title || '').trim();
  const rawSubCat = String(c.subCategory || c.sub_category || '').trim();
  const rawRole = String(c.role || '').trim();

  const specialtiesArr: string[] = Array.isArray(c.specialties)
    ? c.specialties.map((s: any) => String(s || '').trim()).filter(Boolean)
    : [];

  const skillsArr: string[] = Array.isArray(c.skills)
    ? c.skills.map((s: any) => String(s || '').trim()).filter(Boolean)
    : typeof c.skills === 'string'
    ? c.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
    : [];

  // 1. If title has a specific non-generic part, use it
  const cleanTitleParts = extractCleanSpecialtyParts(rawTitle);
  if (cleanTitleParts.length > 0) {
    return cleanTitleParts[0];
  }

  // 2. If subCategory has a specific specialization, use the first clean item
  const cleanSubParts = extractCleanSpecialtyParts(rawSubCat);
  if (cleanSubParts.length > 0) {
    return cleanSubParts[0];
  }

  // 3. Check specialties array
  for (const s of specialtiesArr) {
    const cleanSpec = extractCleanSpecialtyParts(s);
    if (cleanSpec.length > 0) return cleanSpec[0];
  }

  // 4. Check skills array
  for (const s of skillsArr) {
    const cleanSkill = extractCleanSpecialtyParts(s);
    if (cleanSkill.length > 0) return cleanSkill[0];
  }

  // 5. Check if role itself holds a custom specialization title
  if (
    rawRole &&
    !isGenericTitleOrPlaceholder(rawRole) &&
    !['prestador', 'profissional', 'lar', 'empresa', 'condominio', 'admin', 'guest'].includes(normalizeCatText(rawRole))
  ) {
    const cleanRole = extractCleanSpecialtyParts(rawRole);
    if (cleanRole.length > 0) return cleanRole[0];
  }

  // 6. Check if bio mentions a specific specialty or category
  const rawBio = String(c.bio || '').trim();
  if (rawBio) {
    const parenMatch = rawBio.match(/\(([^)]+)\)/);
    if (parenMatch && parenMatch[1] && !isGenericTitleOrPlaceholder(parenMatch[1])) {
      const cleanParen = extractCleanSpecialtyParts(parenMatch[1]);
      if (cleanParen.length > 0) return cleanParen[0];
    }
    const fromBio = findCategoryBySpecialtyOrKeyword(rawBio, c.isProfessional === false ? 'trades' : 'office');
    if (fromBio) {
      if (fromBio.matchedSpecialty) return fromBio.matchedSpecialty;
      return fromBio.category.name;
    }
  }

  // 7. Fall back to the candidate's category name from CATEGORIES_TAXONOMY
  const catItem = findCategoryItem(String(c.category || ''));
  if (catItem) {
    return catItem.name;
  }

  return c.isProfessional === false ? 'Manutenção & Reparações Técnicas' : 'Tecnologia, Software & Gestão';
}

export function resolveCandidateGalleryTab(c: any): string[] {
  if (!c) return [];

  const rawCat = normalizeCatText(c.category || '');

  // Direct explicit gallery tab IDs
  const explicitGalleryTabs: Record<string, string> = {
    telecom_data: 'telecom_data',
    telecom: 'telecom_data',
    callcenter: 'callcenter',
    atendimento_bpo: 'callcenter',
    financas: 'financas',
    financas_contabilidade: 'financas',
    cyber: 'cyber',
    ciberseguranca: 'cyber',
    ciberseguranca_redes: 'cyber',
    ai: 'ai',
    ia_dados: 'ai',
    dados_ia: 'ai',
    kyc: 'kyc',
    exec: 'exec',
    recursos_humanos: 'exec',
    gestao_rh_executivo: 'exec',
    gestao_rh: 'exec',
    projetos: 'projetos',
    gestao_projetos: 'projetos',
    engenharia_operacoes: 'projetos',
    engenharia: 'projetos',
    marketing: 'marketing',
    marketing_vendas: 'marketing',
    juridico: 'juridico',
  };

  const cleanTitleParts = extractCleanSpecialtyParts(c.title || c.professional_title);
  const cleanSubParts = extractCleanSpecialtyParts(c.subCategory || c.sub_category);
  const specsArr = Array.isArray(c.specialties)
    ? c.specialties.flatMap((s: any) => extractCleanSpecialtyParts(s))
    : [];
  const skillsArr = Array.isArray(c.skills)
    ? c.skills.flatMap((s: any) => extractCleanSpecialtyParts(s))
    : typeof c.skills === 'string'
    ? c.skills.split(',').flatMap((s: string) => extractCleanSpecialtyParts(s))
    : [];
  const specResolvedParts = extractCleanSpecialtyParts(resolveCandidateSpecialization(c));

  const orderedSignals = [
    ...cleanTitleParts,
    ...cleanSubParts,
    ...specsArr,
    ...skillsArr,
    ...specResolvedParts,
  ];
  const combinedCleanText = normalizeCatText(orderedSignals.join(' · '));
  const bioCleanText = !isGenericTitleOrPlaceholder(c.bio) ? normalizeCatText(c.bio) : '';

  // 1. Check explicit sub-tab disambiguations on clean signals first
  const signalAndCatText = `${rawCat} ${combinedCleanText}`.trim();

  if (/telecom|insercao de dados|data entry|provisioning|\boss\b|\bbss\b/.test(signalAndCatText)) {
    return ['telecom_data'];
  }

  // If rawCat is explicitly one of the non-default gallery categories (not ti_software / devops / prof / recruitment)
  if (explicitGalleryTabs[rawCat]) {
    const mapped = explicitGalleryTabs[rawCat];
    if (mapped === 'juridico' && /compliance|\bkyc\b|\baml\b|branqueamento|risco bancario/.test(combinedCleanText)) {
      return ['kyc'];
    }
    return [mapped];
  }

  if (rawCat === 'juridico_compliance') {
    if (/compliance|\bkyc\b|\baml\b|branqueamento|risco bancario/.test(combinedCleanText)) {
      return ['kyc'];
    }
    return ['juridico'];
  }

  if (rawCat === 'atendimento_secretariado') {
    if (/secretariado|recepcao|rececao|assessoria|protocolo|agendas|assistente executiv/.test(combinedCleanText)) {
      return ['juridico'];
    }
    return ['callcenter'];
  }

  // 2. Infer canonical category from ordered clean signals (title -> subCategory -> specialties -> skills -> bio)
  const canonicalCatId = resolveCanonicalCategoryId(
    c.category,
    combinedCleanText || bioCleanText,
    cleanTitleParts[0] || '',
    true
  );

  if (canonicalCatId === 'juridico_compliance') {
    if (/compliance|\bkyc\b|\baml\b|branqueamento|risco bancario/.test(`${combinedCleanText} ${bioCleanText}`)) {
      return ['kyc'];
    }
    return ['juridico'];
  }

  if (canonicalCatId === 'atendimento_secretariado') {
    if (/secretariado|recepcao|rececao|assessoria|protocolo|agendas|assistente executiv/.test(`${combinedCleanText} ${bioCleanText}`)) {
      return ['juridico'];
    }
    return ['callcenter'];
  }

  const directTabByCategory: Record<string, string> = {
    ti_software: 'devops',
    ciberseguranca: 'cyber',
    ia_dados: 'ai',
    financas_contabilidade: 'financas',
    recursos_humanos: 'exec',
    gestao_projetos: 'projetos',
    marketing_vendas: 'marketing',
  };

  if (directTabByCategory[canonicalCatId]) {
    return [directTabByCategory[canonicalCatId]];
  }

  return ['devops'];
}

export function resolveTechnicianCategoryTab(c: any): string {
  if (!c) return 'manutencao';

  const rawCat = normalizeCatText(c.category || '');

  // 1. Direct explicit non-default trade category or alias
  const explicitNonDefaultTradeMap: Record<string, string> = {
    servicos_domesticos: 'domesticos',
    domesticos_limpeza: 'domesticos',
    dom: 'domesticos',
    dom2: 'domesticos',
    domesticos: 'domesticos',
    babas: 'domesticos',
    baba: 'domesticos',
    cuidados: 'domesticos',
    cuidadores: 'domesticos',
    cozinha: 'domesticos',
    limpeza_especializada: 'limpeza',
    limpeza_higienizacao: 'limpeza',
    limpeza_tecnica: 'limpeza',
    limp: 'limpeza',
    limpeza: 'limpeza',
    carpintaria_marcenaria: 'carpintaria',
    carp: 'carpintaria',
    carpintaria: 'carpintaria',
    marcenaria: 'carpintaria',
    madeira: 'carpintaria',
    construcao_obras: 'construcao',
    obra: 'construcao',
    construcao: 'construcao',
    pint: 'construcao',
    pintura: 'construcao',
    pintura_acabamentos: 'construcao',
    pedreiro: 'construcao',
    ladrilhador: 'construcao',
    pladur: 'construcao',
    jardinagem_exteriores: 'jardinagem',
    jardinagem_exterior: 'jardinagem',
    jard: 'jardinagem',
    jardinagem: 'jardinagem',
    paisagismo: 'jardinagem',
    piscinas: 'jardinagem',
    elite_tech: 'tech',
    cctv: 'tech',
    climatizacao_energia: 'manutencao',
    climatizacao: 'manutencao',
    clim: 'manutencao',
    mecanica_geradores: 'manutencao',
    elet: 'manutencao',
    eletricistas: 'manutencao',
    eletricidade: 'manutencao',
    canal: 'manutencao',
    canalizacao: 'manutencao',
    avac: 'manutencao',
    solar: 'manutencao',
  };

  if (explicitNonDefaultTradeMap[rawCat]) {
    // Disambiguate domesticos_limpeza if specialty is specifically limpeza pós-obra / comercial
    if (rawCat === 'domesticos_limpeza' || rawCat === 'servicos_domesticos') {
      const checkTxt = normalizeCatText(`${c.title || ''} ${c.subCategory || ''} ${(c.skills || []).join(' ')}`);
      if (/limpeza pos-obra|limpeza de escritorios|limpeza de estofos|fossas septicas|limpeza de vidros|desinfestacao|caixas de agua|limpeza especializada/.test(checkTxt)) {
        return 'limpeza';
      }
    }
    return explicitNonDefaultTradeMap[rawCat];
  }

  // 2. Infer from clean specialty signals (title -> subCategory -> specialties -> skills -> bio)
  const cleanTitleParts = extractCleanSpecialtyParts(c.title || c.professional_title);
  const cleanSubParts = extractCleanSpecialtyParts(c.subCategory || c.sub_category);
  const specsArr = Array.isArray(c.specialties)
    ? c.specialties.flatMap((s: any) => extractCleanSpecialtyParts(s))
    : [];
  const skillsArr = Array.isArray(c.skills)
    ? c.skills.flatMap((s: any) => extractCleanSpecialtyParts(s))
    : typeof c.skills === 'string'
    ? c.skills.split(',').flatMap((s: string) => extractCleanSpecialtyParts(s))
    : [];
  const specResolvedParts = extractCleanSpecialtyParts(resolveCandidateSpecialization(c));

  const orderedSignals = [
    ...cleanTitleParts,
    ...cleanSubParts,
    ...specsArr,
    ...skillsArr,
    ...specResolvedParts,
  ];
  const combinedCleanText = normalizeCatText(orderedSignals.join(' · '));
  const bioCleanText = !isGenericTitleOrPlaceholder(c.bio) ? normalizeCatText(c.bio) : '';

  const canonicalCatId = resolveCanonicalCategoryId(
    c.category,
    combinedCleanText || bioCleanText,
    cleanTitleParts[0] || '',
    false
  );

  const mapIdToTechTab: Record<string, string> = {
    servicos_domesticos: 'domesticos',
    limpeza_especializada: 'limpeza',
    manutencao_reparacoes: 'manutencao',
    carpintaria_marcenaria: 'carpintaria',
    construcao_obras: 'construcao',
    jardinagem_exteriores: 'jardinagem',
    elite_tech: 'tech',
  };

  if (mapIdToTechTab[canonicalCatId]) {
    return mapIdToTechTab[canonicalCatId];
  }

  return 'manutencao';
}
