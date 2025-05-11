import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

import { LoginComponent } from './components/auth/login.component';
import { TAListComponent } from './components/ta/ta-list.component';
import { TAFormComponent } from './components/ta/ta-form.component';
import { TADetailComponent } from './components/ta/ta-detail.component';
import { CourseListComponent } from './components/course/course-list.component';
import { CourseFormComponent } from './components/course/course-form.component';
import { CourseDetailComponent } from './components/course/course-detail.component';
import { WorkloadFormComponent } from './components/workload/workload-form.component';
import { AssignmentListComponent } from './components/assignments/assignment-list.component';
import { AssignmentFormComponent } from './components/assignments/assignment-form.component';
import { LeaveRequestListComponent } from './components/leave-request/leave-request-list.component';
import { LeaveRequestFormComponent } from './components/leave-request/leave-request-form.component';
import { ProctoringListComponent } from './components/proctoring/proctoring-list.component';
import { ExamFormComponent } from './components/proctoring/exam-form.component';
import { ManualAssignmentComponent } from './components/ta-assignment/manual-assignment.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(c => c.DashboardComponent), canActivate: [AuthGuard] },
  { path: 'performance-reports', loadComponent: () => import('./components/performance-reports/performance-reports.component').then(c => c.PerformanceReportsComponent), canActivate: [AuthGuard] },

  { path: 'tas', component: TAListComponent, canActivate: [AuthGuard] },
  { path: 'tas/new', component: TAFormComponent, canActivate: [RoleGuard], data: { roles: ['authstaff', 'deansoffice'] } },
  { path: 'tas/:id', component: TADetailComponent, canActivate: [AuthGuard] },
  { path: 'tas/:id/edit', component: TAFormComponent, canActivate: [RoleGuard], data: { roles: ['authstaff', 'deansoffice'] } },

  { path: 'courses', component: CourseListComponent, canActivate: [AuthGuard] },
  { path: 'courses/new', component: CourseFormComponent, canActivate: [RoleGuard], data: { roles: ['authstaff', 'deansoffice'] } },
  { path: 'courses/:id/edit', component: CourseFormComponent, canActivate: [RoleGuard], data: { roles: ['authstaff', 'deansoffice'] } },
  { path: 'courses/:id', component: CourseDetailComponent, canActivate: [AuthGuard] },

  { path: 'workload/add', component: WorkloadFormComponent, canActivate: [AuthGuard] },
  { path: 'workload/instructor', loadComponent: () => import('./components/workload/instructor-workload.component').then(c => c.InstructorWorkloadComponent), canActivate: [RoleGuard], data: { roles: ['instructor'] } },
  { path: 'workload/view', loadComponent: () => import('./components/workload/ta-workload.component').then(c => c.TAWorkloadComponent), canActivate: [RoleGuard], data: { roles: ['ta'] } },

  { path: 'assignments', component: AssignmentListComponent, canActivate: [AuthGuard] },
  { path: 'assignments/new', component: AssignmentFormComponent, canActivate: [AuthGuard] },
  { path: 'assignments/:id/edit', component: AssignmentFormComponent, canActivate: [AuthGuard] },
  { path: 'assignments/:id', component: AssignmentFormComponent, canActivate: [AuthGuard] },

  { path: 'leave-requests', component: LeaveRequestListComponent, canActivate: [AuthGuard] },
  { path: 'leave-requests/new', component: LeaveRequestFormComponent, canActivate: [RoleGuard], data: { roles: ['ta'] } },
  { path: 'leave-requests/:id', component: LeaveRequestFormComponent, canActivate: [AuthGuard] },
  { path: 'leave-requests/:id/edit', component: LeaveRequestFormComponent, canActivate: [AuthGuard] },

  { path: 'proctoring', component: ProctoringListComponent, canActivate: [RoleGuard], data: { roles: ['authstaff', 'deansoffice', 'departmentchair', 'instructor', 'ta'] } },
  { path: 'proctoring/new', component: ExamFormComponent, canActivate: [RoleGuard], data: { roles: ['authstaff', 'deansoffice', 'departmentchair', 'instructor'] } },
  { path: 'proctoring/:id', loadComponent: () => import('./components/proctoring/exam-details.component').then(c => c.ExamDetailsComponent), canActivate: [RoleGuard], data: { roles: ['authstaff', 'deansoffice', 'departmentchair', 'instructor', 'ta'] } },
  { path: 'proctoring/assign/:id', loadComponent: () => import('./components/proctoring/proctor-assignment.component').then(c => c.ProctorAssignmentComponent), canActivate: [RoleGuard], data: { roles: ['authstaff', 'deansoffice', 'departmentchair', 'instructor'] } },

  { path: 'ta-assignments', component: ManualAssignmentComponent, canActivate: [RoleGuard], data: { roles: ['authstaff', 'deansoffice', 'departmentchair', 'instructor'] } },

  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
