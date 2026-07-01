'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Check, ChevronRight, ChevronLeft, Scissors, Calendar, MapPin,
  Clock, Plus, Minus, FileText, Loader2, CheckCircle, Tag, CreditCard,
} from 'lucide-react';
import { apiClient, ApiEndpoints, ApiRequestError } from '@stitchit/api-client';
import type {
  AlterationCategory, AlterationService, AlterationOrder, Address,
  SlotTime, PaymentCheckout,
} from '@stitchit/types';
import { useToast } from '@stitchit/ui';
import { useAuthStore } from '../../store/auth-store';
import { ProtectedRoute } from '../../components/protected-route';

const endpoints = new ApiEndpoints(apiClient);

const SLOTS: { value: SlotTime; label: string }[] = [
  { value: 'MORNING_9_11', label: '9 AM – 11 AM' },
  { value: 'AFTERNOON_12_2', label: '12 PM – 2 PM' },
  { value: 'AFTERNOON_3_5', label: '3 PM – 5 PM' },
  { value: 'EVENING_6_8', label: '6 PM – 8 PM' },
];

interface SelectedService {
  service: AlterationService;
  garmentDescription: string;
  customerNotes: string;
}

interface BookingState {
  categoryId: number | null;
  selectedServices: SelectedService[];
  scheduledDate: string;
  scheduledSlot: SlotTime | '';
  addressId: number | null;
  specialInstructions: string;
}

const STEPS = [
  'Category',
  'Services',
  'Details',
  'Schedule',
  'Address',
  'Summary',
  'Payment',
  'Confirmation',
];

