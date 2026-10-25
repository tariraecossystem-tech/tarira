import React, { useEffect } from 'react';
import { useBodyScrollLock } from '../../services/useBodyScrollLock';
import { AuthPage } from './AuthPage';
import { UserProfile } from '../../services/supabase';

export interface SupabaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot' | 'reset-password';
  initialRole?: 'empresa' | 'lar' | 'condominio' | 'prestador' | 'profissional' | 'admin';
  guestGateReason?: string | null;
  onUserChange?: (user: any, profile: UserProfile | null, linkedRecord?: any) => void;
  onNavigate?: (tab: string) => void;
}

export const SupabaseAuthModal: React.FC<SupabaseAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  initialRole = 'lar',
  guestGateReason = null,
  onUserChange,
  onNavigate
}) => {
  useBodyScrollLock(isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <AuthPage
          initialMode={initialMode}
          initialRole={initialRole}
          guestGateReason={guestGateReason}
          onUserChange={(user, profile, linkedRecord) => {
            if (onUserChange) onUserChange(user, profile, linkedRecord);
            onClose();
          }}
          onClose={onClose}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
};

export default SupabaseAuthModal;
