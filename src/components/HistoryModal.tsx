import React from 'react';
import { ExamAttempt } from '../types.ts';
import { X, Calendar, Clock, Award, Trash2, ArrowRight } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  attempts: ExamAttempt[];
  onSelectAttempt: (attempt: ExamAttempt) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  attempts,
  onSelectAttempt,
  onClearHistory
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-academy">
              EXAMINATION ATTEMPT HISTORY
            </h3>
            <p className="text-xs text-slate-500 font-bengali">পূর্বে সম্পন্নকৃত পরীক্ষার ফলাফল ও স্কোর রেকর্ড</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {attempts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-bengali text-sm">
              এখনও কোনো পরীক্ষার ফলাফল সংরক্ষিত নেই।
            </div>
          ) : (
            attempts.map((att) => {
              const dateStr = new Date(att.timestamp).toLocaleDateString('bn-BD', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={att.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all bg-white hover:bg-indigo-50/20 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-800 font-english">{att.student.name}</span>
                      {att.student.roll && att.student.roll.trim() && att.student.roll !== 'N/A' && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-numbers">Reg: {att.student.roll}</span>
                        </>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono-numbers">
                      <Calendar className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs pt-1 font-bengali">
                      <span className="text-emerald-700">সঠিক: {att.correctCount}</span>
                      <span className="text-rose-700">ভুল: {att.incorrectCount}</span>
                      <span className="text-slate-500">বাকি: {att.unansweredCount}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold font-mono-numbers text-indigo-900">
                      {att.finalScore.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-slate-400 block">/ ৫০.০০</span>
                    <button
                      onClick={() => {
                        onSelectAttempt(att);
                        onClose();
                      }}
                      className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>বিস্তারিত দেখুন</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {attempts.length > 0 && (
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-mono-numbers">
              মোট রেকর্ড: {attempts.length} টি
            </span>
            <button
              onClick={onClearHistory}
              className="text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ইতিহাস মুছে ফেলুন</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
