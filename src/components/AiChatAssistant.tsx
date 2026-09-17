/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, ArrowRight, Loader2, Bot, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AiChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  projectsCount?: number;
  vendorsCount?: number;
}

const CHIP_SUGGESTIONS = [
  "How should the PMO allocate budget for IT Solutions?",
  "Analyze current risks on Telemedicine App project.",
  "Draft a digital procurement contract outline.",
  "Give me training metrics recommendations."
];

export default function AiChatAssistant({ isOpen, onClose, projectsCount = 4, vendorsCount = 4 }: AiChatAssistantProps) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: `Hello ${profile?.displayName || 'User'}! I am the **DINESYS AI Ecosystem Assistant**.\n\nI have complete structural visibility over your PMO portfolio including **${projectsCount} projects**, **${vendorsCount} registered vendors**, and all 4 business pillars (IT, Training, Clinic, Hospitality).\n\nHow can I optimize your business operations today?`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(1) // omit greeting message to avoid cluttering payload
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { 
            role: 'model', 
            text: `⚠️ **Server API Message**: ${data.error || 'Server error occurred during prompt processing.'}` 
          }
        ]);
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: '❌ **Network Connection Error**: Unable to contact the DINESYS full-stack server proxy. Please ensure the dev server is fully running.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="ai-assistant-drawer"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-slate-200/80 shadow-2xl flex flex-col justify-between"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200/60 flex items-center justify-between bg-gradient-to-r from-blue-900 to-[#0B1E36] text-white">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950 animate-pulse">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">DINESYS AI Companion</h3>
            <p className="text-[10px] text-slate-300">Active serverless model: Gemini 2.5</p>
          </div>
        </div>
        <button
          onClick={onClose}
          id="ai-assistant-close-btn"
          className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef} id="ai-assistant-message-list">
        {messages.map((m, i) => {
          const isModel = m.role === 'model';
          return (
            <div key={i} className={`flex gap-2.5 ${isModel ? 'justify-start' : 'justify-end'}`}>
              {isModel && (
                <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 shrink-0 mt-0.5">
                  <Bot size={14} />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs text-left leading-relaxed ${
                  isModel
                    ? 'bg-slate-100/80 text-slate-800 border border-slate-200/30'
                    : 'bg-blue-600 text-white font-medium'
                }`}
              >
                {/* Simplified markdown formatter for cleaner visualization */}
                {m.text.split('\n').map((line, lIdx) => {
                  let formatted = line;
                  // Bold markdown formatter
                  const boldRegex = /\*\*(.*?)\*\*/g;
                  const parts = [];
                  let lastIdx = 0;
                  let match;
                  while ((match = boldRegex.exec(formatted)) !== null) {
                    if (match.index > lastIdx) {
                      parts.push(formatted.substring(lastIdx, match.index));
                    }
                    parts.push(<strong key={match.index} className="font-bold text-slate-900 dark:text-blue-200">{match[1]}</strong>);
                    lastIdx = boldRegex.lastIndex;
                  }
                  if (lastIdx < formatted.length) {
                    parts.push(formatted.substring(lastIdx));
                  }

                  const content = parts.length > 0 ? parts : formatted;

                  if (line.startsWith('* ') || line.startsWith('- ')) {
                    return (
                      <li key={lIdx} className="ml-3 list-disc mt-1 text-[11px]">
                        {line.startsWith('* ') ? (typeof content === 'string' ? line.substring(2) : content) : (typeof content === 'string' ? line.substring(2) : content)}
                      </li>
                    );
                  }
                  if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) {
                    return (
                      <div key={lIdx} className="ml-1 font-medium text-[11px] mt-2 leading-relaxed">
                        {content}
                      </div>
                    );
                  }
                  return (
                    <p key={lIdx} className={line.trim() === '' ? 'h-2' : 'mt-1 text-[11px] leading-relaxed'}>
                      {content}
                    </p>
                  );
                })}
              </div>
              {!isModel && (
                <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 mt-0.5 font-bold text-[10px]">
                  <User size={14} />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-2.5 justify-start">
            <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 shrink-0">
              <Bot size={14} />
            </div>
            <div className="bg-slate-100 rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-slate-500">
              <Loader2 size={12} className="animate-spin text-blue-600" />
              <span>Analyzing business context...</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer input area and suggestions */}
      <div className="p-3 border-t border-slate-200/60 bg-slate-50 space-y-3" id="ai-assistant-footer">
        {/* Chips Suggestions */}
        {messages.length === 1 && (
          <div className="space-y-1.5" id="ai-assistant-suggestions">
            <p className="text-[10px] text-slate-400 text-left font-semibold uppercase tracking-wider">Suggested Actions</p>
            <div className="flex flex-col gap-1.5">
              {CHIP_SUGGESTIONS.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(chip)}
                  id={`ai-suggestion-chip-${i}`}
                  className="w-full text-left bg-white border border-slate-200 hover:border-amber-500/40 hover:bg-amber-50/10 px-2.5 py-1.5 rounded-lg text-[10px] text-slate-600 hover:text-slate-900 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <span className="truncate">{chip}</span>
                  <ArrowRight size={10} className="shrink-0 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2" id="ai-chat-input-wrapper">
          <input
            type="text"
            id="ai-assistant-chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage(inputValue);
            }}
            placeholder="Type your strategic query..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            id="ai-assistant-chat-send-btn"
            disabled={!inputValue.trim() || loading}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl transition-colors cursor-pointer"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
