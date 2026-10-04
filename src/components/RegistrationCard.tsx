import React, { useState } from 'react';
import { StudentInfo } from '../types.ts';
import { EXAM_METADATA } from '../data/questions.ts';
import { Award, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/audio.ts';
import { CPRLogo } from './CPRLogo.tsx';

interface RegistrationCardProps {
  onStartExam: (info: StudentInfo) => void;
  onStartPractice: () => void;
  initialInfo?: StudentInfo;
}

export const RegistrationCard: React.FC<RegistrationCardProps> = ({
  onStartExam,
  onStartPractice,
  initialInfo
}) => {
  const [name, setName] = useState(initialInfo?.name || '');
  const [roll, setRoll] = useState(initialInfo?.roll || '');
  const [college, setCollege] = useState(initialInfo?.college || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    soundManager.playSelect();
    onStartExam({
      name: name.trim(),
      roll: roll.trim(),
      college: college.trim() || 'Medical Graduate',
      batch: 'Crystal Batch'
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 px-4">
      {/* Academy Crest & Title */}
      <div className="text-center mb-8">
        <div className="inline-block relative">
          <CPRLogo size={108} variant="seal" className="mx-auto mb-3 shadow-lg shadow-indigo-950/10 rounded-full" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-academy">
          CPR MEDICAL ACADEMY
        </h1>
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-indigo-700 font-semibold font-english mt-1">
          <span>SPECIAL BCS CRYSTAL BATCH</span>
          <span aria-hidden="true">·</span>
          <span>SPECIAL EXAMINATION</span>
        </div>
        <p className="text-sm text-slate-600 font-bengali mt-1">
          বিষয়: <strong className="text-slate-900 font-semibold">বাংলাদেশ বিষয়াবলী (সংবিধান, সংসদ ও রাজনৈতিক ইতিহাস)</strong>
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-english">Candidate Registration</h2>
            <p className="text-xs text-slate-500 font-bengali">পরীক্ষায় অংশগ্রহণের জন্য প্রার্থীর তথ্য পূরণ করুন</p>
          </div>
          <div className="text-right text-xs text-slate-500 font-mono-numbers">
            <span className="font-semibold text-indigo-600">৫০ টি প্রশ্ন</span> / ৪৫ মিনিট
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-english">
              Student Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Tanvir Ahmed / ডা. তানভীর আহমেদ"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-sm font-english placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-english">
                Registration No <span className="text-slate-400 text-[10px] lowercase font-normal">(ঐচ্ছিক / না থাকলে খালি রাখুন)</span>
              </label>
              <input
                type="text"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                placeholder="e.g. CPR-2024-082 (না থাকলে দরকার নেই)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-sm font-english placeholder:text-slate-400 font-mono-numbers"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-english">
                Medical College / Hospital <span className="text-slate-400 text-[10px]">(Optional)</span>
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. DMC / SSMC / SOMC"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-sm font-english placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Marking Rules Callout */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 space-y-2 mt-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 font-bengali">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>মূল্যায়ন ও নেগেটিভ মার্কিং পদ্ধতি (Official Marking Scheme):</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 font-bengali pt-1">
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>সঠিক উত্তর: <strong>+১.০ নম্বর</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200/60">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>ভুল উত্তর: <strong>-০.৫ নম্বর</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200/60">
                <Award className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>সময়সীমা: <strong>৪৫ মিনিট</strong></span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-mono-numbers pt-1">
              সূত্র: {EXAM_METADATA.formulaText}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-sm font-bengali text-base cursor-pointer"
            >
              <span>পরীক্ষা শুরু করুন (Start Live Exam)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onStartPractice}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-2.5 px-4 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm font-bengali cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>টাইমার ছাড়া প্র্যাকটিস মোড দেখুন (Practice Mode)</span>
            </button>
          </div>
        </form>
      </div>

      {/* Trust & Academic Note */}
      <div className="text-center mt-6 text-xs text-slate-500 font-bengali">
        CPR Medical Academy · এক্সক্লুসিভ স্পেশাল বিসিএস প্রিপারেশন প্রোগ্রাম
      </div>
    </div>
  );
};
