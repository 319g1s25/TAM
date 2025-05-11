import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TAService } from '../../services/ta.service';
import { WorkloadService } from '../../services/workload.service';
import { TA } from '../../shared/models/ta.model';
import { WorkloadEntry } from '../../shared/models/task.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TACourseService, TACourseAssignment } from '../../services/tacourse.service';

interface TAWorkloadSummary {
  taId: number;
  taName: string;
  totalHours: number;
  taskBreakdown: { [key: string]: number };
  courseBreakdown: { [key: string]: number };
}

@Component({
  selector: 'app-performance-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, DecimalPipe, FormsModule],
  templateUrl: './performance-reports.component.html',
  styleUrls: ['./performance-reports.component.css']
})
export class PerformanceReportsComponent implements OnInit {
  tas: TA[] = [];
  workloadEntries: WorkloadEntry[] = [];
  taSummaries: TAWorkloadSummary[] = [];
  tacourses: TACourseAssignment[] = [];
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

  constructor(
    private taService: TAService,
    private workloadService: WorkloadService,
    private tacourseService: TACourseService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.taService.getAllTAs().subscribe({
      next: (tas: TA[]) => {
        this.tas = tas.filter(ta => typeof ta.id === 'number');
        this.processTASummaries();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading TAs:', err);
        this.isLoading = false;
      }
    });
  }

  processTASummaries(): void {
    this.taSummaries = this.tas.map(ta => ({
      taId: ta.id as number,
      taName: `${ta.name || ''} ${ta.surname || ''}`.trim(),
      totalHours: ta.totalWorkload || 0,
      taskBreakdown: {},
      courseBreakdown: {}
    }));
  }

  loadWorkloadData(): void {
    this.workloadService.getWorkloadEntries().subscribe({
      next: (entries) => {
        console.log('Raw workload entries response:', entries);
        this.workloadEntries = entries;
        console.log('Processed workload entries:', this.workloadEntries);
        this.processWorkloadData();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading workload data:', err);
        this.workloadEntries = [];
        this.isLoading = false;
      }
    });
  }

  processWorkloadData(): void {
    if (!Array.isArray(this.workloadEntries)) {
      console.error('Workload entries is not an array');
      this.workloadEntries = [];
      return;
    }

    const periodStart = this.getPeriodStartDate();
    const now = new Date();
    now.setHours(23, 59, 59, 999); // End of current day
    console.log('Period start date:', periodStart);
    console.log('Period end date:', now);
    
    // Filter entries for the selected period
    const periodEntries = this.workloadEntries.filter(entry => {
      if (!entry || !entry.date) {
        console.log('Invalid entry:', entry);
        return false;
      }
      const entryDate = new Date(entry.date);
      entryDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
      const isInPeriod = entryDate >= periodStart && entryDate <= now;
      console.log('Entry date:', entryDate, 'Is in period:', isInPeriod);
      return isInPeriod;
    });

    console.log('Period entries:', periodEntries);

    // Create summaries for each TA
    this.taSummaries = this.tas.map(ta => {
      if (!ta || !ta.id) {
        console.log('Invalid TA:', ta);
        return null;
      }
      
      console.log('Processing TA:', ta.id, ta.name);
      const taEntries = periodEntries.filter(entry => {
        const matches = entry.ta_id === ta.id;
        console.log('Entry ta_id:', entry.ta_id, 'TA id:', ta.id, 'Matches:', matches);
        return matches;
      });
      
      console.log(`Entries for TA ${ta.id}:`, taEntries);
      
      const taskBreakdown: { [key: string]: number } = {};
      const courseBreakdown: { [key: string]: number } = {};
      let totalHours = 0;

      taEntries.forEach(entry => {
        if (!entry || !entry.description || !entry.course_id) {
          console.log('Invalid entry in processing:', entry);
          return;
        }
        
        // Update task breakdown
        const taskType = entry.description.toLowerCase().includes('grading') ? 'grading' :
                        entry.description.toLowerCase().includes('office') ? 'officeHours' :
                        entry.description.toLowerCase().includes('lab') ? 'labAssistance' :
                        entry.description.toLowerCase().includes('prep') ? 'preparation' :
                        entry.description.toLowerCase().includes('meeting') ? 'meetings' :
                        entry.description.toLowerCase().includes('tutor') ? 'tutoring' : 'other';
        
        taskBreakdown[taskType] = (taskBreakdown[taskType] || 0) + (entry.hours || 0);
        
        // Update course breakdown
        courseBreakdown[entry.course_id.toString()] = (courseBreakdown[entry.course_id.toString()] || 0) + (entry.hours || 0);
        
        totalHours += entry.hours || 0;
      });

      const summary = {
        taId: ta.id,
        taName: `${ta.name || ''} ${ta.surname || ''}`.trim(),
        totalHours,
        taskBreakdown,
        courseBreakdown
      };
      console.log('Created summary for TA:', summary);
      return summary;
    }).filter((summary): summary is TAWorkloadSummary => summary !== null);

    console.log('Final TA summaries:', this.taSummaries);

    // Sort by total hours
    this.taSummaries.sort((a, b) => b.totalHours - a.totalHours);
  }

