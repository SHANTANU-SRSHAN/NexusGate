import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  Bookmark, 
  CheckCircle2, 
  XCircle, 
  Circle, 
  Play, 
  BookOpen, 
  MessageSquare, 
  Sparkles, 
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown,
  Layers,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Branch, Difficulty, QuestionType, Question } from '../types';

export const PyqExplorerView: React.FC = () => {
  const { 
    questions, 
    userAttempts, 
    bookmarks, 
    toggleBookmark, 
    isBookmarked,
    openQuestionSolver, 
    openQuestionSolution,
    openAIWithPrompt,
    activeSubjectFilter,
    setActiveSubjectFilter
  } = useApp();

  // Filters State
  const [selectedBranch, setSelectedBranch] = useState<string>('CSE/IT');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>(activeSubjectFilter || 'All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [sortBy, setSortBy] = useState<'year-desc' | 'year-asc' | 'difficulty' | 'accuracy'>('year-desc');

  // Keep synced if activeSubjectFilter changes
  React.useEffect(() => {
    if (activeSubjectFilter) {
      setSelectedSubject(activeSubjectFilter);
    }
  }, [activeSubjectFilter]);

  // Extract distinct metadata lists
  const branches: string[] = ['CSE/IT', 'ECE', 'EE', 'ME', 'CE', 'IN', 'DA'];
  const years = ['All', '2026', '2025', '2024', '2023', '2022', '2021', '2020'];
  const subjects = ['All', ...Array.from(new Set(questions.map(q => q.subject)))];

  // Topics belonging to current subject
  const availableTopics = useMemo(() => {
    if (selectedSubject === 'All') {
      return ['All', ...Array.from(new Set(questions.map(q => q.topic)))];
    }
    const filtered = questions.filter(q => q.subject === selectedSubject);
    return ['All', ...Array.from(new Set(filtered.map(q => q.topic)))];
  }, [questions, selectedSubject]);

  // Filtered and Sorted Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (selectedBranch !== 'All' && q.branch !== selectedBranch) return false;
      if (selectedYear !== 'All' && q.year.toString() !== selectedYear) return false;
      if (selectedSubject !== 'All' && q.subject !== selectedSubject) return false;
      if (selectedTopic !== 'All' && q.topic !== selectedTopic) return false;
      if (selectedType !== 'All' && q.questionType !== selectedType) return false;
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;

      // Status Filter
      const attempt = userAttempts[q.id];
      if (selectedStatus === 'Not Attempted' && attempt) return false;
      if (selectedStatus === 'Attempted' && !attempt) return false;
      if (selectedStatus === 'Correct' && (!attempt || !attempt.isCorrect)) return false;
      if (selectedStatus === 'Incorrect' && (!attempt || attempt.isCorrect)) return false;
      if (selectedStatus === 'Bookmarked' && !bookmarks.includes(q.id)) return false;

      // Keyword Search
      if (searchKeyword.trim()) {
        const term = searchKeyword.toLowerCase();
        const matchesText = q.questionText.toLowerCase().includes(term);
        const matchesTopic = q.topic.toLowerCase().includes(term);
        const matchesId = q.id.toLowerCase().includes(term);
        const matchesTag = q.tags.some(t => t.toLowerCase().includes(term));
        if (!matchesText && !matchesTopic && !matchesId && !matchesTag) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'year-desc') return b.year - a.year || b.questionNumber - a.questionNumber;
      if (sortBy === 'year-asc') return a.year - b.year || a.questionNumber - b.questionNumber;
      if (sortBy === 'accuracy') return b.statistics.correctPercent - a.statistics.correctPercent;
      if (sortBy === 'difficulty') {
        const rank = { Easy: 1, Medium: 2, Hard: 3 };
        return rank[b.difficulty] - rank[a.difficulty];
      }
      return 0;
    });
  }, [questions, selectedBranch, selectedYear, selectedSubject, selectedTopic, selectedType, selectedDifficulty, selectedStatus, searchKeyword, sortBy, userAttempts, bookmarks]);

  const resetFilters = () => {
    setSelectedBranch('CSE/IT');
    setSelectedYear('All');
    setSelectedSubject('All');
    setSelectedTopic('All');
    setSelectedType('All');
    setSelectedDifficulty('All');
    setSelectedStatus('All');
    setSearchKeyword('');
    setActiveSubjectFilter(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Centralized Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            All GATE PYQs — One Place
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Filter, practice, analyze, and discuss every official GATE previous year question in one unified interface.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-[#121614] border border-white/10 flex items-center gap-2">
            <span className="text-xs text-slate-400">Showing</span>
            <span className="text-sm font-mono font-semibold text-emerald-400">{filteredQuestions.length}</span>
            <span className="text-xs text-slate-400">of {questions.length} PYQs</span>
          </div>
        </div>
      </div>

      {/* FILTER CONTROL CENTER */}
      <div className="nexus-card rounded-2xl p-4 sm:p-5 space-y-4">
        
        {/* Row 1: Search & Branch */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search by topic, formula, question ID (e.g. 'Banker', 'SRTF', 'AVL')..."
              className="w-full bg-[#121614] border border-white/10 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Branch Selector Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
            {branches.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBranch(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedBranch === b
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'bg-[#121614] text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

        </div>

        {/* Row 2: Secondary Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-white/10 text-xs">
          
          {/* Year */}
          <div>
            <label className="block text-[10px] text-slate-400 mb-1 font-mono uppercase">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-[#121614] border border-white/10 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              {years.map(y => (
                <option key={y} value={y}>{y === 'All' ? 'All Years' : `GATE ${y}`}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[10px] text-slate-400 mb-1 font-mono uppercase">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedTopic('All');
                setActiveSubjectFilter(e.target.value === 'All' ? null : e.target.value);
              }}
              className="w-full bg-[#121614] border border-white/10 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-[10px] text-slate-400 mb-1 font-mono uppercase">Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-[#121614] border border-white/10 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              {availableTopics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-[10px] text-slate-400 mb-1 font-mono uppercase">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#121614] border border-white/10 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="MCQ">MCQ (Multiple Choice)</option>
              <option value="MSQ">MSQ (Multi-Select)</option>
              <option value="NAT">NAT (Numerical)</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-[10px] text-slate-400 mb-1 font-mono uppercase">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-[#121614] border border-white/10 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] text-slate-400 mb-1 font-mono uppercase">My Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#121614] border border-white/10 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Questions</option>
              <option value="Not Attempted">Not Attempted</option>
              <option value="Attempted">Attempted</option>
              <option value="Correct">✓ Correct</option>
              <option value="Incorrect">✕ Incorrect</option>
              <option value="Bookmarked">★ Bookmarked</option>
            </select>
          </div>

        </div>

        {/* Row 3: Sort & Reset */}
        <div className="flex items-center justify-between pt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" /> Sort by:
            </span>
            <button
              onClick={() => setSortBy('year-desc')}
              className={`px-2.5 py-1 rounded text-[11px] ${sortBy === 'year-desc' ? 'text-emerald-400 font-semibold bg-emerald-500/10' : 'text-slate-400 hover:text-white'}`}
            >
              Newest First
            </button>
            <button
              onClick={() => setSortBy('accuracy')}
              className={`px-2.5 py-1 rounded text-[11px] ${sortBy === 'accuracy' ? 'text-emerald-400 font-semibold bg-emerald-500/10' : 'text-slate-400 hover:text-white'}`}
            >
              Highest Accuracy
            </button>
            <button
              onClick={() => setSortBy('difficulty')}
              className={`px-2.5 py-1 rounded text-[11px] ${sortBy === 'difficulty' ? 'text-emerald-400 font-semibold bg-emerald-500/10' : 'text-slate-400 hover:text-white'}`}
            >
              Hardest First
            </button>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        </div>

      </div>

      {/* QUESTION CARDS LIST */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="nexus-card rounded-2xl p-12 text-center space-y-4">
            <p className="text-base text-slate-400">No GATE PYQs matched your filter criteria.</p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-lg nexus-glow-btn text-xs font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const attempt = userAttempts[q.id];
            const bookmarked = isBookmarked(q.id);

            return (
              <div
                key={q.id}
                className="nexus-card rounded-2xl p-5 hover:border-white/20 transition-all duration-150 space-y-4"
              >
                
                {/* Header Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  
                  {/* Left: Exam, Year, Subject, Topic, QNum */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                      GATE {q.branch} {q.year}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-200 font-medium">{q.subject}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">{q.topic}</span>
                    <span className="text-slate-500">·</span>
                    <span className="font-mono text-slate-400">Q{q.questionNumber}</span>
                  </div>

                  {/* Right: Type, Difficulty, Marks, Status */}
                  <div className="flex items-center gap-2 text-xs">
                    
                    {/* User Status */}
                    {attempt ? (
                      attempt.isCorrect ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        <Circle className="w-3 h-3" /> Not Attempted
                      </span>
                    )}

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                      {q.questionType} · {q.marks} Mark{q.marks > 1 ? 's' : ''}
                    </span>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      q.difficulty === 'Easy' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : q.difficulty === 'Medium' 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {q.difficulty}
                    </span>

                  </div>

                </div>

                {/* Question Text */}
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {q.questionText}
                </div>

                {/* Options Preview for MCQ/MSQ */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className="px-3 py-2 rounded-xl bg-black/30 border border-white/5 text-xs text-slate-300 flex items-center gap-2"
                      >
                        <span className="w-5 h-5 rounded bg-white/5 flex items-center justify-center font-mono font-medium text-[10px] text-slate-300 shrink-0">
                          {opt.id}
                        </span>
                        <span className="truncate">{opt.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Community Metrics & Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                  
                  {/* Statistics */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Solved by <strong className="text-slate-200">{q.statistics.attemptedCount.toLocaleString()}</strong> students</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-medium">{q.statistics.correctPercent}% Accuracy</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> {Math.floor(q.statistics.averageTimeSeconds / 60)}m {q.statistics.averageTimeSeconds % 60}s avg
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    
                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(q.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        bookmarked 
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                      title={bookmarked ? "Remove Bookmark" : "Bookmark Question"}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-emerald-400' : ''}`} />
                    </button>

                    {/* Ask Nexus AI Button */}
                    <button
                      onClick={() => openAIWithPrompt(`Explain this question step by step: ${q.id} - ${q.subject}`)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Ask AI</span>
                    </button>

                    {/* View Solution Button */}
                    <button
                      onClick={() => openQuestionSolution(q)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <BookOpen className="w-3 h-3 text-emerald-400" />
                      <span>Solution</span>
                    </button>

                    {/* Attempt / Practice Button */}
                    <button
                      onClick={() => openQuestionSolver(q)}
                      className="px-4 py-1.5 rounded-lg nexus-glow-btn text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{attempt ? 'Re-attempt' : 'Attempt'}</span>
                    </button>

                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
