export type Branch = 'CSE/IT' | 'ECE' | 'EE' | 'ME' | 'CE' | 'IN' | 'DA';

export type QuestionType = 'MCQ' | 'MSQ' | 'NAT';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type QuestionStatus = 'not_attempted' | 'correct' | 'incorrect' | 'marked';

export interface Option {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
  isCorrect?: boolean;
}

export interface QuestionDiscussion {
  id: string;
  author: string;
  authorRank?: string;
  authorAvatar?: string;
  timestamp: string;
  content: string;
  upvotes: number;
  isLiked?: boolean;
  replies?: QuestionDiscussionReply[];
}

export interface QuestionDiscussionReply {
  id: string;
  author: string;
  timestamp: string;
  content: string;
  upvotes: number;
  isLiked?: boolean;
}

export interface Question {
  id: string; // e.g. "GATE-2024-CS-34"
  exam: string; // "GATE"
  branch: Branch;
  year: number;
  subject: string;
  topic: string;
  subtopic?: string;
  questionNumber: number;
  marks: 1 | 2;
  negativeMarks: number; // 0.33, 0.66, or 0
  questionType: QuestionType;
  difficulty: Difficulty;
  questionText: string;
  codeSnippet?: string;
  formula?: string;
  options?: Option[];
  correctAnswer: string; // "B", ["A", "C"], or "14.5"
  rangeNAT?: [number, number]; // [min, max] if NAT
  explanation: {
    steps: string[];
    conceptTested: string;
    shortcutTrick?: string;
    commonMistake: string;
    aiExplanation?: string;
  };
  statistics: {
    attemptedCount: number;
    correctPercent: number;
    incorrectPercent: number;
    averageTimeSeconds: number;
  };
  tags: string[];
  discussions: QuestionDiscussion[];
  relatedQuestionIds?: string[];
}

export interface SubjectSummary {
  id: string;
  name: string;
  code: string;
  iconName: string;
  totalQuestions: number;
  completedQuestions: number;
  accuracy: number;
  description: string;
  topics: {
    name: string;
    questionCount: number;
    completed: number;
  }[];
}

export interface UserAttempt {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  attemptedAt: string;
  marksAwarded: number;
}

export interface BookmarkItem {
  id: string;
  type: 'question' | 'discussion' | 'solution';
  targetId: string;
  title: string;
  subject: string;
  topic: string;
  savedAt: string;
}

export interface TestConfig {
  id: string;
  title: string;
  category: 'Full Length' | 'Subject Test' | 'Topic Test' | 'PYQ Test' | 'Custom Test';
  subject?: string;
  topic?: string;
  questionCount: number;
  durationMinutes: number;
  totalMarks: number;
  negativeMarking: boolean;
  questionIds: string[];
}

export interface TestSession {
  testId: string;
  config: TestConfig;
  startTime: number;
  remainingSeconds: number;
  responses: Record<string, string>; // questionId -> answer
  markedForReview: Record<string, boolean>; // questionId -> boolean
  visitedQuestions: Record<string, boolean>;
  isCompleted: boolean;
  result?: TestResult;
}

export interface TestResult {
  testId: string;
  title: string;
  category: string;
  completedAt: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  score: number;
  totalMarks: number;
  accuracy: number;
  percentile: number;
  timeSpentSeconds: number;
  subjectBreakdown: {
    subject: string;
    total: number;
    correct: number;
    score: number;
  }[];
  weakTopics: string[];
  recommendedQuestionIds: string[];
  aiAnalysisText: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface UserProfile {
  name: string;
  email: string;
  targetYear: number;
  targetBranch: Branch;
  targetScore: number;
  overallProgress: number; // e.g. 72
  questionsSolved: number; // e.g. 1248
  accuracy: number; // e.g. 78
  studyStreakDays: number; // e.g. 14
  pyqsCompleted: number; // e.g. 432
  totalPyqs: number; // e.g. 1200
  weakAreas: string[];
  strongAreas: string[];
  dailyActivity: Record<string, number>; // date "YYYY-MM-DD" -> count
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  isStreaming?: boolean;
}

export interface AIContext {
  activeQuestion?: Question;
  activeSubject?: string;
  activeTopic?: string;
  testResult?: TestResult;
  userStats?: {
    accuracy: number;
    weakAreas: string[];
  };
}