  getPeriodStartDate(): Date {
    const now = new Date();
    const result = new Date();
    
    switch (this.selectedPeriod) {
      case 'week':
        result.setDate(now.getDate() - 7);
        break;
      case 'month':
        result.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        result.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        result.setFullYear(now.getFullYear() - 1);
        break;
      default:
        result.setMonth(now.getMonth() - 1);
    }
    
    // Set time to start of day
    result.setHours(0, 0, 0, 0);
    console.log('Calculated period start date:', result);
    return result;
  }

  onPeriodChange(): void {
    this.processWorkloadData();
  }

  // Calculation methods for the template
  calculateTotalHours(): number {
    return this.taSummaries.reduce((total, summary) => total + summary.totalHours, 0);
  }

  calculateAverageHoursPerTA(): number {
    if (!this.taSummaries.length) return 0;
    return this.calculateTotalHours() / this.taSummaries.length;
  }

  calculateTAHours(taId: number | undefined): number {
    if (!taId) return 0;
    const summary = this.taSummaries.find(s => s.taId === taId);
    return summary ? summary.totalHours : 0;
  }

  calculateTATaskBreakdown(taId: number | undefined): { type: string; hours: number; percentage: number }[] {
    if (!taId) return [];
    const summary = this.taSummaries.find(s => s.taId === taId);
    if (!summary) return [];

    const totalHours = summary.totalHours;
    return Object.entries(summary.taskBreakdown).map(([type, hours]) => ({
      type: this.taskTypeMap[type] || type,
      hours,
      percentage: totalHours > 0 ? (hours / totalHours) * 100 : 0
    })).sort((a, b) => b.hours - a.hours);
  }

  calculateTACourseBreakdown(taId: number | undefined): { name: string; hours: number; percentage: number }[] {
    if (!taId) return [];
    const summary = this.taSummaries.find(s => s.taId === taId);
    if (!summary) return [];

    const totalHours = summary.totalHours;
    return Object.entries(summary.courseBreakdown).map(([courseId, hours]) => ({
      name: courseId, // You might want to fetch course names from a service
      hours,
      percentage: totalHours > 0 ? (hours / totalHours) * 100 : 0
    })).sort((a, b) => b.hours - a.hours);
  }

  downloadPDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20; // Starting Y position
    
    // Add title
    doc.setFontSize(20);
    doc.text('TA Performance Report', pageWidth / 2, currentY, { align: 'center' });
    currentY += 15;
    
    // Add period
    doc.setFontSize(12);
    const periodLabel = this.timePeriods.find(p => p.value === this.selectedPeriod)?.label || this.selectedPeriod;
    doc.text(`Period: ${periodLabel}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 15;
    
    // Add summary metrics
    doc.setFontSize(14);
    doc.text('Summary Metrics', 14, currentY);
    currentY += 10;
    
    const metrics = [
      ['Total Hours', this.calculateTotalHours().toFixed(1)],
      ['Average Hours per TA', this.calculateAverageHoursPerTA().toFixed(1)],
      ['Active TAs', this.taSummaries.length.toString()]
    ];
    
    autoTable(doc, {
      startY: currentY,
      head: [['Metric', 'Value']],
      body: metrics,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    // Get the final Y position after the first table
    const firstTableEndY = (doc as any).lastAutoTable.finalY;
    currentY = firstTableEndY + 15;
    
    // Add detailed TA data
    doc.setFontSize(14);
    doc.text('TA Workload Details', 14, currentY);
    currentY += 10;
    
    const taData = this.taSummaries.map(ta => [
      ta.taName,
      ta.totalHours.toFixed(1),
      Object.keys(ta.courseBreakdown).join(', '),
      this.getMostCommonTaskForTA(ta.taId)
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['TA Name', 'Hours Worked', 'Courses', 'Main Activity']],
      body: taData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    // Save the PDF
    doc.save(`ta-performance-report-${this.selectedPeriod}.pdf`);
  }

  // Helper methods
  getMostCommonTaskForTA(taId: number): string {
    const tasks = this.calculateTATaskBreakdown(taId);
    return tasks.length > 0 ? tasks[0].type : 'None';
  }
} 