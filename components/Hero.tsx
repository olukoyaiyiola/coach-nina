import Image from 'next/image';
import { Check, ArrowDown, MessageCircle } from 'lucide-react';
import { SiteSettings, HeroContent } from '@/lib/types';

interface HeroProps {
  settings: SiteSettings;
  content: HeroContent;
}

export default function Hero({ settings, content }: HeroProps) {
  const formattedLaunchPrice = Number(settings.launch_price || 15000).toLocaleString();
  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(settings.whatsapp_prefilled_text)}`;
  const heroImage = settings.hero_image_url || '/images/coach-nina-laptop.png';

  return (
    <header className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-20 overflow-hidden">
      <div className="hero-orb -left-40 top-10" />
      <div className="hero-orb -right-40 bottom-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Headline, Value Props & CTAs */}
        <div className="lg:col-span-7 text-left space-y-6 sm:space-y-8 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full badge-shimmer border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-wider">
            <span>{content.badge || '✨ A practical skill you can start using immediately'}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-brand-charcoal leading-[1.1] font-display">
            {content.headline || 'Learn To Create Better Videos With AI.'}
            <span className="block font-serif italic font-normal text-gradient-gold mt-2 text-3xl sm:text-4xl md:text-5xl">
              Then Turn the Skill Into Income.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg md:text-xl text-stone-600 font-normal leading-relaxed max-w-2xl">
            {content.subheadline || 'Learn how to create AI-powered videos for businesses, brands, and content projects, even if you are just getting started.'}
          </p>

          {/* Practical Benefit */}
          <p className="text-sm sm:text-base text-stone-500 font-normal leading-relaxed border-l-2 border-brand-gold/60 pl-4 py-1 max-w-xl">
            {content.practical_benefit || 'Understand the tools, practise creating high-quality videos, and learn how to offer AI video creation as a high-demand service.'}
          </p>

          {/* Value Badges */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs sm:text-sm text-stone-600 pt-1">
            {(content.value_badges || [
              'No Experience Required',
              'Hands-On Real-Project Builds',
              'Monetization & Client Playbook',
            ]).map((badge, index) => (
              <span
                key={index}
                className="flex items-center gap-1.5 bg-brand-surface border border-brand-border px-3.5 py-1.5 rounded-full shadow-sm"
              >
                <Check className="w-4 h-4 text-brand-gold stroke-[3]" />
                <span className="font-medium text-brand-charcoal">{badge}</span>
              </span>
            ))}
          </div>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 max-w-lg">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-brand-gold hover:bg-brand-goldHover text-white font-extrabold px-6 py-4 rounded-xl text-sm sm:text-base transition-all transform hover:-translate-y-0.5 shadow-xl shadow-brand-gold/20 flex items-center justify-center space-x-2.5"
            >
              <MessageCircle className="w-5 h-5 fill-white/20" />
              <span>{content.primary_cta || 'Chat on WhatsApp'}</span>
            </a>
            <a
              href="#curriculum"
              className="border border-brand-border hover:border-brand-gold/70 text-brand-charcoal font-semibold px-6 py-4 rounded-xl text-sm sm:text-base transition-all bg-brand-surface/80 text-center flex items-center justify-center gap-2"
            >
              <span>{content.secondary_cta || 'Explore the Starter Class'}</span>
              <ArrowDown className="w-4 h-4 text-brand-gold" />
            </a>
          </div>

          {/* Guarantee / Launch Offer Tag */}
          <div className="flex items-center gap-2 text-xs text-brand-muted pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {content.guarantee_note || `Launch offer: ${settings.currency_symbol}${formattedLaunchPrice} until October 31, 2026`}
            </span>
          </div>
        </div>

        {/* Right Column: High-Res Coach Nina Laptop Portrait with Luxury Frame */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          <div className="relative w-full max-w-[420px] sm:max-w-[460px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-border/80 bg-brand-surface glow-gold group">
            {/* Ambient gold glow ring */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/40 via-transparent to-transparent z-10 pointer-events-none" />

            <Image
              src={heroImage}
              alt="Coach Nina seated at workspace desk with laptop, books, and notebook"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 460px"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            />

            {/* Overlaid Floating Name Badge */}
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-brand-card/90 backdrop-blur-md border border-brand-border/80 rounded-2xl p-3 sm:p-4 shadow-lg flex items-center justify-between">
              <div>
                <p className="font-serif font-bold text-brand-charcoal text-base sm:text-lg leading-tight">
                  Coach Nina
                </p>
                <p className="text-[11px] sm:text-xs text-brand-gold font-semibold uppercase tracking-wider">
                  AI Video Mentor
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest block">Starter Class</span>
                <span className="text-sm font-bold text-brand-charcoal">
                  {settings.currency_symbol}{formattedLaunchPrice}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
