import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  ArrowRight, 
  Sparkles, 
  Bookmark, 
  Filter,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DiscussionsView: React.FC = () => {
  const { 
    questions, 
    openQuestionSolution, 
    addDiscussionComment, 
    upvoteDiscussion 
  } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuestionId, setActiveQuestionId] = useState<string>(questions[0]?.id || '');
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  // Collect all questions that have discussions
  const questionsWithDiscussions = questions.filter(q => q.discussions && q.discussions.length > 0);

  const activeQuestion = questions.find(q => q.id === activeQuestionId) || questionsWithDiscussions[0] || questions[0];

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activeQuestion) return;
    addDiscussionComment(activeQuestion.id, authorName || 'GATE Aspirant', newComment.trim());
    setNewComment('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="border-b border-[rgba(0,255,136,0.12)] pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00FF88] uppercase tracking-wider mb-1">
          <MessageSquare className="w-4 h-4" />
          <span>Peer & Ranker Discussions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F6]">
          Question Discussions & Doubts
        </h1>
        <p className="text-xs sm:text-sm text-[#9BA7A1] mt-1">
          Explore alternative derivations, clarify subtle edge cases, and learn the intuition from previous year toppers.
        </p>
      </div>

      {/* Main Grid: Left Questions List vs Right Discussion Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Question Discussions List */}
        <div className="space-y-4">
          <div className="nexus-card rounded-2xl p-4 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#00FF88]">
              Browse Threads
            </span>

            <div className="space-y-2">
              {questions.map((q) => {
                const isSelected = q.id === activeQuestion?.id;
                return (
                  <div
                    key={q.id}
                    onClick={() => setActiveQuestionId(q.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#00FF88]/15 border-[#00FF88] text-[#F5F7F6]'
                        : 'bg-[#050807] border-white/5 hover:border-[#00FF88]/40 text-[#9BA7A1]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-[#00FF88] font-bold">{q.id}</span>
                      <span className="text-[10px] text-[#9BA7A1]">
                        {q.discussions?.length || 0} reply{q.discussions?.length !== 1 ? 'ies' : ''}
                      </span>
                    </div>
                    <div className="text-xs text-[#F5F7F6] font-semibold truncate">
                      {q.subject} · {q.topic}
                    </div>
                    <p className="text-[11px] text-[#9BA7A1] line-clamp-1 mt-1">
                      {q.questionText}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Thread */}
        <div className="lg:col-span-2 space-y-6">
          {activeQuestion && (
            <div className="nexus-card rounded-2xl p-6 space-y-6">
              
              {/* Question Header */}
              <div className="space-y-2 border-b border-[rgba(0,255,136,0.1)] pb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#00FF88] font-bold">
                    {activeQuestion.id} · {activeQuestion.subject}
                  </span>
                  <button
                    onClick={() => openQuestionSolution(activeQuestion)}
                    className="text-xs text-[#00FF88] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>View Solution</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#F5F7F6]">
                  {activeQuestion.topic} ({activeQuestion.questionType}, {activeQuestion.marks}M)
                </h3>
                <p className="text-xs text-[#9BA7A1] leading-relaxed bg-[#050807] p-3 rounded-xl border border-white/5 line-clamp-3">
                  {activeQuestion.questionText}
                </p>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handlePost} className="space-y-3">
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your Name (e.g. Srikant - Gate CS '25)"
                  className="w-full sm:w-72 bg-[#050807] border border-[rgba(0,255,136,0.2)] focus:border-[#00FF88] rounded-xl px-3.5 py-2 text-xs text-[#F5F7F6] focus:outline-none"
                />
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Post an alternative formula, tip, or question about this problem..."
                  className="w-full bg-[#050807] border border-[rgba(0,255,136,0.2)] focus:border-[#00FF88] rounded-xl p-3 text-xs text-[#F5F7F6] placeholder-[#9BA7A1]/60 focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-5 py-2 rounded-xl nexus-glow-btn text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Solution / Doubt</span>
                  </button>
                </div>
              </form>

              {/* Comment Items */}
              <div className="space-y-4 pt-4 border-t border-[rgba(0,255,136,0.1)]">
                {(!activeQuestion.discussions || activeQuestion.discussions.length === 0) ? (
                  <p className="text-center text-xs text-[#9BA7A1] py-8">
                    No discussions on this question yet. Start the conversation!
                  </p>
                ) : (
                  activeQuestion.discussions.map((d) => (
                    <div
                      key={d.id}
                      className="p-4 rounded-xl bg-[#050807] border border-[rgba(0,255,136,0.12)] space-y-2.5"
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

                        <button
                          onClick={() => upvoteDiscussion(activeQuestion.id, d.id)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono ${
                            d.isLiked ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40' : 'bg-white/5 text-[#9BA7A1]'
                          }`}
                        >
                          <span>▲</span>
                          <span>{d.upvotes}</span>
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-[#F5F7F6] leading-relaxed">
                        {d.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
