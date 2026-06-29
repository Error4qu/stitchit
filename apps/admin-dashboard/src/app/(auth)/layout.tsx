import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StitchIt Admin — Sign In',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0] px-4 py-12">
      {children}
    </div>
  );
}
