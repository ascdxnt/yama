import type { TrackingEvent } from './events';
import { dataLayer } from './data-layer';

export function initGA4() {
  return dataLayer.subscribe((event: TrackingEvent) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', event.name, event.params);
  });
}
