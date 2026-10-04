import React from 'react';
import { Question } from '../data/questions.ts';
import { soundManager } from '../utils/audio.ts';
import { CPRLogo } from './CPRLogo.tsx';

interface OMRSheetProps {
  questions: Question[];
  userAnswers: Record<number, number>;
  onSelectOption: (questionId: number, optionIndex: number) => void;
  onClearOption: (questionId: number) => void;
  flaggedQuestions: Set<number>;
  studentName: string;
  studentRoll: string;
}

const BUBBLES = ['ক', 'খ', 'গ', 'ঘ'];

export const OMRSheet: React.FC<OMRSheetProps> = ({
  questions,
  userAnswers,
  onSelectOption,
  onClearOption,
  flaggedQuestions,
  studentName,
  studentRoll
}) => {
  return (
    <div className="bg-amber-50/50 rounded-2xl border-2 border-slate-300 p-6 sm:p-8 shadow-sm max-w-4xl mx-auto my-4 font-english print-area">
      {/* OMR Sheet Header */}
      <div className="border-b-2 border-slate-700 pb-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <CPRLogo size={52} variant="seal" className="bg-white rounded-full p-0.5 border border-slate-300" />
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Special BCS Examination</span>
              <h2 className="text-xl font-bold font-academy tracking-wide text-slate-900">
                CPR MEDICAL ACADEMY · OMR ANSWER SHEET
              </h2>
              <p className="text-xs text-slate-600 font-bengali">
                বিষয়: বাংলাদেশ বিষয়াবলী (পূর্ণমান: ৫০ | প্রতিটি সঠিক ১.০, ভুল: -০.৫)
              </p>
            </div>
          </div>
          <div className="text-right text-xs bg-white border border-slate-300 p-3 rounded-lg font-mono-numbers">
            <div><span className="text-slate-500">Candidate:</span> <strong>{studentName || 'Candidate'}</strong></div>
            <div><span className="text-slate-500">Reg No:</span> <strong>{studentRoll && studentRoll.trim() && studentRoll !== 'N/A' ? studentRoll : 'N/A'}</strong></div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-300/80 text-[11px] text-slate-500 flex flex-wrap gap-4 font-bengali">
          <span>• সঠিক বৃত্তটি কালো বলপেন দিয়ে সম্পূর্ণ ভরাট করুন।</span>
          <span>• বৃত্তের বাইরে দাগ দেওয়া যাবে না।</span>
          <span>• পূর্বে পূরণ করা বৃত্ত পরিবর্তন করতে চাইলে পুনরায় ক্লিক করে মুছে ফেলা যাবে।</span>
        </div>
      </div>

      {/* 2-column or 3-column OMR Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        {questions.map((q) => {
          const selected = userAnswers[q.id];
          const isFlagged = flaggedQuestions.has(q.id);

          return (
            <div
              key={q.id}
              className={`flex items-center justify-between py-2 px-3 rounded-lg border text-sm transition-colors ${
                isFlagged 
                  ? 'bg-amber-100/70 border-amber-300' 
                  : selected !== undefined 
                  ? 'bg-white border-indigo-200' 
                  : 'bg-white/70 border-slate-200 hover:bg-white'
              }`}
            >
              {/* Question label & tooltip link */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono-numbers text-xs font-bold text-slate-700 w-6">
                  {q.id.toString().padStart(2, '0')}.
                </span>
                <span className="text-xs text-slate-600 font-bengali truncate max-w-[130px] sm:max-w-[170px]" title={q.question}>
                  {q.question.replace(/^\d+\.\s*/, '')}
                </span>
              </div>

              {/* Bubbles: ক, খ, গ, ঘ */}
              <div className="flex items-center gap-1.5 shrink-0">
                {BUBBLES.map((bubble, idx) => {
                  const isFilled = selected === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (isFilled) {
                          onClearOption(q.id);
                        } else {
                          onSelectOption(q.id, idx);
                        }
                        soundManager.playSelect();
                      }}
                      className={`w-7 h-7 rounded-full border-2 text-[11px] font-bold font-bengali flex items-center justify-center transition-all cursor-pointer ${
                        isFilled
                          ? 'bg-slate-900 border-slate-900 text-white shadow-inner scale-105'
                          : 'bg-white border-slate-400 text-slate-700 hover:border-slate-700 hover:bg-slate-100'
                      }`}
                      title={`প্রশ্ন ${q.id}: ${bubble}`}
                      aria-label={`Option ${bubble} for Question ${q.id}`}
                    >
                      {bubble}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
