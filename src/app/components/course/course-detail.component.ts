import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Course } from '../../shared/models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCourse(Number(id));
    } else {
      this.error = 'Course ID not provided';
      this.isLoading = false;
    }
  }

  loadCourse(id: number): void {
    this.courseService.getCourse(id).subscribe({
      next: (course) => {
        console.log('Loaded course:', course); // <== ADD THIS
        this.course = course;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading course:', err);
        this.error = 'Failed to load course details';
        this.isLoading = false;
      }
    });
  }

  onEdit(): void {
    if (this.course?.id) {
      this.router.navigate(['/courses', this.course.id, 'edit']);
    }
  }

  onBack(): void {
    this.router.navigate(['/courses']);
  }

  getDepartmentClass(department: string): string {
    // Optional: customize styles by department
    switch (department.toLowerCase()) {
      case 'computer science':
        return 'cs-badge';
      case 'mathematics':
        return 'math-badge';
      default:
        return 'default-badge';
    }
  }
  
} 