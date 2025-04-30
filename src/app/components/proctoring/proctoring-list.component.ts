import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TA } from '../../shared/models/ta.model';
import { TAService } from '../../services/ta.service';
import { ProctoringAssignmentService } from '../../services/proctoring-assignment.service';
import { IconComponent } from '../shared/icon.component';

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
          <button class="btn btn-primary" (click)="assignProctorsAutomatically()">
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
  
  constructor(
    private taService: TAService,
    private proctoringAssignmentService: ProctoringAssignmentService
  ) {}

  ngOnInit(): void {
    this.loadExams();
    this.loadTAs();
  }
  
  loadExams(): void {
    // TODO: Implement exam loading from your backend service
    // For now, using mock data
    this.exams = [
      {
        id: 1,
        courseId: 1,
        courseCode: 'CS101',
        courseName: 'Introduction to Computer Science',
        date: '2024-03-15',
        startTime: '09:00',
        endTime: '11:00',
        requiredProctors: 2,
        assignedProctors: 1,
        department: 'Computer Science'
      },
      {
        id: 2,
        courseId: 2,
        courseCode: 'MATH201',
        courseName: 'Calculus II',
        date: '2024-03-16',
        startTime: '10:00',
        endTime: '12:00',
        requiredProctors: 2,
        assignedProctors: 0,
        department: 'Mathematics'
      }
    ];
    this.filteredExams = this.exams;
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

  assignProctorsAutomatically(): void {
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

    // Generate assignments
    const assignments = this.proctoringAssignmentService.assignProctorsAutomatically(examsNeedingProctors, availableTAs);
    const summary = this.proctoringAssignmentService.generateAssignmentSummary(assignments, examsNeedingProctors, availableTAs);

    // Show assignment summary and ask for confirmation
    let summaryText = 'Proposed Proctoring Assignments:\n\n';
    
    // Show assigned exams
    if (summary.examAssignments.length > 0) {
      summaryText += 'Assigned Exams:\n';
      summary.examAssignments.forEach(exam => {
        summaryText += `${exam.courseName} (${exam.courseCode}):\n`;
        summaryText += `  Date: ${exam.date}\n`;
        summaryText += `  Time: ${exam.time}\n`;
        summaryText += `  Required Proctors: ${exam.requiredProctors}\n`;
        summaryText += `  Assigned Proctors: ${exam.assignedProctors}\n`;
        if (exam.assignedTANames.length > 0) {
          summaryText += '  Assigned Proctors:\n';
          exam.assignedTANames.forEach(taName => {
            summaryText += `    - ${taName}\n`;
          });
        }
        summaryText += '\n';
      });
    }

    // Show unassigned exams
    if (summary.unassignedExams.length > 0) {
      summaryText += 'Unassigned Exams:\n';
      summary.unassignedExams.forEach(exam => {
        summaryText += `  ${exam.courseName} (${exam.courseCode})\n`;
        summaryText += `  Date: ${exam.date}\n`;
        summaryText += `  Time: ${exam.time}\n`;
        summaryText += `  Needs ${exam.requiredProctors} proctors\n\n`;
      });
    }

    // Show TA workloads
    summaryText += 'TA Workloads:\n';
    summary.taWorkloads.forEach(ta => {
      summaryText += `  ${ta.taName}: ${ta.assignedExams} exams (${ta.totalWorkload} hours)\n`;
    });

    if (confirm(`${summaryText}\nDo you want to proceed with these assignments?`)) {
      // Update exam proctor assignments
      assignments.forEach((taIds, examId) => {
        const exam = examsNeedingProctors.find(e => e.id === examId);
        if (exam) {
          exam.assignedProctors += taIds.length;
          // TODO: Update exam in backend
        }
      });

      alert('Proctoring assignments have been updated successfully.');
      this.loadExams(); // Refresh the exam list
    }
  }
} 