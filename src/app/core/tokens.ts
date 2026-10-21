import { inject, InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken<string>('API_URL');

export const TICKETS_URL = new InjectionToken('TICKETS_URL', {
  providedIn: 'root',
  factory() {
    const apiUrl = inject(API_URL);
    return `${apiUrl}/tickets`;
  },
});
