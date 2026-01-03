import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn:  'root'
})
export class TrackerService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  async getTrackerData(trackerName: string) {
    const user = this. auth.currentUser;
    if (!user) return null;

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
        doc(this.firestore, `users/${user.uid}/trackers/${trackerName}`),
        {
          ...data,
          lastUpdated: new Date().toISOString()
        },
        { merge: true }
      );
      return { success: true };
    } catch (error: any) {
      console.error('Error updating tracker:', error);
      return { success: false, error: error. message };
    }
  }

  async addTrackerEntry(trackerName: string, entry:  any) {
    const trackerData = await this.getTrackerData(trackerName);
    const entries = trackerData?.['entries'] || []; 

    return await this.updateTrackerData(trackerName, {
      ... trackerData,
      entries:  [...entries, entry]
    });
  }
}