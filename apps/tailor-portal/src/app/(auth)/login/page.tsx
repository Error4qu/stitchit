'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Scissors, Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormData, ApiRequestError } from '@stitchit/api-client';
import { useLogin } from '../../../hooks/use-auth';
import { useAuthStore } from '../../../store/auth-store';
import { useToast } from '@stitchit/ui';

function TailorLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, error: showError } = useToast();
  const { user } = useAuthStore();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = React.useState(false);

  useEffect(() => {
    if (searchParams.get('error') === 'role') {
      showError('This portal is for tailors only. Customer accounts are not permitted.');
    }
  }, []);

  useEffect(() => {
    if (user && user.role === 'TAILOR') {
      router.push('/dashboard');
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const loggedInUser = await loginMutation.mutateAsync(data);
      if (loggedInUser.role !== 'TAILOR') {
        showError('This portal is for tailors only. Please use the StitchIt customer app.');
        return;
      }
      toast('Welcome back!', 'success');
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiRequestError) {
        showError(err.error.message);
      } else {
        showError('Sign-in failed. Please try again.');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-[#0F1B2D]/5 overflow-hidden">
        <div className="bg-[#0F1B2D] px-8 pt-10 pb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Scissors className="w-6 h-6 text-[#C9A84C]" />
            <span className="font-serif text-2xl font-bold text-[#F8F5F0]">
              Stitch<span className="text-[#C9A84C]">It</span>
              <span className="ml-2 text-sm font-sans font-normal text-[#F8F5F0]/60">Tailor Portal</span>
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#F8F5F0] mb-1">Tailor Sign In</h1>
          <p className="text-[#F8F5F0]/60 text-sm">Access your dashboard and manage orders.</p>
        </div>

        <div className="mx-8 mt-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-center">
          This portal is exclusively for registered tailors.
        </div>

        <div className="px-8 py-6 space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2D2D2D]/70 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                placeholder="tailor@stitchit.app"
                autoComplete="email"
                {...register('email')}
                className="w-full rounded-xl border border-[#0F1B2D]/20 bg-transparent px-3 py-2.5 text-sm text-[#2D2D2D] placeholder:text-[#2D2D2D]/30 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 transition"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2D2D2D]/70 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('password')}
                  className="w-full rounded-xl border border-[#0F1B2D]/20 bg-transparent px-3 py-2.5 pr-10 text-sm text-[#2D2D2D] placeholder:text-[#2D2D2D]/30 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D2D2D]/40 hover:text-[#2D2D2D] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 rounded-xl bg-[#0F1B2D] text-[#F8F5F0] text-sm font-semibold hover:bg-[#C9A84C] hover:text-[#0F1B2D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In to Portal'
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default function TailorLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TailorLoginForm />
    </Suspense>
  );
}
