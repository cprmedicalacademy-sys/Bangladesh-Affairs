import React, { useState } from 'react';
import { Question } from '../data/questions.ts';
import { StudentInfo, ReviewFilter, ExamAttempt } from '../types.ts';
import { 
  Award, CheckCircle2, XCircle, HelpCircle, 
  Printer, RotateCcw, Filter, ChevronDown, ChevronUp, Share2, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CPRLogo } from './CPRLogo.tsx';

interface ResultViewProps {
  attempt: ExamAttempt;
  questions: Question[];
  onRetake: () => void;
  onPracticeMistakes: (wrongIds: number[]) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  attempt,
  questions,
  onRetake,
  onPracticeMistakes
}) => {
  const [filter, setFilter] = useState<ReviewFilter>('all');
  const [showReview, setShowReview] = useState(true);

  // Trigger confetti if high score
  React.useEffect(() => {
    if (attempt.finalScore >= 35) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore
      }
    }
  }, [attempt.finalScore]);

  const wrongQuestionIds = questions
    .filter((q) => {
      const userAns = attempt.answers[q.id];
      return userAns !== undefined && userAns !== q.answer;
    })
    .map((q) => q.id);

  // Filtered questions
  const filteredQuestions = questions.filter((q) => {
    const userAns = attempt.answers[q.id];
    if (filter === 'correct') return userAns === q.answer;
    if (filter === 'incorrect') return userAns !== undefined && userAns !== q.answer;
    if (filter === 'unanswered') return userAns === undefined;
    return true; // 'all'
  });

  const timeFormatted = `${Math.floor(attempt.timeSpentSeconds / 60)} মি. ${attempt.timeSpentSeconds % 60} সে.`;

  // Performance Analysis
  const getPerformanceRemark = (score: number) => {
    if (score >= 40) return { title: 'অসাধারণ প্রস্তুতি! (Outstanding)', desc: 'বিসিএস প্রিলিমিনারির জন্য আপনার প্রস্তুতি অত্যন্ত চমৎকার। এই ধারাবাহিকতা ধরে রাখুন।' };
    if (score >= 32) return { title: 'ভালো ফলাফল! (Very Good)', desc: 'আপনার প্রস্তুতি বেশ ভালো। ভুল উত্তর কমিয়ে নেগেটিভ মার্কিং এড়াতে পারলে আরও এগিয়ে থাকবেন।' };
    if (score >= 25) return { title: 'সন্তোষজনক (Satisfactory)', desc: 'সংবিধান ও রাজনৈতিক ইতিহাসের জটিল ধারাগুলো পুনরায় রিভিশন দেওয়া প্রয়োজন।' };
    return { title: 'অধিক অনুশীলন প্রয়োজন (Needs Revision)', desc: 'ভুল উত্তর বেশি হয়েছে। বিশেষ করে সংবিধানের অনুচ্ছেদগুলো গুরুত্ব দিয়ে রিভিশন দিন।' };
  };

  const remark = getPerformanceRemark(attempt.finalScore);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Printable Scorecard Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 relative overflow-hidden print-area">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-700 via-indigo-600 to-amber-400" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <CPRLogo size={68} variant="seal" className="shadow-xs rounded-full bg-white" />
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 font-english mb-1">
                <span>CPR MEDICAL ACADEMY</span>
                <span aria-hidden="true">·</span>
                <span>CRYSTAL BATCH</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-academy">
                EXAMINATION RESULT SHEET
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-bengali mt-0.5">
                বিষয়: বাংলাদেশ বিষয়াবলী (সংবিধান, সংসদ ও রাজনৈতিক ইতিহাস)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>প্রিন্ট / PDF সেভ</span>
            </button>
            <button
              onClick={onRetake}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>পুনরায় পরীক্ষা দিন</span>
            </button>
          </div>
        </div>

        {/* Candidate Information Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 text-xs mb-8 font-english">
          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Candidate Name</span>
            <strong className="text-slate-900 text-sm">{attempt.student.name}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Registration No</span>
            <strong className="text-slate-900 text-sm font-mono-numbers">
              {attempt.student.roll && attempt.student.roll.trim() && attempt.student.roll !== 'N/A' 
                ? attempt.student.roll 
                : 'N/A'}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Institution</span>
            <strong className="text-slate-900 text-sm">{attempt.student.college || 'Medical Academy'}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Time Taken</span>
            <strong className="text-slate-900 text-sm font-mono-numbers">{timeFormatted}</strong>
          </div>
        </div>

        {/* Primary Score Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Final Score (Dominant Box) */}
          <div className="md:col-span-1 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-2xl p-6 flex flex-col justify-between shadow-md">
            <div>
              <span className="text-xs uppercase tracking-widest text-indigo-300 font-semibold font-english">Final Score</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight font-mono-numbers text-amber-300">
                  {attempt.finalScore.toFixed(2)}
                </span>
                <span className="text-indigo-300 font-english text-sm font-medium">/ 50.00</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-800/80 text-[11px] text-indigo-200 font-bengali">
              [সঠিক MCQ - (ভুল MCQ সংখ্যা × ০.৫)]
            </div>
          </div>

          {/* Detailed Metric Tallies */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800 font-bengali">সঠিক উত্তর</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold font-mono-numbers text-emerald-700">
                  {attempt.correctCount}
                </span>
                <span className="text-[11px] text-emerald-600/80 block mt-0.5">+{attempt.correctCount * 1.0} নম্বর</span>
              </div>
            </div>

            <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-800 font-bengali">ভুল উত্তর</span>
                <XCircle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold font-mono-numbers text-rose-700">
                  {attempt.incorrectCount}
                </span>
                <span className="text-[11px] text-rose-600/80 block mt-0.5">
                  -{attempt.penaltyMarks.toFixed(2)} কাটা হয়েছে
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 font-bengali">ছেড়ে দেওয়া</span>
                <HelpCircle className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold font-mono-numbers text-slate-700">
                  {attempt.unansweredCount}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">০ নেগেটিভ মার্ক</span>
              </div>
            </div>
          </div>
        </div>

        {/* Remark Callout */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 mb-4">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-indigo-950 font-bengali">{remark.title}</h4>
              <p className="text-xs text-indigo-900/80 font-bengali mt-0.5 leading-relaxed">{remark.desc}</p>
            </div>
          </div>
        </div>

        {/* Practice Weak Questions CTA */}
        {wrongQuestionIds.length > 0 && (
          <div className="no-print pt-2">
            <button
              onClick={() => onPracticeMistakes(wrongQuestionIds)}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-bengali">ভুল হওয়া {wrongQuestionIds.length}টি প্রশ্ন প্র্যাকটিস করুন</span>
            </button>
          </div>
        )}
      </div>

      {/* Review Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 font-bengali">
              উত্তরপত্র পর্যালোচনা (Answer Review)
            </h3>
            <span className="text-xs text-slate-500 font-mono-numbers">({filteredQuestions.length})</span>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-medium font-bengali">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সকল (৫০)
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === 'incorrect' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ভুল ({attempt.incorrectCount})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === 'correct' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সঠিক ({attempt.correctCount})
            </button>
            <button
              onClick={() => setFilter('unanswered')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === 'unanswered' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              বাকি ({attempt.unansweredCount})
            </button>
          </div>
        </div>

        {/* Question Review Cards */}
        <div className="space-y-3.5">
          {filteredQuestions.map((q) => {
            const userAns = attempt.answers[q.id];
            const isCorrect = userAns === q.answer;
            const isUnanswered = userAns === undefined;

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border p-5 transition-colors ${
                  isCorrect
                    ? 'border-emerald-200/90'
                    : isUnanswered
                    ? 'border-slate-200'
                    : 'border-rose-200/90'
                }`}
              >
                {/* Question Row */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <p className="text-base font-medium text-slate-900 font-bengali leading-relaxed">
                    {q.question}
                  </p>
                  <div className="shrink-0 text-xs font-semibold font-bengali">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> সঠিক (+১.০)
                      </span>
                    ) : isUnanswered ? (
                      <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <HelpCircle className="w-3.5 h-3.5" /> উত্তর দেননি (০)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" /> ভুল (-০.৫)
                      </span>
                    )}
                  </div>
                </div>

                {/* Answers Comparison Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bengali bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 mb-3">
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-english">
                      Your Answer
                    </span>
                    <div className={userAns !== undefined ? (isCorrect ? 'text-emerald-700 font-medium' : 'text-rose-700 font-medium') : 'text-slate-400 italic'}>
                      {userAns !== undefined ? q.options[userAns] : 'কোনো বিকল্প নির্বাচন করা হয়নি'}
                    </div>
                  </div>

                  <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-3">
                    <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-english">
                      Official Correct Answer
                    </span>
                    <div className="text-emerald-800 font-semibold">
                      {q.options[q.answer]}
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="text-xs text-slate-600 bg-indigo-50/40 rounded-lg p-3 border border-indigo-100/50 font-bengali">
                    <strong className="text-indigo-900 font-semibold">ব্যাখ্যা ও সংবিধানের প্রাসঙ্গিক তথ্য: </strong>
                    <span>{q.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
