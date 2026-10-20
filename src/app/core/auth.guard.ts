import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (isAdmin) {
    return true;
  }
  return router.createUrlTree(['/']);
};
