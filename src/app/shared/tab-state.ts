import { Injectable, signal } from '@angular/core';

@Injectable()
export class TabState {
  readonly activeTab = signal('');

  handleActiveTab(label: string) {
    this.activeTab.set(label);
  }
}
