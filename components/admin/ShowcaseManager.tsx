'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit3, ExternalLink, Video, CheckCircle2, AlertCircle } from 'lucide-react';
import { ShowcaseItem, SiteSettings } from '@/lib/types';

interface ShowcaseManagerProps {
  items: ShowcaseItem[];
  settings: SiteSettings;
  onUpdated: () => void;
}

export default function ShowcaseManager({ items, settings, onUpdated }: ShowcaseManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ShowcaseItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [creatorProfileEnabled, setCreatorProfileEnabled] = useState(
    settings.creator_profile_enabled !== 'false'
  );
  const [creatorProfileUrl, setCreatorProfileUrl] = useState(
    settings.creator_profile_url || 'https://www.tiktok.com/@noinoi.stories'
  );

  const handleOpenNew = () => {
    setEditingItem({
      title: '',
      description: '',
      video_url: '',
      category: 'Commercial',
      badge_text: 'High-Converting',
      study_focus: 'Product storytelling',
      sort_order: items.length + 1,
      is_active: true,
      embed_type: 'player',
    });
    setModalOpen(true);
    setMessage(null);
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/admin/showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save showcase item');

      setMessage('✓ Showcase item saved successfully!');
      setModalOpen(false);
      setEditingItem(null);
      onUpdated();
    } catch (err: any) {
      setError(err?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this showcase video?')) return;

    try {
      const res = await fetch(`/api/admin/showcase?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete item');
      onUpdated();
    } catch (err: any) {
      alert(err?.message || 'Delete failed');
    }
  };

  const handleSaveCreatorSettings = async () => {
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator_profile_enabled: String(creatorProfileEnabled),
          creator_profile_url: creatorProfileUrl,
        }),
      });
      setMessage('✓ Creator Hub settings saved!');
      onUpdated();
    } catch {
      setError('Failed to update creator profile settings');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-5 mb-6">
          <div>
            <h2 className="text-xl font-bold text-brand-charcoal font-serif">
              TikTok Showcase & Embed Manager
            </h2>
            <p className="text-stone-500 text-xs mt-1">
              Manage video examples, extract TikTok IDs, configure player embeds, and control the Creator Hub.
            </p>
          </div>

          <button
            onClick={handleOpenNew}
            className="bg-brand-gold hover:bg-brand-goldHover text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Showcase Video</span>
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Creator Hub Settings */}
        <div className="bg-brand-surface rounded-2xl p-5 border border-brand-border space-y-4">
          <h3 className="text-sm font-bold text-brand-charcoal">
            Official TikTok Creator Hub (@noinoi.stories)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Creator Profile URL
              </label>
              <input
                type="url"
                value={creatorProfileUrl}
                onChange={(e) => setCreatorProfileUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white text-xs text-brand-charcoal"
              />
            </div>
            <div className="flex items-center justify-between sm:justify-start gap-4 pt-4 sm:pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-brand-charcoal">
                <input
                  type="checkbox"
                  checked={creatorProfileEnabled}
                  onChange={(e) => setCreatorProfileEnabled(e.target.checked)}
                  className="rounded border-brand-border text-brand-gold focus:ring-brand-gold"
                />
                <span>Enable Creator Profile Embed</span>
              </label>
              <button
                onClick={handleSaveCreatorSettings}
                className="bg-brand-charcoal text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-stone-900 transition-colors"
              >
                Save Setting
              </button>
            </div>
          </div>
        </div>

        {/* Showcase Videos List */}
        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-bold text-brand-charcoal">Featured Video Cards ({items.length})</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex flex-col justify-between shadow-2xs hover:border-brand-gold/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-brand-gold mb-1">
                    <span>{item.badge_text}</span>
                    <span className="bg-brand-card border border-brand-border px-1.5 py-0.5 rounded text-stone-500">
                      {item.category}
                    </span>
                  </div>

                  <h4 className="font-bold text-brand-charcoal text-base font-serif mb-1">
                    {item.title}
                  </h4>

                  <p className="text-xs text-stone-500 line-clamp-3 mb-3">
                    {item.description}
                  </p>

                  <div className="bg-brand-card border border-brand-border rounded-lg p-2 text-[11px] space-y-1">
                    <div className="text-stone-500">
                      TikTok ID: <span className="font-mono text-stone-800 font-semibold">{item.video_id}</span>
                    </div>
                    <a
                      href={item.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-gold hover:underline flex items-center gap-1"
                    >
                      <span>Open on TikTok</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setModalOpen(true);
                    }}
                    className="text-xs font-semibold text-brand-charcoal hover:text-brand-gold flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs text-red-600 hover:text-red-800 p-1 rounded"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {modalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-brand-charcoal font-serif mb-4">
              {editingItem.id ? 'Edit Showcase Video' : 'Add New Showcase Video'}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-charcoal mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Swim Sexy Launch Spot"
                  className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-surface text-xs text-brand-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-charcoal mb-1">
                  TikTok Video URL (or numeric ID)
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.video_url || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, video_url: e.target.value })}
                  placeholder="https://www.tiktok.com/@noinoi.stories/video/7681170901257227542"
                  className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-surface text-xs text-brand-charcoal font-mono"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Video ID will be automatically verified and extracted.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-charcoal mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-surface text-xs text-brand-charcoal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-charcoal mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="E-Commerce"
                    className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-surface text-xs text-brand-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-charcoal mb-1">
                    Badge Callout
                  </label>
                  <input
                    type="text"
                    value={editingItem.badge_text || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, badge_text: e.target.value })}
                    placeholder="High-Converting"
                    className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-surface text-xs text-brand-charcoal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-charcoal mb-1">
                  Study Focus
                </label>
                <input
                  type="text"
                  value={editingItem.study_focus || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, study_focus: e.target.value })}
                  placeholder="Product storytelling"
                  className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-surface text-xs text-brand-charcoal"
                />
              </div>

              <div className="pt-3 border-t border-brand-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-brand-border text-xs text-stone-600 hover:bg-brand-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-brand-gold hover:bg-brand-goldHover text-white font-bold px-5 py-2 rounded-xl text-xs"
                >
                  {loading ? 'Saving...' : 'Save Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
