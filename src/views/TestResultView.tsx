import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  RotateCcw,
  Target,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TestResultView: React.FC = () => {
  const { 
    activeTestResult, 
    questions, 
    setActiveQuestion, 
    openQuestionSolution, 
    setActiveTab,
    openAIWithPrompt 
  } = useApp();

  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all');

  if (!activeTestResult) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#F5F7F6]">No recent test result available.</h2>
        <button
          onClick={() => setActiveTab('tests')}
          className="px-4 py-2 rounded-xl nexus-glow-btn text-xs font-bold"
        >
          Take a Mock Test
        </button>
      </div>
    );
  }

  const res = activeTestResult;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header Result Scorecard Banner */}
      <div className="nexus-card rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden border-[#00FF88]/30">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(0,255,136,0.15)] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00FF88] uppercase tracking-wider mb-1">
              <span>Diagnostic Report</span>
              <span>·</span>
              <span>{res.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F6]">
              {res.title}
            </h1>
            <p className="text-xs text-[#9BA7A1] mt-1">
              Completed on {res.completedAt} · Time: {Math.floor(res.timeSpentSeconds / 60)}m {res.timeSpentSeconds % 60}s
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('tests')}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-xs text-[#9BA7A1] hover:text-white"
            >
              Test Series
            </button>
            <button
              onClick={() => setActiveTab('pyqs')}
              className="px-4 py-2 rounded-xl nexus-glow-btn text-xs font-bold"
            >
              Practice More PYQs
            </button>
          </div>
        </div>

        {/* Primary Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Score */}
          <div className="p-4 rounded-2xl bg-[#050807] border border-[rgba(0,255,136,0.2)] space-y-1">
            <span className="text-[11px] text-[#9BA7A1]">Total Score</span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#00FF88]">
              {res.score} <span className="text-sm font-normal text-[#9BA7A1]">/ {res.totalMarks}</span>
            </div>
            <span className="text-[10px] text-[#9BA7A1]">Calculated with negative marking</span>
          </div>

          {/* Accuracy */}
          <div className="p-4 rounded-2xl bg-[#050807] border border-[rgba(0,255,136,0.2)] space-y-1">
            <span className="text-[11px] text-[#9BA7A1]">Accuracy</span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#F5F7F6]">
              {res.accuracy}%
            </div>
            <span className="text-[10px] text-[#00FF88]">{res.correct} Correct out of {res.attempted} Attempted</span>
          </div>

          {/* Percentile Rank */}
          <div className="p-4 rounded-2xl bg-[#050807] border border-[rgba(0,255,136,0.2)] space-y-1">
            <span className="text-[11px] text-[#9BA7A1]">Estimated Percentile</span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#00FF88]">
              {res.percentile}th
            </div>
            <span className="text-[10px] text-[#9BA7A1]">Estimated All-India GATE Rank ~{Math.max(12, Math.round((100 - res.percentile) * 350))}</span>
          </div>

          {/* Attempt Breakdown */}
          <div className="p-4 rounded-2xl bg-[#050807] border border-[rgba(0,255,136,0.2)] space-y-2">
            <span className="text-[11px] text-[#9BA7A1]">Attempt Distribution</span>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#00FF88] font-bold">✓ {res.correct}</span>
              <span>·</span>
              <span className="text-rose-400 font-bold">✕ {res.incorrect}</span>
              <span>·</span>
              <span className="text-[#9BA7A1]">○ {res.unattempted}</span>
            </div>
            <span className="text-[10px] text-[#9BA7A1]">{res.totalQuestions} Total Questions</span>
          </div>

        </div>

      </div>

      {/* 2. DEDICATED "NEXUS AI TEST ANALYSIS" (Section 20) */}
      <div className="rounded-2xl border border-[#00FF88]/30 bg-gradient-to-br from-emerald-950/40 via-[#080C0A] to-[#050807] p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00FF88]/15 border border-[#00FF88]/40 flex items-center justify-center text-[#00FF88]">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#00FF88]">Nexus AI Test Analysis</h3>
              <p className="text-xs text-[#9BA7A1]">Personalized Post-Mortem & Next 15-Question Plan</p>
            </div>
          </div>

          <button
            onClick={() => openAIWithPrompt(`Analyze my test performance: Score ${res.score}/${res.totalMarks}, Accuracy ${res.accuracy}%, Incorrect answers: ${res.incorrect}. What specific chapters should I revise?`)}
            className="px-3.5 py-1.5 rounded-lg bg-[#00FF88]/20 hover:bg-[#00FF88]/30 border border-[#00FF88]/40 text-[#00FF88] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Ask AI Next Steps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#F5F7F6] leading-relaxed font-sans bg-[#050807]/70 p-4 rounded-xl border border-white/5">
          {res.aiAnalysisText}
        </p>

        {/* Recommended questions prescription */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-mono uppercase text-[#00FF88] font-bold">
            Targeted Remedial Questions Recommended by Nexus AI:
          </span>
          <div className="flex flex-wrap gap-2">
            {res.recommendedQuestionIds.map(qId => {
              const recQ = questions.find(q => q.id === qId);
              return (
                <button
                  key={qId}
                  onClick={() => recQ && openQuestionSolution(recQ)}
                  className="px-3 py-1.5 rounded-lg bg-[#050807] border border-[#00FF88]/30 hover:border-[#00FF88] text-xs font-mono text-[#00FF88] transition-colors"
                >
                  {qId} {recQ ? `(${recQ.topic})` : ''} →
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Subject-wise Performance Breakdown */}
      {res.subjectBreakdown.length > 0 && (
        <div className="nexus-card rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#F5F7F6] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#00FF88]" />
            <span>Subject-wise Breakdown</span>
          </h3>

          <div className="space-y-3">
            {res.subjectBreakdown.map((sb, idx) => {
              const pct = sb.total > 0 ? Math.round((sb.correct / sb.total) * 100) : 0;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#F5F7F6]">{sb.subject}</span>
                    <span className="font-mono text-[#00FF88]">{sb.correct} / {sb.total} Correct ({pct}%)</span>
                  </div>
                  <div className="w-full bg-[#050807] h-2 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        pct >= 70 ? 'bg-[#00FF88]' : pct >= 40 ? 'bg-amber-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Question-by-Question Review */}
      <div className="nexus-card rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(0,255,136,0.1)] pb-4">
          <h3 className="text-base font-bold text-[#F5F7F6]">Question Review</h3>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg ${filterMode === 'all' ? 'bg-[#00FF88] text-[#050807] font-bold' : 'text-[#9BA7A1]'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1 rounded-lg ${filterMode === 'correct' ? 'bg-[#00FF88] text-[#050807] font-bold' : 'text-[#9BA7A1]'}`}
            >
              Correct ({res.correct})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1 rounded-lg ${filterMode === 'incorrect' ? 'bg-[#00FF88] text-[#050807] font-bold' : 'text-[#9BA7A1]'}`}
            >
              Incorrect ({res.incorrect})
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {questions.slice(0, res.totalQuestions).map((q, idx) => (
            <div
              key={q.id}
              className="p-4 rounded-xl bg-[#050807] border border-[rgba(0,255,136,0.12)] flex items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-[#00FF88] font-bold">Q{idx + 1} · {q.id}</span>
                  <span className="text-[#9BA7A1]">· {q.subject}</span>
                </div>
                <p className="text-xs text-[#F5F7F6] line-clamp-1">{q.questionText}</p>
              </div>

              <button
                onClick={() => openQuestionSolution(q)}
                className="px-3 py-1.5 rounded-lg bg-[#080C0A] hover:bg-white/5 border border-[rgba(0,255,136,0.25)] text-xs text-[#00FF88] font-semibold shrink-0"
              >
                View Solution
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
