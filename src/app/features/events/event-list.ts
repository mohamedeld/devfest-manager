import { Component, signal } from '@angular/core';
import { EventCard } from './event-card';
import { SearchBar } from './search-bar';

@Component({
  selector: 'app-event-list',
  imports: [EventCard, SearchBar],
  template: `
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
      <!-- TODO Mod 1: Add SearchBar here -->
      <app-search-bar [(query)]="searchQuery" />

      <p class="text-gray-500 mt-2">Searching for: {{ searchQuery() }}</p>
    </div>

    <!-- TODO Mod 2: Wrap in @if (events.isLoading()) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- TODO Mod 2: Use @for to iterate over resource -->

      <!-- Static Placeholders for initial verify -->
      <app-event-card
        title="Angular Keynote"
        image="https://via.placeholder.com/600"
        date="2025-12-26T19:00:00.000Z"
        (delete)="console.log('Delete clicked')"
      />
      <app-event-card
        title="Signals Deep Dive"
        image="https://via.placeholder.com/600"
        date="2025-12-10T09:00:00.000Z"
        (delete)="console.log('Delete clicked')"
      />
      <app-event-card
        title="Server-Side Rendering at Scale"
        image="https://via.placeholder.com/600"
        (delete)="console.log('Delete clicked')"
      />
    </div>
  `,
})
export class EventList {
  readonly console = console;

  searchQuery = signal('');
  // TODO Mod 2: Inject Service and use resource()
}
