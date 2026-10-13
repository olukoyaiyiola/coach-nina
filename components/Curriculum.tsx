import { CheckCircle2, Sparkles } from 'lucide-react';
import { WhatsIncludedContent } from '@/lib/types';

interface CurriculumProps {
  whatsIncluded: WhatsIncludedContent;
}

export default function Curriculum({ whatsIncluded }: CurriculumProps) {
  const modules = [
    {
      num: 'MODULE 01',
      title: 'Prompt-Writing & Visual Direction',
      desc: 'The art of prompt engineering for camera angles, cinematic lighting, color palettes, and emotional expression without endless trial and error.',
      badge: '✨ Custom Prompt Formula Included',
    },
    {
      num: 'MODULE 02',
      title: 'Choosing & Using AI Video Tools',
      desc: 'Cut through the noise. Direct hands-on access to the exact free and high-utility tools used for image generation, scene animation, and upscaling.',
      badge: '📱 Smartphone + PC Compatible Stack',
    },
    {
      num: 'MODULE 03',
      title: 'AI Avatars & Generated Scenes',
      desc: 'Generate authentic characters that maintain their distinct identity, clothing, and facial features across cuts without glitches or weird distortions.',
      badge: '👤 Realistic Character Consistency',
    },
    {
      num: 'MODULE 04',
      title: 'Voiceovers, Audio & Auto-Captions',
      desc: 'Master studio-quality voice synthesis, Nigerian and regional accents, background music placement, and high-retention stylized captions.',
      badge: '🎙️ Emotional Modulation & Accents',
    },
    {
      num: 'MODULE 05',
      title: 'Basic & Fast Video Editing',
      desc: 'Learn simple, rapid editing workflows on your phone or computer to trim, transition, color-match, and polish scenes within minutes.',
      badge: '✂️ Beginner Video Editing Framework',
    },
    {
      num: 'MODULE 06',
      title: 'Pricing, Clients & Delivering Projects',
      desc: 'How to pitch business owners, price deliverables cleanly, package ongoing retainers, and deliver watermark-free client projects professionally.',
      badge: '💼 Client Outreach Scripts & Templates',
    },
  ];

  return (
    <section id="curriculum" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24 border-t border-brand-border/60">
      {/* Syllabus Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-brand-surface border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          <span>Starter Class Syllabus</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-charcoal tracking-tight font-display">
          What You'll Learn
        </h2>
        <p className="text-stone-600 mt-4 text-base sm:text-lg">
          A beginner-friendly path from your very first prompt to a finished, usable AI video.
        </p>
      </div>

      {/* 6 Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m, idx) => (
          <div
            key={idx}
            className="bg-brand-card p-6 sm:p-7 rounded-2xl border border-brand-border flex flex-col justify-between hover:border-brand-gold/50 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md"
          >
            <div>
              <span className="text-brand-gold font-mono font-bold text-xs tracking-wider">
                {m.num}
              </span>
              <h3 className="text-lg font-bold text-brand-charcoal mt-1.5 mb-2.5 font-serif">
                {m.title}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                {m.desc}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-brand-border/40 text-[11px] text-brand-gold font-semibold">
              {m.badge}
            </div>
          </div>
        ))}
      </div>

      {/* What's Included Block */}
      <div className="mt-16 bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs uppercase tracking-widest text-brand-gold font-bold mb-1">
            Complete Experience
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-brand-charcoal font-serif">
            {whatsIncluded.title || "What's Included in the Class"}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {(whatsIncluded?.items?.length ? whatsIncluded.items : [
            {
              title: 'Prerecorded Video Lessons',
              desc: 'Learn through clear, step-by-step lessons you can watch at your own pace.'
            },
            {
              title: 'Practical Video Walkthroughs',
              desc: 'Follow demonstrations of creating AI-generated videos, avatars, and scenes.'
            },
            {
              title: 'Practice Exercises',
              desc: 'Apply what you learn as you work through the lessons.'
            },
            {
              title: 'Personal Assistance',
              desc: 'Get help from Coach Nina when you need clarification or encounter difficulties.'
            },
            {
              title: 'AI Prompts & Resources',
              desc: 'Access useful prompt formulas, tool links, and learning resources included with the class.'
            },
            {
              title: 'Learn At Your Own Pace',
              desc: 'Work through the lessons at a pace that suits your schedule.'
            }
          ]).map((item, index) => (
            <div
              key={index}
              className="flex items-start space-x-3.5 bg-brand-card p-4 rounded-xl border border-brand-border shadow-xs hover:border-brand-gold/40 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-brand-charcoal text-sm font-serif">
                  {item.title}
                </h4>
                <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
