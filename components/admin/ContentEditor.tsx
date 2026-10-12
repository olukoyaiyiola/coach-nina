'use client';

import { useState } from 'react';
import { Save, CheckCircle2, FileText, UserCheck, CheckSquare } from 'lucide-react';

interface ContentEditorProps {
  content: Record<string, any>;
  onSaved: () => void;
}

export default function ContentEditor({ content, onSaved }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState<'hero' | 'overview' | 'about_coach'>('hero');
  const [formData, setFormData] = useState({
    hero: {
      headline: content.hero?.headline || 'Learn To Create Better Videos With AI.',
      subheadline: content.hero?.subheadline || 'Learn how to create AI-powered videos for businesses, brands, and content projects, even if you are just getting started.',
      practical_benefit: content.hero?.practical_benefit || 'Understand the tools, practise creating high-quality videos, and learn how to offer AI video creation as a high-demand service.',
      badge: content.hero?.badge || '✨ A practical skill you can start using immediately',
      primary_cta: content.hero?.primary_cta || 'Chat on WhatsApp',
      secondary_cta: content.hero?.secondary_cta || 'Explore the Starter Class',
      guarantee_note: content.hero?.guarantee_note || '🔒 Launch price ends October 31, 2026 • While available',
    },
    overview: {
      tagline: content.overview?.tagline || 'Real Skills. Plain Language.',
      headline: content.overview?.headline || 'What is AI Video Creation?',
      description: content.overview?.description || 'AI video creation is the craft of turning ideas, scripts, and product concepts into high-engagement videos using cutting-edge generative tools. You do not need cameras, lighting rigs, or years of editing experience.',
      use_cases_summary: content.overview?.use_cases_summary || 'Produce product commercials, promotional brand videos, lifelike AI avatars, cinematic storytelling scenes, voiceovers, auto-captions, and organic social media content.',
    },
    about_coach: {
      tagline: content.about_coach?.tagline || 'Meet Your Instructor',
      name: content.about_coach?.name || 'Coach Nina',
      role: content.about_coach?.role || 'AI Video Educator & Creative Director',
      bio: content.about_coach?.bio || 'Coach Nina helps beginners, entrepreneurs, freelancers, and creative minds master AI-driven storytelling and video production. With hands-on mentorship, she breaks down complex generative workflows into practical, step-by-step techniques anyone can use to build persuasive content and monetizable skills.',
    },
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async (section: 'hero' | 'overview' | 'about_coach') => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          content: formData[section],
        }),
      });

      if (!res.ok) throw new Error('Failed to update content');

      setMessage(`✓ ${section.replace('_', ' ').toUpperCase()} section saved and published!`);
      onSaved();
    } catch (err: any) {
      alert(err?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-5 mb-6">
        <div>
          <h2 className="text-xl font-bold text-brand-charcoal font-serif">
            Website Content & Copy Editor
          </h2>
          <p className="text-stone-500 text-xs mt-1">
            Directly customize editorial copy, headlines, value statements, and Coach Nina bio.
          </p>
        </div>

        {message && (
          <span className="text-xs px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
            {message}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-brand-border pb-3 mb-6">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'hero'
              ? 'bg-brand-gold text-white'
              : 'text-stone-600 hover:bg-brand-surface'
          }`}
        >
          Hero Section
        </button>
        <button
          onClick={() => setActiveTab('about_coach')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'about_coach'
              ? 'bg-brand-gold text-white'
              : 'text-stone-600 hover:bg-brand-surface'
          }`}
        >
          Coach Nina Bio
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'overview'
              ? 'bg-brand-gold text-white'
              : 'text-stone-600 hover:bg-brand-surface'
          }`}
        >
          Course Overview
        </button>
      </div>

      {/* Hero Tab Form */}
      {activeTab === 'hero' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1">
              Top Badge Text
            </label>
            <input
              type="text"
              value={formData.hero.badge}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, badge: e.target.value },
                })
              }
              className="w-full px-3 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1">
              Main Headline
            </label>
            <input
              type="text"
              value={formData.hero.headline}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, headline: e.target.value },
                })
              }
              className="w-full px-3 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-sm font-bold font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1">
              Subheadline Paragraph
            </label>
            <textarea
              rows={3}
              value={formData.hero.subheadline}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, subheadline: e.target.value },
                })
              }
              className="w-full px-3 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1">
              Practical Benefit Statement
            </label>
            <textarea
              rows={2}
              value={formData.hero.practical_benefit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, practical_benefit: e.target.value },
                })
              }
              className="w-full px-3 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-xs leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-brand-border flex justify-end">
            <button
              onClick={() => handleSave('hero')}
              disabled={saving}
              className="bg-brand-gold hover:bg-brand-goldHover text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Hero Copy'}</span>
            </button>
          </div>
        </div>
      )}

      {/* About Coach Tab Form */}
      {activeTab === 'about_coach' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">
                Instructor Name
              </label>
              <input
                type="text"
                value={formData.about_coach.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about_coach: { ...formData.about_coach, name: e.target.value },
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-1">
                Professional Role / Tagline
              </label>
              <input
                type="text"
                value={formData.about_coach.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about_coach: { ...formData.about_coach, role: e.target.value },
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1">
              Coach Nina Introduction & Bio
            </label>
            <textarea
              rows={4}
              value={formData.about_coach.bio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  about_coach: { ...formData.about_coach, bio: e.target.value },
                })
              }
              className="w-full px-3 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-xs leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-brand-border flex justify-end">
            <button
              onClick={() => handleSave('about_coach')}
              disabled={saving}
              className="bg-brand-gold hover:bg-brand-goldHover text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Bio'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Overview Tab Form */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1">
              Overview Headline
            </label>
            <input
              type="text"
              value={formData.overview.headline}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  overview: { ...formData.overview, headline: e.target.value },
                })
              }
              className="w-full px-3 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1">
              Plain Language Explanation
            </label>
            <textarea
              rows={3}
              value={formData.overview.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  overview: { ...formData.overview, description: e.target.value },
                })
              }
              className="w-full px-3 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal mb-1">
              Use Cases Summary
            </label>
            <textarea
              rows={2}
              value={formData.overview.use_cases_summary}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  overview: { ...formData.overview, use_cases_summary: e.target.value },
                })
              }
              className="w-full px-3 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-xs leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-brand-border flex justify-end">
            <button
              onClick={() => handleSave('overview')}
              disabled={saving}
              className="bg-brand-gold hover:bg-brand-goldHover text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Overview'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
