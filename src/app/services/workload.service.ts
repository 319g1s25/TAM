import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface WorkloadEntry {
  id: string;
  taId: string;
  courseId: string;
  assignmentId?: string;
  taskType: 'grading' | 'officeHours' | 'labAssistance' | 'preparation' | 'meetings' | 'tutoring' | 'other';
  hours: number;
  date: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface TAWorkloadSummary {
  taId: string;
  taName: string;
  totalHours: number;
  taskBreakdown: Record<string, number>; // e.g. { 'grading': 10, 'officeHours': 5 }
  courseBreakdown: Record<string, number>; // e.g. { 'CS101': 8, 'CS201': 7 }
  completionRate: number; // Percentage of completed tasks
}

@Injectable({
  providedIn: 'root'
})
export class WorkloadService {
  private apiUrl = `${environment.apiUrl}/workload`;
  
  // Mock data for development
  private mockWorkloadEntries: WorkloadEntry[] = [
    {
      id: 'W001',
      taId: 'TA001',
      courseId: 'CS101',
      assignmentId: 'A001',
      taskType: 'grading',
      hours: 4.5,
      date: '2023-05-15',
      description: 'Graded 25 midterm exams',
      status: 'completed'
    },
    {
      id: 'W002',
      taId: 'TA002',
      courseId: 'CS101',
      assignmentId: 'A001',
      taskType: 'grading',
      hours: 3.5,
      date: '2023-05-16',
      description: 'Graded 20 midterm exams',
      status: 'completed'
    },
    {
      id: 'W003',
      taId: 'TA003',
      courseId: 'CS205',
      assignmentId: 'A002',
      taskType: 'labAssistance',
      hours: 3,
      date: '2023-05-18',
      description: 'Helped students during Data Structures lab',
      status: 'completed'
    },
    {
      id: 'W004',
      taId: 'TA001',
      courseId: 'CS301',
      assignmentId: 'A003',
      taskType: 'preparation',
      hours: 2,
      date: '2023-05-20',
      description: 'Started creating review materials for graph algorithms',
      status: 'completed'
    },
    {
      id: 'W005',
      taId: 'TA004',
      courseId: 'CS301',
      assignmentId: 'A003',
      taskType: 'preparation',
      hours: 1.5,
      date: '2023-05-21',
      description: 'Working on review materials for sorting algorithms',
      status: 'in-progress'
    },
    {
      id: 'W006',
      taId: 'TA005',
      courseId: 'CS301',
      assignmentId: 'A003',
      taskType: 'preparation',
      hours: 1,
      date: '2023-05-22',
      description: 'Planning additional practice problems',
      status: 'planned'
    },
    {
      id: 'W007',
      taId: 'TA001',
      courseId: 'CS205',
      taskType: 'officeHours',
      hours: 2,
      date: '2023-05-19',
      description: 'Held office hours for assignment 3 questions',
      status: 'completed'
    }
  ];

  constructor(private http: HttpClient) {}

  // Get all workload entries
  getWorkloadEntries(): Observable<WorkloadEntry[]> {
    // For demo purposes, return mock data with a simulated delay
    return of(this.mockWorkloadEntries).pipe(
      delay(800)
    );
    
    // Uncomment for real API implementation
    /*
    return this.http.get<WorkloadEntry[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching workload entries', error);
        return of([]);
      })
    );
    */
  }

  // Add new workload entry
  addWorkloadEntry(entry: WorkloadEntry): Observable<WorkloadEntry> {
    // For demo purposes, add to mock data
    return of({ ...entry, id: `W${Date.now().toString().slice(-6)}` }).pipe(
      delay(1000),
      map(newEntry => {
        this.mockWorkloadEntries.push(newEntry);
        return newEntry;
      })
    );
    
    // Uncomment for real API implementation
    /*
    return this.http.post<WorkloadEntry>(this.apiUrl, entry).pipe(
      catchError(error => {
        console.error('Error adding workload entry', error);
        throw error;
      })
    );
    */
  }

  // Get workload entries for a specific TA
  getWorkloadEntriesByTA(taId: string): Observable<WorkloadEntry[]> {
    // For demo purposes, filter mock data
    return of(this.mockWorkloadEntries.filter(e => e.taId === taId)).pipe(
      delay(500)
    );
    
    // Uncomment for real API implementation
    /*
    return this.http.get<WorkloadEntry[]>(`${this.apiUrl}?taId=${taId}`).pipe(
      catchError(error => {
        console.error(`Error fetching workload entries for TA ${taId}`, error);
        return of([]);
      })
    );
    */
  }

  // Get TA workload summaries for reporting
  getTAWorkloadSummaries(timePeriod: string = 'month'): Observable<TAWorkloadSummary[]> {
    // For demo purposes, calculate summaries from mock data
    return this.getWorkloadEntries().pipe(
      map(entries => this.calculateTASummaries(entries, timePeriod))
    );
    
    // Uncomment for real API implementation
    /*
    return this.http.get<TAWorkloadSummary[]>(`${this.apiUrl}/summaries?period=${timePeriod}`).pipe(
      catchError(error => {
        console.error(`Error fetching TA workload summaries`, error);
        return of([]);
      })
    );
    */
  }

  // Helper method to calculate TA summaries from workload entries
  private calculateTASummaries(entries: WorkloadEntry[], timePeriod: string): TAWorkloadSummary[] {
    // Demo calculation - in a real app this would be more sophisticated
    const taMap = new Map<string, {
      taId: string;
      taName: string;
      totalHours: number;
      taskBreakdown: Record<string, number>;
      courseBreakdown: Record<string, number>;
      completedCount: number;
      totalCount: number;
    }>();
    
    // Mock TA names mapping
    const taNames: Record<string, string> = {
      'TA001': 'John Doe',
      'TA002': 'Jane Smith',
      'TA003': 'Michael Brown',
      'TA004': 'Emily Johnson',
      'TA005': 'David Wilson'
    };
    
    // Process each workload entry
    entries.forEach(entry => {
      if (!taMap.has(entry.taId)) {
        taMap.set(entry.taId, {
          taId: entry.taId,
          taName: taNames[entry.taId] || `TA ${entry.taId}`,
          totalHours: 0,
          taskBreakdown: {},
          courseBreakdown: {},
          completedCount: 0,
          totalCount: 0
        });
      }
      
      const taSummary = taMap.get(entry.taId)!;
      
      // Update total hours
      taSummary.totalHours += entry.hours;
      
      // Update task breakdown
      if (!taSummary.taskBreakdown[entry.taskType]) {
        taSummary.taskBreakdown[entry.taskType] = 0;
      }
      taSummary.taskBreakdown[entry.taskType] += entry.hours;
      
      // Update course breakdown
      if (!taSummary.courseBreakdown[entry.courseId]) {
        taSummary.courseBreakdown[entry.courseId] = 0;
      }
      taSummary.courseBreakdown[entry.courseId] += entry.hours;
      
      // Update completion stats
      taSummary.totalCount++;
      if (entry.status === 'completed') {
        taSummary.completedCount++;
      }
    });
    
    // Convert map to array of TAWorkloadSummary
    return Array.from(taMap.values()).map(summary => ({
      taId: summary.taId,
      taName: summary.taName,
      totalHours: summary.totalHours,
      taskBreakdown: summary.taskBreakdown,
      courseBreakdown: summary.courseBreakdown,
      completionRate: summary.totalCount > 0 
        ? (summary.completedCount / summary.totalCount) * 100 
        : 0
    }));
  }
} 