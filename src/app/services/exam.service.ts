import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NotificationService } from './notification.service';
import { CourseService } from './course.service';
import { Exam } from '../shared/models/exam.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:3000/api/exams';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private courseService: CourseService
  ) {}

  createExam(examData: {
    courseId: number;
    userId: number;
    date: string;
    duration: number;
    proctorsRequired: number;
    classrooms: number[];
  }): Observable<Exam> {
    return this.http.post<Exam>(`${this.apiUrl}`, examData).pipe(
      tap(createdExam => {
        // Get course name for better notification message
        this.courseService.getCourse(examData.courseId).subscribe(course => {
          const courseName = course ? course.name : 'Unknown Course';
          const examDate = new Date(examData.date).toLocaleDateString();
          this.notificationService.notifyExamCreated(`Exam on ${examDate}`, courseName);
        });
      })
    );
  }

  getExamById(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/${id}`);
  }

  getAllExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}`);
  }

  updateExam(id: number, examData: Partial<Exam>): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/${id}`, examData);
  }

  deleteExam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getClassroomsForExam(examId: number): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`${this.apiUrl}/${examId}/classrooms`);
  }  
} 