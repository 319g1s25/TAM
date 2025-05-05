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


interface UpcomingEvent {
  title: string;
  date: Date;
  description: string;
  id?: number; // Optional ID for event details
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
  
  // Dashboard statistics
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
  
  // Event filtering and calendar properties
  eventFilter: 'week' | 'month' | 'all' = 'week';
  filteredEvents: UpcomingEvent[] = [];
  calendarDays: Array<{day: number, isToday: boolean, hasEvent: boolean, isOtherMonth: boolean}> = [];
  currentMonth: string = '';

  // Upcoming events
  upcomingEvents: UpcomingEvent[] = [
    {
      id: 1,
      title: 'TA Orientation',
      date: new Date(new Date().setHours(10, 0, 0, 0)),
      description: 'Mandatory orientation session for all new TAs.'
    },
    {
      id: 2,
      title: 'Course Registration Deadline',
      date: new Date(new Date().setDate(new Date().getDate() + 7)),
      description: 'Last day for students to register for courses.'
    },
    {
      id: 3,
      title: 'Midterm Exam Week',
      date: new Date(new Date().setDate(new Date().getDate() + 15)),
      description: 'Midterm exams for all undergraduate courses.'
    },
    {
      id: 4,
      title: 'TA Performance Review',
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      description: 'Quarterly performance review for teaching assistants'
    },
    {
      id: 5,
      title: 'Department Meeting',
      date: new Date(new Date().setDate(new Date().getDate() + 10)),
      description: 'Monthly department meeting to discuss curriculum changes'
    }
  ];

  // Urgent tasks
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
    
    // Initialize calendar and events
    this.generateCalendarDays(new Date());
    this.filterEvents(this.eventFilter);
    this.updateCurrentMonth();
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
  
  // Calendar and event methods
  filterEvents(period: 'week' | 'month' | 'all'): void {
    this.eventFilter = period;
    const today = new Date();
    
    switch (period) {
      case 'week':
        // Filter events for next 7 days
        const weekFromNow = new Date(today);
        weekFromNow.setDate(today.getDate() + 7);
        this.filteredEvents = this.upcomingEvents.filter(event => {
          return event.date >= today && event.date <= weekFromNow;
        });
        break;
      case 'month':
        // Filter events for current month
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        this.filteredEvents = this.upcomingEvents.filter(event => {
          return event.date >= today && event.date <= endOfMonth;
        });
        break;
      default:
        // Show all upcoming events
        this.filteredEvents = [...this.upcomingEvents];
    }
    
    // Sort by date
    this.filteredEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  
  generateCalendarDays(currentDate: Date): void {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and number of days
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Calculate days needed from previous month for grid alignment
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    this.calendarDays = [];
    
    // Add days from previous month if needed
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      this.calendarDays.push({
        day: prevMonthDays - i,
        isToday: false,
        hasEvent: false,
        isOtherMonth: true
      });
    }
    
    // Add current month days
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    for (let i = 1; i <= daysInMonth; i++) {
      // Check if any events are on this day
      const eventDate = new Date(year, month, i);
      const hasEvent = this.upcomingEvents.some(event => {
        const eventDay = event.date.getDate();
        const eventMonth = event.date.getMonth();
        const eventYear = event.date.getFullYear();
        return eventDay === i && eventMonth === month && eventYear === year;
      });
      
      this.calendarDays.push({
        day: i,
        isToday: i === currentDay && month === currentMonth && year === currentYear,
        hasEvent: hasEvent,
        isOtherMonth: false
      });
    }
    
    // Add days from next month if needed
    const totalDaysShown = this.calendarDays.length;
    const daysNeededFromNextMonth = 42 - totalDaysShown;
    
    for (let i = 1; i <= daysNeededFromNextMonth; i++) {
      this.calendarDays.push({
        day: i,
        isToday: false,
        hasEvent: false,
        isOtherMonth: true
      });
    }
  }
  
  updateCurrentMonth(): void {
    const now = new Date();
    this.currentMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  }
  
  openEventDetails(event: UpcomingEvent): void {
    // This method displays event details when an event is clicked
    console.log('Opening event details for:', event);
    alert(`Event: ${event.title}\nDate: ${event.date.toLocaleDateString()}\nTime: ${event.date.toLocaleTimeString()}\n\n${event.description}`);
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
