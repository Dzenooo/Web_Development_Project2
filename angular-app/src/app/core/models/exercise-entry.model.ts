export interface ExerciseEntry {
  id: string;
  timestamp:  string;
  minutes: number;
  type: string;
  createdAt: string;
}

export interface DailyExerciseLog {
  date: string;
  totalToday: number;
  entries: ExerciseEntry[];
}