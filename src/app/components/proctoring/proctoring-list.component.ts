import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TAService } from '../../services/ta.service';
import { ExamService } from '../../services/exam.service';
import { CourseService } from '../../services/course.service';
import { ProctoringAssignmentService } from '../../services/proctoring-assignment.service';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../shared/icon.component';
import { Exam } from '../../shared/models/exam.model';
import { Course } from '../../shared/models/course.model';
import { TA } from '../../shared/models/ta.model';

@Component({
  selector: 'app-proctoring-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, IconComponent, FormsModule],
  templateUrl: './proctoring-list.component.html',
  styleUrl: './proctoring-list.component.css'
})
export class ProctoringListComponent implements OnInit {
  exams: Exam[] = [];
  filteredExams: Exam[] = [];
  courses: Course[] = [];
  tas: TA[] = [];
  assignedCounts: { [key: number]: number } = {};
  classroomCounts: { [key: number]: number } = {};

  searchTerm = '';
  departmentFilter = '';
  dateFilter = '';
  
  // Permission flag
  canManageProctors = false;

  constructor(
    private examService: ExamService,
    private courseService: CourseService,
    private taService: TAService,
    private proctoringAssignmentService: ProctoringAssignmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('ProctoringListComponent initialized');
    // Check user permissions
    this.checkPermissions();
    
    this.loadCourses();
    this.loadTAs();
    this.loadExams();
  }
  
  checkPermissions(): void {
    const allowedRoles = ['authstaff', 'deansoffice', 'departmentchair', 'instructor'];
    this.canManageProctors = this.authService.hasRole(allowedRoles);
  }

  private loadExams() {
    console.log('Loading exams...');
    this.examService.getAllExams().subscribe({
      next: (exams: Exam[]) => {
        console.log('Exams loaded:', exams);
        this.exams = exams;
        this.filteredExams = exams;
        this.updateAssignmentCounts();
        this.updateClassroomCounts();
      },
      error: (error: any) => {
        console.error('Error loading exams:', error);
      }
    });
  }

  private loadCourses() {
    console.log('Loading courses...');
    this.courseService.getAllCourses().subscribe({
      next: (courses: Course[]) => {
        console.log('Courses loaded:', courses);
        this.courses = courses;
      },
      error: (error: any) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  private loadTAs() {
    this.taService.getAllTAs().subscribe({
      next: (tas: TA[]) => {
        this.tas = tas.filter(ta => !ta.isOnLeave && ta.proctoringEnabled);
      },
      error: (error: any) => {
        console.error('Error loading TAs:', error);
      }
    });
  }

  private updateAssignmentCounts() {
    // Update the counts for each exam
    this.exams.forEach(exam => {
      this.proctoringAssignmentService.getAssignedProctorCount(exam.id).subscribe({
        next: (count: number) => {
          this.assignedCounts[exam.id] = count;
        },
        error: (error: any) => {
          console.error(`Error loading assignments for exam ${exam.id}:`, error);
        }
      });
    });
  }

  private updateClassroomCounts() {
    this.exams.forEach(exam => {
      this.examService.getClassroomsForExam(exam.id).subscribe({
        next: (classrooms) => {
          this.classroomCounts[exam.id] = classrooms.length;
        },
        error: (err) => {
          console.error(`Error fetching classrooms for exam ${exam.id}:`, err);
        }
      });
    });
  }
  
  getCourseName(courseID: number): string {
    const course = this.courses.find(c => c.id === courseID);
    return course ? course.name : 'Unknown Course';
  }

  getCourseCode(courseID: number): string {
    const course = this.courses.find(c => c.id === courseID);
    return course ? course.course_code : 'Unknown';
  }

  getDepartmentClass(code: string): string {
    return code.substring(0, 2).toLowerCase();
  }

  getAvailableProctors(): number {
    return this.tas.length;
  }

  getProctorShortage(): number {
    const totalRequired = this.exams.reduce((sum, exam) => sum + exam.proctorsRequired, 0);
    const totalAssigned = Object.values(this.assignedCounts).reduce((sum, count) => sum + count, 0);
    return Math.max(0, totalRequired - totalAssigned);
  }

  onSearch(event: Event): void {
    this.applyFilters();
  }

  filterByDepartment(event: Event) {
    const department = (event.target as HTMLSelectElement).value;
    if (!department) {
      this.filteredExams = this.exams;
      return;
    }
    this.filteredExams = this.exams.filter(exam => 
      this.getCourseCode(exam.courseID).startsWith(department)
    );
  }

  filterByDate(event: Event) {
    const filter = (event.target as HTMLSelectElement).value;
    const now = new Date();
    switch (filter) {
      case 'upcoming':
        this.filteredExams = this.exams.filter(exam => new Date(exam.date) > now);
        break;
      case 'past':
        this.filteredExams = this.exams.filter(exam => new Date(exam.date) <= now);
        break;
      default:
        this.filteredExams = this.exams;
    }
  }

  applyFilters(): void {
    this.filteredExams = this.exams.filter(exam => {
      const course = this.courses.find(c => c.id === exam.courseID);
      
      // Search term filter
      if (this.searchTerm) {
        const searchVal = this.searchTerm.toLowerCase();
        const courseMatches = course && (
          course.name.toLowerCase().includes(searchVal) || 
          course.course_code.toLowerCase().includes(searchVal)
        );
        
        if (!courseMatches) {
          return false;
        }
      }
      
      // Department filter
      if (this.departmentFilter && course) {
        if (!course.department.toLowerCase().includes(this.departmentFilter.toLowerCase())) {
          return false;
        }
      }
      
      // Date filter
      if (this.dateFilter) {
        const examDate = new Date(exam.date).toISOString().substring(0, 10);
        if (examDate !== this.dateFilter) {
          return false;
        }
      }
      
      return true;
    });
  }

  createNewExam(): void {
    this.router.navigate(['/proctoring/new']);
  }

  assignProctors(examId: number) {
    if (this.canManageProctors) {
      this.router.navigate(['/proctoring/assign', examId]);
    }
  }
}

