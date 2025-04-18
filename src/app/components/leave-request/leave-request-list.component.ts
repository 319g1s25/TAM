import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface LeaveRequest {
  id: number;
  taId: number;
  taName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  details: string;
  courseIds: number[];
  courseNames: string[];
  submittedDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  reviewComments?: string;
}

@Component({
  selector: 'app-leave-request-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="leave-request-container">
      <header class="content-header">
        <h1>Leave Requests</h1>
        <p class="subtitle">{{ isAdminView ? 'Manage leave requests submitted by TAs' : 'View your leave request history' }}</p>
        <div class="action-buttons" *ngIf="!isAdminView">
          <a routerLink="/leave-requests/new" class="btn btn-primary">
            <svg class="svg-icon" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
            </svg>
            Request Leave
          </a>
        </div>
      </header>
      
      <div class="filter-section" *ngIf="isAdminView">
        <div class="filter-group">
          <h2 class="section-title">Filter Requests</h2>
          <div class="filters">
            <div class="filter-pills">
              <span class="filter-label">Status:</span>
              <button 
                (click)="filterByStatus('all')" 
                class="filter-pill" 
                [class.active]="statusFilter === 'all'">
                All
              </button>
              <button 
                (click)="filterByStatus('pending')" 
                class="filter-pill" 
                [class.active]="statusFilter === 'pending'">
                Pending
              </button>
              <button 
                (click)="filterByStatus('approved')" 
                class="filter-pill" 
                [class.active]="statusFilter === 'approved'">
                Approved
              </button>
              <button 
                (click)="filterByStatus('rejected')" 
                class="filter-pill" 
                [class.active]="statusFilter === 'rejected'">
                Rejected
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="isLoading" class="loading-container">
        <div class="loader"></div>
        <p>Loading leave requests...</p>
      </div>
      
      <div *ngIf="!isLoading && leaveRequests.length > 0" class="leave-request-list">
        <div class="request-card" *ngFor="let request of filteredRequests">
          <div class="request-header">
            <div class="request-info">
              <span class="request-dates">{{ request.startDate | date:'mediumDate' }} - {{ request.endDate | date:'mediumDate' }}</span>
              <span class="request-submitted">Submitted on {{ request.submittedDate | date:'mediumDate' }}</span>
            </div>
            <span [class]="'status-badge status-' + request.status">{{ request.status | titlecase }}</span>
          </div>
          
          <div class="request-content">
            <div class="request-row">
              <span class="label">TA:</span>
              <span class="value">{{ request.taName }}</span>
            </div>
            
            <div class="request-row">
              <span class="label">Reason:</span>
              <span class="value">{{ request.reason | titlecase }}</span>
            </div>
            
            <div class="request-row">
              <span class="label">Details:</span>
              <span class="value details-text">{{ request.details }}</span>
            </div>
            
            <div class="request-row">
              <span class="label">Courses:</span>
              <div class="courses-list">
                <span class="course-badge" *ngFor="let course of request.courseNames">{{ course }}</span>
              </div>
            </div>
            
            <div class="request-row" *ngIf="request.reviewedBy">
              <span class="label">Reviewed by:</span>
              <span class="value">{{ request.reviewedBy }} on {{ request.reviewDate | date:'mediumDate' }}</span>
            </div>
            
            <div class="request-row" *ngIf="request.reviewComments">
              <span class="label">Comments:</span>
              <span class="value comments-text">{{ request.reviewComments }}</span>
            </div>
          </div>
          
          <div class="request-actions" *ngIf="isAdminView && request.status === 'pending'">
            <button (click)="approveRequest(request.id)" class="btn btn-outline approve-btn">Approve</button>
            <button (click)="rejectRequest(request.id)" class="btn btn-outline reject-btn">Reject</button>
          </div>
        </div>
      </div>
      
      <div *ngIf="!isLoading && leaveRequests.length === 0" class="no-data">
        <p>No leave requests found.</p>
        <a *ngIf="!isAdminView" routerLink="/leave-requests/new" class="btn btn-primary">Request Leave</a>
      </div>
    </div>
  `,
  styles: [`
    .leave-request-container {
      padding: 20px;
    }
    
    .content-header {
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .content-header h1 {
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--primary-text-color);
      width: 100%;
    }
    
    .subtitle {
      color: var(--light-text-color);
      font-size: 1rem;
      flex: 1;
    }
    
    .action-buttons {
      margin-top: 10px;
    }
    
    .btn {
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      transition: background-color 0.2s ease, color 0.2s ease;
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .btn-accent {
      background-color: var(--accent-color);
      color: white;
      border: none;
    }
    
    .btn-accent:hover {
      background-color: var(--accent-dark-color);
    }
    
    .btn-outline {
      background-color: transparent;
      border: 1px solid currentColor;
      font-weight: 500;
    }
    
    .btn-outline:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .approve-btn {
      color: #27ae60;
    }
    
    .approve-btn:hover {
      background-color: rgba(39, 174, 96, 0.1);
    }
    
    .reject-btn {
      color: #e74c3c;
    }
    
    .reject-btn:hover {
      background-color: rgba(231, 76, 60, 0.1);
    }
    
    .svg-icon {
      width: 18px;
      height: 18px;
      fill: currentColor;
      margin-right: 5px;
      vertical-align: middle;
    }
    
    /* Filter Section */
    .filter-section {
      background: var(--card-color);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }
    
    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 12px;
      color: var(--primary-text-color);
    }
    
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .filter-pills {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .filter-label {
      font-weight: 500;
      color: var(--light-text-color);
      margin-right: 8px;
    }
    
    .filter-pill {
      padding: 6px 14px;
      border-radius: 20px;
      border: none;
      background-color: #f5f5f5;
      color: var(--light-text-color);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .filter-pill:hover {
      background-color: #e9e9e9;
    }
    
    .filter-pill.active {
      background-color: var(--primary-color);
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    /* Loading State */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 0;
    }
    
    .loader {
      border: 4px solid #f3f3f3;
      border-top: 4px solid var(--primary-color);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Request List */
    .leave-request-list {
      display: grid;
      gap: 20px;
    }
    
    .request-card {
      background: var(--card-color);
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    
    .request-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background-color: #f9f9f9;
      border-bottom: 1px solid #eee;
    }
    
    .request-info {
      display: flex;
      flex-direction: column;
    }
    
    .request-dates {
      font-weight: 600;
      font-size: 1rem;
      color: var(--primary-text-color);
    }
    
    .request-submitted {
      font-size: 0.8rem;
      color: var(--light-text-color);
      margin-top: 4px;
    }
    
    .status-badge {
      font-size: 0.85rem;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 4px;
    }
    
    .status-pending {
      background-color: #fff3cd;
      color: #856404;
    }
    
    .status-approved {
      background-color: #d4edda;
      color: #155724;
    }
    
    .status-rejected {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    .request-content {
      padding: 16px;
    }
    
    .request-row {
      margin-bottom: 12px;
      display: flex;
      flex-wrap: wrap;
    }
    
    .request-row:last-child {
      margin-bottom: 0;
    }
    
    .label {
      font-weight: 600;
      color: var(--primary-text-color);
      width: 100px;
      flex-shrink: 0;
    }
    
    .value {
      flex: 1;
      color: var(--secondary-text-color);
    }
    
    .details-text, .comments-text {
      white-space: pre-line;
    }
    
    .courses-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    
    .course-badge {
      background-color: var(--primary-light-color);
      color: var(--primary-color);
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .request-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 16px;
      border-top: 1px solid #eee;
    }
    
    /* No data message */
    .no-data {
      text-align: center;
      padding: 40px;
      background: var(--card-color);
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }
    
    .no-data p {
      margin-bottom: 16px;
      color: var(--light-text-color);
    }
    
    @media (max-width: 768px) {
      .content-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .action-buttons {
        width: 100%;
        margin-top: 16px;
      }
      
      .label {
        width: 100%;
        margin-bottom: 4px;
      }
      
      .request-actions {
        flex-direction: column;
      }
      
      .request-actions button {
        width: 100%;
      }
    }
  `]
})
export class LeaveRequestListComponent implements OnInit {
  leaveRequests: LeaveRequest[] = [];
  filteredRequests: LeaveRequest[] = [];
  isLoading = true;
  isAdminView = false;
  statusFilter = 'all';
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    // Check if the user is an admin or coordinator to determine view mode
    this.isAdminView = this.authService.isAdmin || this.authService.isCoordinator;
    
    // Load leave requests
    this.loadLeaveRequests();
  }
  
  loadLeaveRequests(): void {
    // In a real app, you would fetch from a service
    setTimeout(() => {
      this.leaveRequests = this.getMockLeaveRequests();
      this.applyFilters();
      this.isLoading = false;
    }, 1000);
  }
  
  filterByStatus(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }
  
  applyFilters(): void {
    this.filteredRequests = this.leaveRequests.filter(request => {
      // Apply status filter
      if (this.statusFilter !== 'all' && request.status !== this.statusFilter) {
        return false;
      }
      
      return true;
    });
  }
  
  approveRequest(id: number): void {
    // In a real app, you would call a service
    const request = this.leaveRequests.find(r => r.id === id);
    if (request) {
      request.status = 'approved';
      request.reviewedBy = 'Prof. Johnson';
      request.reviewDate = new Date().toISOString();
      request.reviewComments = 'Approved. Please ensure your responsibilities are covered during your absence.';
      this.applyFilters();
    }
  }
  
  rejectRequest(id: number): void {
    // In a real app, you would call a service
    const request = this.leaveRequests.find(r => r.id === id);
    if (request) {
      request.status = 'rejected';
      request.reviewedBy = 'Prof. Johnson';
      request.reviewDate = new Date().toISOString();
      request.reviewComments = 'Rejected due to upcoming midterm examinations requiring TA presence.';
      this.applyFilters();
    }
  }
  
  private getMockLeaveRequests(): LeaveRequest[] {
    return [
      {
        id: 1,
        taId: 1,
        taName: 'John Smith',
        startDate: '2023-11-15',
        endDate: '2023-11-20',
        reason: 'medical',
        status: 'approved',
        details: 'Need to undergo a minor surgery. Will be back after recovery.',
        courseIds: [1, 3],
        courseNames: ['CS101', 'MATH250'],
        submittedDate: '2023-11-01',
        reviewedBy: 'Dr. Williams',
        reviewDate: '2023-11-03',
        reviewComments: 'Approved. Please provide substitute materials for your sessions.'
      },
      {
        id: 2,
        taId: 2,
        taName: 'Mary Johnson',
        startDate: '2023-11-25',
        endDate: '2023-11-30',
        reason: 'personal',
        status: 'pending',
        details: 'Family emergency requiring travel out of state.',
        courseIds: [2],
        courseNames: ['CS201'],
        submittedDate: '2023-11-10'
      },
      {
        id: 3,
        taId: 3,
        taName: 'David Lee',
        startDate: '2023-12-01',
        endDate: '2023-12-07',
        reason: 'academic',
        status: 'rejected',
        details: 'Participating in a research conference.',
        courseIds: [1, 2],
        courseNames: ['CS101', 'CS201'],
        submittedDate: '2023-11-05',
        reviewedBy: 'Prof. Anderson',
        reviewDate: '2023-11-08',
        reviewComments: 'Rejected due to upcoming final exams. Your presence is required for review sessions.'
      }
    ];
  }
} 