import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';

export const routes: Routes = [
  // Default route - redirektuj na login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Login ruta
  { path: 'login', component: LoginComponent },
  
  // Register ruta
  { path: 'register', component: RegisterComponent },
  
  // Dashboard ruta (za kasnije - sada samo placeholder)
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent) },
  
  // Wildcard route - 404 Not Found
  { path: '**', redirectTo: '/login' }
];