import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TA } from '../../shared/models/ta.model';
import { TAService } from '../../services/ta.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ta-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ta-detail.component.html',
  styleUrls: ['./ta-detail.component.css']
})
export class TADetailComponent implements OnInit {
  ta: TA | null = null;
  isLoading = true;
  error: string | null = null;
  canEditTA = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taService: TAService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check permissions
    this.checkPermissions();
    
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Route param ID:', id);  // 👈 DEBUG LOG
    if (id) {
      this.loadTA(Number(id));
    } else {
      this.error = 'TA ID not provided';
      this.isLoading = false;
    }
  }
  
  checkPermissions(): void {
    const adminRoles = ['authstaff', 'deansoffice', 'departmentchair'];
    this.canEditTA = this.authService.hasRole(adminRoles);
  }
  
  loadTA(id: number): void {
    console.log('Calling getTA() for ID:', id);  // 👈 DEBUG LOG
  
    this.taService.getTA(id).subscribe({
      next: (ta) => {
        console.log('TA loaded:', ta);  // 👈 DEBUG LOG
        this.ta = ta;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading TA:', err);
        this.error = 'Failed to load TA details';
        this.isLoading = false;
      }
    });
  }  

  onEdit(): void {
    if (this.ta?.id && this.canEditTA) {
      this.router.navigate(['/tas', this.ta.id, 'edit']);
    }
  }

  onBack(): void {
    this.router.navigate(['/tas']);
  }
}
