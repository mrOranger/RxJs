import { Routes } from '@angular/router';
import { LoginComponent, SignupComponent } from './components';

export const routes: Routes = [
      {
            path: 'login',
            component: LoginComponent,
      },
      {
            path: 'signup',
            component: SignupComponent,
      },
];
