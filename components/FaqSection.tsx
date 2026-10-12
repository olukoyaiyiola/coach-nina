'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FaqItem } from '@/lib/types';

interface FaqSectionProps {
  faqs: FaqItem[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-20 border-t border-brand-border/60">
      <div className="text-center max-w-xl mx-auto mb-14">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-surface border border-brand-gold/30 text-brand-gold text-[11px] font-bold uppercase tracking-wider mb-3 shadow-xs">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Clear Answers</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-charcoal tracking-tight font-display">
          Frequently Asked Questions
        </h2>
        <p className="text-stone-500 mt-2 text-sm">
          Everything you need to know before joining the Starter Class.
        </p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 font-serif font-bold text-brand-charcoal text-base hover:text-brand-gold transition-colors focus:outline-none"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-brand-gold shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-brand-border/30 animate-in fade-in-50 duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
