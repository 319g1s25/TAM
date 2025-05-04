import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../shared/icon.component';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../services/auth.service';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';
//import {  UrgentTask } from '../../services/dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
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
    this.userSubscription = this.authService.currentUser.subscribe((user: User | null) => {
      this.currentUser = user;
      this.updateWelcomeMessage();
    });

    this.loadStats();
    //this.loadUrgentTasks();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = {
            ...res.stats,
            examCount: res.stats.examCount || 0
          };
        }
      },
      error: (error: Error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });
  }

  /*private loadUrgentTasks(): void {
    this.dashboardService.getUrgentTasks().subscribe({
      next: (tasks: UrgentTask[]) => {
        this.urgentTasks = tasks;
      },
      error: (error: Error) => {
        console.error('Error loading urgent tasks:', error);
      }
    });
  }*/

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
}
