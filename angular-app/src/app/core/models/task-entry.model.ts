export interface Task {
  id: string;
  name: string;
  completed: boolean;
  createdAt: string;
}

export interface DailyTaskLog {
  date: string;
  tasks: Task[];
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}