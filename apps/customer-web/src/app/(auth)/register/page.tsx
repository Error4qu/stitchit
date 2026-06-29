'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Scissors, Eye, EyeOff, Chrome } from 'lucide-react';
import { Button, Input, useToast } from '@stitchit/ui';
import { registerSchema, type RegisterFormData, ApiRequestError } from '@stitchit/api-client';
import { useRegister } from '../../../hooks/use-auth';
import { useAuthStore } from '../../../store/auth-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:8080';

export default function RegisterPage() {
  const router = useRouter();
  const { toast, error } = useToast();
  const { user } = useAuthStore();
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
      });
      toast('Account created! Welcome to StitchIt.', 'success');
      router.push('/');
    } catch (err) {
      if (err instanceof ApiRequestError) {
        error(err.error.message);
      } else {
        error('Registration failed. Please try again.');
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
      <div className="bg-white dark:bg-[#1a2a42] rounded-3xl shadow-2xl border border-[#0F1B2D]/5 dark:border-[#F8F5F0]/5 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0F1B2D] px-8 pt-10 pb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Scissors className="w-6 h-6 text-[#C9A84C]" />
            <span className="font-serif text-2xl font-bold text-[#F8F5F0]">
              Stitch<span className="text-[#C9A84C]">It</span>
            </span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-[#F8F5F0] mb-1">Create account</h1>
          <p className="text-[#F8F5F0]/60 text-sm">Start your bespoke tailoring journey</p>
        </div>

        {/* Form */}
        <div className="px-8 py-8 space-y-5">
          {/* Google OAuth */}
          <a
            href={`${API_URL}/oauth2/authorization/google`}
            className="flex items-center justify-center gap-3 w-full h-11 rounded-xl border-2 border-[#0F1B2D]/20 dark:border-[#F8F5F0]/20 text-sm font-medium text-[#2D2D2D] dark:text-[#F8F5F0] hover:bg-[#0F1B2D]/5 dark:hover:bg-[#F8F5F0]/5 transition-colors"
          >
            <Chrome className="w-5 h-5" />
            Sign up with Google
          </a>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#0F1B2D]/10 dark:bg-[#F8F5F0]/10" />
            <span className="text-xs text-[#2D2D2D]/40 dark:text-[#F8F5F0]/40 font-medium">or</span>
            <div className="flex-1 h-px bg-[#0F1B2D]/10 dark:bg-[#F8F5F0]/10" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider">
                Full Name
              </label>
              <Input placeholder="Your full name" autoComplete="name" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Phone (optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider">
                Phone <span className="font-normal text-[#2D2D2D]/40 dark:text-[#F8F5F0]/40">(optional)</span>
              </label>
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                autoComplete="tel"
                {...register('phone')}
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  autoComplete="new-password"
                  className="pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D2D2D]/40 hover:text-[#2D2D2D] dark:text-[#F8F5F0]/40 dark:hover:text-[#F8F5F0] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className="pr-10"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D2D2D]/40 hover:text-[#2D2D2D] dark:text-[#F8F5F0]/40 dark:hover:text-[#F8F5F0] transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full rounded-xl"
              disabled={isSubmitting || registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60">
            Already have an account?{' '}
            <Link href="/login" className="text-[#C9A84C] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
