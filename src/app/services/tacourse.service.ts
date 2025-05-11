import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TACourseAssignment {
  taID: number;
  courseID: number;
}

@Injectable({ providedIn: 'root' })
export class TACourseService {
  private apiUrl = `${environment.apiUrl}/tacourse`;

  constructor(private http: HttpClient) {}

  getAllTACourses(): Observable<TACourseAssignment[]> {
    return this.http.get<TACourseAssignment[]>(this.apiUrl);
  }
} 