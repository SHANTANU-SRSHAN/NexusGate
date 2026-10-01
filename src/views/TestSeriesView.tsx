import React, { useState } from 'react';
import { 
  FileCheck2, 
  Play, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Layers,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TestConfig } from '../types';

export const TestSeriesView: React.FC = () => {
  const { questions, startTest } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const testPresets: TestConfig[] = [
    {
      id: 'full_length_mock_1',
      title: 'GATE CSE All-India Live Mock Test 1',
      category: 'Full Length',
      questionCount: Math.min(questions.length, 12),
      durationMinutes: 45,
      totalMarks: 25,
      negativeMarking: true,
      questionIds: questions.map(q => q.id)
    },
    {
      id: 'os_subject_mock',
      title: 'Operating Systems Mastery Test',
      category: 'Subject Test',
      subject: 'Operating Systems',
      questionCount: questions.filter(q => q.subject === 'Operating Systems').length || 3,
      durationMinutes: 20,
      totalMarks: 10,
      negativeMarking: true,
      questionIds: questions.filter(q => q.subject === 'Operating Systems').map(q => q.id)
    },
    {
      id: 'algo_subject_mock',
      title: 'Algorithms & Data Structures High-Yield Test',
      category: 'Subject Test',
      subject: 'Algorithms',
      questionCount: questions.filter(q => q.subject === 'Algorithms' || q.subject === 'Data Structures').length || 3,
      durationMinutes: 20,
      totalMarks: 10,
      negativeMarking: true,
      questionIds: questions.filter(q => q.subject === 'Algorithms' || q.subject === 'Data Structures').map(q => q.id)
    },
    {
      id: 'pyq_2024_test',
      title: 'Official GATE 2024 Exam Simulation',
      category: 'PYQ Test',
      questionCount: questions.filter(q => q.year === 2024).length || 5,
      durationMinutes: 30,
      totalMarks: 15,
      negativeMarking: true,
      questionIds: questions.filter(q => q.year === 2024).map(q => q.id)
    },
    {
      id: 'dbms_cn_topic_test',
      title: 'Transactions & TCP Networking Drill',
      category: 'Topic Test',
      questionCount: 4,
      durationMinutes: 15,
      totalMarks: 8,
      negativeMarking: true,
      questionIds: questions.filter(q => q.subject === 'DBMS' || q.subject === 'Computer Networks').map(q => q.id)
    }
  ];

  const categories = ['All', 'Full Length', 'Subject Test', 'Topic Test', 'PYQ Test'];

  const filteredTests = selectedCategory === 'All' 
    ? testPresets 
    : testPresets.filter(t => t.category === selectedCategory);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="border-b border-[rgba(0,255,136,0.12)] pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00FF88] uppercase tracking-wider mb-1">
          <GraduationCap className="w-4 h-4" />
          <span>Real Examination Simulation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F6]">
          Mock Test Series
        </h1>
        <p className="text-xs sm:text-sm text-[#9BA7A1] mt-1">
          Simulate real GATE exam environment with countdown timers, virtual question palette, and instant AI diagnostic report.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              selectedCategory === cat
                ? 'bg-[#00FF88] text-[#050807] font-bold shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                : 'bg-[#080C0A] text-[#9BA7A1] hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Test Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="nexus-card rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#00FF88]/50 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#00FF88] font-bold bg-[#00FF88]/10 px-2 py-0.5 rounded border border-[#00FF88]/20">
                  {test.category}
                </span>
                <span className="text-[#9BA7A1] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {test.durationMinutes} Mins
                </span>
              </div>

              <h3 className="text-base font-bold text-[#F5F7F6] group-hover:text-[#00FF88] transition-colors leading-snug">
                {test.title}
              </h3>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-[#9BA7A1] border-t border-white/5">
                <div>
                  <span>Questions: </span>
                  <strong className="text-[#F5F7F6] font-mono">{test.questionCount} Qs</strong>
                </div>
                <div>
                  <span>Total Marks: </span>
                  <strong className="text-[#F5F7F6] font-mono">{test.totalMarks} Marks</strong>
                </div>
                <div className="col-span-2">
                  <span>Marking: </span>
                  <span className="text-[#00FF88]">Standard GATE (+1/+2, -0.33/-0.66)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => startTest(test)}
              className="w-full py-2.5 rounded-xl nexus-glow-btn text-xs font-bold flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Mock Test</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
