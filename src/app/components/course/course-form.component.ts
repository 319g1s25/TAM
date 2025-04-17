import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Course } from '../../shared/models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="content-container">
      <header class="content-header">
        <h1>{{ isEditing ? 'Edit' : 'Add' }} Course</h1>
        <div class="breadcrumb">
          <a routerLink="/courses">Courses</a> / 
          <span>{{ isEditing ? 'Edit' : 'Add' }} Course</span>
        </div>
      </header>
      
      <div class="card">
        <form (ngSubmit)="onSubmit()" #courseForm="ngForm">
          <div class="form-group-row">
            <div class="form-group">
              <label for="code">Course Code<span class="required">*</span></label>
              <input 
                type="text" 
                id="code" 
                name="code" 
                class="form-control" 
                [(ngModel)]="course.code" 
                required
                #code="ngModel"
                placeholder="e.g. CS101"
              >
              <div *ngIf="code.invalid && (code.dirty || code.touched)" class="error-message">
                Course code is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="name">Course Name<span class="required">*</span></label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                class="form-control" 
                [(ngModel)]="course.name" 
                required
                #name="ngModel"
                placeholder="e.g. Introduction to Computer Science"
              >
              <div *ngIf="name.invalid && (name.dirty || name.touched)" class="error-message">
                Course name is required
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="description">Description<span class="required">*</span></label>
            <textarea 
              id="description" 
              name="description" 
              class="form-control" 
              [(ngModel)]="course.description" 
              required
              rows="4"
              #description="ngModel"
              placeholder="Enter course description..."
            ></textarea>
            <div *ngIf="description.invalid && (description.dirty || description.touched)" class="error-message">
              Description is required
            </div>
          </div>
          
          <div class="form-group-row">
            <div class="form-group">
              <label for="department">Department<span class="required">*</span></label>
              <select 
                id="department" 
                name="department" 
                class="form-control" 
                [(ngModel)]="course.department" 
                required
                #department="ngModel"
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
              </select>
              <div *ngIf="department.invalid && (department.dirty || department.touched)" class="error-message">
                Department is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="semester">Semester<span class="required">*</span></label>
              <select 
                id="semester" 
                name="semester" 
                class="form-control" 
                [(ngModel)]="course.semester" 
                required
                #semester="ngModel"
              >
                <option value="">Select Semester</option>
                <option value="Fall 2023">Fall 2023</option>
                <option value="Spring 2024">Spring 2024</option>
              </select>
              <div *ngIf="semester.invalid && (semester.dirty || semester.touched)" class="error-message">
                Semester is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="credits">Credits<span class="required">*</span></label>
              <input 
                type="number" 
                id="credits" 
                name="credits" 
                class="form-control" 
                [(ngModel)]="course.credits" 
                required
                min="1"
                max="6"
                #credits="ngModel"
              >
              <div *ngIf="credits.invalid && (credits.dirty || credits.touched)" class="error-message">
                <div *ngIf="credits.errors?.['required']">Credits is required</div>
                <div *ngIf="credits.errors?.['min'] || credits.errors?.['max']">
                  Credits must be between 1 and 6
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-group-row">
            <div class="form-group">
              <label for="instructorName">Instructor Name<span class="required">*</span></label>
              <input 
                type="text" 
                id="instructorName" 
                name="instructorName" 
                class="form-control" 
                [(ngModel)]="course.instructorName" 
                required
                #instructorName="ngModel"
                placeholder="e.g. Dr. John Smith"
              >
              <div *ngIf="instructorName.invalid && (instructorName.dirty || instructorName.touched)" class="error-message">
                Instructor name is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="numberOfStudents">Number of Students<span class="required">*</span></label>
              <input 
                type="number" 
                id="numberOfStudents" 
                name="numberOfStudents" 
                class="form-control" 
                [(ngModel)]="course.numberOfStudents" 
                required
                min="1"
                #numberOfStudents="ngModel"
              >
              <div *ngIf="numberOfStudents.invalid && (numberOfStudents.dirty || numberOfStudents.touched)" class="error-message">
                <div *ngIf="numberOfStudents.errors?.['required']">Number of students is required</div>
                <div *ngIf="numberOfStudents.errors?.['min']">
                  Number of students must be at least 1
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-group-row">
            <div class="form-group">
              <label for="taRequirements">TA Requirements<span class="required">*</span></label>
              <input 
                type="number" 
                id="taRequirements" 
                name="taRequirements" 
                class="form-control" 
                [(ngModel)]="course.taRequirements" 
                required
                min="0"
                #taRequirements="ngModel"
              >
              <div *ngIf="taRequirements.invalid && (taRequirements.dirty || taRequirements.touched)" class="error-message">
                <div *ngIf="taRequirements.errors?.['required']">TA requirements is required</div>
                <div *ngIf="taRequirements.errors?.['min']">
                  TA requirements cannot be negative
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="numberOfTAs">Current TAs</label>
              <input 
                type="number" 
                id="numberOfTAs" 
                name="numberOfTAs" 
                class="form-control" 
                [(ngModel)]="course.numberOfTAs"
                min="0"
                #numberOfTAs="ngModel"
              >
              <div *ngIf="numberOfTAs.invalid && (numberOfTAs.dirty || numberOfTAs.touched)" class="error-message">
                <div *ngIf="numberOfTAs.errors?.['min']">
                  Number of TAs cannot be negative
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="isEditing" class="form-group">
            <p><strong>ID:</strong> {{ course.id }}</p>
          </div>
          
          <div class="action-buttons">
            <button type="submit" class="btn" [disabled]="courseForm.invalid">
              {{ isEditing ? 'Update' : 'Create' }} Course
            </button>
            <a routerLink="/courses" class="btn btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .content-container {
      padding: 0 15px;
    }
    
    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    
    .breadcrumb {
      color: var(--light-text-color);
      font-size: 0.9rem;
    }
    
    .breadcrumb a {
      color: var(--primary-color);
      text-decoration: none;
    }
    
    .breadcrumb a:hover {
      text-decoration: underline;
    }
    
    .form-group {
      margin-bottom: 20px;
      width: 100%;
    }
    
    .form-group-row {
      display: flex;
      gap: 20px;
      margin-bottom: 0;
    }
    
    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
    }
    
    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
    }
    
    .required {
      color: var(--warn-color);
      margin-left: 3px;
    }
    
    .error-message {
      color: var(--warn-color);
      font-size: 0.85rem;
      margin-top: 5px;
    }
    
    .action-buttons {
      display: flex;
      gap: 10px;
      margin-top: 30px;
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
    
    @media (max-width: 768px) {
      .form-group-row {
        flex-direction: column;
        gap: 0;
      }
      
      .content-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
    }
  `]
})
export class CourseFormComponent implements OnInit {
  course: Course = {
    id: 0,
    code: '',
    name: '',
    description: '',
    department: '',
    credits: 3,
    semester: '',
    instructorName: '',
    numberOfStudents: 0,
    numberOfTAs: 0,
    taRequirements: 0
  };
  
  isEditing = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadCourse(parseInt(id, 10));
    }
  }
  
  loadCourse(id: number): void {
    this.courseService.getCourse(id).subscribe(
      course => {
        this.course = course;
      },
      error => {
        console.error('Error loading course:', error);
        this.router.navigate(['/courses']);
      }
    );
  }
  
  onSubmit(): void {
    if (this.isEditing) {
      this.courseService.updateCourse(this.course).subscribe(
        updatedCourse => {
          console.log('Course updated successfully:', updatedCourse);
          this.router.navigate(['/courses']);
        },
        error => {
          console.error('Error updating course:', error);
        }
      );
    } else {
      this.courseService.addCourse(this.course).subscribe(
        newCourse => {
          console.log('Course added successfully:', newCourse);
          this.router.navigate(['/courses']);
        },
        error => {
          console.error('Error adding course:', error);
        }
      );
    }
  }
} 