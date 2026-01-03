import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Auth, updatePassword, authState } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  async getCurrentUserData() {
    const user = await firstValueFrom(authState(this.auth));
    
    if (! user) return null;

    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async updateProfile(data: { 
    firstName?:  string, 
    lastName?: string, 
    displayName?: string 
  }) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    try {
      await updateDoc(doc(this. firestore, 'users', user.uid), {
        ... data,
        lastUpdated:  new Date().toISOString()
      });
      return { success: true };
    } catch (error:  any) {
      console.error('Error updating profile:', error);
      return { success: false, error: error. message };
    }
  }

  async updateTheme(theme: 'light' | 'dark' | 'rainbow') {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    try {
      await updateDoc(doc(this.firestore, 'users', user.uid), {
        theme:  theme,
        lastUpdated: new Date().toISOString()
      });
      return { success: true };
    } catch (error:  any) {
      console.error('Error updating theme:', error);
      return { success: false, error: error.message };
    }
  }

  async updatePassword(newPassword: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    try {
      await updatePassword(user, newPassword);
      return { success: true };
    } catch (error: any) {
      console.error('Error updating password:', error);
      return { success: false, error: error.message };
    }
  }
}