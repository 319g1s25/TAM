import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../shared/icon.component';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../services/auth.service';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';
//import {  UrgentTask } from '../../services/dashboard.service';
import { Subscription } from 'rxjs';
import { TaProctoringCalendarComponent } from './ta-proctoring-calendar/ta-proctoring-calendar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    IconComponent,
    TaProctoringCalendarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isAdminView = false;
  welcomeMessage = 'Welcome to your Dashboard';
  stats: DashboardStats = {
    taCount: 0,
    courseCount: 0,
    assignmentCount: 0,
    pendingAssignmentCount: 0,
    activeCourseCount: 0,
    avgWorkload: 0,
    pendingWorkloadCount: 0,
    reportCount: 0,
    leaveRequestCount: 0,
    examCount: 0,
    taChange: 0
  };
  //urgentTasks: UrgentTask[] = [];
  private userSubscription: Subscription | null = null;

  constructor(
    public authService: AuthService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.setWelcomeMessage();
    });
    this.isAdminView = this.authService.hasRole(['authstaff', 'deansoffice']);
    this.loadDashboardStats();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private setWelcomeMessage(): void {
    if (this.currentUser) {
      const role = this.currentUser.role;
      const time = new Date().getHours();
      let greeting = '';
      
      if (time < 12) {
        greeting = 'Good morning';
      } else if (time < 18) {
        greeting = 'Good afternoon';
      } else {
        greeting = 'Good evening';
      }

      switch(role) {
        case 'authstaff':
          this.welcomeMessage = `${greeting}! Welcome to the Auth Staff dashboard.`;
          break;
        case 'deansoffice':
          this.welcomeMessage = `${greeting}! Welcome to the Dean's Office dashboard.`;
          break;
        case 'departmentchair':
          this.welcomeMessage = `${greeting}! Welcome to the Department Chair dashboard.`;
          break;
        case 'instructor':
          this.welcomeMessage = `${greeting}! Welcome to the Instructor dashboard.`;
          break;
        case 'ta':
          this.welcomeMessage = `${greeting}! Welcome to the TA dashboard.`;
          break;
        default:
          this.welcomeMessage = 'Welcome to your Dashboard';
      }
    }
  }

  private loadDashboardStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.stats = {
            ...response.stats,
            examCount: response.stats.examCount || 0
          };
        }
      },
      error: (error: Error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });
  }
  
  // Permission check methods
  hasAdminRights(): boolean {
    const adminRoles = ['authstaff', 'deansoffice', 'departmentchair'];
    return this.currentUser ? adminRoles.includes(this.currentUser.role) : false;
  }
  
  canManageAssignments(): boolean {
    const allowedRoles = ['authstaff', 'deansoffice', 'departmentchair', 'instructor'];
    return this.currentUser ? allowedRoles.includes(this.currentUser.role) : false;
  }
  
  canManageExams(): boolean {
    const allowedRoles = ['authstaff', 'deansoffice', 'departmentchair', 'instructor'];
    return this.currentUser ? allowedRoles.includes(this.currentUser.role) : false;
  }
}
