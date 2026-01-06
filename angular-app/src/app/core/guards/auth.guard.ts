import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const AuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  
  console.log('🔒 AuthGuard - User:', user);  // ← DEBUG log
  
  if (user) {
    console.log('✅ AuthGuard - Access granted');
    return true;  // Dozvoli pristup
  } else {
    console.log('❌ AuthGuard - Redirect to login');
    router.navigate(['/login']);
    return false;
  }
};