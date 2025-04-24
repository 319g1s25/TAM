import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TA } from '../../shared/models/ta.model';
import { TAService } from '../../services/ta.service';

@Component({
  selector: 'app-ta-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ta-form.component.html',
  styleUrls: ['./ta-form.component.css']
})

export class TAFormComponent implements OnInit {
  ta: TA = {
    name: '',
    surname: '',
    email: '',
    password: '',
    isOnLeave: false,
    totalWorkload: 20,
    msOrPhdStatus: '',
    proctoringEnabled: true,
    department: ''
  };
  
  isEditing = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taService: TAService
  ) {}
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadTA(parseInt(id, 10));
    }
  }
  
  loadTA(id: number): void {
    this.taService.getTA(id).subscribe(
      ta => {
        this.ta = ta;
      },
      error => {
        console.error('Error loading TA:', error);
        this.router.navigate(['/tas']);
      }
    );
  }
  
  onSubmit(): void {

    console.log('Create TA button clicked', this.ta); 
    
    if (!this.ta.name || !this.ta.email || !this.ta.department) {
      console.warn("Form is incomplete.");
      return;
    }

    if (this.isEditing) {
      this.taService.updateTA(this.ta).subscribe(
        updatedTa => {
          console.log('TA updated successfully:', updatedTa);
          this.router.navigate(['/tas']);
        },
        error => {
          console.error('Error updating TA:', error);
        }
      );
    } else {
      this.taService.addTA(this.ta).subscribe(
        newTa => {
          console.log('TA added successfully:', newTa);
          this.router.navigate(['/tas']);
        },
        error => {
          console.error('Error adding TA:', error);
        }
      );
    }
  }
} 