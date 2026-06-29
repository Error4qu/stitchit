'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient, ApiEndpoints } from '@stitchit/api-client';
import { useAuthStore } from '../store/auth-store';
import { useEffect } from 'react';

const endpoints = new ApiEndpoints(apiClient);

export function useCurrentUser() {
  const { setUser, setLoading } = useAuthStore();

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => endpoints.me(),
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data ?? null);
    } else if (query.isError) {
      setUser(null);
    }
    if (!query.isPending) {
      setLoading(false);
    }
  }, [query.isSuccess, query.isError, query.isPending, query.data, setUser, setLoading]);

  return query;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      endpoints.login(email, password),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['auth', 'me'], user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => endpoints.logout(),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      router.push('/login');
    },
  });
}
