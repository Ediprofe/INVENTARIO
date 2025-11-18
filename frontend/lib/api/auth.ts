/**
 * Cliente API para autenticación.
 */
import axios from 'axios';
import type { ILoginRequest, ILoginResponse, IRefreshResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const AuthAPI = {
  /**
   * Login de usuario.
   */
  login: async (credentials: ILoginRequest): Promise<ILoginResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login/`, credentials);
    return response.data;
  },

  /**
   * Refresh token.
   */
  refresh: async (refreshToken: string): Promise<IRefreshResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
      refresh: refreshToken,
    });
    return response.data;
  },

  /**
   * Logout (solo limpia estado local, backend no requiere llamada).
   */
  logout: async (): Promise<void> => {
    // El backend no requiere llamada de logout, solo limpiar tokens
    return Promise.resolve();
  },
};
