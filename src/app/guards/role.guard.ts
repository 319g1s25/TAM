import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // First check if the user is authenticated
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    
    // Get the roles required for the route
    const requiredRoles = route.data['roles'] as string[];
    
    // If no roles specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    // Check if the user has at least one of the required roles
    const hasRole = requiredRoles.some(role => {
      switch (role) {
        case 'admin':
          return this.authService.isAdmin;
        case 'coordinator':
          return this.authService.isCoordinator;
        case 'ta':
          return this.authService.isTA;
        default:
          return false;
      }
    });
    
    if (hasRole) {
      return true;
    }
    
    // If not, redirect to dashboard
    this.router.navigate(['/dashboard']);
    return false;
  }
} 