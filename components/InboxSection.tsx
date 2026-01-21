
import React, { useState } from 'react';
import { EmailMessage, EmailDraft, KnowledgeItem, ProcessingState } from '../types';
import { generateEmailResponse } from '../services/geminiService';
import { Send, Sparkles, RefreshCw, AlertCircle, CheckCircle2, User, MailCheck } from 'lucide-react';

interface InboxSectionProps {
  emails: EmailMessage[];
  knowledge: KnowledgeItem[];
}

const InboxSection: React.FC<InboxSectionProps> = ({ emails, knowledge }) => {
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [draft, setDraft] = useState<EmailDraft | null>(null);
  const [tone, setTone] = useState<'professional' | 'friendly' | 'concise'>('professional');
  const [processing, setProcessing] = useState<ProcessingState>({
    isRetrieving: false,
    isDrafting: false,
    error: null
  });

  const handleGenerate = async () => {
    if (!selectedEmail) return;

    setProcessing({ ...processing, isDrafting: true, error: null });
    try {
      const result = await generateEmailResponse(
        { sender: selectedEmail.sender, subject: selectedEmail.subject, body: selectedEmail.body },
        knowledge,
        tone
      );
      setDraft(result);
    } catch (err) {
      setProcessing({ ...processing, isDrafting: false, error: 'Failed to generate draft. Please try again.' });
    } finally {
      setProcessing(p => ({ ...p, isDrafting: false }));
    }
  };

  return (
    <div className="flex h-full">
      {/* Email List */}
      <div className="w-1/3 border-r border-slate-200 bg-white">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Inbox</h2>
          <p className="text-sm text-slate-500">2 Pending replies</p>
        </div>
        <div className="divide-y divide-slate-100">
          {emails.map((email) => (
            <button
              key={email.id}
              onClick={() => { setSelectedEmail(email); setDraft(null); }}
              className={`w-full text-left p-6 hover:bg-slate-50 transition-colors ${
                selectedEmail?.id === email.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800 truncate">{email.sender}</span>
                <span className="text-[10px] text-slate-400 shrink-0">1h ago</span>
              </div>
              <p className="text-sm font-medium text-slate-700 mb-1 truncate">{email.subject}</p>
              <p className="text-xs text-slate-500 line-clamp-2">{email.body}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Draft Workspace */}
      <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
        {selectedEmail ? (
          <div className="flex flex-col h-full">
            {/* Thread Header */}
            <div className="bg-white p-8 border-b border-slate-200 shadow-sm z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedEmail.subject}</h3>
                  <p className="text-sm text-slate-500">From: <span className="font-medium text-blue-600">{selectedEmail.sender}</span></p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-slate-700 text-sm leading-relaxed border border-slate-100">
                {selectedEmail.body}
              </div>
            </div>

            {/* AI Action Bar */}
            <div className="p-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-slate-700">AI Response Suite</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as any)}
                      className="bg-white border border-slate-200 text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="professional">Tone: Professional</option>
                      <option value="friendly">Tone: Friendly</option>
                      <option value="concise">Tone: Concise</option>
                    </select>
                    <button
                      onClick={handleGenerate}
                      disabled={processing.isDrafting}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 shadow-md"
                    >
                      {processing.isDrafting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Generate Draft
                    </button>
                  </div>
                </div>

                <div className="p-8">
                  {processing.isDrafting ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="relative">
                         <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-75"></div>
                         <RefreshCw className="w-12 h-12 text-blue-600 animate-spin relative" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-slate-800">Retrieving Knowledge...</p>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto">Searching your RAG knowledge base for the most relevant facts.</p>
                      </div>
                    </div>
                  ) : draft ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-fit text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        Draft Generated with RAG Context
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                        <input
                          type="text"
                          value={draft.subject}
                          onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Body</label>
                        <textarea
                          value={draft.body}
                          onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-64 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
                      <div className="flex justify-between items-center pt-4">
                        <button
                          onClick={() => setDraft(null)}
                          className="text-slate-500 font-medium hover:text-slate-800 flex items-center gap-2"
                        >
                          Discard Draft
                        </button>
                        <button
                          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black shadow-lg transition-transform active:scale-95"
                        >
                          <Send className="w-4 h-4" />
                          Send Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-2xl">
                      <div className="p-4 bg-slate-100 rounded-full mb-4">
                        <MailCheck className="w-10 h-10 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium text-center max-w-xs">
                        Click "Generate Draft" to use AI to find the right answers from your knowledge base.
                      </p>
                    </div>
                  )}

                  {processing.error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {processing.error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
              <MailCheck className="w-12 h-12 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Select an email to begin</h3>
            <p className="max-w-xs">Pick a message from the inbox to see how AutoReply AI handles context-aware drafting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxSection;
