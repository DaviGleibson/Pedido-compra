'use client';

import { apiFetch, authStorage, isApiConfigured } from '../api-client';

const USER_KEY = 'pc_auth_user';

export type LoginPayload =
  | {
      tipo: 'funcionario';
      matricula: string;
      senha: string;
    }
  | {
      tipo: 'fornecedor';
      numero_documento: string;
      senha: string;
    };

interface LoginResponse {
  token: string;
  user: {
    id: number | string;
    nome?: string;
    matricula?: string;
    numero_documento?: string;
    tipo: 'funcionario' | 'fornecedor';
    [key: string]: unknown;
  };
}

export function isAuthEnabled() {
  return isApiConfigured;
}

export function getStoredUser(): LoginResponse['user'] | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function login(payload: LoginPayload) {
  const response = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    requireAuth: false,
  });

  authStorage.setToken(response.token);
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
  }

  return response;
}

export function logout() {
  authStorage.clearToken();
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
}

export async function fetchCurrentUser() {
  return apiFetch('/auth/me');
}

