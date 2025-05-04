import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { WorkloadEntry } from '../shared/models/task.model';
import { Course } from '../shared/models/course.model';

export interface TAWorkloadSummary {
  taId: string;
  taName: string;
  totalHours: number;
  taskBreakdown: Record<string, number>; // e.g. { 'grading': 10, 'officeHours': 5 }
  courseBreakdown: Record<string, number>; // e.g. { 'CS101': 8, 'CS201': 7 }
  completionRate: number; // Percentage of completed tasks
}

export interface InstructorWorkloadEntry extends WorkloadEntry {
  course_code: string;
  course_title: string;
  ta_name: string;
  ta_email: string;
  approved: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class WorkloadService {
  private apiUrl = 'http://localhost:3000/api';
  
  constructor(private http: HttpClient) {}

  // Get all workload entries
  getWorkloadEntries(): Observable<WorkloadEntry[]> {
    return this.http.get<{ success: boolean; workload: WorkloadEntry[] }>(`${this.apiUrl}/workload`)
      .pipe(map(response => response.workload));
  }

  // Get workload entries for a specific TA
  getWorkloadEntriesByTA(taId: string): Observable<WorkloadEntry[]> {
    return this.http.get<{ success: boolean; workload: WorkloadEntry[] }>(`${this.apiUrl}/workload/ta?ta_id=${taId}`)
      .pipe(map(response => response.workload));
  }

  submitWorkload(entry: WorkloadEntry): Observable<{ success: boolean; id: number }> {
    return this.http.post<{ success: boolean; id: number }>(`${this.apiUrl}/workload`, entry);
  }

  deleteWorkload(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/workload/${id}`);
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }  

  getTAWorkloadSummaries(period: string): Observable<TAWorkloadSummary[]> {
    return this.http.get<TAWorkloadSummary[]>(`${this.apiUrl}/workload/summary?period=${period}`);
  }

  // Get workload entries for an instructor
  getInstructorWorkload(instructorId: string | number): Observable<{ success: boolean; workload: InstructorWorkloadEntry[] }> {
    return this.http.get<{ success: boolean; workload: InstructorWorkloadEntry[] }>(
      `${this.apiUrl}/workload/instructor/${instructorId}`
    ).pipe(
      catchError(error => {
        console.error('Error fetching instructor workload:', error);
        return of({ success: false, workload: [] });
      })
    );
  }

  approveWorkloadEntry(taskId: string, approved: boolean): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(
      `${this.apiUrl}/workload/${taskId}/approve`,
      { approved }
    );
  }
  
} 