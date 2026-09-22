import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ShieldCheck, Building2, UserCheck, Zap } from "lucide-react";

/**
 * Modal de "Acesso restrito" mostrado ao clicar em Perfil / Portfólio / Recrutar (ou Requisitar)
 * quando o utilizador não tem permissão. Mostra a nota de permissões e o atalho directo
 * para criar conta (Empresa).
 *
 * É renderizado num portal (document.body) para ficar SEMPRE centrado no ecrã,
 * independentemente de animações/transform nos contentores da página.
 */

export type AccessRestrictedVariant = "guest" | "lar" | "prestador";
export type AccessRestrictedAction = "perfil" | "portfolio" | "recrutar" | "requisitar";

interface AccessRestrictedModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: AccessRestrictedVariant;
  action: AccessRestrictedAction;
  candidate?: {
    name?: string;
    surname?: string;
    title?: string;
    subCategory?: string;
    photo?: string;
    city?: string;
  } | null;
  /** Nota principal (ex.: "Acesso apenas para Empresas ou Condomínios.") */
  message: string;
  /** Explicação curta opcional por baixo da nota */
  description?: string;
  /** Abre o formulário de criação de conta Empresa */
  onCreateCompany?: () => void;
  /** Abre o início de sessão */
  onLogin?: () => void;
  /** Vai para o perfil do próprio técnico/prestador */
  onGoMyProfile?: () => void;
  /** Vai para a página de Técnicos de Campo (perfil Lar) */
  onSeeConnect?: () => void;
}

const ACTION_LABEL: Record<AccessRestrictedAction, string> = {
  perfil: "Perfil",
  portfolio: "Portfólio",
  recrutar: "Recrutar",
  requisitar: "Requisitar",
};

export const AccessRestrictedModal: React.FC<AccessRestrictedModalProps> = ({
  isOpen,
  onClose,
  variant,
  action,
  candidate,
  message,
  description,
  onCreateCompany,
  onLogin,
  onGoMyProfile,
  onSeeConnect,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  const fullName = `${candidate?.name || ""} ${candidate?.surname || ""}`.trim();

  const primaryBtn =
    "w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#172554] hover:bg-[#1A3478] text-white text-xs font-bold uppercase tracking-wider transition-all border border-[#172554] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95";
  const secondaryBtn =
    "w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#172554] text-xs font-bold border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95";

  return createPortal(
    <div
      className="fixed inset-0 z-[200] bg-black/65 backdrop-blur-sm overflow-y-auto p-3 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Acesso restrito"
    >
      <div className="min-h-full flex items-center justify-center py-10 pointer-events-none">
        <div
          data-modal-scroll
          className="pointer-events-auto relative bg-white text-[#172554] border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl text-left"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-[#172554]" />
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-0.5">
              {ACTION_LABEL[action]}
            </span>
            <h3 className="text-lg sm:text-xl font-serif font-bold leading-snug">{message}</h3>
            {description && (
              <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
            )}
          </div>

          {candidate && fullName && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-[#172554] font-bold">
                {candidate.photo ? (
                  <img
                    src={candidate.photo}
                    alt={fullName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{(candidate.name || "?")[0]}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{fullName}</p>
                <p className="text-[11px] text-slate-500 truncate">
                  {candidate.title || candidate.subCategory || ""}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
            <button type="button" onClick={onClose} className={secondaryBtn}>
              Voltar
            </button>

            {variant === "prestador" && onGoMyProfile && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoMyProfile();
                }}
                className={primaryBtn}
              >
                <UserCheck className="w-4 h-4" />
                <span>Ir para o Meu Perfil</span>
              </button>
            )}

            {variant === "lar" && onSeeConnect && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSeeConnect();
                }}
                className={secondaryBtn}
              >
                <Zap className="w-4 h-4" />
                <span>Ver Técnicos de Campo</span>
              </button>
            )}

            {variant === "guest" && onLogin && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogin();
                }}
                className={secondaryBtn}
              >
                Já tenho conta
              </button>
            )}

            {variant !== "prestador" && onCreateCompany && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCreateCompany();
                }}
                className={primaryBtn}
              >
                <Building2 className="w-4 h-4" />
                <span>Criar Conta Empresa</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AccessRestrictedModal;
