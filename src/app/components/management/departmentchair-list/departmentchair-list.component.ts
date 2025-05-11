import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DepartmentChairService, DepartmentChair } from '../../../services/departmentchair.service';

@Component({
  selector: 'app-departmentchair-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <header class="content-header">
        <h1>Department Chairs</h1>
        <p class="subtitle">Manage department chair accounts</p>
        <div class="action-buttons">
          <a routerLink="/departmentchairs/new" class="btn btn-primary">
            <svg class="svg-icon" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
            </svg>
            Add Department Chair
          </a>
        </div>
      </header>

      <div *ngIf="isLoading" class="loading-container">
        <div class="loader"></div>
        <p>Loading department chairs...</p>
      </div>

      <div *ngIf="!isLoading && chairs.length > 0" class="list-container">
        <div class="list-item" *ngFor="let chair of chairs">
          <div class="item-content">
            <div class="item-header">
              <h3>{{ chair.name }} {{ chair.surname }}</h3>
              <span class="department-badge">{{ chair.department }}</span>
            </div>
            <p class="email">{{ chair.email }}</p>
          </div>
          <div class="item-actions">
            <a [routerLink]="['/departmentchairs', chair.id]" class="btn btn-outline">Edit</a>
            <button (click)="deleteChair(chair.id)" class="btn btn-outline delete-btn">Delete</button>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && chairs.length === 0" class="no-data">
        <p>No department chairs found.</p>
        <a routerLink="/departmentchairs/new" class="btn btn-primary">Add Department Chair</a>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
    }

    .content-header {
      margin-bottom: 2rem;
    }

    .subtitle {
      color: #666;
      margin-bottom: 1rem;
    }

    .list-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .item-content {
      flex: 1;
    }

    .item-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .department-badge {
      background: #e3f2fd;
      color: #1976d2;
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
      font-size: 0.875rem;
    }

    .email {
      color: #666;
      margin: 0;
    }

    .item-actions {
      display: flex;
      gap: 0.5rem;
    }

    .delete-btn {
      color: #dc3545;
      border-color: #dc3545;
    }

    .delete-btn:hover {
      background: #dc3545;
      color: white;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .loader {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class DepartmentChairListComponent implements OnInit {
  chairs: DepartmentChair[] = [];
  isLoading = true;

  constructor(private departmentChairService: DepartmentChairService) {}

  ngOnInit(): void {
    this.loadChairs();
  }

  loadChairs(): void {
    this.departmentChairService.getAllDepartmentChairs().subscribe({
      next: (chairs) => {
        this.chairs = chairs;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading department chairs:', err);
        this.isLoading = false;
      }
    });
  }

  deleteChair(id: number): void {
    if (confirm('Are you sure you want to delete this department chair?')) {
      this.departmentChairService.deleteDepartmentChair(id).subscribe({
        next: () => {
          this.chairs = this.chairs.filter(c => c.id !== id);
        },
        error: (err) => {
          console.error('Error deleting department chair:', err);
        }
      });
    }
  }
}
