import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { LeaveRequestFormComponent } from './components/leave-request/leave-request-form.component';
import { LeaveRequestListComponent } from './components/leave-request/leave-request-list.component';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/auth/login.component').then(c => c.LoginComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tas', 
    loadComponent: () => import('./components/ta/ta-list.component').then(c => c.TAListComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tas/new', 
    loadComponent: () => import('./components/ta/ta-form.component').then(c => c.TAFormComponent),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'coordinator'] } 
  },
  { 
    path: 'tas/:id', 
    loadComponent: () => import('./components/ta/ta-detail.component').then(c => c.TADetailComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tas/:id/edit', 
    loadComponent: () => import('./components/ta/ta-form.component').then(c => c.TAFormComponent),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'coordinator'] } 
  },
  { 
    path: 'assignments', 
    loadComponent: () => import('./components/assignments/assignment-list.component').then(c => c.AssignmentListComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'assignments/add', 
    loadComponent: () => import('./components/assignments/assignment-form.component').then(c => c.AssignmentFormComponent),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'coordinator'] } 
  },
  { 
    path: 'assignments/:id', 
    loadComponent: () => import('./components/assignments/assignment-detail.component').then(c => c.AssignmentDetailComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'courses', 
    loadComponent: () => import('./components/course/course-list.component').then(c => c.CourseListComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'courses/new', 
    loadComponent: () => import('./components/course/course-form.component').then(c => c.CourseFormComponent),
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'coordinator'] } 
  },
  {
    path: 'courses/:id/edit',
    loadComponent: () => import('./components/course/course-form.component').then(c => c.CourseFormComponent),
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'coordinator'] } 
  },
  {
    path: 'courses/:id',
    loadComponent: () => import('./components/course/course-detail.component').then(c => c.CourseDetailComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'performance-reports', 
    loadComponent: () => import('./components/performance-reports/performance-reports.component').then(c => c.PerformanceReportsComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'workload/add', 
    loadComponent: () => import('./components/workload/workload-form.component').then(c => c.WorkloadFormComponent),
    canActivate: [AuthGuard] 
  },
  {
    path: 'workload/instructor',
    loadComponent: () => import('./components/workload/instructor-workload.component').then(c => c.InstructorWorkloadComponent),
    canActivate: [RoleGuard],
    data: { roles: ['instructor'] }
  },
  
  // Leave Request routes
  { 
    path: 'leave-requests', 
    component: LeaveRequestListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'leave-requests/new', 
    component: LeaveRequestFormComponent, 
    canActivate: [RoleGuard],
    data: { roles: ['ta'] }
  },

  // Proctoring routes
  { 
    path: 'proctoring', 
    loadComponent: () => import('./components/proctoring/proctoring-list.component').then(c => c.ProctoringListComponent),
    canActivate: [RoleGuard],
    data: { roles: ['authstaff', 'deansoffice', 'departmentchair', 'instructor'] }
  },
  { 
    path: 'proctoring/new', 
    loadComponent: () => import('./components/proctoring/exam-form.component').then(c => c.ExamFormComponent),
    canActivate: [RoleGuard],
    data: { roles: ['authstaff', 'deansoffice', 'departmentchair', 'instructor'] }
  },
  { 
    path: 'proctoring/assign/:id', 
    loadComponent: () => import('./components/proctoring/proctor-assignment.component').then(c => c.ProctorAssignmentComponent),
    canActivate: [RoleGuard],
    data: { roles: ['authstaff', 'deansoffice', 'departmentchair', 'instructor'] }
  },
  
  // Fallback route
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 