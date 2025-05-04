import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TAService } from '../../services/ta.service';
import { ExamService } from '../../services/exam.service';
import { CourseService } from '../../services/course.service';
import { ProctoringAssignmentService } from '../../services/proctoring-assignment.service';
import { IconComponent } from '../shared/icon.component';
import { Exam } from '../../shared/models/exam.model';
import { Course } from '../../shared/models/course.model';
import { TA } from '../../shared/models/ta.model';

@Component({
  selector: 'app-proctoring-list',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './proctoring-list.component.html',
  styleUrl: './proctoring-list.component.css'
})
export class ProctoringListComponent implements OnInit {
  exams: Exam[] = [];
  filteredExams: Exam[] = [];
  courses: Course[] = [];
  tas: TA[] = [];

  assignedCounts: { [examId: number]: number } = {};
  classroomCounts: { [examId: number]: number } = {};

  searchTerm = '';
  departmentFilter = '';
  dateFilter = '';

  constructor(
    private taService: TAService,
    private examService: ExamService,
    private courseService: CourseService,
    private proctoringAssignmentService: ProctoringAssignmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadTAs();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe(
      courses => {
        this.courses = courses;
        this.loadExams();
      },
      err => console.error('Error loading courses:', err)
    );
  }

  loadExams(): void {
    this.examService.getAllExams().subscribe(
      exams => {
        this.exams = exams;
        this.filteredExams = [...exams];

        exams.forEach(exam => {
          this.proctoringAssignmentService.getAssignedProctorCount(exam.id).subscribe(
            count => this.assignedCounts[exam.id] = count,
            err => console.error(`Error fetching count for exam ${exam.id}:`, err)
          );

          this.examService.getClassroomsForExam(exam.id).subscribe(
            classrooms => this.classroomCounts[exam.id] = classrooms.length,
            err => console.error(`Error fetching classrooms for exam ${exam.id}:`, err)
          );
        });
      },
      err => console.error('Error loading exams:', err)
    );
  }

  loadTAs(): void {
    this.taService.getAllTAs().subscribe(
      tas => this.tas = tas,
      err => console.error('Error loading TAs:', err)
    );
  }

  getCourseName(courseID: number): string {
    return this.courses.find(c => c.id === courseID)?.name || 'Unknown Course';
  }

  getCourseCode(courseID: number): string {
    return this.courses.find(c => c.id === courseID)?.course_code || '??';
  }

  getDepartmentClass(courseCode: string): string {
    return `dept-${courseCode.substring(0, 2).toLowerCase()}`;
  }

  getAvailableProctors(): number {
    return this.tas.filter(ta => !ta.isOnLeave && ta.proctoringEnabled).length;
  }

  getProctorShortage(): number {
    return this.exams.reduce((total, exam) => {
      const assigned = this.assignedCounts[exam.id] || 0;
      const shortage = (exam.proctorsRequired || 0) - assigned;
      return total + (shortage > 0 ? shortage : 0);
    }, 0);
  }

  assignProctors(examId: number): void {
    this.router.navigate(['/proctoring/assign', examId]);
  }

  createNewExam(): void {
    this.router.navigate(['/proctoring/new']);
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }

  filterByDepartment(event: Event): void {
    this.departmentFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  filterByDate(event: Event): void {
    this.dateFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.exams];

    if (this.searchTerm) {
      filtered = filtered.filter(exam =>
        this.getCourseName(exam.courseID).toLowerCase().includes(this.searchTerm) ||
        this.getCourseCode(exam.courseID).toLowerCase().includes(this.searchTerm)
      );
    }

    if (this.departmentFilter) {
      filtered = filtered.filter(exam =>
        this.getCourseCode(exam.courseID).startsWith(this.departmentFilter)
      );
    }

    if (this.dateFilter) {
      const today = new Date();
      filtered = filtered.filter(exam => {
        const examDate = new Date(exam.date);
        return this.dateFilter === 'upcoming'
          ? examDate >= today
          : examDate < today;
      });
    }

    this.filteredExams = filtered;
  }
}
