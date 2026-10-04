import React from 'react';
import { AlertCircle, CheckCircle2, Bookmark, HelpCircle } from 'lucide-react';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalQuestions: number;
  answeredCount: number;
  flaggedCount: number;
  timeLeftFormatted: string;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalQuestions,
  answeredCount,
  flaggedCount,
  timeLeftFormatted
}) => {
  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-7">
        <div className="flex items-center gap-3 text-indigo-900 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-bengali">পরীক্ষা জমা দিতে চান?</h3>
            <p className="text-xs text-slate-500 font-english">Confirm Final Submission</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-5 space-y-2.5 text-xs font-bengali">
          <div className="flex justify-between items-center text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              উত্তর করা হয়েছে:
            </span>
            <strong className="font-mono-numbers text-slate-900 text-sm">{answeredCount} টি</strong>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              উত্তর দেওয়া বাকি:
            </span>
            <strong className={`font-mono-numbers text-sm ${unansweredCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {unansweredCount} টি
            </strong>
          </div>

          {flaggedCount > 0 && (
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-amber-500" />
                পর্যালোচনার জন্য বুকমার্ক:
              </span>
              <strong className="font-mono-numbers text-amber-700 text-sm">{flaggedCount} টি</strong>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200/80 flex justify-between items-center text-slate-500">
            <span>অবশিষ্ট সময়:</span>
            <strong className="font-mono-numbers text-indigo-700">{timeLeftFormatted}</strong>
          </div>
        </div>

        {unansweredCount > 0 && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200/60 rounded-lg p-2.5 mb-5 font-bengali">
            সতর্কতা: আপনার এখনও {unansweredCount} টি প্রশ্ন বাকি রয়েছে। নেগেটিভ মার্কিং এড়াতে নিশ্চিত না হলে ছেড়ে দেওয়া সঠিক কৌশল হতে পারে।
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium font-bengali transition-colors cursor-pointer"
          >
            ফিরে যান (Review)
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold font-bengali shadow-sm transition-colors cursor-pointer"
          >
            জমা দিন (Submit)
          </button>
        </div>
      </div>
    </div>
  );
};
