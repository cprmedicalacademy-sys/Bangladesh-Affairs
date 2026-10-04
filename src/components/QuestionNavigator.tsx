import React from 'react';
import { Send, Bookmark, CheckCircle2, HelpCircle } from 'lucide-react';

interface QuestionNavigatorProps {
  totalQuestions: number;
  userAnswers: Record<number, number>;
  flaggedQuestions: Set<number>;
  currentQuestionId?: number;
  onJumpToQuestion: (id: number) => void;
  onSubmitExam: () => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  totalQuestions,
  userAnswers,
  flaggedQuestions,
  onJumpToQuestion,
  onSubmitExam
}) => {
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 sticky top-20">
      {/* Progress Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-medium mb-1.5">
          <span className="text-slate-600 font-bengali">পরীক্ষার অগ্রগতি</span>
          <span className="font-mono-numbers font-semibold text-indigo-700">
            {answeredCount} / {totalQuestions} ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-1 text-[11px] font-bengali text-slate-600 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-md bg-emerald-600 shrink-0" />
          <span>উত্তরকৃত ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-md bg-amber-400 shrink-0" />
          <span>বুকমার্ক ({flaggedQuestions.size})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-md bg-slate-200 shrink-0" />
          <span>বাকি ({totalQuestions - answeredCount})</span>
        </div>
      </div>

      {/* 50 Question Palette Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-1.5 max-h-[280px] overflow-y-auto pr-1">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => {
          const isAnswered = userAnswers[num] !== undefined;
          const isFlagged = flaggedQuestions.has(num);

          return (
            <button
              key={num}
              type="button"
              onClick={() => onJumpToQuestion(num)}
              className={`h-8 rounded-lg text-xs font-mono-numbers font-semibold transition-all flex items-center justify-center relative cursor-pointer ${
                isFlagged
                  ? 'bg-amber-100 text-amber-900 border border-amber-400 ring-1 ring-amber-300'
                  : isAnswered
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
              title={`Question ${num}: ${isAnswered ? 'Answered' : 'Unanswered'}${isFlagged ? ' (Bookmarked)' : ''}`}
            >
              {num}
              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-1 ring-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Primary Submit Button */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onSubmitExam}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 font-bengali text-sm cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>উত্তরপত্র জমা দিন (Submit)</span>
        </button>
      </div>
    </div>
  );
};
