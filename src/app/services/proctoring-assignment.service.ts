import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { TA } from '../shared/models/ta.model';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { NotificationService } from './notification.service';
import { ExamService } from './exam.service';
import { CourseService } from './course.service';

@Injectable({
  providedIn: 'root'
})
export class ProctoringAssignmentService {
  private apiUrl = `${environment.apiUrl}/proctoring-assignments`;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private examService: ExamService,
    private courseService: CourseService
  ) {}

  assignProctors(examId: number, taIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${examId}/assign`, { taIds }).pipe(
      tap(() => {
        // Get exam details to create meaningful notifications
        this.examService.getExamById(examId).subscribe(exam => {
          if (exam) {
            this.courseService.getCourse(exam.courseID).subscribe(course => {
              const courseName = course ? course.name : 'Unknown Course';
              const examDate = new Date(exam.date).toLocaleDateString();
              
              // Create notifications for each assigned TA
              taIds.forEach(taId => {
                this.notificationService.notifyExamAssignment(
                  taId, 
                  examId, 
                  `Exam on ${examDate}`, 
                  courseName, 
                  examDate
                );
              });
            });
          }
        });
      })
    );
  }

  getAssignedTAs(examId: number): Observable<TA[]> {
    return this.http.get<TA[]>(`${this.apiUrl}/${examId}/tas`);
  }

  autoAssignProctors(examId: number): Observable<{ assignedTAIds: number[] }> {
    return this.http.post<{ assignedTAIds: number[] }>(`${this.apiUrl}/${examId}/auto`, {}).pipe(
      tap(response => {
        if (response && response.assignedTAIds && response.assignedTAIds.length > 0) {
          // Get exam details to create meaningful notifications
          this.examService.getExamById(examId).subscribe(exam => {
            if (exam) {
              this.courseService.getCourse(exam.courseID).subscribe(course => {
                const courseName = course ? course.name : 'Unknown Course';
                const examDate = new Date(exam.date).toLocaleDateString();
                
                // Create notifications for each assigned TA
                response.assignedTAIds.forEach(taId => {
                  this.notificationService.notifyExamAssignment(
                    taId, 
                    examId, 
                    `Exam on ${examDate}`, 
                    courseName, 
                    examDate
                  );
                });
              });
            }
          });
        }
      })
    );
  }
  
  getAssignedProctorCount(examId: number): Observable<number> {
    return this.http.get<{ assignedCount: number }>(`${this.apiUrl}/count/${examId}`)
      .pipe(map(res => res.assignedCount));
  }
  
  getTAProctorings(taId: number, period?: string): Observable<any> {
    let url = `${this.apiUrl}/ta/${taId}`;
    if (period) {
      url += `?period=${period}`;
    }
    
    console.log('Calling API endpoint:', url);
    
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    console.error('HTTP Error:', error);
    
    let errorMsg = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMsg = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMsg = `Error Code: ${error.status}, Message: ${error.message}`;
      
      if (error.status === 0) {
        console.error('Backend server not responding. Check that the server is running.');
      }
    }
    
    return throwError(() => new Error(errorMsg));
  }
}
