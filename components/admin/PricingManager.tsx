'use client';

import { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface PricingManagerProps {
  settings: SiteSettings;
  onSaved: () => void;
}

export default function PricingManager({ settings, onSaved }: PricingManagerProps) {
  const [formData, setFormData] = useState({
    course_title: settings.course_title || 'AI Video Creation Starter Class',
    original_price: settings.original_price || '25000',
    launch_price: settings.launch_price || '15000',
    currency_symbol: settings.currency_symbol || '₦',
    campaign_headline: settings.campaign_headline || 'October Launch Offer',
    campaign_deadline: settings.campaign_deadline || '2026-10-31T23:59:59+01:00',
    campaign_active: settings.campaign_active || 'true',
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

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update pricing');

      setMessage('✓ Pricing and campaign settings saved to database!');
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
            Pricing & Campaign Manager
          </h2>
          <p className="text-stone-500 text-xs mt-1">
            Configure tuition, promotional discounts, countdown deadlines, and campaign status.
          </p>
        </div>

        {message && (
          <span className="text-xs px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
            {message}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
              Course Title
            </label>
            <input
              type="text"
              value={formData.course_title}
              onChange={(e) => setFormData({ ...formData, course_title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-surface text-brand-charcoal text-sm focus:outline-none focus:border-brand-gold"
            />
          </div>

          {/* Launch Price */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
              Launch Discount Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-stone-400 font-bold text-sm">
                {formData.currency_symbol}
              </span>
              <input
                type="number"
                value={formData.launch_price}
                onChange={(e) => setFormData({ ...formData, launch_price: e.target.value })}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-brand-border bg-brand-surface text-brand-charcoal text-sm focus:outline-none focus:border-brand-gold font-bold"
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Displayed as active promotional price.</p>
          </div>

          {/* Original Price */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
              Original Regular Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-stone-400 font-bold text-sm">
                {formData.currency_symbol}
              </span>
              <input
                type="number"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-brand-border bg-brand-surface text-brand-charcoal text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Displayed with a strikethrough.</p>
          </div>

          {/* Campaign Headline */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
              Campaign Tag / Headline
            </label>
            <input
              type="text"
              value={formData.campaign_headline}
              onChange={(e) => setFormData({ ...formData, campaign_headline: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-surface text-brand-charcoal text-sm focus:outline-none focus:border-brand-gold"
            />
          </div>

          {/* Currency Symbol */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
              Currency Symbol
            </label>
            <input
              type="text"
              value={formData.currency_symbol}
              onChange={(e) => setFormData({ ...formData, currency_symbol: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-surface text-brand-charcoal text-sm focus:outline-none focus:border-brand-gold"
            />
          </div>

          {/* Campaign Deadline */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
              Campaign Deadline (ISO / Lagos Time)
            </label>
            <input
              type="text"
              value={formData.campaign_deadline}
              onChange={(e) => setFormData({ ...formData, campaign_deadline: e.target.value })}
              placeholder="2026-10-31T23:59:59+01:00"
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-surface text-brand-charcoal text-sm font-mono focus:outline-none focus:border-brand-gold"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              Controls live countdown. Format: YYYY-MM-DDTHH:MM:SS+01:00
            </p>
          </div>

          {/* Campaign Active Switch */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
              Campaign Active Status
            </label>
            <select
              value={formData.campaign_active}
              onChange={(e) => setFormData({ ...formData, campaign_active: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-surface text-brand-charcoal text-sm focus:outline-none focus:border-brand-gold"
            >
              <option value="true">Active (Countdown running & Offer Live)</option>
              <option value="false">Inactive / Expired (Show expired message)</option>
            </select>
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
