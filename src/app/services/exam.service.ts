import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Exam {
  id: number;
  userID: number;
  courseID: number;
  date: Date;
  duration: number;
  proctorsRequired: number;
  course_name?: string;
  course_code?: string;
}

export interface ProctoringAssignment {
  id: number;
  taID: number;
  examID: number;
  status: string;
  ta_name?: string;
  ta_email?: string;
}

export interface ExamCreationRequest {
  userID: number;
  courseID: number;
  date: Date | string;
  duration: number;
  proctorsRequired: number;
  assignmentMethod: 'manual' | 'automatic';
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = `${environment.apiUrl}/exams`;

  constructor(private http: HttpClient) { }

  // Get all exams
  getAllExams(): Observable<{ success: boolean, exams: Exam[] }> {
    return this.http.get<{ success: boolean, exams: Exam[] }>(`${this.apiUrl}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching exams:', error);
          // Return an empty list instead of throwing an error
          return of({ success: false, exams: [] });
        })
      );
  }

  // Get exam by ID with its proctoring assignments
  getExamById(id: number): Observable<{ 
    success: boolean, 
    exam: Exam, 
    proctoringAssignments: ProctoringAssignment[] 
  }> {
    return this.http.get<{ 
      success: boolean, 
      exam: Exam, 
      proctoringAssignments: ProctoringAssignment[] 
    }>(`${this.apiUrl}/${id}`);
  }

  // Create a new exam
  createExam(examData: ExamCreationRequest): Observable<{ 
      success: boolean, 
      message: string, 
      id: number 
    }> {
    // Ensure date is properly formatted
    const formattedData = {
      ...examData,
      date: typeof examData.date === 'string' ? examData.date : examData.date.toISOString()
    };
    
    return this.http.post<{ success: boolean, message: string, id: number }>(this.apiUrl, formattedData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error creating exam:', error);
          return throwError(() => new Error('Failed to create exam. Please try again.'));
        })
      );
  }

  // Update an exam
  updateExam(id: number, examData: Partial<ExamCreationRequest>): Observable<{
    success: boolean,
    message: string
  }> {
    return this.http.put<{
      success: boolean,
      message: string
    }>(`${this.apiUrl}/${id}`, examData);
  }

  // Delete an exam
  deleteExam(id: number): Observable<{
    success: boolean,
    message: string
  }> {
    return this.http.delete<{
      success: boolean,
      message: string
    }>(`${this.apiUrl}/${id}`);
  }

  // Get eligible proctors for an exam
  getEligibleProctors(examId: number): Observable<{
    success: boolean,
    availableTAs: any[]
  }> {
    return this.http.get<{
      success: boolean,
      availableTAs: any[]
    }>(`${this.apiUrl}/${examId}/eligible-proctors`);
  }

  // Manually assign proctors
  assignProctors(examId: number, taIds: number[]): Observable<{
    success: boolean,
    message: string
  }> {
    return this.http.post<{
      success: boolean,
      message: string
    }>(`${this.apiUrl}/${examId}/assign-proctors`, { taIds });
  }

  // Automatically assign proctors to an existing exam
  autoAssignProctors(examId: number): Observable<{
    success: boolean,
    message: string
  }> {
    return this.http.post<{
      success: boolean,
      message: string
    }>(`${this.apiUrl}/${examId}/auto-assign`, {});
  }
}
