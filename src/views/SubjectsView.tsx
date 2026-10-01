import React, { useState } from 'react';
import { 
  Library, 
  Cpu, 
  Binary, 
  Layers, 
  Database, 
  Network, 
  HardDrive, 
  Code2, 
  Sigma, 
  BrainCircuit, 
  Play, 
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBJECT_SUMMARIES } from '../data/mockQuestions';
import { SubjectSummary } from '../types';

export const SubjectsView: React.FC = () => {
  const { setActiveSubjectFilter, setActiveTab } = useApp();
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return Cpu;
      case 'Binary': return Binary;
      case 'Layers': return Layers;
      case 'Database': return Database;
      case 'Network': return Network;
      case 'HardDrive': return HardDrive;
      case 'Code2': return Code2;
      case 'Sigma': return Sigma;
      case 'BrainCircuit': return BrainCircuit;
      default: return Library;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedSubject(prev => prev === id ? null : id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[rgba(0,255,136,0.12)] pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00FF88] uppercase tracking-wider mb-1">
          <Library className="w-4 h-4" />
          <span>Curriculum Mastery</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F6]">
          GATE Core Subjects
        </h1>
        <p className="text-xs sm:text-sm text-[#9BA7A1] mt-1">
          Track subject completion percentages, accuracy metrics, and drill down into topic-level PYQs.
        </p>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SUBJECT_SUMMARIES.map((sub: SubjectSummary) => {
          const Icon = getSubjectIcon(sub.iconName);
          const isExpanded = expandedSubject === sub.id;
          const completedPercent = Math.round((sub.completedQuestions / sub.totalQuestions) * 100);

          return (
            <div
              key={sub.id}
              className="nexus-card rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#00FF88]/40 transition-all duration-200"
            >
              <div className="space-y-4">
                
                {/* Top Row: Icon + Code + Numbers */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00FF88]/15 border border-[#00FF88]/30 flex items-center justify-center text-[#00FF88]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#F5F7F6]">{sub.name}</h3>
                      <span className="text-[10px] font-mono text-[#00FF88] bg-[#00FF88]/10 px-1.5 py-0.2 rounded border border-[#00FF88]/20">
                        {sub.code}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-[#F5F7F6]">
                      {sub.totalQuestions}
                    </span>
                    <span className="text-xs text-[#9BA7A1] block">Questions</span>
                  </div>
                </div>

                <p className="text-xs text-[#9BA7A1] leading-relaxed">
                  {sub.description}
                </p>

                {/* Progress bars */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#9BA7A1]">Completed:</span>
                      <span className="font-mono text-[#00FF88]">{completedPercent}%</span>
                    </div>
                    <div className="w-full bg-[#050807] h-1.5 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-[#00FF88] h-full rounded-full" style={{ width: `${completedPercent}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#9BA7A1]">Accuracy:</span>
                      <span className="font-mono text-[#F5F7F6]">{sub.accuracy}%</span>
                    </div>
                    <div className="w-full bg-[#050807] h-1.5 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-[#00FF88] h-full rounded-full" style={{ width: `${sub.accuracy}%` }} />
                    </div>
                  </div>
                </div>

                {/* Topics Expansion Drawer */}
                {isExpanded && sub.topics && (
                  <div className="pt-3 border-t border-white/5 space-y-2 animate-in fade-in duration-150">
                    <span className="text-[10px] font-mono uppercase text-[#00FF88]">
                      Topic Breakdown:
                    </span>
                    <div className="space-y-1.5">
                      {sub.topics.map((t, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#050807] border border-white/5">
                          <span className="text-[#F5F7F6]">{t.name}</span>
                          <span className="text-[#9BA7A1] font-mono">{t.completed} / {t.questionCount} Qs</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[rgba(0,255,136,0.1)] flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleExpand(sub.id)}
                  className="text-xs text-[#9BA7A1] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>{isExpanded ? 'Hide Topics' : 'View Topics'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveSubjectFilter(sub.name);
                      setActiveTab('pyqs');
                    }}
                    className="px-4 py-2 rounded-xl nexus-glow-btn text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Practice PYQs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
