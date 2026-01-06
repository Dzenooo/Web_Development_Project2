import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';


import { LandingComponent } from './modules/pages/landing/landing';
import { PopisComponent } from './modules/pages/popis/popis';          
import { RasporedComponent } from './modules/pages/raspored/raspored';
import { KontaktComponent } from './modules/pages/kontakt/kontakt'; 


import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';


import { ProfileComponent } from './modules/profile/profile';
import { MyTrackersComponent } from './modules/mytrackers/my-trackers';
import { FunzoneComponent } from './modules/funzone/funzone';

export const routes: Routes = [

  { 
    path: '', 
    component: LandingComponent 
  },
   { 
    path: 'popis', 
    component: PopisComponent         
  },
  { 
    path: 'raspored', 
    component: RasporedComponent        
  },
  { 
    path:  'kontakt', 
    component: KontaktComponent         
  },
  
  // AUTH ROUTES
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  
  // PROTECTED ROUTES (sa AuthGuard)
  { 
    path: 'profile', 
  component: ProfileComponent,
  canActivate: [AuthGuard]
  },
  { 
    path: 'tracker', 
    component: MyTrackersComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'funzone', 
    component: FunzoneComponent,
    canActivate: [AuthGuard]
  },
  
 
  { 
    path: '**', 
    redirectTo: '' 
  }
];