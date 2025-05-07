import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExamService } from '../../services/exam.service';
import { TAService } from '../../services/ta.service';
import { ProctoringAssignmentService } from '../../services/proctoring-assignment.service';
import { CourseService } from '../../services/course.service';
import { Exam } from '../../shared/models/exam.model';
import { TA } from '../../shared/models/ta.model';
import { Course } from '../../shared/models/course.model';

@Component({
  selector: 'app-proctor-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proctor-assignment.component.html',
  styleUrls: ['./proctor-assignment.component.css']
})
export class ProctorAssignmentComponent implements OnInit {
  exam: Exam | null = null;
  tas: TA[] = [];
  selectedTAs: number[] = [];
  course: Course | null = null;
  assignmentMode: 'manual' | 'auto' = 'manual';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private taService: TAService,
    private courseService: CourseService,
    private proctoringAssignmentService: ProctoringAssignmentService
  ) {}

  ngOnInit(): void {
    const examId = Number(this.route.snapshot.paramMap.get('id'));
    if (examId) {
      this.loadExam(examId);
      this.loadTAs();
    }
  }

  loadExam(id: number): void {
    this.loading = true;
    this.examService.getExamById(id).subscribe(
      exam => {
        this.exam = exam;
        this.loadCourse(exam.courseID);
        this.loadAssignedTAs(id);
        this.loading = false;
      },
      error => {
        console.error('Error loading exam:', error);
        this.loading = false;
      }
    );
  }

  loadCourse(courseId: number): void {
    this.courseService.getCourse(courseId).subscribe(
      course => this.course = course,
      error => console.error('Error loading course:', error)
    );
  }

  loadTAs(): void {
    this.taService.getAllTAs().subscribe(
      tas => {
        this.tas = tas.filter(ta => !ta.isOnLeave && ta.proctoringEnabled);
      },
      error => {
        console.error('Error loading TAs:', error);
      }
    );
  }

  loadAssignedTAs(examId: number): void {
    this.proctoringAssignmentService.getAssignedTAs(examId).subscribe(
      tas => {
        this.selectedTAs = tas
          .map(ta => ta.id)
            .filter((id): id is number => id !== undefined);
      },
      error => {
        console.error('Error loading assigned TAs:', error);
      }
    );
  }

  toggleTA(taId: number): void {
    const index = this.selectedTAs.indexOf(taId);
    if (index === -1 && this.selectedTAs.length < (this.exam?.proctorsRequired || 0)) {
      this.selectedTAs.push(taId);
    } else if (index !== -1) {
      this.selectedTAs.splice(index, 1);
    }
  }

  assignProctors(): void {
    if (!this.exam || this.selectedTAs.length === 0) return;

    this.loading = true;
    this.proctoringAssignmentService.assignProctors(this.exam.id, this.selectedTAs).subscribe(
      () => {
        alert('Proctors assigned successfully');
        this.router.navigate(['/proctoring']);
      },
      error => {
        console.error('Error assigning proctors:', error);
        this.loading = false;
      }
    );
  }

  assignProctorsAutomatically(): void {
    if (!this.exam) return;
  
    this.loading = true;
  
    this.proctoringAssignmentService.autoAssignProctors(this.exam.id).subscribe(
      res => {
        alert(`Assigned ${res.assignedTAIds.length} proctors automatically`);
        this.router.navigate(['/proctoring']);
      },
      error => {
        console.error('Auto-assign failed', error);
        this.loading = false;
      }
    );
  }  

  isTAEligible(ta: TA): boolean {
    if (!this.exam || !this.course) return false;

    // Check if already selected
    if (ta.id === undefined || this.selectedTAs.includes(ta.id)) return false;

    // Check department match
    const examDept = this.course.course_code.substring(0, 2);
    if (examDept !== ta.department) return false;

    if (ta.totalWorkload >= 40) return false;

    return true;
  }
}
