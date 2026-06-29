'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, ChevronDown, ChevronUp, UserCheck, TrendingUp } from 'lucide-react';
import { apiClient, ApiEndpoints, ApiRequestError } from '@stitchit/api-client';
import type { AlterationOrder, AlterationStatus } from '@stitchit/types';
import { useToast } from '@stitchit/ui';
import { AnimatePresence, motion } from 'framer-motion';

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
  BOOKED: 'bg-blue-100 text-blue-700',
  TAILOR_ASSIGNED: 'bg-purple-100 text-purple-700',
  TAILOR_VISITED: 'bg-indigo-100 text-indigo-700',
  GARMENT_COLLECTED: 'bg-orange-100 text-orange-700',
  IN_ALTERATION: 'bg-yellow-100 text-yellow-700',
  QUALITY_CHECK: 'bg-cyan-100 text-cyan-700',
  OUT_FOR_DELIVERY: 'bg-teal-100 text-teal-700',
  DELIVERED: 'bg-green-100 text-green-700',
};

const ALL_STATUSES: AlterationStatus[] = [
  'BOOKED', 'TAILOR_ASSIGNED', 'TAILOR_VISITED', 'GARMENT_COLLECTED',
  'IN_ALTERATION', 'QUALITY_CHECK', 'OUT_FOR_DELIVERY', 'DELIVERED',
];

