import { Routes } from '@angular/router';
import { LoginComponent, SignupComponent } from './components';

export const routes: Routes = [
      {
            path: 'authentication/login',
            component: LoginComponent,
      },
      {
            path: 'authentication/signup',
            component: SignupComponent,
      },
];
