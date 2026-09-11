import { router } from '@inertiajs/react';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useAuth() {
  const { user, setUser } = useAuthStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    setUser(data.user);
    router.visit('/admin/dashboard');
  };

  const logout = async () => {
    await authApi.logout().catch(() => {});
    setUser(null);
    router.visit('/login');
  };

  return { user, isAuthenticated, login, logout };
}