const CATEGORY_ICON_MAP: Record<string, string> = {
  PANT: '👖', SHIRT: '👔', KURTA: '🥻', JACKET: '🧥',
  SAREE_BLOUSE: '🪡', SUIT: '🤵', DRESS: '👗', OTHER: '✂️',
};

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.slice(0, 7).map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i < current
                  ? 'bg-[#C9A84C] text-[#0F1B2D]'
                  : i === current
                  ? 'bg-[#0F1B2D] dark:bg-[#F8F5F0] text-[#F8F5F0] dark:text-[#0F1B2D] ring-2 ring-[#C9A84C]'
                  : 'bg-[#0F1B2D]/10 dark:bg-[#F8F5F0]/10 text-[#2D2D2D]/40 dark:text-[#F8F5F0]/40'
              }`}
            >
              {i < current ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-medium hidden sm:block transition-colors ${
              i <= current ? 'text-[#2D2D2D] dark:text-[#F8F5F0]' : 'text-[#2D2D2D]/40 dark:text-[#F8F5F0]/40'
            }`}>
              {label}
            </span>
          </div>
          {i < 6 && (
            <div className={`h-0.5 w-6 sm:w-10 mb-5 transition-colors duration-300 ${
              i < current ? 'bg-[#C9A84C]' : 'bg-[#0F1B2D]/10 dark:bg-[#F8F5F0]/10'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Step 1: Category ─────────────────────────────────────────────────────────
function StepCategory({
  categories,
  selected,
  onSelect,
}: {
  categories: AlterationCategory[];
  selected: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0] mb-2">
        What garment needs alteration?
      </h2>
      <p className="text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 mb-6">
        Select the type of clothing you want altered.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all duration-200 ${
              selected === cat.id
                ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                : 'border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5'
            }`}
          >
            <span className="text-3xl">{cat.icon || CATEGORY_ICON_MAP[cat.type] || '✂️'}</span>
            <span className="text-sm font-semibold text-[#2D2D2D] dark:text-[#F8F5F0] text-center">
              {cat.displayName}
            </span>
            <span className="text-xs text-[#2D2D2D]/40 dark:text-[#F8F5F0]/40">
              {cat.serviceCount} services
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Services ─────────────────────────────────────────────────────────
function StepServices({
  services,
  selected,
  onToggle,
}: {
  services: AlterationService[];
  selected: SelectedService[];
  onToggle: (svc: AlterationService) => void;
}) {
  const selectedIds = new Set(selected.map((s) => s.service.id));

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0] mb-2">
        Select services
      </h2>
      <p className="text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 mb-6">
        Choose one or more alterations. You can select multiple.
      </p>
      <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
        {services.map((svc) => {
          const isSelected = selectedIds.has(svc.id);
          return (
            <button
              key={svc.id}
              onClick={() => onToggle(svc)}
              className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-150 ${
                isSelected
                  ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                  : 'border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 hover:border-[#C9A84C]/40'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                isSelected ? 'bg-[#C9A84C] border-[#C9A84C]' : 'border-[#0F1B2D]/30 dark:border-[#F8F5F0]/30'
              }`}>
                {isSelected && <Check className="w-3 h-3 text-[#0F1B2D]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {svc.icon && <span className="text-lg">{svc.icon}</span>}
                  <span className="font-semibold text-sm text-[#2D2D2D] dark:text-[#F8F5F0]">
                    {svc.name}
                  </span>
                </div>
                {svc.description && (
                  <p className="text-xs text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50 mt-0.5 line-clamp-2">
                    {svc.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-sm font-bold text-[#C9A84C]">₹{svc.basePrice}</span>
                  {svc.estimatedDays && (
                    <span className="text-xs text-[#2D2D2D]/40 dark:text-[#F8F5F0]/40">
                      ~{svc.estimatedDays}d
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex justify-between items-center">
          <span className="text-sm text-[#2D2D2D] dark:text-[#F8F5F0]">
            {selected.length} service{selected.length > 1 ? 's' : ''} selected
          </span>
          <span className="font-bold text-[#C9A84C]">
            ₹{selected.reduce((s, i) => s + i.service.basePrice, 0)}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Step 3: Item Details ─────────────────────────────────────────────────────
function StepDetails({
  items,
  onChange,
}: {
  items: SelectedService[];
  onChange: (idx: number, field: 'garmentDescription' | 'customerNotes', value: string) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0] mb-2">
        Tell us about your garments
      </h2>
      <p className="text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 mb-6">
        Briefly describe each garment so our tailor knows what to look for.
      </p>
      <div className="space-y-6 max-h-[440px] overflow-y-auto pr-1">
        {items.map((item, idx) => (
          <div key={item.service.id} className="p-4 rounded-2xl border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 space-y-3">
            <div className="flex items-center gap-2">
              {item.service.icon && <span className="text-lg">{item.service.icon}</span>}
              <span className="font-semibold text-sm text-[#2D2D2D] dark:text-[#F8F5F0]">
                {item.service.name}
              </span>
              <span className="ml-auto text-sm font-bold text-[#C9A84C]">
                ₹{item.service.basePrice}
              </span>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider">
                Garment description
              </label>
              <input
                type="text"
                placeholder="e.g. Blue slim-fit jeans, size 32"
                value={item.garmentDescription}
                onChange={(e) => onChange(idx, 'garmentDescription', e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#0F1B2D]/20 dark:border-[#F8F5F0]/20 bg-transparent px-3 py-2 text-sm text-[#2D2D2D] dark:text-[#F8F5F0] placeholder:text-[#2D2D2D]/30 dark:placeholder:text-[#F8F5F0]/30 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider">
                Special notes <span className="font-normal normal-case">(optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Please take in 1 inch on each side"
                value={item.customerNotes}
                onChange={(e) => onChange(idx, 'customerNotes', e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#0F1B2D]/20 dark:border-[#F8F5F0]/20 bg-transparent px-3 py-2 text-sm text-[#2D2D2D] dark:text-[#F8F5F0] placeholder:text-[#2D2D2D]/30 dark:placeholder:text-[#F8F5F0]/30 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 transition resize-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 4: Schedule ─────────────────────────────────────────────────────────
function StepSchedule({
  date,
  slot,
  onDateChange,
  onSlotChange,
}: {
  date: string;
  slot: SlotTime | '';
  onDateChange: (d: string) => void;
  onSlotChange: (s: SlotTime) => void;
}) {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split('T')[0];

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0] mb-2">
        When should we visit?
      </h2>
      <p className="text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 mb-6">
        Our tailor will come to collect your garments at the chosen time.
      </p>
      <div className="space-y-5">
        <div>
          <label className="text-xs font-semibold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider">
            Date
          </label>
          <input
            type="date"
            min={minDate}
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#0F1B2D]/20 dark:border-[#F8F5F0]/20 bg-transparent px-3 py-2.5 text-sm text-[#2D2D2D] dark:text-[#F8F5F0] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 transition"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider">
            Time Slot
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {SLOTS.map((s) => (
              <button
                key={s.value}
                onClick={() => onSlotChange(s.value)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  slot === s.value
                    ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#2D2D2D] dark:text-[#F8F5F0]'
                    : 'border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 hover:border-[#C9A84C]/40'
                }`}
              >
                <Clock className="w-4 h-4 shrink-0" />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 5: Address ──────────────────────────────────────────────────────────
const EMPTY_ADDRESS_FORM = { street: '', city: '', state: '', postalCode: '', country: 'India' };

function StepAddress({
  addresses,
  selectedId,
  onSelect,
}: {
  addresses: Address[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const queryClient = useQueryClient();
  const { toast, error } = useToast();
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [form, setForm] = useState(EMPTY_ADDRESS_FORM);

  const createAddressMutation = useMutation({
    mutationFn: () =>
      endpoints.createAddress({ ...form, isDefault: addresses.length === 0 }),
    onSuccess: async (addr) => {
      await queryClient.invalidateQueries({ queryKey: ['addresses'] });
      onSelect(Number(addr.id));
      setShowForm(false);
      setForm(EMPTY_ADDRESS_FORM);
      toast('Address saved', 'success');
    },
    onError: (err) => {
      if (err instanceof ApiRequestError) error(err.error.message);
      else error('Failed to save address. Please try again.');
    },
  });

  const formValid =
    form.street.trim() && form.city.trim() && form.state.trim() &&
    form.postalCode.trim() && form.country.trim();

  const setField = (field: keyof typeof EMPTY_ADDRESS_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const inputClass =
    'mt-1 w-full rounded-xl border border-[#0F1B2D]/20 dark:border-[#F8F5F0]/20 bg-transparent px-3 py-2 text-sm text-[#2D2D2D] dark:text-[#F8F5F0] placeholder:text-[#2D2D2D]/30 dark:placeholder:text-[#F8F5F0]/30 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 transition';
  const labelClass =
    'text-xs font-semibold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider';

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0] mb-2">
        Pickup address
      </h2>
      <p className="text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 mb-6">
        Our tailor will visit this address to collect your garments.
      </p>
      <div className="space-y-3">
        {addresses.map((addr) => (
          <button
            key={addr.id}
            onClick={() => onSelect(Number(addr.id))}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
              selectedId === Number(addr.id)
                ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                : 'border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 hover:border-[#C9A84C]/40'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                selectedId === Number(addr.id)
                  ? 'bg-[#C9A84C] border-[#C9A84C]'
                  : 'border-[#0F1B2D]/30 dark:border-[#F8F5F0]/30'
              }`}>
                {selectedId === Number(addr.id) && <Check className="w-3 h-3 text-[#0F1B2D]" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2D2D2D] dark:text-[#F8F5F0]">
                  {addr.street}
                  {addr.isDefault && (
                    <span className="ml-2 text-xs bg-[#C9A84C]/20 text-[#C9A84C] px-2 py-0.5 rounded-full font-medium">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-xs text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 mt-0.5">
                  {addr.city}, {addr.state} – {addr.postalCode}
                </p>
              </div>
            </div>
          </button>
        ))}

        {showForm ? (
          <div className="p-4 rounded-2xl border-2 border-[#C9A84C]/40 space-y-3">
            <p className="text-sm font-semibold text-[#2D2D2D] dark:text-[#F8F5F0] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C9A84C]" /> New address
            </p>
            <div>
              <label className={labelClass}>Street</label>
              <input type="text" placeholder="House no, street, area" value={form.street}
                     onChange={setField('street')} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>City</label>
                <input type="text" placeholder="City" value={form.city}
                       onChange={setField('city')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input type="text" placeholder="State" value={form.state}
                       onChange={setField('state')} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Postal code</label>
                <input type="text" placeholder="e.g. 560001" value={form.postalCode}
                       onChange={setField('postalCode')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input type="text" value={form.country}
                       onChange={setField('country')} className={inputClass} />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => createAddressMutation.mutate()}
                disabled={!formValid || createAddressMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F1B2D] dark:bg-[#C9A84C] text-[#F8F5F0] dark:text-[#0F1B2D] text-sm font-semibold hover:bg-[#C9A84C] hover:text-[#0F1B2D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {createAddressMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                ) : (
                  <><Check className="w-4 h-4" /> Save address</>
                )}
              </button>
              {addresses.length > 0 && (
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 hover:bg-[#0F1B2D]/5 dark:hover:bg-[#F8F5F0]/5 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-[#0F1B2D]/20 dark:border-[#F8F5F0]/20 text-sm font-medium text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 hover:border-[#C9A84C]/60 hover:text-[#C9A84C] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add new address
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Step 6: Summary ──────────────────────────────────────────────────────────
function StepSummary({
  booking,
  addresses,
  categories,
  specialInstructions,
  onSpecialInstructionsChange,
}: {
  booking: BookingState;
  addresses: Address[];
  categories: AlterationCategory[];
  specialInstructions: string;
  onSpecialInstructionsChange: (v: string) => void;
}) {
  const address = addresses.find((a) => Number(a.id) === booking.addressId);
  const category = categories.find((c) => c.id === booking.categoryId);
  const total = booking.selectedServices.reduce((s, i) => s + i.service.basePrice, 0);
  const slotLabel = SLOTS.find((s) => s.value === booking.scheduledSlot)?.label ?? '';

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0] mb-2">
        Review your booking
      </h2>
      <p className="text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 mb-6">
        Double-check everything before confirming.
      </p>
      <div className="space-y-4">
        {/* Category */}
        <SummaryRow label="Category" value={category?.displayName ?? ''} />

        {/* Services */}
        <div className="p-4 rounded-2xl bg-[#0F1B2D]/5 dark:bg-[#F8F5F0]/5 space-y-2">
          <p className="text-xs font-semibold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider">
            Services
          </p>
          {booking.selectedServices.map((item) => (
            <div key={item.service.id} className="flex justify-between items-start text-sm">
              <div>
                <span className="text-[#2D2D2D] dark:text-[#F8F5F0] font-medium">
                  {item.service.name}
                </span>
                {item.garmentDescription && (
                  <p className="text-xs text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50">
                    {item.garmentDescription}
                  </p>
                )}
              </div>
              <span className="text-[#C9A84C] font-bold shrink-0 ml-4">
                ₹{item.service.basePrice}
              </span>
            </div>
          ))}
          <div className="border-t border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 pt-2 flex justify-between text-sm font-bold">
            <span className="text-[#2D2D2D] dark:text-[#F8F5F0]">Total</span>
            <span className="text-[#C9A84C]">₹{total}</span>
          </div>
        </div>

        {/* Schedule */}
        <SummaryRow label="Date" value={new Date(booking.scheduledDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} icon={<Calendar className="w-4 h-4" />} />
        <SummaryRow label="Time slot" value={slotLabel} icon={<Clock className="w-4 h-4" />} />

        {/* Address */}
        {address && (
          <SummaryRow
            label="Pickup address"
            value={`${address.street}, ${address.city}, ${address.state} – ${address.postalCode}`}
            icon={<MapPin className="w-4 h-4" />}
          />
        )}

        {/* Special Instructions */}
        <div>
          <label className="text-xs font-semibold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 uppercase tracking-wider">
            Special instructions <span className="font-normal normal-case">(optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Any special instructions for the tailor?"
            value={specialInstructions}
            onChange={(e) => onSpecialInstructionsChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#0F1B2D]/20 dark:border-[#F8F5F0]/20 bg-transparent px-3 py-2 text-sm text-[#2D2D2D] dark:text-[#F8F5F0] placeholder:text-[#2D2D2D]/30 dark:placeholder:text-[#F8F5F0]/30 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 transition resize-none"
          />
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0F1B2D]/5 dark:bg-[#F8F5F0]/5">
      {icon && <span className="text-[#C9A84C] mt-0.5 shrink-0">{icon}</span>}
      <div>
        <p className="text-xs font-semibold text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm text-[#2D2D2D] dark:text-[#F8F5F0] font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── Step 7: Payment ──────────────────────────────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function StepPayment({ order, onPaid }: { order: AlterationOrder; onPaid: () => void }) {
  const router = useRouter();
  const { toast, error } = useToast();
  const [checkout, setCheckout] = useState<PaymentCheckout | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    endpoints
      .createPaymentCheckout(order.id)
      .then(setCheckout)
      .catch(() => error('Could not start payment. You can pay later from My Orders.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.id]);

  const completeVerification = async (
    providerOrderId: string,
    providerPaymentId: string,
    signature: string
  ) => {
    try {
      await endpoints.verifyPayment({ providerOrderId, providerPaymentId, signature });
      toast('Payment successful!', 'success');
      onPaid();
    } catch (err) {
      if (err instanceof ApiRequestError) error(err.error.message);
      else error('Payment verification failed. Contact support if the amount was deducted.');
    } finally {
      setPaying(false);
    }
  };

  const handlePay = async () => {
    if (!checkout) return;
    setPaying(true);

    if (checkout.provider === 'MOCK') {
      await completeVerification(checkout.providerOrderId, `mock_pay_${Date.now()}`, 'mock');
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      error('Could not load the payment gateway. Check your connection and retry.');
      setPaying(false);
      return;
    }
    type RazorpayResponse = {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };
    const RazorpayCtor = (window as unknown as {
      Razorpay: new (options: Record<string, unknown>) => { open: () => void };
    }).Razorpay;
    const rzp = new RazorpayCtor({
      key: checkout.keyId,
      amount: Math.round(checkout.amount * 100),
      currency: checkout.currency,
      name: 'StitchIt',
      description: `Alteration order #${order.id}`,
      order_id: checkout.providerOrderId,
      handler: (resp: RazorpayResponse) =>
        completeVerification(resp.razorpay_order_id, resp.razorpay_payment_id, resp.razorpay_signature),
      modal: { ondismiss: () => setPaying(false) },
      theme: { color: '#C9A84C' },
    });
    rzp.open();
  };

  return (
    <div className="text-center py-4">
      <div className="w-16 h-16 rounded-full bg-[#C9A84C]/15 flex items-center justify-center mx-auto mb-5">
        <CreditCard className="w-8 h-8 text-[#C9A84C]" />
      </div>
      <h2 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0] mb-2">
        Complete your payment
      </h2>
      <p className="text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 mb-6">
        Order #{order.id} is reserved. Pay now to confirm your booking.
      </p>
      <div className="max-w-xs mx-auto p-4 rounded-2xl bg-[#0F1B2D]/5 dark:bg-[#F8F5F0]/5 mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60">Amount due</span>
          <span className="font-bold text-[#C9A84C] text-lg">₹{order.totalPrice}</span>
        </div>
        {checkout?.provider === 'MOCK' && (
          <p className="text-[11px] text-[#2D2D2D]/40 dark:text-[#F8F5F0]/40 mt-1">
            Test mode — no real money is charged
          </p>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handlePay}
          disabled={!checkout || paying}
          className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-[#0F1B2D] dark:bg-[#C9A84C] text-[#F8F5F0] dark:text-[#0F1B2D] text-sm font-semibold hover:bg-[#C9A84C] hover:text-[#0F1B2D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {paying ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
          ) : (
            <>Pay ₹{order.totalPrice}{checkout?.provider === 'MOCK' ? ' (Test)' : ''}</>
          )}
        </button>
        <button
          onClick={() => router.push('/alterations/orders')}
          className="px-6 py-2.5 rounded-xl border border-[#0F1B2D]/20 dark:border-[#F8F5F0]/20 text-sm font-semibold text-[#2D2D2D] dark:text-[#F8F5F0] hover:bg-[#0F1B2D]/5 dark:hover:bg-[#F8F5F0]/5 transition-colors"
        >
          Pay Later
        </button>
      </div>
    </div>
  );
}

// ─── Step 8: Confirmation ────────────────────────────────────────────────────
function StepConfirmation({ orderId, paid }: { orderId: number; paid: boolean }) {
  const router = useRouter();
  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-10 h-10 text-green-500" />
      </motion.div>
      <h2 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0] mb-2">
        Booking confirmed!
      </h2>
      <p className="text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 mb-1">
        Your alteration order #{orderId} has been placed
        {paid ? ' and paid' : ''}.
      </p>
      <p className="text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 mb-8">
        Our tailor will visit you at the scheduled time to collect your garments.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => router.push('/alterations/orders')}
          className="px-6 py-2.5 rounded-xl bg-[#0F1B2D] dark:bg-[#F8F5F0] text-[#F8F5F0] dark:text-[#0F1B2D] text-sm font-semibold hover:bg-[#C9A84C] hover:text-[#0F1B2D] transition-colors"
        >
          View My Orders
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 rounded-xl border border-[#0F1B2D]/20 dark:border-[#F8F5F0]/20 text-sm font-semibold text-[#2D2D2D] dark:text-[#F8F5F0] hover:bg-[#0F1B2D]/5 dark:hover:bg-[#F8F5F0]/5 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function AlterationsContent() {
  const { toast, error } = useToast();
  const [step, setStep] = useState(0);
  const [confirmedOrder, setConfirmedOrder] = useState<AlterationOrder | null>(null);
  const [paid, setPaid] = useState(false);
  const [booking, setBooking] = useState<BookingState>({
    categoryId: null,
    selectedServices: [],
    scheduledDate: '',
    scheduledSlot: '',
    addressId: null,
    specialInstructions: '',
  });

  const categoriesQuery = useQuery({
    queryKey: ['alteration-categories'],
    queryFn: () => endpoints.getAlterationCategories(),
    staleTime: 10 * 60 * 1000,
  });

  const servicesQuery = useQuery({
    queryKey: ['alteration-services', booking.categoryId],
    queryFn: () => endpoints.getAlterationServices(booking.categoryId!),
    enabled: booking.categoryId != null,
    staleTime: 10 * 60 * 1000,
  });

  const addressesQuery = useQuery({
    queryKey: ['addresses'],
    queryFn: () => endpoints.getAddresses(),
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      endpoints.createAlterationOrder({
        addressId: booking.addressId!,
        scheduledDate: booking.scheduledDate,
        scheduledSlot: booking.scheduledSlot as SlotTime,
        items: booking.selectedServices.map((s) => ({
          alterationServiceId: s.service.id,
          garmentDescription: s.garmentDescription || undefined,
          customerNotes: s.customerNotes || undefined,
        })),
        specialInstructions: booking.specialInstructions || undefined,
      }),
    onSuccess: (order) => {
      setConfirmedOrder(order);
      setStep(6);
      toast('Order created — complete payment to confirm', 'success');
    },
    onError: (err) => {
      if (err instanceof ApiRequestError) {
        error(err.error.message);
      } else {
        error('Failed to place order. Please try again.');
      }
    },
  });

  const toggleService = useCallback((svc: AlterationService) => {
    setBooking((prev) => {
      const exists = prev.selectedServices.findIndex((s) => s.service.id === svc.id);
      if (exists >= 0) {
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter((_, i) => i !== exists),
        };
      }
      return {
        ...prev,
        selectedServices: [...prev.selectedServices, { service: svc, garmentDescription: '', customerNotes: '' }],
      };
    });
  }, []);

  const updateItemDetail = useCallback(
    (idx: number, field: 'garmentDescription' | 'customerNotes', value: string) => {
      setBooking((prev) => {
        const items = [...prev.selectedServices];
        items[idx] = { ...items[idx], [field]: value };
        return { ...prev, selectedServices: items };
      });
    },
    []
  );

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return booking.categoryId != null;
      case 1: return booking.selectedServices.length > 0;
      case 2: return true;
      case 3: return !!booking.scheduledDate && !!booking.scheduledSlot;
      case 4: return booking.addressId != null;
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === 5) {
      createMutation.mutate();
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const categories = categoriesQuery.data ?? [];
  const services = servicesQuery.data ?? [];
  const addresses = addressesQuery.data ?? [];

  const renderStep = () => {
    switch (step) {
      case 0:
        return categoriesQuery.isLoading ? (
          <CenteredLoader />
        ) : (
          <StepCategory
            categories={categories}
            selected={booking.categoryId}
            onSelect={(id) => {
              setBooking((prev) => ({ ...prev, categoryId: id, selectedServices: [] }));
            }}
          />
        );
      case 1:
        return servicesQuery.isLoading ? (
          <CenteredLoader />
        ) : (
          <StepServices
            services={services}
            selected={booking.selectedServices}
            onToggle={toggleService}
          />
        );
      case 2:
        return (
          <StepDetails items={booking.selectedServices} onChange={updateItemDetail} />
        );
      case 3:
        return (
          <StepSchedule
            date={booking.scheduledDate}
            slot={booking.scheduledSlot}
            onDateChange={(d) => setBooking((prev) => ({ ...prev, scheduledDate: d }))}
            onSlotChange={(s) => setBooking((prev) => ({ ...prev, scheduledSlot: s }))}
          />
        );
      case 4:
        return addressesQuery.isLoading ? (
          <CenteredLoader />
        ) : (
          <StepAddress
            addresses={addresses}
            selectedId={booking.addressId}
            onSelect={(id) => setBooking((prev) => ({ ...prev, addressId: id }))}
          />
        );
      case 5:
        return (
          <StepSummary
            booking={booking}
            addresses={addresses}
            categories={categories}
            specialInstructions={booking.specialInstructions}
            onSpecialInstructionsChange={(v) =>
              setBooking((prev) => ({ ...prev, specialInstructions: v }))
            }
          />
        );
      case 6:
        return confirmedOrder ? (
          <StepPayment
            order={confirmedOrder}
            onPaid={() => {
              setPaid(true);
              setStep(7);
            }}
          />
        ) : null;
      case 7:
        return <StepConfirmation orderId={confirmedOrder!.id} paid={paid} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] dark:bg-[#0F1B2D] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Scissors className="w-6 h-6 text-[#C9A84C]" />
            <h1 className="font-serif text-3xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">
              Alter My Cloth
            </h1>
          </div>
          <p className="text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60">
            Book a tailor visit. We collect your garments, alter them, and deliver them back.
          </p>
        </div>

        {/* Step Bar */}
        {step < 7 && (
          <div className="mb-8">
            <StepBar current={step} />
          </div>
        )}

        {/* Card */}
        <div className="bg-white dark:bg-[#1a2a42] rounded-3xl shadow-xl border border-[#0F1B2D]/5 dark:border-[#F8F5F0]/5 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {step < 6 && (
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-[#2D2D2D] dark:text-[#F8F5F0] hover:bg-[#0F1B2D]/5 dark:hover:bg-[#F8F5F0]/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed() || createMutation.isPending}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0F1B2D] dark:bg-[#C9A84C] text-[#F8F5F0] dark:text-[#0F1B2D] text-sm font-semibold hover:bg-[#C9A84C] hover:text-[#0F1B2D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Booking…
                  </>
                ) : step === 5 ? (
                  <>Confirm Booking <Check className="w-4 h-4" /></>
                ) : (
                  <>Next <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CenteredLoader() {
  return (
    <div className="flex justify-center py-12">
      <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
    </div>
  );
}

export default function AlterationsPage() {
  return (
    <ProtectedRoute>
      <AlterationsContent />
    </ProtectedRoute>
  );
}
