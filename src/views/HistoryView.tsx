import React from 'react';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  Play, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HistoryView: React.FC = () => {
  const { userAttempts, questions, openQuestionSolver, openQuestionSolution, setActiveTab } = useApp();

  const attemptList = Object.values(userAttempts).sort(
    (a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime()
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(0,255,136,0.12)] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00FF88] uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Audit Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F6]">
            Practice History ({attemptList.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#9BA7A1] mt-1">
            Review every answered problem, your selected options, time taken, and net marks scored.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('pyqs')}
          className="px-4 py-2 rounded-xl nexus-glow-btn text-xs font-bold"
        >
          Practice More Questions
        </button>
      </div>

      {/* History Table */}
      <div className="nexus-card rounded-2xl overflow-hidden">
        {attemptList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm text-[#9BA7A1]">No attempt history yet. Start solving questions to track progress!</p>
            <button
              onClick={() => setActiveTab('pyqs')}
              className="px-4 py-2 rounded-xl nexus-glow-btn text-xs font-bold"
            >
              Solve Your First PYQ
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(0,255,136,0.1)]">
            {attemptList.map((att) => {
              const q = questions.find(item => item.id === att.questionId);
              if (!q) return null;

              return (
                <div key={att.questionId} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/2 transition-colors">
                  
                  {/* Left: Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-[#00FF88] font-bold">{q.id}</span>
                      <span className="text-[#9BA7A1]">·</span>
                      <span className="text-[#F5F7F6] font-semibold">{q.subject}</span>
                      <span className="text-[#9BA7A1]">·</span>
                      <span className="text-[#9BA7A1]">{q.topic}</span>
                    </div>

                    <p className="text-xs text-[#9BA7A1] line-clamp-1">
                      {q.questionText}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-[#9BA7A1] pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-[#00FF88]" /> {att.timeSpentSeconds}s
                      </span>
                      <span>·</span>
                      <span>Attempted: {new Date(att.attemptedAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>Your Answer: <strong className="text-[#F5F7F6] font-mono">{att.userAnswer}</strong></span>
                    </div>
                  </div>

                  {/* Right: Outcome + Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      {att.isCorrect ? (
                        <div className="flex items-center gap-1 text-xs font-bold text-[#00FF88]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>+{att.marksAwarded} Marks</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs font-bold text-rose-400">
                          <XCircle className="w-4 h-4" />
                          <span>{att.marksAwarded} Marks</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openQuestionSolution(q)}
                        className="px-3 py-1.5 rounded-lg bg-[#050807] border border-white/10 hover:border-[#00FF88] text-xs text-[#F5F7F6]"
                      >
                        Solution
                      </button>
                      <button
                        onClick={() => openQuestionSolver(q)}
                        className="p-1.5 rounded-lg nexus-glow-btn text-xs"
                        title="Re-attempt"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
