import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { Assignment } from '../models/assignment.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private apiUrl = `${environment.apiUrl}/assignments`;
  
  // Mock data for development
  private mockAssignments: Assignment[] = [
    {
      id: 'A001',
      title: 'Grade Midterm Exams',
      courseId: 'CS101',
      description: 'Grade all midterm exams for Introduction to Computer Science. Follow the rubric provided.',
      dueDate: '2023-05-20',
      estimatedHours: 8,
      status: 'completed',
      assignedTAs: ['TA001', 'TA002'],
      createdAt: '2023-05-01T12:00:00Z'
    },
    {
      id: 'A002',
      title: 'Lab Assistant for Data Structures',
      courseId: 'CS205',
      description: 'Help students during the lab session for binary trees and heaps.',
      dueDate: '2023-05-25',
      estimatedHours: 3,
      status: 'pending',
      assignedTAs: ['TA003'],
      createdAt: '2023-05-05T09:30:00Z'
    },
    {
      id: 'A003',
      title: 'Create Review Materials',
      courseId: 'CS301',
      description: 'Create review materials for the final exam covering sorting algorithms and graph traversal.',
      dueDate: '2023-06-01',
      estimatedHours: 5,
      status: 'in-progress',
      assignedTAs: ['TA001', 'TA004', 'TA005'],
      createdAt: '2023-05-10T15:45:00Z'
    }
  ];

  constructor(private http: HttpClient) {}

  // Get all assignments
  getAssignments(): Observable<Assignment[]> {
    // For demo purposes, return mock data with a simulated delay
    return of(this.mockAssignments).pipe(
      delay(800)
    );
    
    // Uncomment for real API implementation
    /*
    return this.http.get<Assignment[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching assignments', error);
        return of([]);
      })
    );
    */
  }

  // Get assignment by ID
  getAssignmentById(id: string): Observable<Assignment | null> {
    // For demo purposes, find in mock data
    return of(this.mockAssignments.find(a => a.id === id) || null).pipe(
      delay(500)
    );
    
    // Uncomment for real API implementation
    /*
    return this.http.get<Assignment>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching assignment ${id}`, error);
        return of(null);
      })
    );
    */
  }

  // Add new assignment
  addAssignment(assignment: Assignment): Observable<Assignment> {
    // For demo purposes, add to mock data
    return of({ ...assignment }).pipe(
      delay(1000),
      map(newAssignment => {
        this.mockAssignments.push(newAssignment);
        return newAssignment;
      })
    );
    
    // Uncomment for real API implementation
    /*
    return this.http.post<Assignment>(this.apiUrl, assignment).pipe(
      catchError(error => {
        console.error('Error adding assignment', error);
        throw error;
      })
    );
    */
  }

  // Update assignment
  updateAssignment(assignment: Assignment): Observable<Assignment> {
    // For demo purposes, update in mock data
    return of({ ...assignment }).pipe(
      delay(1000),
      map(updatedAssignment => {
        const index = this.mockAssignments.findIndex(a => a.id === assignment.id);
        if (index !== -1) {
          this.mockAssignments[index] = updatedAssignment;
        }
        return updatedAssignment;
      })
    );
    
    // Uncomment for real API implementation
    /*
    return this.http.put<Assignment>(`${this.apiUrl}/${assignment.id}`, assignment).pipe(
      catchError(error => {
        console.error(`Error updating assignment ${assignment.id}`, error);
        throw error;
      })
    );
    */
  }

  // Delete assignment
  deleteAssignment(id: string): Observable<boolean> {
    // For demo purposes, remove from mock data
    return of(true).pipe(
      delay(800),
      map(() => {
        const index = this.mockAssignments.findIndex(a => a.id === id);
        if (index !== -1) {
          this.mockAssignments.splice(index, 1);
          return true;
        }
        return false;
      })
    );
    
    // Uncomment for real API implementation
    /*
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(error => {
        console.error(`Error deleting assignment ${id}`, error);
        return of(false);
      })
    );
    */
  }

  // Get assignments for a specific course
  getAssignmentsByCourse(courseId: string): Observable<Assignment[]> {
    // For demo purposes, filter mock data
    return of(this.mockAssignments.filter(a => a.courseId === courseId)).pipe(
      delay(500)
    );
    
    // Uncomment for real API implementation
    /*
    return this.http.get<Assignment[]>(`${this.apiUrl}?courseId=${courseId}`).pipe(
      catchError(error => {
        console.error(`Error fetching assignments for course ${courseId}`, error);
        return of([]);
      })
    );
    */
  }

  // Get assignments for a specific TA
  getAssignmentsByTA(taId: string): Observable<Assignment[]> {
    // For demo purposes, filter mock data
    return of(this.mockAssignments.filter(a => a.assignedTAs.includes(taId))).pipe(
      delay(500)
    );
    
    // Uncomment for real API implementation
    /*
    return this.http.get<Assignment[]>(`${this.apiUrl}?taId=${taId}`).pipe(
      catchError(error => {
        console.error(`Error fetching assignments for TA ${taId}`, error);
        return of([]);
      })
    );
    */
  }
} 