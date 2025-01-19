import { Routes } from '@angular/router';
import { authGuard, NotFoundComponent } from './shared';

export const routes: Routes = [
      {
            path: '',
            pathMatch: 'full',
            redirectTo: '/home',
      },
      {
            path: 'authentication',
            loadChildren: () => import('./authentication/authentication.routes').then((m) => m.routes),
            canActivateChild: [authGuard(false)],
      },
      {
            path: '',
            loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
            children: [
                  {
                        path: 'home',
                        loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
                        canActivate: [authGuard(true)],
                  },
                  {
                        path: 'projects',
                        loadComponent: () =>
                              import('./projects/components/project-list/project-list.component').then(
                                    (m) => m.ProjectListComponent,
                              ),
                        canActivate: [authGuard(true)],
                  },
                  {
                        path: 'statistics',
                        loadComponent: () =>
                              import('./statistics/components/main/main.component').then((m) => m.MainComponent),
                        canActivate: [authGuard(true)],
                  },
            ],
      },
      {
            path: '**',
            component: NotFoundComponent,
      },
];
