import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Prati trenutno ulogovanog korisnika
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
      // Kreiraj korisnika u Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const userId = userCredential.user.uid;

      // Sačuvaj dodatne podatke u Firestore Database
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
      // Login promise
      const loginPromise = signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Timeout promise (5 sekundi)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), 5000); 
      });

      // Race - šta god prvo završi (login ili timeout)
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

  /**
   * Dohvati podatke korisnika iz Firestore-a
   */
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

  /**
   * Provjeri da li je korisnik ulogovan
   */
  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }

  /**
   * Dohvati trenutno ulogovanog korisnika
   */
  getCurrentUser(): User | null {
    return this. auth.currentUser;
  }
}