import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};

export const redirectIfLoggedInGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
  
    return authService.user$.pipe(
      take(1),
      map(user => {
        if (user) {
          router.navigate(['/']);
          return false;
        } else {
          return true;
        }
      })
    );
  };
