import { Request, Response, NextFunction } from "express";
import {
  AuthenticatedSessionPayload,
  extractSessionFromRequest,
  isAdminSession,
} from "./serverSecurity.js";

/**
 * ============================================================================
 * TARIRA — Controlo de Acesso da API (autorização no servidor)
 *
 * - Rotas com dados internos/pessoais: só administrador.
 * - Rotas com dados "do utilizador" (contratações, pagamentos, clientes...):
 *   sessão obrigatória; cada utilizador só recebe os SEUS registos.
 * - Lista pública de candidatos: sem contactos, documentos de identificação nem dados financeiros.
 * - Escritas sobre um candidato/cliente: só o próprio dono ou o administrador.
 * ============================================================================
 */

interface AccessDeps {
  getCandidates: () => any[];
  getClients: () => any[];
}

const lc = (v: unknown) => String(v ?? "").toLowerCase().trim();

function deny401(res: Response) {
  res.status(401).json({
    error: "Para concluir esta ação precisa de iniciar sessão (ou criar uma conta gratuita).",
    code: "UNAUTHORIZED",
  });
}

function deny403(res: Response, code = "FORBIDDEN") {
  res.status(403).json({
    error: "Acesso negado: não tem permissão para aceder a este recurso.",
    code,
  });
}

// Campos de um candidato que nunca saem na lista pública
const PRIVATE_CANDIDATE_KEYS = [
  "email",
  "phone",
  "whatsapp",
  "identityDocName",
  "identityDocUrl",
  "cvDocumentName",
  "cvDocName",
  "cvDocumentUrl",
  "pendingEarnings",
  "withdrawnAmount",
  "nuit",
  "bi",
  "iban",
  "bankAccount",
  "bankName",
  "mpesaNumber",
  "emolaNumber",
  "password",
  "passwordHash",
  "deletedBy",
  "deletedAt",
  "deletedRole",
];

// Campos que o próprio dono NÃO pode alterar (só o administrador)
const CANDIDATE_ADMIN_ONLY_FIELDS = [
  "status",
  "pendingEarnings",
  "withdrawnAmount",
  "rating",
  "reviews",
  "reviewsCount",
  "completedServicesCount",
  "completedJobs",
  "matchScore",
  "promiseScore",
  "deletedBy",
  "deletedAt",
  "deletedRole",
];

export function publicCandidate(c: any): any {
  if (!c || typeof c !== "object") return c;
  const out: any = { ...c };
  for (const k of PRIVATE_CANDIDATE_KEYS) delete out[k];
  if (Array.isArray(out.documents)) {
    out.documents = out.documents.map((d: any) => {
      if (!d || typeof d !== "object") return d;
      const { url, ...rest } = d;
      return rest;
    });
  }
  return out;
}

