import { Routes } from '@angular/router';
import { routes as authenticationRoutes } from './authentication/authentication.routes';
import { NotFoundComponent } from './shared';

export const routes: Routes = [
      {
            path: '',
            redirectTo: '/authentication/login',
            pathMatch: 'full',
      },
      {
            path: 'authentication',
            children: authenticationRoutes
      },
      {
            path: '**',
            component: NotFoundComponent,
      }
];
