import type { TrackingEvent } from './events';
import { dataLayer } from './data-layer';

const META_EVENT_MAP: Record<string, string> = {
  product_view: 'ViewContent',
  quote_request_submit: 'Lead',
  whatsapp_click: 'Contact',
  financing_cta_click: 'InitiateCheckout',
  service_booking_submit: 'Schedule',
};

export function initMetaPixel() {
  return dataLayer.subscribe((event: TrackingEvent) => {
    if (typeof window.fbq !== 'function') return;
    const metaEvent = META_EVENT_MAP[event.name];
    if (metaEvent) {
      window.fbq('track', metaEvent, event.params);
    } else {
      window.fbq('trackCustom', event.name, event.params);
    }
  });
}
