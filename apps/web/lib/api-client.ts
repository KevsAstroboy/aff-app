// In Docker: NEXT_PUBLIC_API_URL=/api (relative, nginx proxies to backend)
// In dev: NEXT_PUBLIC_API_URL=http://localhost:3000 (absolute, backend has /api prefix)
const ENV_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// For client-side: use relative path if set, otherwise absolute
// For server-side: need absolute URL pointing to backend's /api prefix
function getBaseUrl(): string {
  // Browser: use relative URL if configured
  if (typeof window !== "undefined") {
    if (ENV_URL.startsWith("/")) {
      return `${window.location.origin}${ENV_URL}`;
    }
    // Dev mode: backend at localhost:3000 with /api prefix
    return `${ENV_URL}/api`;
  }
  // Server-side / SSR: call backend directly with /api prefix
  if (ENV_URL.startsWith("/")) {
    // In Docker: nginx proxies /api to backend, but SSR runs inside container
    // so we call backend directly at localhost:3000/api
    return `http://127.0.0.1:3000/api`;
  }
  // Dev mode server-side
  return `${ENV_URL}/api`;
}

export { getBaseUrl };

let token: string | null = null;

export function setApiToken(t: string | null) {
  token = t;
}

export function getApiToken() {
  return token;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Erreur réseau" }));
    throw body;
  }
  return res.json();
}

function headers(overrides?: Record<string, string>): Record<string, string> {
  const h: Record<string, string> = { ...overrides };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

export const apiClient = {
  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const base = getBaseUrl();
    const url = new URL(`${base}${path}`);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
      }
    }
    const res = await fetch(url, { headers: headers() });
    return handleResponse<T>(res);
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    const base = getBaseUrl();
    const res = await fetch(`${base}${path}`, {
      method: "POST",
      headers: headers({ "Content-Type": "application/json" }),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const base = getBaseUrl();
    const res = await fetch(`${base}${path}`, {
      method: "PATCH",
      headers: headers({ "Content-Type": "application/json" }),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async delete<T>(path: string): Promise<T> {
    const base = getBaseUrl();
    const res = await fetch(`${base}${path}`, {
      method: "DELETE",
      headers: headers(),
    });
    return handleResponse<T>(res);
  },

  async upload<T>(path: string, formData: FormData): Promise<T> {
    const base = getBaseUrl();
    const res = await fetch(`${base}${path}`, {
      method: "POST",
      headers: headers(),
      body: formData,
    });
    return handleResponse<T>(res);
  },
};
