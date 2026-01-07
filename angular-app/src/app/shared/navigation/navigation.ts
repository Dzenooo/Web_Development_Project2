import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl:  './navigation.html',
  styleUrl: './navigation.scss'
})
export class NavigationComponent implements OnInit {
  
  mobileMenuOpen = false;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}
  
  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.cdr.detectChanges(); 
    });
  }
  
  isLoggedIn(): boolean {
    return !!this.authService. getCurrentUser();
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen = false;
  }
  
  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}