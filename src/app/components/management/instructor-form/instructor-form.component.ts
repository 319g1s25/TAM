import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InstructorService, Instructor } from '../../../services/instructor.service';

@Component({
  selector: 'app-instructor-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <header class="content-header">
        <h1>{{ isEditMode ? 'Edit Instructor' : 'Add Instructor' }}</h1>
        <p class="subtitle">{{ isEditMode ? 'Update instructor information' : 'Create a new instructor account' }}</p>
      </header>

      <form [formGroup]="instructorForm" (ngSubmit)="onSubmit()" class="form-container">
        <div class="form-group">
          <label for="name">First Name</label>
          <input type="text" id="name" formControlName="name" class="form-control" [class.is-invalid]="isFieldInvalid('name')">
          <div class="invalid-feedback" *ngIf="isFieldInvalid('name')">
            First name is required
          </div>
        </div>

        <div class="form-group">
          <label for="surname">Last Name</label>
          <input type="text" id="surname" formControlName="surname" class="form-control" [class.is-invalid]="isFieldInvalid('surname')">
          <div class="invalid-feedback" *ngIf="isFieldInvalid('surname')">
            Last name is required
          </div>
        </div>

        <div class="form-group">
          <label for="department">Department</label>
          <input type="text" id="department" formControlName="department" class="form-control" [class.is-invalid]="isFieldInvalid('department')">
          <div class="invalid-feedback" *ngIf="isFieldInvalid('department')">
            Department is required
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" formControlName="email" class="form-control" [class.is-invalid]="isFieldInvalid('email')">
          <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
            Valid email is required
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" formControlName="password" class="form-control" [class.is-invalid]="isFieldInvalid('password')">
          <div class="invalid-feedback" *ngIf="isFieldInvalid('password')">
            Password is required
          </div>
        </div>

        <div class="form-actions">
          <button type="button" routerLink="/instructors" class="btn btn-outline">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="instructorForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
    }

    .content-header {
      margin-bottom: 2rem;
    }

    .subtitle {
      color: #666;
      margin-bottom: 1rem;
    }

    .form-container {
      max-width: 600px;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
    }

    .is-invalid {
      border-color: #dc3545;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `]
})
export class InstructorFormComponent implements OnInit {
  instructorForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  instructorId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private instructorService: InstructorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.instructorForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      department: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.instructorId = +id;
      this.loadInstructor(this.instructorId);
    }
  }

  loadInstructor(id: number): void {
    this.instructorService.getInstructorById(id).subscribe({
      next: (instructor) => {
        this.instructorForm.patchValue({
          name: instructor.name,
          surname: instructor.surname,
          department: instructor.department,
          email: instructor.email
        });
        // Don't set password in edit mode
        this.instructorForm.get('password')?.clearValidators();
        this.instructorForm.get('password')?.updateValueAndValidity();
      },
      error: (err) => {
        console.error('Error loading instructor:', err);
        this.router.navigate(['/instructors']);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.instructorForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.instructorForm.valid) {
      this.isSubmitting = true;
      const instructorData = this.instructorForm.value;

      const request = this.isEditMode && this.instructorId
        ? this.instructorService.updateInstructor(this.instructorId, instructorData)
        : this.instructorService.createInstructor(instructorData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/instructors']);
        },
        error: (err) => {
          console.error('Error saving instructor:', err);
          this.isSubmitting = false;
        }
      });
    }
  }
} 