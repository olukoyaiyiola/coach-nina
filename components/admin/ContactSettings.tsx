'use client';

import { useState } from 'react';
import { Save, CheckCircle2, MessageCircle, Mail } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface ContactSettingsProps {
  settings: SiteSettings;
  onSaved: () => void;
}

export default function ContactSettings({ settings, onSaved }: ContactSettingsProps) {
  const [formData, setFormData] = useState({
    whatsapp_number: settings.whatsapp_number || '2349133942845',
    whatsapp_prefilled_text:
      settings.whatsapp_prefilled_text ||
      'My name is [Your Name] and I am interested in learning about AI video creation.',
    whatsapp_cta_label: settings.whatsapp_cta_label || 'Chat with Coach Nina on WhatsApp →',
    instagram_handle: settings.instagram_handle || '_justninna_',
    instagram_url: settings.instagram_url || 'https://instagram.com/_justninna_',
    email_address: settings.email_address || 'nnannannenna2@gmail.com',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update contact settings');

      setMessage('✓ Contact channels and WhatsApp conversion settings updated!');
      onSaved();
    } catch (err: any) {
      setMessage(`Error: ${err?.message || 'Failed to save'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between border-b border-brand-border/60 pb-5 mb-6">
        <div>
          <h2 className="text-xl font-bold text-brand-charcoal font-serif">
            Contact & WhatsApp Conversion Settings
          </h2>
          <p className="text-stone-500 text-xs mt-1">
            Configure destination WhatsApp line, prefilled greeting, CTA button text, and social links.
          </p>
        </div>

        {message && (
          <span className="text-xs px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
            {message}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-brand-charcoal flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Enquiry Configuration</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">
                WhatsApp Phone Number (International format without +)
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                placeholder="2349133942845"
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-brand-charcoal text-xs font-mono"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Destination: wa.me/{formData.whatsapp_number}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">
                Primary CTA Button Label
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp_cta_label}
                onChange={(e) => setFormData({ ...formData, whatsapp_cta_label: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-brand-charcoal text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1">
              Prefilled WhatsApp Message
            </label>
            <textarea
              rows={2}
              required
              value={formData.whatsapp_prefilled_text}
              onChange={(e) =>
                setFormData({ ...formData, whatsapp_prefilled_text: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-brand-charcoal text-xs"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              Visitors will have this pre-written in their WhatsApp chat when they click any CTA button.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-brand-border/60 space-y-4">
          <h3 className="text-sm font-bold text-brand-charcoal flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-gold fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Social & Email Channels</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={formData.instagram_handle}
                onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                placeholder="_justninna_"
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-brand-charcoal text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                placeholder="https://instagram.com/_justninna_"
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-brand-charcoal text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email_address}
                onChange={(e) => setFormData({ ...formData, email_address: e.target.value })}
                placeholder="nnannannenna2@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-brand-charcoal text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-brand-border flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-gold hover:bg-brand-goldHover text-white font-bold py-3 px-6 rounded-xl text-sm transition-all flex items-center space-x-2 shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
