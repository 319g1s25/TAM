import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();
  
  constructor(rendererFactory: RendererFactory2) {
    // Check if user previously set dark mode
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      const isDarkMode = JSON.parse(savedDarkMode);
      this.setDarkMode(isDarkMode);
    } else {
      // Check user preference from system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setDarkMode(prefersDark);
    }

    // Listen for changes in system preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('darkMode') === null) {
        this.setDarkMode(e.matches);
      }
    });
  }
  
  toggleDarkMode() {
    this.setDarkMode(!this.darkMode.value);
  }
  
  setDarkMode(isDarkMode: boolean) {
    // Apply the class to both document and body for maximum compatibility
    if (isDarkMode) {
      document.documentElement.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme');
    }
    
    this.darkMode.next(isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }
  
  isDarkMode() {
    return this.darkMode.value;
  }
} 