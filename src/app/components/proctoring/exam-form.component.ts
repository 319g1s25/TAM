import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { CourseService } from '../../services/course.service';
import { ClassroomService } from '../../services/classroom.service';
import { Course } from '../../shared/models/course.model';
import { Classroom } from '../../shared/models/classroom.model';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.css']
})
export class ExamFormComponent implements OnInit {
  examForm: FormGroup;
  courses: Course[] = [];
  classrooms: Classroom[] = [];
  selectedClassrooms: number[] = [];

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private courseService: CourseService,
    private classroomService: ClassroomService,
    private router: Router
  ) {
    this.examForm = this.fb.group({
      courseId: ['', Validators.required],
      date: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      proctorsRequired: ['', [Validators.required, Validators.min(1)]],
      classrooms: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    console.log("ngoninit for exam form triggered");
    this.loadCourses();
    this.loadClassrooms();
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
        userId: 1, // TODO: Get from auth service
        classrooms: this.selectedClassrooms
      };

      this.examService.createExam(examData).subscribe(
        response => {
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