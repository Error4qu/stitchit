'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Scissors } from 'lucide-react';
import { Button, Badge, Modal } from '@stitchit/ui';
import { useCartStore } from '../../store/cart-store';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading cart...</div>;
  }

  const subtotal = getTotal();
  const estimatedTailoringFee = items.length > 0 ? 50 : 0;
  const grandTotal = subtotal + estimatedTailoringFee;

  const handleProceedToCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmOrder = () => {
    alert('Thank you for your order! A master tailor will contact you shortly to confirm your visit schedule.');
    clearCart();
    setIsCheckoutModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-2 pb-6 border-b border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">
          Your Shopping Cart
        </h1>
        <p className="text-base text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70">
          Review your configured fabrics, assigned garment styles, and custom structural accents before proceeding to secure checkout.
        </p>
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-white dark:bg-[#1a2a42] rounded-3xl border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 p-8 space-y-6 shadow-sm"
        >
          <div className="w-24 h-24 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] mx-auto flex items-center justify-center">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">Your Cart is Empty</h2>
          <p className="text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 max-w-md mx-auto">
            You have not added any bespoke garment configurations to your cart yet. Browse our legendary fabric collections to get started.
          </p>
          <Link href="/catalog">
            <Button variant="primary" size="lg" className="rounded-xl px-10 py-6 text-base font-semibold shadow-lg hover:scale-105 transition-transform">
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="flex flex-col sm:flex-row gap-6 p-6 rounded-3xl bg-white dark:bg-[#1a2a42] border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 shadow-md items-center"
                >
                  {/* Swatch */}
                  <div className="w-full sm:w-32 h-32 rounded-2xl shrink-0 relative overflow-hidden shadow-inner">
                    <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: item.fabricColor }} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 opacity-60" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C9A84C]">{item.styleName}</span>
                        <h3 className="font-serif text-xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">{item.fabricName}</h3>
                      </div>
                      <span className="font-sans font-bold text-xl text-[#C9A84C]">${item.price}</span>
                    </div>

                    {/* Customizations */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Badge variant="default">Collar: {item.customizations.collar}</Badge>
                      <Badge variant="default">Sleeve: {item.customizations.sleeve}</Badge>
                      <Badge variant="default">Fit: {item.customizations.fit}</Badge>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#0F1B2D]/5 dark:border-[#F8F5F0]/5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60">Quantity:</span>
                        <select
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                          className="h-9 px-3 rounded-lg border border-[#0F1B2D]/20 dark:border-[#F8F5F0]/20 bg-[#F8F5F0] dark:bg-[#0F1B2D] text-[#2D2D2D] dark:text-[#F8F5F0] font-bold text-sm outline-none cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-4">
              <Link href="/catalog" className="text-sm font-bold text-[#C9A84C] hover:underline flex items-center gap-2">
                <span>← Continue Shopping</span>
              </Link>
              <button
                onClick={clearCart}
                className="text-xs font-bold text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50 hover:underline cursor-pointer"
              >
                Clear Entire Cart
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#1a2a42] border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 shadow-lg space-y-8">
              <h2 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70">
                  <span>Items Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70">
                  <span className="flex items-center gap-1.5">
                    <Scissors className="w-4 h-4 text-[#C9A84C]" />
                    <span>Master Tailor Visit Fee</span>
                  </span>
                  <span>${estimatedTailoringFee}</span>
                </div>
                <div className="flex justify-between text-sm text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#C9A84C]" />
                    <span>Insured Shipping</span>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE</span>
                </div>

                <div className="pt-4 border-t border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 flex justify-between items-center">
                  <span className="font-serif font-bold text-lg text-[#0F1B2D] dark:text-[#F8F5F0]">Grand Total</span>
                  <span className="font-sans font-bold text-2xl text-[#C9A84C]">${grandTotal}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleProceedToCheckout}
                className="w-full py-6 rounded-xl text-lg font-semibold shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </Button>

              <div className="space-y-3 pt-4 border-t border-[#0F1B2D]/5 dark:border-[#F8F5F0]/5">
                <div className="flex items-center gap-3 text-xs text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60">
                  <ShieldCheck className="w-5 h-5 text-[#C9A84C] shrink-0" />
                  <span>Secure 256-bit SSL encrypted checkout</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60">
                  <Truck className="w-5 h-5 text-[#C9A84C] shrink-0" />
                  <span>Fully insured complimentary worldwide shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <Modal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        title="Confirm Bespoke Tailoring Order"
        description="Review your delivery location and schedule specifications."
        size="lg"
      >
        <div className="space-y-6 pt-4">
          <div className="p-4 rounded-2xl bg-[#F8F5F0] dark:bg-[#0F1B2D] border border-[#0F1B2D]/5 dark:border-[#F8F5F0]/5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50 block">Amount to Authorize</span>
            <div className="flex justify-between items-center">
              <span className="font-serif font-bold text-xl text-[#0F1B2D] dark:text-[#F8F5F0]">Total Payment</span>
              <span className="font-sans font-bold text-2xl text-[#C9A84C]">${grandTotal}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg text-[#0F1B2D] dark:text-[#F8F5F0]">Tailor Visit Location</h4>
            <p className="text-xs text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70">
              Our master tailor will visit this address to record your exact posture and physical measurements.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Street Address"
                defaultValue="742 Evergreen Terrace"
                className="w-full h-11 px-4 rounded-xl border border-[#0F1B2D]/20 dark:border-[#F8F5F0]/20 bg-white dark:bg-[#1a2a42] text-[#2D2D2D] dark:text-[#F8F5F0] text-sm outline-none focus:ring-2 focus:ring-[#C9A84C]"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  defaultValue="Springfield"
                  className="w-full h-11 px-4 rounded-xl border border-[#0F1B2D]/20 dark:border-[#F8F5F0]/20 bg-white dark:bg-[#1a2a42] text-[#2D2D2D] dark:text-[#F8F5F0] text-sm outline-none focus:ring-2 focus:ring-[#C9A84C]"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  defaultValue="49007"
                  className="w-full h-11 px-4 rounded-xl border border-[#0F1B2D]/20 dark:border-[#F8F5F0]/20 bg-white dark:bg-[#1a2a42] text-[#2D2D2D] dark:text-[#F8F5F0] text-sm outline-none focus:ring-2 focus:ring-[#C9A84C]"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 flex justify-end gap-4">
            <Button variant="ghost" onClick={() => setIsCheckoutModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmOrder} className="px-8 py-5 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform">
              Authorize Payment & Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
