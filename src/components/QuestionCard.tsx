import React from 'react';
import { Question } from '../data/questions.ts';
import { Bookmark, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio.ts';

interface QuestionCardProps {
  question: Question;
  selectedOptionIndex?: number;
  onSelectOption: (questionId: number, optionIndex: number) => void;
  onClearOption: (questionId: number) => void;
  isFlagged: boolean;
  onToggleFlag: (questionId: number) => void;
}

const OPTION_PREFIXES = ['ক', 'খ', 'গ', 'ঘ'];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionIndex,
  onSelectOption,
  onClearOption,
  isFlagged,
  onToggleFlag
}) => {
  const isAnswered = selectedOptionIndex !== undefined;

  return (
    <div 
      id={`q-${question.id}`}
      className={`bg-white rounded-xl border transition-all duration-150 p-5 sm:p-6 ${
        isFlagged 
          ? 'border-amber-300 ring-1 ring-amber-200 shadow-sm' 
          : isAnswered
          ? 'border-indigo-200/80 shadow-sm'
          : 'border-slate-200 shadow-xs'
      }`}
    >
      {/* Question Header & Controls */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-500 font-english">
            <span className="font-semibold text-indigo-700">Question {question.id} of 50</span>
            {question.topic && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-bengali text-slate-600">{question.topic}</span>
              </>
            )}
            {isFlagged && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-600 font-medium font-bengali flex items-center gap-1">
                  বুকমার্ক করা
                </span>
              </>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed font-bengali">
            {question.question}
          </h3>
        </div>

        {/* Flag and Clear Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onToggleFlag(question.id)}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              isFlagged 
                ? 'bg-amber-50 text-amber-700 border-amber-300' 
                : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-50'
            }`}
            title={isFlagged ? 'Remove flag' : 'Flag for review'}
            aria-label="Flag Question"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span className="hidden sm:inline text-xs font-bengali">বুকমার্ক</span>
          </button>

          {isAnswered && (
            <button
              type="button"
              onClick={() => {
                onClearOption(question.id);
                soundManager.playSelect();
              }}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title="উত্তর মুছে ফেলুন (নেগেটিভ মার্কিং এড়াতে)"
              aria-label="Clear Selection"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs font-bengali">ক্লিয়ার</span>
            </button>
          )}
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {question.options.map((opt, idx) => {
          const isSelected = selectedOptionIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onSelectOption(question.id, idx);
                soundManager.playSelect();
              }}
              className={`w-full text-left p-3.5 rounded-xl border text-sm font-bengali transition-all duration-150 flex items-start gap-3 cursor-pointer group ${
                isSelected
                  ? 'bg-indigo-50/80 border-indigo-600 text-indigo-950 font-medium shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50/80 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold font-bengali transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-slate-100 border-slate-300 text-slate-600 group-hover:border-indigo-400 group-hover:text-indigo-600'
                }`}
              >
                {OPTION_PREFIXES[idx]}
              </div>
              <span className="pt-0.5 flex-1 leading-snug">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
