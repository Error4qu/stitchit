'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Scissors } from 'lucide-react';
import { apiClient, ApiEndpoints } from '@stitchit/api-client';
import { useAuthStore } from '../../../store/auth-store';
import { useToast } from '@stitchit/ui';

const endpoints = new ApiEndpoints(apiClient);

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const { success, error } = useToast();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const isOAuth = searchParams.get('oauth') === 'true';
    if (!isOAuth) {
      router.push('/');
      return;
    }

    endpoints
      .me()
      .then((user) => {
        setUser(user);
        success('Signed in with Google. Welcome!');
        router.push('/');
      })
      .catch(() => {
        error('Google sign-in failed. Please try again.');
        router.push('/login');
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F5F0] dark:bg-[#0F1B2D]">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <Scissors className="w-8 h-8 text-[#C9A84C]" />
          <span className="font-serif text-3xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">
            Stitch<span className="text-[#C9A84C]">It</span>
          </span>
        </div>
        <div className="w-10 h-10 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60">
          Completing sign-in…
        </p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0] dark:bg-[#0F1B2D]">
        <div className="w-10 h-10 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CallbackInner />
    </Suspense>
  );
}
