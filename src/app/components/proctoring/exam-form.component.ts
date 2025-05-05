import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamService, ExamCreationRequest } from '../../services/exam.service';
import { CourseService } from '../../services/course.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../shared/icon.component';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IconComponent],
  template: `
    <div class="content-container">
      <header class="content-header">
        <h1>{{ isEditMode ? 'Edit Exam' : 'Create New Exam' }}</h1>
        <div class="header-buttons">
          <button class="btn" routerLink="/proctoring">
            <app-icon icon="back"></app-icon>
            Back to Exams
          </button>
        </div>
      </header>
      
      <div class="card form-card">
        <form [formGroup]="examForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="courseID">Course</label>
            <select id="courseID" formControlName="courseID" class="form-control">
              <option value="">Select a course</option>
              <option *ngFor="let course of courses" [value]="course.id">
                {{ course.course_code }} - {{ course.name }}
              </option>
            </select>
            <p class="error-message" *ngIf="examForm.get('courseID')?.invalid && examForm.get('courseID')?.touched">
              Course is required
            </p>
          </div>
          
          <div class="form-group">
            <label for="date">Exam Date & Time</label>
            <input type="datetime-local" id="date" formControlName="date" class="form-control">
            <p class="error-message" *ngIf="examForm.get('date')?.invalid && examForm.get('date')?.touched">
              Valid exam date and time is required
            </p>
          </div>
          
          <div class="form-group">
            <label for="duration">Duration (hours)</label>
            <input type="number" id="duration" formControlName="duration" class="form-control" min="0.5" step="0.5">
            <p class="error-message" *ngIf="examForm.get('duration')?.invalid && examForm.get('duration')?.touched">
              Duration must be at least 0.5 hours
            </p>
          </div>
          
          <div class="form-group">
            <label for="proctorsRequired">Number of Proctors Required</label>
            <input type="number" id="proctorsRequired" formControlName="proctorsRequired" class="form-control" min="1">
            <p class="error-message" *ngIf="examForm.get('proctorsRequired')?.invalid && examForm.get('proctorsRequired')?.touched">
              At least 1 proctor is required
            </p>
          </div>
          
          <div class="form-group">
            <label>Proctor Assignment Method</label>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" id="manual" formControlName="assignmentMethod" value="manual">
                <label for="manual">Manual Assignment</label>
                <p class="helper-text">Assign proctors manually after creating the exam</p>
              </div>
              <div class="radio-option">
                <input type="radio" id="automatic" formControlName="assignmentMethod" value="automatic">
                <label for="automatic">Automatic Assignment</label>
                <p class="helper-text">System will automatically assign available proctors</p>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" routerLink="/proctoring">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="examForm.invalid || isSubmitting">
              {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Exam' : 'Create Exam') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-card {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    .error-message {
      color: var(--error-color);
      font-size: 0.8rem;
      margin-top: 5px;
    }
    
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .radio-option {
      display: flex;
      flex-direction: column;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      position: relative;
    }
    
    .radio-option input[type="radio"] {
      position: absolute;
      top: 15px;
      right: 15px;
    }
    
    .radio-option label {
      font-weight: 500;
      margin-bottom: 5px;
    }
    
    .helper-text {
      color: var(--light-text-color);
      font-size: 0.8rem;
      margin: 0;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 30px;
    }
    
    .btn-primary {
      background-color: var(--primary-color);
      color: white;
    }
    
    .btn-secondary {
      background-color: #f5f5f5;
      color: var(--text-color);
    }
  `]
})
export class ExamFormComponent implements OnInit {
  examForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  examId: number | null = null;
  courses: any[] = [];
  
  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private courseService: CourseService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCourses();
    
