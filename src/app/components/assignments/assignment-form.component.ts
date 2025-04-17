import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AssignmentService } from '../../services/assignment.service';
import { WorkloadService } from '../../services/workload.service';
import { Assignment } from '../../models/assignment.model';

@Component({
  selector: 'app-assignment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './assignment-form.component.html',
  styleUrls: ['./assignment-form.component.css']
})
export class AssignmentFormComponent implements OnInit {
  assignmentForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';
  isEditMode = false;
  assignmentId: string | null = null;
  
  // Mock data for courses and TAs
  courses = [
    { id: 'CS101', name: 'Introduction to Computer Science' },
    { id: 'CS205', name: 'Data Structures' },
    { id: 'CS301', name: 'Algorithms' },
    { id: 'CS401', name: 'Database Systems' },
    { id: 'CS201', name: 'Object-Oriented Programming' }
  ];
  
  teachingAssistants = [
    { id: 'TA001', name: 'John Doe' },
    { id: 'TA002', name: 'Jane Smith' },
    { id: 'TA003', name: 'Michael Brown' },
    { id: 'TA004', name: 'Emily Johnson' },
    { id: 'TA005', name: 'David Wilson' }
  ];

  constructor(
    private fb: FormBuilder,
    private assignmentService: AssignmentService,
    private workloadService: WorkloadService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  initForm(): void {
    this.assignmentForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      courseId: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      dueDate: [this.getDefaultDueDate(), Validators.required],
      estimatedHours: [5, [Validators.required, Validators.min(1), Validators.max(100)]],
      status: ['pending', Validators.required],
      assignedTAs: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if we're in edit mode
    this.assignmentId = this.route.snapshot.paramMap.get('id');
    if (this.assignmentId) {
      this.isEditMode = true;
      this.loadAssignment(this.assignmentId);
    }
  }
  
  loadAssignment(id: string): void {
    this.assignmentService.getAssignmentById(id).subscribe({
      next: (assignment) => {
        if (assignment) {
          this.assignmentForm.patchValue({
            title: assignment.title,
            courseId: assignment.courseId,
            description: assignment.description,
            dueDate: assignment.dueDate,
            estimatedHours: assignment.estimatedHours,
            status: assignment.status,
            assignedTAs: assignment.assignedTAs
          });
        } else {
          this.submitError = true;
          this.errorMessage = 'Assignment not found';
        }
      },
      error: (err) => {
        this.submitError = true;
        this.errorMessage = 'Error loading assignment';
        console.error('Error loading assignment:', err);
      }
    });
  }

  // Getter for assigned TAs array
  get assignedTAs(): string[] {
    const assignedTAsControl = this.assignmentForm.get('assignedTAs');
    return assignedTAsControl ? assignedTAsControl.value : [];
  }

  // Helper methods for TA selection
  isTASelected(taId: string): boolean {
    return this.assignedTAs.includes(taId);
  }

  toggleTASelection(taId: string): void {
    const currentTAs = [...this.assignedTAs];
    
    if (this.isTASelected(taId)) {
      // Remove TA if already selected
      const index = currentTAs.indexOf(taId);
      if (index !== -1) {
        currentTAs.splice(index, 1);
      }
    } else {
      // Add TA if not selected
      currentTAs.push(taId);
    }
    
    this.assignmentForm.get('assignedTAs')?.setValue(currentTAs);
  }

  submitAssignment(): void {
    if (this.assignmentForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.assignmentForm.controls).forEach(key => {
        const control = this.assignmentForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    const formValues = this.assignmentForm.value;
    
    const assignment: Assignment = {
      id: this.assignmentId || `A${Date.now().toString().slice(-6)}`,
      title: formValues.title,
      courseId: formValues.courseId,
      description: formValues.description,
      dueDate: formValues.dueDate,
      estimatedHours: formValues.estimatedHours,
      status: formValues.status,
      assignedTAs: formValues.assignedTAs,
      createdAt: new Date().toISOString()
    };

    const saveObservable = this.isEditMode 
      ? this.assignmentService.updateAssignment(assignment)
      : this.assignmentService.addAssignment(assignment);

    saveObservable.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        
        // After 2 seconds, redirect to assignments list
        setTimeout(() => {
          this.router.navigate(['/assignments']);
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = true;
        this.errorMessage = err.message || 'Failed to save assignment. Please try again.';
      }
    });
  }

  getDefaultDueDate(): string {
    const today = new Date();
    // Default due date is 7 days from now
    today.setDate(today.getDate() + 7);
    
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  resetForm(): void {
    if (this.isEditMode) {
      // In edit mode, reload the original data
      if (this.assignmentId) {
        this.loadAssignment(this.assignmentId);
      }
    } else {
      // In create mode, reset to defaults
      this.assignmentForm.reset({
        status: 'pending',
        dueDate: this.getDefaultDueDate(),
        estimatedHours: 5,
        assignedTAs: []
      });
    }
  }

  // Helper methods for form validation
  hasError(controlName: string, errorName: string): boolean {
    const control = this.assignmentForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorName));
  }
} 