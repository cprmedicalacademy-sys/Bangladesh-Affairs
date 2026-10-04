import React, { useState } from 'react';
import { Question } from '../data/questions.ts';
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, RotateCcw, BookOpen, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio.ts';

interface PracticeModeProps {
  questions: Question[];
  onStartExam: () => void;
  presetQuestionIds?: number[];
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  questions,
  onStartExam,
  presetQuestionIds
}) => {
  const activeQuestions = presetQuestionIds && presetQuestionIds.length > 0
    ? questions.filter((q) => presetQuestionIds.includes(q.id))
    : questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());

  const currentQ = activeQuestions[currentIndex];
  const userChoice = selectedAnswers[currentQ?.id];
  const isRevealed = revealedAnswers.has(currentQ?.id);

  const handleSelectOption = (optIdx: number) => {
    soundManager.playSelect();
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
    setRevealedAnswers((prev) => new Set(prev).add(currentQ.id));
  };

  const handleResetCurrent = () => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQ.id];
      return next;
    });
    setRevealedAnswers((prev) => {
      const next = new Set(prev);
      next.delete(currentQ.id);
      return next;
    });
  };

  if (!currentQ) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <p className="text-slate-500 font-bengali">কোনো প্রশ্ন পাওয়া যায়নি।</p>
        <button
          onClick={onStartExam}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm"
        >
          পরীক্ষা দিন
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-semibold font-english">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Self-Paced Practice Mode</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-bengali mt-0.5">
            অনুশীলন ও প্রশ্নব্যাংক প্রস্তুতি
          </h2>
          <p className="text-xs text-slate-500 font-bengali">
            এখানে কোনো টাইমার নেই। প্রতিটি প্রশ্নের উত্তর দিয়ে সাথে সাথে ব্যাখ্যা দেখতে পারবেন।
          </p>
        </div>

        <button
          onClick={onStartExam}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold font-bengali shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          লাইভ পরীক্ষা শুরু করুন
        </button>
      </div>

      {/* Progress & Pagination */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-600">
        <span className="font-bengali">
          প্রশ্ন <strong className="text-indigo-900 font-mono-numbers">{currentIndex + 1}</strong> / {activeQuestions.length}
        </span>
        <div className="flex items-center gap-1 font-mono-numbers">
          <span>মোট দেখা হয়েছে: {Object.keys(selectedAnswers).length}</span>
        </div>
      </div>

      {/* Active Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs text-slate-400 font-english mb-1">
            Question #{currentQ.id} {currentQ.topic ? `· ${currentQ.topic}` : ''}
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-slate-900 leading-relaxed font-bengali">
            {currentQ.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, idx) => {
            const isSelected = userChoice === idx;
            const isCorrect = currentQ.answer === idx;
            let optStyle = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50';

            if (isRevealed) {
              if (isCorrect) {
                optStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium ring-1 ring-emerald-400';
              } else if (isSelected && !isCorrect) {
                optStyle = 'border-rose-400 bg-rose-50/70 text-rose-950 ring-1 ring-rose-300';
              } else {
                optStyle = 'border-slate-200 bg-slate-50/50 text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border text-sm font-bengali transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
              >
                <span>{opt}</span>
                {isRevealed && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                )}
                {isRevealed && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Block (reveals on answer) */}
        {isRevealed && (
          <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-4 space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 font-bengali">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>সঠিক উত্তর: {currentQ.options[currentQ.answer]}</span>
            </div>
            {currentQ.explanation && (
              <p className="text-xs text-slate-600 font-bengali leading-relaxed">
                {currentQ.explanation}
              </p>
            )}
          </div>
        )}

        {/* Question Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>পূর্ববর্তী</span>
          </button>

          {isRevealed && (
            <button
              type="button"
              onClick={handleResetCurrent}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>পুনরায় চেষ্টা</span>
            </button>
          )}

          <button
            type="button"
            disabled={currentIndex === activeQuestions.length - 1}
            onClick={() => setCurrentIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>পরবর্তী</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
