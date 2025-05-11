import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LeaveReqService } from '../../services/leave-request.service';
import { TAService } from '../../services/ta.service';
interface LeaveRequest {
  id: number;
  taID: number;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  note: string;
  // You can optionally extend this if you join TA info:
  taName?: string;
  department?: string;
  reviewedBy?: string;
  reviewDate?: string;
  reviewComments?: string;
}

@Component({
  selector: 'app-leave-request-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './leave-request-list.component.html',
  styleUrls: ['./leave-request-list.component.css']
})
export class LeaveRequestListComponent implements OnInit {
  leaveRequests: LeaveRequest[] = [];
  filteredRequests: LeaveRequest[] = [];
  isLoading = true;
  isAdminView = false;
  statusFilter = 'all';
  currentUserId: string = '';
  isDeansOffice = false;
  isAuthStaff = false;
  isDepartmentChair = false;

  constructor(
    private authService: AuthService,
    private leaveReqService: LeaveReqService,
    private taService: TAService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    this.isAdminView = currentUser?.role !== 'ta';
    this.isDeansOffice = currentUser?.role === 'deansoffice';
    this.isAuthStaff = currentUser?.role === 'authstaff';
    this.isDepartmentChair = currentUser?.role === 'departmentchair';
    console.log('Current user role:', currentUser?.role);
    console.log('isAuthStaff:', this.isAuthStaff);
    console.log('isDeansOffice:', this.isDeansOffice);
    console.log('isDepartmentChair:', this.isDepartmentChair);
    this.loadLeaveRequests();
  }

  loadLeaveRequests(): void {
    const currentUser = this.authService.currentUserValue;
    const role = currentUser?.role;
    const userId = currentUser?.id;

    this.leaveReqService.getAllLeaveRequests(role, userId).subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : response.requests;
        this.leaveRequests = data || [];
        console.log('Loaded leave requests:', this.leaveRequests);
        console.log('Request statuses:', this.leaveRequests.map(req => req.status));
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load leave requests:', err);
        this.leaveRequests = [];
        this.filteredRequests = [];
        this.isLoading = false;
      }
    });
  }

  filterByStatus(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredRequests = this.leaveRequests.filter(req => {
      if (this.statusFilter !== 'all' && req.status.toLowerCase() !== this.statusFilter) return false;
      return true;
    });
  }

  approveRequest(id: number): void {
    if (!this.isDeansOffice && !this.isAuthStaff && !this.isDepartmentChair) return;

    const request = this.leaveRequests.find(r => r.id === id);
    if (!request) return;

    const reviewData = {
      status: 'approved' as 'Approved',
      reviewedBy: this.authService.currentUserValue?.name || 'System',
      reviewDate: new Date().toISOString(),
      reviewComments: 'Approved.'
    };

    this.leaveReqService.updateLeaveRequestStatus(id, reviewData).subscribe({
      next: () => {
        // Update local UI after backend success
        request.status = 'Approved';
        request.reviewedBy = reviewData.reviewedBy;
        request.reviewDate = reviewData.reviewDate;
        request.reviewComments = reviewData.reviewComments;
        this.applyFilters();
      },
      error: err => {
        console.error('Failed to approve request:', err);
      }
    });
  }

  rejectRequest(id: number): void {
    if (!this.isDeansOffice && !this.isAuthStaff && !this.isDepartmentChair) return;

    const request = this.leaveRequests.find(r => r.id === id);
    if (!request) return;

    const reviewData = {
      status: 'rejected' as 'Rejected',
      reviewedBy: this.authService.currentUserValue?.name || 'System',
      reviewDate: new Date().toISOString(),
      reviewComments: 'Rejected.'
    };

    this.leaveReqService.updateLeaveRequestStatus(id, reviewData).subscribe({
      next: () => {
        request.status = 'Rejected';
        request.reviewedBy = reviewData.reviewedBy;
        request.reviewDate = reviewData.reviewDate;
        request.reviewComments = reviewData.reviewComments;
        this.applyFilters();
      },
      error: err => {
        console.error('Failed to reject request:', err);
      }
    });
  }

}
