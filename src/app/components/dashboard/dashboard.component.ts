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
<<<<<<< HEAD
=======
  
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
>>>>>>> d1486f6081bd45e158529aca6408e4c1a81ae960

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
<<<<<<< HEAD
=======
    
    // Initialize calendar and events
    this.generateCalendarDays(new Date());
    this.filterEvents(this.eventFilter);
    this.updateCurrentMonth();
    
    // In a real application, you would fetch these stats from a service
    // this.loadDashboardStats();
>>>>>>> d1486f6081bd45e158529aca6408e4c1a81ae960
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

<<<<<<< HEAD
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
=======
  // Calendar and event methods
  filterEvents(period: 'week' | 'month' | 'all'): void {
    this.eventFilter = period;
    const today = new Date();
    
    if (period === 'week') {
      // Filter events for the current week
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay()); // Start from Sunday
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // End on Saturday
      
      this.filteredEvents = this.upcomingEvents.filter(event => {
        return event.date >= weekStart && event.date <= weekEnd;
      });
    } else if (period === 'month') {
      // Filter events for the current month
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      this.filteredEvents = this.upcomingEvents.filter(event => {
        return event.date >= monthStart && event.date <= monthEnd;
      });
    } else {
      // Show all events
      this.filteredEvents = [...this.upcomingEvents];
    }
    
    // Sort events by date
    this.filteredEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Update calendar to reflect filtered events
    this.updateCalendarWithEvents();
  }
  
  openEventDetails(event: UpcomingEvent): void {
    // In a real app, this would open a modal or navigate to event details
    console.log('Opening event details for:', event);
    // Example of showing details in an alert for now
    alert(`Event: ${event.title}\nDate: ${event.date.toLocaleDateString()}\nTime: ${event.date.toLocaleTimeString()}\n\n${event.description}`);
  }
  
  generateCalendarDays(date: Date): void {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Days from previous month to fill the first week
    const daysFromPrevMonth = firstDay.getDay();
    // Days from next month to fill the last week
    const daysFromNextMonth = 6 - lastDay.getDay();
    
    // Generate array of days
    this.calendarDays = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
      this.calendarDays.push({
        day: i,
        isToday: false,
        hasEvent: false,
        isOtherMonth: true
      });
    }
    
    // Add days from current month
    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      const isToday = currentDate.getDate() === today.getDate() &&
                        currentDate.getMonth() === today.getMonth() &&
                        currentDate.getFullYear() === today.getFullYear();
      
      this.calendarDays.push({
        day: i,
        isToday,
        hasEvent: false, // Will be updated in updateCalendarWithEvents
        isOtherMonth: false
      });
    }
    
    // Add days from next month
    for (let i = 1; i <= daysFromNextMonth; i++) {
      this.calendarDays.push({
        day: i,
        isToday: false,
        hasEvent: false,
        isOtherMonth: true
      });
    }
  }
  
  updateCalendarWithEvents(): void {
    // Reset all events
    this.calendarDays.forEach(day => day.hasEvent = false);
    
    // Mark days with events
    this.upcomingEvents.forEach(event => {
      const eventDate = new Date(event.date);
      const eventDay = eventDate.getDate();
      const eventMonth = eventDate.getMonth();
      
      // Find the corresponding day in the calendar
      const calendarDay = this.calendarDays.find(day => {
        // For current month days
        if (!day.isOtherMonth && day.day === eventDay) {
          return true;
        }
        return false;
      });
      
      if (calendarDay) {
        calendarDay.hasEvent = true;
      }
    });
  }
  
  updateCurrentMonth(): void {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const today = new Date();
    this.currentMonth = `${months[today.getMonth()]} ${today.getFullYear()}`;
  }
  
  // This would be implemented to fetch real data in a production application
  // private loadDashboardStats(): void {
  //   this.dashboardService.getStats().subscribe(stats => {
  //     this.stats = stats;
  //   });
  // }
} 
>>>>>>> d1486f6081bd45e158529aca6408e4c1a81ae960
