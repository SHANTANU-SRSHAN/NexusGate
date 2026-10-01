import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    questions, 
    openQuestionSolver, 
    openQuestionSolution,
    openAIWithPrompt
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  // Semantic & keyword matching
  const filteredQuestions = questions.filter(q => {
    if (selectedSubject !== 'All' && q.subject !== selectedSubject) return false;

    if (!query.trim()) return true;

    const qLower = query.toLowerCase();
    
    // Check direct matches
    const idMatch = q.id.toLowerCase().includes(qLower);
    const textMatch = q.questionText.toLowerCase().includes(qLower);
    const subjectMatch = q.subject.toLowerCase().includes(qLower);
    const topicMatch = q.topic.toLowerCase().includes(qLower);
    const subtopicMatch = q.subtopic?.toLowerCase().includes(qLower);
    const yearMatch = q.year.toString().includes(qLower);
    const tagMatch = q.tags.some(t => t.toLowerCase().includes(qLower));

    // Semantic keyword mappings for GATE
    const semanticKeywords: Record<string, string[]> = {
      'waiting time': ['turnaround', 'scheduling', 'srtf', 'burst', 'quantum', 'fcfs'],
      'deadlock': ['banker', 'safe state', 'allocation', 'resource', 'prevention'],
      'paging': ['virtual memory', 'page table', 'tlb', 'frame', 'offset'],
      'tree': ['avl', 'binary', 'height', 'rotation', 'bst'],
      'eigen': ['matrix', 'determinant', 'characteristic', 'linear algebra'],
      'tcp': ['congestion', 'reno', 'timeout', 'window', 'sliding'],
      'pipeline': ['hazard', 'stall', 'forwarding', 'branch', 'cycles']
    };

    let semanticMatch = false;
    for (const [key, relatedWords] of Object.entries(semanticKeywords)) {
      if (qLower.includes(key)) {
        semanticMatch = relatedWords.some(w => 
          q.topic.toLowerCase().includes(w) || 
          q.questionText.toLowerCase().includes(w) || 
          q.subject.toLowerCase().includes(w)
        );
        if (semanticMatch) break;
      }
    }

    return idMatch || textMatch || subjectMatch || topicMatch || subtopicMatch || yearMatch || tagMatch || semanticMatch;
  });

  const subjects = ['All', ...Array.from(new Set(questions.map(q => q.subject)))];

  const handleSelect = (q: Question) => {
    setIsSearchOpen(false);
    openQuestionSolver(q);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      
      {/* Search Container */}
      <div 
        className="w-full max-w-2xl bg-[#080C0A] border border-[rgba(0,255,136,0.3)] rounded-2xl shadow-[0_0_50px_rgba(0,255,136,0.12)] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[rgba(0,255,136,0.15)] flex items-center gap-3 bg-[#050807]">
          <Search className="w-5 h-5 text-[#00FF88] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, topics, subjects, concepts (e.g. 'deadlock', 'waiting time', 'GATE 2024')..."
            className="w-full bg-transparent text-sm sm:text-base text-[#F5F7F6] placeholder-[#9BA7A1]/60 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded text-[#9BA7A1] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-[#9BA7A1] hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-[#080C0A] border-b border-[rgba(0,255,136,0.1)] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#9BA7A1] text-[11px] flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3 text-[#00FF88]" /> Subject:
          </span>
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
                selectedSubject === s 
                  ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 font-semibold' 
                  : 'bg-white/5 text-[#9BA7A1] hover:text-[#F5F7F6]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredQuestions.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm text-[#9BA7A1]">No exact questions matched "{query}"</p>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  openAIWithPrompt(`Search and explain questions regarding: ${query}`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00FF88]/15 border border-[#00FF88]/30 text-[#00FF88] text-xs font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Nexus AI to retrieve concept questions</span>
              </button>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <div
                key={q.id}
                onClick={() => handleSelect(q)}
                className="p-3 rounded-xl bg-[#050807] border border-[rgba(0,255,136,0.12)] hover:border-[#00FF88]/50 hover:bg-[#00FF88]/5 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2 text-[#9BA7A1]">
                    <span className="font-mono text-[#00FF88] font-bold">{q.id}</span>
                    <span>·</span>
                    <span className="text-[#F5F7F6] font-medium">{q.subject}</span>
                    <span>·</span>
                    <span>{q.topic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#9BA7A1]">
                      {q.questionType} · {q.marks}M
                    </span>
                    <span className={`text-[10px] font-semibold ${
                      q.difficulty === 'Easy' ? 'text-emerald-400' : q.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#F5F7F6] line-clamp-2 leading-relaxed">
                  {q.questionText}
                </p>

                <div className="mt-2 flex items-center justify-between text-[11px] text-[#9BA7A1] pt-1.5 border-t border-white/5">
                  <span className="flex items-center gap-1 text-[10px]">
                    <CheckCircle2 className="w-3 h-3 text-[#00FF88]" /> {q.statistics.correctPercent}% Accuracy
                  </span>
                  <div className="flex items-center gap-1 text-[#00FF88] opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    <span>Solve Question</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-[rgba(0,255,136,0.1)] bg-[#050807] flex items-center justify-between text-[11px] text-[#9BA7A1]">
          <div className="flex items-center gap-3">
            <span>Showing {filteredQuestions.length} PYQ results</span>
          </div>
          <button
            onClick={() => {
              setIsSearchOpen(false);
              openAIWithPrompt(query ? `Explain concept: ${query}` : 'Explain the highest weightage GATE CSE concepts.');
            }}
            className="flex items-center gap-1.5 text-[#00FF88] hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Search via Nexus AI</span>
          </button>
        </div>

      </div>
    </div>
  );
};
