import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

export function authGuard (shouldBeAuthenticated: boolean): CanActivateFn {
      return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
            const router = inject(Router);
            const isAuthenticated = localStorage.getItem('auth_key');

            if (shouldBeAuthenticated) {
                  if (isAuthenticated) {
                        return true;
                  }
                  router.navigate(['/authentication/login']);
                  return false;
            }
            if (!isAuthenticated) {
                  return true;
            }
            router.navigate(['/home']);
            return false;
      };
};
