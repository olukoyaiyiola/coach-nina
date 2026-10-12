'use client';

import { MessageCircle } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface StickyMobileCtaProps {
  settings: SiteSettings;
}

export default function StickyMobileCta({ settings }: StickyMobileCtaProps) {
  const formattedLaunchPrice = Number(settings.launch_price || 15000).toLocaleString();
  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(settings.whatsapp_prefilled_text)}`;

  return (
    <div className="sm:hidden fixed bottom-3 left-3 right-3 z-50">
      <div className="bg-brand-card/95 backdrop-blur-md border border-brand-border/80 rounded-2xl p-2.5 shadow-2xl flex items-center justify-between gap-3">
        <div className="pl-2">
          <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
            Launch Price
          </span>
          <span className="text-sm font-extrabold text-brand-charcoal">
            {settings.currency_symbol}{formattedLaunchPrice}
          </span>
        </div>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="wa-button flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
