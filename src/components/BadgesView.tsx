import React from 'react';
import { Award, Flame, GitCommit, Layers, Lock, Sparkles, Target, Wand2, Zap } from 'lucide-react';
import { INITIAL_BADGES } from '../data/conjunctionData';
import { UserProfile } from '../types';

interface BadgesViewProps {
  profile: UserProfile;
}

export const BadgesView: React.FC<BadgesViewProps> = ({ profile }) => {
  const unlockedSet = new Set(profile.unlockedBadgeIds);

  const getBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = `w-6 h-6 ${isUnlocked ? 'text-amber-500' : 'text-slate-400'}`;
    switch (iconName) {
      case 'Zap':
        return <Zap className={iconClass} />;
      case 'GitCommit':
        return <GitCommit className={iconClass} />;
      case 'Layers':
        return <Layers className={iconClass} />;
      case 'Wand2':
        return <Wand2 className={iconClass} />;
      case 'Flame':
        return <Flame className={iconClass} />;
      case 'Award':
        return <Award className={iconClass} />;
      case 'Target':
        return <Target className={iconClass} />;
      case 'Sparkles':
        return <Sparkles className={iconClass} />;
      default:
        return <Award className={iconClass} />;
    }
  };

  const getProgress = (badgeId: string) => {
    const stats = profile.stats;
    switch (badgeId) {
      case 'fanboys_master':
        return Math.min(100, Math.round((stats.categoryStats.coordinating.correct / 10) * 100));
      case 'subordinate_pro':
        return Math.min(100, Math.round((stats.categoryStats.subordinating.correct / 10) * 100));
      case 'correlative_ace':
        return Math.min(100, Math.round((stats.categoryStats.correlative.correct / 8) * 100));
      case 'adverb_wizard':
        return Math.min(100, Math.round((stats.categoryStats.conjunctive_adverb.correct / 8) * 100));
      case 'streak_3':
        return Math.min(100, Math.round((stats.streakDays / 3) * 100));
      case 'streak_7':
        return Math.min(100, Math.round((stats.streakDays / 7) * 100));
      case 'perfect_100':
        return profile.history.some((h) => h.totalQuestions >= 5 && h.score === h.totalQuestions) ? 100 : 0;
      case 'ai_apprentice':
        return profile.history.some((h) => h.mode === 'ai_adaptive') ? 100 : 0;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 text-[#1E293B] shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#1E293B]">Performance Badges & Trophies</h2>
            <p className="text-slate-500 text-xs">
              Earn achievements as you master conjunction rules, build daily streaks, and achieve perfect exercise scores.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-slate-700">
          <span className="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/60">
            🏆 Unlocked: {profile.unlockedBadgeIds.length} / {INITIAL_BADGES.length} Badges
          </span>
          <span className="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/60">
            ⚡ Total XP: {profile.stats.xp} XP
          </span>
          <span className="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/60">
            🔥 Streak: {profile.stats.streakDays} Days
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {INITIAL_BADGES.map((badge) => {
          const isUnlocked = unlockedSet.has(badge.id);
          const progress = getProgress(badge.id);

          return (
            <div
              key={badge.id}
              className={`rounded-[24px] p-5 border transition-all flex flex-col justify-between space-y-4 ${
                isUnlocked
                  ? 'bg-white border-amber-200/80 shadow-sm hover:border-amber-300'
                  : 'bg-slate-50/60 border-slate-200/60 opacity-80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {getBadgeIcon(badge.icon, isUnlocked)}
                  </div>

                  {isUnlocked ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#1E293B]">{badge.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span>Progress</span>
                  <span className="text-indigo-600 font-bold">{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked ? 'bg-amber-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
