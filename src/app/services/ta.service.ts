import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TA } from '../shared/models/ta.model';

@Injectable({
  providedIn: 'root'
})
export class TAService {
  private apiUrl = 'http://localhost:3000/api/ta'; // Backend API endpoint

  constructor(private http: HttpClient) {}

  // Get all TAs
  getAllTAs(): Observable<TA[]> {
    return this.http.get<TA[]>(`${this.apiUrl}`);
  }
  
  // Get a TA by ID
  getTA(id: number): Observable<TA> {
    return this.http.get<TA>(`${this.apiUrl}/${id}`);
  }

  // Add a new TA
  addTA(ta: TA): Observable<TA> {
    return this.http.post<TA>(this.apiUrl, ta);
  }

  // Update a TA
  updateTA(ta: TA): Observable<TA> {
    console.log('Sending TA to backend:', ta);
    return this.http.put<TA>(`${this.apiUrl}/${ta.id}`, ta);
  }

  // Delete a TA
  deleteTA(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
