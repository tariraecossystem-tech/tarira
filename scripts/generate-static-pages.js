import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const PAGES = [
  {
    path: "about",
    title: "Sobre Nós – Missão, Visão e Supervisão Rigorosa | Tarira Moçambique",
    description: "Conheça a Tarira: o ecossistema integrado que supervisiona a execução de serviços técnicos, recrutamento corporativo e terceirização em Moçambique.",
    ogTitle: "Sobre a Tarira – Excelência Operacional e Supervisão em Moçambique",
    ogDescription: "Supervisionamos para que não precise. Conheça a nossa história, padrões de verificação de antecedentes e missão em Moçambique.",
    schemaType: "AboutPage",
    schemaContent: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": "https://tarira.vercel.app/about#webpage",
      "url": "https://tarira.vercel.app/about",
      "name": "Sobre Nós – Tarira Moçambique",
      "description": "Ecossistema integrado de talentos, terceirização e serviços técnicos supervisionados em Moçambique.",
      "publisher": {
        "@type": "Organization",
        "name": "Tarira",
        "url": "https://tarira.vercel.app/",
        "logo": "https://tarira.vercel.app/og-image.png"
      }
    },
    bodyHtml: `
      <header class="mb-8">
        <span class="text-xs uppercase tracking-widest text-blue-600 font-bold block mb-1">Institucional &middot; Tarira Moçambique</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">Sobre a TARIRA – Missão, Visão e Supervisão em Moçambique</h1>
        <p class="text-base text-slate-700 mt-3 leading-relaxed">
          Supervisionamos para que não precise. A Tarira nasceu da constatação direta dos desafios diários enfrentados por famílias e empresas em Moçambique: falta de garantias, orçamentos imprevisíveis, atrasos e informalidade na prestação de serviços essenciais.
        </p>
      </header>

      <div class="space-y-6">
        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">A Nossa Missão</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Estabelecer um novo padrão de confiança e excelência na contratação de serviços técnicos, terceirização de mão de obra e recrutamento corporativo em Moçambique, assumindo a supervisão integral da qualidade, prazos e integridade em cada intervenção.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">O Modelo de Supervisão Tarira: Fim do Risco para o Cliente</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Diferente de portais de classificados onde o cliente lida diretamente com desconhecidos sem qualquer garantia, na Tarira todos os prestadores passam por verificação prévia de identidade (B.I./DIRE), certidão de registo criminal e teste prático de ofício. Além disso, os pagamentos contam com custódia até à conclusão satisfatória e garantia de reexecução gratuita em caso de inconformidade.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">As 5 Unidades Especializadas</h2>
          <ul class="text-sm text-slate-600 mt-3 space-y-2.5 list-disc list-inside">
            <li><strong class="text-slate-800">Tarira Connect:</strong> Assistência técnica residencial e predial com intervenção rápida (canalização, climatização AC, eletricidade, pintura e alvenaria).</li>
            <li><strong class="text-slate-800">Tarira Recruit:</strong> Recrutamento corporativo RPO e caça de talentos com apresentação de candidatos qualificados em 24 a 48 horas úteis.</li>
            <li><strong class="text-slate-800">Tarira Outsourcing:</strong> Gestão de mão de obra temporária e contínua, processamento de folhas salariais (payroll), conformidade com o INSS e legislação laboral moçambicana.</li>
            <li><strong class="text-slate-800">Tarira Consulting:</strong> Diagnóstico de processos operacionais, reestruturação organizacional e estratégias de eficiência de custos corporativos.</li>
            <li><strong class="text-slate-800">Tarira Studio:</strong> Engenharia de plataformas digitais, desenvolvimento de aplicações web/mobile sob medida e integração com carteiras móveis nacionais.</li>
          </ul>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">Cobertura Operacional e Presença Regional</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            As equipas de campo atuam com resposta imediata na Cidade de Maputo, Província de Maputo e Matola. Para processos corporativos de recrutamento, terceirização e consultoria, a Tarira possui capacidade de atendimento em todo o território de Moçambique.
          </p>
        </article>
      </div>
    `
  },
  {
    path: "faqs",
    title: "Perguntas Frequentes (FAQs) & Central de Ajuda | Tarira Moçambique",
    description: "Respostas às dúvidas mais frequentes sobre contratação de serviços técnicos, recrutamento de talentos, pagamentos via M-Pesa/e-Mola e garantias na Tarira Moçambique.",
    ogTitle: "Perguntas Frequentes (FAQs) | Central de Ajuda Tarira",
    ogDescription: "Tire as suas dúvidas sobre garantias de serviços, pagamentos móveis, triagem de profissionais e prazos no ecossistema Tarira.",
    schemaType: "FAQPage",
    schemaContent: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://tarira.vercel.app/faqs#webpage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Como funciona a garantia dos serviços prestados pela Tarira?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Todos os serviços contratados através da Tarira Connect contam com supervisão direta e garantia de reexecução. Se o serviço técnico apresentar qualquer defeito dentro do período de garantia, enviamos um técnico supervisor e refazemos o trabalho sem custos adicionais."
          }
        },
        {
          "@type": "Question",
          "name": "Quais são as formas de pagamento aceites em Moçambique?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Aceitamos pagamentos instantâneos via M-Pesa e e-Mola, além de transferência bancária para contas corporativas (BIM, BCI, Standard Bank, Moza Banco). Todas as transações geram fatura-recibo com NUIT."
          }
        },
        {
          "@type": "Question",
          "name": "Qual o prazo para envio de candidatos no Tarira Recruit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Para quadros operacionais e técnicos, apresentamos uma lista qualificada e verificada de candidatos no prazo ágil de 24 a 48 horas úteis."
          }
        },
        {
          "@type": "Question",
          "name": "Como é feita a verificação de antecedentes dos profissionais?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cada profissional passa por verificação de documento de identidade civil (B.I., DIRE ou Passaporte), consulta de certidão de registo criminal, validação de referências anteriores e prova prática da especialidade."
          }
        }
      ]
    },
    bodyHtml: `
      <header class="mb-8">
        <span class="text-xs uppercase tracking-widest text-blue-600 font-bold block mb-1">Central de Ajuda &middot; Tarira Moçambique</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">Perguntas Frequentes (FAQs) e Suporte Operacional</h1>
        <p class="text-base text-slate-700 mt-3 leading-relaxed">
          Respostas transparentes sobre contratação de técnicos de campo, recrutamento de pessoal, pagamentos móveis, faturação com NUIT e garantias operacionais.
        </p>
      </header>

      <div class="space-y-4">
        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">1. Como funciona a garantia de reexecução dos serviços técnicos?</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Caso qualquer intervenção executada por técnicos da Tarira Connect apresente anomalias técnicas ou não atenda ao orçamento acordado dentro do período estipulado, a nossa equipa de supervisão mobiliza imediatamente a reexecução do serviço sem qualquer custo suplementar.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">2. Quais são as opções de pagamento disponíveis em Moçambique?</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Disponibilizamos integração com as principais carteiras móveis nacionais (M-Pesa e e-Mola) com confirmação imediata, além de transferência eletrónica para as nossas contas empresariais (Millennium BIM, BCI, Standard Bank, Moza Banco). Emitimos fatura/recibo com NUIT para efeitos de dedução fiscal.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">3. Em quanto tempo recebo candidatos através do Tarira Recruit?</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            O nosso compromisso para quadros técnicos, operacionais e de gestão intermédia é apresentar os primeiros perfis devidamente triados, entrevistados e com antecedentes confirmados entre 24 a 48 horas úteis após a aprovação da descrição da vaga.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">4. Como é assegurada a idoneidade dos prestadores de serviços?</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            O nosso protocolo de credenciamento exige a validação documental de identificação civil oficial, certidão de registo criminal sem antecedentes desabonadores, contacto direto com antigos contratantes e testes práticos de bancada ou oficina antes da primeira alocação a clientes.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">5. Como posso solicitar uma proposta de outsourcing ou consultoria corporativa?</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Pode utilizar os simuladores online nas abas de Outsourcing e Recruit ou falar diretamente com a nossa equipa comercial via WhatsApp ou formulário de contacto. Elaboramos propostas detalhadas com cronogramas e custos em menos de 24 horas.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">6. Sou técnico de ofício ou profissional qualificado. Como posso candidatar-me?</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Pode aceder à aba Vagas no menu superior ou submeter a sua candidatura espontânea no formulário de registo de talentos. A nossa equipa de recursos humanos avaliará os seus documentos e agendará a sua triagem presencial ou remota.
          </p>
        </article>
      </div>
    `
  },
  {
    path: "vagas",
    title: "Vagas e Oportunidades de Emprego em Moçambique | Tarira Recruit",
    description: "Explore vagas de emprego abertas e oportunidades de carreira em Moçambique. Candidaturas para técnicos de campo, especialistas operacionais e cargos corporativos na Tarira.",
    ogTitle: "Vagas de Emprego e Oportunidades de Carreira | Tarira Recruit",
    ogDescription: "Consulte vagas ativas em Moçambique: técnicos de climatização, eletricistas, canalizadores, gestores e especialistas corporativos.",
    schemaType: "CollectionPage",
    schemaContent: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": "https://tarira.vercel.app/vagas#webpage",
      "name": "Portal de Vagas de Emprego Tarira Recruit",
      "description": "Vagas ativas e oportunidades de trabalho em Moçambique para prestadores técnicos e quadros profissionais.",
      "url": "https://tarira.vercel.app/vagas"
    },
    bodyHtml: `
      <header class="mb-8">
        <span class="text-xs uppercase tracking-widest text-blue-600 font-bold block mb-1">Carreiras &middot; Tarira Recruit</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">Vagas de Emprego e Oportunidades Profissionais em Moçambique</h1>
        <p class="text-base text-slate-700 mt-3 leading-relaxed">
          Faça parte da rede de profissionais mais respeitada e supervisionada do país. Oferecemos oportunidades em regime flexível, contratos temporários e posições permanentes com remuneração pontual e suporte operacional.
        </p>
      </header>

      <div class="space-y-4">
        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <div class="flex flex-wrap justify-between items-center gap-2 mb-2">
            <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">Técnicos de Campo &middot; Tarira Connect</span>
            <span class="text-xs font-medium text-slate-500">Maputo e Matola &middot; Flexível / Tempo Inteiro</span>
          </div>
          <h2 class="text-xl font-bold text-[#172554]">Técnicos de Climatização (AC) & Refrigeração Comercial</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Responsável pela instalação, diagnóstico de avarias, recarga de gás e manutenção preventiva de sistemas split e centrais. Requisitos: experiência comprovada superior a 2 anos, conhecimento prático de esquemas elétricos e pontualidade.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <div class="flex flex-wrap justify-between items-center gap-2 mb-2">
            <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">Técnicos de Campo &middot; Tarira Connect</span>
            <span class="text-xs font-medium text-slate-500">Maputo Cidade &middot; Turnos de Emergência</span>
          </div>
          <h2 class="text-xl font-bold text-[#172554]">Eletricistas Prediais e Industriais Credenciados</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Montagem e manutenção de quadros elétricos de distribuição, cablagem, comutadores automáticos para geradores e solução de curtos-circuitos. Requisitos: certificado de qualificação profissional e rigor com normas de segurança.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <div class="flex flex-wrap justify-between items-center gap-2 mb-2">
            <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-teal-100 text-teal-800">Técnicos de Campo &middot; Tarira Connect</span>
            <span class="text-xs font-medium text-slate-500">Maputo e Matola &middot; Imediato</span>
          </div>
          <h2 class="text-xl font-bold text-[#172554]">Canalizadores e Picheleiros de Intervenção Rápida</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Deteção de infiltrações não destrutivas, desentupimentos mecânicos, instalação de bombas pressurizadoras e reparação de termosifões solares e elétricos. Requisitos: ferramenta própria e histórico limpo.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <div class="flex flex-wrap justify-between items-center gap-2 mb-2">
            <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">Corporativo &middot; Tarira Outsourcing</span>
            <span class="text-xs font-medium text-slate-500">Maputo Província &middot; Contrato Fixo</span>
          </div>
          <h2 class="text-xl font-bold text-[#172554]">Supervisores de Campo – Higienização & Manutenção de Condomínios</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Gestão presencial de equipas terceirizadas de limpeza e manutenção predial, inspeção diária de qualidade, controlo de assiduidade e inventário de equipamentos. Requisitos: liderança de equipas e carta de condução.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <div class="flex flex-wrap justify-between items-center gap-2 mb-2">
            <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800">Digital &middot; Tarira Studio</span>
            <span class="text-xs font-medium text-slate-500">Maputo / Remoto &middot; Híbrido</span>
          </div>
          <h2 class="text-xl font-bold text-[#172554]">Engenheiros de Software Full-Stack (React / Node.js)</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Desenvolvimento de plataformas web e mobile, integração com APIs bancárias e serviços em nuvem. Requisitos: domínio de TypeScript, React, Tailwind CSS e princípios sólidos de segurança.
          </p>
        </article>
      </div>
    `
  },
  {
    path: "connect",
    title: "Tarira Connect – Técnicos de Campo e Serviços Domésticos | Tarira Moçambique",
    description: "Técnicos de campo verificados para canalização, eletricidade, climatização (AC), pintura, alvenaria e manutenção com supervisão e garantia em Maputo.",
    ogTitle: "Tarira Connect – Técnicos de Campo e Serviços Domésticos com Garantia",
    ogDescription: "Chame eletricistas, canalizadores, técnicos de AC e profissionais de manutenção predial supervisionados pela Tarira.",
    schemaType: "Service",
    schemaContent: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Tarira Connect",
      "description": "Assistência técnica rápida, manutenção domiciliar e serviços de ofício supervisionados em Moçambique.",
      "provider": {
        "@type": "Organization",
        "name": "Tarira",
        "url": "https://tarira.vercel.app/"
      },
      "areaServed": "Maputo, Matola, Moçambique"
    },
    bodyHtml: `
      <header class="mb-8">
        <span class="text-xs uppercase tracking-widest text-blue-600 font-bold block mb-1">Unidade de Negócio &middot; Tarira Connect</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">Tarira Connect – Técnicos de Campo e Assistência Técnica Supervisionada</h1>
        <p class="text-base text-slate-700 mt-3 leading-relaxed">
          Assistência técnica rápida, pontual e supervisionada para habitações particulares, escritórios empresariais e condomínios em Maputo e Matola. Cada intervenção tem garantia de qualidade comprovada.
        </p>
      </header>

      <div class="grid sm:grid-cols-2 gap-4">
        <article class="p-5 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">Canalização & Pichelaria</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">Deteção e reparação de fugas visíveis e ocultas, substituição de tubagens, desentupimentos de esgotos, montagem de bombas de água e reparação de termosifões.</p>
        </article>

        <article class="p-5 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">Eletricidade Predial e Residencial</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">Instalação de quadros elétricos de disjuntores, ligação de geradores de socorro, passagem de fiação, iluminação LED de baixo consumo e diagnóstico de curtos-circuitos.</p>
        </article>

        <article class="p-5 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">Climatização & Refrigeração (AC)</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">Manutenção preventiva higiénica de aparelhos split, desinfeção de filtros e serpentinas, recarga com gás refrigerante ecológico e instalação de novos equipamentos.</p>
        </article>

        <article class="p-5 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">Pintura & Remodelações de Alvenaria</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">Pintura profissional interior e exterior com preparação de paredes, reparação de fissuras e salitre, impermeabilização de terraços e pequenos acabamentos de construção civil.</p>
        </article>

        <article class="p-5 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">Limpeza e Higienização Técnica</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">Limpezas pós-obra profundas, higienização profissional de estofos, carpetes e colchões com extração a vapor e manutenção periódica para escritórios corporativos.</p>
        </article>

        <article class="p-5 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">Carpintaria & Serralharia</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">Instalação e reparação de fechaduras de segurança, dobradiças, portas de madeira maciça, portões metálicos e montagem especializada de mobiliário modular.</p>
        </article>
      </div>
    `
  },
  {
    path: "recruit",
    title: "Tarira Recruit – Recrutamento Corporativo de Talentos em 24–48h | Tarira Moçambique",
    description: "Recrutamento corporativo RPO em Moçambique. Apresentação de candidatos qualificados e verificados para empresas em 24 a 48 horas.",
    ogTitle: "Tarira Recruit – Recrutamento de Talentos em 24–48h em Moçambique",
    ogDescription: "Soluções de recrutamento ágil e caça de talentos especializados para empresas em Moçambique com garantia de reposição.",
    schemaType: "Service",
    schemaContent: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Tarira Recruit",
      "description": "Recrutamento e seleção corporativa RPO com validação técnica em Moçambique.",
      "provider": {
        "@type": "Organization",
        "name": "Tarira",
        "url": "https://tarira.vercel.app/"
      }
    },
    bodyHtml: `
      <header class="mb-8">
        <span class="text-xs uppercase tracking-widest text-blue-600 font-bold block mb-1">Unidade de Negócio &middot; Tarira Recruit</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">Tarira Recruit – Recrutamento Corporativo e Caça de Talentos</h1>
        <p class="text-base text-slate-700 mt-3 leading-relaxed">
          Agilidade e rigor na atração e seleção de quadros técnicos, operacionais e de liderança para empresas em Moçambique. Entrega de listas pré-avaliadas em 24 a 48 horas.
        </p>
      </header>

      <div class="space-y-4">
        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">Triagem Rigorosa em 4 Níveis</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Eliminamos o desperdício de tempo dos departamentos de RH. Cada candidato encaminhado à sua empresa passa por conferência legal de identificação, registo criminal verificado, avaliação de perfil comportamental e entrevista técnica conduzida por especialistas seniores da área.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">Garantia de Reposição sem Custo</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Confiamos na precisão dos nossos diagnósticos. Se o colaborador selecionado não se adaptar à cultura ou exigências da sua organização durante o período de garantia (30 a 90 dias conforme o plano), a Tarira Recruit apresenta imediatamente um substituto sem cobrança de novos honorários.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">Áreas de Especialização em Moçambique</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Atuamos no recrutamento de perfis em finanças e contabilidade, engenharia e manutenção industrial, logística e gestão de armazéns, tecnologias de informação, vendas corporativas e quadros administrativos bilingues.
          </p>
        </article>
      </div>
    `
  },
  {
    path: "outsourcing",
    title: "Tarira Outsourcing – Terceirização RPO e Gestão de Pessoal | Tarira Moçambique",
    description: "Gestão completa de força de trabalho temporária e permanente, folha de pagamento, conformidade laboral em Moçambique e supervisão in-loco.",
    ogTitle: "Tarira Outsourcing – Gestão de Pessoal e Mão de Obra Terceirizada",
    ogDescription: "Reduza custos fixos e mitigue passivos laborais com a gestão de pessoal e outsourcing especializado da Tarira.",
    schemaType: "Service",
    schemaContent: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Tarira Outsourcing",
      "description": "Terceirização de força de trabalho e gestão de contratos em Moçambique.",
      "provider": {
        "@type": "Organization",
        "name": "Tarira",
        "url": "https://tarira.vercel.app/"
      }
    },
    bodyHtml: `
      <header class="mb-8">
        <span class="text-xs uppercase tracking-widest text-blue-600 font-bold block mb-1">Unidade de Negócio &middot; Tarira Outsourcing</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">Tarira Outsourcing – Terceirização e Gestão Integral de Força de Trabalho</h1>
        <p class="text-base text-slate-700 mt-3 leading-relaxed">
          Reduza passivos laborais e otimize a gestão operacional da sua empresa com soluções flexíveis de terceirização de pessoal permanente e temporário em Moçambique.
        </p>
      </header>

      <div class="space-y-4">
        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">Gestão Contratual e Processamento de Folha (Payroll)</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Assumimos a responsabilidade jurídica e administrativa dos vínculos de trabalho: cálculo e liquidação pontual de salários, retenção e entrega do IRPS, inscrição e pagamento rigoroso do INSS e seguro contra acidentes de trabalho, respeitando 100% da Lei do Trabalho de Moçambique.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">Supervisão Operacional no Posto de Trabalho</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Não nos limitamos a fornecer pessoal. Alocamos supervisores dedicados para controlo diário de assiduidade, apresentação de fardamento com EPIs adequados, cumprimento de protocolos de higiene e segurança e substituição ágil em casos de ausência.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">Flexibilidade para Projetos e Picos Sazonais</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Mobilize equipas completas para períodos de expansão, paragens técnicas de manutenção ou contratos temporários de curta e média duração, convertendo custos fixos em custos variáveis previsíveis.
          </p>
        </article>
      </div>
    `
  },
  {
    path: "consulting",
    title: "Tarira Consulting – Consultoria Empresarial e Estratégica | Tarira Moçambique",
    description: "Consultoria estratégica de gestão, reestruturação operacional, diagnósticos de processos e auditoria corporativa em Moçambique.",
    ogTitle: "Tarira Consulting – Estratégia e Reestruturação Operacional em Moçambique",
    ogDescription: "Acelere a maturidade e os resultados do seu negócio com diagnósticos práticos e reengenharia de processos corporativos.",
    schemaType: "Service",
    schemaContent: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Tarira Consulting",
      "description": "Consultoria estratégica de processos e operações em Moçambique.",
      "provider": {
        "@type": "Organization",
        "name": "Tarira",
        "url": "https://tarira.vercel.app/"
      }
    },
    bodyHtml: `
      <header class="mb-8">
        <span class="text-xs uppercase tracking-widest text-blue-600 font-bold block mb-1">Unidade de Negócio &middot; Tarira Consulting</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">Tarira Consulting – Consultoria Empresarial e Estratégia Operacional</h1>
        <p class="text-base text-slate-700 mt-3 leading-relaxed">
          Diagnósticos práticos, reengenharia de processos corporativos e apoio à tomada de decisão para empresas que operam ou investem em Moçambique.
        </p>
      </header>

      <div class="space-y-4">
        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">Diagnóstico Operacional e Otimização de Processos</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Identificamos estrangulamentos operacionais, desperdício de materiais e falhas de comunicação interna. Apresentamos planos de ação executáveis com métricas de desempenho claras e retorno mensurável.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">Auditoria e Conformidade de Recursos Humanos</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Análise aprofundada dos processos de contratação, tabelas salariais, cumprimento fiscal (INSS/IRPS) e alinhamento com a legislação moçambicana, prevenindo coimas e contingências judiciais.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">Reestruturação Organizacional e Gestão da Mudança</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Apoio a diretorias e conselhos de administração em processos de fusão, expansão regional para novas províncias ou readequação de quadros de liderança para maior eficiência.
          </p>
        </article>
      </div>
    `
  },
  {
    path: "studio",
    title: "Tarira Studio – Design de Produto e Engenharia de Software | Tarira Moçambique",
    description: "Desenvolvimento de software à medida, criação de plataformas web/mobile, design de interfaces e modernização tecnológica em Moçambique.",
    ogTitle: "Tarira Studio – Soluções Digitais e Engenharia de Software",
    ogDescription: "Construa produtos digitais de alta performance: aplicações web, móveis, integrações de pagamento e design de classe mundial.",
    schemaType: "Service",
    schemaContent: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Tarira Studio",
      "description": "Design de produto e desenvolvimento de software sob medida em Moçambique.",
      "provider": {
        "@type": "Organization",
        "name": "Tarira",
        "url": "https://tarira.vercel.app/"
      }
    },
    bodyHtml: `
      <header class="mb-8">
        <span class="text-xs uppercase tracking-widest text-blue-600 font-bold block mb-1">Unidade de Negócio &middot; Tarira Studio</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">Tarira Studio – Engenharia de Software e Design de Produto Digital</h1>
        <p class="text-base text-slate-700 mt-3 leading-relaxed">
          Conceção e desenvolvimento de ecossistemas digitais robustos, aplicações web/móveis de alto desempenho e plataformas escaláveis para o mercado africano e internacional.
        </p>
      </header>

      <div class="space-y-4">
        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">Aplicações Web e Mobile Escaláveis</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Desenvolvemos soluções completas com arquiteturas modernas (React, TypeScript, Node.js, Cloud APIs). Foco absoluto em performance rápida, segurança de dados e disponibilidade contínua.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">Integração com Carteiras Móveis e Meios de Pagamento</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Integração nativa com os meios de pagamento mais expressivos de Moçambique: M-Pesa (Vodacom), e-Mola (Movitel) e redes interbancárias SIMO Rede, garantindo liquidação instantânea e reconciliação financeira automatizada.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">Design UI/UX e Pesquisa com Utilizadores</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Criação de interfaces visuais intuitivas e elegantes, adaptadas à velocidade de ligação móvel e ao comportamento do utilizador moçambicano, com testes práticos de usabilidade.
          </p>
        </article>
      </div>
    `
  },
  {
    path: "services",
    title: "Catálogo Completo de Serviços e Ofícios Especializados | Tarira Moçambique",
    description: "Catálogo geral de serviços da Tarira em Moçambique: manutenção predial, canalização, eletricidade, climatização, limpeza, recrutamento e outsourcing.",
    ogTitle: "Catálogo Geral de Serviços Técnicos e Corporativos | Tarira",
    ogDescription: "Consulte todas as categorias de serviços supervisionados disponíveis em Maputo, Matola e Moçambique.",
    schemaType: "CollectionPage",
    schemaContent: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": "https://tarira.vercel.app/services#webpage",
      "name": "Catálogo Geral de Serviços Tarira Moçambique",
      "description": "Catálogo abrangente de soluções técnicas, residenciais, industriais e corporativas com supervisão contínua.",
      "url": "https://tarira.vercel.app/services"
    },
    bodyHtml: `
      <header class="mb-8">
        <span class="text-xs uppercase tracking-widest text-blue-600 font-bold block mb-1">Catálogo Oficial &middot; Tarira Moçambique</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">Catálogo Geral de Serviços Técnicos e Soluções Corporativas</h1>
        <p class="text-base text-slate-700 mt-3 leading-relaxed">
          Consulte o diretório completo de intervenções técnicas, manutenção preventiva e consultoria corporativa operadas com supervisão direta em Moçambique.
        </p>
      </header>

      <div class="space-y-6">
        <section class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554] mb-3">1. Manutenção Técnica Predial e Residencial</h2>
          <div class="grid sm:grid-cols-2 gap-3 text-sm text-slate-600">
            <div class="p-3 bg-white rounded-lg border border-slate-100">
              <strong class="text-slate-800 block">Canalização & Pichelaria:</strong>
              Reparação de fugas, desentupimentos, bombas de pressão e termosifões.
            </div>
            <div class="p-3 bg-white rounded-lg border border-slate-100">
              <strong class="text-slate-800 block">Eletricidade Predial:</strong>
              Quadros elétricos, sistemas de emergência, geradores e cablagem segura.
            </div>
            <div class="p-3 bg-white rounded-lg border border-slate-100">
              <strong class="text-slate-800 block">Climatização (AC):</strong>
              Instalação split, recarga de gás ecológico e manutenção preventiva.
            </div>
            <div class="p-3 bg-white rounded-lg border border-slate-100">
              <strong class="text-slate-800 block">Pintura & Alvenaria:</strong>
              Impermeabilização de tetos, pintura lavável, reparação de fissuras e acabamentos.
            </div>
          </div>
        </section>

        <section class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554] mb-3">2. Higienização, Limpeza e Desinfeção</h2>
          <div class="grid sm:grid-cols-2 gap-3 text-sm text-slate-600">
            <div class="p-3 bg-white rounded-lg border border-slate-100">
              <strong class="text-slate-800 block">Limpeza Pós-Obra:</strong>
              Remoção de resíduos de tinta, cimento, decapagem de pisos e vidros.
            </div>
            <div class="p-3 bg-white rounded-lg border border-slate-100">
              <strong class="text-slate-800 block">Higienização de Estofos & Colchões:</strong>
              Extração a quente com produtos biodegradáveis antialérgicos.
            </div>
            <div class="p-3 bg-white rounded-lg border border-slate-100">
              <strong class="text-slate-800 block">Controlo de Pragas (Desbaratização):</strong>
              Tratamento preventivo e corretivo para residências e armazéns.
            </div>
            <div class="p-3 bg-white rounded-lg border border-slate-100">
              <strong class="text-slate-800 block">Limpeza Periódica de Escritórios:</strong>
              Planos diários ou semanais com supervisão de qualidade in-loco.
            </div>
          </div>
        </section>

        <section class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554] mb-3">3. Recrutamento, Força de Trabalho & Consultoria</h2>
          <div class="grid sm:grid-cols-2 gap-3 text-sm text-slate-600">
            <div class="p-3 bg-white rounded-lg border border-slate-100">
              <strong class="text-slate-800 block">Recrutamento RPO em 24–48h:</strong>
              Apresentação de candidatos com antecedentes verificados e entrevista técnica.
            </div>
            <div class="p-3 bg-white rounded-lg border border-slate-100">
              <strong class="text-slate-800 block">Terceirização & Gestão de Pessoal:</strong>
              Processamento salarial, INSS, IRPS e supervisores no posto de trabalho.
            </div>
            <div class="p-3 bg-white rounded-lg border border-slate-100">
              <strong class="text-slate-800 block">Consultoria Estratégica de Processos:</strong>
              Auditorias operacionais, reestruturação e planos de eficiência de custos.
            </div>
            <div class="p-3 bg-white rounded-lg border border-slate-100">
              <strong class="text-slate-800 block">Engenharia de Software Sob Medida:</strong>
              Sistemas web e mobile com pagamentos locais (M-Pesa e e-Mola).
            </div>
          </div>
        </section>
      </div>
    `
  },
  {
    path: "profissionais",
    title: "Profissionais e Técnicos Verificados em Moçambique | Tarira",
    description: "Encontre e contrate profissionais e técnicos verificados com antecedentes criminais checados, avaliações reais e supervisão de qualidade Tarira.",
    ogTitle: "Diretório de Talentos e Profissionais Verificados | Tarira",
    ogDescription: "Banco de talentos e técnicos qualificados com histórico verificado em Moçambique.",
    schemaType: "CollectionPage",
    schemaContent: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": "https://tarira.vercel.app/profissionais#webpage",
      "name": "Diretório de Profissionais Verificados Tarira Moçambique",
      "description": "Talentos certificados e técnicos com registo criminal e testes práticos validados.",
      "url": "https://tarira.vercel.app/profissionais"
    },
    bodyHtml: `
      <header class="mb-8">
        <span class="text-xs uppercase tracking-widest text-blue-600 font-bold block mb-1">Talentos &middot; Tarira Moçambique</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">Diretório de Talentos e Técnicos de Ofício Verificados</h1>
        <p class="text-base text-slate-700 mt-3 leading-relaxed">
          Todos os profissionais registados na Tarira cumprem um estrito protocolo de credenciamento e auditoria antes da sua primeira intervenção em residências ou empresas.
        </p>
      </header>

      <div class="space-y-6">
        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">O Protocolo de Credenciamento em 5 Etapas</h2>
          <div class="grid sm:grid-cols-2 gap-4 mt-3 text-sm text-slate-600">
            <div class="p-3 bg-white rounded-lg border border-slate-100">
              <strong class="text-slate-800 block">1. Validação Civil:</strong>
              Conferência presencial de B.I., DIRE ou Passaporte com comprovativo de morada.
            </div>
            <div class="p-3 bg-white rounded-lg border border-slate-100">
              <strong class="text-slate-800 block">2. Registo Criminal:</strong>
              Apresentação de certidão recente emitida pelas autoridades policiais moçambicanas.
            </div>
            <div class="p-3 bg-white rounded-lg border border-slate-100">
              <strong class="text-slate-800 block">3. Avaliação Técnica Prática:</strong>
              Teste de bancada ou análise de trabalhos anteriores com verificação de ferramentas.
            </div>
            <div class="p-3 bg-white rounded-lg border border-slate-100">
              <strong class="text-slate-800 block">4. Checagem de Referências:</strong>
              Entrevistas com antigos empregadores e clientes corporativos atestando pontualidade.
            </div>
          </div>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-xl font-bold text-[#172554]">Categorias Disponíveis para Alocação Imediata</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Disponibilizamos técnicos de ar condicionado certificados, eletricistas prediais, canalizadores especializados, supervisores de condomínio, pintores de acabamento, gestores de stock e programadores de software experientes em Maputo e Matola.
          </p>
        </article>
      </div>
    `
  },
  {
    path: "terms",
    title: "Termos de Serviço, Privacidade e Conformidade Legal | Tarira Moçambique",
    description: "Termos e condições de utilização da plataforma Tarira, política de privacidade, regras de contratação, garantias operacionais e proteção de dados.",
    ogTitle: "Termos de Serviço e Conformidade Legal | Tarira Moçambique",
    ogDescription: "Consulte as condições legais, compromissos de garantia e direitos do consumidor no ecossistema Tarira.",
    schemaType: "ItemPage",
    schemaContent: {
      "@context": "https://schema.org",
      "@type": "ItemPage",
      "@id": "https://tarira.vercel.app/terms#webpage",
      "name": "Termos de Serviço e Conformidade Legal Tarira Moçambique",
      "description": "Condições gerais de prestação de serviços, proteção de dados e garantias contratuais.",
      "url": "https://tarira.vercel.app/terms"
    },
    bodyHtml: `
      <header class="mb-8">
        <span class="text-xs uppercase tracking-widest text-blue-600 font-bold block mb-1">Jurídico &middot; Tarira Moçambique</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">Termos de Serviço, Garantia Operacional e Conformidade Legal</h1>
        <p class="text-base text-slate-700 mt-3 leading-relaxed">
          Condições transparentes de utilização, compromissos de confidencialidade, padrões de supervisão e política de garantia vigentes na República de Moçambique.
        </p>
      </header>

      <div class="space-y-4">
        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">1. Objeto e Âmbito de Aplicação</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            A Tarira atua como coordenadora e supervisora direta de intervenções técnicas, recrutamento de talentos e terceirização de pessoal, garantindo que todos os serviços cumpram as especificações acordadas em orçamento formal.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">2. Política de Garantia e Reexecução de Serviços</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Qualquer inconformidade técnica reportada dentro do período de garantia estipulado será objeto de inspeção prioritária e, caso comprovado o vício na execução, o trabalho será corrigido sem qualquer encargo suplementar para o cliente.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">3. Pagamentos, Custódia e Emissão de Fatura com NUIT</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Os pagamentos são processados através de canais digitais seguros (M-Pesa, e-Mola ou transferência bancária). Todas as transações são acompanhadas da respetiva fatura/recibo com identificação fiscal (NUIT), nos termos da legislação tributária de Moçambique.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">4. Proteção de Dados e Confidencialidade</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            Os dados pessoais, residenciais e corporativos recolhidos são estritamente utilizados para a operacionalização dos serviços contratados, sendo proibida a sua alienação ou cedência a terceiros não autorizados.
          </p>
        </article>

        <article class="p-6 border border-slate-200 rounded-2xl bg-slate-50/70 shadow-sm">
          <h2 class="text-lg font-bold text-[#172554]">5. Jurisdição e Resolução de Litígios</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">
            As partes elegem o foro da Cidade de Maputo, República de Moçambique, para dirimir quaisquer questões decorrentes da interpretação ou aplicação dos presentes termos, com prévia tentativa obrigatória de conciliação amigável.
          </p>
        </article>
      </div>
    `
  }
];