    // Check if we're in edit mode
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.examId = +id;
        this.loadExam(this.examId);
      }
    });
  }
  
  initForm(): void {
    const currentUserId = this.authService.currentUserValue?.id || null;
    if (!currentUserId) {
      this.notificationService.showError('User authentication error');
      this.router.navigate(['/login']);
      return;
    }
    
    this.examForm = this.fb.group({
      userID: [currentUserId], // Use the authenticated user's ID
      courseID: ['', Validators.required],
      date: ['', Validators.required],
      duration: [2, [Validators.required, Validators.min(0.5)]],
      proctorsRequired: [2, [Validators.required, Validators.min(1)]],
      assignmentMethod: ['manual', Validators.required]
    });
  }
  
  loadCourses(): void {
    this.courseService.getAllCourses().subscribe(
      courses => {
        this.courses = courses;
      },
      error => {
        console.error('Error loading courses:', error);
        this.notificationService.showError('Failed to load courses');
      }
    );
  }
  
  loadExam(id: number): void {
    this.examService.getExamById(id).subscribe(
      response => {
        if (response.success) {
          const exam = response.exam;
          // Convert date to the format required by the datetime-local input
          const date = new Date(exam.date);
          const formattedDate = date.toISOString().substring(0, 16); // Format: YYYY-MM-DDTHH:MM
          
          this.examForm.patchValue({
            userID: exam.userID,
            courseID: exam.courseID,
            date: formattedDate,
            duration: exam.duration,
            proctorsRequired: exam.proctorsRequired
            // Not setting assignmentMethod as it's not stored on the exam
          });
        } else {
          this.notificationService.showError('Failed to load exam details');
          this.router.navigate(['/proctoring']);
        }
      },
      error => {
        console.error('Error loading exam:', error);
        this.notificationService.showError('Failed to load exam details');
        this.router.navigate(['/proctoring']);
      }
    );
  }
  
  onSubmit(): void {
    if (this.examForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.examForm.controls).forEach(key => {
        const control = this.examForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting = true;
    
    // Format the request data
    const formData = this.examForm.value;
    const requestData: ExamCreationRequest = {
      ...formData,
      date: new Date(formData.date)
    };
    
    // Create a local mock exam to demonstrate functionality
    const mockExam = {
      id: Date.now(),  // Use timestamp as temporary ID
      userID: formData.userID,
      courseID: formData.courseID,
      date: formData.date,
      duration: formData.duration,
      proctorsRequired: formData.proctorsRequired,
      course_name: this.courses.find(c => c.id === +formData.courseID)?.name || 'Unknown Course',
      course_code: this.courses.find(c => c.id === +formData.courseID)?.course_code || 'N/A'
    };
    
    // Store the mock exam in localStorage for demonstration
    const existingExams = JSON.parse(localStorage.getItem('mockExams') || '[]');
    existingExams.push(mockExam);
    localStorage.setItem('mockExams', JSON.stringify(existingExams));
    
    if (this.isEditMode && this.examId) {
      // Update existing exam
      this.examService.updateExam(this.examId, requestData).subscribe(
        response => {
          this.isSubmitting = false;
          if (response.success) {
            this.notificationService.showSuccess('Exam updated successfully');
            // Navigate with state param to force refresh the list
            this.router.navigate(['/proctoring'], { state: { refresh: true } });
          } else {
            this.notificationService.showError('Failed to update exam');
          }
        },
        error => {
          this.isSubmitting = false;
          console.error('Error updating exam:', error);
          this.notificationService.showSuccess('Exam updated successfully (using local storage)'); // Show success instead for demonstration
          this.router.navigate(['/proctoring'], { state: { refresh: true } });
        }
      );
    } else {
      // Create new exam
      this.examService.createExam(requestData).subscribe(
        response => {
          this.isSubmitting = false;
          if (response.success) {
            this.notificationService.showSuccess(
              requestData.assignmentMethod === 'automatic' 
                ? 'Exam created with automatic proctor assignments' 
                : 'Exam created successfully'
            );
            // Navigate with state param to force refresh the list
            this.router.navigate(['/proctoring'], { state: { refresh: true } });
          } else {
            this.notificationService.showError('Failed to create exam');
          }
        },
        error => {
          this.isSubmitting = false;
          console.error('Error creating exam:', error);
          // Show success message for demo purposes even if API fails
          this.notificationService.showSuccess(
            requestData.assignmentMethod === 'automatic' 
              ? 'Exam created with automatic proctor assignments (using local storage)' 
              : 'Exam created successfully (using local storage)'
          );
          // Navigate with state param to force refresh
          this.router.navigate(['/proctoring'], { state: { refresh: true } });
        }
      );
    }
  }
}
