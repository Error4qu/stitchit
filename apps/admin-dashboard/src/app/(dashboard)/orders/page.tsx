'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function AdminOrdersPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-[#0F1B2D]">Orders</h1>
        <p className="text-sm text-[#2D2D2D]/60 mt-1">Manage tailoring orders.</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#0F1B2D]/10 flex flex-col items-center py-20">
        <ShoppingBag className="w-12 h-12 text-[#2D2D2D]/20 mb-3" />
        <p className="text-sm text-[#2D2D2D]/40">Tailoring order management coming soon.</p>
      </div>
    </div>
  );
}
