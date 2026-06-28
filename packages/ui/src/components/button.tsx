import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer';

    const variants = {
      primary:
        'bg-[#C9A84C] text-[#0F1B2D] hover:bg-[#B8973B] active:bg-[#A7862A] font-semibold shadow-sm hover:shadow-md',
      secondary:
        'bg-[#0F1B2D] text-[#F8F5F0] hover:bg-[#1a2a42] active:bg-[#243550] dark:bg-[#F8F5F0] dark:text-[#0F1B2D] dark:hover:bg-[#ede8df]',
      outline:
        'border-2 border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 active:bg-[#C9A84C]/20 dark:border-[#C9A84C] dark:text-[#C9A84C]',
      ghost:
        'text-[#2D2D2D] dark:text-[#F8F5F0] hover:bg-[#0F1B2D]/10 dark:hover:bg-[#F8F5F0]/10',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm gap-1.5',
      md: 'h-10 px-5 text-sm gap-2',
      lg: 'h-12 px-8 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
