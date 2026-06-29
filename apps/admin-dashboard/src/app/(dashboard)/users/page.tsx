'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiEndpoints } from '@stitchit/api-client';
import { Loader2, Users } from 'lucide-react';

const endpoints = new ApiEndpoints(apiClient);

export default function AdminUsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => endpoints.getAllUsers({ page: 0, pageSize: 50 }),
    staleTime: 5 * 60 * 1000,
  });

  const users = data?.content ?? [];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-[#0F1B2D]">Users</h1>
        <p className="text-sm text-[#2D2D2D]/60 mt-1">
          {data ? `${data.totalElements} registered users` : 'All registered users.'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#0F1B2D]/10 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <Users className="w-12 h-12 text-[#2D2D2D]/20 mb-3" />
            <p className="text-sm text-[#2D2D2D]/40">No users found.</p>
          </div>
        ) : (
          <div>
            <div className="px-6 py-3 bg-[#0F1B2D]/5 border-b border-[#0F1B2D]/10 grid grid-cols-4 gap-4">
              {['Name', 'Email', 'Role', 'Joined'].map((h) => (
                <p key={h} className="text-xs font-semibold text-[#2D2D2D]/60 uppercase tracking-wider">
                  {h}
                </p>
              ))}
            </div>
            <div className="divide-y divide-[#0F1B2D]/5">
              {users.map((user) => (
                <div key={user.id} className="px-6 py-3 grid grid-cols-4 gap-4 items-center">
                  <p className="text-sm font-semibold text-[#2D2D2D] truncate">{user.name}</p>
                  <p className="text-sm text-[#2D2D2D]/60 truncate">{user.email}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${
                    user.role === 'ADMIN'
                      ? 'bg-red-100 text-red-700'
                      : user.role === 'TAILOR'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                  <p className="text-xs text-[#2D2D2D]/40">
                    {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
