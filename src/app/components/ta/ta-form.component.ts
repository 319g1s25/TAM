import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TA } from '../../shared/models/ta.model';
import { TAService } from '../../services/ta.service';

@Component({
  selector: 'app-ta-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <h1>{{ isEditing ? 'Edit' : 'Add' }} Teaching Assistant</h1>
      
      <div class="card">
        <form (ngSubmit)="onSubmit()" #taForm="ngForm">
          <div class="form-group">
            <label for="name">First Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              class="form-control" 
              [(ngModel)]="ta.name" 
              required
              #name="ngModel"
            >
            <div *ngIf="name.invalid && (name.dirty || name.touched)" class="error-message">
              Name is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="surname">Last Name</label>
            <input 
              type="text" 
              id="surname" 
              name="surname" 
              class="form-control" 
              [(ngModel)]="ta.surname" 
              required
              #surname="ngModel"
            >
            <div *ngIf="surname.invalid && (surname.dirty || surname.touched)" class="error-message">
              Last name is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              class="form-control" 
              [(ngModel)]="ta.email" 
              required
              email
              #email="ngModel"
            >
            <div *ngIf="email.invalid && (email.dirty || email.touched)" class="error-message">
              <div *ngIf="email.errors?.['required']">Email is required</div>
              <div *ngIf="email.errors?.['email']">Please enter a valid email</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="department">Department</label>
            <input 
              type="text" 
              id="department" 
              name="department" 
              class="form-control" 
              [(ngModel)]="ta.department" 
              required
              #department="ngModel"
            >
            <div *ngIf="department.invalid && (department.dirty || department.touched)" class="error-message">
              Department is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="msOrPhdStatus">Status</label>
            <select 
              id="msOrPhdStatus" 
              name="msOrPhdStatus" 
              class="form-control" 
              [(ngModel)]="ta.msOrPhdStatus" 
              required
              #msOrPhdStatus="ngModel"
            >
              <option value="MS">MS</option>
              <option value="PhD">PhD</option>
            </select>
            <div *ngIf="msOrPhdStatus.invalid && (msOrPhdStatus.dirty || msOrPhdStatus.touched)" class="error-message">
              Status is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="totalWorkload">Total Workload (hours)</label>
            <input 
              type="number" 
              id="totalWorkload" 
              name="totalWorkload" 
              class="form-control" 
              [(ngModel)]="ta.totalWorkload" 
              required
              min="0"
              max="40"
              #totalWorkload="ngModel"
            >
            <div *ngIf="totalWorkload.invalid && (totalWorkload.dirty || totalWorkload.touched)" class="error-message">
              <div *ngIf="totalWorkload.errors?.['required']">Workload is required</div>
              <div *ngIf="totalWorkload.errors?.['min'] || totalWorkload.errors?.['max']">
                Workload must be between 0 and 40 hours
              </div>
            </div>
          </div>
          
          <div class="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                id="isOnLeave" 
                name="isOnLeave" 
                [(ngModel)]="ta.isOnLeave"
              >
              Currently on leave
            </label>
          </div>
          
          <div class="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                id="proctoringEnabled" 
                name="proctoringEnabled" 
                [(ngModel)]="ta.proctoringEnabled"
              >
              Available for proctoring
            </label>
          </div>
          
          <div *ngIf="isEditing" class="form-group">
            <p><strong>ID:</strong> {{ ta.id }}</p>
          </div>
          
          <div class="button-group">
            <button type="submit" class="btn" [disabled]="taForm.invalid">
              {{ isEditing ? 'Update' : 'Create' }} TA
            </button>
            <a routerLink="/tas" class="btn btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .error-message {
      color: var(--warn-color);
      font-size: 0.9rem;
      margin-top: 5px;
    }
    
    .checkbox-group {
      display: flex;
      align-items: center;
    }
    
    .checkbox-group input {
      margin-right: 10px;
    }
    
    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    
    .btn-secondary {
      background-color: #9e9e9e;
    }
    
    .btn-secondary:hover {
      background-color: #757575;
    }
    
    .btn:disabled {
      background-color: #9e9e9e;
      cursor: not-allowed;
    }
  `]
})
export class TAFormComponent implements OnInit {
  ta: TA = {
    id: 0,
    name: '',
    surname: '',
    email: '',
    password: '',
    isOnLeave: false,
    totalWorkload: 0,
    msOrPhdStatus: 'MS',
    proctoringEnabled: true,
    department: ''
  };
  
  isEditing = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taService: TAService
  ) {}
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadTA(parseInt(id, 10));
    }
  }
  
  loadTA(id: number): void {
    this.taService.getTA(id).subscribe(
      ta => {
        this.ta = ta;
      },
      error => {
        console.error('Error loading TA:', error);
        this.router.navigate(['/tas']);
      }
    );
  }
  
  onSubmit(): void {
    if (this.isEditing) {
      this.taService.updateTA(this.ta).subscribe(
        updatedTa => {
          console.log('TA updated successfully:', updatedTa);
          this.router.navigate(['/tas']);
        },
        error => {
          console.error('Error updating TA:', error);
        }
      );
    } else {
      this.taService.addTA(this.ta).subscribe(
        newTa => {
          console.log('TA added successfully:', newTa);
          this.router.navigate(['/tas']);
        },
        error => {
          console.error('Error adding TA:', error);
        }
      );
    }
  }
} 