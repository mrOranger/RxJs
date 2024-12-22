import { Routes } from '@angular/router';
import { LoginComponent, SignupComponent } from './components';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
      {
            path: 'login',
            canActivate: [authGuard()],
            loadComponent: () => import('./components/login/login.component').then((mod) => mod.LoginComponent),
      },
      {
            path: 'signup',
            canActivate: [authGuard()],
            loadComponent: () => import('./components/signup/signup.component').then((mod) => mod.SignupComponent),
      },
];
