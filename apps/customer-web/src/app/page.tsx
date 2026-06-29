'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scissors, UserCheck, Package } from 'lucide-react';
import { Button } from '@stitchit/ui';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-[#0F1B2D] text-[#F8F5F0] overflow-hidden px-4 sm:px-6 lg:px-8 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(26,42,66,0.8),transparent_50%)]" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C] text-sm font-medium mb-4"
          >
            <Scissors className="w-4 h-4" />
            <span>Expert Tailoring • Doorstep Collection</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] text-[#F8F5F0]"
          >
            Alterations Done Right, <br className="hidden sm:inline" />
            <span className="text-[#C9A84C] italic">At Your Doorstep</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl md:text-2xl text-[#F8F5F0]/80 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            Book a tailor visit, hand over your garments, and get them back perfectly altered. No stepping out, no waiting in queues.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/alterations">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-10 py-6 rounded-xl shadow-xl hover:scale-105 transition-transform">
                Book an Alteration
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto text-lg text-[#F8F5F0] hover:bg-[#F8F5F0]/10 px-8 py-6 rounded-xl">
                How It Works
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8F5F0] dark:from-[#0F1B2D] to-transparent pointer-events-none transition-colors duration-300" />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full bg-[#0F1B2D]/5 dark:bg-[#1a2a42]/50 py-28 border-y border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0] tracking-tight">
              How It Works
            </h2>
            <p className="text-base text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70">
              Three steps. Zero hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-20 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#C9A84C]/20 via-[#C9A84C] to-[#C9A84C]/20 z-0" />

            {[
              {
                icon: <Scissors className="w-10 h-10" />,
                step: 'Step 01',
                title: 'Book Online',
                desc: 'Choose your garment type, pick the alterations you need, and select a convenient date and time slot.',
                rotate: 'rotate-3',
              },
              {
                icon: <UserCheck className="w-10 h-10" />,
                step: 'Step 02',
                title: 'Tailor Visits You',
                desc: 'Our expert tailor comes to your address, collects your garments, and notes exactly what needs to be done.',
                rotate: '-rotate-3',
              },
              {
                icon: <Package className="w-10 h-10" />,
                step: 'Step 03',
                title: 'Delivered Back',
                desc: 'Your altered garments are returned to you within the estimated timeframe — perfectly fitted.',
                rotate: 'rotate-3',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center space-y-6 p-6 rounded-3xl bg-white dark:bg-[#0F1B2D] border border-[#0F1B2D]/5 dark:border-[#F8F5F0]/5 shadow-xl"
              >
                <div className={`w-20 h-20 rounded-2xl bg-[#C9A84C] text-[#0F1B2D] flex items-center justify-center shadow-lg shadow-[#C9A84C]/20 transform ${item.rotate} hover:rotate-0 transition-transform`}>
                  {item.icon}
                </div>
                <span className="px-4 py-1 rounded-full bg-[#0F1B2D] text-[#F8F5F0] dark:bg-[#F8F5F0] dark:text-[#0F1B2D] font-bold text-xs tracking-wider uppercase">
                  {item.step}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link href="/alterations">
              <Button variant="primary" size="lg" className="rounded-xl px-10 py-5 text-base font-semibold hover:scale-105 transition-transform">
                <Scissors className="w-4 h-4 mr-2 inline" />
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
