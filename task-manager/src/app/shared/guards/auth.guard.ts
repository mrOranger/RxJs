import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

export function authGuard (shouldBeAuthenticated: boolean): CanActivateFn {
      return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
            const isAuthenticated = localStorage.getItem('auth_key');
            if (shouldBeAuthenticated) {
                  return isAuthenticated ? true : false;
            }
            return !isAuthenticated ? true : false;
      };
};
