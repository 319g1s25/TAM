import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TA  } from '../../shared/models/ta.model';
import { TAService } from '../../services/ta.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ta-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ta-list.component.html' ,
  styleUrls: ['./ta-list.component.css']
})
export class TAListComponent implements OnInit {
  tas: TA[] = [];
  filteredTAs: TA[] = [];
  canManageTAs = false;

  
  constructor(
    private taService: TAService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkPermissions();
    this.loadTAs();
  }
  
  checkPermissions(): void {
    const adminRoles = ['authstaff', 'deansoffice', 'departmentchair'];
    this.canManageTAs = this.authService.hasRole(adminRoles);
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
    if (!this.canManageTAs) return;
    
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