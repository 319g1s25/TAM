import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isExpanded = true;
  currentUser: any = null;
  @Output() sidebarToggled = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const width = window.innerWidth;
    if (width <= 1500) {
      this.isExpanded = false;
      this.sidebarToggled.emit(true);
    } else {
      this.isExpanded = true;
      this.sidebarToggled.emit(false);
    }
  }

  getCurrentUser(): void {
    this.currentUser = this.authService.currentUserValue;
  }

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
    this.sidebarToggled.emit(!this.isExpanded);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserInitials(): string {
    if (!this.currentUser || !this.currentUser.name) {
      return 'U';
    }
    
    const nameParts = this.currentUser.name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    
    return this.currentUser.name.substring(0, 2).toUpperCase();
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
} 