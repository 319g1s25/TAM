import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DepartmentChair {
  id: number;
  name: string;
  surname: string;
  department: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentChairService {
  private apiUrl = `${environment.apiUrl}/departmentchairs`;

  constructor(private http: HttpClient) {}

  getAllDepartmentChairs(): Observable<DepartmentChair[]> {
    return this.http.get<DepartmentChair[]>(this.apiUrl);
  }

  getDepartmentChair(id: number): Observable<DepartmentChair> {
    return this.http.get<DepartmentChair>(`${this.apiUrl}/${id}`);
  }

  createDepartmentChair(chair: Omit<DepartmentChair, 'id'>): Observable<DepartmentChair> {
    return this.http.post<DepartmentChair>(this.apiUrl, chair);
  }

  updateDepartmentChair(id: number, chair: Partial<DepartmentChair>): Observable<DepartmentChair> {
    return this.http.put<DepartmentChair>(`${this.apiUrl}/${id}`, chair);
  }

  deleteDepartmentChair(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 