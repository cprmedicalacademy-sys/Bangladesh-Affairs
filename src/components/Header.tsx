import React from 'react';
import { Volume2, VolumeX, History, BookOpen, Clock, FileText } from 'lucide-react';
import { soundManager } from '../utils/audio.ts';
import { CPRLogo } from './CPRLogo.tsx';

interface HeaderProps {
  mode: 'register' | 'exam' | 'result' | 'practice';
  onSelectMode: (mode: 'register' | 'exam' | 'result' | 'practice') => void;
  timeLeftSeconds?: number;
  studentName?: string;
  studentRoll?: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHistory: () => void;
  isOMRView?: boolean;
  onToggleOMRView?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onSelectMode,
  timeLeftSeconds = 0,
  studentName,
  studentRoll,
  soundEnabled,
  onToggleSound,
  onOpenHistory,
  isOMRView = false,
  onToggleOMRView
}) => {
  const mins = Math.floor(timeLeftSeconds / 60);
  const secs = timeLeftSeconds % 60;
  const isUrgent = timeLeftSeconds > 0 && timeLeftSeconds <= 300; // < 5 mins

  return (
    <header className="bg-indigo-950 text-white border-b border-indigo-900/60 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark with Official Seal */}
        <div className="flex items-center gap-3 shrink-0">
          <CPRLogo size={42} variant="seal" className="ring-2 ring-amber-400/40 rounded-full bg-white shadow-sm" />
          <div>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onSelectMode('register'); }}
              className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-indigo-200 transition-colors font-academy flex items-center gap-1.5"
            >
              CPR MEDICAL ACADEMY
            </a>
            <p className="text-[11px] text-indigo-300 font-bengali leading-none hidden sm:block">
              SPECIAL BCS CRYSTAL BATCH · বাংলাদেশ বিষয়াবলী
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Modes */}
        <nav className="hidden md:flex items-center gap-1 bg-indigo-900/60 p-1 rounded-lg border border-indigo-800/50">
          <button
            onClick={() => onSelectMode('register')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              mode === 'register' || mode === 'exam'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-indigo-200 hover:text-white hover:bg-indigo-800/50'
            }`}
          >
            পরীক্ষা পোর্টাল (Exam)
          </button>
          <button
            onClick={() => onSelectMode('practice')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              mode === 'practice'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-indigo-200 hover:text-white hover:bg-indigo-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            অনুশীলন মোড (Practice)
          </button>
          <button
            onClick={onOpenHistory}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-indigo-200 hover:text-white hover:bg-indigo-800/50 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <History className="w-3.5 h-3.5" />
            পূর্বের ফলাফল (History)
          </button>
        </nav>

        {/* Zone 3: Actions & Exam HUD */}
        <div className="flex items-center gap-3 shrink-0">
          {mode === 'exam' && (
            <>
              {/* OMR Toggle */}
              {onToggleOMRView && (
                <button
                  onClick={onToggleOMRView}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    isOMRView
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      : 'bg-indigo-900/80 text-indigo-200 border-indigo-700/60 hover:text-white'
                  }`}
                  title="Toggle OMR Sheet View"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isOMRView ? 'প্রশ্ন কার্ড ভিউ' : 'OMR শিট ভিউ'}</span>
                </button>
              )}

              {/* Timer HUD */}
              <div 
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono-numbers font-semibold text-sm transition-colors ${
                  isUrgent 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse' 
                    : 'bg-indigo-900/80 text-amber-300 border-indigo-700/60'
                }`}
                aria-label="Remaining time"
              >
                <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-400' : 'text-amber-300'}`} />
                <span className="text-xs uppercase tracking-wider text-indigo-200 hidden sm:inline">Time:</span>
                <span>
                  {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
                </span>
              </div>
            </>
          )}

          {studentRoll && studentRoll.trim() && studentRoll !== 'N/A' && mode === 'exam' && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-indigo-200 font-english bg-indigo-900/40 px-2.5 py-1.5 rounded-lg border border-indigo-800/40">
              <span className="text-slate-400">Reg No:</span>
              <span className="font-semibold text-white">{studentRoll}</span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              soundManager.enabled = !soundEnabled;
            }}
            className="p-2 rounded-lg text-indigo-300 hover:text-white hover:bg-indigo-900/60 transition-colors"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>
    </header>
  );
};
