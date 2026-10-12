'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit3, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { FaqItem } from '@/lib/types';

interface FaqManagerProps {
  faqs: FaqItem[];
  onUpdated: () => void;
}

export default function FaqManager({ faqs, onUpdated }: FaqManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<FaqItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOpenNew = () => {
    setEditingFaq({
      question: '',
      answer: '',
      sort_order: faqs.length + 1,
      is_active: true,
    });
    setModalOpen(true);
    setMessage(null);
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question || !editingFaq.answer) return;

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaq),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save FAQ');

      setMessage('✓ FAQ saved successfully!');
      setModalOpen(false);
      setEditingFaq(null);
      onUpdated();
    } catch (err: any) {
      setError(err?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const res = await fetch(`/api/admin/faqs?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete FAQ');
      onUpdated();
    } catch (err: any) {
      alert(err?.message || 'Delete failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-5 mb-6">
        <div>
          <h2 className="text-xl font-bold text-brand-charcoal font-serif">
            Frequently Asked Questions Manager
          </h2>
          <p className="text-stone-500 text-xs mt-1">
            Add, update, reorder, or delete questions and answers displayed on the public landing page.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="bg-brand-gold hover:bg-brand-goldHover text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className="bg-brand-surface border border-brand-border rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4 hover:border-brand-gold/40 transition-colors shadow-2xs"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">
                Question #{index + 1}
              </span>
              <h4 className="font-bold text-sm text-brand-charcoal font-serif">
                {faq.question}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed pt-1">
                {faq.answer}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  setEditingFaq(faq);
                  setModalOpen(true);
                }}
                className="p-1.5 text-stone-500 hover:text-brand-gold rounded-lg hover:bg-white"
                title="Edit FAQ"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-white"
                title="Delete FAQ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-brand-charcoal font-serif mb-4">
              {editingFaq.id ? 'Edit FAQ' : 'Add New FAQ'}
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
                  Question
                </label>
                <input
                  type="text"
                  required
                  value={editingFaq.question || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="e.g. Do I need previous video editing experience?"
                  className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-surface text-xs text-brand-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-charcoal mb-1">
                  Answer
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq.answer || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  placeholder="Provide clear, concise, reassuring explanation..."
                  className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-surface text-xs text-brand-charcoal leading-relaxed"
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
                  {loading ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
