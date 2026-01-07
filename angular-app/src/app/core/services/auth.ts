import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthStateService } from './auth-state';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | null>;

  constructor(
    private auth:  Auth,
    private firestore:  Firestore,
    private authStateService: AuthStateService
  ) {
    this.user$ = user(this.auth);
  }

  async register(email: string, password: string, displayName: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const userId = userCredential.user.uid;

      await setDoc(doc(this.firestore, 'users', userId), {
        uid: userId,
        email:  email,
        displayName: displayName,
        createdAt:  new Date().toISOString(),
        theme: 'light'
      });

      const userObject = {
        uid: userId,
        email: email
      };
      localStorage.setItem('user', JSON. stringify(userObject));

      this.authStateService.setLoggedIn(true);

      return { success: true, user: userCredential.user };
    } catch (error:  any) {
      return { success: false, error: error.message };
    }
  }

  async login(email:  string, password: string) {
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

      const userObject = {
        uid: userCredential. user.uid,
        email: userCredential.user.email
      };
      localStorage.setItem('user', JSON.stringify(userObject));

      this.authStateService.setLoggedIn(true);

      return { success: true, user: userCredential.user };

    } catch (error: any) {
      if (error.message === 'timeout') {
        return { success: false, error:  'timeout' };
      }

      return { success: false, error: error.code };
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      localStorage.removeItem('user');
      this.authStateService.setLoggedIn(false);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getUserData(userId: string) {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', userId));

      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error: any) {
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
        localStorage.removeItem('user');
        return null;
      }
    }

    return null;
  }
}