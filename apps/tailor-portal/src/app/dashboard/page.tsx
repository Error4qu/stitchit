'use client';

import React from 'react';
import { useAuthStore } from '../../store/auth-store';
import { Wrench, Package, CheckCircle, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiEndpoints } from '@stitchit/api-client';
import type { AlterationOrder } from '@stitchit/types';

const endpoints = new ApiEndpoints(apiClient);

function StatCard({ label, value, icon: Icon, color }: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#0F1B2D]/10 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#2D2D2D]/60 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-[#0F1B2D]">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardHomePage() {
  const { user } = useAuthStore();

  const { data } = useQuery({
    queryKey: ['tailor-alteration-orders'],
    queryFn: () => endpoints.getTailorAlterationOrders({ page: 0, size: 100 }),
    staleTime: 2 * 60 * 1000,
  });

  const orders: AlterationOrder[] = data?.content ?? [];
  const active = orders.filter((o) => o.status !== 'DELIVERED').length;
  const delivered = orders.filter((o) => o.status === 'DELIVERED').length;
  const today = orders.filter((o) => o.scheduledDate === new Date().toISOString().split('T')[0]).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-[#0F1B2D]">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-sm text-[#2D2D2D]/60 mt-1">Here&apos;s your current workload overview.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Active Jobs"
          value={active}
          icon={Wrench}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          label="Delivered"
          value={delivered}
          icon={CheckCircle}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          label="Today's Visits"
          value={today}
          icon={Clock}
          color="bg-blue-100 text-blue-600"
        />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-[#0F1B2D]/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#0F1B2D]/10">
          <h2 className="font-semibold text-[#0F1B2D]">Recent Orders</h2>
        </div>
        {orders.slice(0, 5).length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Package className="w-10 h-10 text-[#2D2D2D]/20 mb-3" />
            <p className="text-sm text-[#2D2D2D]/60">No orders assigned yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#0F1B2D]/5">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#2D2D2D]">
                    Order #{order.id} · {order.customerName}
                  </p>
                  <p className="text-xs text-[#2D2D2D]/50 mt-0.5">
                    {order.items.map((i) => i.alterationServiceName).join(', ')}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#C9A84C]">
                  {order.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
