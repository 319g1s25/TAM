import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classroom } from '../shared/models/classroom.model';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private apiUrl = 'http://localhost:3000/api/classrooms';

  constructor(private http: HttpClient) {}

  getAllClassrooms(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(this.apiUrl);
  }

  getClassroomById(id: number): Observable<Classroom> {
    return this.http.get<Classroom>(`${this.apiUrl}/${id}`);
  }

  createClassroom(classroomData: Partial<Classroom>): Observable<Classroom> {
    return this.http.post<Classroom>(this.apiUrl, classroomData);
  }

  updateClassroom(id: number, classroomData: Partial<Classroom>): Observable<Classroom> {
    return this.http.put<Classroom>(`${this.apiUrl}/${id}`, classroomData);
  }

  deleteClassroom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 