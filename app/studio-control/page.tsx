'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  FileText,
  DollarSign,
  Video,
  Image as ImageIcon,
  HelpCircle,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminChatAssistant from '@/components/admin/AdminChatAssistant';
import ContentEditor from '@/components/admin/ContentEditor';
import PricingManager from '@/components/admin/PricingManager';
import ShowcaseManager from '@/components/admin/ShowcaseManager';
import MediaLibrary from '@/components/admin/MediaLibrary';
import FaqManager from '@/components/admin/FaqManager';
import ContactSettings from '@/components/admin/ContactSettings';
import HistoryManager from '@/components/admin/HistoryManager';
import { SiteSettings, FaqItem, ShowcaseItem } from '@/lib/types';

export default function StudioControlPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<
    'assistant' | 'content' | 'pricing' | 'showcase' | 'media' | 'faqs' | 'contact' | 'history' | 'diagnostics'
  >('assistant');

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [content, setContent] = useState<Record<string, any>>({});
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [showcase, setShowcase] = useState<ShowcaseItem[]>([]);
  const [diagnostics, setDiagnostics] = useState<{
    mode: 'supabase' | 'local_persistent';
    gemini_configured: boolean;
  }>({ mode: 'local_persistent', gemini_configured: false });

  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [diagRes, settingsRes, contentRes, faqsRes, showcaseRes] = await Promise.all([
        fetch('/api/admin/diagnostics'),
        fetch('/api/admin/settings'),
        fetch('/api/admin/content'),
        fetch('/api/admin/faqs'),
        fetch('/api/admin/showcase'),
      ]);

      if (diagRes.status === 401 || settingsRes.status === 401) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      setAuthenticated(true);

      const [diagData, settingsData, contentData, faqsData, showcaseData] = await Promise.all([
        diagRes.ok ? diagRes.json() : { database_mode: 'local_persistent', gemini_configured: false },
        settingsRes.ok ? settingsRes.json() : null,
        contentRes.ok ? contentRes.json() : {},
        faqsRes.ok ? faqsRes.json() : [],
        showcaseRes.ok ? showcaseRes.json() : [],
      ]);

      setDiagnostics({
        mode: diagData.database_mode === 'supabase' ? 'supabase' : 'local_persistent',
        gemini_configured: Boolean(diagData.gemini_configured),
      });

      if (settingsData) setSettings(settingsData);
      if (contentData) setContent(contentData);
      if (Array.isArray(faqsData)) setFaqs(faqsData);
      if (Array.isArray(showcaseData)) setShowcase(showcaseData);
    } catch {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      setAuthenticated(false);
    }
  };

  if (authenticated === null || (loading && !settings)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F1]">
        <div className="w-12 h-12 rounded-full border-2 border-brand-gold/30 border-t-brand-gold animate-spin mb-4" />
        <p className="text-stone-500 font-serif text-sm">Loading Coach Nina Studio...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onSuccess={() => { setAuthenticated(true); handleRefresh(); }} />;
  }

  const navTabs = [
    { id: 'assistant', label: 'AI Assistant', icon: Sparkles, badge: diagnostics.gemini_configured ? 'Live' : 'Ready' },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'pricing', label: 'Pricing & Offer', icon: DollarSign },
    { id: 'showcase', label: 'TikTok Showcase', icon: Video },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'contact', label: 'WhatsApp & Links', icon: MessageCircle },
    { id: 'history', label: 'History & Rollback', icon: RotateCcw },
    { id: 'diagnostics', label: 'Diagnostics', icon: ShieldCheck },
  ] as const;

  return (
    <div className="min-h-screen bg-[#FFF8F1] flex flex-col">
      <AdminHeader onLogout={handleLogout} diagnostics={diagnostics} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 flex flex-col">
        {/* Navigation Tabs (Scrollable on Mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar border-b border-brand-border/60">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand-charcoal text-white shadow-xs'
                    : 'bg-brand-card hover:bg-brand-surface text-stone-600 hover:text-brand-charcoal border border-brand-border/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-gold' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {'badge' in tab && tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-brand-gold text-stone-950'
                        : 'bg-brand-surface text-brand-gold border border-brand-gold/30'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="flex-1">
          {activeTab === 'assistant' && (
            <AdminChatAssistant onContentUpdated={handleRefresh} />
          )}

          {activeTab === 'content' && (
            <ContentEditor content={content} onSaved={handleRefresh} />
          )}

          {activeTab === 'pricing' && settings && (
            <PricingManager settings={settings} onSaved={handleRefresh} />
          )}

          {activeTab === 'showcase' && settings && (
            <ShowcaseManager items={showcase} settings={settings} onUpdated={handleRefresh} />
          )}

          {activeTab === 'media' && settings && (
            <MediaLibrary settings={settings} onAssetAssigned={handleRefresh} />
          )}

          {activeTab === 'faqs' && (
            <FaqManager faqs={faqs} onUpdated={handleRefresh} />
          )}

          {activeTab === 'contact' && settings && (
            <ContactSettings settings={settings} onSaved={handleRefresh} />
          )}

          {activeTab === 'history' && (
            <HistoryManager onRolledBack={handleRefresh} />
          )}

          {activeTab === 'diagnostics' && (
            <div className="bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-charcoal">
                  Security & Configuration Diagnostics
                </h2>
                <p className="text-stone-500 text-xs mt-1">
                  Inspect persistence mode, Gemini API connectivity, session security, and environment variables.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">Database Mode</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-brand-charcoal">
                    {diagnostics.mode === 'supabase' ? 'Supabase Postgres (Cloud Persistence)' : 'Zero-Config Persistent Local DB'}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    {diagnostics.mode === 'supabase'
                      ? 'Connected to configured Supabase project. Table changes persist across serverless instances.'
                      : 'Changes persist in local atomic storage. Supply SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to switch to cloud Postgres.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">Gemini AI Assistant</span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        diagnostics.gemini_configured
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {diagnostics.gemini_configured ? 'Configured' : 'Key Pending'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-brand-charcoal">
                    {diagnostics.gemini_configured ? 'Google Gemini 1.5 Flash Connected' : 'Manual Editing Available'}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    {diagnostics.gemini_configured
                      ? 'Server-side key is active. Conversational site changes with schema validation are enabled.'
                      : 'Add GEMINI_API_KEY in server environment variables to enable the natural-language assistant.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">Session Security</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Enforced
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-brand-charcoal">
                    HttpOnly SameSite Cookie + Server-Side JWT Verification
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Protected routes and mutations independently verify authenticated sessions. Rate limiting blocks brute-force login attempts.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">Admin Route Protection</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Hidden & Non-Indexed
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-brand-charcoal">
                    X-Robots-Tag: noindex, nofollow
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Route excluded from sitemap and search engine crawlers. Dynamic custom path supported via ADMIN_PATH env var.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-2">
                  Live Public Site Preview
                </h3>
                <p className="text-xs text-stone-500 mb-3">
                  Open the public homepage to test live changes, WhatsApp links, and countdown timers.
                </p>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-charcoal text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-stone-900 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Open Public Website in New Tab</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
