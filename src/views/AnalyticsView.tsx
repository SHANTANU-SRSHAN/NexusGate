import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Flame, 
  Award, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Clock 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBJECT_SUMMARIES } from '../data/mockQuestions';

export const AnalyticsView: React.FC = () => {
  const { userProfile, questions } = useApp();

  const difficultyStats = [
    { name: 'Easy', solved: 480, total: 550, accuracy: 89, color: 'bg-emerald-400' },
    { name: 'Medium', solved: 540, total: 720, accuracy: 76, color: 'bg-amber-400' },
    { name: 'Hard', solved: 228, total: 380, accuracy: 52, color: 'bg-rose-400' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[rgba(0,255,136,0.12)] pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00FF88] uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Performance Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F6]">
          Preparation Analytics & Trends
        </h1>
        <p className="text-xs sm:text-sm text-[#9BA7A1] mt-1">
          In-depth diagnostics across all GATE subjects, accuracy curves, and difficulty tiers.
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="nexus-card p-5 rounded-2xl space-y-1">
          <span className="text-xs text-[#9BA7A1]">Overall Accuracy</span>
          <div className="text-3xl font-black font-mono text-[#00FF88]">{userProfile.accuracy}%</div>
          <span className="text-[11px] text-[#9BA7A1]">Top 3% among GATE aspirants</span>
        </div>

        <div className="nexus-card p-5 rounded-2xl space-y-1">
          <span className="text-xs text-[#9BA7A1]">Average Time / Question</span>
          <div className="text-3xl font-black font-mono text-[#F5F7F6]">1m 52s</div>
          <span className="text-[11px] text-[#00FF88]">Target: &lt; 2m 45s</span>
        </div>

        <div className="nexus-card p-5 rounded-2xl space-y-1">
          <span className="text-xs text-[#9BA7A1]">Current Streak</span>
          <div className="text-3xl font-black font-mono text-[#00FF88]">{userProfile.studyStreakDays} Days</div>
          <span className="text-[11px] text-[#9BA7A1]">Active multiplier: 2.5x</span>
        </div>

        <div className="nexus-card p-5 rounded-2xl space-y-1">
          <span className="text-xs text-[#9BA7A1]">PYQs Completed</span>
          <div className="text-3xl font-black font-mono text-[#F5F7F6]">{userProfile.pyqsCompleted} / {userProfile.totalPyqs}</div>
          <span className="text-[11px] text-[#00FF88]">36% of all 2000-2025 PYQs</span>
        </div>
      </div>

      {/* Subject-Wise Performance Charts */}
      <div className="nexus-card rounded-2xl p-6 space-y-6">
        <h3 className="text-base font-bold text-[#F5F7F6] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#00FF88]" />
          <span>Subject-Wise Accuracy & Completion</span>
        </h3>

        <div className="space-y-4">
          {SUBJECT_SUMMARIES.map((sub) => (
            <div key={sub.id} className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                <span className="font-semibold text-[#F5F7F6]">{sub.name}</span>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-[#9BA7A1]">Completed: {sub.completedQuestions} / {sub.totalQuestions} ({Math.round(sub.completedQuestions / sub.totalQuestions * 100)}%)</span>
                  <span className="text-[#00FF88] font-bold">Accuracy: {sub.accuracy}%</span>
                </div>
              </div>
              <div className="w-full bg-[#050807] h-2.5 rounded-full overflow-hidden border border-white/5 flex">
                <div 
                  className="bg-[#00FF88] h-full transition-all"
                  style={{ width: `${sub.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty Breakdown & Correct vs Incorrect */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Difficulty Distribution */}
        <div className="nexus-card rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-[#F5F7F6]">Accuracy by Difficulty Tier</h3>
          <div className="space-y-4">
            {difficultyStats.map((d) => (
              <div key={d.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#F5F7F6]">{d.name} Questions</span>
                  <span className="font-mono text-[#00FF88]">{d.accuracy}% ({d.solved} / {d.total})</span>
                </div>
                <div className="w-full bg-[#050807] h-2 rounded-full overflow-hidden border border-white/5">
                  <div className={`${d.color} h-full`} style={{ width: `${d.accuracy}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Type Breakdown */}
        <div className="nexus-card rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-[#F5F7F6]">Question Type Mastery</h3>
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[#050807] border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#F5F7F6] block">MCQ (Multiple Choice)</span>
                <span className="text-[11px] text-[#9BA7A1]">Standard 1/3 negative marking</span>
              </div>
              <span className="font-mono text-[#00FF88] font-bold text-sm">84% Accuracy</span>
            </div>

            <div className="p-3 rounded-xl bg-[#050807] border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#F5F7F6] block">NAT (Numerical Answer Type)</span>
                <span className="text-[11px] text-[#9BA7A1]">0 negative marks · calculation intensive</span>
              </div>
              <span className="font-mono text-amber-400 font-bold text-sm">68% Accuracy</span>
            </div>

            <div className="p-3 rounded-xl bg-[#050807] border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#F5F7F6] block">MSQ (Multi-Select Questions)</span>
                <span className="text-[11px] text-[#9BA7A1]">No partial marking · all options must match</span>
              </div>
              <span className="font-mono text-rose-400 font-bold text-sm">54% Accuracy</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
