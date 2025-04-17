import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withRouterConfig, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { APP_INITIALIZER, inject } from '@angular/core';

// Function to ensure we redirect to login on app start
function initializeApp(router: Router): () => Promise<boolean> {
  return () => {
    return new Promise<boolean>((resolve) => {
      // Force navigation to login if at root path
      if (window.location.pathname === '/' || window.location.pathname === '') {
        router.navigate(['/login']).then(() => {
          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    // App initializer to force login redirect
    {
      provide: APP_INITIALIZER,
      useFactory: () => initializeApp(inject(Router)),
      multi: true
    },
    provideRouter(
      routes, 
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      })
    ),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
