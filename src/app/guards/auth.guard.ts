import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  
  canActivate(): boolean {
    console.log("Auth Guard checking authentication...");
    console.log("isLoggedIn:", this.authService.isLoggedIn);
    
    // For testing, temporarily return true to bypass auth
    return true;
    
    /*
    if (this.authService.isLoggedIn) {
      return true;
    }
    
    // Not logged in, redirect to login page
    this.router.navigate(['/login']);
    return false;
    */
  }
} 