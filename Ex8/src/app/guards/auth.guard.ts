import { Inject, inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  
  // During server-side rendering, allow access to prevent blocking
  if (!isBrowser) {
    return true;
  }
  
  if (authService.isLoggedIn()) {
    return true;
  }
  
  // Redirect to login page if not authenticated
  router.navigate(['/login']);
  return false;
}; 