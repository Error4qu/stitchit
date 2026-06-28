'use client';

import React, { useState, useMemo, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, ArrowRight, ShoppingBag, RotateCcw } from 'lucide-react';
import { Button, Badge } from '@stitchit/ui';
import { MOCK_FABRICS, MOCK_STYLES, CUSTOMIZATION_OPTIONS } from '../../../lib/mock-data';
import { useCartStore } from '../../../store/cart-store';

export default function FabricDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const fabric = useMemo(() => MOCK_FABRICS.find((f) => f.id === unwrappedParams.id), [unwrappedParams.id]);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedStyleId, setSelectedStyleId] = useState<string>(MOCK_STYLES[0].id);
  const [selectedCollar, setSelectedCollar] = useState<string>(CUSTOMIZATION_OPTIONS.collar[0].name);
  const [selectedSleeve, setSelectedSleeve] = useState<string>(CUSTOMIZATION_OPTIONS.sleeve[0].name);
  const [selectedFit, setSelectedFit] = useState<string>(CUSTOMIZATION_OPTIONS.fit[0].name);

  const addItemToCart = useCartStore((state) => state.addItem);

  if (!fabric) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">Fabric Not Found</h2>
        <p className="text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70">The specified fabric ID does not exist in our active catalog.</p>
        <Link href="/catalog">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const selectedStyle = MOCK_STYLES.find((s) => s.id === selectedStyleId)!;
  // Compute estimated total price: base style price + (2 meters * fabric price)
  const totalPrice = selectedStyle.basePrice + (fabric.pricePerMeter * 2);

  const handleAddToCart = () => {
    addItemToCart({
      fabricId: fabric.id,
      fabricName: fabric.name,
      fabricColor: fabric.color,
      styleId: selectedStyle.id,
      styleName: selectedStyle.name,
      customizations: {
        collar: selectedCollar,
        sleeve: selectedSleeve,
        fit: selectedFit,
      },
      quantity: 1,
      price: totalPrice,
    });
    router.push('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back Link */}
      <Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 hover:text-[#C9A84C] dark:hover:text-[#C9A84C] transition-colors">
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Fabric Collection</span>
      </Link>

      {/* Primary Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white dark:bg-[#1a2a42] p-8 sm:p-12 rounded-3xl border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 shadow-lg">
        {/* Large Swatch */}
        <div className="lg:col-span-5 w-full h-80 sm:h-96 rounded-2xl overflow-hidden relative shadow-inner">
          <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: fabric.color }} />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 opacity-60" />
          <div className="absolute bottom-6 left-6 z-10 flex flex-wrap gap-2">
            <Badge variant="gold" className="text-sm px-4 py-1">{fabric.type}</Badge>
            <Badge variant="navy" className="text-sm px-4 py-1">{fabric.material}</Badge>
          </div>
        </div>

        {/* Fabric Info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">
              {fabric.name}
            </h1>
            <span className="font-sans font-bold text-2xl text-[#C9A84C] inline-block">
              ${fabric.pricePerMeter}<span className="text-sm font-normal text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60"> / meter</span>
            </span>
          </div>
          <p className="text-base text-[#2D2D2D]/80 dark:text-[#F8F5F0]/80 leading-relaxed">
            {fabric.description}
          </p>
          <div className="pt-4 border-t border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50 block mb-1">Color Shade</span>
              <span className="font-semibold text-[#0F1B2D] dark:text-[#F8F5F0]">{fabric.colorName}</span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50 block mb-1">Availability</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">In Stock (Mill Ready)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Wizard UI */}
      <div className="space-y-8 pt-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-3xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">Configure Your Bespoke Garment</h2>
          <p className="text-sm text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70">Complete our step wizard to assign your fabric to a garment style and specify custom structural elements.</p>
        </div>

        {/* Progress Tracker */}
        <div className="max-w-3xl mx-auto flex items-center justify-between relative px-4">
          <div className="absolute top-1/2 left-10 right-10 h-1 bg-[#0F1B2D]/10 dark:bg-[#F8F5F0]/10 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-10 h-1 bg-[#C9A84C] -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          />

          {[
            { step: 1, label: 'Choose Style' },
            { step: 2, label: 'Customize Accents' },
            { step: 3, label: 'Review & Confirm' },
          ].map((item) => (
            <div key={item.step} className="relative z-10 flex flex-col items-center space-y-2">
              <button
                onClick={() => setCurrentStep(item.step)}
                className={`w-12 h-12 rounded-full font-bold text-base flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
                  currentStep === item.step
                    ? 'bg-[#C9A84C] text-[#0F1B2D] scale-110 ring-4 ring-[#C9A84C]/20'
                    : currentStep > item.step
                    ? 'bg-[#0F1B2D] text-[#F8F5F0] dark:bg-[#F8F5F0] dark:text-[#0F1B2D]'
                    : 'bg-white dark:bg-[#1a2a42] text-[#2D2D2D]/40 dark:text-[#F8F5F0]/40 border-2 border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10'
                }`}
              >
                {currentStep > item.step ? <Check className="w-6 h-6" /> : item.step}
              </button>
              <span className={`text-xs font-bold uppercase tracking-wider ${currentStep === item.step ? 'text-[#C9A84C]' : 'text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step Contents */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
              {MOCK_STYLES.map((style) => {
                const isSelected = selectedStyleId === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => setSelectedStyleId(style.id)}
                    className={`p-8 rounded-3xl bg-white dark:bg-[#1a2a42] border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative shadow-lg hover:shadow-xl ${
                      isSelected ? 'border-[#C9A84C] ring-4 ring-[#C9A84C]/10 -translate-y-1' : 'border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-6 right-6 w-7 h-7 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#0F1B2D]">
                        <Check className="w-4 h-4 font-bold" />
                      </div>
                    )}
                    <div className="space-y-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">{style.category}</span>
                      <h3 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">{style.name}</h3>
                      <p className="text-sm text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 leading-relaxed">{style.description}</p>
                    </div>
                    <div className="pt-6 border-t border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 mt-6 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50">Base Cut Price</span>
                      <span className="font-bold text-[#C9A84C] text-xl">${style.basePrice}</span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto bg-white dark:bg-[#1a2a42] p-8 sm:p-12 rounded-3xl border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 shadow-lg space-y-12"
            >
              {/* Collar Options */}
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">1. Collar Architecture</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CUSTOMIZATION_OPTIONS.collar.map((collar) => {
                    const isSelected = selectedCollar === collar.name;
                    return (
                      <div
                        key={collar.id}
                        onClick={() => setSelectedCollar(collar.name)}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                          isSelected ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 hover:border-[#0F1B2D]/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-[#0F1B2D] dark:text-[#F8F5F0]">{collar.name}</h4>
                          {isSelected && <Check className="w-5 h-5 text-[#C9A84C]" />}
                        </div>
                        <p className="text-xs text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70">{collar.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sleeve Options */}
              <div className="space-y-6 pt-6 border-t border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10">
                <h3 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">2. Sleeve & Cuff Finishing</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CUSTOMIZATION_OPTIONS.sleeve.map((sleeve) => {
                    const isSelected = selectedSleeve === sleeve.name;
                    return (
                      <div
                        key={sleeve.id}
                        onClick={() => setSelectedSleeve(sleeve.name)}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                          isSelected ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 hover:border-[#0F1B2D]/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-[#0F1B2D] dark:text-[#F8F5F0]">{sleeve.name}</h4>
                          {isSelected && <Check className="w-5 h-5 text-[#C9A84C]" />}
                        </div>
                        <p className="text-xs text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70">{sleeve.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fit Options */}
              <div className="space-y-6 pt-6 border-t border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10">
                <h3 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">3. Fit Silhouette</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CUSTOMIZATION_OPTIONS.fit.map((fit) => {
                    const isSelected = selectedFit === fit.name;
                    return (
                      <div
                        key={fit.id}
                        onClick={() => setSelectedFit(fit.name)}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                          isSelected ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 hover:border-[#0F1B2D]/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-[#0F1B2D] dark:text-[#F8F5F0]">{fit.name}</h4>
                          {isSelected && <Check className="w-5 h-5 text-[#C9A84C]" />}
                        </div>
                        <p className="text-xs text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70">{fit.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto bg-white dark:bg-[#1a2a42] p-8 sm:p-12 rounded-3xl border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 shadow-lg space-y-8"
            >
              <h3 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">Bespoke Order Specification</h3>

              <div className="space-y-6 p-6 rounded-2xl bg-[#F8F5F0] dark:bg-[#0F1B2D] border border-[#0F1B2D]/5 dark:border-[#F8F5F0]/5">
                <div className="flex items-center justify-between border-b border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50 block mb-1">Fabric Selection</span>
                    <h4 className="font-serif font-bold text-lg text-[#0F1B2D] dark:text-[#F8F5F0]">{fabric.name}</h4>
                  </div>
                  <span className="font-semibold text-[#C9A84C]">${fabric.pricePerMeter} / m</span>
                </div>

                <div className="flex items-center justify-between border-b border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50 block mb-1">Garment Style</span>
                    <h4 className="font-serif font-bold text-lg text-[#0F1B2D] dark:text-[#F8F5F0]">{selectedStyle.name}</h4>
                  </div>
                  <span className="font-semibold text-[#C9A84C]">${selectedStyle.basePrice}</span>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50 block">Assigned Accents</span>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="px-4 py-1.5 text-sm">Collar: {selectedCollar}</Badge>
                    <Badge variant="outline" className="px-4 py-1.5 text-sm">Sleeve: {selectedSleeve}</Badge>
                    <Badge variant="outline" className="px-4 py-1.5 text-sm">Fit: {selectedFit}</Badge>
                  </div>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="space-y-4 pt-4 border-t border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10">
                <div className="flex justify-between text-sm text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70">
                  <span>Style Base Cut Fee</span>
                  <span>${selectedStyle.basePrice}</span>
                </div>
                <div className="flex justify-between text-sm text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70">
                  <span>Est. Fabric Requirement (2 Meters)</span>
                  <span>${fabric.pricePerMeter * 2}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0] pt-2 border-t border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10">
                  <span>Estimated Line Total</span>
                  <span className="text-[#C9A84C]">${totalPrice}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" onClick={handleAddToCart} className="w-full text-lg py-6 rounded-xl shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Shopping Cart</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wizard Navigation */}
        <div className="max-w-4xl mx-auto flex items-center justify-between pt-6 border-t border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 px-4">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2 font-semibold text-base py-6 px-8 rounded-xl disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous Step</span>
          </Button>

          {currentStep < 3 && (
            <Button
              variant="primary"
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 3))}
              className="flex items-center gap-2 font-semibold text-base py-6 px-10 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              <span>Next Step</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
