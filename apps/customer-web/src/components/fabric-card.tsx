'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Fabric } from '../lib/mock-data';
import { Badge } from '@stitchit/ui';

interface FabricCardProps {
  fabric: Fabric;
  index: number;
}

export function FabricCard({ fabric, index }: FabricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/catalog/${fabric.id}`} className="block group">
        <div className="relative overflow-hidden rounded-2xl border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 bg-white dark:bg-[#1a2a42] shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          {/* Swatch Display */}
          <div className="relative h-64 w-full overflow-hidden">
            <motion.div
              className="absolute inset-0 w-full h-full transform transition-transform duration-500 ease-out group-hover:scale-110"
              style={{ backgroundColor: fabric.color }}
            />
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60" />
            
            {/* Type Badge */}
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="gold">{fabric.type}</Badge>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-[2px] bg-[#0F1B2D]/30 transition-opacity duration-300 group-hover:opacity-100">
              <span className="rounded-full bg-[#F8F5F0] px-6 py-2.5 text-sm font-semibold text-[#0F1B2D] shadow-lg transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                View & Customize
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif text-lg font-semibold text-[#0F1B2D] dark:text-[#F8F5F0] group-hover:text-[#C9A84C] dark:group-hover:text-[#C9A84C] transition-colors line-clamp-1">
                {fabric.name}
              </h3>
              <span className="font-sans font-bold text-[#C9A84C] text-lg whitespace-nowrap">
                ${fabric.pricePerMeter}<span className="text-xs font-normal text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60">/m</span>
              </span>
            </div>
            <p className="text-sm text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 line-clamp-2 leading-relaxed">
              {fabric.description}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50 font-medium">
              <span>{fabric.material}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">In Stock</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
