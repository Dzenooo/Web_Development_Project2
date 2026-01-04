export interface WaterEntry {
  id: string;
  timestamp: string;
  amount: number;
  createdAt: string;
}

export interface DailyWaterLog {
  date: string;
  goal: number;
  totalToday: number;
  entries: WaterEntry[];
}