'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCurrentUser } from '../hooks/use-auth';
import { useAuthStore } from '../store/auth-store';
import { Scissors } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useCurrentUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
    if (!isLoading && user && user.role !== 'TAILOR') {
      router.push('/login?error=role');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'TAILOR') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0] dark:bg-[#0F1B2D]">
        <div className="flex flex-col items-center gap-4">
          <Scissors className="w-8 h-8 text-[#C9A84C] animate-pulse" />
          <div className="w-8 h-8 border-3 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
