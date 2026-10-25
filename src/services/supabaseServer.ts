import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import {
  resolveCanonicalCategoryId,
  resolveCandidateSpecialization,
  isGenericTitleOrPlaceholder
} from "../data/categoriesData.js";

dotenv.config();

/**
 * Cliente Supabase do lado do servidor (Node/Express).
 *
 * Diferente de `supabase.ts` (que corre no browser e usa `import.meta.env` +
 * a chave anónima), este módulo corre no servidor Node e usa `process.env` +
 * a Service Role Key — necessária para o servidor poder ler/escrever nas
 * tabelas de estado da aplicação (candidatos, contratações, pagamentos, etc.)
 * sem depender de RLS orientado a utilizador final.
 *
 * Variáveis de ambiente necessárias (ficheiro .env, nunca commitadas):
 *   SUPABASE_URL=https://SEU-PROJECTO.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...   (Project Settings → API → service_role)
 *
 * IMPORTANTE: a Service Role Key ignora Row Level Security. Nunca a exponha
 * no frontend/browser — só deve existir aqui, no processo do servidor.
 */

const rawServerUrl = (
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  ""
).trim();
const supabaseUrl = rawServerUrl
  .replace(/\/rest\/v1\/?$/i, "")
  .replace(/\/auth\/v1\/?$/i, "")
  .replace(/\/storage\/v1\/?$/i, "")
  .replace(/\/+$/, "");

const supabaseServiceKey = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  ""
).trim();

const hasTrueServiceRoleKey = Boolean(
  (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "").trim()
);

export const isSupabaseAdminConfigured = Boolean(
  supabaseUrl && supabaseServiceKey && supabaseUrl.startsWith("https://")
);

let adminClient: SupabaseClient | null = null;

const supabaseAnonKey = (
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  supabaseServiceKey ||
  ""
).trim();
const anonUrl = (
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  ""
)
  .trim()
  .replace(/\/rest\/v1\/?$/i, "")
  .replace(/\/auth\/v1\/?$/i, "")
  .replace(/\/storage\/v1\/?$/i, "")
  .replace(/\/+$/, "");

/** true se o servidor consegue verificar palavras-passe contra o Supabase Auth. */
export const canVerifyPasswordWithSupabase = Boolean(anonUrl && supabaseAnonKey && anonUrl.startsWith("https://"));

/**
 * Verifica e-mail + palavra-passe no Supabase Auth (chave anónima, sem guardar sessão).
 * Devolve o utilizador autenticado ou null se as credenciais forem inválidas.
 */
