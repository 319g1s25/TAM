import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface PerformanceReport {
  id: number;
  taName: string;
  courseId: string;
  avgRating: number;
  hoursWorked: number;
  studentsHelped: number;
  period: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceReportService {
  private mockReports: PerformanceReport[] = [
    { id: 1, taName: 'John Doe', courseId: 'CS101', avgRating: 4.7, hoursWorked: 45, studentsHelped: 87, period: 'month' },
    { id: 2, taName: 'Jane Smith', courseId: 'CS205', avgRating: 4.5, hoursWorked: 38, studentsHelped: 63, period: 'month' },
    { id: 3, taName: 'Michael Brown', courseId: 'CS301', avgRating: 4.2, hoursWorked: 42, studentsHelped: 71, period: 'month' },
    { id: 4, taName: 'Emily Johnson', courseId: 'CS401', avgRating: 4.8, hoursWorked: 48, studentsHelped: 92, period: 'month' },
    { id: 5, taName: 'David Wilson', courseId: 'CS201', avgRating: 4.3, hoursWorked: 36, studentsHelped: 58, period: 'month' },
    { id: 6, taName: 'Sarah Martinez', courseId: 'CS110', avgRating: 4.6, hoursWorked: 40, studentsHelped: 75, period: 'month' },
    { id: 7, taName: 'Thomas Anderson', courseId: 'CS220', avgRating: 4.1, hoursWorked: 32, studentsHelped: 49, period: 'month' },
    { id: 8, taName: 'Jennifer Lee', courseId: 'CS350', avgRating: 4.9, hoursWorked: 50, studentsHelped: 98, period: 'month' }
  ];

  constructor() { }

  getReports(period: string): Observable<PerformanceReport[]> {
    // Simulate API call with delay
    return of(this.mockReports.map(report => ({...report, period}))).pipe(
      delay(800) // Simulate network delay
    );
  }

  getReportById(id: number): Observable<PerformanceReport | undefined> {
    const report = this.mockReports.find(r => r.id === id);
    return of(report).pipe(
      delay(300) // Simulate network delay
    );
  }

  // In a real implementation, these methods would make HTTP calls to a backend API
  getWeeklyReportData(): Observable<any> {
    return of({
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      averageRatings: [4.2, 4.3, 4.5, 4.6],
      totalHours: [280, 310, 295, 320],
      studentsHelped: [430, 470, 450, 495]
    }).pipe(delay(500));
  }

  getMonthlyReportData(): Observable<any> {
    return of({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      averageRatings: [4.1, 4.2, 4.3, 4.5, 4.4, 4.6],
      totalHours: [1200, 1150, 1300, 1250, 1180, 1220],
      studentsHelped: [1800, 1750, 1900, 1850, 1780, 1820]
    }).pipe(delay(500));
  }

  getQuarterlyReportData(): Observable<any> {
    return of({
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      averageRatings: [4.2, 4.4, 4.3, 4.5],
      totalHours: [3600, 3700, 3500, 3800],
      studentsHelped: [5500, 5700, 5400, 5900]
    }).pipe(delay(500));
  }

  getYearlyReportData(): Observable<any> {
    return of({
      labels: ['2020', '2021', '2022', '2023'],
      averageRatings: [4.0, 4.1, 4.3, 4.5],
      totalHours: [14500, 15200, 15800, 16300],
      studentsHelped: [22000, 23500, 24200, 25800]
    }).pipe(delay(500));
  }
} 