function generateHtmlForPage(templateHtml, page) {
  const pageUrl = `https://tarira.vercel.app/${page.path}`;
  let html = templateHtml;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/is, `<title>${page.title}</title>`);

  // Replace Canonical Link
  html = html.replace(/<link rel="canonical" href=".*?" \/>/is, `<link rel="canonical" href="${pageUrl}" />`);

  // Replace Meta Description
  html = html.replace(/<meta name="description" content=".*?" \/>/is, `<meta name="description" content="${page.description}" />`);

  // Replace OG tags
  html = html.replace(/<meta property="og:title" content=".*?" \/>/is, `<meta property="og:title" content="${page.ogTitle || page.title}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/is, `<meta property="og:description" content="${page.ogDescription || page.description}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/is, `<meta property="og:url" content="${pageUrl}" />`);

  // Replace Twitter tags
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/is, `<meta name="twitter:title" content="${page.ogTitle || page.title}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/is, `<meta name="twitter:description" content="${page.ogDescription || page.description}" />`);

  // Replace Schema JSON-LD
  const schemaString = JSON.stringify(page.schemaContent, null, 2);
  html = html.replace(
    /<script type="application\/ld\+json">.*?<\/script>/is,
    `<script type="application/ld+json">\n${schemaString}\n    </script>`
  );

  // Replace Noscript for crawler fallback
  const pageNoscript = `
    <noscript>
      <div style="max-width: 56rem; margin: 2rem auto; padding: 1.5rem; font-family: sans-serif; background: #ffffff; color: #172554;">
        <h1 style="font-size: 2rem; color: #172554; font-weight: bold;">${page.title}</h1>
        <p style="color: #475569; font-size: 1.1rem; margin-top: 0.5rem;">${page.description}</p>
        <div style="margin-top: 1.5rem;">
          ${page.bodyHtml}
        </div>
      </div>
    </noscript>`;
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/is, pageNoscript);

  return html;
}

export function buildStaticPages() {
  const indexHtmlPath = path.join(rootDir, "index.html");
  if (!fs.existsSync(indexHtmlPath)) {
    console.error("[generate-static-pages] index.html não encontrado na raiz!");
    return;
  }

  const templateHtml = fs.readFileSync(indexHtmlPath, "utf-8");

  // 1. Gera ficheiros na pasta da raiz (ex.: /about/index.html, /faqs/index.html, /vagas/index.html)
  // Isso permite que o Vite no modo multi-página, servidores de desenvolvimento e Vercel encontrem
  // diretamente cada rota com o seu HTML individual!
  for (const page of PAGES) {
    const pageDir = path.join(rootDir, page.path);
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }
    const pageHtml = generateHtmlForPage(templateHtml, page);
    fs.writeFileSync(path.join(pageDir, "index.html"), pageHtml, "utf-8");
    console.log(`[generate-static-pages] Criado: /${page.path}/index.html`);
  }

  // 2. Se a pasta 'dist' existir (após o build do Vite), gera também dentro de dist/[rota]/index.html
  const distDir = path.join(rootDir, "dist");
  if (fs.existsSync(distDir)) {
    const distIndexHtml = path.join(distDir, "index.html");
    const distTemplate = fs.existsSync(distIndexHtml) ? fs.readFileSync(distIndexHtml, "utf-8") : templateHtml;

    for (const page of PAGES) {
      const pageDistDir = path.join(distDir, page.path);
      if (!fs.existsSync(pageDistDir)) {
        fs.mkdirSync(pageDistDir, { recursive: true });
      }
      const pageHtml = generateHtmlForPage(distTemplate, page);
      fs.writeFileSync(path.join(pageDistDir, "index.html"), pageHtml, "utf-8");
      console.log(`[generate-static-pages] Criado em dist: /dist/${page.path}/index.html`);
    }

    // Copia também o sitemap.xml e robots.txt para dist se estiverem em public/
    const sitemapSrc = path.join(rootDir, "public", "sitemap.xml");
    const sitemapDist = path.join(distDir, "sitemap.xml");
    if (fs.existsSync(sitemapSrc)) {
      fs.copyFileSync(sitemapSrc, sitemapDist);
      // Copia também para a raiz do repositório para garantir redundância no GitHub
      fs.copyFileSync(sitemapSrc, path.join(rootDir, "sitemap.xml"));
      console.log("[generate-static-pages] Sincronizado sitemap.xml em dist/ e na raiz");
    }

    const robotsSrc = path.join(rootDir, "public", "robots.txt");
    const robotsDist = path.join(distDir, "robots.txt");
    if (fs.existsSync(robotsSrc)) {
      fs.copyFileSync(robotsSrc, robotsDist);
      fs.copyFileSync(robotsSrc, path.join(rootDir, "robots.txt"));
      console.log("[generate-static-pages] Sincronizado robots.txt em dist/ e na raiz");
    }

    const ogSrc = path.join(rootDir, "public", "og-image.png");
    const ogDist = path.join(distDir, "og-image.png");
    if (fs.existsSync(ogSrc)) {
      fs.copyFileSync(ogSrc, ogDist);
      fs.copyFileSync(ogSrc, path.join(rootDir, "og-image.png"));
      console.log("[generate-static-pages] Sincronizado og-image.png em dist/ e na raiz");
    }
  }

  console.log(`[generate-static-pages] Concluído com sucesso: ${PAGES.length} páginas estáticas pré-renderizadas!`);
}

// Executa se chamado diretamente via node scripts/generate-static-pages.js
if (process.argv[1] && process.argv[1].endsWith("generate-static-pages.js")) {
  buildStaticPages();
}
