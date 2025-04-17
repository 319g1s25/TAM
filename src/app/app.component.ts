import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="app-container">
      <app-navbar></app-navbar>
      <main class="content-area">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      width: 100%;
    }
    
    .content-area {
      flex: 1;
      margin-left: 250px;
      padding: 20px;
      overflow-y: auto;
    }
    
    @media (max-width: 768px) {
      .content-area {
        margin-left: 0;
        padding-top: 60px;
      }
    }
  `]
})
export class AppComponent {
  title = 'TA Management System';
}