function AdminOrderRow({ order }: { order: AlterationOrder }) {
  const [expanded, setExpanded] = useState(false);
  const [tailorId, setTailorId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<AlterationStatus>(order.status);
  const queryClient = useQueryClient();
  const { toast, error: showError } = useToast();

  const assignMutation = useMutation({
    mutationFn: (tid: number) => endpoints.assignAlterationTailor(order.id, tid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-alteration-orders'] });
      toast(`Tailor #${tailorId} assigned to order #${order.id}`, 'success');
      setTailorId('');
    },
    onError: (err) => {
      if (err instanceof ApiRequestError) showError(err.error.message);
      else showError('Failed to assign tailor.');
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: AlterationStatus) =>
      endpoints.updateAlterationStatus(order.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-alteration-orders'] });
      toast('Status updated.', 'success');
    },
    onError: (err) => {
      if (err instanceof ApiRequestError) showError(err.error.message);
      else showError('Failed to update status.');
    },
  });

  return (
    <div className="bg-white rounded-2xl border border-[#0F1B2D]/10 overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-[#0F1B2D]/2 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-mono text-[#2D2D2D]/40">#{order.id}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <p className="text-sm font-semibold text-[#2D2D2D]">{order.customerName}</p>
          <p className="text-xs text-[#2D2D2D]/50">
            {order.items.map((i) => i.alterationServiceName).join(', ')}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-[#C9A84C]">₹{order.totalPrice}</p>
          <p className="text-xs text-[#2D2D2D]/40 mt-0.5">
            {new Date(order.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-[#2D2D2D]/40 shrink-0 mt-1" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#2D2D2D]/40 shrink-0 mt-1" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#0F1B2D]/10 px-5 py-5 space-y-4">
              {/* Address */}
              <div>
                <p className="text-xs font-semibold text-[#2D2D2D]/60 uppercase tracking-wider mb-1">Address</p>
                <p className="text-sm text-[#2D2D2D]">
                  {order.address.street}, {order.address.city}, {order.address.state} – {order.address.postalCode}
                </p>
              </div>

              {/* Tailor */}
              <div>
                <p className="text-xs font-semibold text-[#2D2D2D]/60 uppercase tracking-wider mb-1">
                  Assigned Tailor
                </p>
                <p className="text-sm text-[#2D2D2D]">
                  {order.tailorName ? `${order.tailorName} (#${order.tailorId})` : 'None assigned'}
                </p>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-[#2D2D2D]/60 uppercase tracking-wider mb-2">Services</p>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm mb-1">
                    <span className="text-[#2D2D2D]">{item.alterationServiceName}</span>
                    <span className="text-[#C9A84C] font-bold">₹{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Admin actions */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-[#0F1B2D]/10">
                {/* Assign tailor */}
                <div>
                  <p className="text-xs font-semibold text-[#2D2D2D]/60 uppercase tracking-wider mb-1.5">
                    Assign Tailor by ID
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Tailor ID"
                      value={tailorId}
                      onChange={(e) => setTailorId(e.target.value)}
                      className="flex-1 rounded-xl border border-[#0F1B2D]/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50"
                    />
                    <button
                      onClick={() => tailorId && assignMutation.mutate(Number(tailorId))}
                      disabled={!tailorId || assignMutation.isPending}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0F1B2D] text-[#F8F5F0] text-sm font-medium hover:bg-[#C9A84C] hover:text-[#0F1B2D] transition-colors disabled:opacity-50"
                    >
                      {assignMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <UserCheck className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Update status */}
                <div>
                  <p className="text-xs font-semibold text-[#2D2D2D]/60 uppercase tracking-wider mb-1.5">
                    Update Status
                  </p>
                  <div className="flex gap-2">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as AlterationStatus)}
                      className="flex-1 rounded-xl border border-[#0F1B2D]/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 bg-white"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => statusMutation.mutate(selectedStatus)}
                      disabled={selectedStatus === order.status || statusMutation.isPending}
                      className="px-3 py-2 rounded-xl bg-[#0F1B2D] text-[#F8F5F0] text-sm font-medium hover:bg-[#C9A84C] hover:text-[#0F1B2D] transition-colors disabled:opacity-50"
                    >
                      {statusMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        'Set'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminAlterationsPage() {
  const [statusFilter, setStatusFilter] = useState<AlterationStatus | 'ALL'>('ALL');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-alteration-orders'],
    queryFn: () => endpoints.getAllAlterationOrders({ page: 0, size: 200 }),
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000,
  });

  const allOrders = data?.content ?? [];
  const filtered = statusFilter === 'ALL'
    ? allOrders
    : allOrders.filter((o) => o.status === statusFilter);

  // Revenue breakdown
  const deliveredOrders = allOrders.filter((o) => o.status === 'DELIVERED');
  const totalRevenue = deliveredOrders.reduce((s, o) => s + o.totalPrice, 0);
  const avgOrderValue = deliveredOrders.length > 0
    ? Math.round(totalRevenue / deliveredOrders.length)
    : 0;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-[#0F1B2D]">Alteration Orders</h1>
        <p className="text-sm text-[#2D2D2D]/60 mt-1">
          Manage all alteration orders, assign tailors, and update statuses.
        </p>
      </div>

      {/* Revenue summary */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-[#0F1B2D]/10 p-4">
          <p className="text-xs font-semibold text-[#2D2D2D]/60 uppercase tracking-wider mb-1">
            Total Orders
          </p>
          <p className="text-2xl font-bold text-[#0F1B2D]">{allOrders.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#0F1B2D]/10 p-4">
          <p className="text-xs font-semibold text-[#2D2D2D]/60 uppercase tracking-wider mb-1">
            Alteration Revenue
          </p>
          <p className="text-2xl font-bold text-[#C9A84C]">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-[#2D2D2D]/40 mt-0.5">From {deliveredOrders.length} delivered</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#0F1B2D]/10 p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#C9A84C]" />
            <p className="text-xs font-semibold text-[#2D2D2D]/60 uppercase tracking-wider">
              Avg Order Value
            </p>
          </div>
          <p className="text-2xl font-bold text-[#0F1B2D]">
            ₹{avgOrderValue.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            statusFilter === 'ALL'
              ? 'bg-[#0F1B2D] text-[#F8F5F0]'
              : 'bg-white border border-[#0F1B2D]/10 text-[#2D2D2D]/60 hover:text-[#2D2D2D]'
          }`}
        >
          All ({allOrders.length})
        </button>
        {ALL_STATUSES.map((s) => {
          const count = allOrders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === s
                  ? 'bg-[#0F1B2D] text-[#F8F5F0]'
                  : 'bg-white border border-[#0F1B2D]/10 text-[#2D2D2D]/60 hover:text-[#2D2D2D]'
              }`}
            >
              {STATUS_LABELS[s]} ({count})
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
        </div>
      )}

      {isError && (
        <div className="text-center py-20 text-red-500 text-sm">
          Failed to load orders. Please refresh.
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="text-center py-20 text-[#2D2D2D]/40 text-sm">
          No orders with this status.
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((order) => (
          <AdminOrderRow key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
