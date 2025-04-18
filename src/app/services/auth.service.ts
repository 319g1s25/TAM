import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DatabaseService } from './database.service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coordinator' | 'ta';
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenExpirationTimer: any;
  private apiUrl = 'http://localhost:3000/api';
  private useMockData = true; // Set to false when ready to use real database

  constructor(
    private http: HttpClient,
    private router: Router,
    private db: DatabaseService
  ) {
    // Initialize from local storage if available
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
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

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  public get isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  public get isCoordinator(): boolean {
    return this.currentUserValue?.role === 'coordinator';
  }

  public get isTA(): boolean {
    return this.currentUserValue?.role === 'ta';
  }

  // Login method - accepts email and password
  login(email: string, password: string): Observable<User> {
    if (this.useMockData) {
      return this.mockLogin(email, password);
    } else {
      // Real database login
      return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
        .pipe(
          map(response => {
            if (response.success && response.user) {
              // Store user details and token in local storage
              localStorage.setItem('currentUser', JSON.stringify(response.user));
              this.currentUserSubject.next(response.user);
              return response.user;
            } else {
              throw new Error(response.message || 'Login failed');
            }
          }),
          catchError(error => {
            console.error('Login error:', error);
            return throwError(() => new Error(error.message || 'Invalid credentials'));
          })
        );
    }
  }

  // Mock login for development until database is connected
  private mockLogin(email: string, password: string): Observable<User> {
    // Check for demo account credentials
    if (email === 'admin@example.com' && password === 'admin123') {
      return this.demoLogin('admin');
    }
    if (email === 'coordinator@example.com' && password === 'coord123') {
      return this.demoLogin('coordinator');
    }
    if (email === 'ta@example.com' && password === 'ta123456') {
      return this.demoLogin('ta');
    }
    
    // Default demo account
    if (email === 'demo' && password === 'password') {
      const user: User = {
        id: '3',
        name: 'Demo TA',
        email: 'ta@example.com',
        role: 'ta'
      };
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return of(user);
    }
    
    // If no matching credentials
    return throwError(() => new Error('Invalid email or password'));
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
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Also store token expiration
    const expirationDate = new Date(new Date().getTime() + 2 * 60 * 60 * 1000); // 2 hours
    localStorage.setItem('tokenExpiration', expirationDate.toISOString());
    
    return of(user);
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
    // Remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tokenExpiration');
    this.currentUserSubject.next(null);
    this.clearLogoutTimer();
    this.router.navigate(['/login']);
  }

  // Guards for role-based access
  hasRole(requiredRole: string | string[]): boolean {
    if (!this.currentUserValue) {
      return false;
    }

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(this.currentUserValue.role);
    }
    
    return this.currentUserValue.role === requiredRole;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  getRememberedUser(): string | null {
    return localStorage.getItem('remember_user');
  }
} 