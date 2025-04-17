import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>TA Management Dashboard</h1>
        <p class="subtitle">Welcome to the Teaching Assistant Management System</p>
      </header>
      
      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>Total TAs</h3>
            <p class="stat-value">12</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>Courses</h3>
            <p class="stat-value">8</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <h3>Assignments</h3>
            <p class="stat-value">24</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⚠️</div>
          <div class="stat-content">
            <h3>Leave Requests</h3>
            <p class="stat-value">3</p>
          </div>
        </div>
      </div>
      
      <div class="dashboard-grid">
        <div class="card">
          <h2>TA Management</h2>
          <p>Manage teaching assistants and their assignments</p>
          <a routerLink="/tas" class="btn">View TAs</a>
        </div>
        
        <div class="card">
          <h2>Course Management</h2>
          <p>Add, edit or remove courses and their details</p>
          <a routerLink="/courses" class="btn">View Courses</a>
        </div>
        
        <div class="card">
          <h2>Assignment Planning</h2>
          <p>Create and manage TA assignments to courses</p>
          <a routerLink="/assignments" class="btn">View Assignments</a>
        </div>
        
        <div class="card">
          <h2>Performance Reports</h2>
          <p>Generate reports on TA workload and performance</p>
          <a routerLink="/reports" class="btn">View Reports</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 0 15px;
    }
    
    .dashboard-header {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    
    .subtitle {
      color: var(--light-text-color);
      font-size: 1.1rem;
    }
    
    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: var(--card-color);
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
    }
    
    .stat-icon {
      font-size: 2.5rem;
      margin-right: 20px;
      color: var(--primary-color);
    }
    
    .stat-content h3 {
      margin: 0;
      font-size: 0.9rem;
      color: var(--light-text-color);
    }
    
    .stat-value {
      font-size: 1.8rem;
      font-weight: bold;
      margin: 5px 0 0;
      color: var(--primary-color);
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 200px;
    }
    
    .card h2 {
      color: var(--primary-color);
      margin-bottom: 10px;
    }
    
    .card p {
      margin-bottom: 20px;
      flex-grow: 1;
    }
    
    @media (max-width: 768px) {
      .dashboard-stats {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `]
})
export class DashboardComponent {
} 