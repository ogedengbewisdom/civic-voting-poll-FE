import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth-service';
import { map } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.profile$.pipe(
    map((data) => {
      if (data?.role === 'admin') {
        return true;
      } else {
        router.navigate(['/app/polls']);
        return false;
      }
    }),
  );
};
