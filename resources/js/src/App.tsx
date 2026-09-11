import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, type ReactNode } from 'react';
import { authApi } from './api/auth.api';
import { useAuthStore } from './store/auth.store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProps {
  children: ReactNode;
}

export default function App({ children }: AppProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthReady = useAuthStore((state) => state.setAuthReady);

  useEffect(() => {
    authApi.me()
      .then(({ data }) => {
        setUser(data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setAuthReady(true));
  }, [setAuthReady, setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
