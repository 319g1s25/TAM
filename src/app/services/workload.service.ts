import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { TAService } from './ta.service';
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
  
  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private taService: TAService
  ) {}

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
    return this.http.post<{ success: boolean; id: number }>(`${this.apiUrl}/workload`, entry).pipe(
      tap(response => {
        if (response.success) {
          const taId = entry.taID;
          // Create notification for the TA who submitted the workload
          this.notificationService.addNotification(
            `You've successfully logged ${entry.hoursspent} hours for ${entry.tasktype} on ${new Date(entry.date).toLocaleDateString()}.`,
            'success',
            {
              event: 'workload_submitted',
              entityId: response.id,
              userId: typeof taId === 'string' ? parseInt(taId as string, 10) : taId
            }
          );

          // Create notification for instructors/admins
          if (entry.courseID) {
            this.http.get<any>(`${this.apiUrl}/courses/${entry.courseID}`).subscribe(course => {
              if (course) {
                this.taService.getTA(typeof taId === 'string' ? parseInt(taId as string, 10) : taId).subscribe((ta: any) => {
                  const taName = ta ? ta.name : 'A TA';
                  const courseName = course.name || 'a course';
                  
                  // Only send this notification to course instructors, not to authstaff or other roles
                  this.notificationService.addNotification(
                    `${taName} has logged ${entry.hoursspent} hours for ${entry.tasktype} in ${courseName}.`,
                    'info',
                    {
                      event: 'workload_instructor_notification',
                      entityId: response.id,
                      roles: ['instructor'] // Only instructors need to see TAs' workload logs
                    }
                  );
                });
              }
            });
          }
        }
      })
    );
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
    ).pipe(
      tap(response => {
        if (response.success) {
          // Get more information about the workload entry to create a better notification
          this.http.get<any>(`${this.apiUrl}/workload/${taskId}`).subscribe(workloadEntry => {
            if (workloadEntry) {
              const taId = workloadEntry.taId;
              const status = approved ? 'approved' : 'rejected';
              
              // Notification for the TA
              this.notificationService.addNotification(
                `Your workload entry for ${workloadEntry.tasktype} on ${new Date(workloadEntry.date).toLocaleDateString()} has been ${status}.`,
                approved ? 'success' : 'warning',
                {
                  event: 'workload_status_update',
                  entityId: parseInt(taskId, 10),
                  userId: typeof taId === 'string' ? parseInt(taId as string, 10) : taId
                }
              );
              
              // Get TA info for better message
              this.taService.getTA(typeof taId === 'string' ? parseInt(taId as string, 10) : taId).subscribe((ta: any) => {
                if (ta && workloadEntry.courseId) {
                  this.http.get<any>(`${this.apiUrl}/courses/${workloadEntry.courseId}`).subscribe(course => {
                    if (course) {
                      // Instructor notification only
                      this.notificationService.addNotification(
                        `Workload entry for ${ta.name} in ${course.name} has been ${status}.`,
                        approved ? 'success' : 'warning',
                        {
                          event: 'workload_admin_notification',
                          entityId: parseInt(taskId, 10),
                          roles: ['instructor'] // Only instructors need to see workload approval status updates
                        }
                      );
                    }
                  });
                }
              });
            }
          });
        }
      })
    );
  }
  
}