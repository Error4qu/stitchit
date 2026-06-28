'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ShoppingBag, Menu, X } from 'lucide-react';
import { useTheme } from './theme-provider';
import { useCartStore } from '../store/cart-store';

export function Navbar() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Get cart item count from store
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F8F5F0]/80 dark:bg-[#0F1B2D]/80 backdrop-blur-md shadow-sm border-b border-[#0F1B2D]/5 dark:border-[#F8F5F0]/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F8F5F0] transition-colors">
              Stitch<span className="text-[#C9A84C]">It</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-[#2D2D2D] dark:text-[#F8F5F0] hover:text-[#C9A84C] dark:hover:text-[#C9A84C] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/catalog"
              className="text-sm font-medium text-[#2D2D2D] dark:text-[#F8F5F0] hover:text-[#C9A84C] dark:hover:text-[#C9A84C] transition-colors"
            >
              Fabric Catalog
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-[#2D2D2D] dark:text-[#F8F5F0] hover:bg-[#0F1B2D]/5 dark:hover:bg-[#F8F5F0]/5 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {mounted && isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full text-[#2D2D2D] dark:text-[#F8F5F0] hover:bg-[#0F1B2D]/5 dark:hover:bg-[#F8F5F0]/5 transition-colors cursor-pointer flex items-center"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A84C] text-[11px] font-bold text-[#0F1B2D]"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#2D2D2D] dark:text-[#F8F5F0] hover:bg-[#0F1B2D]/5 dark:hover:bg-[#F8F5F0]/5 transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 bg-[#F8F5F0] dark:bg-[#0F1B2D]"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-[#2D2D2D] dark:text-[#F8F5F0] hover:text-[#C9A84C] transition-colors py-2"
              >
                Home
              </Link>
              <Link
                href="/catalog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-[#2D2D2D] dark:text-[#F8F5F0] hover:text-[#C9A84C] transition-colors py-2"
              >
                Fabric Catalog
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
