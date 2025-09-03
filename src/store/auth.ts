import { create } from 'zustand';
import { User } from '@/types/models';

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (username: string, password: string) => Promise<boolean>;
  fetchUser: () => Promise<void>;
  signOut: () => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  loading: false,
  error: null,
  signIn: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Sign in failed');
      }
      const data = await res.json();
      set({ token: data.token });
      await get().fetchUser();
      return true;
    } catch (e: any) {
      set({ error: e.message || 'Sign in failed' });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  fetchUser: async () => {
    if (!get().token) return;
    const res = await fetch('/api/me');
    if (res.ok) {
      const u = (await res.json()) as User;
      set({ user: u });
    }
  },
  signOut: () => set({ token: null, user: null }),
}));
