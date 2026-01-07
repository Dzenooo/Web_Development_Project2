import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { AuthStateService } from '../../core/services/auth-state';

@Component({
  selector: 'app-app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app-navigation.html',
  styleUrl: './app-navigation.scss'
})
export class AppNavigationComponent {

  constructor(
    private authService: AuthService,
    private authStateService: AuthStateService,
    private router: Router
  ) {}

  async logout() {
    const result = await this.authService. logout();

    if (result.success) {
      this.router.navigate(['/']);
    }
  }
}