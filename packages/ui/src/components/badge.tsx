import React from 'react';
import { cn } from '../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gold' | 'navy' | 'outline' | 'success' | 'warning' | 'danger';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default:
      'bg-[#C9A84C]/15 text-[#C9A84C] dark:bg-[#C9A84C]/20 dark:text-[#D4B96A]',
    gold:
      'bg-[#C9A84C] text-[#0F1B2D] font-semibold',
    navy:
      'bg-[#0F1B2D] text-[#F8F5F0] dark:bg-[#F8F5F0] dark:text-[#0F1B2D]',
    outline:
      'border border-[#C9A84C] text-[#C9A84C] bg-transparent',
    success:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    danger:
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
