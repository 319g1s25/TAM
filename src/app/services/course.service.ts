import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../shared/models/course.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/courses'; // Backend API endpoint

  constructor(private http: HttpClient) {}

  // Get all courses
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}`);
  }
  
  getCoursesByRole(role: string, userId: string): Observable<Course[]> {
  return this.http.get<{ success: boolean; courses: Course[] }>(
    `${this.apiUrl}`, {
      params: { role, userId }
    }
  ).pipe(map(res => res.courses));
}


  // Get a course by ID
  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  // Add a new course
  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  // Update a course
  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${course.id}`, course);
  }

  // Delete a course
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
