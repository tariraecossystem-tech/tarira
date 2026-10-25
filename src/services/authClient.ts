// ============================================================================
// TARIRA — Cliente de Sessão Autenticada (Cyber-Shield)
// Guarda e anexa o token assinado (HMAC) emitido pelo servidor após
// login/registo, para que os pedidos administrativos e de alteração de
// dados possam ser validados como pedidos legítimos e não anónimos.
// ============================================================================

const SESSION_TOKEN_KEY = "tarira_session_token";

export const SESSION_CHANGED_EVENT = "tarira-session-changed";
/** Disparado quando uma ação do utilizador (POST/PUT/DELETE) é recusada por falta de sessão. */
export const AUTH_REQUIRED_EVENT = "tarira-auth-required";

export function setStoredSessionToken(token: string | null | undefined): void {
  let changed = false;
  try {
    const previous = localStorage.getItem(SESSION_TOKEN_KEY) || "";
    if (token) {
      localStorage.setItem(SESSION_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(SESSION_TOKEN_KEY);
    }
    changed = previous !== (token || "");
  } catch {
    // localStorage indisponível (modo privado, etc.) — falha silenciosa
  }
  // Avisa a aplicação para recarregar os dados protegidos com a nova sessão
  if (changed && typeof window !== "undefined") {
    try {
      window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
    } catch {}
  }
}

export function getStoredSessionToken(): string {
  try {
    return localStorage.getItem(SESSION_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function clearStoredSessionToken(): void {
  setStoredSessionToken(null);
}

function getStoredAuthenticatedIdentity(): { userId?: string; email?: string; candidateId?: string } {
  try {
    const raw =
      localStorage.getItem("tarira_authenticated_session") ||
      sessionStorage.getItem("tarira_auth_session") ||
      "";
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const email = String(
      parsed?.user?.email || parsed?.profile?.email || parsed?.professional?.email || parsed?.client?.email || ""
    )
      .toLowerCase()
      .trim();
    const userId = String(parsed?.user?.id || parsed?.profile?.id || "").trim();
    const candidateId = String(parsed?.profile?.candidate_id || parsed?.professional?.id || "").trim();
    return {
      userId: userId || undefined,
      email: email || undefined,
      candidateId: candidateId || undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Cabeçalhos prontos a espalhar (spread) em qualquer fetch() que precise de
 * provar autenticação: fetch(url, { headers: { ...getAuthHeaders() } })
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getStoredSessionToken();
  const identity = getStoredAuthenticatedIdentity();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (identity.email) {
    headers["X-Tarira-User-Email"] = identity.email;
  }
  if (identity.userId) {
    headers["X-Tarira-User-Id"] = identity.userId;
  }
  if (identity.candidateId) {
    headers["X-Tarira-Candidate-Id"] = identity.candidateId;
  }
  return headers;
}

/**
 * Anexa automaticamente o token de sessão (Authorization: Bearer ...) a TODOS os pedidos
 * feitos à API do próprio site (/api/...). Assim, cada pedido chega ao servidor identificado,
 * e o servidor decide o que essa sessão pode ver/fazer.
 * Se o servidor responder 401 a um pedido com token, o token (expirado/inválido) é descartado.
 */
let authFetchInstalled = false;
let lastAuthRequiredAt = 0;
export function installAuthFetch(): void {
  if (authFetchInstalled || typeof window === "undefined" || typeof window.fetch !== "function") return;
  authFetchInstalled = true;
  const originalFetch = window.fetch.bind(window);

  const isApiUrl = (input: RequestInfo | URL): boolean => {
    try {
      const raw = typeof input === "string" ? input : input instanceof URL ? input.href : (input as Request).url;
      const url = new URL(raw, window.location.origin);
      return url.origin === window.location.origin && url.pathname.startsWith("/api/");
    } catch {
      return false;
    }
  };

  const wrappedFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    if (!isApiUrl(input)) return originalFetch(input, init);

    const token = getStoredSessionToken();
    const identity = getStoredAuthenticatedIdentity();
    let sentToken = false;
    const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
      sentToken = true;
    }
    if (identity.email && !headers.has("X-Tarira-User-Email")) {
      headers.set("X-Tarira-User-Email", identity.email);
    }
    if (identity.userId && !headers.has("X-Tarira-User-Id")) {
      headers.set("X-Tarira-User-Id", identity.userId);
    }
    if (identity.candidateId && !headers.has("X-Tarira-Candidate-Id")) {
      headers.set("X-Tarira-Candidate-Id", identity.candidateId);
    }
    const nextInit: RequestInit = { ...(init || {}), headers };

    const response = await originalFetch(input, nextInit);
    if (response.status === 401) {
      if (sentToken) {
        // Sessão expirada/inválida: descarta o token para não repetir pedidos falhados
        try {
          if (getStoredSessionToken() === token) clearStoredSessionToken();
        } catch {}
      }
      // Só perguntamos pelo login quando o utilizador não tem sessão autenticada ativa
      try {
        const method = String(init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
        const raw = typeof input === "string" ? input : input instanceof URL ? input.href : (input as Request).url;
        const pathname = new URL(raw, window.location.origin).pathname;
        const isAuthEndpoint =
          pathname.startsWith("/api/auth/") ||
          pathname === "/api/admin/login" ||
          pathname.startsWith("/api/candidates");
        const now = Date.now();
        if (
          method !== "GET" &&
          method !== "HEAD" &&
          !isAuthEndpoint &&
          !identity.email &&
          now - lastAuthRequiredAt > 3000
        ) {
          lastAuthRequiredAt = now;
          window.dispatchEvent(
            new CustomEvent(AUTH_REQUIRED_EVENT, {
              detail: { reason: token ? "SESSAO_EXPIRADA" : "SESSAO_NECESSARIA" },
            })
          );
        }
      } catch {}
    }
    return response;
  };

  try {
    Object.defineProperty(window, "fetch", {
      value: wrappedFetch,
      writable: true,
      configurable: true,
      enumerable: true,
    });
  } catch {
    try {
      (window as any).fetch = wrappedFetch;
    } catch (e) {
      console.warn("[TARIRA Auth] Could not monkey-patch window.fetch in this environment:", e);
    }
  }
}

/**
 * Palavra-passe aleatória e forte (criptograficamente segura) — para contas criadas
 * sem palavra-passe explícita. Nunca usar palavras-passe fixas/por defeito.
 */
export function randomPassword(length = 14): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i++) out += alphabet[bytes[i] % alphabet.length];
  return out + "#7";
}
