'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Check, Search, SlidersHorizontal } from 'lucide-react';
import { Button, Input, Badge } from '@stitchit/ui';
import { MOCK_FABRICS, Fabric } from '../../lib/mock-data';
import { FabricCard } from '../../components/fabric-card';

export default function CatalogPage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'priceAsc' | 'priceDesc'>('name');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  const availableTypes = ['Wool', 'Cashmere', 'Cotton', 'Linen', 'Silk'];
  const availableColors = [
    { name: 'Blue', hex: '#1A3A5F' },
    { name: 'Grey', hex: '#2C3033' },
    { name: 'White', hex: '#F4F6F7' },
    { name: 'Green', hex: '#555E44' },
    { name: 'Red', hex: '#7A1C1C' },
    { name: 'Brown', hex: '#3B2F2F' },
    { name: 'Beige', hex: '#C2B280' },
  ];

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleColorToggle = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedColors([]);
    setMaxPrice(200);
    setSearchQuery('');
  };

  const filteredFabrics = useMemo(() => {
    return MOCK_FABRICS.filter((fabric) => {
      const matchesSearch = fabric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            fabric.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(fabric.type);
      const matchesColor = selectedColors.length === 0 || selectedColors.includes(fabric.colorName);
      const matchesPrice = fabric.pricePerMeter <= maxPrice;
      return matchesSearch && matchesType && matchesColor && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.pricePerMeter - b.pricePerMeter;
      if (sortBy === 'priceDesc') return b.pricePerMeter - a.pricePerMeter;
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedTypes, selectedColors, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4 pb-8 border-b border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">
          Fabric Collection
        </h1>
        <p className="text-base text-[#2D2D2D]/70 dark:text-[#F8F5F0]/70 max-w-3xl">
          Examine our pristine selections of world-class shirting and suiting cloths. Use the filters below to refine by weave, shade, and price point.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="w-full flex items-center justify-center gap-2 py-6 rounded-xl font-semibold text-base"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>{isFilterDrawerOpen ? 'Hide Filters' : 'Show Filters'}</span>
          </Button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full h-12 px-4 rounded-xl border border-[#0F1B2D]/20 dark:border-[#F8F5F0]/20 bg-white dark:bg-[#1a2a42] text-[#2D2D2D] dark:text-[#F8F5F0] font-medium focus:ring-2 focus:ring-[#C9A84C] outline-none"
          >
            <option value="name">Sort by: Name (A-Z)</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>

        {/* Sidebar Filter / Drawer */}
        <div className={`lg:w-80 shrink-0 space-y-8 ${isFilterDrawerOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="p-8 rounded-3xl bg-white dark:bg-[#1a2a42] border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 shadow-lg space-y-8">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-xl text-[#0F1B2D] dark:text-[#F8F5F0]">Filters</span>
              {(selectedTypes.length > 0 || selectedColors.length > 0 || maxPrice < 200 || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-[#C9A84C] hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60">
                Search Catalog
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-[#2D2D2D]/40 dark:text-[#F8F5F0]/40" />
                <Input
                  type="text"
                  placeholder="Search fabric name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-[#F8F5F0] dark:bg-[#0F1B2D] border-none text-sm h-10 rounded-xl"
                />
              </div>
            </div>

            {/* Fabric Type */}
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60">
                Fabric Type
              </label>
              <div className="space-y-2.5">
                {availableTypes.map((type) => {
                  const isSelected = selectedTypes.includes(type);
                  return (
                    <label
                      key={type}
                      className="flex items-center gap-3 text-sm font-medium text-[#2D2D2D] dark:text-[#F8F5F0] cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleTypeToggle(type)}
                        className="w-4 h-4 rounded border-[#0F1B2D]/20 dark:border-[#F8F5F0]/20 text-[#C9A84C] focus:ring-[#C9A84C]"
                      />
                      <span className="group-hover:text-[#C9A84C] transition-colors">{type}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Color Filter */}
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60">
                Color Shade
              </label>
              <div className="flex flex-wrap gap-3">
                {availableColors.map((color) => {
                  const isSelected = selectedColors.includes(color.name);
                  return (
                    <button
                      key={color.name}
                      onClick={() => handleColorToggle(color.name)}
                      className={`w-9 h-9 rounded-full relative flex items-center justify-center border-2 transition-transform hover:scale-110 cursor-pointer ${
                        isSelected ? 'border-[#C9A84C] scale-110 shadow-md' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {isSelected && (
                        <Check className={`w-4 h-4 ${color.name === 'White' ? 'text-[#0F1B2D]' : 'text-white'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60">
                  Max Price / Meter
                </label>
                <span className="font-bold text-[#C9A84C] text-sm">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="40"
                max="200"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-[#F8F5F0] dark:bg-[#0F1B2D] rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
              />
              <div className="flex justify-between text-xs text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50 font-medium">
                <span>$40</span>
                <span>$200</span>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="flex-1 space-y-8">
          {/* Desktop Toolbar */}
          <div className="hidden lg:flex items-center justify-between bg-white dark:bg-[#1a2a42] p-4 rounded-2xl border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 shadow-sm">
            <span className="text-sm font-semibold text-[#2D2D2D]/80 dark:text-[#F8F5F0]/80">
              Showing <span className="text-[#C9A84C] font-bold">{filteredFabrics.length}</span> exquisite fabrics
            </span>

            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]/50 dark:text-[#F8F5F0]/50">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-10 px-4 rounded-xl border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 bg-[#F8F5F0] dark:bg-[#0F1B2D] text-[#2D2D2D] dark:text-[#F8F5F0] text-sm font-medium focus:ring-2 focus:ring-[#C9A84C] outline-none cursor-pointer"
              >
                <option value="name">Name (A-Z)</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filteredFabrics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredFabrics.map((fabric, index) => (
                <FabricCard key={fabric.id} fabric={fabric} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-[#1a2a42] rounded-3xl border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 p-8 space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#0F1B2D] dark:text-[#F8F5F0]">
                No Fabrics Match Your Criteria
              </h3>
              <p className="text-sm text-[#2D2D2D]/60 dark:text-[#F8F5F0]/60 max-w-md mx-auto">
                Try expanding your search parameters or clearing your filter selections to view the complete collection.
              </p>
              <Button variant="primary" onClick={clearFilters} className="rounded-xl px-8 py-4 text-sm font-semibold">
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
