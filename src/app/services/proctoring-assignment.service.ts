import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TA } from '../shared/models/ta.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProctoringAssignmentService {
  private apiUrl = 'http://localhost:3000/api/proctoring-assignments';

  constructor(private http: HttpClient) {}

  assignProctors(examId: number, taIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${examId}/assign`, { taIds });
  }

  getAssignedTAs(examId: number): Observable<TA[]> {
    return this.http.get<TA[]>(`${this.apiUrl}/${examId}/tas`);
  }

  autoAssignProctors(examId: number): Observable<{ assignedTAIds: number[] }> {
    return this.http.post<{ assignedTAIds: number[] }>(`${this.apiUrl}/${examId}/auto`, {});
  }
  
  getAssignedProctorCount(examId: number): Observable<number> {
    return this.http.get<{ assignedCount: number }>(`${this.apiUrl}/count/${examId}`)
      .pipe(map(res => res.assignedCount));
  }
  
}
