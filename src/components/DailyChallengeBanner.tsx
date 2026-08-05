import React from 'react';
import { Award, CheckCircle2, Flame, Sparkles, Target, Zap } from 'lucide-react';
import { UserProfile } from '../types';

interface DailyChallengeBannerProps {
  profile: UserProfile;
  onStartDailyChallenge: () => void;
  onStartAdaptiveAI: () => void;
}

export const DailyChallengeBanner: React.FC<DailyChallengeBannerProps> = ({
  profile,
  onStartDailyChallenge,
  onStartAdaptiveAI,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = profile.stats.dailyChallengeCompletedDate === today;

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between space-y-6">
      {/* Background Subtle Icon Accent */}
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none hidden sm:block text-indigo-600">
        <Zap className="w-48 h-48" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
            Daily Challenge
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>{profile.stats.streakDays} Day Streak</span>
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] leading-tight max-w-xl">
          Mastering Conjunction Dynamics
        </h2>

        <p className="text-slate-500 text-sm max-w-lg leading-relaxed">
          Learn how to use coordinating, subordinating, correlative, and adverbial conjunctions to construct refined, high-level sentences.
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
          <span className="flex items-center gap-1.5 text-slate-700">
            <Target className="w-4 h-4 text-indigo-600" /> 5 Daily Questions
          </span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <Award className="w-4 h-4 text-amber-500" /> +50 XP Reward
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex flex-wrap items-center gap-3 pt-2">
        {isCompletedToday ? (
          <div className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Quest Completed Today!</span>
          </div>
        ) : (
          <button
            onClick={onStartDailyChallenge}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Start Daily Challenge</span>
          </button>
        )}

        <button
          onClick={onStartAdaptiveAI}
          className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 px-6 py-3.5 rounded-2xl font-bold text-xs transition-colors"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>AI Adaptive Practice</span>
        </button>
      </div>
    </div>
  );
};

