import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Assignment } from '../../models/assignment.model';
import { AssignmentService } from '../../services/assignment.service';

@Component({
  selector: 'app-assignment-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.css']
})
export class AssignmentListComponent implements OnInit {
  assignments: Assignment[] = [];
  isLoading = true;
  Math = Math; // Add Math object for template
  
  // Filter options
  statusFilter: string = 'all';
  courseFilter: string = 'all';
  
  constructor(private assignmentService: AssignmentService) { }

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(): void {
    this.isLoading = true;
    this.assignmentService.getAssignments().subscribe({
      next: (data) => {
        this.assignments = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading assignments:', err);
        this.isLoading = false;
      }
    });
  }
  
  // Filter methods
  applyFilters(): void {
    this.isLoading = true;
    this.assignmentService.getAssignments().subscribe({
      next: (data) => {
        let filtered = data;
        
        // Apply status filter if not 'all'
        if (this.statusFilter !== 'all') {
          filtered = filtered.filter(a => a.status === this.statusFilter);
        }
        
        // Apply course filter if not 'all'
        if (this.courseFilter !== 'all') {
          filtered = filtered.filter(a => a.courseId === this.courseFilter);
        }
        
        this.assignments = filtered;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error filtering assignments:', err);
        this.isLoading = false;
      }
    });
  }
  
  setStatusFilter(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }
  
  setCourseFilter(courseId: string): void {
    this.courseFilter = courseId;
    this.applyFilters();
  }
  
  // Helper methods
  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'in-progress':
        return 'status-progress';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  getRemainingDays(dueDate: string): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  
  getDaysRemainingClass(days: number): string {
    if (days < 0) return 'overdue';
    if (days <= 2) return 'urgent';
    if (days <= 5) return 'soon';
    return 'normal';
  }
} 