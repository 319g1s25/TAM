import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { AuthGuard } from './guards/auth.guard';
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

export const routes: Routes = [
  // Login route (publicly accessible) - listed first for priority
  { path: 'login', component: LoginComponent },
  
  // Immediately redirect root path to login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Protected routes
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'performance-reports', 
    loadComponent: () => import('./components/performance-reports/performance-reports.component').then(m => m.PerformanceReportsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'tas', 
    component: TAListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'tas/new', 
    component: TAFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'tas/:id', 
    component: TADetailComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'tas/:id/edit', 
    component: TAFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'courses', 
    component: CourseListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'courses/new', 
    component: CourseFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'courses/:id', 
    component: CourseDetailComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'courses/:id/edit', 
    component: CourseFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'workload/add', 
    component: WorkloadFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'workload/instructor',
    loadComponent: () => import('./components/workload/instructor-workload.component').then(m => m.InstructorWorkloadComponent),
    canActivate: [AuthGuard],
    data: { roles: ['instructor'] }
  },
  { 
    path: 'assignments', 
    component: AssignmentListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'assignments/new', 
    component: AssignmentFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'assignments/:id', 
    component: AssignmentFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'proctoring', 
    component: ProctoringListComponent
  },
  {  
    path: 'assignments/:id/edit', 
    component: AssignmentFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'leave-requests', 
    component: LeaveRequestListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'leave-requests/new', 
    component: LeaveRequestFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'leave-requests/:id', 
    component: LeaveRequestFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'leave-requests/:id/edit', 
    component: LeaveRequestFormComponent,
    canActivate: [AuthGuard]
  },
  
  // Catch-all redirect to login
  { path: '**', redirectTo: '/login' }
];