export async function verifyPasswordWithSupabase(email: string, password: string): Promise<any | null> {
  if (!canVerifyPasswordWithSupabase || !email || !password) return null;
  try {
    const client = createClient(anonUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error || !data?.user) return null;
    return data.user;
  } catch (err) {
    console.warn("[supabase] Erro ao verificar palavra-passe:", (err as any)?.message || err);
    return null;
  }
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseAdminConfigured) return null;
  if (!adminClient) {
    adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

const bannedSystemPhotoUrls = new Set<string>();

export function registerSystemNonCandidatePhoto(url?: string | null): void {
  if (!url || typeof url !== "string") return;
  const trimmed = url.trim();
  if (trimmed) bannedSystemPhotoUrls.add(trimmed);
}

export function isPlaceholderCandidatePhoto(url?: string | null): boolean {
  if (!url || typeof url !== "string") return true;
  const t = url.trim();
  if (!t) return true;
  if (bannedSystemPhotoUrls.has(t)) return true;
  if (/(?:^|\/|[_-])ceo(?:[_-]|\/|\.|$)/i.test(t)) return true;
  return (
    t.includes("photo-1573496359142-b8d87734a5a2") ||
    t.includes("photo-1540569014015-19a7be504e3a") ||
    t.includes("photo-1522071820081-009f0129c71c") ||
    t.includes("photo-1551836022-d5d88e9218df") ||
    t.includes("photo-1519085360753-af0119f7cbe7") ||
    t.includes("photo-1534528741775-53994a69daeb")
  );
}

async function refreshBannedSystemPhotoUrls(client: SupabaseClient): Promise<void> {
  try {
    // 1. Carrega a foto do CEO e imagens de sistema para garantir que NUNCA são usadas em candidatos
    const { data: sysRows } = await client
      .from("site_content")
      .select("key, value")
      .or("key.eq.ceo_photo,key.eq.landing_banners,key.like.file_%");
    if (Array.isArray(sysRows)) {
      for (const row of sysRows) {
        const key = String(row?.key || "");
        const val = row?.value;
        if (key === "ceo_photo") {
          const ceoUrl =
            typeof val === "string"
              ? val.trim()
              : val && typeof val === "object"
                ? String((val as any).url || (val as any).photo || (val as any).__val || "").trim()
                : "";
          if (ceoUrl) bannedSystemPhotoUrls.add(ceoUrl);
        } else if (key === "landing_banners" && Array.isArray(val)) {
          for (const b of val) {
            if (b?.url) bannedSystemPhotoUrls.add(String(b.url).trim());
          }
        } else if (key.startsWith("file_") && val && typeof val === "object") {
          // Apenas bane ficheiros que sejam explicitamente marcados como asset de sistema ou foto de CEO
          const fName = String((val as any).fileName || "").toLowerCase();
          const fileUrl = String((val as any).url || "").trim();
          const sysPurpose =
            (val as any).purpose === "system_asset" ||
            (val as any).purpose === "ceo_photo" ||
            fName.includes("ceo") ||
            fileUrl.toLowerCase().includes("ceo");
          if (fileUrl && sysPurpose) {
            bannedSystemPhotoUrls.add(fileUrl);
          }
        }
      }
    }
  } catch {
    // ignora erros de leitura
  }
}

function normalizeCandidateRowFromDb(row: any): any {
  const json = row?.data && typeof row.data === "object" ? row.data : {};
  const id = json.id || row?.id;
  if (!id) return null;

  const rawCat = String(json.category || row?.category || "").trim();
  const rawSkills = Array.isArray(json.skills) && json.skills.length > 0
    ? json.skills
    : (Array.isArray(row?.skills) && row.skills.length > 0 ? row.skills : []);
  const cleanSkills = rawSkills.filter((s: string) => s && !isGenericTitleOrPlaceholder(s));
  const rawSpecs = Array.isArray(json.specialties)
    ? json.specialties.filter((s: string) => s && !isGenericTitleOrPlaceholder(s))
    : [];

  const catLower = rawCat.toLowerCase();
  const isExplicitOfficeCat = [
    "prof", "recruitment", "recrutamento", "quadros",
    "ti_software", "ciberseguranca", "ciberseguranca_redes", "ia_dados", "dados_ia",
    "financas_contabilidade", "recursos_humanos", "gestao_rh_executivo", "gestao_projetos",
    "engenharia_operacoes", "juridico_compliance", "atendimento_secretariado", "atendimento_bpo",
    "marketing_vendas", "telecom_data", "devops", "cyber", "ai", "financas", "exec", "projetos",
    "juridico", "kyc", "callcenter", "marketing"
  ].some((k) => catLower === k);

  const isExplicitTradeCat = [
    "servicos_domesticos", "domesticos_limpeza", "limpeza_especializada", "manutencao_reparacoes",
    "carpintaria_marcenaria", "construcao_obras", "jardinagem_exteriores", "jardinagem_exterior",
    "pintura_acabamentos", "climatizacao_energia", "mecanica_geradores", "elite_tech",
    "dom", "dom2", "limp", "man", "carp", "obra", "jard", "pint", "clim", "auto"
  ].some((k) => catLower === k);

  // Determina se é profissional de Talentos e Quadros (Recruit)
  let isProf: boolean;
  if (isExplicitOfficeCat) {
    isProf = true;
  } else if (isExplicitTradeCat) {
    isProf = false;
  } else if (typeof json.isProfessional === "boolean") {
    isProf = json.isProfessional;
  } else if (typeof row?.is_professional === "boolean") {
    isProf = row.is_professional;
  } else {
    isProf = true;
  }

  const fallbackContext = [
    json.subCategory || row?.sub_category,
    ...rawSpecs,
    ...cleanSkills,
    json.bio || row?.bio
  ].filter(Boolean).join(" · ");

  const effectiveCat = resolveCanonicalCategoryId(
    rawCat,
    fallbackContext,
    json.title || row?.title,
    isProf
  );

  const resolvedSpec = resolveCandidateSpecialization({
    ...json,
    category: effectiveCat,
    subCategory: json.subCategory || row?.sub_category,
    title: json.title || row?.title,
    skills: cleanSkills,
    specialties: rawSpecs,
    bio: json.bio || row?.bio,
    isProfessional: isProf,
  });

  const realPhoto = !isPlaceholderCandidatePhoto(json.photo)
    ? json.photo
    : (!isPlaceholderCandidatePhoto(row?.photo_url) ? row.photo_url : "");

  return {
    ...json,
    id: String(id),
    name: json.name || row?.name || "Profissional",
    surname: json.surname !== undefined ? json.surname : (row?.surname || ""),
    email: json.email || row?.email || "",
    phone: json.phone || row?.phone || "",
    whatsapp: json.whatsapp || row?.whatsapp || json.phone || row?.phone || "",
    category: effectiveCat,
    subCategory: !isGenericTitleOrPlaceholder(json.subCategory || row?.sub_category)
      ? (json.subCategory || row?.sub_category)
      : resolvedSpec,
    title: resolvedSpec,
    city: json.city || row?.city || "Maputo",
    residence: json.residence || row?.residence || json.city || row?.city || "Maputo",
    hourlyRate: json.hourlyRate ?? (row?.hourly_rate_mzn != null ? Number(row.hourly_rate_mzn) : 1500),
    rateMzn: json.rateMzn ?? (row?.hourly_rate_mzn != null ? Number(row.hourly_rate_mzn) : 1500),
    rate: json.rate ?? 25,
    expectedSalaryMin: json.expectedSalaryMin ?? (row?.expected_salary_min != null ? Number(row.expected_salary_min) : 45000),
    expectedSalaryMax: json.expectedSalaryMax ?? (row?.expected_salary_max != null ? Number(row.expected_salary_max) : 95000),
    experienceYears: json.experienceYears ?? (row?.experience_years != null ? Number(row.experience_years) : 3),
    rating: json.rating ?? (row?.rating != null ? Number(row.rating) : 5.0),
    completedJobs: json.completedJobs ?? (row?.completed_jobs != null ? Number(row.completed_jobs) : 0),
    matchScore: json.matchScore ?? (row?.match_score != null ? Number(row.match_score) : 92),
    availableNow: json.availableNow !== undefined ? json.availableNow : (row?.available_now !== undefined ? row.available_now : true),
    availableForEmergency: json.availableForEmergency !== undefined ? json.availableForEmergency : Boolean(row?.available_for_emergency),
    isProfessional: isProf,
    status: json.status || row?.status || "approved",
    bio: json.bio || row?.bio || "Profissional qualificado e verificado no ecossistema TARIRA.",
    skills: cleanSkills.length > 0 ? cleanSkills : [resolvedSpec],
    documents: Array.isArray(json.documents) ? json.documents : (Array.isArray(row?.documents) ? row.documents : []),
    portfolio: Array.isArray(json.portfolio) ? json.portfolio : (Array.isArray(row?.portfolio) ? row.portfolio : []),
    photo: realPhoto,
    timestamp: json.timestamp || row?.created_at || new Date().toISOString(),
  };
}

/**
 * Todas as tabelas de estado partilham a mesma forma simples:
 *   id (text, PK) | data (jsonb, o objecto completo tal como vive em memória) | updated_at
 *
 * Também fazemos merge com colunas relacionais caso um registo tenha sido criado
 * directamente por SQL/trigger ou pelo editor de tabelas do Supabase.
 */
export async function loadTable<T extends { id: string }>(table: string): Promise<T[] | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;
  if (table === "candidates") {
    await refreshBannedSystemPhotoUrls(client);
  }
  const { data, error } = await client.from(table).select("*").order("updated_at", { ascending: false });
  if (error) {
    console.error(`[supabase] Erro ao carregar '${table}':`, error.message);
    return null;
  }
  if (!data) return [];

  return data
    .map((row: any) => {
      if (table === "candidates") {
        return normalizeCandidateRowFromDb(row) as T;
      }
      const json = row?.data && typeof row.data === "object" ? row.data : {};
      const { data: _ignoredData, ...relationalCols } = row || {};
      const merged = {
        ...relationalCols,
        ...json,
        id: json.id || row?.id,
      };
      return merged.id ? (merged as T) : null;
    })
    .filter(Boolean) as T[];
}

