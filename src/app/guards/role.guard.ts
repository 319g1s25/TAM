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
    console.log('🛡️ RoleGuard triggered for:', state.url);
  
    if (!this.authService.isLoggedIn) {
      console.warn('🚫 Not logged in. Redirecting to /login');
      this.router.navigate(['/login']);
      return false;
    }
  
    const requiredRoles = route.data['roles'] as string[];
    console.log('🔐 Required roles:', requiredRoles);
    console.log('👤 Current role flags:', {
      isInstructor: this.authService.isInstructor,
      isAuthStaff: this.authService.isAuthStaff,
      isDepartmentChair: this.authService.isDepartmentChair,
      isDeansOffice: this.authService.isDeansOffice,
      isTA: this.authService.isTA
    });
  
    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('✅ No role restrictions, access granted');
      return true;
    }
  
    const hasRole = requiredRoles.some(role => {
      switch (role) {
        case 'authstaff': return this.authService.isAuthStaff;
        case 'deansoffice': return this.authService.isDeansOffice;
        case 'departmentchair': return this.authService.isDepartmentChair;
        case 'instructor': return this.authService.isInstructor;
        case 'ta': return this.authService.isTA;
        default: return false;
      }
    });
  
    console.log(`✅ Role check result for '${state.url}':`, hasRole);
  
    if (hasRole) return true;
  
    console.warn('🚫 Access denied. Redirecting to /dashboard');
    this.router.navigate(['/dashboard']);
    return false;
  }
  
} 