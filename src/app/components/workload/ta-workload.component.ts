import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkloadService } from '../../services/workload.service';
import { WorkloadEntry } from '../../shared/models/task.model';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ta-workload',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ta-workload.component.html',
  styleUrls: ['./ta-workload.component.css']
})
export class TAWorkloadComponent implements OnInit {
  workloadEntries: WorkloadEntry[] = [];
  isLoading = false;
  errorMessage = '';
  currentTaId: string | number = '';

  constructor(
    private workloadService: WorkloadService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('TAWorkloadComponent ngOnInit triggered');

    const currentUser = this.authService.currentUserValue;
    console.log('Current user:', currentUser);
  
    if (currentUser && currentUser.role === 'ta') {
      this.currentTaId = currentUser.id;
      console.log('Loading workload for TA:', this.currentTaId);
      this.loadWorkloadEntries();
    } else {
      console.warn('Access blocked. Role:', currentUser?.role);
      this.router.navigate(['/unauthorized']);
    }
  }
  
  loadWorkloadEntries(): void {
    if (!this.currentTaId) {
      this.errorMessage = 'Invalid TA ID';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.workloadService.getWorkloadEntriesByTA(this.currentTaId.toString()).subscribe({
      next: (entries) => {
        this.workloadEntries = entries;
        if (this.workloadEntries.length === 0) {
          this.errorMessage = 'No workload entries found.';
        }
        this.isLoading = false;
        console.log('Workload entries after fetch:', this.workloadEntries);

      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load workload entries. Please try again later.';
        console.error('Error loading workload entries:', error);
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