import React, { useState } from 'react';
import { Award, Bot, Brain, CheckCircle2, Lightbulb, RefreshCw, Sparkles, Target, Zap } from 'lucide-react';
import { AIPersonalizedFeedback, UserProfile } from '../types';

interface AIPersonalizedFeedbackViewProps {
  profile: UserProfile;
  onLaunchAdaptivePractice: (category?: string) => void;
}

export const AIPersonalizedFeedbackView: React.FC<AIPersonalizedFeedbackViewProps> = ({
  profile,
  onLaunchAdaptivePractice,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<AIPersonalizedFeedback | null>(null);

  const stats = profile.stats.categoryStats;

  const getAccuracy = (correct: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  const categories = [
    { key: 'coordinating', name: 'Coordinating (FANBOYS)', stats: stats.coordinating },
    { key: 'subordinating', name: 'Subordinating', stats: stats.subordinating },
    { key: 'correlative', name: 'Correlative Pairs', stats: stats.correlative },
    { key: 'conjunctive_adverb', name: 'Conjunctive Adverbs', stats: stats.conjunctive_adverb },
  ];

  const handleGenerateFeedback = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/ai/personalized-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: profile.stats,
          history: profile.history,
          gradeLevel: profile.gradeLevel,
        }),
      });
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error('Failed to generate feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 text-[#1E293B] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Learning Diagnostics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B] tracking-tight">
              Grammar Performance Engine
            </h2>
            <p className="text-slate-500 text-sm max-w-xl">
              Gemini AI evaluates your response patterns across conjunction types to pinpoint your accuracy and build custom micro-lessons tailored for you.
            </p>
          </div>

          <button
            onClick={handleGenerateFeedback}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all shrink-0"
          >
            <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Analyzing Profile...' : 'Analyze Learning Patterns'}</span>
          </button>
        </div>
      </div>

      {/* Category Performance Breakdown Grid */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-[#1E293B] flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" /> Category Performance
          </h3>
          <span className="text-xs font-bold text-slate-400">
            Total Answered: {profile.stats.totalAnswered}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const acc = getAccuracy(cat.stats.correct, cat.stats.answered);
            return (
              <div
                key={cat.key}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#1E293B]">
                  <span className="truncate">{cat.name}</span>
                  <span className="text-indigo-600 font-bold">{acc}%</span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${acc}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-400 font-medium flex justify-between">
                  <span>Correct: {cat.stats.correct}</span>
                  <span>Total: {cat.stats.answered}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Diagnostic Report */}
      {loading && (
        <div className="bg-white rounded-[32px] p-12 text-center shadow-sm border border-slate-100 space-y-4">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-[#1E293B] text-base">Gemini AI is analyzing your response history...</p>
          <p className="text-xs text-slate-400">Evaluating clause relationships and sentence connectors.</p>
        </div>
      )}

      {!loading && feedback && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary Banner */}
          <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-indigo-700 text-sm">
              <Bot className="w-5 h-5 text-indigo-600" />
              <span>AI Assessment Summary</span>
            </div>
            <p className="text-[#1E293B] text-sm leading-relaxed font-semibold">
              "{feedback.overallSummary}"
            </p>
            {feedback.motivationalQuote && (
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/60 text-xs italic text-indigo-800 font-medium">
                🌟 "{feedback.motivationalQuote}"
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 font-bold text-emerald-700 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Strengths Identified
              </div>
              <ul className="space-y-2.5">
                {feedback.strengths.map((s, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 font-medium flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to Focus */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 font-bold text-amber-700 text-sm">
                <Brain className="w-5 h-5 text-amber-600" /> Target Focus Areas
              </div>
              <ul className="space-y-2.5">
                {feedback.weaknesses.map((w, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs text-amber-950 font-medium flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tailored Micro-Lesson */}
          <div className="bg-white rounded-[32px] p-6 sm:p-8 text-[#1E293B] shadow-sm space-y-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-amber-600 text-sm">
                <Lightbulb className="w-5 h-5 text-amber-500" /> Tailored Micro-Lesson
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Focus: {feedback.recommendedFocus}
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#1E293B]">{feedback.microLesson.title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">
              {feedback.microLesson.explanation}
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <div className="font-bold text-indigo-600">Memory Hack:</div>
              <div className="font-semibold text-[#1E293B]">{feedback.microLesson.ruleHighlight}</div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-indigo-700">Relatable Example:</div>
              <div className="italic font-medium">{feedback.microLesson.example}</div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onLaunchAdaptivePractice(feedback.recommendedFocus)}
                className="flex items-center gap-2 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Launch Practice on {feedback.recommendedFocus.replace('_', ' ')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !feedback && (
        <div className="bg-white rounded-[32px] p-10 text-center shadow-sm border border-slate-100 space-y-3">
          <Bot className="w-10 h-10 text-indigo-600 mx-auto" />
          <h4 className="font-bold text-[#1E293B] text-base">Ready for your AI Learning Audit?</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Analyze Learning Patterns" above to let Gemini AI review your answers and prepare a custom grammar report.
          </p>
        </div>
      )}
    </div>
  );
};
