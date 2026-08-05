import React, { useState } from 'react';
import { BookOpen, Check, Languages, Search, Sparkles, Volume2, Zap } from 'lucide-react';
import { CONJUNCTION_RULES } from '../data/conjunctionData';
import { ConjunctionCategory } from '../types';
import { AIWordExplainerModal } from './AIWordExplainerModal';

interface RulesReferenceProps {
  onPracticeCategory: (category: ConjunctionCategory) => void;
}

export const RulesReference: React.FC<RulesReferenceProps> = ({ onPracticeCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);
  const [explainerTarget, setExplainerTarget] = useState<{
    word: string;
    category: string;
    ruleDescription: string;
  } | null>(null);

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      setSpeakingWord(text);
      utterance.onend = () => setSpeakingWord(null);
      utterance.onerror = () => setSpeakingWord(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredRules = CONJUNCTION_RULES.filter((rule) => {
    const matchesCategory = selectedCategory === 'all' || rule.category === selectedCategory;
    const matchesSearch =
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.commonWords.some((w) => w.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 text-[#1E293B] shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1E293B]">Conjunction Rule Handbook</h2>
        </div>
        <p className="text-slate-500 text-sm max-w-2xl">
          Learn the core conjunction rules with clear examples, punctuation guidelines, and memory tips.
          <strong className="text-indigo-600 font-semibold block mt-1">
            ✨ Click any conjunction word below to launch the AI Word Explainer with contextual Spanish translations, similarities, and differences!
          </strong>
        </p>

        {/* Search Bar */}
        <div className="mt-6 relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conjunctions (e.g., 'although', 'either', 'FANBOYS')..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[#1E293B] placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          All Categories ({CONJUNCTION_RULES.length})
        </button>
        <button
          onClick={() => setSelectedCategory('coordinating')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            selectedCategory === 'coordinating'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          Coordinating (FANBOYS)
        </button>
        <button
          onClick={() => setSelectedCategory('subordinating')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            selectedCategory === 'subordinating'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          Subordinating
        </button>
        <button
          onClick={() => setSelectedCategory('correlative')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            selectedCategory === 'correlative'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          Correlative Pairs
        </button>
        <button
          onClick={() => setSelectedCategory('conjunctive_adverb')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            selectedCategory === 'conjunctive_adverb'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          Conjunctive Adverbs
        </button>
      </div>

      {/* Rule Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-5 hover:border-slate-200 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-lg text-[#1E293B]">{rule.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                  {rule.category.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {rule.description}
              </p>

              {/* Common Words Chips */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Common Conjunctions
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-600 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Click word for AI Spanish comparison
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {rule.commonWords.map((word, wIdx) => (
                    <div
                      key={wIdx}
                      onClick={() =>
                        setExplainerTarget({
                          word,
                          category: rule.category,
                          ruleDescription: rule.description,
                        })
                      }
                      title={`Click to open AI Explainer (English & Spanish) for "${word}"`}
                      className="group cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 font-bold text-xs border border-slate-200/80 hover:border-indigo-200 transition-all shadow-2xs hover:shadow-xs"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-500 group-hover:scale-110 transition-transform" />
                      <span>{word}</span>
                      <button
                        onClick={(e) => handleSpeak(e, word)}
                        title="Listen to pronunciation"
                        className="p-0.5 rounded-md hover:bg-indigo-100 text-slate-400 group-hover:text-indigo-600 transition-colors ml-0.5"
                      >
                        <Volume2
                          className={`w-3 h-3 ${
                            speakingWord === word ? 'animate-ping text-indigo-600' : ''
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example Sentences */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Sentence Examples
                </span>
                <div className="space-y-2">
                  {rule.examples.map((eg, eIdx) => (
                    <div
                      key={eIdx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium flex items-start gap-2"
                    >
                      <button
                        onClick={() => handleSpeak(eg)}
                        className="mt-0.5 text-slate-400 hover:text-indigo-600 shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <span>{eg}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Punctuation Tip */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Punctuation Rule
                </div>
                <p className="font-medium text-amber-950">{rule.tips}</p>
              </div>
            </div>

            {/* Practice Button */}
            <button
              onClick={() => onPracticeCategory(rule.category)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Practice {rule.name.split(' ')[0]} Questions</span>
            </button>
          </div>
        ))}
      </div>

      {/* AI Word Explainer Modal */}
      {explainerTarget && (
        <AIWordExplainerModal
          word={explainerTarget.word}
          category={explainerTarget.category}
          ruleDescription={explainerTarget.ruleDescription}
          onClose={() => setExplainerTarget(null)}
        />
      )}
    </div>
  );
};
