import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { WorkloadService, WorkloadEntry } from '../../services/workload.service';

@Component({
  selector: 'app-workload-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './workload-form.component.html',
  styleUrls: ['./workload-form.component.css']
})
export class WorkloadFormComponent implements OnInit {
  workloadForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';

  taskTypes = [
    { id: 'grading', name: 'Grading Assignments/Quizzes' },
    { id: 'officeHours', name: 'Office Hours' },
    { id: 'labAssistance', name: 'Lab Assistance' },
    { id: 'preparation', name: 'Lecture/Lab Preparation' },
    { id: 'meetings', name: 'Course Meetings' },
    { id: 'tutoring', name: 'Tutoring Students' },
    { id: 'other', name: 'Other Tasks' }
  ];

  // Mock courses - in a real app this would come from a service
  courses = [
    { id: 'CS101', name: 'Introduction to Computer Science' },
    { id: 'CS205', name: 'Data Structures' },
    { id: 'CS301', name: 'Algorithms' },
    { id: 'CS401', name: 'Database Systems' },
    { id: 'CS201', name: 'Object-Oriented Programming' }
  ];

  constructor(
    private fb: FormBuilder,
    private workloadService: WorkloadService,
    private router: Router
  ) {
    this.workloadForm = this.fb.group({
      taId: ['', Validators.required], // In a real app, this would be the logged-in user's ID
      taName: ['', Validators.required], // This would be auto-filled
      courseId: ['', Validators.required],
      taskType: ['', Validators.required],
      date: [this.getCurrentDate(), Validators.required],
      hoursSpent: ['', [Validators.required, Validators.min(0.5), Validators.max(12)]],
      description: ['', Validators.maxLength(300)]
    });
  }

  ngOnInit(): void {
    // In a real app, we would get the user's info and populate the form
    this.workloadForm.patchValue({
      taId: 'TA123',
      taName: 'John Doe'
    });
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  submitWorkload(): void {
    if (this.workloadForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.workloadForm.controls).forEach(key => {
        const control = this.workloadForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    const workloadEntry: WorkloadEntry = {
      id: Date.now().toString(), // Generate a unique ID
      ...this.workloadForm.value,
      timestamp: new Date().toISOString()
    };

    this.workloadService.addWorkloadEntry(workloadEntry).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.resetForm();
        // After 2 seconds, redirect to workload reports
        setTimeout(() => {
          this.router.navigate(['/reports']);
        }, 2000);
      },
      error: (err: Error) => {
        this.isSubmitting = false;
        this.submitError = true;
        this.errorMessage = err.message || 'Failed to submit workload entry. Please try again.';
      }
    });
  }

  resetForm(): void {
    // Reset the form but keep the TA info and date
    const taId = this.workloadForm.get('taId')?.value;
    const taName = this.workloadForm.get('taName')?.value;
    
    this.workloadForm.reset({
      taId,
      taName,
      date: this.getCurrentDate()
    });
  }

  // Helper methods for form validation
  hasError(controlName: string, errorName: string): boolean {
    const control = this.workloadForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorName));
  }
} 