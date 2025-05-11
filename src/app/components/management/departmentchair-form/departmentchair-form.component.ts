import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentChairService } from '../../../services/departmentchair.service';

@Component({
  selector: 'app-departmentchair-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <header class="content-header">
        <h1>{{ isEditMode ? 'Edit Department Chair' : 'Add Department Chair' }}</h1>
        <p class="subtitle">{{ isEditMode ? 'Update department chair information' : 'Create a new department chair account' }}</p>
      </header>

      <form [formGroup]="chairForm" (ngSubmit)="onSubmit()" class="form-container">
        <div class="form-group">
          <label for="name">First Name</label>
          <input
            type="text"
            id="name"
            formControlName="name"
            class="form-control"
            [class.is-invalid]="chairForm.get('name')?.invalid && chairForm.get('name')?.touched"
          >
          <div class="invalid-feedback" *ngIf="chairForm.get('name')?.errors?.['required'] && chairForm.get('name')?.touched">
            First name is required
          </div>
        </div>

        <div class="form-group">
          <label for="surname">Last Name</label>
          <input
            type="text"
            id="surname"
            formControlName="surname"
            class="form-control"
            [class.is-invalid]="chairForm.get('surname')?.invalid && chairForm.get('surname')?.touched"
          >
          <div class="invalid-feedback" *ngIf="chairForm.get('surname')?.errors?.['required'] && chairForm.get('surname')?.touched">
            Last name is required
          </div>
        </div>

        <div class="form-group">
          <label for="department">Department</label>
          <input
            type="text"
            id="department"
            formControlName="department"
            class="form-control"
            [class.is-invalid]="chairForm.get('department')?.invalid && chairForm.get('department')?.touched"
          >
          <div class="invalid-feedback" *ngIf="chairForm.get('department')?.errors?.['required'] && chairForm.get('department')?.touched">
            Department is required
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="form-control"
            [class.is-invalid]="chairForm.get('email')?.invalid && chairForm.get('email')?.touched"
          >
          <div class="invalid-feedback" *ngIf="chairForm.get('email')?.errors?.['required'] && chairForm.get('email')?.touched">
            Email is required
          </div>
          <div class="invalid-feedback" *ngIf="chairForm.get('email')?.errors?.['email'] && chairForm.get('email')?.touched">
            Please enter a valid email address
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            formControlName="password"
            class="form-control"
            [class.is-invalid]="chairForm.get('password')?.invalid && chairForm.get('password')?.touched"
          >
          <div class="invalid-feedback" *ngIf="chairForm.get('password')?.errors?.['required'] && chairForm.get('password')?.touched">
            Password is required
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="chairForm.invalid">
            {{ isEditMode ? 'Update' : 'Create' }} Department Chair
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
      font-weight: 500;
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

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #1976d2;
      color: white;
      border: none;
    }

    .btn-primary:hover {
      background: #1565c0;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-outline {
      background: white;
      border: 1px solid #ddd;
      color: #666;
    }

    .btn-outline:hover {
      background: #f5f5f5;
    }
  `]
})
export class DepartmentChairFormComponent implements OnInit {
  chairForm: FormGroup;
  isEditMode = false;
  chairId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private departmentChairService: DepartmentChairService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.chairForm = this.fb.group({
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
      this.chairId = +id;
      this.loadChairData();
    }
  }

  loadChairData(): void {
    if (this.chairId) {
      this.departmentChairService.getDepartmentChair(this.chairId).subscribe({
        next: (chair) => {
          this.chairForm.patchValue({
            name: chair.name,
            surname: chair.surname,
            department: chair.department,
            email: chair.email
          });
          // Don't set password in edit mode
          this.chairForm.get('password')?.clearValidators();
          this.chairForm.get('password')?.updateValueAndValidity();
        },
        error: (err) => {
          console.error('Error loading department chair:', err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.chairForm.valid) {
      const chairData = this.chairForm.value;
      
      if (this.isEditMode && this.chairId) {
        this.departmentChairService.updateDepartmentChair(this.chairId, chairData).subscribe({
          next: () => {
            this.router.navigate(['/departmentchairs']);
          },
          error: (err) => {
            console.error('Error updating department chair:', err);
          }
        });
      } else {
        this.departmentChairService.createDepartmentChair(chairData).subscribe({
          next: () => {
            this.router.navigate(['/departmentchairs']);
          },
          error: (err) => {
            console.error('Error creating department chair:', err);
          }
        });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/departmentchairs']);
  }
} 