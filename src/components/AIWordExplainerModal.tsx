import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Volume2, X, Languages, Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AIWordExplanation } from '../types';

interface AIWordExplainerModalProps {
  word: string;
  category: string;
  ruleDescription?: string;
  onClose: () => void;
}

export const AIWordExplainerModal: React.FC<AIWordExplainerModalProps> = ({
  word,
  category,
  ruleDescription,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<AIWordExplanation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchExplanation = async () => {
      try {
        const res = await fetch('/api/ai/word-explainer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word, category, ruleDescription }),
        });

        if (!res.ok) {
          throw new Error('Server error fetching AI word comparison.');
        }

        const result = await res.json();
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Failed to load word explainer:', err);
        if (isMounted) {
          // Provide fallback analysis
          setData({
            word,
            category: category.replace('_', ' '),
            spanishTranslation: getFallbackTranslation(word),
            englishExample: getFallbackEnglishExample(word),
            spanishExample: getFallbackSpanishExample(word),
            similarities: `Both English "${word}" and its Spanish translation connect clauses or ideas to show relationships like cause, contrast, addition, or condition.`,
            differences: `In English, "${word}" follows strict clause punctuation rules (e.g. commas for introductory clauses). In Spanish, subjunctive verb forms may be required after certain contrast or conditional connectors.`,
            memoryHack: `Associate "${word}" with its direct Spanish equivalent to remember its logical function quickly!`,
          });
          setLoading(false);
        }
      }
    };

    fetchExplanation();

    return () => {
      isMounted = false;
    };
  }, [word, category, ruleDescription]);

  const speak = (text: string, lang: 'en-US' | 'es-ES' = 'en-US') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      setSpeakingText(text);
      utterance.onend = () => setSpeakingText(null);
      utterance.onerror = () => setSpeakingText(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-white p-6 border-b border-slate-100 text-[#1E293B] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-[#1E293B] capitalize">{word}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                  {category.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Bilingual AI Analysis (English vs. Spanish)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {loading ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-indigo-600 animate-pulse">
                  Analyzing "{word}" with Gemini AI...
                </p>
                <p className="text-[11px] text-slate-400">Comparing English grammar rules with Spanish equivalents</p>
              </div>
            </div>
          ) : data ? (
            <>
              {/* Spanish Translation Banner */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-indigo-900/60 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    <span>Spanish Translation</span>
                  </div>
                  <div className="text-base font-bold text-indigo-950 flex items-center gap-2">
                    <span>{data.spanishTranslation}</span>
                  </div>
                </div>
                <button
                  onClick={() => speak(data.spanishTranslation, 'es-ES')}
                  className="p-2.5 rounded-xl bg-white hover:bg-indigo-100 text-indigo-700 shadow-xs border border-indigo-200/60 transition-colors flex items-center gap-1.5 font-bold text-[11px]"
                  title="Listen to Spanish pronunciation"
                >
                  <Volume2 className={`w-4 h-4 ${speakingText === data.spanishTranslation ? 'animate-ping text-indigo-600' : ''}`} />
                  <span>Escuchar</span>
                </button>
              </div>

              {/* Contextual Examples Comparison */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Contextual Sentence Comparison
                </div>
                
                {/* English Example */}
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-indigo-600">
                    <span className="flex items-center gap-1.5">
                      <span className="text-sm">🇬🇧</span> English Context
                    </span>
                    <button
                      onClick={() => speak(data.englishExample, 'en-US')}
                      className="text-slate-400 hover:text-indigo-600 p-1"
                      title="Listen in English"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-[#1E293B] font-medium leading-relaxed">{data.englishExample}</p>
                </div>

                {/* Spanish Example */}
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-600">
                    <span className="flex items-center gap-1.5">
                      <span className="text-sm">🇪🇸</span> Spanish Context
                    </span>
                    <button
                      onClick={() => speak(data.spanishExample, 'es-ES')}
                      className="text-slate-400 hover:text-emerald-600 p-1"
                      title="Listen in Spanish"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-[#1E293B] font-medium leading-relaxed">{data.spanishExample}</p>
                </div>
              </div>

              {/* Similarities Grid Section */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Grammar Similarities (Semejanzas)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {data.similarities}
                </p>
              </div>

              {/* Differences Grid Section */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                  <Languages className="w-4 h-4 text-amber-600" />
                  <span>Key Differences & Pitfalls (Diferencias)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {data.differences}
                </p>
              </div>

              {/* Memory Hack */}
              <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-1.5">
                <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Bilingual Memory Hack</span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {data.memoryHack}
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            onClick={() => speak(word, 'en-US')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200/80 transition-colors flex items-center gap-1.5"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Pronounce "{word}"</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper fallbacks for instant offline or fallback state
function getFallbackTranslation(word: string): string {
  const map: Record<string, string> = {
    'And': 'y / e',
    'But': 'pero / sin embargo',
    'For': 'porque / ya que',
    'Nor': 'ni',
    'Or': 'o / u',
    'Yet': 'sin embargo / aún así',
    'So': 'así que / por lo tanto',
    'Because': 'porque / debido a que',
    'Although': 'aunque / a pesar de que',
    'Unless': 'a menos que / a no ser que',
    'Since': 'puesto que / desde que',
    'While': 'mientras / mientras que',
    'After': 'después de que',
    'Before': 'antes de que',
    'Until': 'hasta que',
    'Provided that': 'siempre y cuando / con tal de que',
    'Either...or': 'o... o',
    'Neither...nor': 'ni... ni',
    'Both...and': 'tanto... como',
    'Not only...but also': 'no solo... sino también',
    'Whether...or': 'ya sea... o',
    'However': 'sin embargo / no obstante',
    'Therefore': 'por lo tanto / por consiguiente',
    'Meanwhile': 'mientras tanto',
    'Furthermore': 'además / es más',
    'Consequently': 'por lo tanto / en consecuencia',
    'Otherwise': 'de lo contrario / si no',
    'In addition': 'además / en adición',
  };
  return map[word] || map[word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()] || 'Traducción equivalente en español';
}

function getFallbackEnglishExample(word: string): string {
  const map: Record<string, string> = {
    'And': 'Leo plays soccer AND Sam plays basketball.',
    'But': 'She wanted to swim, BUT the pool was closed.',
    'Because': 'BECAUSE it was raining, we stayed indoors.',
    'Although': 'ALTHOUGH it was cold, they went for a walk.',
    'Either...or': 'EITHER eat your salad, OR leave it for dinner.',
    'However': 'The rain was heavy; HOWEVER, we finished the match.',
  };
  return map[word] || `We used "${word}" to combine ideas in this sentence.`;
}

function getFallbackSpanishExample(word: string): string {
  const map: Record<string, string> = {
    'And': 'Leo juega fútbol Y Sam juega baloncesto.',
    'But': 'Ella quería nadar, PERO la piscina estaba cerrada.',
    'Because': 'PORQUE estaba lloviendo, nos quedamos adentro.',
    'Although': 'AUNQUE hacía frío, salieron a caminar.',
    'Either...or': 'O te comes la ensalada, O la dejas para la cena.',
    'However': 'La lluvia era fuerte; SIN EMBARGO, terminamos el partido.',
  };
  return map[word] || `Usamos la traducción correspondiente en español para conectar ideas.`;
}
