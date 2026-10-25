import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Building, 
  Building2, 
  Home, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  Zap, 
  KeyRound, 
  Camera, 
  Upload, 
  FileText, 
  FileCheck, 
  Award, 
  Briefcase, 
  Wrench, 
  Plus, 
  Check,
  HardHat,
  GraduationCap,
  LogIn,
  UserPlus,
  ArrowLeft,
  X,
  CreditCard,
  Smartphone,
  ChevronRight,
  Info
} from 'lucide-react';
import StepProgress from './StepProgress';
import { TariraLogo } from '../TariraLogo';
import { getSupabaseClient, isSupabaseConfigured, UserProfile } from '../../services/supabase';
import { setStoredSessionToken } from '../../services/authClient';
import {
  CATEGORIES_TAXONOMY,
  getCategoriesByRole,
  getSpecialtiesForCategory,
  findCategoryItem,
  resolveCanonicalCategoryId,
  resolveCandidateSpecialization,
  isGenericTitleOrPlaceholder
} from '../../data/categoriesData';
import { uploadImageToImgBB } from '../../services/imgbbUpload';
import {
  ACCOUNT_PLAN_ID,
  ACCOUNT_PLAN_NAME,
  HOME_PLAN_ID,
  HOME_PLAN_NAME,
  ACCOUNT_MAINTENANCE_FEE_MZN,
  ACCOUNT_TRIAL_DAYS,
  ACCOUNT_BILLING_NOTE,
  ACCOUNT_TRIAL_NOTE,
  isPaidAccountRole,
  formatMzn,
  resolveMaintenanceFee,
  resolveAccountBenefits,
  resolveHomeBenefits
} from '../../services/accountPlan';
import { TariraLegalModal } from '../../modals/TariraLegalModal';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup' | 'forgot' | 'reset-password';
  initialRole?: 'empresa' | 'lar' | 'condominio' | 'prestador' | 'profissional' | 'admin';
  lockRole?: 'empresa' | 'lar' | 'condominio' | 'prestador' | 'profissional' | 'admin';
  hideRoleSelector?: boolean;
  guestGateReason?: string | null;
  onUserChange?: (user: any, profile: UserProfile | null, linkedRecord?: any) => void;
  onClose?: () => void;
  onNavigate?: (tab: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'signin',
  initialRole = 'lar',
  lockRole,
  hideRoleSelector = false,
  guestGateReason = null,
  onUserChange,
  onClose,
  onNavigate
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'reset-password'>(initialMode);
  const [signupStep, setSignupStep] = useState<'role' | 'form' | 'payment'>('role');
  
  const [role, setRole] = useState<'empresa' | 'lar' | 'condominio' | 'prestador' | 'profissional'>(
    (lockRole as any) || (initialRole as any) || 'lar'
  );
  
  // Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [nuit, setNuit] = useState('');
  const [address, setAddress] = useState('');

  // Perfil específico
  const [companyName, setCompanyName] = useState('');
  const [companySector, setCompanySector] = useState('');
  const [companyEmployees, setCompanyEmployees] = useState('');
  const [contactPersonTitle, setContactPersonTitle] = useState('');
  const [condoName, setCondoName] = useState('');
  const [condoUnits, setCondoUnits] = useState<number | ''>('');
  const [condoType, setCondoType] = useState('');
  const [residentialType, setResidentialType] = useState('');

  // Prestador / Profissional
  const [category, setCategory] = useState('Instalação Solar & Energia');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [skills, setSkills] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [experienceYears, setExperienceYears] = useState<number | ''>('');
  const [bio, setBio] = useState('');
  const [rateMzn, setRateMzn] = useState<number | ''>('');
  const [photoData, setPhotoData] = useState<string>('');
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [cvFileName, setCvFileName] = useState<string>('');
  const [cvFileSize, setCvFileSize] = useState<string>('');
  const [cvFileData, setCvFileData] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');

  // Pagamento e Período Grátis
  const [planPaymentTiming, setPlanPaymentTiming] = useState<'trial' | 'now'>('trial');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola' | 'card' | 'bank_transfer'>('mpesa');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [maintenanceFee, setMaintenanceFee] = useState<number>(ACCOUNT_MAINTENANCE_FEE_MZN);
  const [accountBenefits, setAccountBenefits] = useState<string[]>(resolveAccountBenefits(null));
  const [homeBenefits, setHomeBenefits] = useState<string[]>(resolveHomeBenefits(null));

  // Visual UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [showLegalModal, setShowLegalModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const supabase = getSupabaseClient();

  useEffect(() => {
    let isMounted = true;
    fetch('/api/registration-plans')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && Array.isArray(data.plans) && data.plans.length > 0) {
          setMaintenanceFee(resolveMaintenanceFee(data.plans));
          setAccountBenefits(resolveAccountBenefits(data.plans));
          setHomeBenefits(resolveHomeBenefits(data.plans));
        }
      })
      .catch((err) => console.warn('[AuthPage] Falha ao carregar valor de manutenção de conta:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
      if (initialMode === 'signup') {
        if (initialRole && initialRole !== 'lar') {
          setRole(initialRole as any);
          setSignupStep('form');
        } else {
          setSignupStep('role');
        }
      }
    }
  }, [initialMode, initialRole]);

  useEffect(() => {
    if (role === 'prestador') {
      const list = getCategoriesByRole('prestador');
      if (!list.some(c => c.name === category)) {
        const defaultCat = list[0]?.name || 'Eletricidade & Instalações';
        setCategory(defaultCat);
        setSelectedSpecialties(getSpecialtiesForCategory(defaultCat).slice(0, 3));
      }
    } else if (role === 'profissional') {
      const list = getCategoriesByRole('profissional');
      if (!list.some(c => c.name === category)) {
        const defaultCat = list[0]?.name || 'Tecnologia, Software & IT';
        setCategory(defaultCat);
        setSelectedSpecialties(getSpecialtiesForCategory(defaultCat).slice(0, 3));
      }
    }
  }, [role]);

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const specs = getSpecialtiesForCategory(newCat);
    setSelectedSpecialties(specs.slice(0, 3));
  };

  const toggleSpecialty = (spec: string) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== spec));
    } else {
      setSelectedSpecialties([...selectedSpecialties, spec]);
    }
  };

  useEffect(() => {
    if (phone && !paymentPhone) {
      setPaymentPhone(phone);
    }
  }, [phone]);

  // Upload de fotografia de perfil (ImgBB)
  const handlePhotoFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor carregue um ficheiro de imagem válido (JPG, PNG ou WebP).');
      return;
    }
    setUploadError('');
    setPhotoFileName(file.name);
    setIsUploadingPhoto(true);
    uploadImageToImgBB(file)
      .then((url) => setPhotoData(url))
      .catch(() => setUploadError('Não foi possível carregar a fotografia. Por favor tente novamente.'))
      .finally(() => setIsUploadingPhoto(false));
  };

  // Upload de CV em PDF
  const handleCvFileSelect = (file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setUploadError('O Curriculum Vitae (CV) tem de ser estritamente em formato PDF (.pdf).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setUploadError(`O Currículo (CV) em PDF excede o tamanho máximo de 2MB (${sizeMb} MB).`);
      return;
    }
    setUploadError('');
    setCvFileName(file.name);
    setCvFileSize((file.size / 1024).toFixed(1) + ' KB');
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCvFileData(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Validação do Passo 2 (Dados) antes de avançar para o Passo 3 (Subscrição & Pagamento)
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanPhone = phone ? phone.trim().replace(/\D/g, '') : '';
    const hasValidEmail = Boolean(cleanEmail && cleanEmail.includes('@') && cleanEmail.includes('.'));
    const hasValidPhone = Boolean(cleanPhone && cleanPhone.length >= 8);

    if (role === 'empresa') {
      if (!companyName.trim()) {
        setMessage({ type: 'error', text: 'Por favor, introduza o Nome da Empresa / Razão Social.' });
        return;
      }
      if (!nuit.trim()) {
        setMessage({ type: 'error', text: 'Por favor, introduza o NUIT da Empresa.' });
        return;
      }
      if (!fullName.trim()) {
        setMessage({ type: 'error', text: 'Por favor, introduza o nome do Ponto de Contacto / Responsável.' });
        return;
      }
      if (!address.trim()) {
        setMessage({ type: 'error', text: 'Por favor, introduza o endereço da Sede / Instalações.' });
        return;
      }
    } else if (role === 'condominio') {
      if (!condoName.trim()) {
        setMessage({ type: 'error', text: 'Por favor, introduza o Nome do Condomínio / Edifício.' });
        return;
      }
      if (!fullName.trim()) {
        setMessage({ type: 'error', text: 'Por favor, introduza o nome do Administrador do Condomínio / Síndico.' });
        return;
      }
      if (!address.trim()) {
        setMessage({ type: 'error', text: 'Por favor, introduza o endereço físico do Condomínio.' });
        return;
      }
    } else if (role === 'lar') {
      if (!fullName.trim()) {
        setMessage({ type: 'error', text: 'Por favor, introduza o seu nome completo.' });
        return;
      }
      if (!address.trim()) {
        setMessage({ type: 'error', text: 'Por favor, introduza o endereço da sua residência.' });
        return;
      }
    } else {
      if (!fullName.trim()) {
        setMessage({ type: 'error', text: 'Por favor, introduza o seu nome completo.' });
        return;
      }
      if ((role === 'prestador' || role === 'profissional') && !photoData) {
        setMessage({ type: 'error', text: 'Por favor carregue a sua fotografia de perfil (rosto/ombros) antes de prosseguir.' });
        return;
      }
    }

    if (!hasValidEmail && !hasValidPhone) {
      setMessage({ type: 'error', text: 'Por favor, introduza um e-mail válido ou um contacto telefónico válido (mínimo de 8 dígitos).' });
      return;
    }
    if (!password || password.length < 8) {
      setMessage({ type: 'error', text: 'A palavra-passe deve ter pelo menos 8 caracteres.' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'As palavras-passe não coincidem.' });
      return;
    }
    if (!acceptedTerms) {
      setMessage({
        type: 'error',
        text: 'É obrigatório selecionar e aceitar os Termos e Condições para criar a sua conta.'
      });
      return;
    }

    // Avança para o Passo 3 (Subscrição & Pagamento com Período Grátis)
    setSignupStep('payment');
  };

  // Submissão Final do Registo (Passo 3)
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanPhone = phone ? phone.trim().replace(/\D/g, '') : '';
    const hasValidEmail = Boolean(cleanEmail && cleanEmail.includes('@') && cleanEmail.includes('.'));
    const authEmail = hasValidEmail ? cleanEmail : `${cleanPhone}@tel.tarira.co.mz`;

    if (!isSupabaseConfigured || !supabase) {
      setMessage({ type: 'error', text: 'O serviço de registo está temporariamente indisponível. Por favor tente mais tarde.' });
      return;
    }

    setLoading(true);

    const displayName = role === 'empresa'
      ? `${companyName.trim()} (${fullName.trim()})`
      : role === 'condominio'
      ? `${condoName.trim()} (${fullName.trim()})`
      : fullName.trim();

    const isPaidAccount = isPaidAccountRole(role);
    const trialExpiresDate = new Date(Date.now() + ACCOUNT_TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const finalPlanStatus = !isPaidAccount
      ? 'active'
      : (planPaymentTiming === 'now' ? 'pending' : 'trial');
    const selectedPlanPrice = (isPaidAccount && finalPlanStatus === 'trial') ? 0 : maintenanceFee;
    const selectedPlanObj = isPaidAccount
      ? { id: ACCOUNT_PLAN_ID, name: ACCOUNT_PLAN_NAME, price: selectedPlanPrice }
      : { id: HOME_PLAN_ID, name: HOME_PLAN_NAME, price: 0 };

    try {
      let authUser: any = null;
      let authSession: any = null;

      try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: authEmail,
          password,
          options: {
            data: {
              full_name: displayName,
              name: displayName,
              role,
              phone: phone.trim(),
              city: city || 'Maputo',
              nuit: nuit.trim(),
              terms_accepted: true,
              terms_accepted_at: new Date().toISOString(),
              image_publication_consent: true,
              ...(isPaidAccount ? {
                company_name: role === 'empresa' ? companyName.trim() : undefined,
                company_sector: role === 'empresa' ? companySector.trim() : undefined,
                company_employees: role === 'empresa' ? companyEmployees : undefined,
                condo_name: role === 'condominio' ? condoName.trim() : undefined,
                condo_type: role === 'condominio' ? condoType : undefined,
                condo_units: role === 'condominio' && condoUnits ? Number(condoUnits) : undefined,
                contact_person: fullName.trim(),
                contact_person_title: contactPersonTitle.trim(),
                plan_status: finalPlanStatus,
                plan_type: ACCOUNT_PLAN_ID,
                plan_name: ACCOUNT_PLAN_NAME,
                plan_price_mzn: selectedPlanPrice,
                trial_expires_at: trialExpiresDate,
                trial_days: ACCOUNT_TRIAL_DAYS
              } : {}),
              ...((role === 'prestador' || role === 'profissional') ? {
                title: professionalTitle.trim() || selectedSpecialties[0] || category,
                professional_title: professionalTitle.trim() || selectedSpecialties[0] || category,
                category,
                specialties: selectedSpecialties,
                experience_years: Number(experienceYears) || 3,
                rate_mzn: Number(rateMzn) || 1500,
                photo: photoData || '',
                photo_url: photoData || '',
                bio: bio || ''
              } : {})
            }
          }
        });

        if (signUpError || !signUpData?.user) {
          const cleanSignUp = await supabase.auth.signUp({ email: authEmail, password });
          if (cleanSignUp.data?.user) {
            authUser = cleanSignUp.data.user;
            authSession = cleanSignUp.data.session;
          } else {
            const srvReg = await fetch('/api/auth/register-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: authEmail,
                password,
                fullName: fullName.trim(),
                role,
                phone: phone.trim(),
                city,
                nuit
              })
            });
            if (srvReg.ok) {
              const srvData = await srvReg.json();
              authUser = srvData.user;
              setStoredSessionToken(srvData.sessionToken || srvData.token);
            } else {
              throw new Error(signUpError?.message || 'Falha ao autenticar utilizador.');
            }
          }
        } else {
          authUser = signUpData.user;
          authSession = signUpData.session;
        }
      } catch (authErr: any) {
        const srvReg = await fetch('/api/auth/register-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: authEmail,
            password,
            fullName: fullName.trim(),
            role,
            phone: phone.trim(),
            city,
            nuit
          })
        });
        if (srvReg.ok) {
          const srvData = await srvReg.json();
          authUser = srvData.user;
          setStoredSessionToken(srvData.sessionToken || srvData.token);
        } else {
          throw new Error(authErr?.message || 'Não foi possível concluir o registo no servidor.');
        }
      }

      if (!authUser) {
        throw new Error('Não foi possível concluir o registo da conta.');
      }

      let candidateId: string | null = null;
      let clientId: string | null = null;
      let linkedRecordObj: any = null;

      // Se for Prestador ou Profissional
      if (role === 'prestador' || role === 'profissional') {
        const isProfessional = role === 'profissional';
        const candidateCategory = resolveCanonicalCategoryId(
          category,
          selectedSpecialties.join(' · '),
          professionalTitle,
          isProfessional
        );
        const catObj = findCategoryItem(candidateCategory);
        const typedSkills = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
        const combinedSkills = Array.from(new Set([...selectedSpecialties, ...typedSkills])).filter(s => !isGenericTitleOrPlaceholder(s));
        const fallbackCandidateId = `cand-${authUser.id}`;
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || fullName.trim();
        const lastName = nameParts.slice(1).join(' ');
        const resolvedTitle = !isGenericTitleOrPlaceholder(professionalTitle)
          ? professionalTitle.trim()
          : (combinedSkills[0] || catObj?.name || category || (isProfessional ? 'Software, Web, Cloud & Apps' : 'Manutenção Técnica & Reparações'));
        const resolvedSubCat = combinedSkills.length > 0 ? combinedSkills.join(' · ') : resolvedTitle;
        const resolvedBio = bio.trim() || (isProfessional ? 'Profissional qualificado verificado pelo TARIRA Recruit.' : 'Técnico de ofício credenciado no ecossistema TARIRA.');
        const resolvedSkills = combinedSkills.length > 0 ? combinedSkills : [resolvedTitle];

        const candPayload = {
          id: fallbackCandidateId,
          name: firstName,
          surname: lastName,
          role: resolvedTitle,
          title: resolvedTitle,
          category: candidateCategory,
          isProfessional,
          subCategory: resolvedSubCat,
          city: city || 'Maputo',
          residence: `${city || 'Maputo'}, Moçambique`,
          biNumber: nuit,
          phone: phone.trim() || cleanPhone,
          whatsapp: phone.trim() || cleanPhone,
          email: cleanEmail || authEmail,
          photo: photoData || '',
          bio: resolvedBio,
          skills: resolvedSkills,
          experienceYears: Number(experienceYears) || 3,
          expectedSalaryMin: 25000,
          rateMzn: Number(rateMzn) || 1500,
          rating: 5.0,
          matchScore: 92,
          reviewsCount: 0,
          availableNow: true,
          verified: true,
          status: 'approved'
        };

        try {
          const candRes = await fetch('/api/candidates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(candPayload)
          });

          if (candRes.ok) {
            const cand = await candRes.json();
            candidateId = cand.id || fallbackCandidateId;
            linkedRecordObj = { ...candPayload, ...cand, photo: photoData || cand.photo || '' };
          }
        } catch {
          // Fallback direto para Supabase abaixo
        }

        if (!candidateId) {
          candidateId = fallbackCandidateId;
          linkedRecordObj = candPayload;
        }

        try {
          await supabase.from('candidates').upsert([{
            id: candidateId,
            name: firstName,
            surname: lastName,
            email: cleanEmail || authEmail,
            phone: phone.trim() || cleanPhone,
            whatsapp: phone.trim() || cleanPhone,
            category: candidateCategory,
            sub_category: resolvedSubCat,
            title: resolvedTitle,
            city: city || 'Maputo',
            residence: `${city || 'Maputo'}, Moçambique`,
            experience_years: Number(experienceYears) || 3,
            rating: 5.0,
            match_score: 92,
            available_now: true,
            available_for_emergency: !isProfessional,
            is_professional: isProfessional,
            status: 'approved',
            bio: resolvedBio,
            skills: resolvedSkills,
            photo_url: photoData || '',
            data: {
              ...candPayload,
              id: candidateId,
              photo: photoData || ''
            },
            updated_at: new Date().toISOString()
          }], { onConflict: 'id' });
        } catch (sbCandErr) {
          console.warn('[AuthPage] Direct candidates upsert warning:', sbCandErr);
        }
      } else {
        // Lar, Empresa ou Condomínio
        const clientType = role === 'lar' ? 'residential' : role === 'condominio' ? 'condo' : 'company';

        const clientRes = await fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: displayName,
            companyName: role === 'empresa' ? companyName.trim() : '',
            condoName: role === 'condominio' ? condoName.trim() : '',
            contactPerson: fullName.trim(),
            contactPersonTitle: contactPersonTitle.trim(),
            companySector: role === 'empresa' ? companySector : '',
            companyEmployees: role === 'empresa' ? companyEmployees : '',
            condoUnits: role === 'condominio' ? condoUnits : '',
            condoType: role === 'condominio' ? condoType : '',
            residentialType: role === 'lar' ? residentialType : '',
            type: clientType,
            email: cleanEmail || authEmail,
            phone: phone.trim() || cleanPhone,
            address: address ? address.trim() : (city ? `${city.trim()}, Moçambique` : 'Maputo, Moçambique'),
            bi: nuit ? nuit.trim() : '',
            nuit: nuit ? nuit.trim() : '',
            planType: selectedPlanObj.id,
            planName: selectedPlanObj.name,
            planPriceMzn: selectedPlanObj.price,
            planStatus: finalPlanStatus,
            trialExpiresAt: isPaidAccount ? trialExpiresDate : undefined,
            trialDays: isPaidAccount ? ACCOUNT_TRIAL_DAYS : undefined,
            paymentMethod: isPaidAccount ? paymentMethod : null,
            paymentPhone: isPaidAccount ? paymentPhone : null
          })
        });

        if (clientRes.ok) {
          const client = await clientRes.json();
          clientId = client.id;
          linkedRecordObj = client;

          if (isPaidAccount && finalPlanStatus === 'pending') {
            try {
              sessionStorage.setItem('tarira_open_payment_checkout', JSON.stringify({
                clientId: client.id,
                serviceTitle: `Manutenção de Conta TARIRA — ${role === 'condominio' ? 'Condomínio' : 'Empresa'}`,
                amount: selectedPlanObj.price,
                isTrial: false,
                method: paymentMethod,
                phone: paymentPhone
              }));
            } catch { /* ignore sessionStorage error */ }
          }
        }
      }

      // Upsert profile completo
      const effectiveProfile: UserProfile = {
        id: authUser.id,
        name: displayName,
        email: cleanEmail || authEmail,
        role: role as any,
        phone: phone.trim() || cleanPhone,
        city: city || 'Maputo',
        nuit: nuit ? nuit.trim() : '',
        category: (role === 'prestador' || role === 'profissional')
          ? resolveCanonicalCategoryId(category, selectedSpecialties.join(' · '), professionalTitle, role === 'profissional')
          : (category || ''),
        candidate_id: candidateId,
        client_id: clientId,
        is_active: true,
        company_name: role === 'empresa' ? companyName.trim() : undefined,
        company_sector: role === 'empresa' ? companySector.trim() : undefined,
        company_employees: role === 'empresa' ? companyEmployees : undefined,
        condo_name: role === 'condominio' ? condoName.trim() : undefined,
        condo_type: role === 'condominio' ? condoType : undefined,
        condo_units: role === 'condominio' && condoUnits ? Number(condoUnits) : undefined,
        contact_person: fullName.trim(),
        contact_person_title: contactPersonTitle.trim(),
        plan_status: finalPlanStatus,
        plan_type: isPaidAccount ? ACCOUNT_PLAN_ID : HOME_PLAN_ID,
        plan_name: isPaidAccount ? ACCOUNT_PLAN_NAME : HOME_PLAN_NAME,
        trial_expires_at: isPaidAccount ? trialExpiresDate : undefined,
        trial_days: isPaidAccount ? ACCOUNT_TRIAL_DAYS : undefined,
        professional_title: (role === 'prestador' || role === 'profissional')
          ? (professionalTitle.trim() || selectedSpecialties[0] || findCategoryItem(category)?.name || category)
          : undefined,
        experience_years: (role === 'prestador' || role === 'profissional') && experienceYears ? Number(experienceYears) : undefined,
        specialties: (role === 'prestador' || role === 'profissional') ? selectedSpecialties : undefined,
        photo_url: (role === 'prestador' || role === 'profissional') && photoData ? photoData : undefined,
        bio: (role === 'prestador' || role === 'profissional') && bio ? bio.trim() : undefined
      };

      try {
        await supabase.from('profiles').upsert([effectiveProfile], { onConflict: 'id' });
      } catch (pErr) {
        console.warn('[AuthPage] Supabase client upsert error:', pErr);
      }

      try {
        const upRes = await fetch('/api/profiles/upsert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(effectiveProfile)
        });
        if (upRes.ok) {
          const upData = await upRes.json().catch(() => ({}));
          if (upData?.sessionToken || upData?.token) {
            setStoredSessionToken(upData.sessionToken || upData.token);
          }
        }
      } catch { /* silently handled */ }

      if (onUserChange) onUserChange(authUser, effectiveProfile, linkedRecordObj);
      setMessage({ type: 'success', text: 'Conta criada e ativada com sucesso! A entrar no seu painel...' });
      if (!onUserChange && onClose) setTimeout(() => onClose(), 900);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao realizar o registo da conta.' });
    } finally {
      setLoading(false);
    }
  };

  // Login normal
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    let cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes('@')) {
      const digits = cleanEmail.replace(/\D/g, '');
      if (digits.length >= 8) {
        cleanEmail = `${digits}@tel.tarira.co.mz`;
      }
    }

    setLoading(true);

    try {
      // 1. Verificação rigorosa de credenciais de Administrador
      const knownAdminEmails = [
        'tarira.ecossistema@gmail.com',
        'tariraecossystem@gmail.com',
        'admin@tarira.co.mz',
        'diasgermano348@gmail.com'
      ];
      const envAdminEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase().trim();
      if (envAdminEmail && !knownAdminEmails.includes(envAdminEmail)) {
        knownAdminEmails.push(envAdminEmail);
      }
      let isKnownAdmin = knownAdminEmails.includes(cleanEmail);

      try {
        const adminRes = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password })
        });
        const adminData = await adminRes.json().catch(() => ({} as any));
        if (adminRes.ok && adminData.success) {
          setStoredSessionToken(adminData.sessionToken || adminData.token);
          if (onUserChange) onUserChange(adminData.user, adminData.profile, null);
          setMessage({ type: 'success', text: 'Sessão de administrador iniciada com sucesso!' });
          if (onClose) setTimeout(() => onClose(), 800);
          setLoading(false);
          return;
        }
        if (adminData?.isAdminEmail) {
          isKnownAdmin = true;
        }
      } catch (adminErr) {
        console.warn('[AuthPage] Aviso ao contactar /api/admin/login, a tentar Supabase Auth:', adminErr);
      }

      // 2. Login via servidor (/api/auth/login) — suporta ADMIN_EMAIL/ADMIN_PASSWORD da Vercel e Supabase Auth
      try {
        const srvLogin = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, phone: cleanEmail, password })
        });
        if (srvLogin.ok) {
          const srvData = await srvLogin.json().catch(() => ({} as any));
          if (srvData.user) {
            setStoredSessionToken(srvData.sessionToken || srvData.token);
            const isAdminRole = srvData.profile?.role === 'admin' || isKnownAdmin;
            if (onUserChange) onUserChange(srvData.user, srvData.profile, null);
            setMessage({
              type: 'success',
              text: isAdminRole ? 'Sessão de administrador iniciada com sucesso!' : 'Sessão iniciada com sucesso!'
            });
            if (onClose) setTimeout(() => onClose(), 800);
            setLoading(false);
            return;
          }
        } else {
          const srvErr = await srvLogin.json().catch(() => ({} as any));
          if (srvErr?.isAdminEmail) {
            isKnownAdmin = true;
          }
        }
      } catch {
        // Continua para fallback direto no cliente Supabase
      }

      // 3. Supabase Auth direto no navegador (fallback caso a API serverless esteja indisponível)
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (!error && data?.user) {
          let prof: UserProfile | null = null;
          try {
            const { data: pData } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
            prof = pData;
          } catch { /* fallback */ }

          const isAdminUser = isKnownAdmin || prof?.role === 'admin' || data.user.user_metadata?.role === 'admin';
          if (isAdminUser) {
            prof = {
              ...(prof || {}),
              id: data.user.id,
              email: cleanEmail,
              role: 'admin',
              name: prof?.name || 'Administrador Master TARIRA',
              phone: prof?.phone || '+258 84 000 0000',
              city: prof?.city || 'Maputo',
              is_active: true
            };
          }

          if (onUserChange) onUserChange(data.user, prof, null);
          setMessage({ type: 'success', text: isAdminUser ? 'Sessão de administrador iniciada com sucesso!' : 'Sessão iniciada com sucesso!' });
          if (onClose) setTimeout(() => onClose(), 800);
          return;
        }
      }

      if (isKnownAdmin) {
        setMessage({
          type: 'error',
          text: 'Palavra-passe de administrador incorreta. Verifique as variáveis ADMIN_EMAIL e ADMIN_PASSWORD na Vercel ou a palavra-passe da conta no Supabase Auth.'
        });
        setLoading(false);
        return;
      }

      setMessage({ type: 'error', text: 'Email ou palavra-passe incorretos. Por favor, verifique os seus dados.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao iniciar sessão.' });
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            queryParams: { access_type: 'offline', prompt: 'consent' },
          },
        });
        if (error) {
          setMessage({ type: 'error', text: `Erro na ligação Google: ${error.message}` });
        }
      } else {
        setMessage({ type: 'info', text: 'Utilize e-mail e palavra-passe para aceder.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Não foi possível autenticar com a Conta Google.' });
    } finally {
      setLoading(false);
    }
  };

  // Recuperação de senha
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    if (!cleanEmail) {
      setMessage({ type: 'error', text: 'Introduza o seu e-mail para receber o link de recuperação.' });
      return;
    }
    setLoading(true);
    try {
      if (!supabase) throw new Error('Serviço indisponível');
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}${window.location.pathname}#type=recovery`
      });
      if (error) throw error;
      setMessage({
        type: 'success',
        text: 'Link de recuperação enviado com sucesso! Verifique a sua caixa de entrada.'
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Erro ao processar recuperação.' });
    } finally {
      setLoading(false);
    }
  };

  // Redefinir senha
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (password.length < 8) {
      setMessage({ type: 'error', text: 'A palavra-passe deve ter pelo menos 8 caracteres.' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'As palavras-passe não coincidem.' });
      return;
    }
    setLoading(true);
    try {
      if (!supabase) throw new Error('Serviço indisponível');
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Palavra-passe atualizada com sucesso! A entrar...' });
      if (onClose) setTimeout(() => onClose(), 1200);
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Erro ao atualizar a palavra-passe.' });
    } finally {
      setLoading(false);
    }
  };

  // Adaptive Container Width as specified in UX architecture guidelines
  const isCompactView = mode === 'signin' || mode === 'forgot' || mode === 'reset-password';
  const containerWidthClass = isCompactView 
    ? 'max-w-md' // 448px: login focado
    : (signupStep === 'role' ? 'max-w-3xl' : 'max-w-xl'); // 768px para grelha de perfis, 576px para formulário & pagamento

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col justify-start sm:justify-center items-center py-6 sm:py-12 px-3 sm:px-6">
      
      {/* 5. BARRA SUPERIOR LIMPA (Zero Distração: Logótipo Oficial à esquerda com slogan bilingue, Fechar à direita) */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between px-2 sm:px-4 mb-5 sm:mb-7">
        <a 
          href="/" 
          onClick={(e) => {
            if (onClose) {
              e.preventDefault();
              onClose();
            }
          }}
          className="flex items-center group cursor-pointer transition-transform hover:scale-[1.02]"
          aria-label="Tarira Início"
        >
          <TariraLogo align="left" size="xs" lightBg={true} withSlogan={true} uniformColor="#0B254B" />
        </a>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold self-start mt-1"
            aria-label="Fechar e voltar à navegação"
            title="Fechar"
          >
            <span className="hidden sm:inline">Fechar</span>
            <X className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* 2. CONTENTOR COM LARGURA DINÂMICA E FLUIDA (Adaptive Width) */}
      <div className={`w-full ${containerWidthClass} transition-all duration-300 mx-auto`}>
        
        {/* Aviso de bloqueio / Guest Gate */}
        {guestGateReason && (
          <div className="mb-4 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs shadow-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-blue-950">Acesso Reservado a Membros</strong>
              <span className="text-blue-800 text-xs leading-relaxed">
                Inicie sessão ou crie a sua conta para aceder a orçamentos, contratações e relatórios protegidos no ecossistema TARIRA.
              </span>
            </div>
          </div>
        )}

        {/* 4. ELIMINAÇÃO DE DUPLICAÇÕES: Segmented Control Unificado no Topo */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="bg-slate-200/70 p-1 rounded-xl mb-4 sm:mb-6 grid grid-cols-2 gap-1 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setMessage(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-white text-[#0B254B] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setSignupStep('role');
                setMessage(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-white text-[#0B254B] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Criar Conta</span>
            </button>
          </div>
        )}

        {/* 1. COMPONENTE DE BARRA DE PROGRESSO POR PASSOS (Apenas durante o registo) */}
        {mode === 'signup' && (
          <StepProgress 
            currentStep={signupStep === 'role' ? 1 : signupStep === 'form' ? 2 : 3}
            steps={isPaidAccountRole(role) ? ['Perfil', 'Dados', 'Pagamento'] : ['Perfil', 'Dados', 'Subscrição']}
            className="mb-4 sm:mb-6"
          />
        )}

        {/* MENSAGENS DE ALERTA / SUCESSO */}
        {message && (
          <div className={`p-3.5 rounded-xl text-xs font-semibold mb-4 border transition-all ${
            message.type === 'success' 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
              : message.type === 'error' 
              ? 'bg-rose-50 border-rose-300 text-rose-800' 
              : 'bg-blue-50 border-blue-300 text-blue-900'
          }`}>
            {message.text}
          </div>
        )}

        {/* CARD PRINCIPAL DO FORMULÁRIO */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-5 sm:p-7">
          
          {/* ============================================================== */}
          {/* TELA DE LOGIN                                                  */}
          {/* ============================================================== */}
          {mode === 'signin' && (
            <div>
              <div className="mb-5 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0B254B]">
                  Iniciar Sessão
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Introduza as suas credenciais para aceder ao seu painel.
                </p>
              </div>

              {/* Botão Google One-Click */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-2xs mb-4 active:scale-[0.99]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continuar com Conta Google</span>
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-xs uppercase font-semibold tracking-wider text-slate-400 whitespace-nowrap">
                  ou com credenciais
                </span>
              </div>

              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail ou Telefone
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ex: contacto@empresa.co.mz ou 841234567"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] focus:ring-1 focus:ring-[#0B254B] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Palavra-passe
                    </label>
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setMessage(null); }}
                      className="text-xs text-[#0B254B] hover:underline font-medium"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] focus:ring-1 focus:ring-[#0B254B] outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0B254B] hover:bg-blue-900 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Entrar no Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* 4. Ligação textual natural no fundo do login */}
              <p className="text-center text-xs text-slate-500 mt-6 pt-4 border-t border-slate-100">
                Ainda não tem conta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setSignupStep('role');
                    setMessage(null);
                  }}
                  className="text-[#0B254B] font-bold hover:underline cursor-pointer"
                >
                  Criar Conta
                </button>
              </p>
            </div>
          )}

          {/* ============================================================== */}
          {/* PASSO 1 DO REGISTO: ESCOLHA DO PERFIL (Redução de densidade)     */}
          {/* ============================================================== */}
          {mode === 'signup' && signupStep === 'role' && (
            <div>
              <div className="mb-5 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0B254B]">
                  Selecione o seu Perfil
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Escolha o tipo de conta mais adequado para aceder às soluções TARIRA.
                </p>
              </div>

              {/* 3. Destaque do Perfil Principal ("Cliente Residencial / Lar") compacto e equilibrado */}
              <div
                onClick={() => {
                  setRole('lar');
                  setSignupStep('form');
                }}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer mb-2.5 flex items-center justify-between group ${
                  role === 'lar'
                    ? 'border-[#0B254B] bg-blue-50/70 shadow-xs ring-1 ring-[#0B254B]'
                    : 'border-slate-200/90 hover:border-[#0B254B] hover:bg-slate-50/90'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#0B254B] flex items-center justify-center shrink-0 group-hover:bg-[#0B254B] group-hover:text-white transition-all">
                    <Home className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xs sm:text-[13px] font-bold text-[#0B254B]">Cliente Residencial / Lar</h2>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        100% Gratuito
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      Reparações domésticas, AVAC, eletricidade, canalização e manutenção de imóveis.
                    </p>
                  </div>
                </div>
                <div className="hidden xs:flex items-center text-xs font-semibold text-slate-500 group-hover:text-[#0B254B] gap-1 shrink-0 ml-2">
                  <span className="text-xs">Avançar</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* 3. Grelha de Perfis Especializados compacta (sem altura fixa gigante e sem botões redundantes de rodapé) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'empresa',
                    title: 'Empresa / Corporativo',
                    desc: 'Requisições B2B, gestão técnica com NUIT e faturação unificada.',
                    icon: Building2,
                    badge: `${ACCOUNT_TRIAL_DAYS} dias grátis`,
                    badgeColor: 'bg-blue-100 text-blue-900 border-blue-200'
                  },
                  {
                    id: 'condominio',
                    title: 'Condomínio / Edifício',
                    desc: 'Manutenção predial periódica, eletricidade, bombas e piquete.',
                    icon: Building,
                    badge: `${ACCOUNT_TRIAL_DAYS} dias grátis`,
                    badgeColor: 'bg-blue-100 text-blue-900 border-blue-200'
                  },
                  {
                    id: 'prestador',
                    title: 'Técnico de Ofício',
                    desc: 'Eletricistas, canalizadores, AVAC e mecânica (TARIRA Connect).',
                    icon: Wrench,
                    badge: 'Rede Connect',
                    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200'
                  },
                  {
                    id: 'profissional',
                    title: 'Profissional / Consultor',
                    desc: 'Especialistas de TI, engenharia, finanças e consultores (Recruit).',
                    icon: GraduationCap,
                    badge: 'Rede Recruit',
                    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200'
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = role === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setRole(item.id as any);
                        setSignupStep('form');
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'border-[#0B254B] bg-blue-50/70 shadow-xs ring-1 ring-[#0B254B]'
                          : 'border-slate-200/90 hover:border-[#0B254B] hover:bg-slate-50/90 hover:shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-[#0B254B] text-[#0B254B] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs sm:text-[12.5px] font-bold text-slate-900 group-hover:text-[#0B254B] transition-colors leading-tight">
                            {item.title}
                          </span>
                        </div>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Botão Google One-Click para Registos Rápidos */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-2xs active:scale-[0.99]"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Criar Conta Rápida com Google</span>
                </button>
              </div>

              {/* 4. Ligação textual natural no fundo do registo */}
              <p className="text-center text-xs text-slate-500 mt-5 pt-3 border-t border-slate-100">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setMessage(null); }}
                  className="text-[#0B254B] font-bold hover:underline cursor-pointer"
                >
                  Iniciar Sessão
                </button>
              </p>
            </div>
          )}

          {/* ============================================================== */}
          {/* PASSO 2 DO REGISTO: DADOS DA CONTA                             */}
          {/* ============================================================== */}
          {mode === 'signup' && signupStep === 'form' && (
            <div>
              {/* Botão discreto de regresso */}
              <button
                type="button"
                onClick={() => setSignupStep('role')}
                className="text-xs text-slate-500 hover:text-[#0B254B] flex items-center gap-1 font-medium transition-colors mb-3.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Escolher outro perfil</span>
              </button>

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0B254B]">
                    Dados do Registo
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Preencha as informações para configurar a sua conta.
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-[#0B254B] border border-blue-200">
                  {role === 'empresa' ? 'Empresa' : role === 'condominio' ? 'Condomínio' : role === 'prestador' ? 'Técnico' : role === 'profissional' ? 'Profissional' : 'Cliente Lar'}
                </span>
              </div>

              <form onSubmit={handleProceedToPayment} className="space-y-3.5">
                
                {/* Campos para Empresa */}
                {role === 'empresa' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nome da Empresa / Razão Social *
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="ex: MozaTech Lda."
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        NUIT da Empresa *
                      </label>
                      <input
                        type="text"
                        required
                        value={nuit}
                        onChange={(e) => setNuit(e.target.value)}
                        placeholder="ex: 400123456"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Setor de Atividade
                      </label>
                      <input
                        type="text"
                        value={companySector}
                        onChange={(e) => setCompanySector(e.target.value)}
                        placeholder="ex: Tecnologia, Mineração, Retalho"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nome do Ponto de Contacto / Responsável *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="ex: Carlos Sitoe"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Campos para Condomínio */}
                {role === 'condominio' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nome do Condomínio / Edifício *
                      </label>
                      <input
                        type="text"
                        required
                        value={condoName}
                        onChange={(e) => setCondoName(e.target.value)}
                        placeholder="ex: Condomínio Marés Vivas"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Administrador / Síndico *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="ex: Ana Macamo"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Número de Frações / Unidades
                      </label>
                      <input
                        type="number"
                        value={condoUnits}
                        onChange={(e) => setCondoUnits(e.target.value ? Number(e.target.value) : '')}
                        placeholder="ex: 24"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Campos para Lar / Residencial */}
                {role === 'lar' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="ex: Alberto Tembe"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                    />
                  </div>
                )}

                {/* Campos para Prestador / Profissional */}
                {(role === 'prestador' || role === 'profissional') && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="ex: João Manuel Mondlane"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {role === 'prestador' ? 'Título do Ofício / Profissão *' : 'Cargo / Especialidade Principal *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={professionalTitle}
                        onChange={(e) => setProfessionalTitle(e.target.value)}
                        placeholder={role === 'prestador' ? 'ex: Eletricista de Baixa e Média Tensão' : 'ex: Engenheiro de Software Full-Stack'}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Área de Atuação / Categoria *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:border-[#0B254B] outline-none"
                      >
                        {getCategoriesByRole(role).map((cat) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Chips de Especialidades Rápidas da Categoria */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Especialidades & Habilidades (clique para selecionar)
                      </label>
                      <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl bg-slate-50 border border-slate-200">
                        {getSpecialtiesForCategory(category).map((spec) => {
                          const isSel = selectedSpecialties.includes(spec);
                          return (
                            <button
                              key={spec}
                              type="button"
                              onClick={() => toggleSpecialty(spec)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                                isSel
                                  ? 'bg-[#0B254B] text-white shadow-2xs'
                                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {isSel && <Check className="w-3 h-3" />}
                              <span>{spec}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Anos de Experiência e NUIT/BI */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Anos de Experiência no Setor *
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={50}
                          required
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value ? Number(e.target.value) : '')}
                          placeholder="ex: 4"
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Número de BI ou NUIT *
                        </label>
                        <input
                          type="text"
                          required
                          value={nuit}
                          onChange={(e) => setNuit(e.target.value)}
                          placeholder="ex: 110293847"
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                        />
                      </div>
                    </div>

                    {/* Tarifa Base ou Pretensão Salarial */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {role === 'prestador' ? 'Tarifa Base por Serviço / Visita (MZN)' : 'Pretensão Salarial Mínima Mensal (MZN)'}
                      </label>
                      <input
                        type="number"
                        value={rateMzn}
                        onChange={(e) => setRateMzn(e.target.value ? Number(e.target.value) : '')}
                        placeholder={role === 'prestador' ? 'ex: 1500' : 'ex: 45000'}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                      />
                    </div>

                    {/* Upload de Fotografia de Perfil */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Fotografia de Perfil (Rosto)
                      </label>
                      <div className="flex items-center gap-3">
                        {photoData ? (
                          <img src={photoData} alt="Perfil" className="w-11 h-11 rounded-xl object-cover border border-slate-200" />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                            <Camera className="w-5 h-5" />
                          </div>
                        )}
                        <label className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold cursor-pointer text-slate-700 flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingPhoto ? 'A carregar...' : photoData ? 'Trocar Foto' : 'Carregar Fotografia'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handlePhotoFileSelect(e.target.files[0])}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contactos Comuns: E-mail e Telefone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ex: seu.email@exemplo.com"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telefone (Moçambique) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="ex: 84 123 4567"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                    />
                  </div>
                </div>

                {/* Morada / Cidade */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cidade / Província
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="ex: Maputo, Matola, Beira"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Endereço / Bairro *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="ex: Polana Cimento, Av. Julius Nyerere"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                    />
                  </div>
                </div>

                {/* Palavras-passe */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Palavra-passe (mín. 8 caracteres) *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirmar Palavra-passe *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Termos e Condições */}
                <div className="pt-2">
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 rounded text-[#0B254B] focus:ring-0 cursor-pointer"
                    />
                    <span>
                      Declaro que li e aceito os{' '}
                      <button
                        type="button"
                        onClick={() => setShowLegalModal(true)}
                        className="text-[#0B254B] font-bold underline cursor-pointer"
                      >
                        Termos e Condições do Ecossistema TARIRA
                      </button>{' '}
                      e a Política de Privacidade.
                    </span>
                  </label>
                </div>

                {/* Botão de Avanço para Pagamento ou Conclusão */}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0B254B] hover:bg-blue-900 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
                >
                  <span>{isPaidAccountRole(role) ? 'Continuar para Pagamento & Ativação' : 'Continuar para Conclusão da Conta'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* PASSO 3 DO REGISTO: PAGAMENTO / SUBSCRIÇÃO & PERÍODO GRÁTIS     */}
          {/* ============================================================== */}
          {mode === 'signup' && signupStep === 'payment' && (
            <div>
              {/* Botão de regresso para os dados */}
              <button
                type="button"
                onClick={() => setSignupStep('form')}
                className="text-xs text-slate-500 hover:text-[#0B254B] flex items-center gap-1 font-medium transition-colors mb-3.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar aos dados</span>
              </button>

              <div className="mb-4">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0B254B]">
                  {isPaidAccountRole(role) ? 'Pagamento & Ativação da Conta' : 'Subscrição & Ativação'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isPaidAccountRole(role) 
                    ? 'Confirme o plano de manutenção corporativa e a modalidade de pagamento.' 
                    : 'Reveja as condições da sua conta e confirme a ativação.'}
                </p>
              </div>

              {/* SE FOR EMPRESA OU CONDOMÍNIO: DESTAQUE DO PERÍODO GRÁTIS E PAGAMENTO */}
              {isPaidAccountRole(role) ? (
                <div className="space-y-4">
                  {/* Banner de 30 Dias Grátis */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs sm:text-sm font-bold text-emerald-900">
                          {ACCOUNT_TRIAL_DAYS} Dias de Avaliação Gratuita Incluídos
                        </strong>
                        <span className="text-xs bg-emerald-600 text-white font-bold px-2 py-0.2 rounded-full">
                          Sem Risco
                        </span>
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed mt-1">
                        A sua conta fica ativa de imediato. Durante os primeiros 30 dias pode requisitar e gerir serviços sem qualquer mensalidade inicial.
                      </p>
                    </div>
                  </div>

                  {/* Resumo do Plano de Manutenção */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>Plano de Manutenção de Conta:</span>
                      <span className="font-bold text-[#0B254B]">{role === 'empresa' ? 'Empresa / B2B' : 'Condomínio'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Valor de manutenção regular:</span>
                      <span className="font-semibold">{formatMzn(maintenanceFee)} / mês</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-[#0B254B]">
                      <span>Valor a pagar hoje:</span>
                      <span className="text-emerald-700 text-base">0,00 MZN</span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 pt-1">
                      A primeira mensalidade de manutenção só será devida após o término dos {ACCOUNT_TRIAL_DAYS} dias gratuitos.
                    </p>
                  </div>

                  {/* Escolha do Momento de Ativação / Pagamento */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Opção de Ativação da Conta:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div
                        onClick={() => setPlanPaymentTiming('trial')}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          planPaymentTiming === 'trial'
                            ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">Começar Grátis</span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Recomendado</span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 mt-1 leading-tight">
                          Ativação imediata da conta por 30 dias sem cobrança hoje.
                        </p>
                      </div>

                      <div
                        onClick={() => setPlanPaymentTiming('now')}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          planPaymentTiming === 'now'
                            ? 'border-[#0B254B] bg-blue-50/40 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">Pagar Já com Fatura</span>
                          <span className="text-xs text-slate-500">Adiantado</span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 mt-1 leading-tight">
                          Emitir já a fatura com NUIT e efetuar a liquidação.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Método de Pagamento em Moçambique */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Método de Pagamento Preferencial em Moçambique:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'mpesa', label: 'M-Pesa', sub: 'Vodacom' },
                        { id: 'emola', label: 'e-Mola', sub: 'Movitel' },
                        { id: 'card', label: 'Cartão', sub: 'Visa / MC' },
                        { id: 'bank_transfer', label: 'BCI / TED', sub: 'Transferência' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            paymentMethod === m.id
                              ? 'border-[#0B254B] bg-[#0B254B]/5 font-bold text-[#0B254B] ring-1 ring-[#0B254B]'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span className="block text-xs font-bold">{m.label}</span>
                          <span className="block text-xs text-slate-400">{m.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Botão de Conclusão para Empresa / Condomínio */}
                  <button
                    type="button"
                    onClick={handleSignUpSubmit}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {planPaymentTiming === 'trial'
                            ? `Ativar Conta e Iniciar ${ACCOUNT_TRIAL_DAYS} Dias Grátis`
                            : 'Concluir Registo e Emitir Fatura'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              ) : role === 'lar' ? (
                /* CASO PARTICULAR / LAR: 100% GRATUITO */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xs sm:text-sm font-bold text-emerald-900">
                        Conta Particular 100% Gratuita Vitalícia
                      </h2>
                      <p className="text-xs text-emerald-800 leading-relaxed mt-1">
                        A criação e a manutenção da conta não têm qualquer custo. Paga apenas pelos serviços ou reparações técnicas que solicitar, com preços justos e garantia da central TARIRA.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <span className="block text-xs font-bold text-slate-700 mb-1">
                      O que está incluído na sua conta:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Acesso 24/7 a técnicos credenciados (canalizadores, eletricistas, AVAC)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Orçamentos supervisionados com garantia de preço de mercado</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Proteção do pagamento em escrow e garantia na execução</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignUpSubmit}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Concluir Registo e Ativar Conta Gratuita</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* CASO PRESTADOR / PROFISSIONAL: ADESÃO À REDE CREDENCIADA */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 flex items-start gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-[#0B254B] flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="w-5 h-5 text-[#0B254B]" />
                    </div>
                    <div>
                      <h2 className="text-xs sm:text-sm font-bold text-[#0B254B]">
                        Adesão à Rede Credenciada TARIRA
                      </h2>
                      <p className="text-xs text-blue-800 leading-relaxed mt-1">
                        Inscrição gratuita. O seu perfil será avaliado pela equipa de auditoria e receberá pedidos de serviço com pagamento garantido pela central.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>Taxa de Inscrição:</span>
                      <span className="font-bold text-emerald-700">0,00 MZN</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Comissão por serviço executado:</span>
                      <span>Aplicável apenas após aprovação e conclusão</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignUpSubmit}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submeter Perfil e Ativar Credenciais</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TELA DE RECUPERAÇÃO DE PALAVRA-PASSE                          */}
          {/* ============================================================== */}
          {mode === 'forgot' && (
            <div>
              <div className="mb-4">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0B254B]">
                  Recuperar Palavra-passe
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Introduza o e-mail associado à sua conta para receber um link de redefinição.
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail da sua conta
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ex: seu.email@exemplo.com"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0B254B] hover:bg-blue-900 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Enviar Link de Recuperação</span>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-slate-500 mt-5 pt-3 border-t border-slate-100">
                Lembrou-se da palavra-passe?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setMessage(null); }}
                  className="text-[#0B254B] font-bold hover:underline cursor-pointer"
                >
                  Voltar ao Login
                </button>
              </p>
            </div>
          )}

          {/* ============================================================== */}
          {/* TELA DE REDEFINIÇÃO DE SENHA (RESET PASSWORD)                  */}
          {/* ============================================================== */}
          {mode === 'reset-password' && (
            <div>
              <div className="mb-4">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0B254B]">
                  Nova Palavra-passe
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Defina a sua nova palavra-passe de acesso.
                </p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nova Palavra-passe (mín. 8 caracteres)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirmar Nova Palavra-passe
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#0B254B] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0B254B] hover:bg-blue-900 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Salvar Nova Palavra-passe</span>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* Modal de Termos Legais */}
      {showLegalModal && (
        <TariraLegalModal
          isOpen={showLegalModal}
          onClose={() => setShowLegalModal(false)}
          currentLang="pt"
        />
      )}
    </div>
  );
};

export default AuthPage;
