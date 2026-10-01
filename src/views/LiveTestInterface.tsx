import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flag, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Calculator,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LiveTestInterface: React.FC = () => {
  const { 
    testSession, 
    questions, 
    recordTestAnswer, 
    toggleMarkForReview, 
    submitTestSession, 
    exitTestSession 
  } = useApp();

  if (!testSession) {
    return null;
  }

  const testQuestions = testSession.config.questionIds
    .map(id => questions.find(q => q.id === id))
    .filter(Boolean) as typeof questions;

  const [activeQIndex, setActiveQIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(testSession.remainingSeconds);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInput, setCalcInput] = useState('');

  const currentQ = testQuestions[activeQIndex] || testQuestions[0];
  const currentAnswer = testSession.responses[currentQ?.id] || '';
  const isMarked = !!testSession.markedForReview[currentQ?.id];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTestSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h > 0 ? `${h}:` : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optId: string) => {
    if (currentQ.questionType === 'MSQ') {
      const existing = currentAnswer ? currentAnswer.split(',') : [];
      const updated = existing.includes(optId)
        ? existing.filter(x => x !== optId)
        : [...existing, optId].sort();
      recordTestAnswer(currentQ.id, updated.join(','));
    } else {
      recordTestAnswer(currentQ.id, optId);
    }
  };

  const clearCurrentResponse = () => {
    recordTestAnswer(currentQ.id, '');
  };

  // Status for Question Palette
  const getPaletteStatus = (qId: string) => {
    const ans = testSession.responses[qId];
    const marked = !!testSession.markedForReview[qId];
    const visited = !!testSession.visitedQuestions[qId];

    if (marked && ans) return 'marked-answered';
    if (marked) return 'marked';
    if (ans) return 'answered';
    if (visited) return 'not-answered';
    return 'not-visited';
  };

  // Counts for summary
  const answeredCount = Object.values(testSession.responses).filter(Boolean).length;
  const markedCount = Object.values(testSession.markedForReview).filter(Boolean).length;
  const notAnsweredCount = testQuestions.length - answeredCount;

  return (
    <div className="fixed inset-0 z-50 bg-[#050807] text-[#F5F7F6] flex flex-col overflow-hidden">
      
      {/* Top Test Header (Official GATE Simulation Style) */}
      <header className="h-14 border-b border-[rgba(0,255,136,0.18)] bg-[#080C0A] px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#00FF88] font-bold">
            <span>NexusGate CBT</span>
            <span>·</span>
            <span className="text-[#F5F7F6]">{testSession.config.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          
          {/* Virtual Calculator Toggle */}
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-[#00FF88] text-xs text-[#9BA7A1] hover:text-[#00FF88] transition-colors"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Calculator</span>
          </button>

          {/* Time Remaining */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs border ${
            secondsRemaining < 300 
              ? 'bg-rose-950/40 border-rose-500 text-rose-400 animate-pulse' 
              : 'bg-[#050807] border-[rgba(0,255,136,0.3)] text-[#00FF88]'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>Time Left: {formatTimer(secondsRemaining)}</span>
          </div>

          {/* Submit Test Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-1.5 rounded-lg nexus-glow-btn text-xs font-bold"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Main Body: Question Left vs Palette Right */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left: Question Solving Pane */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Question Title & Marks */}
          <div className="flex items-center justify-between border-b border-[rgba(0,255,136,0.12)] pb-3 text-xs">
            <span className="font-mono text-[#00FF88] font-bold text-sm">
              Question {activeQIndex + 1} of {testQuestions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[#9BA7A1]">{currentQ.subject} · {currentQ.topic}</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#F5F7F6]">
                +{currentQ.marks} / -{currentQ.negativeMarks} Marks
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="text-sm sm:text-base leading-relaxed text-[#F5F7F6] whitespace-pre-wrap font-sans">
            {currentQ.questionText}
          </div>

          {/* Options / NAT input */}
          <div className="pt-4 border-t border-[rgba(0,255,136,0.1)] space-y-3">
            {currentQ.questionType === 'NAT' ? (
              <div className="space-y-2">
                <label className="block text-xs font-mono text-[#00FF88]">
                  Enter Numerical Value:
                </label>
                <input
                  type="number"
                  step="any"
                  value={currentAnswer}
                  onChange={(e) => recordTestAnswer(currentQ.id, e.target.value)}
                  placeholder="Type your numerical answer..."
                  className="w-56 bg-[#080C0A] border border-[rgba(0,255,136,0.3)] focus:border-[#00FF88] rounded-xl px-4 py-2 text-sm text-[#F5F7F6] font-mono focus:outline-none"
                />
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentQ.options?.map((opt) => {
                  const isSelected = currentQ.questionType === 'MSQ'
                    ? (currentAnswer.split(',').includes(opt.id))
                    : currentAnswer === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#00FF88]/20 border-[#00FF88] text-[#F5F7F6] font-medium'
                          : 'bg-[#080C0A] border-[rgba(0,255,136,0.1)] hover:border-[#00FF88]/40 text-[#9BA7A1]'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        isSelected ? 'bg-[#00FF88] text-[#050807]' : 'bg-white/5 text-[#9BA7A1]'
                      }`}>
                        {opt.id}
                      </div>
                      <span className="text-xs sm:text-sm">{opt.text}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Action Controls */}
          <div className="mt-auto pt-6 border-t border-[rgba(0,255,136,0.1)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleMarkForReview(currentQ.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  isMarked 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                    : 'bg-white/5 border-white/10 text-[#9BA7A1] hover:text-white'
                }`}
              >
                {isMarked ? 'Marked for Review' : 'Mark for Review'}
              </button>
              <button
                onClick={clearCurrentResponse}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-xs text-[#9BA7A1] hover:text-white"
              >
                Clear Response
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={activeQIndex === 0}
                onClick={() => setActiveQIndex(prev => prev - 1)}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#9BA7A1] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <button
                disabled={activeQIndex === testQuestions.length - 1}
                onClick={() => setActiveQIndex(prev => prev + 1)}
                className="px-4 py-1.5 rounded-lg nexus-glow-btn text-xs font-bold flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>Save & Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Right: Question Navigation Palette */}
        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-[rgba(0,255,136,0.15)] bg-[#080C0A] p-4 flex flex-col shrink-0">
          
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#00FF88] mb-3">
            Question Palette
          </h3>

          {/* Palette Status Legend */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-[#9BA7A1] mb-4 pb-3 border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-[#00FF88] text-[#050807] font-bold text-[9px] flex items-center justify-center">✓</span>
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-rose-500/20 border border-rose-500 text-rose-300 font-bold text-[9px] flex items-center justify-center">✕</span>
              <span>Not Answered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-500/20 border border-amber-500 text-amber-300 font-bold text-[9px] flex items-center justify-center">★</span>
              <span>Marked ({markedCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-white/5 border border-white/10" />
              <span>Not Visited</span>
            </div>
          </div>

          {/* Numbers Grid */}
          <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-60 lg:max-h-none flex-1">
            {testQuestions.map((tq, idx) => {
              const status = getPaletteStatus(tq.id);
              const isCurrent = idx === activeQIndex;

              let style = 'bg-white/5 border-white/10 text-[#9BA7A1]';
              if (status === 'answered') {
                style = 'bg-[#00FF88] text-[#050807] font-bold border-[#00FF88]';
              } else if (status === 'marked-answered') {
                style = 'bg-emerald-700 text-amber-200 border-amber-400 font-bold';
              } else if (status === 'marked') {
                style = 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold';
              } else if (status === 'not-answered') {
                style = 'bg-rose-500/20 border-rose-500/40 text-rose-300';
              }

              return (
                <button
                  key={tq.id}
                  onClick={() => setActiveQIndex(idx)}
                  className={`w-9 h-9 rounded-lg border font-mono text-xs flex items-center justify-center transition-all ${style} ${
                    isCurrent ? 'ring-2 ring-[#00FF88] scale-105' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* Floating Scientific Calculator Modal */}
      {showCalculator && (
        <div className="fixed bottom-4 right-4 z-50 w-72 bg-[#080C0A] border border-[rgba(0,255,136,0.3)] rounded-2xl p-4 shadow-2xl space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
            <span className="font-mono text-[#00FF88] font-bold">Virtual Calculator</span>
            <button onClick={() => setShowCalculator(false)} className="text-[#9BA7A1] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-[#050807] border border-white/10 rounded-lg p-2 text-right font-mono text-base text-[#00FF88] overflow-x-auto">
            {calcInput || '0'}
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map(btn => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === '=') {
                    try {
                      // Safe arithmetic evaluation
                      const sanitized = calcInput.replace(/[^0-9+\-*/.]/g, '');
                      // eslint-disable-next-line no-eval
                      const res = Function(`'use strict'; return (${sanitized})`)();
                      setCalcInput(String(res));
                    } catch {
                      setCalcInput('Error');
                    }
                  } else {
                    setCalcInput(prev => prev + btn);
                  }
                }}
                className="p-2 rounded bg-white/5 border border-white/10 hover:border-[#00FF88] text-[#F5F7F6]"
              >
                {btn}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCalcInput('')}
            className="w-full py-1 text-[11px] rounded bg-rose-500/20 text-rose-300"
          >
            Clear
          </button>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#080C0A] border border-[rgba(0,255,136,0.3)] rounded-2xl p-6 shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-[#F5F7F6]">Confirm Test Submission</h3>
            <div className="space-y-2 text-xs text-[#9BA7A1] bg-[#050807] p-4 rounded-xl border border-white/5">
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <span className="font-mono text-[#F5F7F6]">{testQuestions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Questions Answered:</span>
                <span className="font-mono text-[#00FF88] font-bold">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Questions Marked for Review:</span>
                <span className="font-mono text-amber-300 font-bold">{markedCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Unattempted Questions:</span>
                <span className="font-mono text-rose-400 font-bold">{notAnsweredCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#9BA7A1] hover:text-white"
              >
                Back to Test
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  submitTestSession();
                }}
                className="px-5 py-2 rounded-xl nexus-glow-btn text-xs font-bold"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
