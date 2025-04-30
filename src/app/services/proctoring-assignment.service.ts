import { Injectable } from '@angular/core';
import { TA } from '../shared/models/ta.model';
import { ProctoringAssignment } from '../shared/models/proctoringassignment.model';

interface Exam {
  id: number;
  courseId: number;
  courseCode: string;
  courseName: string;
  date: string;
  startTime: string;
  endTime: string;
  requiredProctors: number;
  assignedProctors: number;
  department: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProctoringAssignmentService {
  constructor() {}

  /**
   * Automatically assigns TAs to proctoring duties using an optimal algorithm
   * The algorithm considers:
   * 1. TA's department match with exam
   * 2. TA's current workload
   * 3. TA's proctoring preference
   * 4. Exam's proctoring requirements
   * 5. Time conflicts
   * 
   * @param exams List of exams that need proctors
   * @param tas List of available TAs
   * @returns Map of exam IDs to assigned TA IDs
   */
  assignProctorsAutomatically(exams: Exam[], tas: TA[]): Map<number, number[]> {
    // Sort exams by priority (earlier dates first, then by required proctors)
    const sortedExams = [...exams].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateA.getTime() - dateB.getTime() || 
             (b.requiredProctors - b.assignedProctors) - (a.requiredProctors - a.assignedProctors);
    });

    // Sort TAs by availability (lower workload first)
    const sortedTAs = [...tas].sort((a, b) => a.totalWorkload - b.totalWorkload);

    const assignments = new Map<number, number[]>();

    // Initialize assignments map
    exams.forEach(exam => {
      assignments.set(exam.id, []);
    });

    // Track TA schedules to avoid time conflicts
    const taSchedules = new Map<number, Array<{start: Date, end: Date}>>();

    // Assign proctors to each exam
    sortedExams.forEach(exam => {
      const requiredProctors = exam.requiredProctors - exam.assignedProctors;
      if (requiredProctors <= 0) return;

      const examStart = new Date(`${exam.date}T${exam.startTime}`);
      const examEnd = new Date(`${exam.date}T${exam.endTime}`);

      const currentAssignments = assignments.get(exam.id) || [];
      const availableTAs = sortedTAs.filter(ta => {
        // Check if TA is already assigned to this exam
        if (currentAssignments.includes(ta.id)) return false;
        
        // Check if TA is on leave
        if (ta.isOnLeave) return false;
        
        // Check if TA has reached maximum workload (40 hours)
        if (ta.totalWorkload >= 40) return false;
        
        // Check if TA's department matches the exam
        if (ta.department !== exam.department) return false;
        
        // Check if TA has proctoring enabled
        if (!ta.proctoringEnabled) return false;
        
        // Check for time conflicts
        const taSchedule = taSchedules.get(ta.id) || [];
        const hasConflict = taSchedule.some(slot => {
          return (examStart >= slot.start && examStart < slot.end) ||
                 (examEnd > slot.start && examEnd <= slot.end) ||
                 (examStart <= slot.start && examEnd >= slot.end);
        });
        
        return !hasConflict;
      });

      // Sort available TAs by suitability
      const suitableTAs = availableTAs.sort((a, b) => {
        // Prioritize PhD students
        if (a.msOrPhdStatus === 'PhD' && b.msOrPhdStatus !== 'PhD') return -1;
        if (b.msOrPhdStatus === 'PhD' && a.msOrPhdStatus !== 'PhD') return 1;
        
        // Then by workload (lower workload first)
        return a.totalWorkload - b.totalWorkload;
      });

      // Assign proctors to the exam (do as many as possible)
      for (let i = 0; i < requiredProctors && i < suitableTAs.length; i++) {
        const ta = suitableTAs[i];
        currentAssignments.push(ta.id);
        
        // Update TA's schedule
        if (!taSchedules.has(ta.id)) {
          taSchedules.set(ta.id, []);
        }
        taSchedules.get(ta.id)!.push({ start: examStart, end: examEnd });
        
        // Update TA's workload (assuming 4 hours per proctoring session)
        ta.totalWorkload += 4;
      }

      assignments.set(exam.id, currentAssignments);
    });

    return assignments;
  }

  /**
   * Generates a summary of the proctoring assignments
   * @param assignments Map of exam IDs to assigned TA IDs
   * @param exams List of all exams
   * @param tas List of all TAs
   * @returns Summary object containing assignment details
   */
  generateAssignmentSummary(assignments: Map<number, number[]>, exams: Exam[], tas: TA[]): {
    examAssignments: Array<{
      examId: number;
      courseName: string;
      courseCode: string;
      date: string;
      time: string;
      requiredProctors: number;
      assignedProctors: number;
      assignedTANames: string[];
    }>;
    unassignedExams: Array<{
      examId: number;
      courseName: string;
      courseCode: string;
      date: string;
      time: string;
      requiredProctors: number;
    }>;
    taWorkloads: Array<{
      taId: number;
      taName: string;
      totalWorkload: number;
      assignedExams: number;
    }>;
  } {
    const examAssignments: Array<{
      examId: number;
      courseName: string;
      courseCode: string;
      date: string;
      time: string;
      requiredProctors: number;
      assignedProctors: number;
      assignedTANames: string[];
    }> = [];

    const unassignedExams: Array<{
      examId: number;
      courseName: string;
      courseCode: string;
      date: string;
      time: string;
      requiredProctors: number;
    }> = [];

    const taWorkloads = new Map<number, {
      taId: number;
      taName: string;
      totalWorkload: number;
      assignedExams: number;
    }>();

    // Initialize TA workloads
    tas.forEach(ta => {
      taWorkloads.set(ta.id, {
        taId: ta.id,
        taName: `${ta.name} ${ta.surname}`,
        totalWorkload: ta.totalWorkload,
        assignedExams: 0
      });
    });

    // Process assignments
    assignments.forEach((taIds, examId) => {
      const exam = exams.find(e => e.id === examId);
      if (!exam) return;

      const requiredProctors = exam.requiredProctors - exam.assignedProctors;
      const assignedTANames = taIds.map(taId => {
        const ta = tas.find(t => t.id === taId);
        if (ta) {
          const workload = taWorkloads.get(taId)!;
          workload.assignedExams++;
          workload.totalWorkload += 4; // 4 hours per proctoring session
          return `${ta.name} ${ta.surname}`;
        }
        return '';
      }).filter(name => name !== '');

      if (assignedTANames.length > 0) {
        examAssignments.push({
          examId: exam.id,
          courseName: exam.courseName,
          courseCode: exam.courseCode,
          date: exam.date,
          time: `${exam.startTime} - ${exam.endTime}`,
          requiredProctors,
          assignedProctors: assignedTANames.length,
          assignedTANames
        });
      } else if (requiredProctors > 0) {
        unassignedExams.push({
          examId: exam.id,
          courseName: exam.courseName,
          courseCode: exam.courseCode,
          date: exam.date,
          time: `${exam.startTime} - ${exam.endTime}`,
          requiredProctors
        });
      }
    });

    return {
      examAssignments,
      unassignedExams,
      taWorkloads: Array.from(taWorkloads.values())
    };
  }
} 