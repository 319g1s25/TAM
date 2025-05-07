import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { CourseService } from '../../services/course.service';
import { ProctoringAssignmentService } from '../../services/proctoring-assignment.service';
import { Exam } from '../../shared/models/exam.model';
import { Course } from '../../shared/models/course.model';
import { TA } from '../../shared/models/ta.model';
import { Classroom } from '../../shared/models/classroom.model';

@Component({
  selector: 'app-exam-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.css']
})
export class ExamDetailsComponent implements OnInit {
  exam: Exam | null = null;
  course: Course | null = null;
  assignedTAs: TA[] = [];
  classrooms: { id: number; name: string }[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private courseService: CourseService,
    private proctoringAssignmentService: ProctoringAssignmentService
  ) {}

  ngOnInit(): void {
    const examId = Number(this.route.snapshot.paramMap.get('id'));
    if (examId) {
      this.loadExam(examId);
    }
  }

  loadExam(id: number): void {
    this.loading = true;
    this.examService.getExamById(id).subscribe({
      next: (exam) => {
        this.exam = exam;
        this.loadCourse(exam.courseID);
        this.loadAssignedTAs(id);
        this.loadClassrooms(id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading exam:', error);
        this.loading = false;
      }
    });
  }

  loadCourse(courseId: number): void {
    this.courseService.getCourse(courseId).subscribe({
      next: (course) => this.course = course,
      error: (error) => console.error('Error loading course:', error)
    });
  }

  loadAssignedTAs(examId: number): void {
    this.proctoringAssignmentService.getAssignedTAs(examId).subscribe({
      next: (tas) => {
        this.assignedTAs = tas;
      },
      error: (error) => {
        console.error('Error loading assigned TAs:', error);
      }
    });
  }

  loadClassrooms(examId: number): void {
    this.examService.getClassroomsForExam(examId).subscribe({
      next: (classrooms) => {
        this.classrooms = classrooms;
      },
      error: (error) => {
        console.error('Error loading classrooms:', error);
      }
    });
  }

  goToAssignProctors(): void {
    if (this.exam) {
      this.router.navigate(['/proctoring/assign', this.exam.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/proctoring']);
  }
} 