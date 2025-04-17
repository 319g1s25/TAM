import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Course } from '../shared/models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/courses'; // Replace with your actual API URL
  
  // Mock data for development
  private mockCourses: Course[] = [
    {
      id: 1,
      code: 'CS101',
      name: 'Introduction to Computer Science',
      description: 'An introductory course covering basic concepts of computer science, including programming fundamentals, data structures, and algorithms.',
      department: 'Computer Science',
      credits: 3,
      semester: 'Fall 2023',
      instructorId: 1,
      instructorName: 'Dr. Alan Turing',
      numberOfStudents: 120,
      numberOfTAs: 3,
      taRequirements: 4
    },
    {
      id: 2,
      code: 'CS201',
      name: 'Data Structures and Algorithms',
      description: 'Advanced course covering various data structures and algorithms with an emphasis on design, analysis, and implementation.',
      department: 'Computer Science',
      credits: 4,
      semester: 'Spring 2024',
      instructorId: 2,
      instructorName: 'Dr. Ada Lovelace',
      numberOfStudents: 80,
      numberOfTAs: 2,
      taRequirements: 3
    },
    {
      id: 3,
      code: 'MATH240',
      name: 'Linear Algebra',
      description: 'Study of vector spaces, linear transformations, matrices, and systems of linear equations.',
      department: 'Mathematics',
      credits: 3,
      semester: 'Fall 2023',
      instructorId: 3,
      instructorName: 'Dr. Emmy Noether',
      numberOfStudents: 90,
      numberOfTAs: 2,
      taRequirements: 2
    },
    {
      id: 4,
      code: 'PHYS205',
      name: 'Mechanics',
      description: 'Introduction to classical mechanics, including Newton\'s laws, conservation laws, and oscillatory motion.',
      department: 'Physics',
      credits: 4,
      semester: 'Spring 2024',
      instructorId: 4,
      instructorName: 'Dr. Richard Feynman',
      numberOfStudents: 70,
      numberOfTAs: 2,
      taRequirements: 2
    },
    {
      id: 5,
      code: 'CS305',
      name: 'Database Systems',
      description: 'Design and implementation of database systems, including data modeling, query languages, and transaction processing.',
      department: 'Computer Science',
      credits: 3,
      semester: 'Fall 2023',
      instructorId: 5,
      instructorName: 'Dr. Grace Hopper',
      numberOfStudents: 60,
      numberOfTAs: 1,
      taRequirements: 2
    }
  ];

  constructor(private http: HttpClient) {}

  // Get all courses
  getAllCourses(): Observable<Course[]> {
    // Use this for real API
    // return this.http.get<Course[]>(this.apiUrl);
    
    // Use this for development without a backend
    return of(this.mockCourses);
  }

  // Get a course by ID
  getCourse(id: number): Observable<Course> {
    // Use this for real API
    // return this.http.get<Course>(`${this.apiUrl}/${id}`);
    
    // Use this for development without a backend
    const course = this.mockCourses.find(course => course.id === id);
    return of(course as Course);
  }

  // Add a new course
  addCourse(course: Course): Observable<Course> {
    // Use this for real API
    // return this.http.post<Course>(this.apiUrl, course);
    
    // Use this for development without a backend
    const newCourse = { ...course, id: this.getNextId() };
    this.mockCourses.push(newCourse);
    return of(newCourse);
  }

  // Update a course
  updateCourse(course: Course): Observable<Course> {
    // Use this for real API
    // return this.http.put<Course>(`${this.apiUrl}/${course.id}`, course);
    
    // Use this for development without a backend
    const index = this.mockCourses.findIndex(c => c.id === course.id);
    if (index !== -1) {
      this.mockCourses[index] = course;
    }
    return of(course);
  }

  // Delete a course
  deleteCourse(id: number): Observable<void> {
    // Use this for real API
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    
    // Use this for development without a backend
    const index = this.mockCourses.findIndex(course => course.id === id);
    if (index !== -1) {
      this.mockCourses.splice(index, 1);
    }
    return of(void 0);
  }

  // Helper method to get the next ID for a new course
  private getNextId(): number {
    const maxId = this.mockCourses.reduce((max, course) => (course.id > max ? course.id : max), 0);
    return maxId + 1;
  }
} 