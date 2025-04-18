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
      <div class="form-header">
        <h1>{{ isEditing ? 'Edit' : 'Add' }} Teaching Assistant</h1>
        <p class="subtitle">{{ isEditing ? 'Update the information for this TA' : 'Fill in the details to add a new teaching assistant' }}</p>
      </div>
      
      <div class="card form-card">
        <form (ngSubmit)="onSubmit()" #taForm="ngForm">
          <div class="form-grid">
            <!-- Personal Information Section -->
            <div class="form-section">
              <h2 class="section-title">Personal Information</h2>
              
              <div class="form-row">
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
                    [class.is-invalid]="name.invalid && (name.dirty || name.touched)"
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
                    [class.is-invalid]="surname.invalid && (surname.dirty || surname.touched)"
                  >
                  <div *ngIf="surname.invalid && (surname.dirty || surname.touched)" class="error-message">
                    Last name is required
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label for="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  class="form-control" 
                  [(ngModel)]="ta.email" 
                  required
                  email
                  #email="ngModel"
                  [class.is-invalid]="email.invalid && (email.dirty || email.touched)"
                >
                <div *ngIf="email.invalid && (email.dirty || email.touched)" class="error-message">
                  <div *ngIf="email.errors?.['required']">Email is required</div>
                  <div *ngIf="email.errors?.['email']">Please enter a valid email</div>
                </div>
              </div>
            </div>
            
            <!-- Academic Information Section -->
            <div class="form-section">
              <h2 class="section-title">Academic Information</h2>
              
              <div class="form-group">
                <label for="department">Department</label>
                <select 
                  id="department" 
                  name="department" 
                  class="form-control" 
                  [(ngModel)]="ta.department" 
                  required
                  #department="ngModel"
                  [class.is-invalid]="department.invalid && (department.dirty || department.touched)"
                >
                  <option value="" disabled selected>Select department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Engineering">Engineering</option>
                </select>
                <div *ngIf="department.invalid && (department.dirty || department.touched)" class="error-message">
                  Department is required
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="msOrPhdStatus">Academic Status</label>
                  <select 
                    id="msOrPhdStatus" 
                    name="msOrPhdStatus" 
                    class="form-control" 
                    [(ngModel)]="ta.msOrPhdStatus" 
                    required
                    #msOrPhdStatus="ngModel"
                    [class.is-invalid]="msOrPhdStatus.invalid && (msOrPhdStatus.dirty || msOrPhdStatus.touched)"
                  >
                    <option value="" disabled selected>Select status</option>
                    <option value="MS">Master's Student (MS)</option>
                    <option value="PhD">PhD Student</option>
                  </select>
                  <div *ngIf="msOrPhdStatus.invalid && (msOrPhdStatus.dirty || msOrPhdStatus.touched)" class="error-message">
                    Status is required
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="totalWorkload">Weekly Workload (hours)</label>
                  <div class="range-input-container">
                    <input 
                      type="range" 
                      id="totalWorkload" 
                      name="totalWorkload" 
                      class="range-control" 
                      [(ngModel)]="ta.totalWorkload" 
                      required
                      min="0"
                      max="40"
                      step="1"
                      #totalWorkload="ngModel"
                    >
                    <input 
                      type="number" 
                      class="form-control hour-input" 
                      [(ngModel)]="ta.totalWorkload" 
                      name="totalWorkloadNumber" 
                      min="0" 
                      max="40"
                    >
                  </div>
                  <div *ngIf="totalWorkload.invalid && (totalWorkload.dirty || totalWorkload.touched)" class="error-message">
                    <div *ngIf="totalWorkload.errors?.['required']">Workload is required</div>
                    <div *ngIf="totalWorkload.errors?.['min'] || totalWorkload.errors?.['max']">
                      Workload must be between 0 and 40 hours
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Additional Options Section -->
            <div class="form-section">
              <h2 class="section-title">Additional Options</h2>
              
              <div class="checkbox-group">
                <label class="checkbox-container">
                  <input 
                    type="checkbox" 
                    id="isOnLeave" 
                    name="isOnLeave" 
                    [(ngModel)]="ta.isOnLeave"
                  >
                  <span class="checkmark"></span>
                  <span class="checkbox-label">Currently on leave</span>
                </label>
                <p class="helper-text">Mark this if the TA is temporarily unavailable</p>
              </div>
              
              <div class="checkbox-group">
                <label class="checkbox-container">
                  <input 
                    type="checkbox" 
                    id="proctoringEnabled" 
                    name="proctoringEnabled" 
                    [(ngModel)]="ta.proctoringEnabled"
                  >
                  <span class="checkmark"></span>
                  <span class="checkbox-label">Available for proctoring</span>
                </label>
                <p class="helper-text">The TA can be assigned to exam proctoring duties</p>
              </div>
              
              <div *ngIf="isEditing" class="id-display">
                <span class="label">TA ID:</span>
                <span class="value">{{ ta.id }}</span>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" routerLink="/tas">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="taForm.invalid">
              {{ isEditing ? 'Update' : 'Create' }} TA
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .form-header {
      margin-bottom: 30px;
    }
    
    .form-header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
      color: #2c3e50;
    }
    
    .subtitle {
      color: #7f8c8d;
      font-size: 16px;
      margin: 0;
    }
    
    .form-card {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      padding: 30px;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 30px;
    }
    
    .section-title {
      font-size: 18px;
      color: #3498db;
      margin: 0 0 20px 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #e5e5e5;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      font-weight: 500;
      margin-bottom: 8px;
      color: #34495e;
    }
    
    .form-control {
      width: 100%;
      padding: 12px 15px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 15px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    
    .form-control:focus {
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
      outline: none;
    }
    
    .is-invalid {
      border-color: #e74c3c;
    }
    
    .is-invalid:focus {
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
    }
    
    .error-message {
      color: #e74c3c;
      font-size: 13px;
      margin-top: 6px;
    }
    
    .range-input-container {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .range-control {
      flex: 1;
      height: 6px;
      -webkit-appearance: none;
      background: #e0e0e0;
      border-radius: 5px;
      outline: none;
    }
    
    .range-control::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #3498db;
      cursor: pointer;
    }
    
    .hour-input {
      width: 70px;
      text-align: center;
    }
    
    .checkbox-group {
      margin-bottom: 15px;
    }
    
    .checkbox-container {
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 30px;
      cursor: pointer;
      user-select: none;
      font-weight: 500;
    }
    
    .checkbox-container input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    
    .checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: 20px;
      width: 20px;
      background-color: #eee;
      border-radius: 4px;
      transition: all 0.2s;
    }
    
    .checkbox-container:hover input ~ .checkmark {
      background-color: #ccc;
    }
    
    .checkbox-container input:checked ~ .checkmark {
      background-color: #3498db;
    }
    
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }
    
    .checkbox-container input:checked ~ .checkmark:after {
      display: block;
    }
    
    .checkbox-container .checkmark:after {
      left: 7px;
      top: 3px;
      width: 6px;
      height: 11px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    
    .helper-text {
      margin: 5px 0 0 30px;
      font-size: 13px;
      color: #7f8c8d;
    }
    
    .id-display {
      margin-top: 20px;
      padding: 10px 15px;
      background-color: #f9f9f9;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
    }
    
    .id-display .label {
      font-weight: 500;
      color: #7f8c8d;
      margin-right: 10px;
    }
    
    .id-display .value {
      font-family: monospace;
      font-size: 15px;
      font-weight: bold;
      color: #2c3e50;
    }
    
    .form-actions {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
      gap: 15px;
    }
    
    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-primary {
      background-color: #3498db;
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #2980b9;
    }
    
    .btn-primary:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }
    
    .btn-secondary {
      background-color: #f5f5f5;
      color: #2c3e50;
    }
    
    .btn-secondary:hover {
      background-color: #e0e0e0;
    }
    
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
      
      .form-card {
        padding: 20px;
      }
      
      .form-actions {
        flex-direction: column-reverse;
      }
      
      .btn {
        width: 100%;
      }
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
    totalWorkload: 20,
    msOrPhdStatus: '',
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