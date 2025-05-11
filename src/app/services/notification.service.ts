import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
  event?: string;
  entityId?: number;
  userId?: number;
  // Array of roles allowed to see this notification (if empty, all roles can see it)
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  
  private idCounter = 1;
  private readonly STORAGE_KEY = 'tam_notifications';

  constructor(private authService: AuthService) {
    // Load notifications from localStorage
    this.loadNotifications();
  }

  private loadNotifications() {
    try {
      const storedNotifications = localStorage.getItem(this.STORAGE_KEY);
      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications);
        // Convert string timestamps back to Date objects
        const notifications = parsedNotifications.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        this.notificationsSubject.next(notifications);
        
        // Set the idCounter to the highest ID + 1
        if (notifications.length > 0) {
          const maxId = Math.max(...notifications.map((n: Notification) => n.id));
          this.idCounter = maxId + 1;
        }
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
    }
  }

  private saveNotifications() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notificationsSubject.value));
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  }

  getNotifications() {
    return this.notificationsSubject.value;
  }

  getUnreadCount() {
    return this.notificationsSubject.value.filter(n => !n.read).length;
  }

  getNotificationsForUser(userId: number) {
    const currentUserRole = this.authService.currentUserValue?.role;
    
    return this.notificationsSubject.value.filter(n => {
      // Filter by userId if specified (personal notifications)
      const userMatch = !n.userId || n.userId === userId;
      
      // Filter by role if roles are specified
      const roleMatch = !n.roles || n.roles.length === 0 || 
                        (currentUserRole && n.roles.includes(currentUserRole));
      
      return userMatch && roleMatch;
    });
  }

  addNotification(message: string, type: 'info' | 'success' | 'warning' | 'error', options?: { 
    event?: string, 
    entityId?: number,
    userId?: number,
    roles?: string[]
  }) {
    const newNotification: Notification = {
      id: this.idCounter++,
      message,
      type,
      read: false,
      timestamp: new Date(),
      event: options?.event,
      entityId: options?.entityId,
      userId: options?.userId,
      roles: options?.roles
    };
    
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([newNotification, ...currentNotifications]);
    this.saveNotifications();
    
    return newNotification;
  }
  
  // Special notification methods for specific events
  notifyExamAssignment(taId: number, examId: number, examName: string, courseName: string, examDate: string) {
    return this.addNotification(
      `You have been assigned to proctor "${examName}" for ${courseName} on ${examDate}.`,
      'info',
      {
        event: 'proctor_assignment',
        entityId: examId,
        userId: taId
      }
    );
  }
  
  notifyExamCreated(examName: string, courseName: string) {
    return this.addNotification(
      `New exam "${examName}" created for ${courseName}.`,
      'success',
      {
        event: 'exam_created',
        // Only instructors, department chairs, and dean's office staff need to know about new exams
        roles: ['instructor', 'departmentchair', 'deansoffice']
      }
    );
  }

  notifyLeaveRequest(taName: string, approved: boolean, userId?: number) {
    const status = approved ? 'approved' : 'rejected';
    return this.addNotification(
      `Your leave request has been ${status}.`,
      approved ? 'success' : 'warning',
      {
        event: 'leave_request_update',
        userId: userId
      }
    );
  }

  markAsRead(id: number) {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(updatedNotifications);
    this.saveNotifications();
  }

  markAllAsRead() {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(updatedNotifications);
    this.saveNotifications();
  }

  removeNotification(id: number) {
    const notifications = this.notificationsSubject.value;
    this.notificationsSubject.next(notifications.filter(n => n.id !== id));
    this.saveNotifications();
  }

  clearAll() {
    this.notificationsSubject.next([]);
    this.saveNotifications();
  }
}