'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, MessageCircle } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface NavbarProps {
  settings: SiteSettings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const formattedLaunchPrice = Number(settings.launch_price || 15000).toLocaleString();
  const formattedOriginalPrice = Number(settings.original_price || 25000).toLocaleString();
  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(settings.whatsapp_prefilled_text)}`;

  return (
    <>
      {/* Sticky Offer Announcement Banner */}
      {settings.campaign_active !== 'false' && (
        <aside
          aria-label="Exclusive launch offer"
          className="bg-brand-charcoal text-brand-cream py-2.5 px-4 text-center sticky top-0 z-50 shadow-sm border-b border-brand-border/40"
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm">
            <span className="font-extrabold tracking-wider text-brand-gold uppercase text-[11px] sm:text-xs">
              {settings.campaign_headline || 'OCTOBER LAUNCH OFFER'}
            </span>
            <span className="opacity-40">•</span>
            <span>
              Join the {settings.course_title} for{' '}
              <strong className="text-white font-bold">{settings.currency_symbol}{formattedLaunchPrice}</strong>{' '}
              instead of {settings.currency_symbol}{formattedOriginalPrice}.
            </span>
            <a
              href="#offer"
              className="underline font-bold text-brand-gold hover:text-white transition-colors ml-1"
            >
              See offer &rarr;
            </a>
          </div>
        </aside>
      )}

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between border-b border-brand-border/60 bg-brand-cream/80 backdrop-blur-md sticky top-[41px] z-40">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-full border border-brand-gold/60 flex items-center justify-center bg-brand-card shadow-sm group-hover:border-brand-gold transition-colors">
            <span className="font-serif italic text-brand-gold text-xl font-bold">N</span>
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-charcoal block leading-none">
              Coach Nina
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-brand-gold font-semibold mt-0.5">
              AI Video Mentorship
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-brand-muted">
          <a href="#showcase" className="hover:text-brand-gold transition-colors">
            See What You Can Create
          </a>
          <a href="#curriculum" className="hover:text-brand-gold transition-colors">
            What You'll Learn
          </a>
          <a href="#use-cases" className="hover:text-brand-gold transition-colors">
            What You Can Do
          </a>
          <a href="#faq" className="hover:text-brand-gold transition-colors">
            Questions
          </a>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center space-x-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 border border-brand-border hover:border-brand-gold text-brand-charcoal hover:text-brand-gold px-4 py-2 rounded-full text-xs font-semibold transition-all bg-brand-surface/80"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
            <span>WhatsApp</span>
          </a>
          <a
            href="#offer"
            className="bg-brand-gold hover:bg-brand-goldHover text-white font-bold px-5 py-2 rounded-full text-xs transition-all shadow-sm hover:shadow"
          >
            Enroll Now
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center space-x-2 sm:hidden">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-emerald-600 border border-brand-border rounded-full"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-brand-charcoal hover:text-brand-gold rounded-lg border border-brand-border focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-brand-surface border-b border-brand-border px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3 text-sm font-semibold text-brand-charcoal">
            <a
              href="#showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-brand-gold"
            >
              See What You Can Create
            </a>
            <a
              href="#curriculum"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-brand-gold"
            >
              What You'll Learn
            </a>
            <a
              href="#use-cases"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-brand-gold"
            >
              What You Can Do
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-brand-gold"
            >
              Questions
            </a>
          </div>
          <div className="pt-4 border-t border-brand-border/60 flex flex-col gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href="#offer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-brand-gold text-white font-bold py-3 rounded-xl text-sm"
            >
              Enroll Now ({settings.currency_symbol}{formattedLaunchPrice})
            </a>
          </div>
        </div>
      )}
    </>
  );
}
