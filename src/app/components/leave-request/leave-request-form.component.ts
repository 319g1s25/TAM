import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { LeaveReqService } from '../../services/leave-request.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-leave-request-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './leave-request-form.component.html',
  styleUrls: ['./leave-request-form.component.css']
})
export class LeaveRequestFormComponent implements OnInit {
  leaveForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';
  successMessage = '';
  currentTaId: string = '';
  minDate = this.getTodayDate();
  endDateMin: string = this.minDate;

  constructor(
    private fb: FormBuilder,
    private leaveReqService: LeaveReqService,
    private authService: AuthService,
    private router: Router
  ) {
    this.leaveForm = this.fb.group({
      taID: ['', Validators.required],
      startDate: [this.minDate, Validators.required],
      endDate: [this.minDate, [Validators.required]],
      note: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(400)]]
    });
  }

  ngOnInit(): void {
    const currentUser: User | null = this.authService.currentUserValue;

    if (currentUser && currentUser.role === 'ta') {
      this.currentTaId = currentUser.id;
      this.leaveForm.patchValue({
        taID: this.currentTaId
      });
    }

    // Update end date min when start date changes
    this.leaveForm.get('startDate')?.valueChanges.subscribe(startDate => {
      if (startDate) {
        this.endDateMin = startDate;
        const endDateControl = this.leaveForm.get('endDate');
        if (endDateControl) {
          const currentEndDate = endDateControl.value;
          if (currentEndDate && new Date(currentEndDate) < new Date(startDate)) {
            endDateControl.setValue(startDate);
          }
        }
      }
    });
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  submitLeaveRequest(): void {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      console.warn('Leave form invalid:', this.leaveForm.value);
      return;
    }

    const startDate = new Date(this.leaveForm.get('startDate')?.value);
    const endDate = new Date(this.leaveForm.get('endDate')?.value);

    if (endDate < startDate) {
      this.leaveForm.get('endDate')?.setErrors({ dateRange: true });
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    const leaveData = { ...this.leaveForm.value };

    this.leaveReqService.submitLeaveRequest(leaveData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.successMessage = 'Your leave request has been submitted successfully.';
        this.resetForm();
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = true;
        this.errorMessage = err.message || 'Submission failed. Try again later.';
      }
    });
  }

  resetForm(): void {
    this.leaveForm.reset({
      taID: this.currentTaId,
      startDate: this.getTodayDate(),
      endDate: this.getTodayDate(),
      note: ''
    });
    this.endDateMin = this.minDate;
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.leaveForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorName));
  }
}
