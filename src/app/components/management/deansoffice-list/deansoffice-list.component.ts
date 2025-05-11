import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeansOfficeService, DeansOffice } from '../../../services/deansoffice.service';

@Component({
  selector: 'app-deansoffice-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <header class="content-header">
        <h1>Deans Office Staff</h1>
        <p class="subtitle">Manage deans office staff accounts</p>
        <div class="action-buttons">
          <a routerLink="/deansoffice/new" class="btn btn-primary">
            <svg class="svg-icon" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
            </svg>
            Add Staff Member
          </a>
        </div>
      </header>

      <div *ngIf="isLoading" class="loading-container">
        <div class="loader"></div>
        <p>Loading staff members...</p>
      </div>

      <div *ngIf="!isLoading && staff.length > 0" class="list-container">
        <div class="list-item" *ngFor="let member of staff">
          <div class="item-content">
            <div class="item-header">
              <h3>{{ member.name }} {{ member.surname }}</h3>
            </div>
            <p class="email">{{ member.email }}</p>
          </div>
          <div class="item-actions">
            <a [routerLink]="['/deansoffice', member.id]" class="btn btn-outline">Edit</a>
            <button (click)="deleteStaffMember(member.id)" class="btn btn-outline delete-btn">Delete</button>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && staff.length === 0" class="no-data">
        <p>No staff members found.</p>
        <a routerLink="/deansoffice/new" class="btn btn-primary">Add Staff Member</a>
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
export class DeansOfficeListComponent implements OnInit {
  staff: DeansOffice[] = [];
  isLoading = true;

  constructor(private deansOfficeService: DeansOfficeService) {}

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.deansOfficeService.getAllDeansOffice().subscribe({
      next: (staff) => {
        this.staff = staff;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading staff:', err);
        this.isLoading = false;
      }
    });
  }

  deleteStaffMember(id: number): void {
    if (confirm('Are you sure you want to delete this staff member?')) {
      this.deansOfficeService.deleteDeansOffice(id).subscribe({
        next: () => {
          this.staff = this.staff.filter(s => s.id !== id);
        },
        error: (err) => {
          console.error('Error deleting staff member:', err);
        }
      });
    }
  }
} 