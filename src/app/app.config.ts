import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { API_URL } from './core/tokens';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    // Day 1: Zone.js enabled. Day 2: switch to provideZonelessChangeDetection()
    provideZonelessChangeDetection(),

    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),

    provideHttpClient(withFetch()),
    {
      provide: API_URL,
      useValue: 'http://localhost:4400',
    },
    provideClientHydration(withIncrementalHydration()),
  ],
};
