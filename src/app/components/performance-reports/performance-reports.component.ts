import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { WorkloadService, TAWorkloadSummary } from '../../services/workload.service';

@Component({
  selector: 'app-performance-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, DecimalPipe],
  templateUrl: './performance-reports.component.html',
  styleUrls: ['./performance-reports.component.css']
})
export class PerformanceReportsComponent implements OnInit {
  taSummaries: TAWorkloadSummary[] = [];
  selectedPeriod: string = 'month';
  isLoading: boolean = false;
  
  // Task type mapping for display purposes
  taskTypeMap: { [key: string]: string } = {
    'grading': 'Grading',
    'officeHours': 'Office Hours',
    'labAssistance': 'Lab Assistance',
    'preparation': 'Preparation',
    'meetings': 'Meetings',
    'tutoring': 'Tutoring',
    'other': 'Other Tasks'
  };

  timePeriods = [
    { value: 'week', label: 'Weekly' },
    { value: 'month', label: 'Monthly' },
    { value: 'quarter', label: 'Quarterly' },
    { value: 'year', label: 'Yearly' }
  ];

  constructor(private workloadService: WorkloadService) { }

  ngOnInit(): void {
    this.loadWorkloadData();
  }

  loadWorkloadData(): void {
    this.isLoading = true;
    this.workloadService.getTAWorkloadSummaries(this.selectedPeriod).subscribe({
      next: (data) => {
        this.taSummaries = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading workload data:', err);
        this.isLoading = false;
      }
    });
  }

  changePeriod(period: string): void {
    this.selectedPeriod = period;
    this.loadWorkloadData();
  }
  
  // Helper methods for calculations
  getTotalHoursAll(): number {
    if (!this.taSummaries.length) return 0;
    return this.taSummaries.reduce((total, summary) => total + summary.totalHours, 0);
  }
  
  getAverageHoursPerTA(): number {
    if (!this.taSummaries.length) return 0;
    const totalHours = this.getTotalHoursAll();
    return totalHours / this.taSummaries.length;
  }
  
  getTaskBreakdownForTA(taId: string): { task: string, hours: number }[] {
    const ta = this.taSummaries.find(s => s.taId === taId);
    if (!ta) return [];
    
    return Object.entries(ta.taskBreakdown).map(([taskType, hours]) => ({
      task: this.taskTypeMap[taskType] || taskType,
      hours
    })).sort((a, b) => b.hours - a.hours);
  }
  
  getCourseBreakdownForTA(taId: string): { course: string, hours: number }[] {
    const ta = this.taSummaries.find(s => s.taId === taId);
    if (!ta) return [];
    
    return Object.entries(ta.courseBreakdown).map(([course, hours]) => ({
      course,
      hours
    })).sort((a, b) => b.hours - a.hours);
  }
  
  getNumberOfCoursesForTA(taId: string): number {
    const ta = this.taSummaries.find(s => s.taId === taId);
    if (!ta) return 0;
    
    return Object.keys(ta.courseBreakdown).length;
  }
  
  getUniqueCourseCount(): number {
    const uniqueCourses = new Set<string>();
    
    this.taSummaries.forEach(ta => {
      Object.keys(ta.courseBreakdown).forEach(course => {
        uniqueCourses.add(course);
      });
    });
    
    return uniqueCourses.size;
  }
  
  getMostCommonTaskForTA(taId: string): string {
    const tasks = this.getTaskBreakdownForTA(taId);
    return tasks.length > 0 ? tasks[0].task : 'None';
  }
  
  getHoursPercentage(hours: number): number {
    const totalHours = this.getTotalHoursAll();
    if (totalHours === 0) return 0;
    return (hours / totalHours) * 100;
  }
} 