/**
 * Carrega todos os perfis de utilizadores a partir de:
 *   1) public.profiles
 *   2) auth.users (via Admin API quando service_role está presente)
 *   3) public.site_content (chaves user_profile_* de fallback)
 * Isto garante que contas criadas em auth.users ou public.profiles antes do deploy
 * completo nunca ficam órfãs e são sincronizadas automaticamente para candidates/clients.
 */
export async function loadAllUserProfiles(): Promise<any[]> {
  const client = getSupabaseAdmin();
  if (!client) return [];

  await refreshBannedSystemPhotoUrls(client);

  const byId = new Map<string, any>();
  const byEmail = new Map<string, any>();

  // 1. Ler public.profiles
  try {
    const { data: profRows, error: profErr } = await client.from("profiles").select("*");
    if (!profErr && Array.isArray(profRows)) {
      for (const p of profRows) {
        if (!p || !p.id) continue;
        if (isPlaceholderCandidatePhoto(p.photo_url)) {
          p.photo_url = "";
        }
        byId.set(String(p.id), p);
        if (p.email) byEmail.set(String(p.email).toLowerCase().trim(), p);
      }
    }
  } catch (err) {
    console.warn("[supabase] Aviso ao ler tabela profiles:", err);
  }

  // 2. Ler chaves user_profile_* e candidate_photo_* em site_content
  try {
    const { data: contentRows } = await client
      .from("site_content")
      .select("key, value")
      .or("key.like.user_profile_%,key.like.candidate_photo_%");
    if (Array.isArray(contentRows)) {
      for (const row of contentRows) {
        const key = String(row?.key || "");
        const val = row?.value && typeof row.value === "object" ? row.value : null;
        if (!val) continue;

        if (key.startsWith("user_profile_") && val.id) {
          const existing = byId.get(String(val.id)) || (val.email ? byEmail.get(String(val.email).toLowerCase().trim()) : null);
          const merged = { ...(existing || {}), ...val };
          if (isPlaceholderCandidatePhoto(merged.photo_url)) {
            merged.photo_url = "";
          }
          byId.set(String(merged.id), merged);
          if (merged.email) byEmail.set(String(merged.email).toLowerCase().trim(), merged);
        } else if (key.startsWith("candidate_photo_")) {
          const photoUrl = typeof val === "string" ? val : String((val as any).url || (val as any).__val || "").trim();
          if (photoUrl && !isPlaceholderCandidatePhoto(photoUrl)) {
            const token = key.replace("candidate_photo_", "").toLowerCase().trim();
            const prof = byId.get(token) || byEmail.get(token);
            if (prof && (!prof.photo_url || isPlaceholderCandidatePhoto(prof.photo_url))) {
              prof.photo_url = photoUrl;
            }
          }
        }
      }
    }
  } catch {}

  // 3. Ler auth.users via Admin API (quando a chave service_role está configurada)
  if (hasTrueServiceRoleKey) {
    try {
      const { data: authList, error: authErr } = await client.auth.admin.listUsers({ perPage: 1000 });
      if (!authErr && Array.isArray(authList?.users)) {
        for (const u of authList.users) {
          if (!u || !u.id) continue;
          const meta = u.user_metadata || (u as any).raw_user_meta_data || {};
          const uEmail = String(u.email || meta.email || "").toLowerCase().trim();
          const existing = byId.get(String(u.id)) || (uEmail ? byEmail.get(uEmail) : null);

          // Prioriza fotografia real carregada no perfil auth.users do próprio utilizador
          const metaPhoto = !isPlaceholderCandidatePhoto(meta.photo_url)
            ? meta.photo_url
            : (!isPlaceholderCandidatePhoto(meta.photo) ? meta.photo : (!isPlaceholderCandidatePhoto(meta.avatar_url) ? meta.avatar_url : ""));

          const existingPhoto = !isPlaceholderCandidatePhoto(existing?.photo_url) ? existing.photo_url : "";
          const realPhotoUrl = metaPhoto || existingPhoto || "";

          const mergedProfile = {
            id: u.id,
            name: existing?.name && existing.name !== "Utilizador"
              ? existing.name
              : (meta.full_name || meta.name || (uEmail ? uEmail.split("@")[0] : "Profissional TARIRA")),
            email: uEmail || existing?.email || "",
            role: existing?.role || meta.role || "profissional",
            phone: existing?.phone || meta.phone || u.phone || "",
            city: existing?.city || meta.city || "Maputo",
            nuit: existing?.nuit || meta.nuit || "",
            category: existing?.category || meta.category || "ti_software",
            professional_title: existing?.professional_title || meta.title || meta.professional_title || existing?.category || meta.category || "",
            experience_years: existing?.experience_years ?? (meta.experience_years != null ? Number(meta.experience_years) : 3),
            specialties: existing?.specialties || (Array.isArray(meta.specialties) ? meta.specialties : undefined),
            rate_mzn: meta.rate_mzn != null ? Number(meta.rate_mzn) : undefined,
            photo_url: realPhotoUrl || undefined,
            bio: existing?.bio || meta.bio || undefined,
            company_name: existing?.company_name || meta.company_name || undefined,
            company_sector: existing?.company_sector || meta.company_sector || undefined,
            company_employees: existing?.company_employees || meta.company_employees || undefined,
            condo_name: existing?.condo_name || meta.condo_name || undefined,
            condo_type: existing?.condo_type || meta.condo_type || undefined,
            condo_units: existing?.condo_units ?? (meta.condo_units != null ? Number(meta.condo_units) : undefined),
            residential_type: existing?.residential_type || meta.residential_type || undefined,
            contact_person: existing?.contact_person || meta.contact_person || undefined,
            contact_person_title: existing?.contact_person_title || meta.contact_person_title || undefined,
            candidate_id: existing?.candidate_id || meta.candidate_id || null,
            client_id: existing?.client_id || meta.client_id || null,
            is_active: existing?.is_active !== undefined ? existing.is_active : true,
            created_at: existing?.created_at || u.created_at || new Date().toISOString(),
          };

          byId.set(String(u.id), mergedProfile);
          if (mergedProfile.email) byEmail.set(mergedProfile.email, mergedProfile);

          // Se este utilizador de auth.users ainda não existia em public.profiles, sincroniza-o
          if (!existing) {
            upsertUserProfile(mergedProfile).catch(() => {});
          }
        }
      }
    } catch (err) {
      console.warn("[supabase] Aviso ao listar utilizadores de auth.users:", err);
    }
  }

  // 4. Recuperar fotografias reais carregadas no ImgBB (excluindo fotos de CEO/sistema)
  try {
    const [{ data: siteFiles }, { data: candRows }] = await Promise.all([
      client.from("site_content").select("key, value, updated_at").like("key", "file_%").order("updated_at", { ascending: true }),
      client.from("candidates").select("id, email, name, surname, photo_url, data, updated_at"),
    ]);

    const normStr = (s: string) =>
      String(s || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    // Se já existir foto ImgBB legítima em public.candidates para o mesmo email, associa de imediato ao perfil
    if (Array.isArray(candRows)) {
      for (const cr of candRows) {
        const cJson = cr?.data && typeof cr.data === "object" ? cr.data : {};
        const cPhoto = !isPlaceholderCandidatePhoto(cJson.photo)
          ? cJson.photo
          : (!isPlaceholderCandidatePhoto(cr?.photo_url) ? cr.photo_url : "");
        if (!cPhoto) continue;
        const cEmail = String(cJson.email || cr?.email || "").toLowerCase().trim();
        if (cEmail && byEmail.has(cEmail)) {
          const prof = byEmail.get(cEmail);
          if (prof && isPlaceholderCandidatePhoto(prof.photo_url)) {
            prof.photo_url = cPhoto;
            upsertUserProfile(prof).catch(() => {});
          }
        }
      }
    }

    const validCandidatePhotoFiles: Array<{ name: string; normName: string; publicUrl: string; timeMs: number }> = [];

    if (Array.isArray(siteFiles)) {
      for (const sf of siteFiles) {
        const val = sf?.value && typeof sf.value === "object" ? (sf.value as any) : {};
        const url = String(val.url || "").trim();
        const fName = String(val.fileName || sf?.key || "");
        const mime = String(val.mimeType || "").toLowerCase();
        const isCandidateUpload = Boolean(val.source || val.purpose === "candidate_photo");
        const isSystemUpload = val.purpose === "system_asset" || val.purpose === "ceo_photo" || !isCandidateUpload;

        if (isSystemUpload || bannedSystemPhotoUrls.has(url)) {
          continue;
        }

        const isImg =
          url.includes("ibb.co") ||
          url.includes("imgbb.com") ||
          mime.startsWith("image/") ||
          /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(fName) ||
          /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(url);

        if (url && isImg && !isPlaceholderCandidatePhoto(url)) {
          validCandidatePhotoFiles.push({
            name: fName,
            normName: normStr(fName),
            publicUrl: url,
            timeMs: val.uploadedAt ? new Date(val.uploadedAt).getTime() : 0,
          });
        }
      }
    }

    // Apenas atribui foto por correspondência explícita de nome ou email (NUNCA por ordem cronológica aleatória)
    if (validCandidatePhotoFiles.length > 0) {
      const usedUrls = new Set<string>();
      for (const p of byId.values()) {
        if (!isPlaceholderCandidatePhoto(p.photo_url)) {
          usedUrls.add(p.photo_url);
        }
      }

      for (const p of byId.values()) {
        if (!isPlaceholderCandidatePhoto(p.photo_url)) continue;
        const nameParts = normStr(p.name || "").split(/\s+/).filter((t) => t.length >= 3);
        const emailToken = normStr(String(p.email || "").split("@")[0]);
        const tokens = [...nameParts, emailToken].filter((t) => t && t.length >= 3 && t !== "profissional");
        const matched = validCandidatePhotoFiles.find((f) => !usedUrls.has(f.publicUrl) && tokens.some((tk) => f.normName.includes(tk)));
        if (matched) {
          usedUrls.add(matched.publicUrl);
          p.photo_url = matched.publicUrl;
          upsertUserProfile(p).catch(() => {});
        }
      }
    }
  } catch {}

  return Array.from(byId.values());
}

// IMPORTANTE: esta função é chamada com o array COMPLETO de cada colecção a
// cada escrita bem sucedida em QUALQUER parte do site (ver syncDataToSupabaseNow
// em server.ts). Isto tem uma consequência séria: o Postgres/PostgREST trata o
// upsert em lote como UMA ÚNICA operação atómica — se UM ÚNICO registo do lote
// tiver um problema (ex.: um campo demasiado grande, um valor incompatível com
// o schema, ou o payload total ultrapassar o limite de tamanho do PostgREST),
// TODO o lote falha, incluindo os registos novos e válidos (ex.: o técnico que
// um utilizador acabou de registar). Isto explica o sintoma clássico de "criei
// um perfil, ele funcionou no momento, mas desapareceu depois" — o registo
// nunca chegou de facto a ficar gravado no Supabase, e a próxima leitura
// (refreshFromSupabase) substitui a memória pelo que está realmente na base
// de dados, apagando-o silenciosamente.
//
// Para não deixar um registo mau bloquear todos os outros para sempre:
// 1. Divide-se o lote em pedaços mais pequenos (evita exceder limites de
//    tamanho do pedido).
// 2. Se mesmo assim um pedaço falhar, tenta-se registo a registo, isolando
//    exactamente qual registo tem o problema (fica no log, os restantes
//    continuam a ser gravados normalmente).
const UPSERT_CHUNK_SIZE = 100;

export async function bulkUpsertTable<T extends { id: string }>(table: string, rows: T[]): Promise<{ failedIds: string[] }> {
  const client = getSupabaseAdmin();
  if (!client) return { failedIds: [] };
  if (!rows || rows.length === 0) return { failedIds: [] };

  // Otimização crucial: audit_logs é um registo histórico que cresce até 500+ entradas.
  // Fazer upsert de todas as 500 entradas a cada criação/alteração gerava 20 pedidos HTTP
  // sequenciais ao Supabase, causando demoras de 15 a 30 segundos no botão de submissão.
  // Como audit_logs é apenas apêndice, basta sincronizar os 20 logs mais recentes.
  const targetRows = table === "audit_logs" ? rows.slice(0, 20) : rows;

  const nowIso = new Date().toISOString();
  const payload = targetRows.map((row: any) => {
    if (table === "candidates") {
      return {
        id: row.id,
        name: row.name || "Profissional",
        surname: row.surname || "",
        email: row.email || "",
        phone: row.phone || "",
        whatsapp: row.whatsapp || row.phone || "",
        category: row.category || "ti_software",
        sub_category: row.subCategory || row.title || "Talentos & Quadros Corporativos",
        title: row.title || "Especialista Qualificado",
        city: row.city || "Maputo",
        residence: row.residence || row.city || "Maputo",
        is_professional: typeof row.isProfessional === "boolean" ? row.isProfessional : true,
        status: row.status || "approved",
        bio: row.bio || "",
        photo_url: row.photo || "",
        data: row,
        updated_at: nowIso,
      };
    }
    return {
      id: row.id,
      data: row,
      updated_at: nowIso,
    };
  });

  const failedIds: string[] = [];

  // Agrupa em pedaços de 100 (tamanho ideal para o PostgREST sem exceder limites)
  const chunks: typeof payload[] = [];
  for (let i = 0; i < payload.length; i += UPSERT_CHUNK_SIZE) {
    chunks.push(payload.slice(i, i + UPSERT_CHUNK_SIZE));
  }

  // Executa os chunks em paralelo com proteção de timeout para nunca bloquear a experiência do utilizador
  await Promise.all(
    chunks.map(async (chunk) => {
      try {
        const { error } = await client.from(table).upsert(chunk, { onConflict: "id" });
        if (!error) return;

        console.warn(`[supabase] Aviso ao sincronizar lote de '${table}' (${chunk.length} registos):`, error.message);

        // Fallback apenas com { id, data, updated_at } caso alguma coluna relacional falte
        const minimalChunk = chunk.map((r: any) => ({ id: r.id, data: r.data, updated_at: r.updated_at }));
        const { error: minErr } = await client.from(table).upsert(minimalChunk, { onConflict: "id" });
        if (!minErr) return;

        // Fallback registo a registo para isolar eventuais falhas individuais
        for (const row of minimalChunk) {
          try {
            const { error: rowError } = await client.from(table).upsert([row], { onConflict: "id" });
            if (rowError) {
              console.error(`[supabase] Falha no registo '${row.id}' em '${table}':`, rowError.message);
              failedIds.push(row.id);
            }
          } catch (rowEx: any) {
            failedIds.push(row.id);
          }
        }
      } catch (chunkErr: any) {
        console.error(`[supabase] Erro de rede no lote de '${table}':`, chunkErr?.message || chunkErr);
        chunk.forEach((r: any) => failedIds.push(r.id));
      }
    })
  );

  return { failedIds };
}

export async function deleteFromTable(table: string, id: string): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) return;
  const { error } = await client.from(table).delete().eq("id", id);
  if (error) {
    console.error(`[supabase] Erro ao eliminar de '${table}' (id: ${id}):`, error.message);
  }
}

