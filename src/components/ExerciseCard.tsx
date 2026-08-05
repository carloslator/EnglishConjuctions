import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, Bot, CheckCircle2, HelpCircle, Sparkles, XCircle, Zap } from 'lucide-react';
import { Question } from '../types';

interface ExerciseCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean, selectedAnswer: string) => void;
  onNextQuestion: () => void;
  onAskAITutor: (question: Question, userAnswer: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  onNextQuestion,
  onAskAITutor,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [question?.id, questionIndex]);

  const handleSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;

    setIsSubmitted(true);
    const isCorrect = selectedOption.toLowerCase() === question.correctAnswer.toLowerCase();

    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    onAnswer(isCorrect, selectedOption);
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'coordinating':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'subordinating':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
      case 'correlative':
        return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'conjunctive_adverb':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200/60';
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
      {/* Exercise Progress Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border capitalize ${getCategoryBadgeColor(
              question.category
            )}`}
          >
            {question.category.replace('_', ' ')}
          </span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 uppercase tracking-wider border border-slate-200/60">
            {question.type.replace('_', ' ')}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Prompt */}
      <div className="space-y-3">
        {question.clauses && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-700">
            <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Clause Combination:</div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 shadow-xs">{question.clauses.clauseA}</span>
              <span className="font-bold text-indigo-600">+</span>
              <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 shadow-xs">{question.clauses.clauseB}</span>
            </div>
          </div>
        )}

        <h3 className="text-lg sm:text-xl font-bold text-[#1E293B] leading-snug">
          {question.prompt}
        </h3>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrectAnswer = option.toLowerCase() === question.correctAnswer.toLowerCase();

          let btnClass =
            'border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50 text-[#1E293B]';

          if (isSelected && !isSubmitted) {
            btnClass = 'border-indigo-600 bg-indigo-50/50 text-[#1E293B] font-bold ring-2 ring-indigo-500/10';
          }

          if (isSubmitted) {
            if (isCorrectAnswer) {
              btnClass = 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-bold';
            } else if (isSelected) {
              btnClass = 'border-rose-400 bg-rose-50/70 text-rose-900 font-bold';
            } else {
              btnClass = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(option)}
              disabled={isSubmitted}
              className={`flex items-center justify-between p-4 rounded-2xl border font-semibold text-sm transition-all text-left ${btnClass}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </div>

              {isSubmitted && isCorrectAnswer && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              {isSubmitted && isSelected && !isCorrectAnswer && (
                <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Submit / Action Bar */}
      {!isSubmitted ? (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`flex items-center gap-2 py-3.5 px-8 rounded-2xl font-bold text-sm shadow-xs transition-all ${
              selectedOption
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Submit Answer</span>
          </button>
        </div>
      ) : (
        /* Answer Feedback Box */
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              {selectedOption?.toLowerCase() === question.correctAnswer.toLowerCase() ? (
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5" /> Correct choice! Excellent job.
                </span>
              ) : (
                <span className="text-rose-700 flex items-center gap-1.5">
                  <XCircle className="w-5 h-5" /> Incorrect. Correct answer: "{question.correctAnswer}".
                </span>
              )}
            </div>

            <button
              onClick={() => onAskAITutor(question, selectedOption || '')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-xs transition-colors border border-slate-200/80 shadow-xs"
            >
              <Bot className="w-4 h-4 text-indigo-600" />
              <span>Ask AI Tutor</span>
              <Sparkles className="w-3 h-3 text-indigo-500" />
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {question.explanation}
          </p>

          <div className="flex justify-end pt-3 border-t border-slate-200/60">
            <button
              onClick={onNextQuestion}
              className="flex items-center gap-2 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.01]"
            >
              <span>{questionIndex + 1 < totalQuestions ? 'Next Question' : 'View Session Results'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
