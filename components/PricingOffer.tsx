'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MessageCircle, Check, Clock, AlertCircle, ZoomIn, X, FileText } from 'lucide-react';
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

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const accurateInclusions = [
    'Prerecorded step-by-step video lessons',
    'Practical video walkthroughs (videos, avatars & scenes)',
    'Practice exercises to apply what you learn',
    'Personal assistance from Coach Nina when needed',
    'AI prompts, tool links & learning resources pack',
    'Learn at your own pace on your schedule',
  ];

  return (
    <>
      <section id="offer" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-brand-border bg-brand-card shadow-luxury">
          <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-brand-bronze/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />

          <div className="relative p-6 sm:p-10 md:p-12">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-extrabold uppercase tracking-widest shadow-xs">
                <span>{settings.campaign_headline || 'October Launch Offer'}</span>
                <span className="opacity-50">•</span>
                <span>Limited Slots</span>
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-charcoal mt-4 leading-tight font-display">
                Start Learning AI Video Creation for{' '}
                <span className="text-brand-gold">
                  {settings.currency_symbol}{formattedLaunchPrice}
                </span>
              </h2>
              <p className="text-stone-600 mt-3 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                Regular tuition:{' '}
                <span className="line-through font-semibold text-stone-400">
                  {settings.currency_symbol}{formattedOriginalPrice}
                </span>
                . Lock in your special launch price before this offer expires on{' '}
                <strong className="text-brand-charcoal">October 31, 2026.</strong>
              </p>
            </div>

            {/* Main Content Grid: Flier Integration + Pricing/Countdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Official Promotional Flier */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-[340px] sm:max-w-[380px] lg:max-w-full">
                  <div className="flex items-center justify-between mb-2.5 px-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-charcoal font-serif">
                      <FileText className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Official Course Flier</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-gold hover:text-brand-charcoal transition-colors"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Tap to zoom</span>
                    </button>
                  </div>

                  <div
                    onClick={() => setIsModalOpen(true)}
                    className="group relative aspect-[2/3] w-full rounded-2xl overflow-hidden border-2 border-brand-border/80 bg-brand-surface shadow-xl cursor-pointer hover:border-brand-gold/60 transition-all hover:shadow-2xl"
                  >
                    <Image
                      src="/images/coach-nina-promo-flier.jpg"
                      alt="Official Coach Nina AI Video Creation Mentorship & Starter Class promotional flier detailing curriculum, ₦15,000 launch offer, and WhatsApp contact details"
                      fill
                      sizes="(max-width: 1024px) 100vw, 420px"
                      className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
                      priority
                    />
                    <div className="absolute inset-0 bg-brand-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="bg-brand-charcoal/90 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-xs">
                        <ZoomIn className="w-3.5 h-3.5 text-brand-gold" />
                        <span>View Full Flier</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 text-center mt-2.5">
                    Click or tap image to view full high-resolution flier.
                  </p>
                </div>
              </div>

              {/* Right Column: Countdown, Inclusions & WhatsApp Action */}
              <div className="lg:col-span-7 space-y-6">
                {/* Real Live Countdown Card */}
                <div className="countdown-card rounded-2xl p-5 sm:p-6 border border-brand-charcoal/20 shadow-xl">
                  <div className="flex items-center justify-center gap-2 text-center text-xs uppercase tracking-[.22em] text-brand-cream/80 mb-3.5 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-brand-gold" />
                    <span>{timeLeft.isExpired ? 'Offer Concluded' : 'Launch offer ends in'}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    <div className="rounded-xl bg-white/10 border border-white/10 p-2.5 sm:p-3 text-center">
                      <div className="countdown-number text-2xl sm:text-3xl font-extrabold text-white">
                        {timeLeft.days}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest opacity-70 mt-0.5">
                        Days
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/10 border border-white/10 p-2.5 sm:p-3 text-center">
                      <div className="countdown-number text-2xl sm:text-3xl font-extrabold text-white">
                        {timeLeft.hours}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest opacity-70 mt-0.5">
                        Hours
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/10 border border-white/10 p-2.5 sm:p-3 text-center">
                      <div className="countdown-number text-2xl sm:text-3xl font-extrabold text-white">
                        {timeLeft.minutes}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest opacity-70 mt-0.5">
                        Minutes
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/10 border border-white/10 p-2.5 sm:p-3 text-center">
                      <div className="countdown-number text-2xl sm:text-3xl font-extrabold text-white">
                        {timeLeft.seconds}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest opacity-70 mt-0.5">
                        Seconds
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-xs text-brand-cream/70 mt-3 leading-relaxed">
                    {timeLeft.isExpired ? (
                      <span className="text-amber-200 font-semibold flex items-center justify-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        The launch promotional offer has closed. Please message Coach Nina on WhatsApp to ask about starter class enrollment.
                      </span>
                    ) : (
                      `The ${settings.currency_symbol}${formattedLaunchPrice} launch price is available until the countdown reaches zero.`
                    )}
                  </p>
                </div>

                {/* Inclusions Feature List (Self-Paced / Accurate) */}
                <div className="space-y-2.5 bg-brand-surface/70 border border-brand-border/70 rounded-2xl p-4 sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-charcoal font-serif mb-2">
                    Everything Included in Your Tuition:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-stone-700">
                    {accurateInclusions.map((text, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-brand-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-brand-gold stroke-[3]" />
                        </div>
                        <span className="leading-snug">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary WhatsApp Action */}
                <div className="pt-2 text-center sm:text-left">
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
                  <p className="text-xs text-stone-500 mt-2.5 leading-relaxed">
                    Click the button, replace <strong>[Your Name]</strong> with your name, and message Coach Nina directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Full Flier Viewing */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Coach Nina Promotional Flier"
          className="fixed inset-0 z-50 bg-brand-charcoal/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[92vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-end pb-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors focus:outline-none flex items-center gap-1.5 text-xs font-semibold px-3"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
                <span>Close (Esc)</span>
              </button>
            </div>

            <div className="relative w-full aspect-[2/3] max-h-[82vh] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black">
              <Image
                src="/images/coach-nina-promo-flier.jpg"
                alt="Coach Nina AI Video Creation Starter Class full promotional flier"
                fill
                sizes="(max-width: 768px) 95vw, 680px"
                className="object-contain"
                priority
              />
            </div>

            <div className="pt-3 text-center text-xs text-stone-300">
              <p>Official Coach Nina Mentorship & Starter Class Flier</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

