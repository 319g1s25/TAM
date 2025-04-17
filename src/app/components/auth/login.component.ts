import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }
  
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;
    
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password)
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Failed to login. Please check your credentials.';
        }
      });
  }
  
  loginAsDemo(role: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    let credentials;
    switch (role) {
      case 'admin':
        credentials = { email: 'admin@example.com', password: 'admin123' };
        break;
      case 'coordinator':
        credentials = { email: 'coordinator@example.com', password: 'coord123' };
        break;
      case 'ta':
        credentials = { email: 'ta@example.com', password: 'ta123456' };
        break;
      default:
        this.isLoading = false;
        this.errorMessage = 'Invalid demo role selected';
        return;
    }
    
    this.authService.login(credentials.email, credentials.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Failed to login with demo account.';
        }
      });
  }
} 