'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { ChangeHistoryEntry } from '@/lib/types';

interface HistoryManagerProps {
  onRolledBack: () => void;
}

export default function HistoryManager({ onRolledBack }: HistoryManagerProps) {
  const [history, setHistory] = useState<ChangeHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [rollingBackId, setRollingBackId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/admin/history');
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistory(data);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleRollback = async (historyId: string) => {
    if (!confirm('Are you sure you want to rollback to the previous state for this change?')) {
      return;
    }

    setRollingBackId(historyId);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historyId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rollback failed');

      setMessage(`✓ ${data.message || 'Rollback applied successfully!'}`);
      fetchHistory();
      onRolledBack();
    } catch (err: any) {
      alert(err?.message || 'Rollback failed');
    } finally {
      setRollingBackId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between border-b border-brand-border/60 pb-5 mb-6">
        <div>
          <h2 className="text-xl font-bold text-brand-charcoal font-serif">
            Audit History & Rollback Console
          </h2>
          <p className="text-stone-500 text-xs mt-1">
            Review past changes made by administrators or the AI Assistant and restore earlier versions.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="p-2 text-stone-500 hover:text-brand-gold border border-brand-border rounded-xl bg-brand-surface text-xs flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-stone-500">Loading change history...</p>
      ) : history.length === 0 ? (
        <p className="text-xs text-stone-500">No change history records logged yet.</p>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => (
            <div
              key={entry.id}
              className={`p-4 rounded-2xl border transition-colors ${
                entry.rolled_back
                  ? 'bg-stone-50 border-stone-200 opacity-60'
                  : 'bg-brand-surface border-brand-border hover:border-brand-gold/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-brand-card border border-brand-border px-2 py-0.5 rounded text-stone-600 font-mono font-bold uppercase">
                      {entry.section}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      by {entry.author} • {new Date(entry.created_at).toLocaleString()}
                    </span>
                    {entry.rolled_back && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                        Rolled Back
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-xs text-brand-charcoal">
                    {entry.change_description}
                  </p>
                </div>

                {!entry.rolled_back && entry.previous_data && (
                  <button
                    onClick={() => handleRollback(entry.id)}
                    disabled={rollingBackId === entry.id}
                    className="self-start sm:self-center inline-flex items-center gap-1.5 bg-white hover:bg-brand-surface border border-brand-border text-stone-700 hover:text-brand-gold px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{rollingBackId === entry.id ? 'Restoring...' : 'Rollback'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
