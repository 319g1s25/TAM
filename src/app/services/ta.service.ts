import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TA } from '../shared/models/ta.model';

@Injectable({
  providedIn: 'root'
})
export class TAService {
  private apiUrl = 'http://localhost:3000/api/tas'; // Replace with your actual API URL
  
  // Mock data for development
  private mockTAs: TA[] = [
    {
      id: 1,
      name: 'Ali',
      surname: 'Smith',
      email: 'ali.smith@university.edu',
      password: 'password',
      isOnLeave: false,
      totalWorkload: 20,
      msOrPhdStatus: 'MS',
      proctoringEnabled: true,
      department: 'Computer Science'
    },
    {
      id: 2,
      name: 'Jane',
      surname: 'Doe',
      email: 'jane.doe@university.edu',
      password: 'password',
      isOnLeave: false,
      totalWorkload: 15,
      msOrPhdStatus: 'PhD',
      proctoringEnabled: true,
      department: 'Mathematics'
    },
    {
      id: 3,
      name: 'John',
      surname: 'Johnson',
      email: 'john.johnson@university.edu',
      password: 'password',
      isOnLeave: true,
      totalWorkload: 0,
      msOrPhdStatus: 'MS',
      proctoringEnabled: false,
      department: 'Physics'
    }
  ];

  constructor(private http: HttpClient) {}

  // Get all TAs
  getAllTAs(): Observable<TA[]> {
    // Use this for real API
    // return this.http.get<TA[]>(this.apiUrl);
    
    // Use this for development without a backend
    return of(this.mockTAs);
  }

  // Get a TA by ID
  getTA(id: number): Observable<TA> {
    // Use this for real API
    // return this.http.get<TA>(`${this.apiUrl}/${id}`);
    
    // Use this for development without a backend
    const ta = this.mockTAs.find(ta => ta.id === id);
    return of(ta as TA);
  }

  // Add a new TA
  addTA(ta: TA): Observable<TA> {
    // Use this for real API
    // return this.http.post<TA>(this.apiUrl, ta);
    
    // Use this for development without a backend
    const newTA = { ...ta, id: this.getNextId() };
    this.mockTAs.push(newTA);
    return of(newTA);
  }

  // Update a TA
  updateTA(ta: TA): Observable<TA> {
    // Use this for real API
    // return this.http.put<TA>(`${this.apiUrl}/${ta.id}`, ta);
    
    // Use this for development without a backend
    const index = this.mockTAs.findIndex(t => t.id === ta.id);
    if (index !== -1) {
      this.mockTAs[index] = ta;
    }
    return of(ta);
  }

  // Delete a TA
  deleteTA(id: number): Observable<void> {
    // Use this for real API
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    
    // Use this for development without a backend
    const index = this.mockTAs.findIndex(ta => ta.id === id);
    if (index !== -1) {
      this.mockTAs.splice(index, 1);
    }
    return of(void 0);
  }

  // Helper method to get the next ID for a new TA
  private getNextId(): number {
    const maxId = this.mockTAs.reduce((max, ta) => (ta.id > max ? ta.id : max), 0);
    return maxId + 1;
  }
} 