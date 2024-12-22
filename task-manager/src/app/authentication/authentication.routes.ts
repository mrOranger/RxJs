import { Routes } from '@angular/router';
import { LoginComponent, SignupComponent } from './components';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
      {
            path: 'login',
            component: LoginComponent,
            canActivate: [authGuard()],
      },
      {
            path: 'signup',
            component: SignupComponent,
            canActivate: [authGuard()],
      },
];
