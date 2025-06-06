import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  taCount: number;
  taChange: number;
  courseCount: number;
  activeCourseCount: number;
  assignmentCount: number;
  pendingAssignmentCount: number;
  avgWorkload: number;
  reportCount: number;
  leaveRequestCount: number;
  pendingWorkloadCount: number;
  examCount: number;
}

export interface TaAssignment {
  id: string;
  courseId: string;
  courseCode: string;
  name: string;
  courseName: string;
  instructor: string;
  status: string;
  department: string;
  section?: string;
}

/*export interface UrgentTask {
  title: string;
  description: string;
  deadline: Date;
  priority: 'high' | 'medium' | 'low';
  category: string;
  actionLink: string;
  actionText: string;
}*/

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<{ success: boolean; stats: DashboardStats }> {
    return this.http.get<{ success: boolean; stats: DashboardStats }>(this.apiUrl);
  }

  getTaAssignments(): Observable<TaAssignment[]> {
    return this.http.get<TaAssignment[]>(`${this.apiUrl}/ta-assignments`);
  }

  /*getUrgentTasks(): Observable<UrgentTask[]> {
    return this.http.get<UrgentTask[]>(`${this.apiUrl}/urgent-tasks`);
  }*/
}
