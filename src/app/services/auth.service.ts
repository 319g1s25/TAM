import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';

export interface LoginResponse {
  success: boolean;
  message?: string;
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

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
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

  public get isInstructor(): boolean {
    return this.currentUserValue?.role === 'instructor';
  }

  public get isTA(): boolean {
    return this.currentUserValue?.role === 'ta';
  }

  public get isAuthStaff(): boolean {
    return this.currentUserValue?.role === 'authstaff';
  }

  public get isDeansOffice(): boolean {
    return this.currentUserValue?.role === 'deansoffice';
  }

  public get isDepartmentChair(): boolean {
    return this.currentUserValue?.role === 'departmentchair';
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      map(response => {
        if (response && response.success && response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));

          const expirationDate = new Date(new Date().getTime() + response.expiresIn * 1000);
          localStorage.setItem('tokenExpiration', expirationDate.toISOString());

          this.currentUserSubject.next(response.user);
          this.autoLogout(response.expiresIn * 1000);
          return response.user;
        } else {
          throw new Error(response.message || 'Login failed');
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error?.message || 'Invalid credentials'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tokenExpiration');
    this.currentUserSubject.next(null);
    this.clearLogoutTimer();
    this.router.navigate(['/login']);
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

  hasRole(requiredRole: string | string[]): boolean {
    if (!this.currentUserValue) return false;
    
    console.log('Checking role access:', {
      currentRole: this.currentUserValue.role,
      requiredRole: requiredRole
    });

    if (Array.isArray(requiredRole)) {
      return requiredRole.some(role => this.currentUserValue?.role === role);
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
