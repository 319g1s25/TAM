import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  
  private idCounter = 1;

  constructor() {
    // Add some dummy notifications for testing
    this.addNotification('Welcome to the Teaching Assessment Manager', 'info');
    this.addNotification('New assignment added to CSC301', 'success');
  }

  getNotifications() {
    return this.notificationsSubject.value;
  }

  getUnreadCount() {
    return this.notificationsSubject.value.filter(n => !n.read).length;
  }

  addNotification(message: string, type: 'info' | 'success' | 'warning' | 'error') {
    const newNotification: Notification = {
      id: this.idCounter++,
      message,
      type,
      read: false,
      timestamp: new Date()
    };
    
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([newNotification, ...currentNotifications]);
    
    return newNotification;
  }

  markAsRead(id: number) {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(updatedNotifications);
  }

  markAllAsRead() {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(updatedNotifications);
  }

  removeNotification(id: number) {
    const notifications = this.notificationsSubject.value;
    this.notificationsSubject.next(notifications.filter(n => n.id !== id));
  }

  clearAll() {
    this.notificationsSubject.next([]);
  }
} 