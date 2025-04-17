import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TAListComponent } from './components/ta/ta-list.component';
import { TAFormComponent } from './components/ta/ta-form.component';
import { CourseListComponent } from './components/course/course-list.component';
import { CourseFormComponent } from './components/course/course-form.component';
import { PerformanceReportsComponent } from './components/performance-reports/performance-reports.component';
import { WorkloadFormComponent } from './components/workload/workload-form.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'tas', component: TAListComponent },
  { path: 'tas/new', component: TAFormComponent },
  { path: 'tas/:id', component: TAFormComponent },
  { path: 'tas/:id/edit', component: TAFormComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'courses/new', component: CourseFormComponent },
  { path: 'courses/:id', component: CourseFormComponent },
  { path: 'courses/:id/edit', component: CourseFormComponent },
  { path: 'reports', component: PerformanceReportsComponent },
  { path: 'workload/add', component: WorkloadFormComponent },
  { path: '**', redirectTo: '' }
];
