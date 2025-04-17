import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface WorkloadEntry {
  id: string;
  taId: string;
  taName: string;
  courseId: string;
  taskType: string;
  date: string;
  hoursSpent: number;
  description?: string;
  timestamp: string;
}

export interface TAWorkloadSummary {
  taId: string;
  taName: string;
  totalHours: number;
  taskBreakdown: { [key: string]: number };
  courseBreakdown: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class WorkloadService {
  private workloadEntries: WorkloadEntry[] = [];

  constructor() {
    // Initialize with mock data
    this.generateMockData();
  }

  private generateMockData(): void {
    const today = new Date();
    const mockTAs = [
      { id: 'TA001', name: 'John Doe' },
      { id: 'TA002', name: 'Jane Smith' },
      { id: 'TA003', name: 'Michael Brown' },
      { id: 'TA004', name: 'Emily Johnson' },
      { id: 'TA005', name: 'David Wilson' }
    ];

    const mockCourses = ['CS101', 'CS205', 'CS301', 'CS401', 'CS201'];
    const mockTaskTypes = ['grading', 'officeHours', 'labAssistance', 'preparation', 'meetings', 'tutoring', 'other'];

    // Generate 50 random workload entries
    for (let i = 0; i < 50; i++) {
      const randomTA = mockTAs[Math.floor(Math.random() * mockTAs.length)];
      const randomCourse = mockCourses[Math.floor(Math.random() * mockCourses.length)];
      const randomTaskType = mockTaskTypes[Math.floor(Math.random() * mockTaskTypes.length)];
      
      // Random date in the last 30 days
      const randomDate = new Date(today);
      randomDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
      
      const entry: WorkloadEntry = {
        id: `WL${i.toString().padStart(4, '0')}`,
        taId: randomTA.id,
        taName: randomTA.name,
        courseId: randomCourse,
        taskType: randomTaskType,
        date: this.formatDate(randomDate),
        hoursSpent: Math.floor(Math.random() * 8) + 1,
        description: `${randomTaskType} for ${randomCourse}`,
        timestamp: new Date(randomDate).toISOString()
      };
      
      this.workloadEntries.push(entry);
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getWorkloadEntries(): Observable<WorkloadEntry[]> {
    return of(this.workloadEntries).pipe(
      delay(500) // Simulate network delay
    );
  }

  getWorkloadEntriesByTA(taId: string): Observable<WorkloadEntry[]> {
    const entries = this.workloadEntries.filter(entry => entry.taId === taId);
    return of(entries).pipe(
      delay(500)
    );
  }

  getWorkloadEntriesByCourse(courseId: string): Observable<WorkloadEntry[]> {
    const entries = this.workloadEntries.filter(entry => entry.courseId === courseId);
    return of(entries).pipe(
      delay(500)
    );
  }

  getWorkloadEntriesByPeriod(period: string): Observable<WorkloadEntry[]> {
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1); // Default to month
    }
    
    const entries = this.workloadEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= now;
    });
    
    return of(entries).pipe(
      delay(500)
    );
  }

  getTAWorkloadSummaries(period: string = 'month'): Observable<TAWorkloadSummary[]> {
    return this.getWorkloadEntriesByPeriod(period).pipe(
      map(entries => {
        const taMap = new Map<string, TAWorkloadSummary>();
        
        // Process each entry to build TA summaries
        entries.forEach(entry => {
          if (!taMap.has(entry.taId)) {
            taMap.set(entry.taId, {
              taId: entry.taId,
              taName: entry.taName,
              totalHours: 0,
              taskBreakdown: {},
              courseBreakdown: {}
            });
          }
          
          const taSummary = taMap.get(entry.taId)!;
          
          // Add hours to total
          taSummary.totalHours += entry.hoursSpent;
          
          // Update task breakdown
          if (!taSummary.taskBreakdown[entry.taskType]) {
            taSummary.taskBreakdown[entry.taskType] = 0;
          }
          taSummary.taskBreakdown[entry.taskType] += entry.hoursSpent;
          
          // Update course breakdown
          if (!taSummary.courseBreakdown[entry.courseId]) {
            taSummary.courseBreakdown[entry.courseId] = 0;
          }
          taSummary.courseBreakdown[entry.courseId] += entry.hoursSpent;
        });
        
        // Convert map to array and sort by total hours (descending)
        return Array.from(taMap.values())
          .sort((a, b) => b.totalHours - a.totalHours);
      }),
      delay(500) // Add additional delay for processing
    );
  }

  addWorkloadEntry(entry: WorkloadEntry): Observable<WorkloadEntry> {
    // In a real app, this would be an HTTP POST request
    this.workloadEntries.push(entry);
    return of(entry).pipe(
      delay(800) // Simulate network delay
    );
  }

  updateWorkloadEntry(entry: WorkloadEntry): Observable<WorkloadEntry> {
    // In a real app, this would be an HTTP PUT request
    const index = this.workloadEntries.findIndex(e => e.id === entry.id);
    if (index !== -1) {
      this.workloadEntries[index] = entry;
      return of(entry).pipe(delay(800));
    }
    return new Observable(observer => observer.error(new Error('Entry not found')));
  }

  deleteWorkloadEntry(id: string): Observable<boolean> {
    // In a real app, this would be an HTTP DELETE request
    const index = this.workloadEntries.findIndex(e => e.id === id);
    if (index !== -1) {
      this.workloadEntries.splice(index, 1);
      return of(true).pipe(delay(800));
    }
    return of(false).pipe(delay(800));
  }
} 