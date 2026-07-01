'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scissors, LayoutDashboard, Wrench, Users, LogOut, Shield } from 'lucide-react';
import { useLogout } from '../../hooks/use-auth';
import { useAuthStore } from '../../store/auth-store';
import { ProtectedRoute } from '../../components/protected-route';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/alterations', label: 'Alterations', icon: Wrench },
  { href: '/dashboard/users', label: 'Users', icon: Users },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-[#0F1B2D] min-h-screen px-4 py-6">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Shield className="w-5 h-5 text-[#C9A84C]" />
        <span className="font-serif text-lg font-bold text-[#F8F5F0]">
          Stitch<span className="text-[#C9A84C]">It</span>
          <span className="block text-[10px] font-sans font-normal text-[#F8F5F0]/50 leading-tight">
            Admin
          </span>
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#C9A84C] text-[#0F1B2D]'
                  : 'text-[#F8F5F0]/70 hover:bg-[#F8F5F0]/10 hover:text-[#F8F5F0]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#F8F5F0]/10 pt-4 space-y-2">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-[#F8F5F0]">{user?.name}</p>
          <p className="text-xs text-[#F8F5F0]/50 truncate">{user?.email}</p>
        </div>
        <button
          onClick={() => logoutMutation.mutate()}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#F8F5F0]/70 hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 bg-[#F8F5F0] overflow-auto">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
