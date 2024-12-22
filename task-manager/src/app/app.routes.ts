import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared';

export const routes: Routes = [
      {
            path: '',
            redirectTo: '/authentication/login',
            pathMatch: 'full',
      },
      {
            path: 'authentication',
            loadChildren: () => import('./authentication/authentication.routes').then((m) => m.routes),
      },
      {
            path: '**',
            component: NotFoundComponent,
      }
];
