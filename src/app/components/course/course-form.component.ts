import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Course } from '../../shared/models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  course: Course = {
    name: '',
    department: '',
    course_code: '',
    description: '',
    semester: '',
    credit: 0,
    ta_required: 0
  };

  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadCourse(parseInt(id, 10));
    }
  }

  loadCourse(id: number): void {
    console.log('loadCourse called with id:', id);

    this.courseService.getCourse(id).subscribe(
      course => {
        this.course = { ...course, id }; 
        console.log("this.course is ", this.course);
      },
      error => {
        console.error('Error loading course:', error);
        this.router.navigate(['/courses']);
      }
    );
  }

  onSubmit(): void {
    if (!this.course.name || !this.course.course_code || !this.course.department) {
      console.warn("Form is incomplete.");
      return;
    }

    if (this.isEditing) {
      this.courseService.updateCourse(this.course).subscribe(
        updatedCourse => {
          console.log('Course updated successfully:', updatedCourse);
          this.router.navigate(['/courses']);
        },
        error => {
          console.error('Error updating course:', error);
        }
      );
    } else {
      this.courseService.addCourse(this.course).subscribe(
        newCourse => {
          console.log('Course added successfully:', newCourse);
          this.router.navigate(['/courses']);
        },
        error => {
          console.error('Error adding course:', error);
        }
      );
    }
  }
}
