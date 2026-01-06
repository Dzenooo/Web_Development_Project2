import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector:  'app-app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app-navigation.html',
  styleUrl: './app-navigation.scss'
})
export class AppNavigationComponent {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']).then(() => {
      // Force reload da očisti state
      window.location.reload();
    });
  }
}