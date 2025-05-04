import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';
import { WorkloadService } from '../../services/workload.service';
import { User } from '../../shared/models/user.model';
import { IconComponent } from '../shared/icon.component';

interface UrgentTask {
  title: string;
  description: string;
  deadline: Date;
  priority: 'high' | 'medium' | 'low';
  category: string;
  actionLink: string;
  actionText: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  welcomeMessage: string = 'Welcome to your TA Management Dashboard';
  private userSubscription: Subscription | null = null;

  stats: DashboardStats = {
    taCount: 0,
    taChange: 0,
    courseCount: 0,
    activeCourseCount: 0,
    assignmentCount: 0,
    pendingAssignmentCount: 0,
    avgWorkload: 0,
    reportCount: 0,
    leaveRequestCount: 0,
    pendingWorkloadCount: 0
  };

  urgentTasks: UrgentTask[] = [];

  constructor(
    public authService: AuthService,
    private dashboardService: DashboardService,
    private workloadService: WorkloadService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.updateWelcomeMessage();
      this.loadDashboardStats();

      if (user?.role === 'instructor') {
        this.loadInstructorPendingWorkload();
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  private updateWelcomeMessage(): void {
    if (this.currentUser) {
      switch (this.currentUser.role) {
        case 'authstaff':
          this.welcomeMessage = 'Welcome to the TA Management System';
          break;
        case 'instructor':
          this.welcomeMessage = 'Welcome to your Course Management Dashboard';
          break;
        case 'ta':
          this.welcomeMessage = 'Welcome to your TA Dashboard';
          break;
        case 'deansoffice':
          this.welcomeMessage = 'Welcome to the Dean\'s Office Dashboard';
          break;
        case 'departmentchair':
          this.welcomeMessage = 'Welcome Department Chair';
          break;
        default:
          this.welcomeMessage = 'Welcome to your Dashboard';
      }
    }
  }

  private loadDashboardStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = res.stats;
        }
      },
      error: (err) => {
        console.error('Failed to fetch dashboard stats:', err);
      }
    });
  }

  private loadInstructorPendingWorkload(): void {
    if (!this.currentUser) return;

    this.workloadService.getInstructorWorkload(this.currentUser.id).subscribe({
      next: (response) => {
        if (response.success) {
          const pendingCount = response.workload.filter(entry => entry.approved === null).length;
          this.stats.pendingWorkloadCount = pendingCount;

          if (pendingCount > 0) {
            this.urgentTasks.unshift({
              title: 'Pending Workload Approvals',
              description: `You have ${pendingCount} workload entries waiting for your approval`,
              deadline: new Date(new Date().setDate(new Date().getDate() + 1)),
              priority: 'high',
              category: 'Workload',
              actionLink: '/workload/instructor',
              actionText: 'Review Entries'
            });
          }
        }
      },
      error: (err) => {
        console.error('Error loading instructor workload:', err);
      }
    });
  }
}
