import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { Subscription } from 'rxjs';

interface DashboardStats {
  taCount: number;
  taChange: number;
  courseCount: number;
  activeCourseCount: number;
  assignmentCount: number;
  pendingAssignmentCount: number;
  avgWorkload: number;
  reportCount: number;
  leaveRequestCount: number;
}

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
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  welcomeMessage: string = 'Welcome to your TA Management Dashboard';
  private userSubscription: Subscription | null = null;
  
  // Dashboard statistics
  stats: DashboardStats = {
    taCount: 12,
    taChange: 2,
    courseCount: 8,
    activeCourseCount: 6,
    assignmentCount: 24,
    pendingAssignmentCount: 10,
    avgWorkload: 15.5,
    reportCount: 18,
    leaveRequestCount: 3
  };
  
  // Urgent tasks
  urgentTasks: UrgentTask[] = [
    {
      title: 'Pending TA Assignments',
      description: 'There are 3 courses without TA assignments for the current semester',
      deadline: new Date(new Date().setDate(new Date().getDate() + 5)),
      priority: 'high',
      category: 'Assignments',
      actionLink: '/assignments/add',
      actionText: 'Assign TAs'
    },
    {
      title: 'Workload Reports Due',
      description: 'Weekly workload reports are due for submission',
      deadline: new Date(new Date().setDate(new Date().getDate() + 2)),
      priority: 'medium',
      category: 'Reporting',
      actionLink: '/performance-reports',
      actionText: 'View Reports'
    },
    {
      title: 'Course Evaluation Pending',
      description: 'End of semester course evaluations need to be distributed',
      deadline: new Date(new Date().setDate(new Date().getDate() + 14)),
      priority: 'low',
      category: 'Evaluation',
      actionLink: '/courses',
      actionText: 'View Courses'
    }
  ];

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.updateWelcomeMessage();
    });
    
    // In a real application, you would fetch these stats from a service
    // this.loadDashboardStats();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private updateWelcomeMessage(): void {
    const currentHour = new Date().getHours();
    const userName = this.currentUser?.name?.split(' ')[0] || 'User';
    
    if (currentHour < 12) {
      this.welcomeMessage = `Good morning, ${userName}! Here's your daily overview.`;
    } else if (currentHour < 18) {
      this.welcomeMessage = `Good afternoon, ${userName}! Here's your daily overview.`;
    } else {
      this.welcomeMessage = `Good evening, ${userName}! Here's your daily overview.`;
    }
  }

  // This would be implemented to fetch real data in a production application
  // private loadDashboardStats(): void {
  //   this.dashboardService.getStats().subscribe(stats => {
  //     this.stats = stats;
  //   });
  // }
} 