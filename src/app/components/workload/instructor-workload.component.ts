import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkloadService, InstructorWorkloadEntry } from '../../services/workload.service';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-instructor-workload',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './instructor-workload.component.html',
  styleUrls: ['./instructor-workload.component.css']
})
export class InstructorWorkloadComponent implements OnInit {
  workloadEntries: InstructorWorkloadEntry[] = [];
  isLoading = false;
  errorMessage = '';
  currentInstructorId: string | number = '';

  constructor(
    private workloadService: WorkloadService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('InstructorWorkloadComponent ngOnInit triggered');

    const currentUser = this.authService.currentUserValue;
    console.log('Current user:', currentUser);
  
    if (currentUser && currentUser.role === 'instructor') {
      this.currentInstructorId = currentUser.id;
      console.log('Loading workload for instructor:', this.currentInstructorId);
      this.loadWorkloadEntries();
    } else {
      console.warn('Access blocked. Role:', currentUser?.role);
      this.router.navigate(['/unauthorized']);
    }
  }
  
  loadWorkloadEntries(): void {
    if (!this.currentInstructorId) {
      this.errorMessage = 'Invalid instructor ID';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.workloadService.getInstructorWorkload(this.currentInstructorId).subscribe({
      next: (response) => {
        if (response.success) {
          this.workloadEntries = response.workload;
          if (this.workloadEntries.length === 0) {
            this.errorMessage = 'No workload entries found for your courses.';
          }
        } else {
          this.errorMessage = 'Failed to load workload entries. Please try again later.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load workload entries. Please try again later.';
        console.error('Error loading workload entries:', error);
      }
    });
  }

  approveEntry(entry: InstructorWorkloadEntry, approved: boolean): void {
    this.workloadService.approveWorkloadEntry(entry.id.toString(), approved).subscribe({
      next: (response) => {
        if (response.success) {
          // Update the local entry
          const index = this.workloadEntries.findIndex(e => e.id === entry.id);
          if (index !== -1) {
            this.workloadEntries[index].approved = approved;
          }
        } else {
          alert('Failed to update workload entry. Please try again.');
        }
      },
      error: (error) => {
        console.error('Error updating workload entry:', error);
        alert('Failed to update workload entry. Please try again.');
      }
    });
  }

  getStatusClass(approved: boolean | null): string {
    if (approved === null) {
      return 'text-warning';
    }
    return approved ? 'text-success' : 'text-danger';
  }

  getStatusText(approved: boolean | null): string {
    if (approved === null) {
      return 'Pending';
    }
    return approved ? 'Approved' : 'Rejected';
  }
} 