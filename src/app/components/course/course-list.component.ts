import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Course } from '../../shared/models/course.model';
import { CourseService } from '../../services/course.service';
import { IconComponent } from '../shared/icon.component';
import { TAService } from '../../services/ta.service';
import { TA } from '../../shared/models/ta.model';
import { TAAssignmentService } from '../../services/ta-assignment.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="content-container">
      <header class="content-header">
        <h1>Course Management</h1>
        <div class="header-buttons">
          <button class="btn btn-accent" routerLink="/courses/new">
            <app-icon icon="add"></app-icon>
            Add New Course
          </button>
          <button class="btn btn-primary" (click)="assignTAsAutomatically()">
            <app-icon icon="people"></app-icon>
            Auto-Assign TAs
          </button>
        </div>
      </header>
      
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon">
            <app-icon icon="book" size="large"></app-icon>
          </div>
          <div class="stat-content">
            <h3>Total Courses</h3>
            <p class="stat-value">{{ courses.length }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <app-icon icon="person" size="large"></app-icon>
          </div>
          <div class="stat-content">
            <h3>Total Students</h3>
            <p class="stat-value">{{ getTotalStudents() }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <app-icon icon="people" size="large"></app-icon>
          </div>
          <div class="stat-content">
            <h3>Total TAs</h3>
            <p class="stat-value">{{ getTotalTAs() }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <app-icon icon="workload" size="large"></app-icon>
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
            <app-icon icon="search"></app-icon>
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
                <app-icon icon="view" size="small"></app-icon>
              </button>
              <button class="btn btn-sm btn-accent" [routerLink]="['/courses', course.id, 'edit']" title="Edit">
                <app-icon icon="edit" size="small"></app-icon>
              </button>
              <button class="btn btn-sm btn-danger" (click)="deleteCourse(course.id)" title="Delete">
                <app-icon icon="delete" size="small"></app-icon>
              </button>
              <button class="btn btn-sm btn-secondary" [routerLink]="['/courses', course.id, 'assign']" title="Assign TAs">
                <app-icon icon="people" size="small"></app-icon>
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
    
    .header-buttons {
      display: flex;
      gap: 10px;
    }
    
    .btn-primary {
      background-color: var(--primary-color);
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #1565c0;
    }
  `]
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  tas: TA[] = [];
  
  constructor(
    private courseService: CourseService,
    private taService: TAService,
    private taAssignmentService: TAAssignmentService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadTAs();
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
  
  loadTAs(): void {
    this.taService.getAllTAs().subscribe(
      tas => {
        this.tas = tas;
      },
      error => {
        console.error('Error loading TAs:', error);
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

  assignTAsAutomatically(): void {
    // Get courses that need TAs
    const coursesNeedingTAs = this.courses.filter(course => 
      (course.taRequirements || 0) > (course.numberOfTAs || 0)
    );

    if (coursesNeedingTAs.length === 0) {
      alert('No courses need TA assignments at this time.');
      return;
    }

    // Get available TAs
    const availableTAs = this.tas.filter(ta => !ta.isOnLeave);

    if (availableTAs.length === 0) {
      alert('No available TAs for assignment.');
      return;
    }

    // Generate assignments
    const assignments = this.taAssignmentService.assignTAsAutomatically(coursesNeedingTAs, availableTAs);
    const summary = this.taAssignmentService.generateAssignmentSummary(assignments, coursesNeedingTAs, availableTAs);

    // Show assignment summary and ask for confirmation
    let summaryText = 'Proposed TA Assignments:\n\n';
    
    // Show assigned courses
    if (summary.courseAssignments.length > 0) {
      summaryText += 'Assigned Courses:\n';
      summary.courseAssignments.forEach(course => {
        summaryText += `${course.courseName} (${course.courseCode}):\n`;
        summaryText += `  Required TAs: ${course.requiredTAs}\n`;
        summaryText += `  Assigned TAs: ${course.assignedTAs}\n`;
        if (course.assignedTANames.length > 0) {
          summaryText += '  Assigned TAs:\n';
          course.assignedTANames.forEach(taName => {
            summaryText += `    - ${taName}\n`;
          });
        }
        summaryText += '\n';
      });
    }

    // Show unassigned courses
    if (summary.unassignedCourses.length > 0) {
      summaryText += 'Unassigned Courses:\n';
      summary.unassignedCourses.forEach(course => {
        summaryText += `  ${course.courseName} (${course.courseCode}) - Needs ${course.requiredTAs} TAs\n`;
      });
      summaryText += '\n';
    }

    // Show TA workloads
    summaryText += 'TA Workloads:\n';
    summary.taWorkloads.forEach(ta => {
      summaryText += `  ${ta.taName}: ${ta.assignedCourses} courses (${ta.totalWorkload} hours)\n`;
    });

    if (confirm(`${summaryText}\nDo you want to proceed with these assignments?`)) {
      // Update course TA assignments
      assignments.forEach((taIds, courseId) => {
        const course = coursesNeedingTAs.find(c => c.id === courseId);
        if (course) {
          course.numberOfTAs = (course.numberOfTAs || 0) + taIds.length;
          this.courseService.updateCourse(course).subscribe(
            () => {
              console.log(`Updated TA assignments for course ${course.code}`);
            },
            error => {
              console.error(`Error updating course ${course.code}:`, error);
            }
          );
        }
      });

      alert('TA assignments have been updated successfully.');
      this.loadCourses(); // Refresh the course list
    }
  }
} 