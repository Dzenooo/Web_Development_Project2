import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { AuthStateService } from '../../core/services/auth-state';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss'
})
export class NavigationComponent implements OnInit, OnDestroy {

  mobileMenuOpen = false;
  isUserLoggedIn = false;

  private authSubscription?: Subscription;
  private routerSubscription?:  Subscription;

  constructor(
    private authService: AuthService,
    private authStateService: AuthStateService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.isUserLoggedIn = !!user;
    this.authStateService.setLoggedIn(this.isUserLoggedIn);

    this.authSubscription = this.authStateService.loggedIn$.subscribe(loggedIn => {
      if (this.isUserLoggedIn !== loggedIn) {
        this.isUserLoggedIn = loggedIn;
        this.cdr.detectChanges();
      }
    });

    this.routerSubscription = this.router. events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription. unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  isLoggedIn(): boolean {
    return this.isUserLoggedIn;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}