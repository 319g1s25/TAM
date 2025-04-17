import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <h3>TA Management</h3>
      </div>
      <div class="sidebar-menu">
        <ul>
          <li>
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="icon">📊</i> Dashboard
            </a>
          </li>
          <li>
            <a routerLink="/tas" routerLinkActive="active">
              <i class="icon">👥</i> TAs
            </a>
          </li>
          <li>
            <a routerLink="/courses" routerLinkActive="active">
              <i class="icon">📚</i> Courses
            </a>
          </li>
          <li>
            <a routerLink="/assignments" routerLinkActive="active">
              <i class="icon">📝</i> Assignments
            </a>
          </li>
          <li>
            <a routerLink="/reports" routerLinkActive="active">
              <i class="icon">📈</i> Reports
            </a>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 250px;
      background-color: var(--primary-color);
      color: white;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      z-index: 1000;
    }
    
    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      text-align: center;
    }
    
    .sidebar-header h3 {
      margin: 0;
      color: white;
      font-weight: 500;
    }
    
    .sidebar-menu {
      padding: 15px 0;
      flex-grow: 1;
      overflow-y: auto;
    }
    
    .sidebar-menu ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .sidebar-menu li {
      margin: 0;
      padding: 0;
    }
    
    .sidebar-menu a {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      transition: all 0.3s;
    }
    
    .sidebar-menu a:hover {
      background-color: rgba(255,255,255,0.1);
      color: white;
    }
    
    .sidebar-menu a.active {
      background-color: rgba(255,255,255,0.2);
      color: white;
      border-left: 4px solid var(--accent-color);
    }
    
    .icon {
      margin-right: 10px;
      font-size: 1.2rem;
    }
  `]
})
export class NavbarComponent {
} 