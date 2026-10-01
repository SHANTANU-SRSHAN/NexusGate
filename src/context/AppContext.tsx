import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Question, 
  UserAttempt, 
  TestSession, 
  TestResult, 
  UserProfile, 
  TestConfig,
  QuestionDiscussion
} from '../types';
import { INITIAL_QUESTIONS, INITIAL_BADGES } from '../data/mockQuestions';

export type NavigationTab = 
  | 'landing' 
  | 'dashboard' 
  | 'pyqs' 
  | 'solve' 
  | 'solution' 
  | 'practice' 
  | 'tests' 
  | 'live-test' 
  | 'test-result' 
  | 'subjects' 
  | 'discussions' 
  | 'analytics' 
  | 'bookmarks' 
  | 'history' 
  | 'profile' 
  | 'admin' 
  | 'settings';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  questions: Question[];
  activeQuestion: Question | null;
  setActiveQuestion: (q: Question | null) => void;
  activeSubjectFilter: string | null;
  setActiveSubjectFilter: (subj: string | null) => void;
  bookmarks: string[]; // question IDs
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  userAttempts: Record<string, UserAttempt>;
  recordAttempt: (questionId: string, answer: string, timeSpentSeconds: number) => { isCorrect: boolean; marksAwarded: number };
  userProfile: UserProfile;
  updateUserProfile: (updater: Partial<UserProfile>) => void;
  badges: typeof INITIAL_BADGES;
  
  // Test engine
  activeTestConfig: TestConfig | null;
  testSession: TestSession | null;
  activeTestResult: TestResult | null;
  startTest: (config: TestConfig) => void;
  recordTestAnswer: (questionId: string, answer: string) => void;
  toggleMarkForReview: (questionId: string) => void;
  submitTestSession: () => void;
  exitTestSession: () => void;

  // Search & AI Drawer
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAIDrawerOpen: boolean;
  setIsAIDrawerOpen: (open: boolean) => void;
  aiInitialPrompt: string;
  openAIWithPrompt: (prompt: string) => void;

  // Admin & community
  addQuestion: (q: Question) => void;
  deleteQuestion: (id: string) => void;
  bulkImportQuestions: (qs: Question[]) => number;
  addDiscussionComment: (questionId: string, authorName: string, text: string) => void;
  upvoteDiscussion: (questionId: string, discussionId: string) => void;

  // Quick navigation helpers
  openQuestionSolver: (q: Question) => void;
  openQuestionSolution: (q: Question) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  QUESTIONS: 'nexusgate_questions_v1',
  BOOKMARKS: 'nexusgate_bookmarks_v1',
  ATTEMPTS: 'nexusgate_attempts_v1',
  PROFILE: 'nexusgate_profile_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('landing');
  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore fallback
    }
    return INITIAL_QUESTIONS;
  });

  const [activeQuestion, setActiveQuestion] = useState<Question | null>(INITIAL_QUESTIONS[0]);
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string | null>(null);

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return stored ? JSON.parse(stored) : ['GATE-2024-CS-34', 'GATE-2024-CS-52'];
    } catch {
      return ['GATE-2024-CS-34'];
    }
  });

  const [userAttempts, setUserAttempts] = useState<Record<string, UserAttempt>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return stored ? JSON.parse(stored) : {
        'GATE-2024-CS-18': {
          questionId: 'GATE-2024-CS-18',
          userAnswer: 'B',
          isCorrect: true,
          timeSpentSeconds: 45,
          attemptedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          marksAwarded: 1
        }
      };
    } catch {
      return {};
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    // Generate realistic daily heatmap data for last 90 days
    const dailyActivity: Record<string, number> = {};
    const now = new Date();
    for (let i = 90; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      // Random activity between 0 and 15 questions
      if (i < 14) {
        dailyActivity[key] = Math.floor(Math.random() * 10) + 4; // Active streak
      } else if (Math.random() > 0.25) {
        dailyActivity[key] = Math.floor(Math.random() * 8) + 1;
      } else {
        dailyActivity[key] = 0;
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }

    return {
      name: 'Priyanshu Verma',
      email: 'priyanshu.gate25@nexusgate.io',
      targetYear: 2025,
      targetBranch: 'CSE/IT',
      targetScore: 78.5,
      overallProgress: 72,
      questionsSolved: 1248,
      accuracy: 78,
      studyStreakDays: 14,
      pyqsCompleted: 432,
      totalPyqs: 1200,
      weakAreas: ['Operating Systems', 'Theory of Computation', 'DBMS'],
      strongAreas: ['Algorithms', 'Data Structures', 'COA'],
      dailyActivity
    };
  });

  // Test state
  const [activeTestConfig, setActiveTestConfig] = useState<TestConfig | null>(null);
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [activeTestResult, setActiveTestResult] = useState<TestResult | null>(null);

  // Modals & Panels
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(userAttempts));
  }, [userAttempts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  const recordAttempt = (questionId: string, answer: string, timeSpentSeconds: number) => {
    const q = questions.find(item => item.id === questionId);
    let isCorrect = false;

    if (q) {
      if (q.questionType === 'NAT') {
        const numVal = parseFloat(answer.trim());
        if (!isNaN(numVal)) {
          if (q.rangeNAT) {
            isCorrect = numVal >= q.rangeNAT[0] && numVal <= q.rangeNAT[1];
          } else {
            isCorrect = Math.abs(numVal - parseFloat(q.correctAnswer)) < 0.01;
          }
        }
      } else {
        isCorrect = answer.trim().toUpperCase() === q.correctAnswer.trim().toUpperCase();
      }
    }

    const marksAwarded = isCorrect ? (q?.marks || 1) : -(q?.negativeMarks || 0);

    const newAttempt: UserAttempt = {
      questionId,
      userAnswer: answer,
      isCorrect,
      timeSpentSeconds,
      attemptedAt: new Date().toISOString(),
      marksAwarded
    };

    setUserAttempts(prev => ({
      ...prev,
      [questionId]: newAttempt
    }));

    // Update profile metrics
    setUserProfile(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      const todayCount = (prev.dailyActivity[todayStr] || 0) + 1;
      return {
        ...prev,
        questionsSolved: prev.questionsSolved + 1,
        pyqsCompleted: prev.pyqsCompleted + 1,
        dailyActivity: {
          ...prev.dailyActivity,
          [todayStr]: todayCount
        }
      };
    });

    return { isCorrect, marksAwarded };
  };

  const updateUserProfile = (updater: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updater }));
  };

  const startTest = (config: TestConfig) => {
    setActiveTestConfig(config);
    setTestSession({
      testId: config.id,
      config,
      startTime: Date.now(),
      remainingSeconds: config.durationMinutes * 60,
      responses: {},
      markedForReview: {},
      visitedQuestions: { [config.questionIds[0]]: true },
      isCompleted: false
    });
    setActiveTab('live-test');
  };

  const recordTestAnswer = (questionId: string, answer: string) => {
    if (!testSession) return;
    setTestSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        responses: {
          ...prev.responses,
          [questionId]: answer
        },
        visitedQuestions: {
          ...prev.visitedQuestions,
          [questionId]: true
        }
      };
    });
  };

  const toggleMarkForReview = (questionId: string) => {
    if (!testSession) return;
    setTestSession(prev => {
      if (!prev) return null;
      const current = !!prev.markedForReview[questionId];
      return {
        ...prev,
        markedForReview: {
          ...prev.markedForReview,
          [questionId]: !current
        }
      };
    });
  };

  const submitTestSession = () => {
    if (!testSession) return;

    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let attempted = 0;

    const subjectStats: Record<string, { total: number; correct: number; score: number }> = {};

    testSession.config.questionIds.forEach(qId => {
      const q = questions.find(item => item.id === qId);
      if (!q) return;

      if (!subjectStats[q.subject]) {
        subjectStats[q.subject] = { total: 0, correct: 0, score: 0 };
      }
      subjectStats[q.subject].total += 1;

      const userAns = testSession.responses[qId];
      if (userAns !== undefined && userAns !== '') {
        attempted += 1;
        let isQCorrect = false;

        if (q.questionType === 'NAT') {
          const val = parseFloat(userAns.trim());
          if (!isNaN(val)) {
            if (q.rangeNAT) {
              isQCorrect = val >= q.rangeNAT[0] && val <= q.rangeNAT[1];
            } else {
              isQCorrect = Math.abs(val - parseFloat(q.correctAnswer)) < 0.01;
            }
          }
        } else {
          isQCorrect = userAns.trim().toUpperCase() === q.correctAnswer.trim().toUpperCase();
        }

        if (isQCorrect) {
          correct += 1;
          score += q.marks;
          subjectStats[q.subject].correct += 1;
          subjectStats[q.subject].score += q.marks;
        } else {
          incorrect += 1;
          if (testSession.config.negativeMarking) {
            score -= q.negativeMarks;
            subjectStats[q.subject].score -= q.negativeMarks;
          }
        }
      }
    });

    const unattempted = testSession.config.questionIds.length - attempted;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const percentile = Math.min(99.4, Math.max(30, Math.round(accuracy * 1.05 + 15)));

    const result: TestResult = {
      testId: testSession.testId,
      title: testSession.config.title,
      category: testSession.config.category,
      completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      totalQuestions: testSession.config.questionIds.length,
      attempted,
      correct,
      incorrect,
      unattempted,
      score: Math.max(0, Math.round(score * 100) / 100),
      totalMarks: testSession.config.totalMarks,
      accuracy,
      percentile,
      timeSpentSeconds: testSession.config.durationMinutes * 60 - testSession.remainingSeconds,
      subjectBreakdown: Object.entries(subjectStats).map(([subj, data]) => ({
        subject: subj,
        total: data.total,
        correct: data.correct,
        score: Math.round(data.score * 10) / 10
      })),
      weakTopics: ['Process Scheduling', 'Normalization', 'Pipelining Stalls'],
      recommendedQuestionIds: ['GATE-2024-CS-34', 'GATE-2024-CS-52', 'GATE-2024-CS-41'],
      aiAnalysisText: `Diagnostic Report: Excellent grasp on divide & conquer recurrences and digital logic. However, you lost ${Math.round(incorrect * 0.66 * 10) / 10} marks due to negative marking in Operating Systems (preemption timing in SRTF) and Database Normalization. We recommend practicing 15 targeted multi-level page table and Banker's algorithm questions next.`
    };

    setActiveTestResult(result);
    setTestSession(prev => prev ? { ...prev, isCompleted: true, result } : null);
    setActiveTab('test-result');
  };

  const exitTestSession = () => {
    setTestSession(null);
    setActiveTab('tests');
  };

  const openAIWithPrompt = (prompt: string) => {
    setAiInitialPrompt(prompt);
    setIsAIDrawerOpen(true);
  };

  const addQuestion = (q: Question) => {
    setQuestions(prev => [q, ...prev]);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const bulkImportQuestions = (newQuestions: Question[]) => {
    if (!newQuestions || newQuestions.length === 0) return 0;
    setQuestions(prev => {
      const existingIds = new Set(prev.map(q => q.id));
      const filtered = newQuestions.filter(q => !existingIds.has(q.id));
      return [...filtered, ...prev];
    });
    return newQuestions.length;
  };

  const addDiscussionComment = (questionId: string, authorName: string, text: string) => {
    const newComment: QuestionDiscussion = {
      id: 'd_' + Date.now(),
      author: authorName || 'GATE Aspirant',
      authorRank: 'Nexus Member',
      timestamp: 'Just now',
      content: text,
      upvotes: 1,
      isLiked: true,
      replies: []
    };

    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          discussions: [newComment, ...(q.discussions || [])]
        };
      }
      return q;
    }));
  };

  const upvoteDiscussion = (questionId: string, discussionId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          discussions: q.discussions.map(d => {
            if (d.id === discussionId) {
              const liked = !d.isLiked;
              return {
                ...d,
                isLiked: liked,
                upvotes: liked ? d.upvotes + 1 : Math.max(0, d.upvotes - 1)
              };
            }
            return d;
          })
        };
      }
      return q;
    }));
  };

  const openQuestionSolver = (q: Question) => {
    setActiveQuestion(q);
    setActiveTab('solve');
  };

  const openQuestionSolution = (q: Question) => {
    setActiveQuestion(q);
    setActiveTab('solution');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        questions,
        activeQuestion,
        setActiveQuestion,
        activeSubjectFilter,
        setActiveSubjectFilter,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        userAttempts,
        recordAttempt,
        userProfile,
        updateUserProfile,
        badges: INITIAL_BADGES,
        activeTestConfig,
        testSession,
        activeTestResult,
        startTest,
        recordTestAnswer,
        toggleMarkForReview,
        submitTestSession,
        exitTestSession,
        isSearchOpen,
        setIsSearchOpen,
        isAIDrawerOpen,
        setIsAIDrawerOpen,
        aiInitialPrompt,
        openAIWithPrompt,
        addQuestion,
        deleteQuestion,
        bulkImportQuestions,
        addDiscussionComment,
        upvoteDiscussion,
        openQuestionSolver,
        openQuestionSolution
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