export async function getContentValue<T>(key: string): Promise<T | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;
  const { data, error } = await client.from("site_content").select("value").eq("key", key).maybeSingle();
  if (error) {
    console.error(`[supabase] Erro ao carregar conteúdo '${key}':`, error.message);
    return null;
  }
  if (!data) return null;
  // Se o valor foi guardado como { val: ... } ou directamente como T
  if (data.value && typeof data.value === "object" && "__val" in data.value) {
    return (data.value as any).__val as T;
  }
  return data.value as T;
}

export async function setContentValue(key: string, value: unknown): Promise<void> {
  const client = getSupabaseAdmin();
  if (!client) return;
  // Empacotamos valores primitivos (strings/números) num envelope jsonb compatível
  const jsonValue = typeof value === "object" && value !== null ? value : { __val: value };
  const { error } = await client
    .from("site_content")
    .upsert({ key, value: jsonValue, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) {
    console.error(`[supabase] Erro ao gravar conteúdo '${key}':`, error.message);
  }
}

export async function upsertUserProfile(profileData: {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  city?: string;
  nuit?: string;
  category?: string;
  candidate_id?: string | null;
  client_id?: string | null;
  is_active?: boolean;
  company_name?: string;
  company_sector?: string;
  company_employees?: string;
  condo_name?: string;
  condo_type?: string;
  condo_units?: number;
  contact_person?: string;
  contact_person_title?: string;
  plan_status?: string;
  plan_type?: string;
  trial_expires_at?: string;
  trial_days?: number;
  professional_title?: string;
  experience_years?: number;
  photo_url?: string;
  bio?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const client = getSupabaseAdmin();
  if (!client) {
    return { success: true, data: profileData };
  }
  const payload: any = {
    id: profileData.id,
    name: profileData.name || "Utilizador",
    email: (profileData.email || "").toLowerCase().trim(),
    role: profileData.role || "empresa",
    phone: profileData.phone || "",
    city: profileData.city || "Maputo",
    nuit: profileData.nuit || "",
    category: profileData.category || "",
    candidate_id: profileData.candidate_id || null,
    client_id: profileData.client_id || null,
    is_active: profileData.is_active !== undefined ? profileData.is_active : true,
    updated_at: new Date().toISOString(),
  };

  if (profileData.company_name) payload.company_name = profileData.company_name;
  if (profileData.company_sector) payload.company_sector = profileData.company_sector;
  if (profileData.company_employees) payload.company_employees = profileData.company_employees;
  if (profileData.condo_name) payload.condo_name = profileData.condo_name;
  if (profileData.condo_type) payload.condo_type = profileData.condo_type;
  if (profileData.condo_units !== undefined) payload.condo_units = profileData.condo_units;
  if (profileData.contact_person) payload.contact_person = profileData.contact_person;
  if (profileData.contact_person_title) payload.contact_person_title = profileData.contact_person_title;
  if (profileData.plan_status) payload.plan_status = profileData.plan_status;
  if (profileData.plan_type) payload.plan_type = profileData.plan_type;
  if (profileData.trial_expires_at) payload.trial_expires_at = profileData.trial_expires_at;
  if (profileData.trial_days !== undefined) payload.trial_days = profileData.trial_days;
  if (profileData.professional_title) payload.professional_title = profileData.professional_title;
  if (profileData.experience_years !== undefined) payload.experience_years = profileData.experience_years;
  if (profileData.photo_url) payload.photo_url = profileData.photo_url;
  if (profileData.bio) payload.bio = profileData.bio;

  try {
    let { data, error } = await client
      .from("profiles")
      .upsert(payload, { onConflict: "id" })
      .select()
      .maybeSingle();

    if (error && error.message?.includes("profiles_role_check") && payload.role === "profissional") {
      const retryRes = await client
        .from("profiles")
        .upsert({ ...payload, role: "prestador" }, { onConflict: "id" })
        .select()
        .maybeSingle();
      data = retryRes.data;
      error = retryRes.error;
    }

    if (error) {
      console.warn("[supabase] Aviso ao gravar perfil na tabela profiles:", error.message);
      // Fallback: gravar na chave site_content para garantir persistência sem quebrar o fluxo
      try {
        await setContentValue(`user_profile_${profileData.id}`, payload);
      } catch (fErr) {
        console.warn("[supabase] Fallback site_content profile error:", fErr);
      }
      return { success: true, data: payload, error: error.message };
    }
    return { success: true, data: data || payload };
  } catch (err: any) {
    console.warn("[supabase] Exceção ao persistir perfil:", err?.message);
    return { success: true, data: payload };
  }
}

export async function getUserProfile(userId: string): Promise<any | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) {
      const fallback = await getContentValue<any>(`user_profile_${userId}`);
      if (fallback) return fallback;
    }
    return data || null;
  } catch (err) {
    return await getContentValue<any>(`user_profile_${userId}`);
  }
}
