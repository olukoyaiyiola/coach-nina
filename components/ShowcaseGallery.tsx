'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { ExternalLink, Play, Film, AlertCircle } from 'lucide-react';
import { ShowcaseItem, SiteSettings } from '@/lib/types';

interface ShowcaseGalleryProps {
  items: ShowcaseItem[];
  settings: SiteSettings;
}

export default function ShowcaseGallery({ items, settings }: ShowcaseGalleryProps) {
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'commercial' | 'narrative' | 'cinematic'>('all');

  useEffect(() => {
    // If tiktok embed script exists, reload embeds
    if (typeof window !== 'undefined' && (window as any).tiktok && typeof (window as any).tiktok.reload === 'function') {
      (window as any).tiktok.reload();
    }
  }, [items]);

  const filteredItems = items.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'commercial') return item.category.toLowerCase().includes('commerc') || item.category.toLowerCase().includes('e-com');
    if (activeTab === 'narrative') return item.category.toLowerCase().includes('narrat');
    if (activeTab === 'cinematic') return item.category.toLowerCase().includes('cinemat');
    return true;
  });

  return (
    <>
      {/* Official TikTok embed script loaded once */}
      <Script
        src="https://www.tiktok.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          setEmbedLoaded(true);
          if (typeof window !== 'undefined' && (window as any).tiktok?.reload) {
            (window as any).tiktok.reload();
          }
        }}
      />

      <section id="showcase" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-brand-surface border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Film className="w-3.5 h-3.5 text-brand-gold" />
            <span>Verified Production Gallery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-charcoal tracking-tight font-display">
            See What AI Video Can Do
          </h2>
          <p className="text-stone-600 mt-4 text-base sm:text-lg leading-relaxed">
            See examples of what you can create with AI video when you combine the right tools, clear creative direction, and a practical production workflow.
          </p>
          <p className="text-stone-500 mt-2 text-sm leading-relaxed">
            These examples are here to give you a clear picture of what is possible.{' '}
            <a
              href={settings.creator_profile_url || 'https://www.tiktok.com/@noinoi.stories'}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-gold hover:text-brand-goldHover underline underline-offset-4 inline-flex items-center gap-1"
            >
              <span>See more examples on TikTok</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </p>
        </div>

        {/* 3-Column Video Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="bg-brand-surface border border-brand-border rounded-3xl p-4 sm:p-5 flex flex-col justify-between hover:border-brand-gold/50 transition-all glow-gold shadow-sm hover:shadow-md"
            >
              <div>
                {/* Embed Container with Fallback Support */}
                <div className="w-full flex justify-center bg-[#1A0E0A] rounded-2xl overflow-hidden py-3 min-h-[580px] sm:min-h-[620px] relative">
                  {item.embed_type === 'player' ? (
                    <iframe
                      src={`https://www.tiktok.com/player/v1/${item.video_id}?music_info=1&description=1`}
                      title={`${item.title} on TikTok`}
                      className="tiktok-player-frame"
                      loading="lazy"
                      allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full flex justify-center items-center">
                      <blockquote
                        className="tiktok-embed"
                        cite={item.video_url}
                        data-video-id={item.video_id}
                        style={{ maxWidth: '605px', minWidth: '325px' }}
                      >
                        <section>
                          <a target="_blank" href={item.video_url} rel="noreferrer">
                            {item.title}
                          </a>
                        </section>
                      </blockquote>
                    </div>
                  )}

                  {/* Fallback Banner underneath / available */}
                  <div className="absolute top-2 right-2 z-10">
                    <a
                      href={item.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black/70 hover:bg-black/90 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1 transition-colors border border-white/20"
                    >
                      <span>TikTok</span>
                      <ExternalLink className="w-3 h-3 text-brand-gold" />
                    </a>
                  </div>
                </div>

                {/* External link fallback */}
                <div className="mt-3 px-2">
                  <a
                    href={item.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:text-brand-goldHover underline underline-offset-4"
                  >
                    <span>Watch this video on TikTok</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Card Meta & Copy */}
                <div className="mt-4 px-2 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-brand-gold">
                    <span>{item.badge_text}</span>
                    <span className="bg-brand-card px-2 py-0.5 rounded border border-brand-border text-stone-600 font-medium">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-charcoal font-serif">
                    {item.title}
                  </h3>

                  <p className="text-stone-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-brand-border/60 px-2 flex items-center justify-between text-xs text-stone-500">
                <span>What to study: {item.study_focus}</span>
                <span className="text-brand-gold font-semibold">{item.category} Video</span>
              </div>
            </article>
          ))}
        </div>

        {/* Creator Profile Embed & Practical Use Cases Split Section */}
        <div id="use-cases" className="mt-20 pt-16 border-t border-brand-border/70">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: What You Can Create Practical List */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-surface border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-wider">
                <span>One Skill. Many Ways To Use It.</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-brand-charcoal tracking-tight font-serif leading-tight">
                What Could You Create With This Skill?
              </h3>
              <p className="text-stone-600 text-base leading-relaxed">
                You can use AI video to promote a business, grow a content channel, tell compelling stories, create presentations, or offer commercial video creation services to paying clients.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-brand-card border border-brand-border hover:border-brand-gold/40 transition-colors shadow-sm">
                  <span className="text-2xl">🛍️</span>
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-sm">Direct-To-Consumer Product Ads</h4>
                    <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">
                      Produce commercial-grade product showcases for fashion, skincare, gadgets, and services without paying for expensive studio cameras or lighting setups.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-xl bg-brand-card border border-brand-border hover:border-brand-gold/40 transition-colors shadow-sm">
                  <span className="text-2xl">📱</span>
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-sm">Faceless Channels & Viral Storytelling</h4>
                    <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">
                      Build automated TikTok, YouTube Shorts, and Reels accounts around folklore, dramas, and historical epics that monetize organically.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-xl bg-brand-card border border-brand-border hover:border-brand-gold/40 transition-colors shadow-sm">
                  <span className="text-2xl">💼</span>
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-sm">High-Ticket Freelance Services</h4>
                    <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">
                      Package video creation services for local and international brands at ₦100,000 to ₦300,000+ per campaign.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-xl bg-brand-card border border-brand-border hover:border-brand-gold/40 transition-colors shadow-sm">
                  <span className="text-2xl">🎙️</span>
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-sm">AI Avatars & Virtual Presenters</h4>
                    <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">
                      Generate realistic spokespersons delivering scripted keynotes in clean English or localized accents.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Official TikTok Creator Profile Embed */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="w-full max-w-md bg-brand-card p-4 sm:p-6 rounded-3xl border border-brand-border shadow-xl text-center">
                <p className="text-xs uppercase tracking-widest text-brand-gold font-bold mb-4">
                  Official Creator Hub
                </p>

                {/* Creator Profile TikTok Embed */}
                {settings.creator_profile_enabled !== 'false' && (
                  <div className="flex justify-center w-full overflow-hidden rounded-2xl min-h-[580px] bg-[#1A0E0A] p-2">
                    <blockquote
                      className="tiktok-embed"
                      cite={settings.creator_profile_url || 'https://www.tiktok.com/@noinoi.stories'}
                      data-unique-id={settings.creator_unique_id || 'noinoi.stories'}
                      data-embed-type="creator"
                      style={{ maxWidth: '780px', minWidth: '288px', width: '100%' }}
                    >
                      <section>
                        <a
                          target="_blank"
                          href={`${settings.creator_profile_url || 'https://www.tiktok.com/@noinoi.stories'}?refer=creator_embed`}
                          rel="noreferrer"
                        >
                          @{settings.creator_unique_id || 'noinoi.stories'}
                        </a>
                      </section>
                    </blockquote>
                  </div>
                )}

                <div className="mt-4 pt-3 text-center space-y-2">
                  <p className="text-stone-600 text-xs leading-relaxed">
                    Explore more examples, stories, and AI video experiments from Coach Nina's creative library.
                  </p>
                  <a
                    href={settings.creator_profile_url || 'https://www.tiktok.com/@noinoi.stories'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-gold/40 px-5 py-2.5 text-xs font-bold text-brand-gold hover:bg-brand-gold hover:text-white transition-all shadow-sm"
                  >
                    <span>Visit @{settings.creator_unique_id || 'noinoi.stories'} on TikTok</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
