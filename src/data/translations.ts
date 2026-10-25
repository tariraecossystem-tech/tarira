export type Lang = "pt" | "en";

export interface LanguageItem {
  code: Lang;
  label: string;
  flag: string;
  region?: string;
  name?: string;
  nativeName?: string;
}

export const LANGUAGES: LanguageItem[] = [
  { code: "pt", label: "Português", flag: "🇲🇿" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export const translations: Record<Lang, Record<string, string>> = {
  pt: {
    // Nav & General
    welcome: "Bem-vindo ao Portal TARIRA",
    subtitle: "Soluções Integradas de Outsourcing, Recrutamento e Serviços Técnicos em Moçambique",
    select_language: "Selecionar Idioma",
    nav_home: "Início",
    nav_about: "Sobre Nós",
    nav_solutions: "Soluções & Serviços",
    nav_all_solutions: "Todas as Soluções",
    nav_services: "Serviços & Preçário",
    nav_technicians: "Técnicos de Campo",
    nav_talents: "Talentos & Quadros",
    nav_jobs: "Vagas & Oportunidades",
    nav_faqs: "Perguntas Frequentes",
    nav_spontaneous: "Candidatura Espontânea",
    nav_login: "Entrar / Acesso",
    nav_logout: "Sair",
    nav_quote: "Pedir Cotação",
    nav_my_dashboard: "Meu Painel",
    nav_admin_panel: "Painel de Administração",
    nav_close: "Fechar",
    nav_menu: "Menu",

    // Units
    unit_connect: "TARIRA Connect",
    unit_connect_desc: "Técnicos de campo, eletricistas, AVAC, canalização e serviços ao domicílio em Maputo e Matola.",
    unit_recruit: "TARIRA Recruit",
    unit_recruit_desc: "Recrutamento especializado, executive search e triagem presencial com auditoria documental.",
    unit_outsourcing: "TARIRA Outsourcing",
    unit_outsourcing_desc: "Gestão completa de força de trabalho, contratação flexível e administração de pessoal.",
    unit_consulting: "TARIRA Consulting",
    unit_consulting_desc: "Consultoria organizacional, auditoria de processos de RH, diagnósticos e conformidade laboral.",
    unit_studio: "TARIRA Studio",
    unit_studio_desc: "Engenharia de plataformas digitais, sistemas modulares e soluções tecnológicas sob medida.",

    // Landing Hero & Core
    hero_kicker: "Plataforma Integrada de Serviços & Capital Humano",
    hero_title_1: "Supervisionamos para que",
    hero_title_2: "não precise.",
    hero_subtitle: "Conectamos empresas e famílias em Moçambique a técnicos de campo credenciados e profissionais qualificados. Da triagem documental ao acompanhamento no terreno, assumimos a responsabilidade pela execução.",
    hero_cta_hire: "Contratar Profissional",
    hero_cta_services: "Explorar Serviços",
    hero_cta_apply: "Submeter Candidatura",
    hero_badge_verified: "Profissionais Auditados",
    hero_badge_guarantee: "Garantia Operacional",
    hero_badge_coverage: "Maputo & Matola",

    // Landing Units Section
    units_section_kicker: "Ecossistema Integrado",
    units_section_title: "5 Unidades Operacionais para Todas as Suas Necessidades",
    units_section_subtitle: "Da manutenção técnica ao recrutamento de quadros executivos, oferecemos soluções estruturadas com supervisão direta.",
    units_cta_view_more: "Saber mais sobre esta unidade",

    // About Page
    about_hero_kicker: "Sobre a TARIRA",
    about_hero_title: "Conectando Talentos, Capacidades Técnicas e Empresas em Moçambique",
    about_hero_subtitle: "Nascida em Maputo, a TARIRA é uma organização moçambicana dedicada a eliminar a assimetria de confiança na contratação de serviços técnicos, recrutamento de quadros e gestão de força de trabalho.",
    about_tab_who: "Quem Somos",
    about_tab_mission: "Missão & Valores",
    about_tab_units: "As 5 Unidades",
    about_tab_leadership: "Liderança",
    about_tab_careers: "Carreiras",
    about_tab_contact: "Contacto",

    about_story_title: "A Nossa História e Propósito",
    about_story_p1: "Em Moçambique, encontrar profissionais técnicos de confiança ou recrutar quadros especializados sempre enfrentou o mesmo desafio: a incerteza quanto à autenticidade das qualificações, ao rigor ético e à assiduidade no terreno.",
    about_story_p2: "A TARIRA foi fundada para resolver esse problema através de um ecossistema integrado que combina processos rigorosos de validação presencial, auditoria de antecedentes, verificação documental e acompanhamento contínuo no terreno.",
    about_story_p3: "Hoje, operamos em Maputo e Matola através de 5 unidades de negócio especializadas, atendendo desde residências e condomínios até multinacionais, bancos e operadoras de telecomunicações.",

    about_mission_title: "Missão",
    about_mission_text: "Conectar pessoas e empresas em Moçambique a talentos qualificados e serviços técnicos de excelência, assegurando integridade, pontualidade e tranquilidade através de supervisão operacional permanente.",
    
    about_vision_title: "Visão",
    about_vision_text: "Ser o ecossistema corporativo de referência nacional e regional em Moçambique para alocação de capital humano, terceirização de processos operacionais e serviços técnicos especializados.",

    about_values_title: "Valores Fundamentais",
    about_value_1_title: "Confiança Auditada",
    about_value_1_desc: "Nenhum profissional é listado sem verificação física de identidade (BI/DIRE), atestado de antecedentes e teste prático de aptidão técnica.",
    about_value_2_title: "Excelência Operacional & SLAs",
    about_value_2_desc: "Comprometimento com prazos de resposta rigorosos, garantia contratual de reposição e monitorização ativa da qualidade dos serviços.",
    about_value_3_title: "Valorização da Mão-de-Obra Local",
    about_value_3_desc: "Fomento do emprego digno em Moçambique, capacitação técnica contínua e formalização do trabalho técnico e operacional.",
    about_value_4_title: "Segurança & Confidencialidade",
    about_value_4_desc: "Proteção estrita de dados cadastrais, sigilo profissional corporativo e conformidade com a legislação laboral moçambicana.",

    about_leadership_title: "Liderança Executiva",
    about_leadership_founder: "Vicente Dias",
    about_leadership_role: "CEO & Fundador",
    about_leadership_bio_1: "Com mais de 10 anos de experiência na coordenação de operações de backoffice, gestão de risco operacional e governança de processos em Moçambique, Vicente Dias lidera a visão estratégica e expansão da TARIRA.",
    about_leadership_bio_2: "A sua atuação em ambientes corporativos de alta exigência garantiu a implementação de padrões rigorosos de conformidade, KPIs e SLAs, garantindo que a TARIRA opere com precisão e transparência institucional.",
    about_quote: "A verdadeira inovação acontece quando a tecnologia encontra a realidade das pessoas. Na TARIRA, simplificamos o dia a dia e criamos oportunidades reais para Moçambique.",

    about_presence_title: "Presença & Cobertura",
    about_presence_location: "Maputo e Matola, Moçambique",
    about_presence_desc: "Sede operacional e atendimento presencial em Maputo, com cobertura técnica em todos os bairros de Maputo Cidade, Maputo Província e Matola.",
    about_stat_units: "5 Unidades",
    about_stat_units_label: "Connect, Recruit, Outsourcing, Consulting e Studio",
    about_stat_support: "24/7",
    about_stat_support_label: "Supervisão e suporte operacional de emergência",
    about_stat_coverage: "Maputo & Matola",
    about_stat_coverage_label: "Cobertura residencial e corporativa integrada",

    // Careers / Talent Network
    careers_title: "Faça Parte da Comunidade Corporativa da TARIRA",
    careers_subtitle: "Mapeamos continuamente talentos moçambicanos de alto nível para futuras posições internas e alocações em clientes parceiros.",
    careers_status_open: "Candidaturas Espontâneas Abertas",
    careers_step1_title: "1. Submissão de CV e Identificação",
    careers_step1_desc: "Envie o seu currículo atualizado, contacto direto e cópia do BI ou documento de identificação.",
    careers_step2_title: "2. Triagem e Validação Presencial",
    careers_step2_desc: "A nossa equipa analisa a sua trajetória, valida referências profissionais e convoca para alinhamento.",
    careers_step3_title: "3. Homologação no Banco de Talentos",
    careers_step3_desc: "O seu perfil fica disponível com prioridade para contratações imediatas e projetos corporativos.",
    careers_btn_apply: "Submeter Candidatura Espontânea",

    // Contact
    contact_title: "Fale Connosco Directamente",
    contact_subtitle: "A nossa equipa está pronta para esclarecer dúvidas, agendar visitas técnicas ou estruturar propostas comerciais para a sua empresa.",
    contact_address_label: "Localização",
    contact_address_val: "Bairro Central / Sommerschield, Maputo, Moçambique",
    contact_phones_label: "Telefones & WhatsApp",
    contact_email_label: "Correio Eletrónico",
    contact_hours_label: "Horário de Funcionamento",
    contact_hours_val: "Segunda a Sexta: 08h00 - 18h00 • Sábado: 08h00 - 13h00 • Suporte de Emergência: 24/7",
    contact_form_title: "Envie-nos uma Mensagem",
    contact_name: "Nome Completo",
    contact_email: "Email Corporativo ou Pessoal",
    contact_phone: "Telefone / WhatsApp",
    contact_subject: "Assunto",
    contact_message: "Mensagem ou Detalhes da Solicitação",
    contact_submit: "Enviar Mensagem",
    contact_success: "A sua mensagem foi enviada com sucesso! A nossa equipa entrará em contacto brevemente.",

    // Footer
    footer_desc: "A plataforma moçambicana definitiva para contratação de técnicos de campo, recrutamento especializado e outsourcing. 5 unidades de negócio com supervisão operacional contínua em Maputo e Matola.",
    footer_quick_links: "Acessos Rápidos",
    footer_units: "Unidades TARIRA",
    footer_company: "Empresa & Suporte",
    footer_terms: "Termos & Privacidade",
    footer_rights: "Todos os direitos reservados.",
    footer_alliance: "TARIRA · Auditada & Confiável em Moçambique",
  },
  en: {
    // Nav & General
    welcome: "Welcome to TARIRA Portal",
    subtitle: "Integrated Outsourcing, Recruitment and Technical Services Solutions in Mozambique",
    select_language: "Select Language",
    nav_home: "Home",
    nav_about: "About Us",
    nav_solutions: "Solutions & Services",
    nav_all_solutions: "All Solutions",
    nav_services: "Services & Pricing",
    nav_technicians: "Field Technicians",
    nav_talents: "Talent & Executives",
    nav_jobs: "Jobs & Opportunities",
    nav_faqs: "Frequently Asked Questions",
    nav_spontaneous: "Open Application",
    nav_login: "Login / Access",
    nav_logout: "Sign Out",
    nav_quote: "Request a Quote",
    nav_my_dashboard: "My Dashboard",
    nav_admin_panel: "Admin Dashboard",
    nav_close: "Close",
    nav_menu: "Menu",

    // Units
    unit_connect: "TARIRA Connect",
    unit_connect_desc: "Field technicians, certified electricians, HVAC, plumbing and home services in Maputo and Matola.",
    unit_recruit: "TARIRA Recruit",
    unit_recruit_desc: "Executive search, specialized talent acquisition, in-person interviews and background screening.",
    unit_outsourcing: "TARIRA Outsourcing",
    unit_outsourcing_desc: "Comprehensive workforce management, flexible staffing and complete HR payroll administration.",
    unit_consulting: "TARIRA Consulting",
    unit_consulting_desc: "Organizational consulting, HR process auditing, operational diagnostics and labor compliance.",
    unit_studio: "TARIRA Studio",
    unit_studio_desc: "Digital platform engineering, modular architecture and tailored enterprise software solutions.",

    // Landing Hero & Core
    hero_kicker: "Integrated Services & Human Capital Platform",
    hero_title_1: "We oversee so you",
    hero_title_2: "don't have to.",
    hero_subtitle: "Connecting companies and households in Mozambique with accredited field technicians and vetted professionals. From document auditing to on-site monitoring, we take full responsibility for execution.",
    hero_cta_hire: "Hire Professional",
    hero_cta_services: "Explore Services",
    hero_cta_apply: "Submit Application",
    hero_badge_verified: "Audited Professionals",
    hero_badge_guarantee: "Operational Guarantee",
    hero_badge_coverage: "Maputo & Matola",

    // Landing Units Section
    units_section_kicker: "Integrated Ecosystem",
    units_section_title: "5 Operational Units for All Your Business Needs",
    units_section_subtitle: "From field maintenance to executive headhunting, we deliver structured solutions backed by direct supervision.",
    units_cta_view_more: "Learn more about this unit",

    // About Page
    about_hero_kicker: "About TARIRA",
    about_hero_title: "Connecting Talent, Technical Capabilities, and Companies in Mozambique",
    about_hero_subtitle: "Founded in Maputo, TARIRA is a Mozambican enterprise dedicated to eliminating trust asymmetry in technical services, executive recruitment, and workforce management.",
    about_tab_who: "Who We Are",
    about_tab_mission: "Mission & Values",
    about_tab_units: "The 5 Units",
    about_tab_leadership: "Leadership",
    about_tab_careers: "Careers",
    about_tab_contact: "Contact",

    about_story_title: "Our Story & Purpose",
    about_story_p1: "In Mozambique, finding reliable technical professionals or recruiting specialized staff has always faced a common hurdle: uncertainty regarding genuine qualifications, ethical standards, and on-site punctuality.",
    about_story_p2: "TARIRA was founded to solve this problem through an integrated ecosystem combining rigorous in-person validation, criminal background checks, document auditing, and active on-site supervision.",
    about_story_p3: "Today, we operate in Maputo and Matola across 5 specialized business units, serving households, residential condominiums, international enterprises, banks, and telecommunication providers.",

    about_mission_title: "Mission",
    about_mission_text: "To connect households and enterprises in Mozambique with vetted talent and technical excellence, delivering integrity, reliability, and peace of mind through continuous operational oversight.",
    
    about_vision_title: "Vision",
    about_vision_text: "To be the benchmark national and regional corporate ecosystem in Mozambique for human capital allocation, business process outsourcing, and specialized technical services.",

    about_values_title: "Core Values",
    about_value_1_title: "Audited Trust",
    about_value_1_desc: "No professional is approved without physical identity verification (BI/DIRE), criminal record checks, and practical technical skill testing.",
    about_value_2_title: "Operational Excellence & SLAs",
    about_value_2_desc: "Commitment to strict response times, contractual replacement guarantees, and active service quality monitoring.",
    about_value_3_title: "Commitment to Local Development",
    about_value_3_desc: "Promoting dignified employment in Mozambique, continuous technical training, and formalization of operational workers.",
    about_value_4_title: "Security & Confidentiality",
    about_value_4_desc: "Strict personal data protection, corporate non-disclosure standards, and compliance with Mozambican labor laws.",

    about_leadership_title: "Executive Leadership",
    about_leadership_founder: "Vicente Dias",
    about_leadership_role: "CEO & Founder",
    about_leadership_bio_1: "With over 10 years of experience coordinating back-office operations, operational risk management, and process governance in Mozambique, Vicente Dias drives TARIRA's strategic vision and expansion.",
    about_leadership_bio_2: "His background across high-demand corporate environments established strict standards for compliance, KPIs, and SLAs, ensuring TARIRA operates with precision and institutional transparency.",
    about_quote: "True innovation happens when technology meets real people's everyday lives. At TARIRA, we simplify daily operations and create tangible opportunities for Mozambique.",

    about_presence_title: "Presence & Geographic Reach",
    about_presence_location: "Maputo & Matola, Mozambique",
    about_presence_desc: "Operational headquarters in Maputo, delivering accredited technical coverage across all neighborhoods of Maputo City, Maputo Province, and Matola.",
    about_stat_units: "5 Units",
    about_stat_units_label: "Connect, Recruit, Outsourcing, Consulting and Studio",
    about_stat_support: "24/7",
    about_stat_support_label: "Continuous supervision and emergency response",
    about_stat_coverage: "Maputo & Matola",
    about_stat_coverage_label: "Integrated residential and corporate coverage",

    // Careers / Talent Network
    careers_title: "Join the TARIRA Corporate Talent Network",
    careers_subtitle: "We continuously map top-tier Mozambican talent for future internal roles and client corporate allocations.",
    careers_status_open: "Open Applications Active",
    careers_step1_title: "1. Submit CV & Identification",
    careers_step1_desc: "Submit your updated CV, direct contact information, and copy of your national identity card (BI/DIRE).",
    careers_step2_title: "2. Screening & In-Person Validation",
    careers_step2_desc: "Our recruitment team evaluates your background, verifies professional references, and schedules an interview.",
    careers_step3_title: "3. Accreditation in the Talent Pool",
    careers_step3_desc: "Your profile is indexed with top priority for immediate openings and specialized corporate projects.",
    careers_btn_apply: "Submit Open Application",

    // Contact
    contact_title: "Get in Touch With Us",
    contact_subtitle: "Our team is ready to answer questions, schedule on-site technical visits, or prepare commercial proposals for your company.",
    contact_address_label: "Address",
    contact_address_val: "Central / Sommerschield District, Maputo, Mozambique",
    contact_phones_label: "Phones & WhatsApp",
    contact_email_label: "Email Address",
    contact_hours_label: "Working Hours",
    contact_hours_val: "Monday to Friday: 08:00 - 18:00 • Saturday: 08:00 - 13:00 • Emergency Support: 24/7",
    contact_form_title: "Send Us a Message",
    contact_name: "Full Name",
    contact_email: "Corporate or Personal Email",
    contact_phone: "Phone / WhatsApp",
    contact_subject: "Subject",
    contact_message: "Message or Service Details",
    contact_submit: "Send Message",
    contact_success: "Your message has been sent successfully! Our team will reach out to you shortly.",

    // Footer
    footer_desc: "The definitive Mozambican platform for field technicians, specialized recruitment and outsourcing. 5 business units with continuous operational supervision across Maputo and Matola.",
    footer_quick_links: "Quick Links",
    footer_units: "TARIRA Units",
    footer_company: "Company & Support",
    footer_terms: "Terms & Privacy",
    footer_rights: "All rights reserved.",
    footer_alliance: "TARIRA · Audited & Trusted in Mozambique",
  },
};

/**
 * Helper function to retrieve translated text with automatic fallback
 */
export function t(key: string, lang: Lang = "pt"): string {
  const selectedLang = lang === "en" ? "en" : "pt";
  const str = translations[selectedLang]?.[key];
  if (str) return str;
  // Fallback to Portuguese
  const fallbackStr = translations.pt?.[key];
  if (fallbackStr) return fallbackStr;
  return key;
}
