import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { ClassroomService } from '../../services/classroom.service';
import { Course } from '../../shared/models/course.model';
import { Classroom } from '../../shared/models/classroom.model';

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

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private courseService: CourseService,
    private classroomService: ClassroomService,
    private authService: AuthService,
    public router: Router
  ) {
    this.examForm = this.fb.group({
      courseId: ['', Validators.required],
      date: ['', Validators.required],
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
    this.courseService.getAllCourses().subscribe(
      courses => {
        this.courses = courses;
      },
      error => {
        console.error('Error loading courses:', error);
      }
    );
  }

  loadClassrooms(): void {
    this.classroomService.getAllClassrooms().subscribe(
      classrooms => {
        this.classrooms = classrooms;
      },
      error => {
        console.error('Error loading classrooms:', error);
      }
    );
  }

  toggleClassroomSelection(classroomId: number): void {
    const index = this.selectedClassrooms.indexOf(classroomId);
    if (index === -1) {
      this.selectedClassrooms.push(classroomId);
    } else {
      this.selectedClassrooms.splice(index, 1);
    }
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
        }
      );
    }
  }
} 