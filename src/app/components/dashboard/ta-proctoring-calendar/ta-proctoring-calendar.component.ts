import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProctoringAssignmentService } from '../../../services/proctoring-assignment.service';
import { AuthService } from '../../../services/auth.service';

interface ProctoringEvent {
  id: number;
  examID: number;
  date: string;
  courseName: string;
  course_code: string;
  duration: number;
  status: string;
}

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  hasEvents: boolean;
  events: ProctoringEvent[];
}

@Component({
  selector: 'app-ta-proctoring-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ta-proctoring-calendar.component.html',
  styleUrls: ['./ta-proctoring-calendar.component.css']
})
export class TaProctoringCalendarComponent implements OnInit {
  proctoringEvents: ProctoringEvent[] = [];
  loading = true;
  error = '';
  selectedPeriod = 'all'; // all, week, month
  usingMockData = false;
  
  // Calendar properties
  calendarDays: CalendarDay[] = [];
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentMonth = '';
  
  constructor(
    private proctoringService: ProctoringAssignmentService,
    private authService: AuthService
  ) {
    console.log('TA Proctoring Calendar Component initialized');
    console.log('Current user is TA:', this.authService.isTA);
    console.log('Current user:', this.authService.currentUserValue);
  }

  ngOnInit(): void {
    this.loadProctoringEvents();
  }

  loadProctoringEvents(): void {
    this.loading = true;
    this.error = '';

    // Get current user's TA ID
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || !currentUser.id) {
      this.error = 'User not authenticated';
      this.loading = false;
      return;
    }

    console.log('Trying to load proctoring data for TA:', currentUser.id);
    
    this.proctoringService.getTAProctorings(Number(currentUser.id), this.selectedPeriod).subscribe({
      next: (response) => {
        console.log('API response received:', response);
        if (response && response.success) {
          this.proctoringEvents = response.assignments || [];
          console.log('Loaded proctoring events:', this.proctoringEvents);
          
          if (this.proctoringEvents.length > 0) {
            this.generateCalendarDays();
          } else {
            this.calendarDays = [];
            console.log('No proctoring events found for this period');
          }
        } else {
          console.error('Failed API response:', response);
          this.error = 'Failed to load proctoring assignments';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading proctoring assignments:', err);
        this.error = 'Error loading assignments. Please try again later.';
        this.loading = false;
      }
    });
  }

  onPeriodChange(): void {
    this.loadProctoringEvents();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  }

  formatEventTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric'
    });
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} mins`;
    } else if (mins === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${mins} mins`;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  }

  // Calendar functionality
  generateCalendarDays(): void {
    if (this.proctoringEvents.length === 0) {
      this.calendarDays = [];
      return;
    }

    const today = new Date();
    const firstEventDate = new Date(this.proctoringEvents[0].date);
    
    // Get the first day of the month for the first event
    const firstDayOfMonth = new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1);
    
    // Get the last day of the month
    const lastDayOfMonth = new Date(firstEventDate.getFullYear(), firstEventDate.getMonth() + 1, 0);
    
    // Update current month display
    this.currentMonth = firstEventDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    
    // Calculate days from previous month to show
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Create calendar grid
    this.calendarDays = [];
    
    // Add days from previous month
    const prevMonth = new Date(firstDayOfMonth);
    prevMonth.setDate(0); // Last day of previous month
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonthDays - i);
      this.calendarDays.push({
        date,
        dayNumber: date.getDate(),
        isCurrentMonth: false,
        hasEvents: false,
        events: []
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), i);
      
      // Check if there are events for this day
      const dayEvents = this.proctoringEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === i && 
               eventDate.getMonth() === date.getMonth() && 
               eventDate.getFullYear() === date.getFullYear();
      });
      
      this.calendarDays.push({
        date,
        dayNumber: i,
        isCurrentMonth: true,
        hasEvents: dayEvents.length > 0,
        events: dayEvents
      });
    }
    
    // Add days from next month to complete the grid
    const daysToAdd = 42 - this.calendarDays.length; // 6 rows * 7 days = 42
    
    if (daysToAdd > 0) {
      for (let i = 1; i <= daysToAdd; i++) {
        const date = new Date(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth() + 1, i);
        this.calendarDays.push({
          date,
          dayNumber: i,
          isCurrentMonth: false,
          hasEvents: false,
          events: []
        });
      }
    }
  }
}
