import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TA } from '../../shared/models/ta.model';
import { TAService } from '../../services/ta.service';
import { ProctoringAssignmentService } from '../../services/proctoring-assignment.service';
import { IconComponent } from '../shared/icon.component';
import { ExamService, Exam as ApiExam } from '../../services/exam.service';
import { NotificationService } from '../../services/notification.service';

interface Exam {
  id: number;
  courseId: number;
  courseCode: string;
  courseName: string;
  date: string;
  startTime: string;
  endTime: string;
  requiredProctors: number;
  assignedProctors: number;
  department: string;
}

@Component({
  selector: 'app-proctoring-list',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="content-container">
      <header class="content-header">
        <h1>Proctoring Management</h1>
        <div class="header-buttons">
          <button class="btn btn-primary" routerLink="/proctoring/new-exam">
            <app-icon icon="add"></app-icon>
            Create New Exam
          </button>
          <button class="btn btn-secondary" (click)="assignProctorsAutomatically()">
            <app-icon icon="people"></app-icon>
            Auto-Assign Proctors
          </button>
        </div>
      </header>
      
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon">
            <app-icon icon="event" size="large"></app-icon>
          </div>
          <div class="stat-content">
            <h3>Total Exams</h3>
            <p class="stat-value">{{ exams.length }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <app-icon icon="person" size="large"></app-icon>
          </div>
          <div class="stat-content">
            <h3>Available Proctors</h3>
            <p class="stat-value">{{ getAvailableProctors() }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <app-icon icon="workload" size="large"></app-icon>
          </div>
          <div class="stat-content">
            <h3>Proctor Shortage</h3>
            <p class="stat-value">{{ getProctorShortage() }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="search-filter-bar">
          <div class="search-container">
            <app-icon icon="search"></app-icon>
            <input type="text" placeholder="Search exams..." class="form-control" (input)="onSearch($event)">
          </div>
          
          <div class="filter-options">
            <select class="form-control" (change)="filterByDepartment($event)">
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
            </select>
            
            <select class="form-control" (change)="filterByDate($event)">
              <option value="">All Dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
        
        <div class="exam-grid">
          <div *ngFor="let exam of filteredExams" class="exam-card">
            <div class="exam-header">
              <span class="course-code">{{ exam.courseCode }}</span>
              <span [class]="'department-badge ' + getDepartmentClass(exam.department)">{{ exam.department }}</span>
            </div>
            <h3 class="exam-title">{{ exam.courseName }}</h3>
            
            <div class="exam-details">
              <div class="detail-item">
                <span class="detail-label">Date:</span>
                <span class="detail-value">{{ exam.date }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Time:</span>
                <span class="detail-value">{{ exam.startTime }} - {{ exam.endTime }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Proctors:</span>
                <span class="detail-value" [class.shortage]="exam.assignedProctors < exam.requiredProctors">
                  {{ exam.assignedProctors }}/{{ exam.requiredProctors }}
                </span>
              </div>
            </div>
            
            <div class="exam-actions">
              <button class="btn btn-sm" [routerLink]="['/proctoring', exam.id]" title="View">
                <app-icon icon="view" size="small"></app-icon>
              </button>
              <button class="btn btn-sm btn-accent" [routerLink]="['/proctoring', exam.id, 'edit']" title="Edit">
                <app-icon icon="edit" size="small"></app-icon>
              </button>
              <button class="btn btn-sm btn-secondary" [routerLink]="['/proctoring', exam.id, 'assign']" title="Assign Proctors">
                <app-icon icon="people" size="small"></app-icon>
              </button>
            </div>
          </div>
          
          <div *ngIf="filteredExams.length === 0" class="no-exams">
            <p>No exams found matching your criteria</p>
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
    
    .exam-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .exam-card {
      background: var(--card-color);
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      padding: 20px;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .exam-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .exam-header {
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
    
    .exam-title {
      margin: 0 0 10px;
      font-size: 1.2rem;
      line-height: 1.4;
    }
    
    .exam-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    
    .detail-item {
      display: flex;
      justify-content: space-between;
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
    
    .exam-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    
    .btn-sm {
      padding: 5px 8px;
      font-size: 0.9rem;
    }
    
    .btn-secondary {
      background-color: #9e9e9e;
    }
    
    .btn-secondary:hover {
      background-color: #757575;
    }
    
    .no-exams {
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
export class ProctoringListComponent implements OnInit {
  exams: Exam[] = [];
  filteredExams: Exam[] = [];
  tas: TA[] = [];
  forceRefresh = false;
  
  constructor(
    private taService: TAService,
    private proctoringAssignmentService: ProctoringAssignmentService,
    private examService: ExamService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    // Check if we're navigating from the exam form with refresh state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { refresh: boolean } | undefined;
    
    if (state && state.refresh) {
      // We'll force a refresh immediately when component initializes
      this.forceRefresh = true;
    }
  }

  ngOnInit(): void {
    // If we need to force refresh (coming from exam creation), use timeout to ensure DOM is ready
    if (this.forceRefresh) {
      setTimeout(() => {
        this.loadExams();
        this.loadTAs();
      }, 100);
    } else {
      this.loadExams();
      this.loadTAs();
    }
  }
  
  loadExams(): void {
    this.examService.getAllExams().subscribe(
      response => {
        if (response.success && response.exams && response.exams.length > 0) {
          // Transform API exam data to our component format
          this.exams = response.exams.map(apiExam => {
            // Extract date and time from the full datetime
            const examDate = new Date(apiExam.date);
            const date = examDate.toISOString().split('T')[0];
            const startTime = examDate.toTimeString().substring(0, 5);
            const endTime = new Date(examDate.getTime() + apiExam.duration * 60 * 60 * 1000)
              .toTimeString().substring(0, 5);
              
            // Get department from course info
            const department = 'Computer Science'; // Default for now
            
            return {
              id: apiExam.id,
              courseId: apiExam.courseID,
              courseCode: apiExam.course_code || 'N/A',
              courseName: apiExam.course_name || 'Unknown Course',
              date: date,
              startTime: startTime,
              endTime: endTime,
              requiredProctors: apiExam.proctorsRequired,
              assignedProctors: 0, // We'll get this from proctoring assignments
              department: department
            };
          });
          
          // Load proctoring assignments to get assigned proctors count
          this.loadProctoringAssignmentsForExams();
          
          this.filteredExams = this.exams;
        } else {
          // Try to load exams from localStorage if API fails or returns empty array
          this.loadExamsFromLocalStorage();
        }
      },
      error => {
        console.error('Error loading exams:', error);
        // Try to load exams from localStorage if API fails
        this.loadExamsFromLocalStorage();
      }
    );
  }
  
  // Fallback method to load exams from localStorage for demonstration purposes
  loadExamsFromLocalStorage(): void {
    try {
      const mockExams = JSON.parse(localStorage.getItem('mockExams') || '[]');
      if (mockExams.length > 0) {
        this.exams = mockExams.map((apiExam: any) => {
          // Extract date and time from the full datetime
          const examDate = new Date(apiExam.date);
          const date = examDate.toISOString().split('T')[0];
          const startTime = examDate.toTimeString().substring(0, 5);
          const endTime = new Date(examDate.getTime() + apiExam.duration * 60 * 60 * 1000)
            .toTimeString().substring(0, 5);
            
          // Get department from course info
          const department = 'Computer Science'; // Default for now
          
          return {
            id: apiExam.id,
            courseId: apiExam.courseID,
            courseCode: apiExam.course_code || 'N/A',
            courseName: apiExam.course_name || 'Unknown Course',
            date: date,
            startTime: startTime,
            endTime: endTime,
            requiredProctors: apiExam.proctorsRequired,
            assignedProctors: 0,
            department: department
          };
        });
        
        this.filteredExams = this.exams;
        this.notificationService.showInfo('Loaded exams from local storage');
      }
    } catch (error) {
      console.error('Error loading exams from localStorage:', error);
    }
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
  
  // Filter by date
  filterByDate(event: Event): void {
    const dateFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters(undefined, undefined, dateFilter);
  }
  
  // Apply all filters
  applyFilters(searchTerm?: string, department?: string, dateFilter?: string): void {
    let filtered = [...this.exams];
    
    if (searchTerm) {
      filtered = filtered.filter(exam => 
        exam.courseName.toLowerCase().includes(searchTerm) || 
        exam.courseCode.toLowerCase().includes(searchTerm)
      );
    }
    
    if (department) {
      filtered = filtered.filter(exam => exam.department === department);
    }
    
    if (dateFilter) {
      const today = new Date();
      filtered = filtered.filter(exam => {
        const examDate = new Date(exam.date);
        if (dateFilter === 'upcoming') {
          return examDate >= today;
        } else if (dateFilter === 'past') {
          return examDate < today;
        }
        return true;
      });
    }
    
    this.filteredExams = filtered;
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
  getAvailableProctors(): number {
    return this.tas.filter(ta => !ta.isOnLeave && ta.proctoringEnabled).length;
  }
  
  getProctorShortage(): number {
    return this.exams.reduce((total, exam) => {
      const shortage = exam.requiredProctors - exam.assignedProctors;
      return total + (shortage > 0 ? shortage : 0);
    }, 0);
  }

  loadProctoringAssignmentsForExams(): void {
    this.exams.forEach(exam => {
      this.examService.getExamById(exam.id).subscribe(
        response => {
          if (response.success && response.proctoringAssignments) {
            // Update the assigned proctors count for this exam
            const examIndex = this.exams.findIndex(e => e.id === exam.id);
            if (examIndex !== -1) {
              this.exams[examIndex].assignedProctors = response.proctoringAssignments.length;
              // Update filtered exams as well if needed
              const filteredIndex = this.filteredExams.findIndex(e => e.id === exam.id);
              if (filteredIndex !== -1) {
                this.filteredExams[filteredIndex].assignedProctors = response.proctoringAssignments.length;
              }
            }
          }
        },
        error => {
          console.error(`Error loading assignments for exam ${exam.id}:`, error);
          console.error(`Error loading proctoring assignments for exam ${exam.id}:`, error);
        }
      );
    });
  }

  assignProctorsAutomatically(): void {
    // Show loading notification
    this.notificationService.showInfo('Automatically assigning proctors...');
    
    // Get exams that need proctors
    const examsNeedingProctors = this.exams.filter(exam => 
      exam.requiredProctors > exam.assignedProctors
    );

    if (examsNeedingProctors.length === 0) {
      alert('No exams need proctor assignments at this time.');
      return;
    }

    // Get available TAs
    const availableTAs = this.tas.filter(ta => !ta.isOnLeave && ta.proctoringEnabled);

    if (availableTAs.length === 0) {
      alert('No available proctors for assignment.');
      return;
    }

    // Call each exam's auto-assign endpoint
    let completedCount = 0;
    examsNeedingProctors.forEach(exam => {
      this.examService.autoAssignProctors(exam.id).subscribe(
        response => {
          completedCount++;
          if (completedCount === examsNeedingProctors.length) {
            // All assignments complete
            this.notificationService.showSuccess('Automatic proctor assignment complete');
            this.loadExams(); // Reload the exams to show updated assignments
          }
        },
        error => {
          console.error(`Error auto-assigning proctors to exam ${exam.id}:`, error);
          this.notificationService.showError(`Failed to assign proctors to exam ${exam.courseCode}`);
          completedCount++;
          if (completedCount === examsNeedingProctors.length) {
            this.loadExams(); // Still reload to get any successful assignments
          }
        }
      );
    });
  }

  // Refresh the exam list
  refreshExamList(): void {
    this.loadExams();
  }
}