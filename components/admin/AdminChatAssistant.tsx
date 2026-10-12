'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { AdminChatMessage, ProposedChangeSet } from '@/lib/types';

interface AdminChatAssistantProps {
  onContentUpdated: () => void;
}

export default function AdminChatAssistant({ onContentUpdated }: AdminChatAssistantProps) {
  const [messages, setMessages] = useState<AdminChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello Coach Nina! I'm your Gemini AI Website Assistant. I can help you update your website text, launch pricing, hero copy, TikTok showcase videos, FAQs, and WhatsApp settings.\n\nTry telling me: 'Change the launch price to ₦18,000', 'Rewrite the hero headline in simpler language', or 'Add a FAQ about smartphone editing'.",
      created_at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeProposal, setActiveProposal] = useState<{
    messageId: string;
    proposal: ProposedChangeSet;
  } | null>(null);
  const [applying, setApplying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    'Change the launch price to ₦18,000',
    'Rewrite hero headline to be punchier',
    'Add a FAQ about whether students need a laptop',
    'What is the current campaign deadline?',
    'Show me every section that mentions price',
  ];

  const handleSend = async (textToSend?: string) => {
    const msgText = textToSend || input;
    if (!msgText.trim() || loading) return;

    const userMsg: AdminChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: msgText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgText }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to communicate with assistant');
      }

      const assistantMsg: AdminChatMessage = {
        id: data.messageId || `msg_asst_${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        proposed_changes: data.proposal,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (data.proposal) {
        setActiveProposal({
          messageId: assistantMsg.id,
          proposal: data.proposal,
        });
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          content: `Error: ${err?.message || 'Something went wrong. Please check your Gemini API key in configuration diagnostics.'}`,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyChanges = async () => {
    if (!activeProposal) return;
    setApplying(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/apply-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposal: activeProposal.proposal,
          messageId: activeProposal.messageId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply changes');

      setStatusMessage(`✓ ${data.message || 'Changes saved to database successfully!'}`);
      setActiveProposal(null);
      onContentUpdated();

      setMessages((prev) => [
        ...prev,
        {
          id: `msg_applied_${Date.now()}`,
          role: 'assistant',
          content: `✓ I have successfully applied the changes to your website database. The live site is updated!`,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err: any) {
      setStatusMessage(`Error: ${err?.message || 'Failed to apply'}`);
    } finally {
      setApplying(false);
    }
  };

  const handleCancelProposal = () => {
    setActiveProposal(null);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg_cancel_${Date.now()}`,
        role: 'assistant',
        content: 'Proposed changes were cancelled. No database changes were made.',
        created_at: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[550px] max-w-4xl mx-auto bg-brand-card border border-brand-border rounded-3xl overflow-hidden shadow-sm">
      {/* Assistant Header */}
      <div className="px-5 py-3.5 border-b border-brand-border bg-brand-surface flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-brand-charcoal font-serif">
              Gemini AI Studio Assistant
            </h2>
            <p className="text-[11px] text-stone-500">
              Natural language editing with real database persistence
            </p>
          </div>
        </div>

        {statusMessage && (
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-medium">
            {statusMessage}
          </span>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-charcoal text-white rounded-tr-none'
                  : 'bg-brand-surface border border-brand-border text-brand-charcoal rounded-tl-none shadow-2xs'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {/* Display Proposal Diff Box if present in this message */}
              {msg.proposed_changes && (
                <div className="mt-3 pt-3 border-t border-brand-border/60">
                  <div className="bg-white rounded-xl p-3 border border-brand-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-brand-gold uppercase tracking-wider">
                        Proposed Change Set
                      </span>
                      <span className="text-[10px] bg-brand-surface border border-brand-border px-2 py-0.5 rounded text-stone-600">
                        {msg.proposed_changes.affected_sections.join(', ')}
                      </span>
                    </div>

                    <p className="font-semibold text-xs text-brand-charcoal">
                      {msg.proposed_changes.summary}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {msg.proposed_changes.changes.map((ch, idx) => (
                        <div
                          key={idx}
                          className="bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs"
                        >
                          <div className="font-semibold text-stone-700 mb-1">{ch.label}:</div>
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-[11px]">
                            <div className="text-red-700 line-through">
                              Old: {typeof ch.old_value === 'object' ? JSON.stringify(ch.old_value) : String(ch.old_value || 'None')}
                            </div>
                            <ArrowRight className="w-3 h-3 text-stone-400 hidden sm:block self-center" />
                            <div className="text-emerald-700 font-bold">
                              New: {typeof ch.new_value === 'object' ? JSON.stringify(ch.new_value) : String(ch.new_value)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-brand-surface border border-brand-border rounded-2xl rounded-tl-none p-3.5 text-xs text-stone-500 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px]">Gemini is analyzing website content...</span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Floating Active Proposal Action Bar */}
      {activeProposal && (
        <div className="p-3 bg-amber-50 border-t border-amber-200 flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>Pending Proposal: {activeProposal.proposal.summary}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCancelProposal}
              disabled={applying}
              className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyChanges}
              disabled={applying}
              className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {applying ? (
                <span>Applying to Database...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Apply & Publish Live</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-t border-brand-border/40 bg-brand-surface overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0">
          Suggestions:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[11px] whitespace-nowrap bg-brand-card hover:bg-brand-surface border border-brand-border hover:border-brand-gold text-stone-600 hover:text-brand-gold px-3 py-1 rounded-full transition-colors shrink-0 shadow-2xs"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Composer Input Area */}
      <div className="p-3 sm:p-4 border-t border-brand-border bg-brand-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell Gemini what to change on the website..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-brand-border bg-brand-surface text-brand-charcoal text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-brand-gold hover:bg-brand-goldHover text-white p-3 rounded-xl transition-all disabled:opacity-40 shadow-sm"
            aria-label="Send message to assistant"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
