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

/**
 * Cabeçalhos prontos a espalhar (spread) em qualquer fetch() que precise de
 * provar autenticação: fetch(url, { headers: { ...getAuthHeaders() } })
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getStoredSessionToken();
  // Nunca enviar cabeçalhos "de administrador": a autorização é feita no servidor
  // exclusivamente pelo token de sessão assinado.
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
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
    let sentToken = false;
    let nextInit = init;
    if (token) {
      const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
      if (!headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
        sentToken = true;
      }
      nextInit = { ...(init || {}), headers };
    }

    const response = await originalFetch(input, nextInit);
    if (response.status === 401) {
      if (sentToken) {
        // Sessão expirada/inválida: descarta o token para não repetir pedidos falhados
        try {
          if (getStoredSessionToken() === token) clearStoredSessionToken();
        } catch {}
      }
      // Só perguntamos pelo login quando o utilizador tentou FAZER algo (não em cargas em segundo plano)
      try {
        const method = String(init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
        const raw = typeof input === "string" ? input : input instanceof URL ? input.href : (input as Request).url;
        const pathname = new URL(raw, window.location.origin).pathname;
        const isAuthEndpoint = pathname.startsWith("/api/auth/") || pathname === "/api/admin/login";
        const now = Date.now();
        if (method !== "GET" && method !== "HEAD" && !isAuthEndpoint && now - lastAuthRequiredAt > 3000) {
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
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let out = "";
  for (let i = 0; i < length; i++) out += alphabet[bytes[i] % alphabet.length];
  return out + "#7";
}
