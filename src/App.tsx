/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { RegistrationCard } from './components/RegistrationCard.tsx';
import { QuestionCard } from './components/QuestionCard.tsx';
import { OMRSheet } from './components/OMRSheet.tsx';
import { QuestionNavigator } from './components/QuestionNavigator.tsx';
import { SubmitModal } from './components/SubmitModal.tsx';
import { ResultView } from './components/ResultView.tsx';
import { PracticeMode } from './components/PracticeMode.tsx';
import { HistoryModal } from './components/HistoryModal.tsx';
import { QUESTIONS, EXAM_METADATA } from './data/questions.ts';
import { StudentInfo, ExamAttempt, ExamMode } from './types.ts';
import { soundManager } from './utils/audio.ts';
import { CPRLogo } from './components/CPRLogo.tsx';
import { FileText, ListFilter, Send, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

const STORAGE_KEY_HISTORY = 'cpr_bcs_attempts_v1';
const STORAGE_KEY_STUDENT = 'cpr_bcs_student_v1';
const STORAGE_KEY_SOUND = 'cpr_bcs_sound_v1';

export default function App() {
  const [mode, setMode] = useState<ExamMode>('register');
  const [student, setStudent] = useState<StudentInfo | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENT);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(EXAM_METADATA.timeMinutes * 60);
  const [isOMRView, setIsOMRView] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState<ExamAttempt | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SOUND) !== 'false';
    } catch {
      return true;
    }
  });

  const [history, setHistory] = useState<ExamAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [practicePresetIds, setPracticePresetIds] = useState<number[] | undefined>(undefined);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const examStartTimeRef = useRef<number>(Date.now());

  // Save student to local storage
  const handleStartExam = (info: StudentInfo) => {
    setStudent(info);
    try {
      localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(info));
    } catch {
      // Ignore
    }
    setUserAnswers({});
    setFlaggedQuestions(new Set());
    setTimeLeftSeconds(EXAM_METADATA.timeMinutes * 60);
    examStartTimeRef.current = Date.now();
    setMode('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Timer logic
  useEffect(() => {
    if (mode === 'exam') {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinalSubmit();
            return 0;
          }
          if (prev === 300) {
            // 5 minutes warning sound
            soundManager.playWarning();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode]);

  // Answer handlers
  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleClearOption = (questionId: number) => {
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleToggleFlag = (questionId: number) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const handleJumpToQuestion = (id: number) => {
    if (isOMRView) {
      setIsOMRView(false);
    }
    setTimeout(() => {
      const el = document.getElementById(`q-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  // Final submit calculations
  const handleFinalSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitModalOpen(false);

    let correctCount = 0;
    let incorrectCount = 0;

    QUESTIONS.forEach((q) => {
      const userChoice = userAnswers[q.id];
      if (userChoice !== undefined) {
        if (userChoice === q.answer) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      }
    });

    const unansweredCount = QUESTIONS.length - (correctCount + incorrectCount);
    const penaltyMarks = incorrectCount * EXAM_METADATA.negativeMarks;
    const finalScore = correctCount * EXAM_METADATA.positiveMarks - penaltyMarks;
    const timeSpentSeconds = Math.max(
      1,
      EXAM_METADATA.timeMinutes * 60 - timeLeftSeconds
    );
    const percentage = Math.max(0, (finalScore / QUESTIONS.length) * 100);

    const attempt: ExamAttempt = {
      id: `attempt_${Date.now()}`,
      timestamp: Date.now(),
      student: student || { name: 'Doctor / Candidate', roll: 'CPR-001' },
      answers: { ...userAnswers },
      correctCount,
      incorrectCount,
      unansweredCount,
      penaltyMarks,
      finalScore,
      timeSpentSeconds,
      percentage
    };

    setCurrentAttempt(attempt);

    // Save to history
    setHistory((prev) => {
      const updated = [attempt, ...prev].slice(0, 30);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    soundManager.playSubmit();
    setMode('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    setTimeLeftSeconds(EXAM_METADATA.timeMinutes * 60);
    setUserAnswers({});
    setFlaggedQuestions(new Set());
    setMode('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePracticeMistakes = (wrongIds: number[]) => {
    setPracticePresetIds(wrongIds);
    setMode('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
    try {
      localStorage.setItem(STORAGE_KEY_SOUND, next ? 'true' : 'false');
    } catch {
      // Ignore
    }
  };

  const handleClearHistory = () => {
    if (confirm('আপনি কি পূর্বের সকল পরীক্ষার ইতিহাস মুছে ফেলতে চান?')) {
      setHistory([]);
      try {
        localStorage.removeItem(STORAGE_KEY_HISTORY);
      } catch {
        // Ignore
      }
    }
  };

  const mins = Math.floor(timeLeftSeconds / 60);
  const secs = timeLeftSeconds % 60;
  const formattedTimeLeft = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col font-bengali">
      {/* Universal Top Navigation Header */}
      <Header
        mode={mode}
        onSelectMode={(selectedMode) => {
          if (mode === 'exam' && selectedMode !== 'exam') {
            if (confirm('পরীক্ষা চলাকালীন অন্য পেজে গেলে পরীক্ষা স্থগিত হবে। আপনি কি নিশ্চিত?')) {
              setMode(selectedMode);
            }
          } else {
            setMode(selectedMode);
          }
        }}
        timeLeftSeconds={timeLeftSeconds}
        studentName={student?.name}
        studentRoll={student?.roll}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenHistory={() => setIsHistoryOpen(true)}
        isOMRView={isOMRView}
        onToggleOMRView={() => setIsOMRView(!isOMRView)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {mode === 'register' && (
          <RegistrationCard
            onStartExam={handleStartExam}
            onStartPractice={() => {
              setPracticePresetIds(undefined);
              setMode('practice');
            }}
            initialInfo={student || undefined}
          />
        )}

        {mode === 'exam' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Candidate & Exam Metadata Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CPRLogo size={44} variant="seal" className="bg-white rounded-full p-0.5 border border-slate-200 shadow-xs" />
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-english">
                    <span className="font-semibold text-slate-800">{student?.name}</span>
                    {student?.roll && student.roll.trim() && student.roll !== 'N/A' && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-numbers">Reg: {student.roll}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 font-bengali">
                    স্পেশাল বিসিএস ক্রিস্টাল ব্যাচ — বাংলাদেশ বিষয়াবলী
                  </h2>
                </div>
              </div>

              {/* View Switcher and Quick Actions */}
              <div className="flex items-center gap-2 text-xs font-bengali">
                <button
                  type="button"
                  onClick={() => setIsOMRView(!isOMRView)}
                  className={`px-3 py-1.5 rounded-lg border font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isOMRView
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isOMRView ? 'প্রশ্ন কার্ড ভিউ' : 'OMR শিট ভিউ'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>পরীক্ষা জমা দিন</span>
                </button>
              </div>
            </div>

            {/* Layout Grid: Questions + Side Palette */}
            {isOMRView ? (
              <OMRSheet
                questions={QUESTIONS}
                userAnswers={userAnswers}
                onSelectOption={handleSelectOption}
                onClearOption={handleClearOption}
                flaggedQuestions={flaggedQuestions}
                studentName={student?.name || ''}
                studentRoll={student?.roll || ''}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                {/* Left: 50 Questions List */}
                <div className="lg:col-span-3 space-y-4">
                  {QUESTIONS.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      selectedOptionIndex={userAnswers[question.id]}
                      onSelectOption={handleSelectOption}
                      onClearOption={handleClearOption}
                      isFlagged={flaggedQuestions.has(question.id)}
                      onToggleFlag={handleToggleFlag}
                    />
                  ))}

                  {/* Bottom Submit Banner */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-3 mt-8 shadow-xs">
                    <h4 className="text-base font-bold text-slate-900 font-bengali">
                      আপনার সকল উত্তর পূরণ করা সম্পন্ন হয়েছে?
                    </h4>
                    <p className="text-xs text-slate-500 font-bengali">
                      জমা দেওয়ার পূর্বে কোনো বুকমার্ক করা প্রশ্ন বাকি আছে কি না তা দেখে নিন।
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl shadow-sm transition duration-150 font-bengali text-base cursor-pointer"
                    >
                      পরীক্ষা জমা দিন (Submit Exam)
                    </button>
                  </div>
                </div>

                {/* Right: Question Palette Navigator */}
                <div className="lg:col-span-1">
                  <QuestionNavigator
                    totalQuestions={QUESTIONS.length}
                    userAnswers={userAnswers}
                    flaggedQuestions={flaggedQuestions}
                    onJumpToQuestion={handleJumpToQuestion}
                    onSubmitExam={() => setIsSubmitModalOpen(true)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'result' && currentAttempt && (
          <ResultView
            attempt={currentAttempt}
            questions={QUESTIONS}
            onRetake={handleRetake}
            onPracticeMistakes={handlePracticeMistakes}
          />
        )}

        {mode === 'practice' && (
          <PracticeMode
            questions={QUESTIONS}
            onStartExam={() => setMode('register')}
            presetQuestionIds={practicePresetIds}
          />
        )}
      </main>

      {/* Submit Confirmation Dialog */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={handleFinalSubmit}
        totalQuestions={QUESTIONS.length}
        answeredCount={Object.keys(userAnswers).length}
        flaggedCount={flaggedQuestions.size}
        timeLeftFormatted={formattedTimeLeft}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        attempts={history}
        onSelectAttempt={(selected) => {
          setCurrentAttempt(selected);
          setMode('result');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onClearHistory={handleClearHistory}
      />

      {/* Simple Academic Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-academy font-semibold text-slate-800">
            CPR MEDICAL ACADEMY · SPECIAL BCS CRYSTAL BATCH
          </p>
          <div className="flex items-center gap-3 text-slate-500 font-bengali">
            <span>বাংলাদেশ বিষয়াবলী পূর্ণাঙ্গ ৫০ নম্বরের বিশেষ মডেল টেস্ট</span>
            <span aria-hidden="true">·</span>
            <span className="font-english">Official Negative Marking (0.50)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
