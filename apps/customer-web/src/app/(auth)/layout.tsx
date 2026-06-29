import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StitchIt - Sign In',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0] dark:bg-[#0F1B2D] px-4 py-12">
      {children}
    </div>
  );
}
