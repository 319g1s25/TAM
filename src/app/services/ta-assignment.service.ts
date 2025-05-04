import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TAAssignmentService {
  private apiUrl = '/api/ta-assignments';

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
    // Optionally extend to return detailed breakdown per course
  }> { return this.http.post<{ message: string; totalCoursesAssigned: number; }>(`${this.apiUrl}/auto`, {});
  }
}
