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

@Injectable({
  providedIn: 'root'
})
export class TrackerService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  // ==========================================
  // GENERIC TRACKER FUNCTIONS (Stare funkcije)
  // ==========================================

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

  async updateTrackerData(trackerName: string, data: any) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    try {
      await setDoc(
        doc(this. firestore, `users/${user.uid}/trackers/${trackerName}`),
        {
          ...data,
          lastUpdated:  new Date().toISOString()
        },
        { merge:  true }
      );
      return { success: true };
    } catch (error: any) {
      console.error('Error updating tracker:', error);
      return { success: false, error: error.message };
    }
  }

  async addTrackerEntry(trackerName: string, entry: any) {
    const trackerData = await this.getTrackerData(trackerName);
    const entries = trackerData?.['entries'] || [];

    return await this.updateTrackerData(trackerName, {
      ... trackerData,
      entries:  [...entries, entry]
    });
  }

  // ==========================================
  // WATER TRACKER FUNCTIONS
  // ==========================================

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
          date:  date,
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
        id: `entry_${Date.now()}`,
        timestamp: timestamp,
        amount: amount,
        createdAt: now. toISOString()
      };

      const updatedEntries = [... currentLog.entries, newEntry];
      const updatedTotal = currentLog.totalToday + amount;

      await updateDoc(docRef, {
        entries: updatedEntries,
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

  async deleteWaterEntry(date: string, entryId: string): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) return false;

    try {
      const docRef = doc(
        this. firestore, 
        `users/${user.uid}/waterTracking/${date}`
      );

      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return false;

      const currentLog = docSnap.data() as DailyWaterLog;
      
      const entryToDelete = currentLog.entries.find(e => e.id === entryId);
      if (!entryToDelete) return false;

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
    const user = this.auth.currentUser;
    if (! user) return [];

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
        logs.push(doc.data() as DailyWaterLog);
      });

      return logs;
    } catch (error) {
      console.error('Error getting all logs:', error);
      return [];
    }
  }
}