'use client';

import { useState, useEffect } from 'react';
import { Database, Sparkles, HardDrive, ShieldCheck, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function DiagnosticsPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDiagnostics = async () => {
    try {
      const res = await fetch('/api/admin/diagnostics');
      const diag = await res.json();
      setData(diag);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-brand-border/60 pb-5 mb-6">
          <div>
            <h2 className="text-xl font-bold text-brand-charcoal font-serif">
              System Configuration & Diagnostics
            </h2>
            <p className="text-stone-500 text-xs mt-1">
              Verify database connectivity, Gemini API status, object storage, and persistence health.
            </p>
          </div>

          <button
            onClick={fetchDiagnostics}
            className="p-2 text-stone-500 hover:text-brand-gold border border-brand-border rounded-xl bg-brand-surface text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Diagnostics</span>
          </button>
        </div>

        {loading ? (
          <p className="text-xs text-stone-500">Checking system diagnostics...</p>
        ) : (
          <div className="space-y-6">
            {/* Health Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Database */}
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-charcoal">Database</span>
                  <Database className="w-4 h-4 text-brand-gold" />
                </div>
                <div className="flex items-center gap-2">
                  {data?.mode === 'supabase' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Supabase Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <CheckCircle2 className="w-3 h-3" /> Local Persistent DB
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500">
                  {data?.mode === 'supabase'
                    ? 'Connected to live Supabase Postgres cloud instance.'
                    : 'Running on local file-backed persistent store. Ready to connect to Supabase.'}
                </p>
              </div>

              {/* Gemini AI */}
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-charcoal">Gemini AI Assistant</span>
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex items-center gap-2">
                  {data?.gemini_configured ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> API Key Configured
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <AlertTriangle className="w-3 h-3" /> Key Not Provided
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500">
                  {data?.gemini_configured
                    ? 'Server-side GEMINI_API_KEY verified and active.'
                    : 'Set GEMINI_API_KEY in .env.local to activate conversational editing.'}
                </p>
              </div>

              {/* Security */}
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-charcoal">Security & Auth</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Session Active
                </span>
                <p className="text-[11px] text-stone-500">
                  HttpOnly SameSite cookies, SSRF URL filters, and rate limiting active.
                </p>
              </div>
            </div>

            {/* Counts */}
            {data?.item_counts && (
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-5">
                <h3 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-3">
                  Persistent Storage Inventory
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-brand-border/60">
                    <div className="text-lg font-bold text-brand-charcoal font-serif">
                      {data.item_counts.settings}
                    </div>
                    <div className="text-[10px] text-stone-500">Settings</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-brand-border/60">
                    <div className="text-lg font-bold text-brand-charcoal font-serif">
                      {data.item_counts.content_sections}
                    </div>
                    <div className="text-[10px] text-stone-500">Sections</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-brand-border/60">
                    <div className="text-lg font-bold text-brand-charcoal font-serif">
                      {data.item_counts.showcase}
                    </div>
                    <div className="text-[10px] text-stone-500">TikTok Videos</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-brand-border/60">
                    <div className="text-lg font-bold text-brand-charcoal font-serif">
                      {data.item_counts.faqs}
                    </div>
                    <div className="text-[10px] text-stone-500">FAQs</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-brand-border/60">
                    <div className="text-lg font-bold text-brand-charcoal font-serif">
                      {data.item_counts.media}
                    </div>
                    <div className="text-[10px] text-stone-500">Media Files</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-brand-border/60">
                    <div className="text-lg font-bold text-brand-charcoal font-serif">
                      {data.item_counts.history}
                    </div>
                    <div className="text-[10px] text-stone-500">Audit Logs</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
