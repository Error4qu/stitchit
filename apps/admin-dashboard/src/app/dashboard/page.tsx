'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiEndpoints } from '@stitchit/api-client';
import type { AlterationOrder } from '@stitchit/types';
import { TrendingUp, Wrench, Package, CheckCircle } from 'lucide-react';

const endpoints = new ApiEndpoints(apiClient);

function StatCard({
  label, value, sub, icon: Icon, color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#0F1B2D]/10 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#0F1B2D]">{value}</p>
      <p className="text-xs font-semibold text-[#2D2D2D]/60 uppercase tracking-wider mt-0.5">{label}</p>
      {sub && <p className="text-xs text-[#2D2D2D]/40 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminOverviewPage() {
  const { data: alterationData } = useQuery({
    queryKey: ['admin-alteration-orders'],
    queryFn: () => endpoints.getAllAlterationOrders({ page: 0, size: 200 }),
    staleTime: 2 * 60 * 1000,
  });

  const alterOrders: AlterationOrder[] = alterationData?.content ?? [];
  const totalAlterationRevenue = alterOrders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((s, o) => s + o.totalPrice, 0);
  const activeAlterations = alterOrders.filter((o) => o.status !== 'DELIVERED').length;
  const deliveredAlterations = alterOrders.filter((o) => o.status === 'DELIVERED').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-[#0F1B2D]">Overview</h1>
        <p className="text-sm text-[#2D2D2D]/60 mt-1">Platform-wide metrics and recent activity.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Active Alterations"
          value={activeAlterations}
          icon={Wrench}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          label="Delivered Alterations"
          value={deliveredAlterations}
          icon={CheckCircle}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          label="Total Alteration Orders"
          value={alterOrders.length}
          icon={Package}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Alteration Revenue"
          value={`₹${totalAlterationRevenue.toLocaleString('en-IN')}`}
          sub="Delivered orders only"
          icon={TrendingUp}
          color="bg-[#C9A84C]/20 text-[#C9A84C]"
        />
      </div>

      {/* Recent alteration orders preview */}
      <div className="bg-white rounded-2xl border border-[#0F1B2D]/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#0F1B2D]/10 flex items-center justify-between">
          <h2 className="font-semibold text-[#0F1B2D]">Recent Alteration Orders</h2>
          <a href="/dashboard/alterations" className="text-xs text-[#C9A84C] font-medium hover:underline">
            View all
          </a>
        </div>
        {alterOrders.slice(0, 6).length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#2D2D2D]/40">No alteration orders yet.</div>
        ) : (
          <div className="divide-y divide-[#0F1B2D]/5">
            {alterOrders.slice(0, 6).map((o) => (
              <div key={o.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-[#2D2D2D]">#{o.id}</span>
                  <span className="mx-2 text-[#2D2D2D]/30">·</span>
                  <span className="text-sm text-[#2D2D2D]/70">{o.customerName}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[#C9A84C]">₹{o.totalPrice}</span>
                  <span className="text-xs font-medium text-[#2D2D2D]/50">
                    {o.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
