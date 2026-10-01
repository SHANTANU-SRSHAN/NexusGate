import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Layers, 
  Lightbulb, 
  HelpCircle, 
  RotateCcw, 
  BookOpen, 
  Target, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIMessage } from '../../types';

export const AIAssistantDrawer: React.FC = () => {
  const { 
    isAIDrawerOpen, 
    setIsAIDrawerOpen, 
    activeQuestion, 
    activeSubjectFilter, 
    aiInitialPrompt,
    openQuestionSolver,
    userProfile
  } = useApp();

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${userProfile.name.split(' ')[0]}! I'm **Nexus AI**, your specialized GATE mentor.
I am context-aware of the questions, subjects, and topics you view.

How can I accelerate your preparation right now?`,
      timestamp: 'Now',
      suggestedActions: [
        'Explain this question step by step',
        'Give me a hint without spoiler',
        'Explain the core concept',
        'Generate similar practice question',
        'Suggest 4-week study plan'
      ]
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (aiInitialPrompt && isAIDrawerOpen) {
      handleSendMessage(aiInitialPrompt);
    }
  }, [aiInitialPrompt, isAIDrawerOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    setInputValue('');

    const userMsg: AIMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: 'Now'
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            activeQuestion: activeQuestion ? {
              id: activeQuestion.id,
              subject: activeQuestion.subject,
              topic: activeQuestion.topic,
              questionText: activeQuestion.questionText,
              questionType: activeQuestion.questionType,
              marks: activeQuestion.marks,
              options: activeQuestion.options,
              correctAnswer: activeQuestion.correctAnswer,
              explanation: activeQuestion.explanation
            } : undefined,
            activeSubject: activeSubjectFilter || activeQuestion?.subject,
            activeTopic: activeQuestion?.topic,
            userStats: {
              accuracy: userProfile.accuracy,
              weakAreas: userProfile.weakAreas
            }
          }
        })
      });

      const data = await response.json();
      const reply = data.reply || "I've reviewed this GATE problem. Let's break it down methodically.";

      const assistantMsg: AIMessage = {
        id: 'msg_ai_' + Date.now(),
        role: 'assistant',
        content: reply,
        timestamp: 'Now',
        suggestedActions: [
          'Give me a similar practice question',
          'What is the common trap in this topic?',
          'Explain the time complexity'
        ]
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: AIMessage = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        content: `### 💡 Nexus AI Context Analysis
For **${activeQuestion?.id || 'this problem'}** (${activeQuestion?.subject || 'GATE Core'}):
${activeQuestion?.explanation?.conceptTested ? `**Key Concept:** ${activeQuestion.explanation.conceptTested}` : ''}
${activeQuestion?.explanation?.shortcutTrick ? `**Pro Shortcut:** ${activeQuestion.explanation.shortcutTrick}` : ''}
${activeQuestion?.explanation?.commonMistake ? `**Watch out for:** ${activeQuestion.explanation.commonMistake}` : ''}

You can also test your understanding by solving the problem in distraction-free practice mode!`,
        timestamp: 'Now'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Persistent Floating AI Button */}
      {!isAIDrawerOpen && (
        <button
          onClick={() => setIsAIDrawerOpen(true)}
          className="fixed bottom-20 lg:bottom-6 right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#121614] border border-emerald-500/30 text-emerald-400 shadow-lg hover:border-emerald-500/60 hover:bg-emerald-500/10 transition-colors group"
          aria-label="Open Nexus AI"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
            Nexus AI
          </span>
        </button>
      )}

      {/* Slide-out AI Panel Drawer */}
      {isAIDrawerOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#0A0E0C] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-from-right duration-200">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-[#0E1311] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-100">Nexus AI Tutor</h3>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Context-Aware GATE Assistant</p>
              </div>
            </div>

            <button
              onClick={() => setIsAIDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context Awareness Banner */}
          {activeQuestion && (
            <div className="px-4 py-2 bg-[#121715] border-b border-white/10 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 truncate text-slate-400">
                <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Context:</span>
                <span className="font-mono text-emerald-400 font-medium">{activeQuestion.id}</span>
                <span className="truncate">({activeQuestion.subject} · {activeQuestion.topic})</span>
              </div>
              <button 
                onClick={() => openQuestionSolver(activeQuestion)}
                className="text-[10px] text-emerald-400 hover:underline shrink-0 ml-2"
              >
                Solve
              </button>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 rounded-tr-xs'
                    : 'bg-[#121614] border border-white/10 text-slate-200 rounded-tl-xs space-y-2'
                }`}>
                  {/* Clean text formatting */}
                  <div className="whitespace-pre-wrap space-y-1 font-sans">
                    {msg.content}
                  </div>

                  {/* Suggested actions chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(action)}
                          className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-[11px] text-slate-300 hover:text-emerald-300 transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-slate-200 shrink-0 mt-1 text-xs font-semibold">
                    U
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-[#121614] border border-white/10 rounded-2xl rounded-tl-xs p-3 flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-[10px]">Nexus AI is analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Prompts */}
          <div className="px-4 py-2 bg-[#0E1311] border-t border-white/10 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSendMessage("Explain this question step by step")}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 whitespace-nowrap transition-colors"
            >
              Step-by-step
            </button>
            <button
              onClick={() => handleSendMessage("Give me a hint without revealing the answer")}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 whitespace-nowrap transition-colors"
            >
              Get Hint
            </button>
            <button
              onClick={() => handleSendMessage("Generate 2 similar practice questions for this concept")}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 whitespace-nowrap transition-colors"
            >
              Similar Qs
            </button>
            <button
              onClick={() => handleSendMessage("Why is my answer wrong? Explain common misconceptions")}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 whitespace-nowrap transition-colors"
            >
              Mistake Analysis
            </button>
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0A0E0C] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Nexus AI anything about this question or GATE..."
              className="flex-1 bg-[#121614] border border-white/10 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:cursor-not-allowed shrink-0 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
