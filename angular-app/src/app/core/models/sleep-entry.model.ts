export interface SleepEntry {
  id: string;
  timestamp: string;
  hours: number;
  createdAt: string;
}

export interface DailySleepLog {
  date: string;
  totalToday: number;
  entries: SleepEntry[];
}