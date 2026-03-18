import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  message: string;
  type: NotificationType;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  queue = signal<Notification[]>([]);
  private nextId = 0;
  private readonly MAX_NOTIFICATIONS = 3;
  private timeouts = new Map<number, any>();

  show(message: string, type: NotificationType = 'success') {
    // 1. Deduplication: Remove existing notification with the same message
    const existing = this.queue().find(n => n.message === message);
    if (existing) {
      this.dismiss(existing.id);
    }

    // 2. Limit: Remove oldest if we reached MAX_NOTIFICATIONS
    if (this.queue().length >= this.MAX_NOTIFICATIONS) {
      this.dismiss(this.queue()[0].id);
    }

    const id = this.nextId++;
    this.queue.update(q => [...q, { id, message, type }]);

    // 3. Auto dismiss after 3 seconds
    const timeout = setTimeout(() => {
      this.dismiss(id);
    }, 3000);
    
    this.timeouts.set(id, timeout);
  }

  dismiss(id: number) {
    // Clear timeout if it exists
    if (this.timeouts.has(id)) {
      clearTimeout(this.timeouts.get(id));
      this.timeouts.delete(id);
    }
    
    this.queue.update(q => q.filter(n => n.id !== id));
  }
}
