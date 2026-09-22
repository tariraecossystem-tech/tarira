import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Lock } from 'lucide-react';

export interface TariraLegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: 'pt' | 'en';
}

export const TariraLegalModal: React.FC<TariraLegalModalProps> = ({
  isOpen,
  onClose,
  currentLang
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl text-slate-900 animate-scale-up text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-[#172554] flex items-center justify-center font-bold text-xl">
              <ShieldCheck className="w-6 h-6 text-[#172554]" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-blue-600 uppercase block">
                Conformidade Legal & Privacidade
              </span>
              <h2 className="text-xl font-serif font-bold text-[#172554]">
                Termos de Uso & Política de Proteção de Dados
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
            <h4 className="font-bold text-[#172554] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#172554]" />
              Compromisso de Transparência e Segurança em Moçambique
            </h4>
            <p>
              A <strong>Tarira</strong> opera como plataforma integrada de prestação de serviços, recrutamento (Recruit), gestão operacional de ofícios (Connect), terceirização laboral (Outsourcing/RPO), consultoria e tecnologia, assegurando o cumprimento integral da <strong>Lei do Trabalho de Moçambique (Lei n.º 13/2023)</strong> e as melhores práticas internacionais de proteção de dados pessoais e privacidade de candidatos e empresas.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#172554] flex items-center gap-1.5">
              <span>1. Gratuidade Absoluta para os Candidatos</span>
            </h3>
            <p>
              Em conformidade com as normas internacionais de recrutamento ético (OIT), a Tarira <strong>nunca cobra nenhuma taxa ou percentagem sobre o salário</strong> de qualquer candidato, estagiário ou técnico de ofício pela sua inscrição, triagem ou colocação profissional.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#172554] flex items-center gap-1.5">
              <span>2. Uso de Foto/Imagem e Perfil Profissional Público (Consentimento Obrigatório)</span>
            </h3>
            <p>
              Ao registar-se ou criar conta na Tarira, o utilizador (profissional especializado, quadro corporativo ou técnico de ofício) <strong>autoriza de forma expressa, informada e inequívoca o uso e publicação da sua fotografia de perfil, nome profissional, especialidades, portfólio e histórico de qualificações na plataforma Tarira</strong>.
            </p>
            <p className="bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-xl font-medium">
              ℹ️ <strong>Visibilidade Pública:</strong> Os perfis profissionais ficam visíveis para recrutadores corporativos, diretores de empresas contratantes, condomínios e clientes do TARIRA Connect e TARIRA Recruit para efeitos de seleção, validação de aptidão técnica e adjudicação de serviços. Documentos confidenciais (número de BI/DIRE e certidões completas) mantêm-se protegidos em ambiente restrito.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#172554] flex items-center gap-1.5">
              <span>3. Tratamento e Proteção de Documentos de Identificação (BI / Passaporte)</span>
            </h3>
            <p>
              Os documentos de identificação submetidos para homologação técnica (como Bilhete de Identidade, DIRE, Passaporte ou certificados de formação) são mantidos em ambiente seguro com controlo de acessos estrito. As empresas contratantes só têm acesso aos dados estritamente necessários para efeitos de contratação após a homologação prévia da vaga.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#172554] flex items-center gap-1.5">
              <span>4. Deveres e Veracidade das Informações</span>
            </h3>
            <p>
              O candidato compromete-se a fornecer informações verdadeiras e atualizadas sobre o seu histórico profissional, diplomas e experiência. A constatação de falsidade em documentos ou perfis acarretará a suspensão e cancelamento imediato do registo na plataforma Tarira.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#172554] flex items-center gap-1.5">
              <span>5. Garantias e SLA para as Empresas Parceiras</span>
            </h3>
            <p>
              As requisições submetidas pelas empresas parceiras são geridas com sigilo comercial. A Tarira assegura a apresentação de perfis testados e oferece garantia de reposição durante o período probatório contratual.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#172554] flex items-center gap-1.5">
              <span>6. Canal Oficial de Contacto e Encarregado de Conformidade</span>
            </h3>
            <p>
              Para qualquer pedido de retificação, remoção do perfil ou esclarecimento relativo aos seus dados pessoais, o utilizador pode contactar diretamente a nossa equipa através de <strong>tarira.ecossistema@gmail.com</strong> ou do telefone oficial <strong>+258 87 142 5316</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#172554] hover:bg-[#1e3a8a] text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Compreendido e Aceitar
          </button>
        </div>
      </div>
    </div>
  );
};
