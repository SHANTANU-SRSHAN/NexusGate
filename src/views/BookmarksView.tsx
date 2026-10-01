import React, { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  Layers, 
  Search, 
  Play, 
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BookmarksView: React.FC = () => {
  const { 
    bookmarks, 
    toggleBookmark, 
    questions, 
    openQuestionSolver, 
    openQuestionSolution,
    setActiveTab 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const bookmarkedQuestions = questions.filter(q => bookmarks.includes(q.id));

  const filtered = bookmarkedQuestions.filter(q => {
    if (selectedSubject !== 'All' && q.subject !== selectedSubject) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      return q.questionText.toLowerCase().includes(term) || 
             q.topic.toLowerCase().includes(term) || 
             q.id.toLowerCase().includes(term);
    }
    return true;
  });

  const subjects = ['All', ...Array.from(new Set(bookmarkedQuestions.map(q => q.subject)))];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(0,255,136,0.12)] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00FF88] uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4 fill-[#00FF88]" />
            <span>Saved Questions for Rapid Revision</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F6]">
            My Bookmarks ({bookmarkedQuestions.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#9BA7A1] mt-1">
            Re-visit tricky questions, high-concept problems, and formulas you saved for final revision.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('pyqs')}
          className="px-4 py-2 rounded-xl nexus-glow-btn text-xs font-bold"
        >
          Explore More PYQs
        </button>
      </div>

      {/* Filter Row */}
      <div className="nexus-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00FF88]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved questions..."
            className="w-full bg-[#050807] border border-[rgba(0,255,136,0.2)] focus:border-[#00FF88] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F5F7F6] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-3 py-1 rounded-lg whitespace-nowrap ${
                selectedSubject === s 
                  ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 font-bold' 
                  : 'bg-white/5 text-[#9BA7A1] hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bookmarked Questions List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="nexus-card rounded-2xl p-12 text-center space-y-3">
            <p className="text-base text-[#9BA7A1]">No bookmarked questions found.</p>
            <button
              onClick={() => setActiveTab('pyqs')}
              className="px-4 py-2 rounded-xl nexus-glow-btn text-xs font-bold"
            >
              Browse PYQ Explorer
            </button>
          </div>
        ) : (
          filtered.map(q => (
            <div
              key={q.id}
              className="nexus-card rounded-2xl p-5 hover:border-[#00FF88]/40 transition-all space-y-3"
            >
              <div className="flex items-center justify-between text-xs border-b border-[rgba(0,255,136,0.1)] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#00FF88] font-bold">{q.id}</span>
                  <span className="text-[#9BA7A1]">·</span>
                  <span className="text-[#F5F7F6] font-semibold">{q.subject}</span>
                  <span className="text-[#9BA7A1]">·</span>
                  <span className="text-[#9BA7A1]">{q.topic}</span>
                </div>
                <button
                  onClick={() => toggleBookmark(q.id)}
                  className="p-1 rounded text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-[#F5F7F6] leading-relaxed line-clamp-2">
                {q.questionText}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <span className="text-[#9BA7A1] font-mono">{q.questionType} · {q.marks}M · {q.difficulty}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openQuestionSolution(q)}
                    className="px-3 py-1.5 rounded-lg bg-[#050807] border border-white/10 hover:border-[#00FF88] text-[#F5F7F6] text-xs font-medium"
                  >
                    View Solution
                  </button>
                  <button
                    onClick={() => openQuestionSolver(q)}
                    className="px-3.5 py-1.5 rounded-lg nexus-glow-btn text-xs font-bold"
                  >
                    Solve Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
