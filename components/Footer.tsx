import { SiteSettings } from '@/lib/types';
import { Mail, MessageCircle } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(settings.whatsapp_prefilled_text)}`;

  return (
    <footer className="border-t border-brand-border/80 py-14 px-4 sm:px-6 bg-[#1A0E0A] text-brand-cream text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand Wordmark */}
        <div className="flex items-center space-x-3 text-center md:text-left">
          <div className="w-8 h-8 rounded-full border border-brand-gold/60 flex items-center justify-center bg-brand-charcoal text-brand-gold font-serif font-bold text-sm">
            N
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-white block">Coach Nina</span>
            <span className="text-[10px] text-brand-gold uppercase tracking-wider">
              {settings.course_title || 'AI Video Creation Starter Class'}
            </span>
          </div>
        </div>

        {/* Contact Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-stone-300">
          <a
            href={settings.instagram_url || 'https://instagram.com/_justninna_'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-brand-gold transition-colors"
          >
            <svg className="w-4 h-4 text-brand-gold fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Instagram: @{settings.instagram_handle || '_justninna_'}</span>
          </a>

          <a
            href={`mailto:${settings.email_address || 'nnannannenna2@gmail.com'}`}
            className="flex items-center gap-2 hover:text-brand-gold transition-colors"
          >
            <Mail className="w-4 h-4 text-brand-gold" />
            <span>{settings.email_address || 'nnannannenna2@gmail.com'}</span>
          </a>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-brand-gold transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp: +{settings.whatsapp_number}</span>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-stone-400 text-center md:text-right">
          <p>&copy; {currentYear} Coach Nina. All rights reserved.</p>
          <p className="text-[10px] text-stone-500 mt-1">
            Empowering creative minds with generative AI video skills.
          </p>
        </div>
      </div>
    </footer>
  );
}
