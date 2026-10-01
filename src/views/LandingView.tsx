import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Layers, 
  BarChart3, 
  Cpu, 
  CheckCircle2, 
  BookOpen, 
  PlayCircle, 
  TrendingUp, 
  ShieldCheck, 
  Flame,
  Brain,
  Database,
  Network,
  Binary,
  Code2,
  HardDrive
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBJECT_SUMMARIES } from '../data/mockQuestions';

export const LandingView: React.FC = () => {
  const { setActiveTab, setActiveSubjectFilter, openAIWithPrompt } = useApp();
  const [selectedHeroNode, setSelectedHeroNode] = useState<string>('Operating Systems');

  const coreSubjects = [
    { name: 'Operating Systems', icon: Cpu, weight: '9-10 Marks' },
    { name: 'Algorithms & DS', icon: Binary, weight: '14-16 Marks' },
    { name: 'DBMS', icon: Database, weight: '8-9 Marks' },
    { name: 'Computer Networks', icon: Network, weight: '8-10 Marks' },
    { name: 'COA', icon: HardDrive, weight: '9-11 Marks' },
    { name: 'Theory of Computation', icon: Brain, weight: '8-9 Marks' },
    { name: 'Compiler Design', icon: Code2, weight: '4-6 Marks' },
    { name: 'Engineering Math', icon: TrendingUp, weight: '13-15 Marks' }
  ];

  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-6 pt-4 sm:pt-8">
        
        {/* Subtle academic badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121614] border border-white/10 text-xs text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-medium tracking-wide">
            One Platform for Every GATE Question
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F1F5F9] max-w-4xl mx-auto leading-[1.1]">
          Your Entire GATE Journey.{' '}
          <span className="text-emerald-400">
            Connected.
          </span>
        </h1>

        {/* Supporting Text */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Practice every PYQ, understand every concept, track your progress, and get instant AI assistance — all in one unified engineering environment.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setActiveTab('pyqs')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl nexus-glow-btn text-sm font-semibold"
          >
            <span>Start Practicing</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('pyqs')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#121614] border border-white/10 hover:border-white/20 text-slate-200 text-sm font-medium hover:bg-white/5 transition-colors"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Explore All PYQs</span>
          </button>
        </div>

        {/* Interactive Loop Flow Visual */}
        <div className="pt-8 max-w-3xl mx-auto">
          <div className="p-3 sm:p-4 rounded-xl bg-[#121614] border border-white/10 flex flex-wrap items-center justify-around gap-2 text-xs sm:text-sm">
            <span className="font-mono text-slate-200 font-medium flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> PYQ
            </span>
            <span className="text-slate-600">→</span>
            <span className="font-mono text-slate-200 font-medium flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4 text-emerald-400" /> Practice
            </span>
            <span className="text-slate-600">→</span>
            <span className="font-mono text-slate-200 font-medium flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-400" /> Analysis
            </span>
            <span className="text-slate-600">→</span>
            <span className="font-mono text-slate-200 font-medium flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Nexus AI
            </span>
            <span className="text-slate-600">→</span>
            <span className="font-mono text-slate-200 font-medium flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Mastery
            </span>
          </div>
        </div>

        {/* Interactive Subject Network Graph */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#121614] border border-white/10 relative overflow-hidden">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-wider font-mono text-emerald-400">
              Interactive Knowledge Graph
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 mt-1">
              All Subjects Converge at NexusGate
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {coreSubjects.map((sub) => {
              const Icon = sub.icon;
              const isSelected = selectedHeroNode === sub.name;
              return (
                <div
                  key={sub.name}
                  onClick={() => {
                    setSelectedHeroNode(sub.name);
                    setActiveSubjectFilter(sub.name);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-colors text-left ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                      : 'bg-[#0D110F] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-mono text-emerald-400">{sub.weight}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                    {sub.name}
                  </h3>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setActiveSubjectFilter(selectedHeroNode);
                setActiveTab('pyqs');
              }}
              className="px-4 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Practice {selectedHeroNode} PYQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </section>

      {/* 2. WHY NEXUSGATE? (CORE PILLARS) */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-wider font-mono text-emerald-400">
            Built for Serious Engineering Aspirants
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Everything GATE. One Nexus.
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Say goodbye to fragmented PDFs, outdated forums, and scattered test series.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="nexus-card p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-100">All PYQs in One Place</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every single GATE question from 2000 to 2026 indexed by branch, year, subject, topic, and difficulty.
            </p>
          </div>

          <div className="nexus-card p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <PlayCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-100">Smart Practice Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quick 10-Q sprints, topic drilling, negative marking toggles, and official GATE exam simulation timers.
            </p>
          </div>

          <div className="nexus-card p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-100">Nexus AI Tutor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Context-aware problem solving, zero-spoiler hints, mathematical derivations, and personalized study schedules.
            </p>
          </div>

          <div className="nexus-card p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-100">Deep Diagnostics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identify weak concepts before exam day with subject heatmaps, accuracy curves, and percentile projections.
            </p>
          </div>

        </div>
      </section>

      {/* 3. SUBJECT GRID PREVIEW */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-mono text-emerald-400">
              Syllabus Coverage
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
              Explore Every GATE Subject
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('subjects')}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:underline font-semibold"
          >
            <span>View All 10 Subjects & Topics</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBJECT_SUMMARIES.slice(0, 6).map((sub) => (
            <div
              key={sub.id}
              onClick={() => {
                setActiveSubjectFilter(sub.name);
                setActiveTab('pyqs');
              }}
              className="nexus-card p-4 rounded-xl cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {sub.code}
                  </span>
                  <span className="text-xs text-slate-400">{sub.totalQuestions} Questions</span>
                </div>
                <h3 className="text-base font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {sub.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Accuracy:</span>
                  <span className="font-semibold text-emerald-400">{sub.accuracy}%</span>
                </div>
                <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  Practice →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="relative p-8 sm:p-12 rounded-2xl bg-[#121614] border border-white/10 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
          Ready to Master GATE?
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Join thousands of engineering students preparing smarter with connected previous year questions and Nexus AI.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActiveTab('pyqs')}
            className="px-8 py-3 rounded-xl nexus-glow-btn text-sm font-semibold"
          >
            Start Your GATE Journey Now
          </button>
        </div>
      </section>

    </div>
  );
};
