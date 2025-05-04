import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { WorkloadService } from '../../services/workload.service';
import { WorkloadEntry } from '../../shared/models/task.model';
import {Course} from '../../shared/models/course.model';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';;

@Component({
  selector: 'app-workload-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './workload-form.component.html',
  styleUrls: ['./workload-form.component.css']
})
export class WorkloadFormComponent implements OnInit {
  workloadForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';
  courses: Course[] = [];
  currentTaId: string = '';

  taskTypes = [
    { id: 'grading', name: 'Grading Assignments/Quizzes' },
    { id: 'officeHours', name: 'Office Hours' },
    { id: 'labAssistance', name: 'Lab Assistance' },
    { id: 'preparation', name: 'Lecture/Lab Preparation' },
    { id: 'meetings', name: 'Course Meetings' },
    { id: 'tutoring', name: 'Tutoring Students' },
    { id: 'other', name: 'Other Tasks' }
  ];

  constructor(
    private fb: FormBuilder,
    private workloadService: WorkloadService,
    private authService: AuthService, 
    private router: Router
  ) {
    this.workloadForm = this.fb.group({
      courseID: ['', Validators.required],
      taID: ['', Validators.required],
      hoursspent: ['', [Validators.required, Validators.min(0.5), Validators.max(12)]],
      date: [this.getCurrentDate(), Validators.required],
      description: ['', Validators.maxLength(300)],
      tasktype: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get courses from backend
    this.workloadService.getCourses().subscribe({
      next: (response) => {
        console.log('Courses fetched:', response);
        this.courses = response; // ✅ Handle raw array
      },
      error: (error) => {
        console.error('HTTP error fetching courses:', error);
        this.errorMessage = 'Failed to load courses. Please try again later.';
      }
    });    

    // Get TA info from session
    const currentUser = this.authService.currentUserValue;
  if (currentUser && currentUser.role === 'ta') {
    this.currentTaId = currentUser.id;
    this.workloadForm.patchValue({
      taID: currentUser.id
    });
  }
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  submitWorkload(): void {
    console.log('Submit triggered');
    if (this.workloadForm.invalid) {
      this.workloadForm.markAllAsTouched();
      console.warn('Form is invalid:', this.workloadForm.value);
      return;
    }
  
    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;
  
    const workloadEntry: WorkloadEntry = {
      id: 0, // Placeholder; backend generates this
      ...this.workloadForm.value,
      tasktype: this.workloadForm.value.tasktype,
      date: this.workloadForm.value.date,
      approved : null
    };
  
    this.workloadService.submitWorkload(workloadEntry).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.resetForm();
        setTimeout(() => this.router.navigate(['/reports']), 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = true;
        this.errorMessage = error.message || 'Failed to submit workload entry.';
      }
    });
  }
  
  resetForm(): void {
    this.workloadForm.reset({
      ta_id: this.currentTaId,
      date: this.getCurrentDate()
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.workloadForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorName));
  }
} 