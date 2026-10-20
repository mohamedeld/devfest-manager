import { Component, inject, signal } from '@angular/core';
import { debounce, disabled, form, FormField, minLength, required } from '@angular/forms/signals';

import { DevFestEvent } from '../../models/event.model';
import { EventsService } from '../../core/events.service';
import { Router } from '@angular/router';

interface CreateEventForm extends Omit<DevFestEvent, 'id'> {}

@Component({
  selector: 'app-create-event',
  template: `
    <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Create New Event</h2>

      <!-- TODO Mod 4: Bind [group] -->
      <form class="space-y-6" (submit)="onSubmit($event)">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
          <!-- TODO Mod 4: Bind [control] -->
          <input
            [formField]="eventForm.title"
            type="text"
            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Angular Workshop"
          />
          @if (eventForm.title().touched() && eventForm.title().invalid()) {
            <p class="text-red-500 text-sm mt-1">{{ eventForm.title().errors()[0].message }}</p>
          }
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            [formField]="eventForm.description"
            rows="3"
            class="w-full px-4 py-2 border rounded-md outline-none"
          ></textarea>

          @if (eventForm.description().touched() && eventForm.description().invalid()) {
            <p class="text-red-500 text-sm mt-1">
              {{ eventForm.description().errors()[0].message }}
            </p>
          }
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label>Date</label>
            <input
              [formField]="eventForm.date"
              type="datetime-local"
              class="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label>Location</label>
            <input
              [formField]="eventForm.location"
              type="text"
              class="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>
        <div class="border-t border-gray-100 pt-4">
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700">Speakers</label>
            <button
              type="button"
              (click)="addSpeaker()"
              class="text-sm text-blue-600 hover:underline"
            >
              + Add Speaker
            </button>
          </div>

          <div class="space-y-2">
            <!-- Iterate over the SOURCE data to get the index -->
            @for (speaker of eventData().speakers; track $index) {
              <div class="flex gap-2">
                <!-- Bind to form.speakers[index] -->
                <input
                  [formField]="eventForm.speakers[$index]"
                  type="text"
                  placeholder="Speaker Name"
                  class="flex-1 px-4 py-2 border rounded-md"
                />

                <button type="button" (click)="removeSpeaker($index)" class="text-red-500 px-2">
                  ✕
                </button>
              </div>
            }
          </div>
        </div>
        <!-- TODO Mod 4: Dynamic Speaker Array -->

        <div class="flex justify-end gap-4 pt-4">
          <button type="button" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  `,
  imports: [FormField],
})
export class CreateEvent {
  // TODO Mod 4: form = form(...)
  eventService = inject(EventsService);
  router = inject(Router);
  readonly eventData = signal<CreateEventForm>({
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 16),
    location: '',
    speakers: [],
    image: '',
  });
  readonly eventForm = form(this.eventData, (schemaPath) => {
    required(schemaPath.title, {
      message: 'Title is required',
    });
    // Description Rules
    // A. Debounce: Wait 1000ms after typing stops before updating the model
    debounce(schemaPath.description, 1000);

    // B. Conditional Disable: Disable description if Title is empty
    // valueOf() lets us look up the current value of other fields
    disabled(schemaPath.description, ({ valueOf }) => !valueOf(schemaPath.title));

    // C. Validation
    required(schemaPath.description, { message: 'Description is required' });
    minLength(schemaPath.description, 10, { message: 'Description must be at least 10 chars' });

    // Other Rules
    required(schemaPath.date, { message: 'Date is required' });
    required(schemaPath.location, { message: 'Location is required' });
  });

  addSpeaker() {
    this.eventData.update((curr) => ({
      ...curr,
      speakers: [...curr.speakers, ''],
    }));
  }
  removeSpeaker(index: number) {
    this.eventData.update((curr) => ({
      ...curr,
      speakers: curr.speakers.filter((_, i) => i !== index),
    }));
  }
  onSubmit(event: Event) {
    event.preventDefault();
    const credentials = this.eventData();
    this.eventService.createEvent(credentials).subscribe({
      next: () => {
        alert('Event Created!');
        this.router.navigate(['/']);
      },
      error: (err) => console.error(err),
    });
  }
}
