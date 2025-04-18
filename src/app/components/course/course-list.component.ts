import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Course } from '../../shared/models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="content-container">
      <header class="content-header">
        <h1>Course Management</h1>
        <button class="btn btn-accent" routerLink="/courses/new">
          <svg class="svg-icon" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
          </svg>
          Add New Course
        </button>
      </header>
      
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon">
            <svg class="svg-icon" viewBox="0 0 24 24">
              <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1z"></path>
            </svg>
          </div>
          <div class="stat-content">
            <h3>Total Courses</h3>
            <p class="stat-value">{{ courses.length }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <svg class="svg-icon" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
            </svg>
          </div>
          <div class="stat-content">
            <h3>Total Students</h3>
            <p class="stat-value">{{ getTotalStudents() }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <svg class="svg-icon" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path>
            </svg>
          </div>
          <div class="stat-content">
            <h3>Total TAs</h3>
            <p class="stat-value">{{ getTotalTAs() }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <svg class="svg-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
            </svg>
          </div>
          <div class="stat-content">
            <h3>TA Shortage</h3>
            <p class="stat-value">{{ getTAShortage() }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="search-filter-bar">
          <div class="search-container">
            <svg class="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
            <input type="text" placeholder="Search courses..." class="form-control" (input)="onSearch($event)">
          </div>
          
          <div class="filter-options">
            <select class="form-control" (change)="filterByDepartment($event)">
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
            </select>
            
            <select class="form-control" (change)="filterBySemester($event)">
              <option value="">All Semesters</option>
              <option value="Fall 2023">Fall 2023</option>
              <option value="Spring 2024">Spring 2024</option>
            </select>
          </div>
        </div>
        
        <div class="course-grid">
          <div *ngFor="let course of filteredCourses" class="course-card">
            <div class="course-header">
              <span class="course-code">{{ course.code }}</span>
              <span [class]="'department-badge ' + getDepartmentClass(course.department)">{{ course.department }}</span>
            </div>
            <h3 class="course-title">{{ course.name }}</h3>
            <p class="course-description">{{ course.description | slice:0:100 }}{{ course.description.length > 100 ? '...' : '' }}</p>
            
            <div class="course-details">
              <div class="detail-item">
                <span class="detail-label">Credits:</span>
                <span class="detail-value">{{ course.credits }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Students:</span>
                <span class="detail-value">{{ course.numberOfStudents || 0 }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">TAs:</span>
                <span class="detail-value" [class.shortage]="(course.numberOfTAs || 0) < (course.taRequirements || 0)">
                  {{ course.numberOfTAs || 0 }}/{{ course.taRequirements || 0 }}
                </span>
              </div>
            </div>
            
            <div class="instructor-info">
              <span class="instructor-label">Instructor:</span>
              <span class="instructor-name">{{ course.instructorName || 'Not Assigned' }}</span>
            </div>
            
            <div class="course-actions">
              <button class="btn btn-sm" [routerLink]="['/courses', course.id]" title="View">
                <svg class="svg-icon" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
                </svg>
              </button>
              <button class="btn btn-sm btn-accent" [routerLink]="['/courses', course.id, 'edit']" title="Edit">
                <svg class="svg-icon" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                </svg>
              </button>
              <button class="btn btn-sm btn-danger" (click)="deleteCourse(course.id)" title="Delete">
                <svg class="svg-icon" viewBox="0 0 24 24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                </svg>
              </button>
              <button class="btn btn-sm btn-secondary" [routerLink]="['/courses', course.id, 'assign']" title="Assign TAs">
                <svg class="svg-icon" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div *ngIf="filteredCourses.length === 0" class="no-courses">
            <p>No courses found matching your criteria</p>
          </div>
        </div>
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
    
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .stat-card {
      background: var(--card-color);
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
    }
    
    .stat-icon {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      margin-right: 16px;
      background-color: #e3f2fd;
    }
    
    .svg-icon {
      width: 24px;
      height: 24px;
      fill: #3498db;
      vertical-align: middle;
    }
    
    .btn .svg-icon {
      margin-right: 5px;
      width: 18px;
      height: 18px;
      fill: currentColor;
    }
    
    .btn-sm .svg-icon {
      margin-right: 0;
      width: 16px;
      height: 16px;
    }
    
    .search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      fill: #7f8c8d;
    }
    
    .stat-content h3 {
      margin: 0;
      font-size: 0.9rem;
      color: var(--light-text-color);
    }
    
    .stat-value {
      font-size: 1.8rem;
      font-weight: bold;
      margin: 5px 0 0;
      color: var(--primary-color);
    }
    
    .search-filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .search-container {
      position: relative;
      flex-grow: 1;
      min-width: 200px;
    }
    
    .search-container input {
      padding-left: 35px;
    }
    
    .filter-options {
      display: flex;
      gap: 10px;
    }
    
    .filter-options select {
      min-width: 150px;
    }
    
    .course-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .course-card {
      background: var(--card-color);
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      padding: 20px;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .course-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .course-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .course-code {
      font-weight: bold;
      color: var(--primary-color);
    }
    
    .department-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .dept-cs {
      background-color: #e3f2fd;
      color: #1565c0;
    }
    
    .dept-math {
      background-color: #f3e5f5;
      color: #6a1b9a;
    }
    
    .dept-physics {
      background-color: #fff3e0;
      color: #e65100;
    }
    
    .course-title {
      margin: 0 0 10px;
      font-size: 1.2rem;
      line-height: 1.4;
    }
    
    .course-description {
      color: var(--light-text-color);
      font-size: 0.9rem;
      margin-bottom: 15px;
      flex-grow: 1;
    }
    
    .course-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    
    .detail-item {
      display: flex;
      flex-direction: column;
    }
    
    .detail-label {
      font-size: 0.8rem;
      color: var(--light-text-color);
    }
    
    .detail-value {
      font-weight: 500;
    }
    
    .shortage {
      color: var(--warn-color);
    }
    
    .instructor-info {
      margin-bottom: 15px;
      font-size: 0.9rem;
    }
    
    .instructor-label {
      color: var(--light-text-color);
      margin-right: 5px;
    }
    
    .instructor-name {
      font-weight: 500;
    }
    
    .course-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    
    .btn-sm {
      padding: 5px 8px;
      font-size: 0.9rem;
    }
    
    .btn-danger {
      background-color: var(--warn-color);
    }
    
    .btn-danger:hover {
      background-color: #d32f2f;
    }
    
    .btn-secondary {
      background-color: #9e9e9e;
    }
    
    .btn-secondary:hover {
      background-color: #757575;
    }
    
    .no-courses {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px;
      background: var(--card-color);
      border-radius: 8px;
      color: var(--light-text-color);
    }
    
    @media (max-width: 768px) {
      .content-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      
      .filter-options {
        width: 100%;
        flex-direction: column;
      }
    }
  `]
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  
  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }
  
  loadCourses(): void {
    this.courseService.getAllCourses().subscribe(
      courses => {
        this.courses = courses;
        this.filteredCourses = courses;
      },
      error => {
        console.error('Error loading courses:', error);
      }
    );
  }
  
  // Search functionality
  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters(searchTerm);
  }
  
  // Filter by department
  filterByDepartment(event: Event): void {
    const department = (event.target as HTMLSelectElement).value;
    this.applyFilters(undefined, department);
  }
  
  // Filter by semester
  filterBySemester(event: Event): void {
    const semester = (event.target as HTMLSelectElement).value;
    this.applyFilters(undefined, undefined, semester);
  }
  
  // Apply all filters
  applyFilters(searchTerm?: string, department?: string, semester?: string): void {
    let filtered = [...this.courses];
    
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes(searchTerm) || 
        course.code.toLowerCase().includes(searchTerm) || 
        course.description.toLowerCase().includes(searchTerm) ||
        course.instructorName?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (department) {
      filtered = filtered.filter(course => course.department === department);
    }
    
    if (semester) {
      filtered = filtered.filter(course => course.semester === semester);
    }
    
    this.filteredCourses = filtered;
  }
  
  // Delete a course
  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe(
        () => {
          this.courses = this.courses.filter(course => course.id !== id);
          this.filteredCourses = this.filteredCourses.filter(course => course.id !== id);
        },
        error => {
          console.error('Error deleting course:', error);
        }
      );
    }
  }
  
  // Get CSS class for department badge
  getDepartmentClass(department: string): string {
    switch(department) {
      case 'Computer Science':
        return 'dept-cs';
      case 'Mathematics':
        return 'dept-math';
      case 'Physics':
        return 'dept-physics';
      default:
        return '';
    }
  }
  
  // Calculate statistics
  getTotalStudents(): number {
    return this.courses.reduce((total, course) => total + (course.numberOfStudents || 0), 0);
  }
  
  getTotalTAs(): number {
    return this.courses.reduce((total, course) => total + (course.numberOfTAs || 0), 0);
  }
  
  getTAShortage(): number {
    return this.courses.reduce((total, course) => {
      const shortage = (course.taRequirements || 0) - (course.numberOfTAs || 0);
      return total + (shortage > 0 ? shortage : 0);
    }, 0);
  }
} 