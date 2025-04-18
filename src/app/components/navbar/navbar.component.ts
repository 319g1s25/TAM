import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isSidebarCollapsed = false;
  currentUser: User | null = null;
  private userSubscription: Subscription | null = null;
  
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }

  // Navigation items - Fixed paths to match defined routes
  navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'home' },
    { path: '/performance-reports', label: 'Workload Reports', icon: 'chart-bar' },
    { path: '/assignments', label: 'Assignments', icon: 'clipboard-list' },
    { path: '/workload/add', label: 'Log Hours', icon: 'clock' },
    { path: '/tas', label: 'Teaching Assistants', icon: 'users' },
    { path: '/courses', label: 'Courses', icon: 'book' }
  ];
} 