import { Routes } from '@angular/router';
import { LoginComponent, NotFoundComponent, SignupComponent } from './components';

export const routes: Routes = [
      {
            path: 'authentication/login',
            component: LoginComponent,
      },
      {
            path: 'authentication/signup',
            component: SignupComponent,
      },
      {
            path: '**',
            component: NotFoundComponent,
      }
];
