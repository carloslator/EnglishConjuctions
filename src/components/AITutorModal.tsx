import React, { useEffect, useState } from 'react';
import { Bot, Check, Sparkles, X, Lightbulb } from 'lucide-react';
import { Question } from '../types';

interface AITutorModalProps {
  question: Question;
  userAnswer?: string;
  onClose: () => void;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({ question, userAnswer, onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [explanation, setExplanation] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    async function fetchExplanation() {
      try {
        setLoading(true);
        const res = await fetch('/api/ai/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            promptText: question.prompt,
            correctAnswer: question.correctAnswer,
            userChoice: userAnswer || 'Not answered yet',
            category: question.category,
          }),
        });
        const data = await res.json();
        if (isMounted) {
          setExplanation(data.explanation || question.explanation);
        }
      } catch (err) {
        if (isMounted) {
          setExplanation(question.explanation);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchExplanation();
    return () => {
      isMounted = false;
    };
  }, [question, userAnswer]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-lg border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-white p-5 border-b border-slate-100 text-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-1.5 text-[#1E293B]">
                AI Grammar Tutor
                <Sparkles className="w-4 h-4 text-indigo-500" />
              </h3>
              <p className="text-xs text-slate-400 font-medium">Step-by-step breakdown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
            <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Target Question</div>
            <p className="font-bold text-[#1E293B] text-sm leading-relaxed">{question.prompt}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-bold text-[11px] flex items-center gap-1">
                <Check className="w-3 h-3" /> Correct: {question.correctAnswer}
              </span>
              {userAnswer && userAnswer !== question.correctAnswer && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 font-bold text-[11px]">
                  Your choice: {userAnswer}
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-indigo-600 font-semibold animate-pulse">
                Consulting AI Tutor...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#1E293B] font-bold text-sm">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Tutor Insights</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 text-xs leading-relaxed whitespace-pre-line font-medium">
                {explanation}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Got It, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
