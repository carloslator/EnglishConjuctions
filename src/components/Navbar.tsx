import React from 'react';
import { Award, BookOpen, Flame, RefreshCw, Sparkles, Zap } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  profile: UserProfile;
  activeTab: 'practice' | 'rules' | 'ai_feedback' | 'badges' | 'sync';
  setActiveTab: (tab: 'practice' | 'rules' | 'ai_feedback' | 'badges' | 'sync') => void;
  isSyncing: boolean;
  onOpenSync: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  activeTab,
  setActiveTab,
  isSyncing,
  onOpenSync,
}) => {
  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200/80 flex-col shrink-0 h-screen sticky top-0 z-30">
        {/* Logo Branding */}
        <div className="p-8 pb-6">
          <div
            onClick={() => setActiveTab('practice')}
            className="cursor-pointer group flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              C.
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-indigo-600">
                Conjoint.
              </span>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-1">
                Grammar AI
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto py-2">
          <button
            onClick={() => setActiveTab('practice')}
            className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'practice'
                ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Zap className={`w-5 h-5 mr-3 ${activeTab === 'practice' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span>Daily Exercises</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'rules'
                ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BookOpen className={`w-5 h-5 mr-3 ${activeTab === 'rules' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span>Rule Handbook</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_feedback')}
            className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'ai_feedback'
                ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Sparkles className={`w-5 h-5 mr-3 ${activeTab === 'ai_feedback' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span>AI Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'badges'
                ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Award className={`w-5 h-5 mr-3 ${activeTab === 'badges' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span>Badge Gallery</span>
            <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {profile.unlockedBadgeIds.length}
            </span>
          </button>
        </nav>

        {/* Sidebar Footer Card - Device Sync */}
        <div className="p-4 border-t border-slate-100">
          <div
            onClick={onOpenSync}
            className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl p-4 text-white cursor-pointer transition-colors shadow-sm space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                Cloud Sync
              </span>
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-200 ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            </div>
            <div className="text-sm font-bold flex items-center justify-between">
              <span>Sync Active</span>
              <span className="font-mono text-xs text-amber-300 font-extrabold">{profile.syncCode}</span>
            </div>
            <p className="text-[11px] text-indigo-100 font-medium leading-tight">
              Tap to link mobile, tablet or PC
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile / Tablet Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div
            onClick={() => setActiveTab('practice')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
              C.
            </div>
            <span className="text-xl font-bold tracking-tight text-indigo-600">
              Conjoint.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 text-orange-600 font-bold text-xs border border-orange-200/60">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{profile.stats.streakDays}d</span>
            </div>

            <button
              onClick={onOpenSync}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="font-mono text-[11px]">{profile.syncCode}</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="flex items-center justify-around pt-1 border-t border-slate-100 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg ${
              activeTab === 'practice' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Exercises</span>
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg ${
              activeTab === 'rules' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Rules</span>
          </button>
          <button
            onClick={() => setActiveTab('ai_feedback')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg ${
              activeTab === 'ai_feedback' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Insights</span>
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg ${
              activeTab === 'badges' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Badges</span>
          </button>
        </div>
      </header>
    </>
  );
};

