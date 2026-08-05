export type ConjunctionCategory = 'coordinating' | 'subordinating' | 'correlative' | 'conjunctive_adverb';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type GradeLevel = 'elementary' | 'middle_school' | 'high_school';

export interface ConjunctionRule {
  id: string;
  name: string;
  category: ConjunctionCategory;
  description: string;
  examples: string[];
  tips: string;
  commonWords: string[];
}

export type ExerciseType = 'fill_blank' | 'sentence_builder' | 'spot_error' | 'clause_match';

export interface Question {
  id: string;
  category: ConjunctionCategory;
  difficulty: DifficultyLevel;
  type: ExerciseType;
  prompt: string;
  context?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  // For sentence builder or clause matching
  clauses?: { clauseA: string; clauseB: string };
  // For error spotting
  originalSentence?: string;
  errorWord?: string;
}

export interface UserStats {
  totalAnswered: number;
  totalCorrect: number;
  categoryStats: Record<ConjunctionCategory, { answered: number; correct: number }>;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  xp: number;
  level: number;
  dailyChallengeCompletedDate?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  category: 'accuracy' | 'streak' | 'mastery' | 'ai';
  unlockedAt?: string; // ISO date or null
  progress: number; // 0 to 100
}

export interface UserProfile {
  syncCode: string;
  username: string;
  gradeLevel: GradeLevel;
  stats: UserStats;
  unlockedBadgeIds: string[];
  history: QuizResultRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizResultRecord {
  id: string;
  date: string;
  mode: string;
  score: number;
  totalQuestions: number;
  categoryBreakdown: Partial<Record<ConjunctionCategory, { answered: number; correct: number }>>;
}

export interface AIPersonalizedFeedback {
  strengths: string[];
  weaknesses: string[];
  overallSummary: string;
  recommendedFocus: ConjunctionCategory;
  microLesson: {
    title: string;
    explanation: string;
    ruleHighlight: string;
    example: string;
  };
  tips: string[];
  motivationalQuote: string;
}
