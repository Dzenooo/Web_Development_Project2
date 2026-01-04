export interface MoodEntry {
  id: string;
  timestamp: string;
  mood: 'sretno' | 'neutralno' | 'tuzno' | 'ljuto' | 'umorno';
  emoji: string;
  note:  string;
}

export interface DailyMoodLog {
  date: string;
  entries: MoodEntry[];
}