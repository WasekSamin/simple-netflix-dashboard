import { create } from 'zustand';
import { AuthType } from '../types/auth';

export type AuthStoreType = {
    authData: AuthType;
    updateAuthData: (authData: AuthType) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStoreType>(set => ({
  authData: null,
  updateAuthData: (authData) =>
    set({ authData }),
  logout: () => set({ authData: null }),
}));
