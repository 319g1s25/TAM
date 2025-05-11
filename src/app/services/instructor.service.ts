import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Instructor {
  id: number;
  name: string;
  surname: string;
  department: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private apiUrl = `${environment.apiUrl}/instructors`;

  constructor(private http: HttpClient) {}

  getAllInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(this.apiUrl);
  }

  getInstructorById(id: number): Observable<Instructor> {
    return this.http.get<Instructor>(`${this.apiUrl}/${id}`);
  }

  createInstructor(instructor: Omit<Instructor, 'id'>): Observable<Instructor> {
    return this.http.post<Instructor>(this.apiUrl, instructor);
  }

  updateInstructor(id: number, instructor: Partial<Instructor>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, instructor);
  }

  deleteInstructor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 