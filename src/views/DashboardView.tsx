import React from 'react';
import { 
  Flame, 
  Target, 
  CheckCircle2, 
  BarChart3, 
  TrendingUp, 
  Layers, 
  Play, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Award,
  Clock,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBJECT_SUMMARIES } from '../data/mockQuestions';

export const DashboardView: React.FC = () => {
  const { 
    userProfile, 
    setActiveTab, 
    setActiveSubjectFilter, 
    openAIWithPrompt,
    questions,
    openQuestionSolver
  } = useApp();

  // Get current hour for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Heatmap generation
  const today = new Date();
  const weeks: { date: string; count: number; dayOfWeek: number }[][] = [];
  let currentWeek: { date: string; count: number; dayOfWeek: number }[] = [];

  for (let i = 84; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = userProfile.dailyActivity[dateStr] || 0;
    const dayOfWeek = d.getDay();

    currentWeek.push({ date: dateStr, count, dayOfWeek });
    if (dayOfWeek === 6 || i === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-[#080C0A] border-white/5';
    if (count < 3) return 'bg-[#00FF88]/20 border-[#00FF88]/30';
    if (count < 6) return 'bg-[#00FF88]/40 border-[#00FF88]/50';
    if (count < 10) return 'bg-[#00FF88]/70 border-[#00FF88]/80';
    return 'bg-[#00FF88] border-[#00FF88] shadow-[0_0_8px_#00FF88]';
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      {/* 1. Header Greeting & CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(0,255,136,0.12)] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00FF88] uppercase tracking-wider mb-1">
            <span>GATE {userProfile.targetYear} · {userProfile.targetBranch}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F6]">
            {greeting}, {userProfile.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#9BA7A1] mt-1">
            Continue your daily practice. You are on track for a Top 100 AIR rank.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('pyqs')}
            className="px-5 py-2.5 rounded-xl nexus-glow-btn text-xs font-bold flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resume Daily Practice</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        
        {/* Overall Progress */}
        <div className="nexus-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9BA7A1]">
            <span>Overall Progress</span>
            <Target className="w-4 h-4 text-[#00FF88]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#F5F7F6]">
            {userProfile.overallProgress}%
          </div>
          <div className="w-full bg-[#050807] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#00FF88] h-full rounded-full" style={{ width: `${userProfile.overallProgress}%` }} />
          </div>
        </div>

        {/* Questions Solved */}
        <div className="nexus-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9BA7A1]">
            <span>Questions Solved</span>
            <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#F5F7F6]">
            {userProfile.questionsSolved.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#00FF88] font-mono">
            +48 this week
          </div>
        </div>

        {/* Accuracy */}
        <div className="nexus-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9BA7A1]">
            <span>Accuracy Rate</span>
            <BarChart3 className="w-4 h-4 text-[#00FF88]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#F5F7F6]">
            {userProfile.accuracy}%
          </div>
          <div className="text-[11px] text-[#9BA7A1]">
            Target: 85%+
          </div>
        </div>

        {/* Study Streak */}
        <div className="nexus-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9BA7A1]">
            <span>Study Streak</span>
            <Flame className="w-4 h-4 text-[#00FF88] fill-[#00FF88]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#00FF88]">
            {userProfile.studyStreakDays} <span className="text-sm font-sans font-normal text-[#F5F7F6]">Days</span>
          </div>
          <div className="text-[11px] text-[#9BA7A1]">
            Personal best: 21 days
          </div>
        </div>

        {/* PYQs Completed */}
        <div className="nexus-card p-4 rounded-2xl space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-[#9BA7A1]">
            <span>PYQs Mastered</span>
            <Layers className="w-4 h-4 text-[#00FF88]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#F5F7F6]">
            {userProfile.pyqsCompleted} <span className="text-sm text-[#9BA7A1] font-normal">/ {userProfile.totalPyqs}</span>
          </div>
          <div className="text-[11px] text-[#00FF88]">
            {Math.round((userProfile.pyqsCompleted / userProfile.totalPyqs) * 100)}% coverage
          </div>
        </div>

      </div>

      {/* 3. GitHub-style Practice Heatmap */}
      <div className="nexus-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#F5F7F6] flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#00FF88]" />
              <span>Daily Practice Heatmap (Last 90 Days)</span>
            </h2>
            <p className="text-xs text-[#9BA7A1]">Consistency is the secret to a single-digit GATE rank.</p>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-1.5 text-[10px] text-[#9BA7A1]">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-xs bg-[#080C0A] border border-white/10" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#00FF88]/20" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#00FF88]/50" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#00FF88]" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1.5 min-w-[680px]">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day) => (
                  <div
                    key={day.date}
                    className={`w-3.5 h-3.5 rounded-xs border transition-transform hover:scale-125 cursor-pointer ${getHeatmapColor(day.count)}`}
                    title={`${day.date}: ${day.count} question(s) practiced`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Weak Areas vs Strong Areas Diagnostic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Weak Areas Card */}
        <div className="nexus-card rounded-2xl p-5 space-y-4 border-rose-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-rose-400">
              <AlertCircle className="w-4 h-4" />
              <span>Priority Weak Concepts (Target Next)</span>
            </div>
            <button
              onClick={() => openAIWithPrompt(`Generate a targeted study drill for my weak areas: ${userProfile.weakAreas.join(', ')}`)}
              className="text-xs text-[#00FF88] hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI Drill</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {userProfile.weakAreas.map((area, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-rose-950/15 border border-rose-500/20 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-[#F5F7F6]">{area}</h4>
                  <p className="text-[11px] text-[#9BA7A1]">Accuracy: ~54% · Avg Time: 2m 45s</p>
                </div>
                <button
                  onClick={() => {
                    setActiveSubjectFilter(area);
                    setActiveTab('pyqs');
                  }}
                  className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
                >
                  Practice Weak PYQs
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Strong Areas Card */}
        <div className="nexus-card rounded-2xl p-5 space-y-4 border-[#00FF88]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[#00FF88]">
              <Award className="w-4 h-4" />
              <span>Strong High-Scoring Areas</span>
            </div>
            <span className="text-xs text-[#9BA7A1]">82%+ Accuracy</span>
          </div>

          <div className="space-y-2.5">
            {userProfile.strongAreas.map((area, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-emerald-950/20 border border-[#00FF88]/20 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-[#F5F7F6]">{area}</h4>
                  <p className="text-[11px] text-[#00FF88]">Accuracy: 88% · High confidence</p>
                </div>
                <button
                  onClick={() => {
                    setActiveSubjectFilter(area);
                    setActiveTab('pyqs');
                  }}
                  className="px-3 py-1 rounded-lg bg-[#00FF88]/15 hover:bg-[#00FF88]/25 text-[#00FF88] text-xs font-semibold transition-colors"
                >
                  Revise PYQs
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. Recommended Next Questions */}
      <div className="nexus-card rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#F5F7F6]">
              Personalized Recommendations for Today
            </h2>
            <p className="text-xs text-[#9BA7A1]">Curated by Nexus AI based on your recent attempt accuracy.</p>
          </div>
          <button
            onClick={() => setActiveTab('pyqs')}
            className="text-xs text-[#00FF88] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>View All PYQs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {questions.slice(0, 3).map((q) => (
            <div
              key={q.id}
              onClick={() => openQuestionSolver(q)}
              className="p-4 rounded-xl bg-[#050807] border border-[rgba(0,255,136,0.15)] hover:border-[#00FF88]/50 hover:bg-[#00FF88]/5 cursor-pointer transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-[#00FF88] font-bold">{q.id}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#9BA7A1]">
                    {q.marks} Mark{q.marks > 1 ? 's' : ''}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#F5F7F6] line-clamp-1">{q.subject}</h4>
                <p className="text-xs text-[#9BA7A1] mt-1 line-clamp-2 leading-relaxed">
                  {q.questionText}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-[#9BA7A1]">{q.topic}</span>
                <span className="text-[#00FF88] font-semibold group-hover:translate-x-1 transition-transform">
                  Solve →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
