import type { TrackingEvent } from './events';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
    ttq: { track: (...args: unknown[]) => void };
  }
}

type Listener = (event: TrackingEvent) => void;

class DataLayer {
  private listeners: Listener[] = [];
  private queue: TrackingEvent[] = [];
  private initialized = false;

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    if (this.initialized) {
      this.queue.forEach(listener);
    }
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  init() {
    this.initialized = true;
    this.queue.forEach((event) => {
      this.listeners.forEach((listener) => listener(event));
    });
    this.queue = [];
  }

  push(event: TrackingEvent) {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: event.name, ...event.params });
    }

    if (!this.initialized) {
      this.queue.push(event);
      return;
    }

    this.listeners.forEach((listener) => listener(event));
  }
}

export const dataLayer = new DataLayer();
