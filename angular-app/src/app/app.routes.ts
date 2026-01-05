import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { DashboardComponent } from './dashboard/dashboard';
import { FunzoneComponent } from './modules/funzone/funzone';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch:  'full' 
  },
  { 
    path:  'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component:  RegisterComponent 
  },
  
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { 
        path: '', 
        redirectTo: 'profile', 
        pathMatch: 'full' 
      },
      {
        path: 'profile',
        loadComponent: () => import('./modules/profile/profile').then(m => m.ProfileComponent)
      },
      {
        path: 'mytrackers',
        loadComponent:  () => import('./modules/mytrackers/my-trackers').then(m => m.MyTrackersComponent)
      },

      {
        path: 'funzone',
        loadComponent: () => import('./modules/funzone/funzone').then(m => m.FunzoneComponent)
      }
    ]
  },
  
  { 
    path: '**', 
    redirectTo:  '/login' 
  }
];