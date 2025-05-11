import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomService } from '../../../services/classroom.service';

@Component({
  selector: 'app-classroom-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './classroom-form.component.html',
  styleUrl: './classroom-form.component.css'
})
export class ClassroomFormComponent implements OnInit {
  classroomForm: FormGroup;
  isEditMode = false;
  classroomId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private classroomService: ClassroomService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.classroomForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.classroomId = +id;
      this.loadClassroomData();
    }
  }

  loadClassroomData(): void {
    if (this.classroomId) {
      this.classroomService.getClassroomById(this.classroomId).subscribe({
        next: (classroom) => {
          this.classroomForm.patchValue({
            name: classroom.room,
            capacity: classroom.capacity
          });
        },
        error: (err) => {
          console.error('Error loading classroom:', err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.classroomForm.valid) {
      const classroomData = this.classroomForm.value;
      
      if (this.isEditMode && this.classroomId) {
        this.classroomService.updateClassroom(this.classroomId, classroomData).subscribe({
          next: () => {
            this.router.navigate(['/classrooms']);
          },
          error: (err) => {
            console.error('Error updating classroom:', err);
          }
        });
      } else {
        this.classroomService.createClassroom(classroomData).subscribe({
          next: () => {
            this.router.navigate(['/classrooms']);
          },
          error: (err) => {
            console.error('Error creating classroom:', err);
          }
        });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/classrooms']);
  }
} 