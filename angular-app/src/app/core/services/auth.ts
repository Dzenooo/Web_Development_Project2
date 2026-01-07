import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | null>;

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.user$ = user(this.auth);
  }

  /**
   * REGISTER - Kreiranje novog korisnika
   */
  async register(email: string, password: string, displayName:  string) {
    try {

      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const userId = userCredential.user.uid;

      await setDoc(doc(this.firestore, 'users', userId), {
        uid: userId,
        email: email,
        displayName: displayName,
        createdAt: new Date().toISOString(),
        theme: 'light'
      });

      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * LOGIN - 
   */
  async login(email: string, password: string) {
    try {
   
      const loginPromise = signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

     
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), 5000); 
      });

      const userCredential = await Promise.race([
        loginPromise,
        timeoutPromise
      ]) as any;

      return { success: true, user: userCredential.user };

    } catch (error: any) {
      console.error('Login error:', error);

      
      if (error.message === 'timeout') {
        return { success: false, error: 'timeout' };
      }

      return { success: false, error: error.code };
    }
  }

  
  async logout() {
    try {
      await signOut(this.auth);
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

 
  async getUserData(userId:  string) {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', userId));

      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { success: false, error:  'User not found' };
      }
    } catch (error: any) {
      console.error('Get user data error:', error);
      return { success: false, error: error.message };
    }
  }

  
  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }

 
 getCurrentUser(): any {
  const userJson = localStorage.getItem('user');
  
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user'); 
      return null;
    }
  }
  
  return null;
}
}