import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check if user is authenticated

    console.log('AuthGuard - Attempting to access:', state.url);

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    

    // Check for required roles
    const requiredRoles = route.data['roles'] as string[];
    console.log('AuthGuard - Required roles:', requiredRoles);

    if (requiredRoles && requiredRoles.length > 0) {
      const hasAccess = this.authService.hasRole(requiredRoles);
      console.log('AuthGuard - Has access:', hasAccess);

      if (!hasAccess) {
        console.warn('AuthGuard - Access denied. Redirecting to /unauthorized');
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    console.log('AuthGuard - Access granted');
    return true;
  }
} 