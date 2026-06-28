import React from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-[#0F1B2D]/20 bg-white px-3 py-2 text-sm text-[#2D2D2D] ring-offset-white transition-colors',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-[#2D2D2D]/40',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-[#F8F5F0]/20 dark:bg-[#0F1B2D] dark:text-[#F8F5F0] dark:ring-offset-[#0F1B2D] dark:placeholder:text-[#F8F5F0]/40 dark:focus-visible:ring-[#C9A84C]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
