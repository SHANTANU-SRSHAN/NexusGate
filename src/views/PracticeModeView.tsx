import React, { useState } from 'react';
import { 
  PlayCircle, 
  Zap, 
  Layers, 
  BookOpen, 
  Target, 
  Shuffle, 
  GraduationCap, 
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBJECT_SUMMARIES } from '../data/mockQuestions';
import { TestConfig } from '../types';

export const PracticeModeView: React.FC = () => {
  const { 
    questions, 
    startTest, 
    openQuestionSolver, 
    setActiveSubjectFilter, 
    setActiveTab,
    userProfile
  } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>('Operating Systems');

  const handleLaunchQuickPractice = () => {
    const qIds = questions.slice(0, 10).map(q => q.id);
    const config: TestConfig = {
      id: 'quick_practice_' + Date.now(),
      title: 'Quick 10-Question Sprint',
      category: 'Custom Test',
      questionCount: qIds.length,
      durationMinutes: 20,
      totalMarks: 15,
      negativeMarking: true,
      questionIds: qIds
    };
    startTest(config);
  };

  const handleLaunchSubjectPractice = (subName: string) => {
    const subQs = questions.filter(q => q.subject === subName);
    const targetQs = subQs.length > 0 ? subQs : questions;
    const qIds = targetQs.map(q => q.id);
    const config: TestConfig = {
      id: 'subject_test_' + Date.now(),
      title: `${subName} Practice Drill`,
      category: 'Subject Test',
      subject: subName,
      questionCount: qIds.length,
      durationMinutes: 30,
      totalMarks: 20,
      negativeMarking: true,
      questionIds: qIds
    };
    startTest(config);
  };

  const handleLaunchWeakArea = () => {
    const weakQs = questions.filter(q => userProfile.weakAreas.includes(q.subject));
    const targetQs = weakQs.length > 0 ? weakQs : questions.slice(0, 5);
    const config: TestConfig = {
      id: 'weak_drill_' + Date.now(),
      title: `Weak Area Remedial Drill`,
      category: 'Custom Test',
      questionCount: targetQs.length,
      durationMinutes: 25,
      totalMarks: 16,
      negativeMarking: true,
      questionIds: targetQs.map(q => q.id)
    };
    startTest(config);
  };

  const handleLaunchRandomChallenge = () => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const targetQs = shuffled.slice(0, 10);
    const config: TestConfig = {
      id: 'random_' + Date.now(),
      title: 'Interdisciplinary Random Challenge',
      category: 'Custom Test',
      questionCount: targetQs.length,
      durationMinutes: 25,
      totalMarks: 18,
      negativeMarking: true,
      questionIds: targetQs.map(q => q.id)
    };
    startTest(config);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[rgba(0,255,136,0.12)] pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00FF88] uppercase tracking-wider mb-1">
          <PlayCircle className="w-4 h-4" />
          <span>Interactive Training Modes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F6]">
          Practice Arena
        </h1>
        <p className="text-xs sm:text-sm text-[#9BA7A1] mt-1">
          Select your training format. From rapid 10-minute sprints to comprehensive subject marathons.
        </p>
      </div>

      {/* Practice Modes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* 1. Quick Practice Sprint */}
        <div className="nexus-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#00FF88]/50 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#00FF88]/15 border border-[#00FF88]/30 flex items-center justify-center text-[#00FF88]">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F5F7F6]">Quick Practice Sprint</h3>
            <p className="text-xs text-[#9BA7A1] leading-relaxed">
              10 high-yield questions across core subjects. Perfect for quick daily revision between study sessions.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#9BA7A1]">
              <span className="font-mono text-[#00FF88]">10 Questions</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 20 Mins</span>
            </div>
          </div>
          <button
            onClick={handleLaunchQuickPractice}
            className="w-full py-2.5 rounded-xl nexus-glow-btn text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <span>Start Quick Sprint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. Weak Area Practice */}
        <div className="nexus-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-rose-500/50 transition-all border-rose-500/20">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Target className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F5F7F6]">Weak Area Remedial</h3>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                Recommended
              </span>
            </div>
            <p className="text-xs text-[#9BA7A1] leading-relaxed">
              Targeted drill on your lowest accuracy topics ({userProfile.weakAreas.slice(0, 2).join(', ')}).
            </p>
            <div className="flex items-center gap-3 text-xs text-[#9BA7A1]">
              <span className="font-mono text-rose-400">Targeted Set</span>
              <span>·</span>
              <span>Remedial Diagnostic</span>
            </div>
          </div>
          <button
            onClick={handleLaunchWeakArea}
            className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Launch Weak Area Drill</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. Random Challenge */}
        <div className="nexus-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#00FF88]/50 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#00FF88]/15 border border-[#00FF88]/30 flex items-center justify-center text-[#00FF88]">
              <Shuffle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F5F7F6]">Random Cross-Subject Challenge</h3>
            <p className="text-xs text-[#9BA7A1] leading-relaxed">
              Random shuffle of GATE questions to test your mental agility when switching between diverse subject concepts.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#9BA7A1]">
              <span className="font-mono text-[#00FF88]">10 Questions</span>
              <span>·</span>
              <span>All Branches & Years</span>
            </div>
          </div>
          <button
            onClick={handleLaunchRandomChallenge}
            className="w-full py-2.5 rounded-xl bg-[#080C0A] hover:bg-white/5 border border-[rgba(0,255,136,0.3)] text-[#F5F7F6] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Shuffle & Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4. Full Exam Mode Simulation */}
        <div className="nexus-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#00FF88]/50 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#00FF88]/15 border border-[#00FF88]/30 flex items-center justify-center text-[#00FF88]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F5F7F6]">Full Exam Mode Simulation</h3>
            <p className="text-xs text-[#9BA7A1] leading-relaxed">
              Official 3-hour GATE interface with 65 questions, section switches, virtual scientific calculator, and negative marking.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#9BA7A1]">
              <span className="font-mono text-[#00FF88]">65 Questions</span>
              <span>·</span>
              <span>180 Minutes (Full GATE)</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('tests')}
            className="w-full py-2.5 rounded-xl nexus-glow-btn text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <span>Go to Mock Test Series</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5. Subject Focused Practice */}
        <div className="nexus-card p-6 rounded-2xl flex flex-col justify-between space-y-4 lg:col-span-2">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#00FF88]/15 border border-[#00FF88]/30 flex items-center justify-center text-[#00FF88]">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F5F7F6]">Subject Practice Drill</h3>
            <p className="text-xs text-[#9BA7A1]">
              Pick any GATE core subject to practice comprehensive sets covering all subtopics.
            </p>

            {/* Subject Selector Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {SUBJECT_SUMMARIES.map(s => (
                <button
                  key={s.name}
                  onClick={() => setSelectedSubject(s.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedSubject === s.name
                      ? 'bg-[#00FF88]/20 border border-[#00FF88] text-[#00FF88] font-bold'
                      : 'bg-[#050807] border border-white/10 text-[#9BA7A1] hover:text-white'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleLaunchSubjectPractice(selectedSubject)}
              className="px-6 py-2.5 rounded-xl nexus-glow-btn text-xs font-bold flex items-center gap-2"
            >
              <span>Practice {selectedSubject}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
