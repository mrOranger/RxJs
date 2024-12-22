import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

export function authGuard (): CanActivateFn {

      return function (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

            const router = inject(Router);
            const isAuthenticated = false;

            if (isAuthenticated) {
                  return Promise.resolve(true);
            }

            return router.navigateByUrl('/unauthorized');
      }

}
