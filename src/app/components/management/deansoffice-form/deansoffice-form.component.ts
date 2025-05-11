import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DeansOfficeService, DeansOffice } from '../../../services/deansoffice.service';

@Component({
  selector: 'app-deansoffice-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <header class="content-header">
        <h1>{{ isEditMode ? 'Edit Staff Member' : 'Add Staff Member' }}</h1>
        <p class="subtitle">{{ isEditMode ? 'Update staff member information' : 'Create a new deans office staff account' }}</p>
      </header>

      <form [formGroup]="staffForm" (ngSubmit)="onSubmit()" class="form-container">
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
          <button type="button" routerLink="/deansoffice" class="btn btn-outline">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="staffForm.invalid || isSubmitting">
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
export class DeansOfficeFormComponent implements OnInit {
  staffForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  staffId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private deansOfficeService: DeansOfficeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.staffForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.staffId = +id;
      this.loadStaffMember(this.staffId);
    }
  }

  loadStaffMember(id: number): void {
    this.deansOfficeService.getDeansOfficeById(id).subscribe({
      next: (staff) => {
        this.staffForm.patchValue({
          name: staff.name,
          surname: staff.surname,
          email: staff.email
        });
        // Don't set password in edit mode
        this.staffForm.get('password')?.clearValidators();
        this.staffForm.get('password')?.updateValueAndValidity();
      },
      error: (err) => {
        console.error('Error loading staff member:', err);
        this.router.navigate(['/deansoffice']);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.staffForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.staffForm.valid) {
      this.isSubmitting = true;
      const staffData = this.staffForm.value;

      const request = this.isEditMode && this.staffId
        ? this.deansOfficeService.updateDeansOffice(this.staffId, staffData)
        : this.deansOfficeService.createDeansOffice(staffData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/deansoffice']);
        },
        error: (err) => {
          console.error('Error saving staff member:', err);
          this.isSubmitting = false;
        }
      });
    }
  }
} 