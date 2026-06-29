'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Scissors, ChevronRight, Loader2, Package } from 'lucide-react';
import { apiClient, ApiEndpoints } from '@stitchit/api-client';
import type { AlterationOrder, AlterationStatus } from '@stitchit/types';
import { ProtectedRoute } from '../../../components/protected-route';

const endpoints = new ApiEndpoints(apiClient);

const STATUS_LABELS: Record<AlterationStatus, string> = {
  BOOKED: 'Booked',
  TAILOR_ASSIGNED: 'Tailor Assigned',
  TAILOR_VISITED: 'Tailor Visited',
  GARMENT_COLLECTED: 'Garment Collected',
  IN_ALTERATION: 'In Alteration',
  QUALITY_CHECK: 'Quality Check',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
};

const STATUS_COLOR: Record<AlterationStatus, string> = {
  BOOKED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  TAILOR_ASSIGNED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  TAILOR_VISITED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  GARMENT_COLLECTED: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  IN_ALTERATION: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  QUALITY_CHECK: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  OUT_FOR_DELIVERY: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

function OrderCard({ order }: { order: AlterationOrder }) {
  const slotLabel = {
    MORNING_9_11: '9 AM – 11 AM',
    AFTERNOON_12_2: '12 PM – 2 PM',
    AFTERNOON_3_5: '3 PM – 5 PM',
    EVENING_6_8: '6 PM – 8 PM',
  }[order.scheduledSlot] ?? order.scheduledSlot;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/alterations/orders/${order.id}`}
        className="block p-5 rounded-2xl bg-white dark:bg-[#1a2a42] border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 hover:border-[#C9A84C]/50 hover:shadow-md transition-all group"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-mono text-[#2D2D2D]/40 dark:text-[#F8F5F0]/40">
                #{order.id}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[order.status]}`}>
                {STATUS_LABELS[order.status]}
              </span>
            </div>
            <p className="text-sm font-semibold text-[#2D2D2D] dark:text-[#F8F5F0] mb-1">
              {order.items.map((i) => i.alterationServiceName).join(', ')}
            </p>
            <p className="text-xs text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50">
              {new Date(order.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {slotLabel}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-base font-bold text-[#C9A84C]">₹{order.totalPrice}</p>
            <ChevronRight className="w-4 h-4 text-[#2D2D2D]/30 dark:text-[#F8F5F0]/30 mt-1 ml-auto group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function OrdersContent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-alteration-orders'],
    queryFn: () => endpoints.getMyAlterationOrders({ page: 0, size: 50 }),
    staleTime: 2 * 60 * 1000,
  });

  const orders = data?.content ?? [];

  return (
    <div className="min-h-screen bg-[#F8F5F0] dark:bg-[#0F1B2D] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scissors className="w-5 h-5 text-[#C9A84C]" />
              <h1 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">
                My Alterations
              </h1>
            </div>
            <p className="text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60">
              Track all your alteration orders.
            </p>
          </div>
          <Link
            href="/alterations"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F1B2D] dark:bg-[#C9A84C] text-[#F8F5F0] dark:text-[#0F1B2D] text-sm font-semibold hover:bg-[#C9A84C] hover:text-[#0F1B2D] transition-colors"
          >
            <Scissors className="w-4 h-4" />
            New Booking
          </Link>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <p className="text-red-500">Failed to load orders. Please refresh.</p>
          </div>
        )}

        {!isLoading && !isError && orders.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-[#2D2D2D]/20 dark:text-[#F8F5F0]/20 mx-auto mb-4" />
            <p className="font-semibold text-[#2D2D2D] dark:text-[#F8F5F0] mb-2">No alteration orders yet</p>
            <p className="text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 mb-6">
              Book your first alteration and let us handle your garments.
            </p>
            <Link
              href="/alterations"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#C9A84C] text-[#0F1B2D] text-sm font-semibold hover:bg-[#C9A84C]/80 transition-colors"
            >
              <Scissors className="w-4 h-4" /> Book Now
            </Link>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyAlterationsPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
