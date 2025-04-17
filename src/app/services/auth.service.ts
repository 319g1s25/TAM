import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'coordinator' | 'ta';
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenExpirationTimer: any;
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Check if token is expired
        const expiration = localStorage.getItem('tokenExpiration');
        if (expiration && new Date(expiration) > new Date()) {
          this.currentUserSubject.next(user);
          this.autoLogout(new Date(expiration).getTime() - new Date().getTime());
        } else {
          this.logout();
        }
      } catch (error) {
        this.logout();
      }
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get userRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  login(username: string, password: string): Observable<User> {
    // Check for demo account credentials
    if (username === 'admin@example.com' && password === 'admin123') {
      return this.demoLogin('admin');
    }
    if (username === 'coordinator@example.com' && password === 'coord123') {
      return this.demoLogin('coordinator');
    }
    if (username === 'ta@example.com' && password === 'ta123456') {
      return this.demoLogin('ta');
    }
    
    // Default demo account
    if (username === 'demo' && password === 'password') {
      const user: User = {
        id: 'demo-1',
        email: 'demo@example.com',
        name: 'Demo User',
        role: 'ta' as const,
        token: 'demo-token-ta'
      };
      this.setUserData(user, 3600);
      return of(user);
    }
    
    // If no matching credentials
    return throwError(() => new Error('Invalid username or password'));
    
    /* Uncomment for real implementation
    return this.http.post<{ user: User, token: string }>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          this.setUserData(response.user, response.token);
        }),
        map(response => response.user),
        catchError(error => {
          console.error('Login error', error);
          return throwError(() => error.error?.message || 'Login failed. Please try again.');
        })
      );
    */
  }

  // Demo login for development purposes
  demoLogin(role: 'admin' | 'coordinator' | 'ta'): Observable<User> {
    const demoUsers = {
      admin: {
        id: 'admin-1',
        email: 'admin@example.com',
        name: 'Demo Admin',
        role: 'admin' as const,
        token: 'demo-token-admin'
      },
      coordinator: {
        id: 'coord-1',
        email: 'coordinator@example.com',
        name: 'Demo Coordinator',
        role: 'coordinator' as const,
        token: 'demo-token-coordinator'
      },
      ta: {
        id: 'ta-1',
        email: 'ta@example.com',
        name: 'Demo TA',
        role: 'ta' as const,
        token: 'demo-token-ta'
      }
    };

    const user = demoUsers[role];
    this.setUserData(user, 3600);
    return of(user);
  }

  private setUserData(user: User, expiresInSeconds: number): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Set token expiration
    const expirationDate = new Date(
      new Date().getTime() + expiresInSeconds * 1000
    );
    localStorage.setItem('tokenExpiration', expirationDate.toISOString());
    
    this.currentUserSubject.next(user);
    this.autoLogout(expiresInSeconds * 1000);
  }

  private autoLogout(expirationDuration: number): void {
    this.clearLogoutTimer();
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private clearLogoutTimer(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tokenExpiration');
    this.currentUserSubject.next(null);
    this.clearLogoutTimer();
    this.router.navigate(['/login']);
  }

  // Guards for role-based access
  hasRole(requiredRole: string | string[]): boolean {
    if (!this.currentUser) {
      return false;
    }

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(this.currentUser.role);
    }
    
    return this.currentUser.role === requiredRole;
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  getRememberedUser(): string | null {
    return localStorage.getItem('remember_user');
  }
} 