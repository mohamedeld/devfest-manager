import { computed, inject, Injectable, signal } from '@angular/core';
import { TICKETS_URL } from './tokens';
import { HttpClient } from '@angular/common/http';

interface TicketEntry {
  id: string;
  eventId: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  readonly ticketsUrl = inject(TICKETS_URL);
  readonly httpClient = inject(HttpClient);

  private readonly ticketIds = signal<string[]>([]);

  readonly count = computed(() => this.ticketIds().length);

  constructor() {
    this.loadTickets();
  }

  private loadTickets() {
    this.httpClient.get<TicketEntry[]>(this.ticketsUrl).subscribe({
      next: (data) => {
        const ids = data?.map((t) => t.eventId);
        this.ticketIds.set(ids);
      },
      error: (err) => console.error('Failed to load cart', err),
    });
  }
  addTicket(eventId: string) {
    const previousIds = this.ticketIds();

    this.ticketIds.update((items) => [...items, eventId]);

    this.httpClient.post(this.ticketsUrl, { eventId }).subscribe({
      next: () => console.log('Ticket synced to backend'),
      error: (err) => {
        console.error('Sync failed, reverting state', err);
        // D. Revert on Error
        this.ticketIds.set(previousIds);
        alert('Failed to add ticket to cart.');
      },
    });
  }
}
