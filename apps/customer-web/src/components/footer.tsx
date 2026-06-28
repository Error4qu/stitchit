'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Input } from '@stitchit/ui';

export function Footer() {
  return (
    <footer className="bg-[#0F1B2D] text-[#F8F5F0] border-t border-[#F8F5F0]/10 py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#F8F5F0]">
                Stitch<span className="text-[#C9A84C]">It</span>
              </span>
            </Link>
            <p className="text-sm text-[#F8F5F0]/70 leading-relaxed">
              Premium online cloth tailoring platform. We bring world-class fabrics and master tailors directly to your doorstep.
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#C9A84C]">Shop</h3>
            <ul className="space-y-2.5 text-sm text-[#F8F5F0]/80">
              <li>
                <Link href="/catalog" className="hover:text-[#C9A84C] transition-colors">
                  Fabric Collection
                </Link>
              </li>
              <li>
                <Link href="/catalog?type=Wool" className="hover:text-[#C9A84C] transition-colors">
                  Italian Wool
                </Link>
              </li>
              <li>
                <Link href="/catalog?type=Cashmere" className="hover:text-[#C9A84C] transition-colors">
                  Pure Cashmere
                </Link>
              </li>
              <li>
                <Link href="/catalog?type=Silk" className="hover:text-[#C9A84C] transition-colors">
                  Evening Silk
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#C9A84C]">Company</h3>
            <ul className="space-y-2.5 text-sm text-[#F8F5F0]/80">
              <li>
                <Link href="/" className="hover:text-[#C9A84C] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#C9A84C] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#C9A84C] transition-colors">
                  Bespoke Process
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#C9A84C] transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-4 md:col-span-1">
            <h3 className="font-serif text-lg font-semibold text-[#C9A84C]">Stay Updated</h3>
            <p className="text-sm text-[#F8F5F0]/70">
              Subscribe to our newsletter for exclusive fabric drops and seasonal tailoring guides.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                required
                className="bg-[#1a2a42] border-[#F8F5F0]/20 text-[#F8F5F0] placeholder:text-[#F8F5F0]/40 focus-visible:ring-[#C9A84C]"
              />
              <Button variant="primary" type="submit" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-[#F8F5F0]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F8F5F0]/50">
          <p>© {new Date().getFullYear()} StitchIt. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
