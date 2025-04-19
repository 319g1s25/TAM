import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-toggle">
      <button (click)="toggleTheme()" [attr.aria-label]="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'" [class.dark]="isDarkMode">
        <i class="material-icons">{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</i>
      </button>
    </div>
  `,
  styles: [`
    .theme-toggle {
      display: flex;
      align-items: center;
    }
    
    button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333333;
      border-radius: 50%;
      transition: background-color 0.2s, color 0.2s;
    }
    
    button.dark {
      color: #f0f0f0;
    }
    
    button:hover {
      background-color: rgba(128, 128, 128, 0.2);
    }
    
    .material-icons {
      font-size: 24px;
    }
  `]
})
export class ThemeToggleComponent {
  isDarkMode = false;
  
  constructor(private themeService: ThemeService) {
    this.themeService.darkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    });
  }
  
  toggleTheme() {
    this.themeService.toggleDarkMode();
  }
} 