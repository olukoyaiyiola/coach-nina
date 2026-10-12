import Image from 'next/image';
import { AboutCoachContent, SiteSettings } from '@/lib/types';
import { Sparkles, MessageCircle } from 'lucide-react';

interface CoachBioProps {
  content: AboutCoachContent;
  settings: SiteSettings;
}

export default function CoachBio({ content, settings }: CoachBioProps) {
  const bioImage = settings.bio_image_url || '/images/coach-nina-laptop.png';
  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(settings.whatsapp_prefilled_text)}`;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-brand-border/60">
      <div className="bg-brand-surface rounded-3xl border border-brand-border p-6 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Portrait Column */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-64 sm:w-72 aspect-[4/5] rounded-2xl overflow-hidden border-2 border-brand-border shadow-xl glow-gold bg-brand-card">
              <Image
                src={bioImage}
                alt="Coach Nina - AI Video Educator"
                fill
                sizes="(max-width: 768px) 280px, 320px"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Bio Copy Column */}
          <div className="md:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-card border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>{content.tagline || 'Meet Your Instructor'}</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-brand-charcoal font-serif">
              {content.name || 'Coach Nina'}
            </h3>

            <p className="text-sm font-semibold text-brand-gold uppercase tracking-widest">
              {content.role || 'AI Video Educator & Creative Director'}
            </p>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {content.bio ||
                'Coach Nina helps beginners, entrepreneurs, freelancers, and creative minds master AI-driven storytelling and video production. With hands-on mentorship, she breaks down complex generative workflows into practical, step-by-step techniques anyone can use to build persuasive content and monetizable skills.'}
            </p>

            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-brand-border hover:border-brand-gold text-brand-charcoal hover:text-brand-gold bg-brand-card px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Ask Coach Nina a question on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
