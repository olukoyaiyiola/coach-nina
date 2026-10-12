'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Check, Clock, AlertCircle } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface PricingOfferProps {
  settings: SiteSettings;
}

export default function PricingOffer({ settings }: PricingOfferProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    isExpired: boolean;
  }>({
    days: '--',
    hours: '--',
    minutes: '--',
    seconds: '--',
    isExpired: false,
  });

  const formattedLaunchPrice = Number(settings.launch_price || 15000).toLocaleString();
  const formattedOriginalPrice = Number(settings.original_price || 25000).toLocaleString();
  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(settings.whatsapp_prefilled_text)}`;

  useEffect(() => {
    function calculateTime() {
      if (settings.campaign_active === 'false') {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00', isExpired: true });
        return;
      }

      const target = new Date(settings.campaign_deadline || '2026-10-31T23:59:59+01:00').getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00', isExpired: true });
        return;
      }

      const pad = (n: number) => String(n).padStart(2, '0');
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: pad(d),
        hours: pad(h),
        minutes: pad(m),
        seconds: pad(s),
        isExpired: false,
      });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.campaign_deadline, settings.campaign_active]);

  return (
    <section id="offer" className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-brand-border bg-brand-card shadow-luxury">
        <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-brand-bronze/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-12 md:p-14">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-extrabold uppercase tracking-widest shadow-xs">
              {settings.campaign_headline || 'October Launch Offer'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-brand-charcoal mt-5 leading-tight font-display">
              Start Learning AI Video Creation for{' '}
              <span className="text-brand-gold">
                {settings.currency_symbol}{formattedLaunchPrice}
              </span>
            </h2>
            <p className="text-stone-600 mt-4 text-sm sm:text-base leading-relaxed">
              Regular price:{' '}
              <span className="line-through font-semibold text-stone-400">
                {settings.currency_symbol}{formattedOriginalPrice}
              </span>
              . Get the special launch tuition before the offer closes on{' '}
              <strong className="text-brand-charcoal">October 31, 2026.</strong>
            </p>
          </div>

          {/* Real Live Countdown Card */}
          <div className="countdown-card rounded-2xl p-5 sm:p-7 mt-8 max-w-2xl mx-auto border border-brand-charcoal/20 shadow-xl">
            <div className="flex items-center justify-center gap-2 text-center text-xs uppercase tracking-[.22em] text-brand-cream/80 mb-4 font-semibold">
              <Clock className="w-3.5 h-3.5 text-brand-gold" />
              <span>{timeLeft.isExpired ? 'Campaign Concluded' : 'Offer ends in'}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              <div className="rounded-xl bg-white/10 border border-white/10 p-3 sm:p-4 text-center">
                <div className="countdown-number text-2xl sm:text-4xl font-extrabold text-white">
                  {timeLeft.days}
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-70 mt-1">
                  Days
                </div>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/10 p-3 sm:p-4 text-center">
                <div className="countdown-number text-2xl sm:text-4xl font-extrabold text-white">
                  {timeLeft.hours}
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-70 mt-1">
                  Hours
                </div>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/10 p-3 sm:p-4 text-center">
                <div className="countdown-number text-2xl sm:text-4xl font-extrabold text-white">
                  {timeLeft.minutes}
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-70 mt-1">
                  Minutes
                </div>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/10 p-3 sm:p-4 text-center">
                <div className="countdown-number text-2xl sm:text-4xl font-extrabold text-white">
                  {timeLeft.seconds}
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-70 mt-1">
                  Seconds
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-brand-cream/70 mt-4 leading-relaxed">
              {timeLeft.isExpired ? (
                <span className="text-amber-200 font-semibold flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  The launch promotional offer has closed. Please message Coach Nina on WhatsApp to ask about upcoming cohort availability.
                </span>
              ) : (
                `The ${settings.currency_symbol}${formattedLaunchPrice} launch price is available until the countdown reaches zero.`
              )}
            </p>
          </div>

          {/* Inclusions Feature List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-8 max-w-3xl mx-auto">
            {[
              'Live online training with Coach Nina',
              'Hands-on practical video creation session',
              'Practice assignment + personalized feedback',
              'Q&A troubleshooting session',
              'AI prompts + tool resource pack',
              'Private creator community access',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-stone-700">
                <div className="w-5 h-5 rounded-full bg-brand-gold/15 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-brand-gold stroke-[3]" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Primary WhatsApp Action */}
          <div className="text-center pt-2">
            <a
              id="whatsappCta"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-button inline-flex w-full sm:w-auto items-center justify-center gap-3 px-8 py-4 sm:py-5 rounded-2xl font-extrabold text-base shadow-xl transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>
                {timeLeft.isExpired
                  ? 'Chat with Coach Nina for Current Tuition →'
                  : settings.whatsapp_cta_label || 'Chat with Coach Nina on WhatsApp →'}
              </span>
            </a>
            <p className="text-xs text-stone-500 mt-3.5">
              Click the button, replace <strong>[Your Name]</strong> with your name, and send the message.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
