import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TA } from '../../shared/models/ta.model';
import { TAService } from '../../services/ta.service';

@Component({
  selector: 'app-ta-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="content-container">
      <header class="content-header">
        <h1>Teaching Assistants</h1>
        <button class="btn btn-accent" routerLink="/tas/new">
          <svg class="svg-icon" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
          </svg>
          Add New TA
        </button>
      </header>
      
      <div class="card">
        <div class="search-filter-bar">
          <div class="search-container">
            <svg class="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
            <input type="text" placeholder="Search TAs..." class="form-control" (input)="onSearch($event)">
          </div>
          
          <div class="filter-options">
            <select class="form-control">
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
            </select>
            
            <select class="form-control">
              <option value="">All Status</option>
              <option value="MS">MS</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
        </div>
        
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Status</th>
                <th>Workload</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ta of filteredTAs">
                <td>{{ ta.id }}</td>
                <td>{{ ta.name }} {{ ta.surname }}</td>
                <td>{{ ta.email }}</td>
                <td>{{ ta.department }}</td>
                <td>
                  <span class="status-badge" [class.ms-badge]="ta.msOrPhdStatus === 'MS'" [class.phd-badge]="ta.msOrPhdStatus === 'PhD'">
                    {{ ta.msOrPhdStatus }}
                  </span>
                </td>
                <td>
                  <div class="workload-container">
                    <div class="workload-bar" [style.width.%]="(ta.totalWorkload / 40) * 100"></div>
                    <span>{{ ta.totalWorkload }} hrs</span>
                  </div>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-sm" [routerLink]="['/tas', ta.id]">View</button>
                    <button class="btn btn-sm btn-accent" [routerLink]="['/tas', ta.id, 'edit']">Edit</button>
                    <button class="btn btn-sm btn-danger-outline" (click)="deleteTA(ta.id)">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredTAs.length === 0">
                <td colspan="7" class="text-center">No teaching assistants found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .content-container {
      padding: 0 15px;
    }
    
    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    
    .search-filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .search-container {
      position: relative;
      flex-grow: 1;
      min-width: 200px;
    }
    
    .search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      fill: #7f8c8d;
    }
    
    .search-container input {
      padding-left: 35px;
    }
    
    .filter-options {
      display: flex;
      gap: 10px;
    }
    
    .filter-options select {
      min-width: 150px;
    }
    
    .status-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    
    .ms-badge {
      background-color: #bbdefb;
      color: #1565c0;
    }
    
    .phd-badge {
      background-color: #c8e6c9;
      color: #2e7d32;
    }
    
    .workload-container {
      position: relative;
      width: 100%;
      height: 18px;
      background-color: #f5f5f5;
      border-radius: 9px;
      overflow: hidden;
    }
    
    .workload-bar {
      position: absolute;
      height: 100%;
      background-color: var(--primary-color);
      border-radius: 9px;
    }
    
    .workload-container span {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.75rem;
      color: #333;
      text-shadow: 0 0 2px rgba(255,255,255,0.8);
    }
    
    .btn-sm {
      padding: 5px 8px;
      font-size: 0.9rem;
    }
    
    .btn-danger {
      background-color: var(--warn-color);
    }
    
    .btn-danger:hover {
      background-color: #d32f2f;
    }
    
    .action-buttons {
      display: flex;
      gap: 5px;
    }
    
    .text-center {
      text-align: center;
    }
    
    .table-container {
      overflow-x: auto;
    }
    
    .table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }
    
    .table th,
    .table td {
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    .table th {
      font-weight: 600;
      color: #2c3e50;
      background-color: #f9f9f9;
    }
    
    .svg-icon {
      width: 24px;
      height: 24px;
      fill: currentColor;
      vertical-align: middle;
    }
    
    .btn .svg-icon {
      margin-right: 5px;
      width: 18px;
      height: 18px;
    }
    
    @media (max-width: 768px) {
      .content-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      
      .filter-options {
        width: 100%;
        flex-direction: column;
      }
    }
  `]
})
export class TAListComponent implements OnInit {
  tas: TA[] = [];
  filteredTAs: TA[] = [];
  
  constructor(private taService: TAService) {}

  ngOnInit(): void {
    this.loadTAs();
  }
  
  loadTAs(): void {
    this.taService.getAllTAs().subscribe(
      tas => {
        this.tas = tas;
        this.filteredTAs = tas;
      },
      error => {
        console.error('Error loading TAs:', error);
      }
    );
  }
  
  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredTAs = this.tas.filter(ta => 
      ta.name.toLowerCase().includes(searchTerm) || 
      ta.surname.toLowerCase().includes(searchTerm) || 
      ta.email.toLowerCase().includes(searchTerm) ||
      ta.department.toLowerCase().includes(searchTerm)
    );
  }
  
  deleteTA(id: number): void {
    if (confirm('Are you sure you want to delete this TA?')) {
      this.taService.deleteTA(id).subscribe(
        () => {
          this.tas = this.tas.filter(ta => ta.id !== id);
          this.filteredTAs = this.filteredTAs.filter(ta => ta.id !== id);
        },
        error => {
          console.error('Error deleting TA:', error);
        }
      );
    }
  }
} 