export function createAccessControl(deps: AccessDeps) {
  const ownedCandidateIds = (session: AuthenticatedSessionPayload): Set<string> => {
    const ids = new Set<string>();
    if (session.candidateId) ids.add(String(session.candidateId));
    const email = lc(session.email);
    for (const c of deps.getCandidates()) {
      if (!c) continue;
      if (c.id === session.userId || (email && lc(c.email) === email)) ids.add(String(c.id));
    }
    return ids;
  };

  const ownedClientIds = (session: AuthenticatedSessionPayload): Set<string> => {
    const ids = new Set<string>();
    if (session.clientId) ids.add(String(session.clientId));
    const email = lc(session.email);
    for (const c of deps.getClients()) {
      if (!c) continue;
      if (c.id === session.userId || (email && lc(c.email) === email)) ids.add(String(c.id));
    }
    return ids;
  };

  // Aplica uma transformação ao corpo JSON devolvido pela rota
  const transformJson = (res: Response, fn: (body: any) => any) => {
    const original = res.json.bind(res);
    (res as any).json = (body: any) => original(fn(body));
  };

  const ADMIN_ONLY_GET: RegExp[] = [
    /^\/logs$/,
    /^\/email-confirmations$/,
    /^\/operators(\/[^/]+)?$/,
    /^\/briefings$/,
    /^\/contact$/,
    /^\/commercial-proposals$/,
    /^\/proposal-emails$/,
    /^\/spontaneous-applications$/,
    /^\/diagnostics$/,
    /^\/recruit\/subscriptions$/,
  ];

  /**
   * Política central, montada em app.use("/api", ...) ANTES de todas as rotas.
   * Os caminhos são relativos a /api.
   */
  const apiAccessPolicy = (req: Request, res: Response, next: NextFunction): void => {
    const path = req.path.replace(/\/+$/, "") || "/";
    const method = req.method.toUpperCase();
    const session = extractSessionFromRequest(req);
    const admin = isAdminSession(session);

    // ---------- Leituras ----------
    if (method === "GET") {
      if (ADMIN_ONLY_GET.some((r) => r.test(path))) {
        if (!session) return deny401(res);
        if (!admin) return deny403(res, "FORBIDDEN_ADMIN_ONLY");
        return next();
      }

      // Lista/ficha de candidatos: pública, mas sem dados privados (excepto admin e o próprio)
      if (path === "/candidates") {
        const own = session && !admin ? ownedCandidateIds(session) : new Set<string>();
        transformJson(res, (body) => {
          if (!Array.isArray(body)) return body;
          if (admin) return body;
          return body.map((c) => (c && own.has(String(c.id)) ? c : publicCandidate(c)));
        });
        return next();
      }
      const candOne = path.match(/^\/candidates\/([^/]+)$/);
      if (candOne) {
        const own = session && !admin ? ownedCandidateIds(session) : new Set<string>();
        transformJson(res, (body) => {
          if (!body || typeof body !== "object" || !body.id) return body;
          if (admin || own.has(String(body.id))) return body;
          return publicCandidate(body);
        });
        return next();
      }

      // Listas com dados do utilizador: sessão obrigatória + filtro por dono
      if (path === "/hires") {
        if (!session) return deny401(res);
        if (!admin) {
          const cands = ownedCandidateIds(session);
          const cls = ownedClientIds(session);
          transformJson(res, (body) =>
            Array.isArray(body)
              ? body.filter(
                  (h) => h && (cands.has(String(h.candidateId)) || (h.clientId && cls.has(String(h.clientId))))
                )
              : body
          );
        }
        return next();
      }
      if (path === "/payments") {
        if (!session) return deny401(res);
        if (!admin) {
          const email = lc(session.email);
          transformJson(res, (body) =>
            Array.isArray(body)
              ? body.filter((p) => p && (p.userId === session.userId || (email && lc(p.userEmail) === email)))
              : body
          );
        }
        return next();
      }
      if (path === "/payout-requests") {
        if (!session) return deny401(res);
        if (!admin) {
          const cands = ownedCandidateIds(session);
          transformJson(res, (body) =>
            Array.isArray(body) ? body.filter((p) => p && cands.has(String(p.candidateId))) : body
          );
        }
        return next();
      }
      if (path === "/clients") {
        if (!session) return deny401(res);
        if (!admin) {
          const cls = ownedClientIds(session);
          transformJson(res, (body) =>
            Array.isArray(body) ? body.filter((c) => c && cls.has(String(c.id))) : body
          );
        }
        return next();
      }
      const clientOne = path.match(/^\/clients\/([^/]+)$/);
      if (clientOne) {
        if (!session) return deny401(res);
        if (!admin && !ownedClientIds(session).has(clientOne[1])) return deny403(res, "FORBIDDEN_NOT_OWNER");
        return next();
      }
      if (path === "/consulting/requests") {
        if (!session) return deny401(res);
        if (!admin) {
          const email = lc(session.email);
          transformJson(res, (body) =>
            Array.isArray(body) ? body.filter((r) => r && email && lc(r.clientEmail) === email) : body
          );
        }
        return next();
      }
    }

    // ---------- Escritas que exigem sessão ----------
    if (method === "POST" && (path === "/logs" || path === "/hires" || path === "/payments")) {
      if (!session) return deny401(res);
      return next();
    }

    return next();
  };

  const requireSession = (req: Request, res: Response): AuthenticatedSessionPayload | null => {
    const session = extractSessionFromRequest(req);
    if (!session) {
      deny401(res);
      return null;
    }
    (req as any).session = session;
    return session;
  };

  /** Só o próprio candidato (ou o administrador) pode alterar/apagar este candidato. */
  const candidateOwnerOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const session = requireSession(req, res);
    if (!session) return;
    if (isAdminSession(session)) return next();
    if (!ownedCandidateIds(session).has(String(req.params.id))) {
      console.warn(`[CYBER-SHIELD ALERTA IDOR]: ${session.email} tentou alterar o candidato ${req.params.id}`);
      return deny403(res, "FORBIDDEN_NOT_OWNER");
    }
    if (req.body && typeof req.body === "object") {
      for (const k of CANDIDATE_ADMIN_ONLY_FIELDS) delete req.body[k];
    }
    next();
  };

  /** Só o próprio cliente (ou o administrador) pode alterar/apagar este cliente. */
  const clientOwnerOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const session = requireSession(req, res);
    if (!session) return;
    if (isAdminSession(session)) return next();
    if (!ownedClientIds(session).has(String(req.params.id))) {
      console.warn(`[CYBER-SHIELD ALERTA IDOR]: ${session.email} tentou alterar o cliente ${req.params.id}`);
      return deny403(res, "FORBIDDEN_NOT_OWNER");
    }
    if (req.body && typeof req.body === "object") {
      // Só o financeiro/admin ativa planos ou altera preços
      if (req.body.planStatus === "active") delete req.body.planStatus;
      delete req.body.planPriceMzn;
    }
    next();
  };

  return { apiAccessPolicy, candidateOwnerOrAdmin, clientOwnerOrAdmin, ownedCandidateIds, ownedClientIds };
}
