import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Zap, 
  AlertTriangle, 
  Sparkles, 
  Bookmark, 
  MessageSquare, 
  Layers, 
  ArrowRight,
  Send,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SolutionDetailView: React.FC = () => {
  const { 
    activeQuestion, 
    setActiveQuestion, 
    questions, 
    userAttempts, 
    toggleBookmark, 
    isBookmarked,
    openAIWithPrompt,
    openQuestionSolver,
    setActiveTab,
    addDiscussionComment,
    upvoteDiscussion
  } = useApp();

  const q = activeQuestion || questions[0];
  const attempt = userAttempts[q.id];

  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [showAIExpanded, setShowAIExpanded] = useState(true);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addDiscussionComment(q.id, authorName || 'GATE Aspirant', commentText.trim());
    setCommentText('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-[rgba(0,255,136,0.12)] pb-4">
        <button
          onClick={() => setActiveTab('pyqs')}
          className="flex items-center gap-1.5 text-xs text-[#9BA7A1] hover:text-[#00FF88] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All PYQs</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleBookmark(q.id)}
            className={`p-2 rounded-lg border text-xs transition-colors flex items-center gap-1.5 ${
              isBookmarked(q.id) 
                ? 'bg-[#00FF88]/20 border-[#00FF88] text-[#00FF88]' 
                : 'bg-[#080C0A] border-white/10 text-[#9BA7A1] hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(q.id) ? 'fill-[#00FF88]' : ''}`} />
            <span className="hidden sm:inline">{isBookmarked(q.id) ? 'Bookmarked' : 'Bookmark'}</span>
          </button>

          <button
            onClick={() => openQuestionSolver(q)}
            className="px-4 py-2 rounded-xl nexus-glow-btn text-xs font-bold"
          >
            Solve in Practice Mode
          </button>
        </div>
      </div>

      {/* Main Solution Card */}
      <div className="nexus-card rounded-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(0,255,136,0.1)] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00FF88]">
              <span>GATE {q.branch} {q.year}</span>
              <span>·</span>
              <span>Question {q.questionNumber}</span>
              <span>·</span>
              <span>{q.marks} Mark{q.marks > 1 ? 's' : ''}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#F5F7F6]">
              {q.subject} — {q.topic}
            </h1>
          </div>

          {/* Answer Compare Badge */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#00FF88]/15 border border-[#00FF88]/40 text-xs">
              <span className="text-[#9BA7A1] mr-1.5">Official Answer:</span>
              <strong className="text-[#00FF88] font-mono font-bold text-sm">{q.correctAnswer}</strong>
            </div>

            {attempt && (
              <div className={`px-3 py-1.5 rounded-xl text-xs border flex items-center gap-1.5 ${
                attempt.isCorrect 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}>
                {attempt.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF88]" />
                    <span>Your Answer: {attempt.userAnswer} (Correct)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Your Answer: {attempt.userAnswer} (Incorrect)</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Question Statement Box */}
        <div className="p-4 rounded-xl bg-[#050807] border border-white/5 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#9BA7A1]">
            Problem Statement
          </span>
          <div className="text-xs sm:text-sm text-[#F5F7F6] leading-relaxed whitespace-pre-wrap">
            {q.questionText}
          </div>

          {q.options && q.options.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {q.options.map((opt) => {
                const isCorrect = q.correctAnswer.split(',').map(s => s.trim()).includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                      isCorrect 
                        ? 'bg-[#00FF88]/15 border-[#00FF88] text-[#00FF88] font-semibold' 
                        : 'bg-[#080C0A] border-white/5 text-[#9BA7A1]'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[10px] ${
                      isCorrect ? 'bg-[#00FF88] text-[#050807]' : 'bg-white/5 text-[#9BA7A1]'
                    }`}>
                      {opt.id}
                    </span>
                    <span className="truncate">{opt.text}</span>
                    {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 ml-auto shrink-0" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 1. DETAILED OFFICIAL SOLUTION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#F5F7F6]">
            <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
            <span>Detailed Step-by-Step Derivation</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#050807] border border-[rgba(0,255,136,0.15)] space-y-3">
            {q.explanation.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F5F7F6] leading-relaxed font-sans">
                <span className="font-mono text-[#00FF88] font-bold text-xs mt-0.5 shrink-0">
                  Step {idx + 1}:
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. CONCEPT TESTED & PRO SHORTCUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Concept Tested */}
          <div className="p-4 rounded-xl bg-[#080C0A] border border-[rgba(0,255,136,0.15)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#00FF88]">
              <Lightbulb className="w-4 h-4" />
              <span>Concept Tested</span>
            </div>
            <p className="text-xs text-[#9BA7A1] leading-relaxed">
              {q.explanation.conceptTested}
            </p>
          </div>

          {/* Shortcut / Trick */}
          {q.explanation.shortcutTrick && (
            <div className="p-4 rounded-xl bg-[#080C0A] border border-amber-500/25 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Zap className="w-4 h-4" />
                <span>GATE Speed Shortcut</span>
              </div>
              <p className="text-xs text-[#9BA7A1] leading-relaxed">
                {q.explanation.shortcutTrick}
              </p>
            </div>
          )}

        </div>

        {/* 3. COMMON MISTAKE / TRAP */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/25 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Common Pitfall to Avoid</span>
          </div>
          <p className="text-xs text-[#9BA7A1] leading-relaxed">
            {q.explanation.commonMistake}
          </p>
        </div>

        {/* 4. DEDICATED NEXUS AI EXPLANATION */}
        <div className="rounded-2xl border border-[#00FF88]/30 bg-gradient-to-br from-emerald-950/30 to-[#080C0A] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[#00FF88]">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Nexus AI Explanation & Intuition</span>
            </div>
            <button
              onClick={() => openAIWithPrompt(`Explain why option ${q.correctAnswer} is the only correct answer for ${q.id} and analyze why students get it wrong.`)}
              className="px-3 py-1 rounded-lg bg-[#00FF88]/20 hover:bg-[#00FF88]/30 border border-[#00FF88]/40 text-[#00FF88] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Ask Nexus AI Doubt</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-[#F5F7F6] leading-relaxed font-sans">
            {q.explanation.aiExplanation || "Nexus AI analyzes this question as a core evaluation of system state transitions. The critical observation is to follow the boundary invariances without skipping execution time slices."}
          </p>
        </div>

        {/* 5. RELATED QUESTIONS */}
        {q.relatedQuestionIds && q.relatedQuestionIds.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-[rgba(0,255,136,0.1)]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#9BA7A1]">
              <Layers className="w-4 h-4 text-[#00FF88]" />
              <span>Related GATE PYQs on this Concept</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {q.relatedQuestionIds.map((relId) => {
                const relQ = questions.find(item => item.id === relId);
                return (
                  <button
                    key={relId}
                    onClick={() => relQ && setActiveQuestion(relQ)}
                    className="px-3 py-1.5 rounded-lg bg-[#050807] border border-[rgba(0,255,136,0.2)] hover:border-[#00FF88] text-xs font-mono text-[#00FF88] transition-colors"
                  >
                    {relId} {relQ ? `(${relQ.topic})` : ''} →
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* 6. DISCUSSION SECTION (Section 21) */}
      <div className="nexus-card rounded-2xl p-6 sm:p-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-[rgba(0,255,136,0.1)] pb-4">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-[#00FF88]" />
            <h2 className="text-base sm:text-lg font-bold text-[#F5F7F6]">
              Community Discussion ({q.discussions?.length || 0})
            </h2>
          </div>
          <span className="text-xs text-[#9BA7A1]">Sorted by Best Solutions</span>
        </div>

        {/* Post comment box */}
        <form onSubmit={handlePostComment} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your Name / AIR Target (e.g. Rahul - AIR < 100)"
              className="bg-[#050807] border border-[rgba(0,255,136,0.18)] focus:border-[#00FF88] rounded-xl px-3 py-2 text-xs text-[#F5F7F6] focus:outline-none"
            />
          </div>
          <textarea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share an alternative solution, ask a doubt, or discuss nuances..."
            className="w-full bg-[#050807] border border-[rgba(0,255,136,0.18)] focus:border-[#00FF88] rounded-xl p-3 text-xs text-[#F5F7F6] placeholder-[#9BA7A1]/60 focus:outline-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 rounded-xl nexus-glow-btn text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Response</span>
            </button>
          </div>
        </form>

        {/* Discussions List */}
        <div className="space-y-4 pt-4 border-t border-[rgba(0,255,136,0.1)]">
          {(!q.discussions || q.discussions.length === 0) ? (
            <p className="text-xs text-[#9BA7A1] text-center py-6">
              Be the first to share your alternative derivation or ask a doubt!
            </p>
          ) : (
            q.discussions.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-xl bg-[#050807] border border-[rgba(0,255,136,0.12)] space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#F5F7F6]">{d.author}</span>
                    {d.authorRank && (
                      <span className="text-[10px] font-mono text-[#00FF88] bg-[#00FF88]/10 px-1.5 py-0.2 rounded border border-[#00FF88]/20">
                        {d.authorRank}
                      </span>
                    )}
                    <span className="text-[#9BA7A1]">· {d.timestamp}</span>
                  </div>

                  {/* Upvote button */}
                  <button
                    onClick={() => upvoteDiscussion(q.id, d.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      d.isLiked
                        ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40'
                        : 'bg-white/5 text-[#9BA7A1] hover:text-[#F5F7F6]'
                    }`}
                  >
                    <span>▲</span>
                    <span>{d.upvotes}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-[#F5F7F6] leading-relaxed font-sans">
                  {d.content}
                </p>

                {d.replies && d.replies.length > 0 && (
                  <div className="pl-4 border-l-2 border-[#00FF88]/30 space-y-2 mt-2">
                    {d.replies.map(r => (
                      <div key={r.id} className="text-xs space-y-1">
                        <div className="flex items-center gap-2 text-[#9BA7A1]">
                          <span className="font-semibold text-[#F5F7F6]">{r.author}</span>
                          <span>· {r.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#9BA7A1] leading-relaxed">{r.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
