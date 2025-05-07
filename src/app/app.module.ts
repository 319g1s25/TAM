import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app.routes';
import { RoleGuard } from './guards/role.guard';
import { AuthGuard } from './guards/auth.guard';
@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [RoleGuard, AuthGuard],
})
export class AppModule { } 