import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClassroomService } from '../../../services/classroom.service';
import { Classroom } from '../../../shared/models/classroom.model';

@Component({
  selector: 'app-classroom-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <header class="content-header">
        <h1>Classrooms</h1>
        <p class="subtitle">Manage classroom information</p>
        <div class="action-buttons">
          <a routerLink="/classrooms/new" class="btn btn-primary">
            <svg class="svg-icon" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
            </svg>
            Add Classroom
          </a>
        </div>
      </header>

      <div *ngIf="isLoading" class="loading-container">
        <div class="loader"></div>
        <p>Loading classrooms...</p>
      </div>

      <div *ngIf="!isLoading && classrooms.length > 0" class="list-container">
        <div class="list-item" *ngFor="let classroom of classrooms">
          <div class="item-content">
            <div class="item-header">
              <h3>{{ classroom.room }}</h3>
              <span class="capacity-badge">Capacity: {{ classroom.capacity }}</span>
            </div>
          </div>
          <div class="item-actions">
            <a [routerLink]="['/classrooms', classroom.id]" class="btn btn-outline">Edit</a>
            <button (click)="deleteClassroom(classroom.id)" class="btn btn-outline delete-btn">Delete</button>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && classrooms.length === 0" class="no-data">
        <p>No classrooms found.</p>
        <a routerLink="/classrooms/new" class="btn btn-primary">Add Classroom</a>
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

    .capacity-badge {
      background: #e3f2fd;
      color: #1976d2;
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
      font-size: 0.875rem;
    }

    .location {
      color: #666;
      margin: 0.25rem 0;
    }

    .description {
      color: #666;
      margin: 0;
      font-size: 0.875rem;
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
export class ClassroomListComponent implements OnInit {
  classrooms: Classroom[] = [];
  isLoading = true;

  constructor(private classroomService: ClassroomService) {}

  ngOnInit(): void {
    this.loadClassrooms();
  }

  loadClassrooms(): void {
    this.classroomService.getAllClassrooms().subscribe({
      next: (classrooms) => {
        this.classrooms = classrooms;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading classrooms:', err);
        this.isLoading = false;
      }
    });
  }

  deleteClassroom(id: number): void {
    if (confirm('Are you sure you want to delete this classroom?')) {
      this.classroomService.deleteClassroom(id).subscribe({
        next: () => {
          this.classrooms = this.classrooms.filter(c => c.id !== id);
        },
        error: (err) => {
          console.error('Error deleting classroom:', err);
        }
      });
    }
  }
} 