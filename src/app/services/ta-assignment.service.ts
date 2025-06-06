import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaCourse } from '../shared/models/tacourse.model';

@Injectable({
  providedIn: 'root'
})
export class TAAssignmentService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Sends a request to the backend to automatically assign TAs to courses.
   * The backend handles all matching logic and inserts into ta_course table.
   * 
   * @returns An observable with the assignment summary
   */
  autoAssignTAs(): Observable<{
    message: string;
    totalCoursesAssigned: number;
  }> { 
    console.log('Calling auto-assign TA endpoint');
    return this.http.post<{ message: string; totalCoursesAssigned: number; }>(`${this.apiUrl}/ta-assignments/auto`, {})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error during auto-assignment:', error);
          throw error;
        })
      );
  }

  /**
   * Manually assign a TA to a course
   * @param taId The ID of the TA
   * @param courseId The ID of the course
   * @returns An observable with the assignment result
   */
  assignTAToCourse(taId: number, courseId: number): Observable<{ success: boolean; message: string }> {
    // Ensure we're passing numeric IDs and the correct payload structure
    const payload = {
      taId: Number(taId),
      courseId: Number(courseId),
      ta_id: Number(taId),     // Add alternative field names for compatibility
      course_id: Number(courseId)
    };
    
    console.log('Sending assignment request with payload:', payload);
    
    // Try the main endpoint first
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/ta-assignments/manual`, payload)
      .pipe(
        catchError((error) => {
          console.log('First endpoint failed, trying fallback endpoint');
          // Try another endpoint if the first one fails
          return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/assignments`, payload);
        })
      );
  }

  /**
   * Remove a TA from a course
   * @param taId The ID of the TA
   * @param courseId The ID of the course
   * @returns An observable with the removal result
   */
  removeTAFromCourse(taId: number, courseId: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/ta-assignments/manual/${courseId}/${taId}`);
  }

  /**
   * Get all TA assignments
   * @returns An observable with all TA course assignments
   */
  getTAAssignments(): Observable<{ ta: any, course: any }[]> {
    return this.http.get<{ ta: any, course: any }[]>(`${this.apiUrl}/ta-assignments`);
  }

  /**
   * Get TAs assigned to a specific course
   * @param courseId The ID of the course
   * @returns An observable with TAs assigned to the course
   */
  getTAsForCourse(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ta-assignments/course/${courseId}`);
  }

  /**
   * Get courses assigned to a specific TA
   * @param taId The ID of the TA
   * @returns An observable with courses assigned to the TA
   */
  getCoursesForTA(taId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ta-assignments/ta/${taId}`);
  }
}
