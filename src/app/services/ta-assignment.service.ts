import { Injectable } from '@angular/core';
import { Course } from '../shared/models/course.model';
import { TA } from '../shared/models/ta.model';
import { TaCourse } from '../shared/models/tacourse.model';

@Injectable({
  providedIn: 'root'
})
export class TAAssignmentService {
  constructor() {}

  /**
   * Automatically assigns TAs to courses using an optimal algorithm
   * The algorithm considers:
   * 1. TA's department match with course
   * 2. TA's current workload
   * 3. TA's academic status (MS/PhD)
   * 4. Course's TA requirements
   * 
   * @param courses List of courses that need TA assignments
   * @param tas List of available TAs
   * @returns Map of course IDs to assigned TA IDs
   */
  assignTAsAutomatically(courses: Course[], tas: TA[]): Map<number, number[]> {
    // Sort courses by priority (higher student count and TA shortage first)
    const sortedCourses = [...courses].sort((a, b) => {
      const shortageA = (a.taRequirements || 0) - (a.numberOfTAs || 0);
      const shortageB = (b.taRequirements || 0) - (b.numberOfTAs || 0);
      return shortageB - shortageA || (b.numberOfStudents || 0) - (a.numberOfStudents || 0);
    });

    // Sort TAs by availability (lower workload first)
    const sortedTAs = [...tas].sort((a, b) => a.totalWorkload - b.totalWorkload);

    const assignments = new Map<number, number[]>();

    // Initialize assignments map
    courses.forEach(course => {
      assignments.set(course.id, []);
    });

    // Assign TAs to each course
    sortedCourses.forEach(course => {
      const requiredTAs = (course.taRequirements || 0) - (course.numberOfTAs || 0);
      if (requiredTAs <= 0) return;

      const currentAssignments = assignments.get(course.id) || [];
      const availableTAs = sortedTAs.filter(ta => {
        // Check if TA is already assigned to this course
        if (currentAssignments.includes(ta.id)) return false;
        
        // Check if TA is on leave
        if (ta.isOnLeave) return false;
        
        // Check if TA has reached maximum workload (40 hours)
        if (ta.totalWorkload >= 40) return false;
        
        // Check if TA's department matches the course
        return ta.department === course.department;
      });

      // Sort available TAs by suitability
      const suitableTAs = availableTAs.sort((a, b) => {
        // Prioritize PhD students
        if (a.msOrPhdStatus === 'PhD' && b.msOrPhdStatus !== 'PhD') return -1;
        if (b.msOrPhdStatus === 'PhD' && a.msOrPhdStatus !== 'PhD') return 1;
        
        // Then by workload (lower workload first)
        return a.totalWorkload - b.totalWorkload;
      });

      // Assign TAs to the course (do as many as possible)
      for (let i = 0; i < requiredTAs && i < suitableTAs.length; i++) {
        const ta = suitableTAs[i];
        currentAssignments.push(ta.id);
        // Update TA's workload (assuming 20 hours per course)
        ta.totalWorkload += 20;
      }

      assignments.set(course.id, currentAssignments);
    });

    return assignments;
  }

  /**
   * Generates a summary of the assignments
   * @param assignments Map of course IDs to assigned TA IDs
   * @param courses List of all courses
   * @param tas List of all TAs
   * @returns Summary object containing assignment details
   */
  generateAssignmentSummary(assignments: Map<number, number[]>, courses: Course[], tas: TA[]): {
    courseAssignments: Array<{
      courseId: number;
      courseName: string;
      courseCode: string;
      requiredTAs: number;
      assignedTAs: number;
      assignedTANames: string[];
    }>;
    unassignedCourses: Array<{
      courseId: number;
      courseName: string;
      courseCode: string;
      requiredTAs: number;
    }>;
    taWorkloads: Array<{
      taId: number;
      taName: string;
      totalWorkload: number;
      assignedCourses: number;
    }>;
  } {
    const courseAssignments: Array<{
      courseId: number;
      courseName: string;
      courseCode: string;
      requiredTAs: number;
      assignedTAs: number;
      assignedTANames: string[];
    }> = [];

    const unassignedCourses: Array<{
      courseId: number;
      courseName: string;
      courseCode: string;
      requiredTAs: number;
    }> = [];

    const taWorkloads = new Map<number, {
      taId: number;
      taName: string;
      totalWorkload: number;
      assignedCourses: number;
    }>();

    // Initialize TA workloads
    tas.forEach(ta => {
      taWorkloads.set(ta.id, {
        taId: ta.id,
        taName: `${ta.name} ${ta.surname}`,
        totalWorkload: ta.totalWorkload,
        assignedCourses: 0
      });
    });

    // Process assignments
    assignments.forEach((taIds, courseId) => {
      const course = courses.find(c => c.id === courseId);
      if (!course) return;

      const requiredTAs = (course.taRequirements || 0) - (course.numberOfTAs || 0);
      const assignedTANames = taIds.map(taId => {
        const ta = tas.find(t => t.id === taId);
        if (ta) {
          const workload = taWorkloads.get(taId)!;
          workload.assignedCourses++;
          workload.totalWorkload += 20;
          return `${ta.name} ${ta.surname}`;
        }
        return '';
      }).filter(name => name !== '');

      if (assignedTANames.length > 0) {
        courseAssignments.push({
          courseId: course.id,
          courseName: course.name,
          courseCode: course.code,
          requiredTAs,
          assignedTAs: assignedTANames.length,
          assignedTANames
        });
      } else if (requiredTAs > 0) {
        unassignedCourses.push({
          courseId: course.id,
          courseName: course.name,
          courseCode: course.code,
          requiredTAs
        });
      }
    });

    return {
      courseAssignments,
      unassignedCourses,
      taWorkloads: Array.from(taWorkloads.values())
    };
  }

  /**
   * Validates if the proposed assignments are acceptable
   * @param assignments Map of course IDs to assigned TA IDs
   * @param courses List of all courses
   * @param tas List of all TAs
   * @returns boolean indicating if the assignments are valid
   */
  validateAssignments(assignments: Map<number, number[]>, courses: Course[], tas: TA[]): boolean {
    // Check if any TA is overworked
    const taWorkloads = new Map<number, number>();
    assignments.forEach((taIds, courseId) => {
      taIds.forEach(taId => {
        const currentWorkload = taWorkloads.get(taId) || 0;
        taWorkloads.set(taId, currentWorkload + 20); // 20 hours per course
      });
    });

    for (const [taId, workload] of taWorkloads.entries()) {
      if (workload > 40) {
        return false; // TA is overworked
      }
    }

    // Check if all courses have their required TAs
    for (const course of courses) {
      const assignedTAs = assignments.get(course.id) || [];
      const requiredTAs = course.taRequirements || 0;
      if (assignedTAs.length < requiredTAs) {
        return false; // Course doesn't have enough TAs
      }
    }

    return true;
  }
} 