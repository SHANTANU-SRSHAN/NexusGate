import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  Flag,
  BookOpen,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const QuestionSolverView: React.FC = () => {
  const { 
    activeQuestion, 
    setActiveQuestion, 
    questions, 
    recordAttempt, 
    toggleBookmark, 
    isBookmarked, 
    openQuestionSolution,
    openAIWithPrompt,
    setActiveTab
  } = useApp();

  const q = activeQuestion || questions[0];

  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [msqSelections, setMsqSelections] = useState<string[]>([]);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{ isCorrect: boolean; marksAwarded: number } | null>(null);

  // Timer
  useEffect(() => {
    setElapsedSeconds(0);
    setIsSubmitted(false);
    setSubmissionFeedback(null);
    setSelectedAnswer('');
    setMsqSelections([]);

    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [q.id]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optId: string) => {
    if (isSubmitted) return;

    if (q.questionType === 'MSQ') {
      const next = msqSelections.includes(optId)
        ? msqSelections.filter(x => x !== optId)
        : [...msqSelections, optId].sort();
      setMsqSelections(next);
      setSelectedAnswer(next.join(','));
    } else {
      setSelectedAnswer(optId);
    }
  };

  const handleSubmit = () => {
    const finalAns = q.questionType === 'MSQ' ? msqSelections.join(',') : selectedAnswer;
    if (!finalAns.trim()) return;

    const result = recordAttempt(q.id, finalAns, elapsedSeconds);
    setSubmissionFeedback(result);
    setIsSubmitted(true);

    if (result.isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00FF88', '#00D978', '#FFFFFF']
      });
    }
  };

  // Next and Previous navigation
  const currentIndex = questions.findIndex(item => item.id === q.id);
  const prevQuestion = currentIndex > 0 ? questions[currentIndex - 1] : null;
  const nextQuestion = currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Bar with Navigation & Timer */}
      <div className="flex items-center justify-between gap-4 border-b border-[rgba(0,255,136,0.12)] pb-4">
        
        <button
          onClick={() => setActiveTab('pyqs')}
          className="flex items-center gap-1.5 text-xs text-[#9BA7A1] hover:text-[#00FF88] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to PYQ Explorer</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Live Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#080C0A] border border-[rgba(0,255,136,0.25)] font-mono text-xs text-[#00FF88]">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          {/* Ask AI Hint Button */}
          <button
            onClick={() => openAIWithPrompt(`Give me a subtle hint for question ${q.id} (${q.subject} - ${q.topic}) without revealing the direct answer.`)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-[#00FF88]/30 text-[#00FF88] text-xs font-medium hover:bg-[#00FF88]/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask AI Hint</span>
          </button>
        </div>

      </div>

      {/* Main Solver Grid: Left (Question & Options) vs Right (Info & Navigation) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Question + Input) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="nexus-card rounded-2xl p-6 space-y-5">
            
            {/* Header info */}
            <div className="flex items-center justify-between text-xs text-[#9BA7A1] border-b border-[rgba(0,255,136,0.1)] pb-3">
              <span className="font-mono text-[#00FF88] font-bold">
                {q.id} · Question {q.questionNumber}
              </span>
              <span>{q.marks} Mark{q.marks > 1 ? 's' : ''} ({q.questionType})</span>
            </div>

            {/* Question Text */}
            <div className="text-sm sm:text-base text-[#F5F7F6] leading-relaxed font-sans whitespace-pre-wrap">
              {q.questionText}
            </div>

            {/* Options or NAT Input */}
            {q.questionType === 'NAT' ? (
              <div className="pt-4 border-t border-[rgba(0,255,136,0.1)] space-y-3">
                <label className="block text-xs font-mono text-[#00FF88]">
                  Enter Numerical Answer (Real number or Integer):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="any"
                    value={selectedAnswer}
                    disabled={isSubmitted}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    placeholder="e.g. 9.25 or 2"
                    className="w-48 bg-[#050807] border border-[rgba(0,255,136,0.3)] focus:border-[#00FF88] rounded-xl px-4 py-2 text-sm text-[#F5F7F6] font-mono focus:outline-none"
                  />
                  <span className="text-xs text-[#9BA7A1]">(No negative marking for NAT)</span>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-[rgba(0,255,136,0.1)] space-y-2.5">
                <div className="text-[11px] text-[#9BA7A1] font-mono mb-2">
                  {q.questionType === 'MSQ' ? 'Select ONE or MORE correct options:' : 'Select ONE correct option:'}
                </div>
                {q.options?.map((opt) => {
                  const isSelected = q.questionType === 'MSQ'
                    ? msqSelections.includes(opt.id)
                    : selectedAnswer === opt.id;

                  const isCorrect = isSubmitted && (
                    q.questionType === 'MSQ'
                      ? q.correctAnswer.split(',').includes(opt.id)
                      : q.correctAnswer === opt.id
                  );

                  const isIncorrect = isSubmitted && isSelected && !isCorrect;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all duration-150 ${
                        isSubmitted
                          ? isCorrect
                            ? 'bg-[#00FF88]/20 border-[#00FF88] text-[#00FF88]'
                            : isIncorrect
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                            : 'bg-[#050807] border-white/5 opacity-60'
                          : isSelected
                          ? 'bg-[#00FF88]/15 border-[#00FF88] text-[#F5F7F6] shadow-[0_0_15px_rgba(0,255,136,0.15)]'
                          : 'bg-[#050807] border-[rgba(0,255,136,0.12)] hover:border-[#00FF88]/40 hover:bg-white/5 text-[#9BA7A1]'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#00FF88] text-[#050807]'
                          : 'bg-white/5 text-[#9BA7A1] border border-white/10'
                      }`}>
                        {opt.id}
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{opt.text}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Submission Feedback Banner */}
            {isSubmitted && submissionFeedback && (
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
                submissionFeedback.isCorrect 
                  ? 'bg-emerald-950/40 border-[#00FF88] text-[#00FF88]' 
                  : 'bg-rose-950/40 border-rose-500 text-rose-300'
              }`}>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                  {submissionFeedback.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[#00FF88]" />
                      <span>Correct Answer! (+{submissionFeedback.marksAwarded} Mark{submissionFeedback.marksAwarded > 1 ? 's' : ''})</span>
                    </>
                  ) : (
                    <>
                      <Flag className="w-5 h-5 text-rose-400" />
                      <span>Incorrect. ({submissionFeedback.marksAwarded} Marks)</span>
                    </>
                  )}
                </div>

                <button
                  onClick={() => openQuestionSolution(q)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#00FF88] text-[#050807] text-xs font-bold shadow-[0_0_12px_rgba(0,255,136,0.4)]"
                >
                  View Step-by-Step Solution
                </button>
              </div>
            )}

          </div>

          {/* Bottom Actions Bar */}
          <div className="nexus-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center gap-2">
              {prevQuestion && (
                <button
                  onClick={() => setActiveQuestion(prevQuestion)}
                  className="px-3 py-1.5 rounded-lg bg-[#050807] border border-white/10 hover:border-[#00FF88]/40 text-xs text-[#9BA7A1] hover:text-white"
                >
                  Previous
                </button>
              )}

              <button
                onClick={() => setIsMarkedForReview(!isMarkedForReview)}
                className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                  isMarkedForReview 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold' 
                    : 'bg-[#050807] border-white/10 text-[#9BA7A1] hover:text-white'
                }`}
              >
                {isMarkedForReview ? '★ Marked for Review' : 'Mark for Review'}
              </button>

              <button
                onClick={() => toggleBookmark(q.id)}
                className={`p-2 rounded-lg border transition-colors ${
                  isBookmarked(q.id) 
                    ? 'bg-[#00FF88]/20 border-[#00FF88] text-[#00FF88]' 
                    : 'bg-[#050807] border-white/10 text-[#9BA7A1]'
                }`}
                title="Bookmark"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(q.id) ? 'fill-[#00FF88]' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer && msqSelections.length === 0}
                  className="px-5 py-2 rounded-xl nexus-glow-btn text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit & Check Answer
                </button>
              ) : (
                <button
                  onClick={() => openQuestionSolution(q)}
                  className="px-4 py-2 rounded-xl bg-emerald-950/60 border border-[#00FF88] text-[#00FF88] text-xs font-semibold"
                >
                  Detailed Solution
                </button>
              )}

              {nextQuestion && (
                <button
                  onClick={() => setActiveQuestion(nextQuestion)}
                  className="px-3.5 py-2 rounded-xl bg-[#050807] border border-white/10 hover:border-[#00FF88] text-xs text-[#F5F7F6] flex items-center gap-1 font-semibold"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Right Column (Question Metadata & Context) */}
        <div className="space-y-5">
          
          {/* Question Details Card */}
          <div className="nexus-card rounded-2xl p-5 space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-wider text-[#00FF88] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Question Metadata
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#9BA7A1]">Exam & Branch:</span>
                <span className="font-semibold text-[#F5F7F6]">GATE {q.branch}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#9BA7A1]">Exam Year:</span>
                <span className="font-mono text-[#00FF88] font-bold">{q.year}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#9BA7A1]">Subject:</span>
                <span className="font-medium text-[#F5F7F6] text-right">{q.subject}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#9BA7A1]">Topic:</span>
                <span className="font-medium text-[#F5F7F6] text-right">{q.topic}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#9BA7A1]">Marks:</span>
                <span className="font-mono text-[#F5F7F6]">{q.marks} Mark{q.marks > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#9BA7A1]">Negative Marks:</span>
                <span className="font-mono text-rose-400">-{q.negativeMarks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9BA7A1]">Difficulty:</span>
                <span className={`font-semibold ${
                  q.difficulty === 'Easy' ? 'text-emerald-400' : q.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {q.difficulty}
                </span>
              </div>
            </div>

            {/* Performance Statistics */}
            <div className="pt-3 border-t border-[rgba(0,255,136,0.1)] space-y-2">
              <span className="text-[11px] text-[#9BA7A1]">Community Accuracy</span>
              <div className="w-full bg-[#050807] h-2 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="bg-[#00FF88] h-full rounded-full" 
                  style={{ width: `${q.statistics.correctPercent}%` }} 
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#9BA7A1]">
                <span>{q.statistics.correctPercent}% Correct</span>
                <span>{q.statistics.incorrectPercent}% Incorrect</span>
              </div>
            </div>

          </div>

          {/* Quick AI Assistance Prompt Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-[#080C0A] border border-[#00FF88]/25 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#00FF88]">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Stuck on this question?</span>
            </div>
            <p className="text-xs text-[#9BA7A1] leading-relaxed">
              Nexus AI can break down this problem without spoiling the final answer.
            </p>
            <button
              onClick={() => openAIWithPrompt(`Can you explain the core concept behind question ${q.id} (${q.topic})?`)}
              className="w-full py-1.5 px-3 rounded-lg bg-[#00FF88]/15 hover:bg-[#00FF88]/25 border border-[#00FF88]/30 text-[#00FF88] text-xs font-semibold transition-colors"
            >
              Explain Core Concept
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
