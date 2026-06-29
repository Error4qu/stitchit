'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, User, ChevronDown, LogOut, Scissors } from 'lucide-react';
import { useTheme } from './theme-provider';
import { useAuthStore } from '../store/auth-store';
import { useCurrentUser, useLogout } from '../hooks/use-auth';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/alterations', label: 'Alter My Cloth' },
];

export function Navbar() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  // Hydrate auth state once on mount
  useCurrentUser();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const firstName = user?.name?.split(' ')[0] ?? 'Account';

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
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-[#C9A84C]" />
            <span className="font-serif text-2xl font-bold tracking-tight text-[#0F1B2D] dark:text-[#F8F5F0]">
              Stitch<span className="text-[#C9A84C]">It</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#2D2D2D] dark:text-[#F8F5F0] hover:text-[#C9A84C] dark:hover:text-[#C9A84C] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-[#2D2D2D] dark:text-[#F8F5F0] hover:bg-[#0F1B2D]/5 dark:hover:bg-[#F8F5F0]/5 transition-colors"
              aria-label="Toggle theme"
            >
              {mounted && isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth: User Menu or Login */}
            {mounted && (
              <>
                {user ? (
                  <div className="relative hidden md:block" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen((o) => !o)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#0F1B2D]/20 dark:border-[#F8F5F0]/20 text-sm font-medium text-[#2D2D2D] dark:text-[#F8F5F0] hover:bg-[#0F1B2D]/5 dark:hover:bg-[#F8F5F0]/5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {firstName}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a2a42] rounded-xl shadow-xl border border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 overflow-hidden py-1"
                        >
                          <Link
                            href="/alterations/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#2D2D2D] dark:text-[#F8F5F0] hover:bg-[#C9A84C]/10 transition-colors"
                          >
                            <Scissors className="w-4 h-4" /> My Alterations
                          </Link>
                          <hr className="border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 my-1" />
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              logoutMutation.mutate();
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="hidden md:inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#0F1B2D] dark:bg-[#C9A84C] text-[#F8F5F0] dark:text-[#0F1B2D] text-sm font-medium hover:bg-[#C9A84C] hover:text-[#0F1B2D] transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#2D2D2D] dark:text-[#F8F5F0] hover:bg-[#0F1B2D]/5 dark:hover:bg-[#F8F5F0]/5 transition-colors"
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
            <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-[#2D2D2D] dark:text-[#F8F5F0] hover:text-[#C9A84C] transition-colors py-2.5"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-[#0F1B2D]/10 dark:border-[#F8F5F0]/10 my-1" />
              {user ? (
                <>
                  <Link
                    href="/alterations/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-medium text-[#2D2D2D] dark:text-[#F8F5F0] hover:text-[#C9A84C] transition-colors py-2.5"
                  >
                    My Alterations
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logoutMutation.mutate();
                    }}
                    className="text-left text-base font-medium text-red-500 hover:text-red-600 transition-colors py-2.5"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-[#C9A84C] hover:text-[#C9A84C]/80 transition-colors py-2.5"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
