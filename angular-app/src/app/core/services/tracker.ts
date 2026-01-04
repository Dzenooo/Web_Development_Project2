import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection,
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc,
  query,
  orderBy
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { WaterEntry, DailyWaterLog } from '../models/water-entry.model';
import { DailyMoodLog, MoodEntry } from '../models/mood-entry.model';
import { DailySleepLog, SleepEntry } from '../models/sleep-entry.model';
import { DailyExerciseLog, ExerciseEntry } from '../models/exercise-entry.model';
import { DailyTaskLog, Task } from '../models/task-entry.model';


@Injectable({
  providedIn: 'root'
})
export class TrackerService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}



  private getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  
  // GENERIC TRACKER FUNCTIONS 
  

  async getTrackerData(trackerName: string) {
    const user = this.auth.currentUser;
    if (! user) return null;

    try {
      const trackerDoc = await getDoc(
        doc(this.firestore, `users/${user.uid}/trackers/${trackerName}`)
      );
      return trackerDoc.exists() ? trackerDoc.data() : null;
    } catch (error) {
      console.error('Error getting tracker data:', error);
      return null;
    }
  }

  async updateTrackerData(trackerName:  string, data: any) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    try {
      await setDoc(
        doc(this. firestore, `users/${user.uid}/trackers/${trackerName}`),
        {
          ... data,
          lastUpdated: new Date().toISOString()
        },
        { merge: true }
      );
      return { success: true };
    } catch (error:  any) {
      console.error('Error updating tracker:', error);
      return { success:  false, error: error.message };
    }
  }

  async addTrackerEntry(trackerName: string, entry: any) {
    const trackerData = await this.getTrackerData(trackerName);
    const entries = trackerData?. ['entries'] || [];

    return await this.updateTrackerData(trackerName, {
      ...trackerData,
      entries: [...entries, entry]
    });
  }

  
  // WATER TRACKER FUNCTIONS
  

  async getWaterLogForDate(date: string): Promise<DailyWaterLog | null> {
    const user = this.auth.currentUser;
    if (!user) return null;

    try {
      const docRef = doc(
        this.firestore, 
        `users/${user.uid}/waterTracking/${date}`
      );
      
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as DailyWaterLog;
      } else {
        await this.createEmptyWaterLog(date);
        return {
          date: date,
          goal: 3000,
          totalToday: 0,
          entries: []
        };
      }
    } catch (error) {
      console.error('Error getting water log:', error);
      return null;
    }
  }

  private async createEmptyWaterLog(date: string): Promise<void> {
    const user = this. auth.currentUser;
    if (!user) return;

    const docRef = doc(
      this. firestore, 
      `users/${user.uid}/waterTracking/${date}`
    );

    const emptyLog: DailyWaterLog = {
      date: date,
      goal: 3000,
      totalToday: 0,
      entries: []
    };

    await setDoc(docRef, emptyLog);
  }

  async addWaterEntry(date: string, amount: number): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) return false;

    try {
      const docRef = doc(
        this.firestore, 
        `users/${user.uid}/waterTracking/${date}`
      );

      const docSnap = await getDoc(docRef);
      
      if (! docSnap.exists()) {
        await this.createEmptyWaterLog(date);
      }

      const currentLog = docSnap.exists() 
        ? docSnap.data() as DailyWaterLog 
        : { date, goal: 3000, totalToday: 0, entries: [] };

      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const newEntry: WaterEntry = {
        id:  `entry_${Date.now()}`,
        timestamp:  timestamp,
        amount: amount,
        createdAt: now.toISOString()
      };

      const updatedEntries = [... currentLog.entries, newEntry];
      const updatedTotal = currentLog.totalToday + amount;

      await updateDoc(docRef, {
        entries:  updatedEntries,
        totalToday: updatedTotal
      });

      return true;
    } catch (error) {
      console.error('Error adding water:', error);
      return false;
    }
  }

  async updateWaterGoal(date: string, newGoal: number): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) return false;

    try {
      const docRef = doc(
        this.firestore, 
        `users/${user.uid}/waterTracking/${date}`
      );

      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await this.createEmptyWaterLog(date);
      }

      await updateDoc(docRef, {
        goal: newGoal
      });

      return true;
    } catch (error) {
      console.error('Error updating goal:', error);
      return false;
    }
  }

  async deleteWaterEntry(date:  string, entryId: string): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) return false;

    try {
      const docRef = doc(
        this.firestore, 
        `users/${user.uid}/waterTracking/${date}`
      );

      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return false;

      const currentLog = docSnap.data() as DailyWaterLog;
      
      const entryToDelete = currentLog.entries.find(e => e.id === entryId);
      if (! entryToDelete) return false;

      const updatedEntries = currentLog.entries.filter(e => e.id !== entryId);
      const updatedTotal = currentLog.totalToday - entryToDelete.amount;

      await updateDoc(docRef, {
        entries: updatedEntries,
        totalToday: updatedTotal
      });

      return true;
    } catch (error) {
      console.error('Error deleting entry:', error);
      return false;
    }
  }

  async getAllWaterLogs(): Promise<DailyWaterLog[]> {
    const user = this. auth.currentUser;
    if (!user) return [];

    try {
      const collectionRef = collection(
        this.firestore, 
        `users/${user.uid}/waterTracking`
      );

      const q = query(
        collectionRef, 
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      
      const logs: DailyWaterLog[] = [];
      querySnapshot.forEach((doc) => {
        logs.push(doc. data() as DailyWaterLog);
      });

      return logs;
    } catch (error) {
      console.error('Error getting all logs:', error);
      return [];
    }
  }

  
  // MOOD TRACKER FUNCTIONS
  

  async getMoodLogForDate(date:  string): Promise<DailyMoodLog | null> {
  const userId = this.getCurrentUserId();
  if (!userId) return null;

  try {
    
    const docRef = doc(this.firestore, `users/${userId}/mood/${date}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as DailyMoodLog;
    } else {
      return {
        date: date,
        entries: []
      };
    }
  } catch (error) {
    console.error('Error getting mood log:', error);
    return null;
  }
}

  async addMoodEntry(date: string, mood:  'sretno' | 'neutralno' | 'tuzno' | 'ljuto' | 'umorno', note:  string): Promise<boolean> {
  const userId = this.getCurrentUserId();
  if (!userId) return false;

  const emojiMap:  { [key: string]: string } = {
    'sretno': '😊',
    'neutralno': '😐',
    'tuzno': '😢',
    'ljuto': '😡',
    'umorno': '😴'
  };

  const newEntry:  MoodEntry = {
    id: Date.now().toString(),
    timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    mood: mood,
    emoji: emojiMap[mood],
    note: note
  };

  try {
    
    const docRef = doc(this.firestore, `users/${userId}/mood/${date}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingData = docSnap.data() as DailyMoodLog;
      await updateDoc(docRef, {
        entries: [...existingData.entries, newEntry]
      });
    } else {
      await setDoc(docRef, {
        date:  date,
        entries: [newEntry]
      });
    }

    return true;
  } catch (error) {
    console.error('Error adding mood entry:', error);
    return false;
  }
}

  async deleteMoodEntry(date: string, entryId: string): Promise<boolean> {
  const userId = this.getCurrentUserId();
  if (!userId) return false;

  try {
    
    const docRef = doc(this.firestore, `users/${userId}/mood/${date}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingData = docSnap. data() as DailyMoodLog;
      const updatedEntries = existingData. entries.filter(e => e.id !== entryId);

      await updateDoc(docRef, {
        entries: updatedEntries
      });

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error deleting mood entry:', error);
    return false;
  }
}

  async getAllMoodLogs(): Promise<DailyMoodLog[]> {
  const userId = this.getCurrentUserId();
  if (!userId) return [];

  try {
    
    const collectionRef = collection(this.firestore, `users/${userId}/mood`);
    const querySnapshot = await getDocs(collectionRef);

    const logs: DailyMoodLog[] = [];
    querySnapshot.forEach((doc) => {
      logs.push(doc.data() as DailyMoodLog);
    });

    logs.sort((a, b) => a.date.localeCompare(b. date));

    return logs;
  } catch (error) {
    console.error('Error getting all mood logs:', error);
    return [];
  }
}

async getSleepLogForDate(date: string): Promise<DailySleepLog | null> {
  const userId = this.getCurrentUserId();
  if (!userId) return null;

  try {
    const docRef = doc(this.firestore, `users/${userId}/sleep/${date}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as DailySleepLog;
    } else {
      return {
        date: date,
        totalToday: 0,
        entries: []
      };
    }
  } catch (error) {
    console.error('Error getting sleep log:', error);
    return null;
  }
}

async addSleepEntry(date: string, hours: number): Promise<boolean> {
  const userId = this.getCurrentUserId();
  if (!userId) return false;

  const newEntry: SleepEntry = {
    id: Date.now().toString(),
    timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    hours: hours,
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = doc(this. firestore, `users/${userId}/sleep/${date}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingData = docSnap.data() as DailySleepLog;
      await updateDoc(docRef, {
        entries: [... existingData.entries, newEntry],
        totalToday: existingData.totalToday + hours
      });
    } else {
      await setDoc(docRef, {
        date:  date,
        totalToday:  hours,
        entries: [newEntry]
      });
    }

    return true;
  } catch (error) {
    console.error('Error adding sleep entry:', error);
    return false;
  }
}

async deleteSleepEntry(date: string, entryId: string): Promise<boolean> {
  const userId = this.getCurrentUserId();
  if (!userId) return false;

  try {
    const docRef = doc(this. firestore, `users/${userId}/sleep/${date}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingData = docSnap.data() as DailySleepLog;
      const entryToDelete = existingData.entries. find(e => e.id === entryId);
      
      if (! entryToDelete) return false;

      const updatedEntries = existingData. entries.filter(e => e. id !== entryId);
      const updatedTotal = existingData.totalToday - entryToDelete.hours;

      await updateDoc(docRef, {
        entries: updatedEntries,
        totalToday: updatedTotal
      });

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error deleting sleep entry:', error);
    return false;
  }
}

async getAllSleepLogs(): Promise<DailySleepLog[]> {
  const userId = this.getCurrentUserId();
  if (!userId) return [];

  try {
    const collectionRef = collection(this.firestore, `users/${userId}/sleep`);
    const querySnapshot = await getDocs(collectionRef);

    const logs: DailySleepLog[] = [];
    querySnapshot.forEach((doc) => {
      logs.push(doc.data() as DailySleepLog);
    });

    logs.sort((a, b) => a.date.localeCompare(b.date));

    return logs;
  } catch (error) {
    console.error('Error getting all sleep logs:', error);
    return [];
  }
}



// EXERCISE TRACKER FUNCTIONS


async getExerciseLogForDate(date: string): Promise<DailyExerciseLog | null> {
  const userId = this.getCurrentUserId();
  if (!userId) return null;

  try {
    const docRef = doc(this.firestore, `users/${userId}/exercise/${date}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as DailyExerciseLog;
    } else {
      return {
        date: date,
        totalToday: 0,
        entries: []
      };
    }
  } catch (error) {
    console.error('Error getting exercise log:', error);
    return null;
  }
}

async addExerciseEntry(date: string, minutes: number, type: string): Promise<boolean> {
  const userId = this.getCurrentUserId();
  if (!userId) return false;

  const newEntry: ExerciseEntry = {
    id: Date.now().toString(),
    timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    minutes: minutes,
    type: type,
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = doc(this.firestore, `users/${userId}/exercise/${date}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingData = docSnap.data() as DailyExerciseLog;
      await updateDoc(docRef, {
        entries: [...existingData.entries, newEntry],
        totalToday: existingData.totalToday + minutes
      });
    } else {
      await setDoc(docRef, {
        date:  date,
        totalToday:  minutes,
        entries: [newEntry]
      });
    }

    return true;
  } catch (error) {
    console.error('Error adding exercise entry:', error);
    return false;
  }
}

async deleteExerciseEntry(date: string, entryId: string): Promise<boolean> {
  const userId = this.getCurrentUserId();
  if (!userId) return false;

  try {
    const docRef = doc(this.firestore, `users/${userId}/exercise/${date}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingData = docSnap.data() as DailyExerciseLog;
      const entryToDelete = existingData.entries. find(e => e.id === entryId);
      
      if (! entryToDelete) return false;

      const updatedEntries = existingData. entries.filter(e => e. id !== entryId);
      const updatedTotal = existingData.totalToday - entryToDelete.minutes;

      await updateDoc(docRef, {
        entries: updatedEntries,
        totalToday: updatedTotal
      });

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error deleting exercise entry:', error);
    return false;
  }
}

async getAllExerciseLogs(): Promise<DailyExerciseLog[]> {
  const userId = this.getCurrentUserId();
  if (!userId) return [];

  try {
    const collectionRef = collection(this.firestore, `users/${userId}/exercise`);
    const querySnapshot = await getDocs(collectionRef);

    const logs: DailyExerciseLog[] = [];
    querySnapshot.forEach((doc) => {
      logs.push(doc.data() as DailyExerciseLog);
    });

    logs.sort((a, b) => a.date.localeCompare(b.date));

    return logs;
  } catch (error) {
    console.error('Error getting all exercise logs:', error);
    return [];
  }
}



// TASK PLANNER FUNCTIONS


async getTasksForDate(date: string): Promise<DailyTaskLog | null> {
  const userId = this.getCurrentUserId();
  if (!userId) return null;

  try {
    const docRef = doc(this.firestore, `users/${userId}/tasks/${date}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as DailyTaskLog;
    } else {
      return {
        date: date,
        tasks: [],
        totalTasks: 0,
        completedTasks: 0,
        completionRate: 0
      };
    }
  } catch (error) {
    console.error('Error getting tasks:', error);
    return null;
  }
}

async addTask(date: string, name: string): Promise<boolean> {
  const userId = this.getCurrentUserId();
  if (!userId) return false;

  const newTask: Task = {
    id: Date.now().toString(),
    name: name,
    completed: false,
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = doc(this.firestore, `users/${userId}/tasks/${date}`);
    const docSnap = await getDoc(docRef);

    let updatedTasks: Task[];
    let totalTasks: number;
    let completedTasks: number;

    if (docSnap.exists()) {
      const existingData = docSnap.data() as DailyTaskLog;
      updatedTasks = [...existingData.tasks, newTask];
      totalTasks = updatedTasks.length;
      completedTasks = updatedTasks.filter((t:  Task) => t.completed).length;
    } else {
      updatedTasks = [newTask];
      totalTasks = 1;
      completedTasks = 0;
    }

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    await setDoc(docRef, {
      date:  date,
      tasks: updatedTasks,
      totalTasks: totalTasks,
      completedTasks: completedTasks,
      completionRate: completionRate
    });

    return true;
  } catch (error) {
    console.error('Error adding task:', error);
    return false;
  }
}

async toggleTask(date: string, taskId: string): Promise<boolean> {
  const userId = this.getCurrentUserId();
  if (!userId) return false;

  try {
    const docRef = doc(this.firestore, `users/${userId}/tasks/${date}`);
    const docSnap = await getDoc(docRef);

    if (! docSnap.exists()) return false;

    const existingData = docSnap.data() as DailyTaskLog;
    const updatedTasks = existingData. tasks.map((t: Task) => 
      t.id === taskId ? { ...t, completed: ! t.completed } : t
    );

    const totalTasks = updatedTasks.length;
    const completedTasks = updatedTasks.filter((t: Task) => t.completed).length;
    const completionRate = totalTasks > 0 ? Math. round((completedTasks / totalTasks) * 100) : 0;

    await updateDoc(docRef, {
      tasks: updatedTasks,
      totalTasks: totalTasks,
      completedTasks:  completedTasks,
      completionRate: completionRate
    });

    return true;
  } catch (error) {
    console.error('Error toggling task:', error);
    return false;
  }
}

async deleteTask(date: string, taskId: string): Promise<boolean> {
  const userId = this.getCurrentUserId();
  if (!userId) return false;

  try {
    const docRef = doc(this.firestore, `users/${userId}/tasks/${date}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return false;

    const existingData = docSnap.data() as DailyTaskLog;
    const updatedTasks = existingData.tasks.filter((t: Task) => t.id !== taskId);

    const totalTasks = updatedTasks.length;
    const completedTasks = updatedTasks.filter((t: Task) => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    await updateDoc(docRef, {
      tasks: updatedTasks,
      totalTasks: totalTasks,
      completedTasks: completedTasks,
      completionRate: completionRate
    });

    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
}

async getAllTaskLogs(): Promise<DailyTaskLog[]> {
  const userId = this.getCurrentUserId();
  if (!userId) return [];

  try {
    const collectionRef = collection(this.firestore, `users/${userId}/tasks`);
    const querySnapshot = await getDocs(collectionRef);

    const logs: DailyTaskLog[] = [];
    querySnapshot.forEach((doc) => {
      logs.push(doc.data() as DailyTaskLog);
    });

    logs.sort((a, b) => a.date.localeCompare(b.date));

    return logs;
  } catch (error) {
    console.error('Error getting all task logs:', error);
    return [];
  }
}


}