import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DeansOffice {
  id: number;
  name: string;
  surname: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeansOfficeService {
  private apiUrl = `${environment.apiUrl}/deansoffice`;

  constructor(private http: HttpClient) {}

  getAllDeansOffice(): Observable<DeansOffice[]> {
    return this.http.get<DeansOffice[]>(this.apiUrl);
  }

  getDeansOfficeById(id: number): Observable<DeansOffice> {
    return this.http.get<DeansOffice>(`${this.apiUrl}/${id}`);
  }

  createDeansOffice(deansOffice: Omit<DeansOffice, 'id'>): Observable<DeansOffice> {
    return this.http.post<DeansOffice>(this.apiUrl, deansOffice);
  }

  updateDeansOffice(id: number, deansOffice: Partial<DeansOffice>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, deansOffice);
  }

  deleteDeansOffice(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 