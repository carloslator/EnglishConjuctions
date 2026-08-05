import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, BookOpen, Bot, CheckCircle2, Flame, RefreshCw, RotateCcw, Sparkles, Target, Trophy, Zap } from 'lucide-react';
import { AIPersonalizedFeedbackView } from './components/AIPersonalizedFeedbackView';
import { AITutorModal } from './components/AITutorModal';
import { BadgesView } from './components/BadgesView';
import { DailyChallengeBanner } from './components/DailyChallengeBanner';
import { DeviceSyncModal } from './components/DeviceSyncModal';
import { ExerciseCard } from './components/ExerciseCard';
import { Navbar } from './components/Navbar';
import { RulesReference } from './components/RulesReference';
import { DEFAULT_QUESTIONS, INITIAL_BADGES } from './data/conjunctionData';
import { Badge, ConjunctionCategory, Question, QuizResultRecord, UserProfile } from './types';
import { calculateLevel, checkBadges, loadLocalProfile, saveLocalProfile, syncProfileToCloud } from './utils/storage';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => loadLocalProfile());
  const [activeTab, setActiveTab] = useState<'practice' | 'rules' | 'ai_feedback' | 'badges' | 'sync'>('practice');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Exercise session state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [exerciseMode, setExerciseMode] = useState<'daily_challenge' | 'category' | 'ai_adaptive' | null>(null);
  const [sessionCategory, setSessionCategory] = useState<ConjunctionCategory | null>(null);
  const [isExerciseFinished, setIsExerciseFinished] = useState<boolean>(false);
  const [isGeneratingAIQuestions, setIsGeneratingAIQuestions] = useState<boolean>(false);

  // Modals state
  const [selectedTutorQuestion, setSelectedTutorQuestion] = useState<{ question: Question; userAnswer: string } | null>(null);
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<Badge[]>([]);

  const currentLevel = calculateLevel(profile.stats.xp);
  const xpInCurrentLevel = profile.stats.xp % 100;

  // Sync profile to cloud on initial load
  useEffect(() => {
    async function initialCloudSync() {
      setIsSyncing(true);
      await syncProfileToCloud(profile);
      setIsSyncing(false);
    }
    initialCloudSync();
  }, []);

  // 1. Start Daily Challenge
  const handleStartDailyChallenge = () => {
    const shuffled = [...DEFAULT_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSessionScore(0);
    setExerciseMode('daily_challenge');
    setSessionCategory(null);
    setIsExerciseFinished(false);
  };

  // 2. Start Category Practice
  const handleStartCategoryPractice = (category: ConjunctionCategory) => {
    const categoryQuestions = DEFAULT_QUESTIONS.filter((q) => q.category === category);
    const setList = categoryQuestions.length >= 4 ? categoryQuestions : [...DEFAULT_QUESTIONS].filter((q) => q.category === category || Math.random() > 0.5).slice(0, 5);
    
    setQuestions(setList);
    setCurrentQuestionIndex(0);
    setSessionScore(0);
    setExerciseMode('category');
    setSessionCategory(category);
    setIsExerciseFinished(false);
    setActiveTab('practice');
  };

  // 3. Start AI Adaptive Question Practice
  const handleStartAIAdaptivePractice = async (categoryFocus?: string) => {
    try {
      setIsGeneratingAIQuestions(true);
      const targetCat = categoryFocus || 'subordinating';

      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: targetCat,
          count: 4,
          gradeLevel: profile.gradeLevel,
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        setQuestions([...DEFAULT_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 4));
      }

      setCurrentQuestionIndex(0);
      setSessionScore(0);
      setExerciseMode('ai_adaptive');
      setSessionCategory((targetCat as ConjunctionCategory) || 'subordinating');
      setIsExerciseFinished(false);
      setActiveTab('practice');
    } catch (err) {
      console.error('Failed to generate AI practice set:', err);
      setQuestions([...DEFAULT_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 4));
      setExerciseMode('ai_adaptive');
      setIsExerciseFinished(false);
      setActiveTab('practice');
    } finally {
      setIsGeneratingAIQuestions(false);
    }
  };

  // 4. Process Question Answer
  const handleAnswerQuestion = (isCorrect: boolean, selectedAnswer: string) => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    const updatedProfile = { ...profile };
    updatedProfile.stats.totalAnswered += 1;
    if (isCorrect) {
      updatedProfile.stats.totalCorrect += 1;
      setSessionScore((prev) => prev + 1);
    }

    const cat = currentQ.category;
    if (updatedProfile.stats.categoryStats[cat]) {
      updatedProfile.stats.categoryStats[cat].answered += 1;
      if (isCorrect) {
        updatedProfile.stats.categoryStats[cat].correct += 1;
      }
    }

    saveLocalProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishExerciseSession(sessionScore, questions.length);
    }
  };

  // 5. Finish Exercise Session
  const finishExerciseSession = (finalScore: number, total: number) => {
    setIsExerciseFinished(true);

    const today = new Date().toISOString().split('T')[0];
    const updatedProfile = { ...profile };

    let gainedXP = finalScore * 15;
    if (exerciseMode === 'daily_challenge' && finalScore >= 3) {
      gainedXP += 50;
      updatedProfile.stats.dailyChallengeCompletedDate = today;
    }

    updatedProfile.stats.xp += gainedXP;
    updatedProfile.stats.level = calculateLevel(updatedProfile.stats.xp);

    const record: QuizResultRecord = {
      id: `quiz_${Date.now()}`,
      date: new Date().toISOString(),
      mode: exerciseMode || 'practice',
      score: finalScore,
      totalQuestions: total,
      categoryBreakdown: {},
    };

    updatedProfile.history.push(record);

    const { updatedProfile: badgeProfile, newBadges } = checkBadges(updatedProfile);

    if (newBadges.length > 0) {
      setNewlyUnlockedBadges(newBadges);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }

    saveLocalProfile(badgeProfile);
    setProfile(badgeProfile);

    syncProfileToCloud(badgeProfile);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] font-sans text-[#1E293B] selection:bg-indigo-500 selection:text-white">
      {/* Navigation Sidebar / Header */}
      <Navbar
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSyncing={isSyncing}
        onOpenSync={() => setShowSyncModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
        {/* Top Minimal Header */}
        <header className="px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] tracking-tight">
              Good day, Learner.
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              You're on a <span className="text-orange-500 font-bold">{profile.stats.streakDays} day streak</span>! Keep it up.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Level & XP Meter */}
            <div className="text-right">
              <div className="text-xs font-bold text-[#1E293B]">Level {currentLevel} • {profile.stats.xp} XP</div>
              <div className="w-32 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${xpInCurrentLevel}%` }}
                />
              </div>
            </div>

            {/* Avatar Pill */}
            <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-xs">
              L
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Tab 1: Exercises Dashboard */}
          {activeTab === 'practice' && (
            <div className="space-y-8">
              {/* Daily Challenge Banner */}
              {!exerciseMode && (
                <DailyChallengeBanner
                  profile={profile}
                  onStartDailyChallenge={handleStartDailyChallenge}
                  onStartAdaptiveAI={() => handleStartAIAdaptivePractice()}
                />
              )}

              {/* AI Question Generation Loading State */}
              {isGeneratingAIQuestions && (
                <div className="bg-white rounded-[32px] p-12 text-center shadow-sm border border-slate-100 space-y-4">
                  <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="font-bold text-[#1E293B] text-base">
                    Gemini AI is crafting custom conjunction questions...
                  </p>
                  <p className="text-xs text-slate-500">Generating grade-appropriate sentence connectors & error-spotting exercises.</p>
                </div>
              )}

              {/* Active Exercise View */}
              {!isGeneratingAIQuestions && exerciseMode && !isExerciseFinished && questions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span>Mode: <strong className="text-indigo-600">{exerciseMode.replace('_', ' ')}</strong></span>
                      {sessionCategory && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px]">
                          {sessionCategory.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setExerciseMode(null)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      Exit Exercise
                    </button>
                  </div>

                  <ExerciseCard
                    key={questions[currentQuestionIndex]?.id || `q_${currentQuestionIndex}`}
                    question={questions[currentQuestionIndex]}
                    questionIndex={currentQuestionIndex}
                    totalQuestions={questions.length}
                    onAnswer={handleAnswerQuestion}
                    onNextQuestion={handleNextQuestion}
                    onAskAITutor={(q, ans) => setSelectedTutorQuestion({ question: q, userAnswer: ans })}
                  />
                </div>
              )}

              {/* Exercise Finished Summary View */}
              {!isGeneratingAIQuestions && isExerciseFinished && (
                <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-sm border border-slate-100 text-center space-y-6 max-w-xl mx-auto animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                    <Trophy className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Exercise Completed
                    </span>
                    <h3 className="text-3xl font-bold text-[#1E293B]">
                      You Scored {sessionScore} / {questions.length}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {sessionScore === questions.length
                        ? 'Spotless accuracy! You correctly identified every conjunction.'
                        : 'Great work! Keep practicing to refine your sentence combining skills.'}
                    </p>
                  </div>

                  {/* Rewards Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-around text-xs font-bold text-[#1E293B]">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                      <span>+{sessionScore * 15} XP Earned</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                      <span>{profile.stats.streakDays} Day Streak</span>
                    </div>
                  </div>

                  {/* Action CTAs */}
                  <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                    <button
                      onClick={handleStartDailyChallenge}
                      className="flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Play Another Set</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('ai_feedback')}
                      className="flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                    >
                      <Bot className="w-4 h-4 text-indigo-600" />
                      <span>AI Performance Feedback</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Category Selector Grid when idle */}
              {!exerciseMode && !isGeneratingAIQuestions && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                      Conjunction Categories
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      Select to start practice
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Coordinating */}
                    <div
                      onClick={() => handleStartCategoryPractice('coordinating')}
                      className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 cursor-pointer hover:border-indigo-200 transition-all space-y-4 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        FAN
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-[#1E293B]">Coordinating</h4>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          FANBOYS: For, And, Nor, But, Or, Yet, So.
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-600 pt-2 border-t border-slate-100">
                        <span>Practice Set</span>
                        <Zap className="w-4 h-4 fill-current" />
                      </div>
                    </div>

                    {/* Subordinating */}
                    <div
                      onClick={() => handleStartCategoryPractice('subordinating')}
                      className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 cursor-pointer hover:border-indigo-200 transition-all space-y-4 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        SUB
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-[#1E293B]">Subordinating</h4>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          Because, Although, Unless, Since, While...
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-600 pt-2 border-t border-slate-100">
                        <span>Practice Set</span>
                        <Zap className="w-4 h-4 fill-current" />
                      </div>
                    </div>

                    {/* Correlative */}
                    <div
                      onClick={() => handleStartCategoryPractice('correlative')}
                      className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 cursor-pointer hover:border-indigo-200 transition-all space-y-4 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        PAIR
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-[#1E293B]">Correlative Pairs</h4>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          Either/Or, Neither/Nor, Both/And...
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-600 pt-2 border-t border-slate-100">
                        <span>Practice Set</span>
                        <Zap className="w-4 h-4 fill-current" />
                      </div>
                    </div>

                    {/* Conjunctive Adverbs */}
                    <div
                      onClick={() => handleStartCategoryPractice('conjunctive_adverb')}
                      className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 cursor-pointer hover:border-indigo-200 transition-all space-y-4 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        ADV
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-[#1E293B]">Conjunctive Adverbs</h4>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          However, Therefore, Meanwhile...
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-600 pt-2 border-t border-slate-100">
                        <span>Practice Set</span>
                        <Zap className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Rule Handbook */}
          {activeTab === 'rules' && (
            <RulesReference onPracticeCategory={handleStartCategoryPractice} />
          )}

          {/* Tab 3: AI Personalized Insights */}
          {activeTab === 'ai_feedback' && (
            <AIPersonalizedFeedbackView
              profile={profile}
              onLaunchAdaptivePractice={handleStartAIAdaptivePractice}
            />
          )}

          {/* Tab 4: Performance Badges */}
          {activeTab === 'badges' && <BadgesView profile={profile} />}
        </div>

        {/* Footer */}
        <footer className="mt-auto bg-white border-t border-slate-100 py-6 px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <span>Conjoint. • Clean Minimal Grammar Workspace</span>
            <span>Device Sync Code: <strong className="font-mono text-indigo-600">{profile.syncCode}</strong></span>
          </div>
        </footer>
      </main>

      {/* Modals */}
      {selectedTutorQuestion && (
        <AITutorModal
          question={selectedTutorQuestion.question}
          userAnswer={selectedTutorQuestion.userAnswer}
          onClose={() => setSelectedTutorQuestion(null)}
        />
      )}

      {showSyncModal && (
        <DeviceSyncModal
          profile={profile}
          onProfileUpdated={(updated) => setProfile(updated)}
          onClose={() => setShowSyncModal(false)}
        />
      )}

      {/* Badge Toast */}
      {newlyUnlockedBadges.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E293B] text-white p-5 rounded-2xl shadow-xl border border-slate-700 max-w-sm space-y-1.5 animate-bounce">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
              🏆 Badge Unlocked
            </span>
            <button
              onClick={() => setNewlyUnlockedBadges([])}
              className="text-slate-400 hover:text-white font-bold text-xs"
            >
              ✕
            </button>
          </div>
          <h4 className="font-bold text-sm">{newlyUnlockedBadges[0].title}</h4>
          <p className="text-xs text-slate-300 font-medium">{newlyUnlockedBadges[0].description}</p>
        </div>
      )}
    </div>
  );
}

