import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Course } from '../../shared/models/course.model';
import { CourseService } from '../../services/course.service';
import { IconComponent } from '../shared/icon.component';
import { TAService } from '../../services/ta.service';
import { TA } from '../../shared/models/ta.model';
import { TAAssignmentService } from '../../services/ta-assignment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  tas: TA[] = [];
  currentUserRole: string = '';
  
  constructor(
    private courseService: CourseService,
    private taService: TAService,
    private taAssignmentService: TAAssignmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    //this.loadTAs();
    this.getCurrentUserRole();
  }

  getCurrentUserRole(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.role) {
      this.currentUserRole = currentUser.role;
    }
  }

  loadCourses(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      console.error('No current user found');
      return;
    }

    this.courseService.getCoursesByRole(currentUser.role, currentUser.id).subscribe(
      courses => {
        this.courses = courses;
        this.filteredCourses = courses;
      },
      error => {
        console.error('Error loading courses:', error);
      }
    );
  }
  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters(searchTerm);
  }

  filterByDepartment(event: Event): void {
    const department = (event.target as HTMLSelectElement).value;
    this.applyFilters(undefined, department);
  }

  filterBySemester(event: Event): void {
    const semester = (event.target as HTMLSelectElement).value;
    this.applyFilters(undefined, undefined, semester);
  }

  applyFilters(searchTerm?: string, department?: string, semester?: string): void {
    let filtered = [...this.courses];

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchTerm) ||
        course.course_code.toLowerCase().includes(searchTerm) ||
        (course.description || '').toLowerCase().includes(searchTerm)
      );
    }

    if (department) {
      filtered = filtered.filter(course => course.department === department);
    }

    if (semester) {
      filtered = filtered.filter(course => course.semester === semester);
    }

    this.filteredCourses = filtered;
  }

  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe(
        () => {
          this.courses = this.courses.filter(course => course.id !== id);
          this.filteredCourses = this.filteredCourses.filter(course => course.id !== id);
        },
        error => {
          console.error('Error deleting course:', error);
        }
      );
    }
  }

  getDepartmentClass(department: string): string {
    switch (department) {
      case 'Computer Science':
        return 'dept-cs';
      case 'Mathematics':
        return 'dept-math';
      case 'Physics':
        return 'dept-physics';
      default:
        return '';
    }
  }
  
  // Calculate statistics
  /*getTotalStudents(): number {
    return this.courses.reduce((total, course) => total + (course.numberOfStudents || 0), 0);
  }
  
  getTotalTAs(): number {
    return this.courses.reduce((total, course) => total + (course.numberOfTAs || 0), 0);
  }
  
  getTAShortage(): number {
    return this.courses.reduce((total, course) => {
      const shortage = (course.ta_required || 0) - (course.numberOfTAs || 0);
      return total + (shortage > 0 ? shortage : 0);
    }, 0);
  }

  assignTAsAutomatically(): void {
    // Get courses that need TAs
    const coursesNeedingTAs = this.courses.filter(course => 
      (course.taRequirements || 0) > (course.numberOfTAs || 0)
    );

    if (coursesNeedingTAs.length === 0) {
      alert('No courses need TA assignments at this time.');
      return;
    }

    // Get available TAs
    const availableTAs = this.tas.filter(ta => !ta.isOnLeave);

    if (availableTAs.length === 0) {
      alert('No available TAs for assignment.');
      return;
    }

    // Generate assignments
    const assignments = this.taAssignmentService.assignTAsAutomatically(coursesNeedingTAs, availableTAs);
    const summary = this.taAssignmentService.generateAssignmentSummary(assignments, coursesNeedingTAs, availableTAs);

    // Show assignment summary and ask for confirmation
    let summaryText = 'Proposed TA Assignments:\n\n';
    
    // Show assigned courses
    if (summary.courseAssignments.length > 0) {
      summaryText += 'Assigned Courses:\n';
      summary.courseAssignments.forEach(course => {
        summaryText += `${course.courseName} (${course.courseCode}):\n`;
        summaryText += `  Required TAs: ${course.requiredTAs}\n`;
        summaryText += `  Assigned TAs: ${course.assignedTAs}\n`;
        if (course.assignedTANames.length > 0) {
          summaryText += '  Assigned TAs:\n';
          course.assignedTANames.forEach(taName => {
            summaryText += `    - ${taName}\n`;
          });
        }
        summaryText += '\n';
      });
    }

    // Show unassigned courses
    if (summary.unassignedCourses.length > 0) {
      summaryText += 'Unassigned Courses:\n';
      summary.unassignedCourses.forEach(course => {
        summaryText += `  ${course.courseName} (${course.courseCode}) - Needs ${course.requiredTAs} TAs\n`;
      });
      summaryText += '\n';
    }

    // Show TA workloads
    summaryText += 'TA Workloads:\n';
    summary.taWorkloads.forEach(ta => {
      summaryText += `  ${ta.taName}: ${ta.assignedCourses} courses (${ta.totalWorkload} hours)\n`;
    });

    if (confirm(`${summaryText}\nDo you want to proceed with these assignments?`)) {
      // Update course TA assignments
      assignments.forEach((taIds, courseId) => {
        const course = coursesNeedingTAs.find(c => c.id === courseId);
        if (course) {
          course.numberOfTAs = (course.numberOfTAs || 0) + taIds.length;
          this.courseService.updateCourse(course).subscribe(
            () => {
              console.log(`Updated TA assignments for course ${course.code}`);
            },
            error => {
              console.error(`Error updating course ${course.code}:`, error);
            }
          );
        }
      });

      alert('TA assignments have been updated successfully.');
      this.loadCourses(); // Refresh the course list
    }
  } */
} 
