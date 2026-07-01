'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Scissors, ArrowLeft, MapPin, Calendar, Clock, Loader2, CheckCircle, Circle, Tag } from 'lucide-react';
import { apiClient, ApiEndpoints } from '@stitchit/api-client';
import type { AlterationStatus } from '@stitchit/types';
import { ProtectedRoute } from '../../../../components/protected-route';

const endpoints = new ApiEndpoints(apiClient);

const STATUS_STEPS: { status: AlterationStatus; label: string; description: string }[] = [
  { status: 'BOOKED', label: 'Booked', description: 'Your booking is confirmed.' },
  { status: 'TAILOR_ASSIGNED', label: 'Tailor Assigned', description: 'A tailor has been assigned to your order.' },
  { status: 'TAILOR_VISITED', label: 'Tailor Visited', description: 'The tailor has visited your address.' },
  { status: 'GARMENT_COLLECTED', label: 'Garment Collected', description: 'Your garment has been picked up.' },
  { status: 'IN_ALTERATION', label: 'In Alteration', description: 'The tailor is working on your garment.' },
  { status: 'QUALITY_CHECK', label: 'Quality Check', description: 'Undergoing quality inspection.' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', description: 'Your garment is on its way back to you.' },
  { status: 'DELIVERED', label: 'Delivered', description: 'Garment delivered. Enjoy!' },
];

const STATUS_ORDER: Record<AlterationStatus, number> = {
  BOOKED: 0,
  TAILOR_ASSIGNED: 1,
  TAILOR_VISITED: 2,
  GARMENT_COLLECTED: 3,
  IN_ALTERATION: 4,
  QUALITY_CHECK: 5,
  OUT_FOR_DELIVERY: 6,
  DELIVERED: 7,
};

const SLOT_LABELS: Record<string, string> = {
  MORNING_9_11: '9 AM – 11 AM',
  AFTERNOON_12_2: '12 PM – 2 PM',
  AFTERNOON_3_5: '3 PM – 5 PM',
  EVENING_6_8: '6 PM – 8 PM',
};

function OrderDetailContent() {
  const params = useParams();
  const orderId = Number(params.id);

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['alteration-order', orderId],
    queryFn: () => endpoints.getAlterationOrder(orderId),
    enabled: !isNaN(orderId),
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#2D2D2D] dark:text-[#F8F5F0] font-semibold">Order not found.</p>
        <Link href="/alterations/orders" className="text-[#C9A84C] text-sm font-medium hover:underline">
          ← Back to My Alterations
        </Link>
      </div>
    );
  }

  const currentStep = STATUS_ORDER[order.status];

  return (
    <div className="min-h-screen bg-[#F8F5F0] dark:bg-[#0F1B2D] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link
          href="/alterations/orders"
          className="inline-flex items-center gap-1.5 text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 hover:text-[#C9A84C] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> My Alterations
        </Link>

        {/* Title row */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scissors className="w-5 h-5 text-[#C9A84C]" />
              <h1 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">
                Order #{order.id}
              </h1>
            </div>
            <p className="text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-[#C9A84C]">₹{order.totalPrice}</p>
            <p className="text-xs text-[#2D2D2D]/40 dark:text-[#F8F5F0]/40">Total</p>
            <span
              className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                order.paymentStatus === 'PAID'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}
            >
              {order.paymentStatus === 'PAID' ? 'Paid' : 'Payment pending'}
            </span>
          </div>
        </div>

        {/* Status timeline */}
        <div className="bg-white dark:bg-[#1a2a42] rounded-3xl border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 p-6 mb-5">
          <h2 className="text-sm font-bold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider mb-5">
            Status
          </h2>
          <div className="space-y-0">
            {STATUS_STEPS.map((step, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;
              const isFuture = idx > currentStep;
              return (
                <div key={step.status} className="flex gap-4">
                  {/* Dot + line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                      isPast
                        ? 'bg-[#C9A84C] text-[#0F1B2D]'
                        : isCurrent
                        ? 'bg-[#0F1B2D] dark:bg-[#C9A84C] text-[#F8F5F0] dark:text-[#0F1B2D] ring-2 ring-[#C9A84C]'
                        : 'bg-[#0F1B2D]/10 dark:bg-[#F8F5F0]/10 text-[#2D2D2D]/30 dark:text-[#F8F5F0]/30'
                    }`}>
                      {isPast ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Circle className="w-3.5 h-3.5" />
                      )}
                    </div>
                    {idx < STATUS_STEPS.length - 1 && (
                      <div className={`w-0.5 flex-1 min-h-[24px] my-0.5 transition-colors ${
                        isPast ? 'bg-[#C9A84C]' : 'bg-[#0F1B2D]/10 dark:bg-[#F8F5F0]/10'
                      }`} />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-5 flex-1 ${idx === STATUS_STEPS.length - 1 ? 'pb-0' : ''}`}>
                    <p className={`text-sm font-semibold ${
                      isCurrent ? 'text-[#C9A84C]' : isFuture ? 'text-[#2D2D2D]/30 dark:text-[#F8F5F0]/30' : 'text-[#2D2D2D] dark:text-[#F8F5F0]'
                    }`}>
                      {step.label}
                      {isCurrent && <span className="ml-2 text-xs font-medium">(Current)</span>}
                    </p>
                    {!isFuture && (
                      <p className="text-xs text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50 mt-0.5">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items */}
        <div className="bg-white dark:bg-[#1a2a42] rounded-3xl border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 p-6 mb-5">
          <h2 className="text-sm font-bold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider mb-4">
            Services
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {item.alterationServiceIcon && (
                      <span className="text-base">{item.alterationServiceIcon}</span>
                    )}
                    <p className="text-sm font-semibold text-[#2D2D2D] dark:text-[#F8F5F0]">
                      {item.alterationServiceName}
                    </p>
                  </div>
                  {item.garmentDescription && (
                    <p className="text-xs text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50 mt-0.5">
                      {item.garmentDescription}
                    </p>
                  )}
                  {item.customerNotes && (
                    <p className="text-xs text-[#2D2D2D]/40 dark:text-[#F8F5F0]/40 italic mt-0.5">
                      "{item.customerNotes}"
                    </p>
                  )}
                </div>
                <p className="text-sm font-bold text-[#C9A84C] shrink-0">₹{item.price}</p>
              </motion.div>
            ))}
            <div className="border-t border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 pt-3 flex justify-between">
              <span className="text-sm font-bold text-[#2D2D2D] dark:text-[#F8F5F0]">Total</span>
              <span className="text-sm font-bold text-[#C9A84C]">₹{order.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Schedule & Address */}
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-white dark:bg-[#1a2a42] rounded-3xl border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-[#C9A84C]" />
              <h2 className="text-sm font-bold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider">
                Schedule
              </h2>
            </div>
            <p className="text-sm font-semibold text-[#2D2D2D] dark:text-[#F8F5F0]">
              {new Date(order.scheduledDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <p className="text-xs text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50 mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {SLOT_LABELS[order.scheduledSlot] ?? order.scheduledSlot}
            </p>
          </div>
          <div className="bg-white dark:bg-[#1a2a42] rounded-3xl border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-[#C9A84C]" />
              <h2 className="text-sm font-bold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider">
                Address
              </h2>
            </div>
            <p className="text-sm font-semibold text-[#2D2D2D] dark:text-[#F8F5F0]">
              {order.address.street}
            </p>
            <p className="text-xs text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50 mt-0.5">
              {order.address.city}, {order.address.state} – {order.address.postalCode}
            </p>
          </div>
        </div>

        {/* Tailor Notes */}
        {order.tailorNotes && (
          <div className="bg-white dark:bg-[#1a2a42] rounded-3xl border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 p-5">
            <h2 className="text-sm font-bold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider mb-2">
              Tailor Notes
            </h2>
            <p className="text-sm text-[#2D2D2D] dark:text-[#F8F5F0]">{order.tailorNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AlterationOrderDetailPage() {
  return (
    <ProtectedRoute>
      <OrderDetailContent />
    </ProtectedRoute>
  );
}
