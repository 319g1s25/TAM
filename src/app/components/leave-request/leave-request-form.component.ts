import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-leave-request-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="leave-request-container">
      <header class="content-header">
        <h1>Request Leave of Absence</h1>
        <p class="subtitle">Submit your leave request for approval by instructors</p>
      </header>
      
      <div class="card">
        <div *ngIf="isLoading" class="loading-container">
          <div class="loader"></div>
          <p>Processing your request...</p>
        </div>
        
        <div *ngIf="!isLoading">
          <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()" class="leave-form">
            <div class="form-group">
              <label for="startDate">Start Date <span class="required">*</span></label>
              <input type="date" id="startDate" formControlName="startDate" class="form-control" [min]="minDate">
              <div *ngIf="leaveForm.get('startDate')?.invalid && leaveForm.get('startDate')?.touched" class="error-message">
                Start date is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="endDate">End Date <span class="required">*</span></label>
              <input type="date" id="endDate" formControlName="endDate" class="form-control" [min]="minDate">
              <div *ngIf="leaveForm.get('endDate')?.invalid && leaveForm.get('endDate')?.touched" class="error-message">
                End date is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="reason">Reason <span class="required">*</span></label>
              <select id="reason" formControlName="reason" class="form-control">
                <option value="" disabled>Select a reason</option>
                <option value="medical">Medical</option>
                <option value="personal">Personal</option>
                <option value="family">Family Emergency</option>
                <option value="academic">Academic Commitment</option>
                <option value="other">Other</option>
              </select>
              <div *ngIf="leaveForm.get('reason')?.invalid && leaveForm.get('reason')?.touched" class="error-message">
                A reason is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="details">Details <span class="required">*</span></label>
              <textarea id="details" formControlName="details" class="form-control" rows="5" placeholder="Please provide details about your leave request..."></textarea>
              <div *ngIf="leaveForm.get('details')?.invalid && leaveForm.get('details')?.touched" class="error-message">
                <div *ngIf="leaveForm.get('details')?.errors?.['required']">Details are required</div>
                <div *ngIf="leaveForm.get('details')?.errors?.['minlength']">Details must be at least 10 characters</div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="courseIds">Affected Courses <span class="required">*</span></label>
              <select id="courseIds" formControlName="courseIds" multiple class="form-control" size="4">
                <option *ngFor="let course of assignedCourses" [value]="course.id">
                  {{ course.code }} - {{ course.name }}
                </option>
              </select>
              <div *ngIf="leaveForm.get('courseIds')?.invalid && leaveForm.get('courseIds')?.touched" class="error-message">
                At least one course must be selected
              </div>
              <small class="form-text text-muted">Hold Ctrl/Cmd to select multiple courses</small>
            </div>
            
            <div class="form-group">
              <label for="contactInfo">Emergency Contact Information</label>
              <input type="text" id="contactInfo" formControlName="contactInfo" class="form-control" placeholder="Phone number or email">
            </div>
            
            <div class="actions">
              <button type="button" routerLink="/dashboard" class="btn btn-outline">Cancel</button>
              <button type="submit" [disabled]="leaveForm.invalid || isSubmitting" class="btn btn-primary">
                <svg *ngIf="isSubmitting" class="svg-icon animate-spin" viewBox="0 0 24 24">
                  <path d="M12 22c5.523 0 10-4.477 10-10h-2c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8V2C6.477 2 2 6.477 2 12s4.477 10 10 10z"></path>
                </svg>
                Submit Request
              </button>
            </div>
          </form>
          
          <div *ngIf="successMessage" class="success-message">
            {{ successMessage }}
            <p>
              <a routerLink="/leave-requests" class="link">View my leave requests</a>
            </p>
          </div>
          
          <div *ngIf="errorMessage" class="error-message global-error">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .leave-request-container {
      padding: 20px;
    }
    
    .content-header {
      margin-bottom: 20px;
    }
    
    .content-header h1 {
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--primary-text-color);
    }
    
    .subtitle {
      color: var(--light-text-color);
      font-size: 1rem;
    }
    
    .card {
      background: var(--card-color);
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }
    
    .leave-form {
      display: grid;
      gap: 20px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
    }
    
    label {
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    
    .required {
      color: #e74c3c;
    }
    
    .form-control {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
    }
    
    textarea.form-control {
      resize: vertical;
      min-height: 120px;
    }
    
    .form-text {
      font-size: 0.8rem;
      margin-top: 4px;
      color: var(--light-text-color);
    }
    
    .actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 10px;
    }
    
    .btn {
      padding: 10px 16px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      transition: background-color 0.2s ease, color 0.2s ease;
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 120px;
    }
    
    .btn-outline {
      background-color: transparent;
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
    }
    
    .btn-outline:hover {
      background-color: var(--primary-light-color);
    }
    
    .btn-accent {
      background-color: var(--accent-color);
      color: white;
      border: none;
    }
    
    .btn-accent:hover {
      background-color: var(--accent-dark-color);
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .error-message {
      color: #e74c3c;
      font-size: 0.85rem;
      margin-top: 4px;
    }
    
    .success-message {
      background-color: #e8f8ef;
      color: #27ae60;
      padding: 12px;
      border-radius: 4px;
      margin-top: 20px;
      text-align: center;
    }
    
    .global-error {
      background-color: #fdeaeb;
      padding: 12px;
      border-radius: 4px;
      margin-top: 20px;
      text-align: center;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 0;
    }
    
    .loader {
      border: 4px solid #f3f3f3;
      border-top: 4px solid var(--primary-color);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
    }
    
    .link:hover {
      text-decoration: underline;
    }
    
    .svg-icon {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      fill: currentColor;
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @media (max-width: 768px) {
      .leave-form {
        gap: 16px;
      }
      
      .actions {
        flex-direction: column;
      }
      
      .btn {
        width: 100%;
      }
    }
  `]
})
export class LeaveRequestFormComponent implements OnInit {
  leaveForm: FormGroup;
  currentUser: User | null = null;
  isLoading = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  minDate = '';
  
  assignedCourses = [
    { id: 1, code: 'CS101', name: 'Introduction to Programming' },
    { id: 2, code: 'CS201', name: 'Data Structures' },
    { id: 3, code: 'MATH250', name: 'Linear Algebra' }
  ]; // This would be fetched from a service in a real app
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.leaveForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required],
      details: ['', [Validators.required, Validators.minLength(10)]],
      courseIds: [[], Validators.required],
      contactInfo: ['']
    });
    
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }
  
  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      // In a real app, you would fetch the TA's assigned courses here
    });
  }
  
  onSubmit(): void {
    if (this.leaveForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.leaveForm.controls).forEach(key => {
        const control = this.leaveForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting = true;
    const formData = this.leaveForm.value;
    
    // In a real app, you would call a service to submit the leave request
    setTimeout(() => {
      // Simulate API call
      this.isSubmitting = false;
      this.successMessage = 'Your leave request has been submitted successfully. You will be notified once it is reviewed.';
      this.leaveForm.reset();
    }, 1500);
  }
} 