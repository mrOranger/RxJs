import { Routes } from '@angular/router';

export const routes: Routes = [
      {
            path: 'login',
            loadComponent: () => import('./components/login/login.component').then((mod) => mod.LoginComponent),
      },
      {
            path: 'signup',
            loadComponent: () => import('./components/signup/signup.component').then((mod) => mod.SignupComponent),
      },
];
