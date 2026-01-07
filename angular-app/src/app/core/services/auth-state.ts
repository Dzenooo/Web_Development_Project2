import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn:  'root'
})
export class AuthStateService {

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public loggedIn$ = this.loggedInSubject.asObservable();

  constructor() {
    const user = localStorage.getItem('user');
    const initialState = !!user;
    this.loggedInSubject.next(initialState);
  }

  setLoggedIn(value: boolean) {
    if (this.loggedInSubject.value !== value) {
      this.loggedInSubject.next(value);
    }
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}