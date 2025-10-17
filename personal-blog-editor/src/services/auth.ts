import api from './api';
import type { AuthResponse, User } from '../types';

export async function login(payload: { emailOrUsername: string; password: string }): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/login', payload);
  localStorage.setItem('auth_token', data.token);
  return data;
}

export async function register(payload: { email: string; username: string; password: string }): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/register', payload);
  localStorage.setItem('auth_token', data.token);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/logout');
  } finally {
    localStorage.removeItem('auth_token');
  }
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get<User>('/me');
  return data;
}
