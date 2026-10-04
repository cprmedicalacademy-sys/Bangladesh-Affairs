export interface StudentInfo {
  name: string;
  roll: string;
  batch?: string;
  college?: string;
}

export type ExamMode = 'register' | 'exam' | 'result' | 'practice';

export interface ExamAttempt {
  id: string;
  timestamp: number;
  student: StudentInfo;
  answers: Record<number, number>;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  penaltyMarks: number;
  finalScore: number;
  timeSpentSeconds: number;
  percentage: number;
}

export type ReviewFilter = 'all' | 'incorrect' | 'correct' | 'unanswered' | 'flagged';
