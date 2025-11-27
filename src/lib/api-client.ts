const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
  : '';

export const isApiConfigured = Boolean(API_URL);

interface ApiFetchOptions extends RequestInit {
  requireAuth?: boolean;
  skipJson?: boolean;
}

const TOKEN_KEY = 'pc_access_token';

export const authStorage = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },
};

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  if (!isApiConfigured) {
    throw new Error('API URL não configurada. Defina NEXT_PUBLIC_API_URL.');
  }

  const { requireAuth = true, skipJson = false, headers, ...rest } = options;

  const resolvedHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (requireAuth) {
    const token = authStorage.getToken();
    if (!token) {
      throw new Error('Usuário não autenticado.');
    }
    resolvedHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: resolvedHeaders,
  });

  if (!response.ok) {
    let message = 'Erro ao comunicar com a API.';
    try {
      const errorData = await response.json();
      message = errorData?.message || message;
    } catch (_err) {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }
    throw new Error(message);
  }

  if (skipJson) {
    return undefined as T;
  }

  return response.json();
}

