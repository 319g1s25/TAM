import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TAService } from '../../services/ta.service';
import { CourseService } from '../../services/course.service';
import { TAAssignmentService } from '../../services/ta-assignment.service';
import { TA } from '../../shared/models/ta.model';
import { Course } from '../../shared/models/course.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manual-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manual-assignment.component.html',
  styleUrls: ['./manual-assignment.component.css']
})
export class ManualAssignmentComponent implements OnInit {
  assignmentForm: FormGroup;
  tas: TA[] = [];
  courses: Course[] = [];
  isLoading = false;
  isAutoAssigning = false;
  isLoadingAssignments = false;
  errorMessage = '';
  successMessage = '';
  assignmentError = '';
  autoAssignmentSummary = '';
  assignments: { ta: any, course: any }[] = [];

  constructor(
    private fb: FormBuilder,
    private taService: TAService,
    private courseService: CourseService,
    private taAssignmentService: TAAssignmentService
  ) {
    this.assignmentForm = this.fb.group({
      taId: [null, Validators.required],
      courseId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadTAs();
    this.loadAssignments();
  }

  loadTAs(): void {
    this.taService.getAllTAs().subscribe({
      next: (tas) => {
        this.tas = tas;
      },
      error: (error) => {
        console.error('Error loading TAs:', error);
        this.errorMessage = 'Failed to load teaching assistants';
      }
    });
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.errorMessage = 'Failed to load courses';
      }
    });
  }

  /**
   * Load current TA assignments
   */
  loadAssignments(): void {
    this.isLoadingAssignments = true;
    this.assignmentError = '';
    
    this.taAssignmentService.getTAAssignments().subscribe({
      next: (assignments: { ta: any, course: any }[]) => {
        this.assignments = assignments;
        this.isLoadingAssignments = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading assignments:', error);
        this.assignmentError = 'Failed to load current assignments. Please try again later.';
        this.isLoadingAssignments = false;
      }
    });
  }

  /**
   * Remove a TA assignment
   */
  removeAssignment(taId: number, courseId: number): void {
    if (confirm('Are you sure you want to remove this TA assignment?')) {
      this.taAssignmentService.removeTAFromCourse(taId, courseId).subscribe({
        next: (response: { success: boolean; message: string }) => {
          this.successMessage = response.message || 'TA assignment removed successfully';
          this.loadAssignments(); // Reload assignments
          this.loadTAs(); // Refresh TA data as well
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error removing assignment:', error);
          this.errorMessage = error.error?.message || 'Failed to remove assignment';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.assignmentForm.invalid) {
      this.errorMessage = 'Please select both a course and a TA';
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const { taId, courseId } = this.assignmentForm.value;
    
    // Get the TA and course objects for better user feedback
    const selectedTA = this.tas.find(t => t.id == taId);
    const selectedCourse = this.courses.find(c => c.id == courseId);
    
    // Log assignment request details for debugging
    console.log('Attempting to assign TA to course with:', {
      taId: taId,
      courseId: courseId,
      taInfo: selectedTA,
      courseInfo: selectedCourse
    });

    // Convert IDs to numbers if they're strings
    const numericTaId = typeof taId === 'string' ? parseInt(taId, 10) : taId;
    const numericCourseId = typeof courseId === 'string' ? parseInt(courseId, 10) : courseId;

    this.taAssignmentService.assignTAToCourse(numericTaId, numericCourseId).subscribe({
      next: (response: { success: boolean; message: string }) => {
        console.log('Assignment successful:', response);
        this.isLoading = false;
        
        // Create a nice, descriptive success message
        const taName = selectedTA ? `${selectedTA.name} ${selectedTA.surname}` : 'TA';
        const courseName = selectedCourse ? `${selectedCourse.course_code} - ${selectedCourse.name}` : 'course';
        
        if (response.message) {
          this.successMessage = response.message;
        } else if (response.success) {
          this.successMessage = `Successfully assigned ${taName} to ${courseName}`;
        } else {
          this.successMessage = 'Assignment completed';
        }
        
        this.loadTAs(); // Refresh TAs to update workload
        this.loadAssignments(); // Refresh the assignments list
        this.assignmentForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('Assignment error details:', {
          error: error,
          statusText: error.statusText,
          status: error.status,
          message: error.error?.message || 'Unknown error',
          errorObject: error.error
        });
        
        // Show error message to user
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (typeof error.error === 'string') {
          this.errorMessage = error.error;
        } else {
          this.errorMessage = 'Failed to assign TA to course. Please check console for details.';
        }
      }
    });
  }
  
  /**
   * Automatically assign TAs to courses based on backend logic
   */
  autoAssignTAs(): void {
    this.isAutoAssigning = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.autoAssignmentSummary = '';
    
    this.taAssignmentService.autoAssignTAs().subscribe({
      next: (response: { message: string; totalCoursesAssigned: number }) => {
        this.isAutoAssigning = false;
        console.log('Auto-assignment successful:', response);
        
        // Format summary message
        this.autoAssignmentSummary = `Successfully assigned TAs to ${response.totalCoursesAssigned} courses. ${response.message}`;
        
        // Reload assignments to show the updated list
        this.loadAssignments();
        this.loadTAs();
      },
      error: (error: HttpErrorResponse) => {
        this.isAutoAssigning = false;
        console.error('Auto-assignment error:', error);
        
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Failed to automatically assign TAs. Please try again later.';
        }
      }
    });
  }






}
