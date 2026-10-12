'use client';

import { ExternalLink, LogOut, Sparkles, Database, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
  diagnostics?: {
    mode: 'supabase' | 'local_persistent';
    gemini_configured: boolean;
  };
}

export default function AdminHeader({ onLogout, diagnostics }: AdminHeaderProps) {
  return (
    <header className="bg-brand-card border-b border-brand-border sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Studio Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-brand-charcoal text-brand-gold flex items-center justify-center font-serif font-bold text-base shadow-sm">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-brand-charcoal text-lg leading-none">
                Coach Nina Studio
              </span>
              <span className="bg-brand-surface border border-brand-border text-brand-gold text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              AI Video Academy Management & Conversational Studio
            </p>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {diagnostics && (
            <div className="hidden md:flex items-center gap-2 text-xs">
              <span
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${
                  diagnostics.mode === 'supabase'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                <Database className="w-3 h-3" />
                <span>{diagnostics.mode === 'supabase' ? 'Supabase Postgres' : 'Local DB'}</span>
              </span>

              <span
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${
                  diagnostics.gemini_configured
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-stone-100 text-stone-600 border-stone-200'
                }`}
              >
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>{diagnostics.gemini_configured ? 'Gemini AI Active' : 'Gemini Key Pending'}</span>
              </span>
            </div>
          )}

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 border border-brand-border hover:border-brand-gold bg-brand-surface text-brand-charcoal hover:text-brand-gold px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-2xs"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onLogout}
            className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
