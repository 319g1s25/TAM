import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { ClassroomService } from '../../services/classroom.service';
import { Course } from '../../shared/models/course.model';
import { Classroom } from '../../shared/models/classroom.model';

// Custom validator for past dates
function noPastDateValidator(control: AbstractControl): ValidationErrors | null {
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate date comparison
  
  if (selectedDate < today) {
    return { pastDate: true };
  }
  return null;
}

@Component({
  selector: 'app-exam-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.css']
})
export class ExamFormComponent implements OnInit {
  examForm: FormGroup;
  courses: Course[] = [];
  classrooms: Classroom[] = [];
  selectedClassrooms: number[] = [];
  currentUserId: string = '';
  errorMessage: string = '';
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private courseService: CourseService,
    private classroomService: ClassroomService,
    private authService: AuthService,
    public router: Router
  ) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.examForm = this.fb.group({
      courseId: ['', Validators.required],
      date: ['', [Validators.required, noPastDateValidator]],
      duration: ['', [Validators.required, Validators.min(1)]],
      proctorsRequired: ['', [Validators.required, Validators.min(1)]],
      classrooms: [[], Validators.required],
      userId: ['', Validators.required] 
    });
  }

  ngOnInit(): void {
    console.log("ngoninit for exam form triggered");
    this.loadCourses();
    this.loadClassrooms();

    // get the current id of the user
    const currentUser = this.authService.currentUserValue;
    if (currentUser && (currentUser.role === 'instructor' || currentUser.role === 'deansoffice' 
      || currentUser.role === 'departmentchair' || currentUser.role === 'authstaff')) {
    this.currentUserId = currentUser.id;
    this.examForm.patchValue({
      userId: currentUser.id
    });
  }
  }

  loadCourses(): void {
  const currentUser = this.authService.currentUserValue;
  if (!currentUser) return;

  const { role, id: userId } = currentUser;

  this.courseService.getCoursesByRole(role, userId).subscribe({
    next: (courses) => {this.courses = courses; console.log('loaded courses: ', this.courses);},
    error: () => this.errorMessage = 'Could not load courses'
  });
}


  loadClassrooms(): void {
    this.classroomService.getAllClassrooms().subscribe(
      classrooms => {
        console.log('Raw classroom data:', classrooms);
        
        if (!classrooms || classrooms.length === 0) {
          this.errorMessage = 'No classrooms available. Please contact administrator.';
          console.error('No classrooms found.');
          return;
        }
        
        // Ensure classrooms data is properly formatted
        this.classrooms = classrooms.map(classroom => {
          // Make sure each classroom has the required fields
          if (typeof classroom === 'object' && classroom !== null) {
            return {
              id: classroom.id || 0,
              room: classroom.room || '',
              capacity: classroom.capacity || 0,
              examCapacity: classroom.examCapacity || 0
            };
          } else {
            console.error('Invalid classroom data format:', classroom);
            return null;
          }
        }).filter(c => c !== null) as Classroom[];
        
        console.log('Processed classrooms:', this.classrooms);
      },
      error => {
        console.error('Error loading classrooms:', error);
        this.errorMessage = 'Failed to load classrooms. Please try again.';
      }
    );
  }

  toggleClassroomSelection(classroomId: number): void {
    console.log('Toggle classroom selection:', classroomId);
    const index = this.selectedClassrooms.indexOf(classroomId);
    if (index === -1) {
      this.selectedClassrooms.push(classroomId);
    } else {
      this.selectedClassrooms.splice(index, 1);
    }
    console.log('Selected classrooms:', this.selectedClassrooms);
    this.examForm.patchValue({ classrooms: this.selectedClassrooms });
  }

  onSubmit(): void {
    if (this.examForm.valid) {
      const examData = {
        ...this.examForm.value,
        classrooms: this.selectedClassrooms
      };

      console.log('Submitting exam:', examData);

      this.examService.createExam(examData).subscribe(
        response => {
          console.log('✅ Exam created:', response);

          // Navigate to proctor assignment page
          this.router.navigate(['/proctoring/assign', response.id]);
        },
        error => {
          console.error('Error creating exam:', error);
          this.errorMessage = 'Failed to create exam. Please try again.';
        }
      );
    }
  }
} 