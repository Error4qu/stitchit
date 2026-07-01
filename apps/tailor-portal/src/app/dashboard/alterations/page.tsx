'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronDown, ChevronUp, MapPin, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { apiClient, ApiEndpoints, ApiRequestError } from '@stitchit/api-client';
import type { AlterationOrder, AlterationStatus } from '@stitchit/types';
import { useToast } from '@stitchit/ui';

const endpoints = new ApiEndpoints(apiClient);

const STATUS_TRANSITIONS: Partial<Record<AlterationStatus, AlterationStatus>> = {
  TAILOR_ASSIGNED: 'TAILOR_VISITED',
  TAILOR_VISITED: 'GARMENT_COLLECTED',
  GARMENT_COLLECTED: 'IN_ALTERATION',
  IN_ALTERATION: 'QUALITY_CHECK',
  QUALITY_CHECK: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED',
};

const STATUS_LABELS: Record<AlterationStatus, string> = {
  BOOKED: 'Booked',
  TAILOR_ASSIGNED: 'Assigned',
  TAILOR_VISITED: 'Visited',
  GARMENT_COLLECTED: 'Collected',
  IN_ALTERATION: 'In Progress',
  QUALITY_CHECK: 'QC',
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

const SLOT_LABELS: Record<string, string> = {
  MORNING_9_11: '9 AM – 11 AM',
  AFTERNOON_12_2: '12 PM – 2 PM',
  AFTERNOON_3_5: '3 PM – 5 PM',
  EVENING_6_8: '6 PM – 8 PM',
};

function OrderRow({ order }: { order: AlterationOrder }) {
  const [expanded, setExpanded] = useState(false);
  const [tailorNotes, setTailorNotes] = useState(order.tailorNotes ?? '');
  const queryClient = useQueryClient();
  const { toast, error: showError } = useToast();

  const nextStatus = STATUS_TRANSITIONS[order.status];

  const updateMutation = useMutation({
    mutationFn: (status: AlterationStatus) =>
      endpoints.updateAlterationStatus(order.id, status, tailorNotes || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tailor-alteration-orders'] });
      toast(`Status updated to ${STATUS_LABELS[nextStatus!]}`, 'success');
    },
    onError: (err) => {
      if (err instanceof ApiRequestError) showError(err.error.message);
      else showError('Failed to update status.');
    },
  });

  return (
    <div className="bg-white rounded-2xl border border-[#0F1B2D]/10 overflow-hidden">
      {/* Header row */}
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
          <p className="text-xs text-[#2D2D2D]/50 mt-0.5">
            {order.items.map((i) => i.alterationServiceName).join(', ')}
          </p>
          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-[#2D2D2D]/50">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(order.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#2D2D2D]/50">
              <Clock className="w-3.5 h-3.5" />
              {SLOT_LABELS[order.scheduledSlot] ?? order.scheduledSlot}
            </span>
            <span className="text-xs font-bold text-[#C9A84C]">₹{order.totalPrice}</span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-[#2D2D2D]/40 shrink-0 mt-1" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#2D2D2D]/40 shrink-0 mt-1" />
        )}
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#0F1B2D]/10 px-5 py-5 space-y-5">
              {/* Address */}
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[#2D2D2D]/60 uppercase tracking-wider">Pickup Address</p>
                  <p className="text-sm text-[#2D2D2D] mt-0.5">
                    {order.address.street}, {order.address.city}, {order.address.state} – {order.address.postalCode}
                  </p>
                </div>
              </div>

              {/* Services */}
              <div>
                <p className="text-xs font-semibold text-[#2D2D2D]/60 uppercase tracking-wider mb-2">Services</p>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                      <div>
                        <p className="font-medium text-[#2D2D2D]">{item.alterationServiceName}</p>
                        {item.garmentDescription && (
                          <p className="text-xs text-[#2D2D2D]/50">{item.garmentDescription}</p>
                        )}
                        {item.customerNotes && (
                          <p className="text-xs text-[#2D2D2D]/40 italic">"{item.customerNotes}"</p>
                        )}
                      </div>
                      <span className="text-[#C9A84C] font-bold shrink-0 ml-4">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer special instructions */}
              {order.specialInstructions && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <p className="text-xs font-semibold text-amber-700">Special Instructions</p>
                  </div>
                  <p className="text-sm text-amber-800">{order.specialInstructions}</p>
                </div>
              )}

              {/* Tailor notes */}
              {order.status !== 'DELIVERED' && (
                <div>
                  <label className="text-xs font-semibold text-[#2D2D2D]/60 uppercase tracking-wider">
                    Tailor Notes (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={tailorNotes}
                    onChange={(e) => setTailorNotes(e.target.value)}
                    placeholder="Add notes about the garment or alteration…"
                    className="mt-1 w-full rounded-xl border border-[#0F1B2D]/20 bg-transparent px-3 py-2 text-sm text-[#2D2D2D] placeholder:text-[#2D2D2D]/30 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 transition resize-none"
                  />
                </div>
              )}

              {/* Action button */}
              {nextStatus && (
                <button
                  onClick={() => updateMutation.mutate(nextStatus)}
                  disabled={updateMutation.isPending}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F1B2D] text-[#F8F5F0] text-sm font-semibold hover:bg-[#C9A84C] hover:text-[#0F1B2D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Mark as {STATUS_LABELS[nextStatus]}
                </button>
              )}

              {order.status === 'DELIVERED' && (
                <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  Order delivered
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type FilterTab = 'active' | 'delivered' | 'all';

export default function TailorAlterationsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('active');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tailor-alteration-orders'],
    queryFn: () => endpoints.getTailorAlterationOrders({ page: 0, size: 100 }),
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000,
  });

  const allOrders = data?.content ?? [];
  const filtered = allOrders.filter((o) => {
    if (activeTab === 'active') return o.status !== 'DELIVERED';
    if (activeTab === 'delivered') return o.status === 'DELIVERED';
    return true;
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-[#0F1B2D]">Alteration Jobs</h1>
        <p className="text-sm text-[#2D2D2D]/60 mt-1">
          Manage and update your assigned alteration orders.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white border border-[#0F1B2D]/10 rounded-xl w-fit mb-6">
        {(['active', 'delivered', 'all'] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'bg-[#0F1B2D] text-[#F8F5F0]'
                : 'text-[#2D2D2D]/60 hover:text-[#2D2D2D]'
            }`}
          >
            {tab}
            <span className="ml-1.5 text-xs">
              {tab === 'active' ? allOrders.filter((o) => o.status !== 'DELIVERED').length
                : tab === 'delivered' ? allOrders.filter((o) => o.status === 'DELIVERED').length
                : allOrders.length}
            </span>
          </button>
        ))}
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
          No {activeTab === 'all' ? '' : activeTab} orders.
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
