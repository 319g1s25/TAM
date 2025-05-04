import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Course } from '../../shared/models/course.model';
import { CourseService } from '../../services/course.service';
import { IconComponent } from '../shared/icon.component';

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

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe(
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
}
