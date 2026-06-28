'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scissors, UserCheck, Package, Star, Quote } from 'lucide-react';
import { Button } from '@stitchit/ui';
import { MOCK_FABRICS, MOCK_TESTIMONIALS } from '../lib/mock-data';
import { FabricCard } from '../components/fabric-card';

export default function HomePage() {
  const featuredFabrics = MOCK_FABRICS.slice(0, 4);

  return (
    <main className="flex flex-col items-center w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-[#0F1B2D] text-[#F8F5F0] overflow-hidden px-4 sm:px-6 lg:px-8 py-20">
        {/* Subtle glowing background gradient */}
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
            <span>Master Tailoring • Premium Italian Fabrics</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] text-[#F8F5F0]"
          >
            Bespoke Tailoring, <br className="hidden sm:inline" />
            <span className="text-[#C9A84C] italic">Delivered to Your Door</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl md:text-2xl text-[#F8F5F0]/80 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            Experience the pinnacle of custom clothing. Select from world-class fabrics, receive an expert tailoring visit at your location, and enjoy a flawless fit.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/catalog">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-10 py-6 rounded-xl shadow-xl hover:scale-105 transition-transform">
                Explore Collection
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto text-lg text-[#F8F5F0] hover:bg-[#F8F5F0]/10 px-8 py-6 rounded-xl">
                How It Works
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Bottom wave/fade overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8F5F0] dark:from-[#0F1B2D] to-transparent pointer-events-none transition-colors duration-300" />
      </section>

      {/* Featured Fabrics Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 pb-6">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0] tracking-tight">
              Our Finest Fabrics
            </h2>
            <p className="text-base text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 max-w-2xl">
              Curated from legendary mills across Italy and the UK. Examine the drape, texture, and specifications of our seasonal highlights.
            </p>
          </div>
          <Link href="/catalog" className="shrink-0">
            <Button variant="outline" size="md" className="rounded-xl font-semibold hover:bg-[#C9A84C] hover:text-[#0F1B2D] transition-colors">
              View Full Collection
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredFabrics.map((fabric, index) => (
            <FabricCard key={fabric.id} fabric={fabric} index={index} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full bg-[#0F1B2D]/5 dark:bg-[#1a2a42]/50 py-28 border-y border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0] tracking-tight">
              The Bespoke Experience
            </h2>
            <p className="text-base text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70">
              We have refined traditional tailoring into a seamless, modern three-step process designed entirely around your schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-20 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#C9A84C]/20 via-[#C9A84C] to-[#C9A84C]/20 z-0" />

            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative z-10 flex flex-col items-center text-center space-y-6 p-6 rounded-3xl bg-white dark:bg-[#0F1B2D] border border-[#0F1B2D]/5 dark:border-[#F8F5F0]/5 shadow-xl"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#C9A84C] text-[#0F1B2D] flex items-center justify-center shadow-lg shadow-[#C9A84C]/20 transform rotate-3 hover:rotate-0 transition-transform">
                <Scissors className="w-10 h-10" />
              </div>
              <span className="px-4 py-1 rounded-full bg-[#0F1B2D] text-[#F8F5F0] dark:bg-[#F8F5F0] dark:text-[#0F1B2D] font-bold text-xs tracking-wider uppercase">
                Step 01
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">
                Choose Your Fabric
              </h3>
              <p className="text-sm text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 leading-relaxed">
                Browse our interactive catalog of pristine wools, cashmeres, and silks. Configure your preferred garment style and custom accents with our step wizard.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10 flex flex-col items-center text-center space-y-6 p-6 rounded-3xl bg-white dark:bg-[#0F1B2D] border border-[#0F1B2D]/5 dark:border-[#F8F5F0]/5 shadow-xl"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#C9A84C] text-[#0F1B2D] flex items-center justify-center shadow-lg shadow-[#C9A84C]/20 transform -rotate-3 hover:rotate-0 transition-transform">
                <UserCheck className="w-10 h-10" />
              </div>
              <span className="px-4 py-1 rounded-full bg-[#0F1B2D] text-[#F8F5F0] dark:bg-[#F8F5F0] dark:text-[#0F1B2D] font-bold text-xs tracking-wider uppercase">
                Step 02
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">
                Tailor Visits You
              </h3>
              <p className="text-sm text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 leading-relaxed">
                Our certified master tailor visits your home or office at your selected time. We capture over 20 posture and sizing metrics for a flawless architectural pattern.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative z-10 flex flex-col items-center text-center space-y-6 p-6 rounded-3xl bg-white dark:bg-[#0F1B2D] border border-[#0F1B2D]/5 dark:border-[#F8F5F0]/5 shadow-xl"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#C9A84C] text-[#0F1B2D] flex items-center justify-center shadow-lg shadow-[#C9A84C]/20 transform rotate-3 hover:rotate-0 transition-transform">
                <Package className="w-10 h-10" />
              </div>
              <span className="px-4 py-1 rounded-full bg-[#0F1B2D] text-[#F8F5F0] dark:bg-[#F8F5F0] dark:text-[#0F1B2D] font-bold text-xs tracking-wider uppercase">
                Step 03
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">
                Perfectly Delivered
              </h3>
              <p className="text-sm text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 leading-relaxed">
                Your custom garment is hand-stitched by skilled artisans, subjected to rigorous quality control, and securely delivered to your doorstep within 10 days.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0] tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-base text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70">
            Discover why industry leaders, designers, and discerning gentlemen trust StitchIt for their bespoke wardrobes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col justify-between p-8 rounded-3xl bg-white dark:bg-[#1a2a42] border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 shadow-lg relative group"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-[#C9A84C]/20 group-hover:text-[#C9A84C]/40 transition-colors" />
              <div className="space-y-6 relative z-10">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#C9A84C] text-[#C9A84C]" />
                  ))}
                </div>
                <p className="text-base sm:text-lg text-[#2D2D2D]/80 dark:text-[#F8F5F0]/90 italic leading-relaxed">
                  "{testimonial.comment}"
                </p>
              </div>
              <div className="pt-6 border-t border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 mt-6 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-[#0F1B2D] dark:text-[#F8F5F0] text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 font-medium">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
