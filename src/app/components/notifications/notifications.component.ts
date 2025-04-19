import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <div class="notification-icon" (click)="toggleDropdown($event)">
        <i class="material-icons">notifications</i>
        <span *ngIf="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
      </div>
      
      <div class="notifications-dropdown" *ngIf="isDropdownOpen">
        <div class="notifications-header">
          <h3>Notifications</h3>
          <button *ngIf="notifications.length > 0" (click)="markAllAsRead()">Mark all as read</button>
        </div>
        
        <div class="notifications-list" *ngIf="notifications.length > 0; else emptyState">
          <div 
            *ngFor="let notification of notifications" 
            class="notification-item" 
            [class.unread]="!notification.read"
            [class.info]="notification.type === 'info'"
            [class.success]="notification.type === 'success'"
            [class.warning]="notification.type === 'warning'"
            [class.error]="notification.type === 'error'"
            (click)="markAsRead(notification.id)"
          >
            <div class="notification-content">
              <p class="notification-message">{{ notification.message }}</p>
              <p class="notification-time">{{ notification.timestamp | date:'shortTime' }}</p>
            </div>
            <button class="delete-btn" (click)="removeNotification(notification.id, $event)">
              <i class="material-icons">close</i>
            </button>
          </div>
        </div>
        <ng-template #emptyState>
          <div class="empty-state">
            <p>No notifications</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: relative;
    }

    .notification-icon {
      position: relative;
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
    }

    .notification-badge {
      position: absolute;
      top: 0;
      right: 0;
      background-color: #e74c3c;
      color: white;
      border-radius: 50%;
      min-width: 18px;
      height: 18px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px;
    }

    .notifications-dropdown {
      position: absolute;
      top: 48px;
      right: 0;
      width: 320px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      max-height: 420px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .notifications-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
    }

    .notifications-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .notifications-header button {
      background: none;
      border: none;
      color: #3498db;
      cursor: pointer;
      font-size: 14px;
    }

    .notifications-list {
      overflow-y: auto;
      max-height: 350px;
    }

    .notification-item {
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .notification-item:hover {
      background-color: #f9f9f9;
    }

    .notification-item.unread {
      background-color: #f0f7ff;
    }

    .notification-item.info { border-left: 4px solid #3498db; }
    .notification-item.success { border-left: 4px solid #2ecc71; }
    .notification-item.warning { border-left: 4px solid #f39c12; }
    .notification-item.error { border-left: 4px solid #e74c3c; }

    .notification-content {
      flex: 1;
    }

    .notification-message {
      margin: 0 0 4px 0;
      font-size: 14px;
    }

    .notification-time {
      margin: 0;
      font-size: 12px;
      color: #7f8c8d;
    }

    .delete-btn {
      background: none;
      border: none;
      color: #bdc3c7;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
    }

    .delete-btn:hover {
      color: #e74c3c;
    }

    .empty-state {
      padding: 24px 16px;
      text-align: center;
      color: #7f8c8d;
    }
  `]
})
export class NotificationsComponent {
  notifications: Notification[] = [];
  isDropdownOpen = false;
  unreadCount = 0;

  constructor(private notificationService: NotificationService) {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      this.unreadCount = this.notificationService.getUnreadCount();
    });
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  markAsRead(id: number) {
    this.notificationService.markAsRead(id);
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  removeNotification(id: number, event: Event) {
    event.stopPropagation();
    this.notificationService.removeNotification(id);
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    this.isDropdownOpen = false;
  }
} 