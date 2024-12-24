import { Routes } from '@angular/router';
import { authGuard, NotFoundComponent } from './shared';

export const routes: Routes = [
      {
            path: '',
            redirectTo: '/authentication/login',
            pathMatch: 'full',
      },
      {
            path: 'authentication',
            loadChildren: () => import('./authentication/authentication.routes').then((m) => m.routes),
            canActivateChild: [ authGuard(false) ],
      },
      {
            path: '**',
            component: NotFoundComponent,
      }
];
