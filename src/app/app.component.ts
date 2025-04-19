import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NotificationsComponent, ThemeToggleComponent]
})
export class AppComponent implements OnInit {
  title = 'Teaching Assessment Manager';
  isLoginPage = false;
  sidebarCollapsed = false;

  constructor(
    private router: Router,
    public authService: AuthService
  ) {
    // Force navigation to login page on app startup
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    // Track navigation to hide navbar on login page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage = event.url.includes('/login');
      
      // Always redirect to login if user tries to access the root directly
      if ((event.url === '/' || event.url === '') && !this.authService.isLoggedIn) {
        this.router.navigate(['/login']);
      }
    });

    // Check initial URL
    this.isLoginPage = this.router.url.includes('/login');
    
    // Ensure we start at login page if not already on a specific route
    if ((this.router.url === '/' || this.router.url === '') && !this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }
  
  logout() {
    this.authService.logout();
  }

  onSidebarToggle(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }
  
  getCurrentUserName(): string {
    const user = this.authService.currentUserValue;
    if (user) {
      return user.name || 'User';
    }
    return 'User';
  }
}
