import type { TrackingEvent } from './events';
import { dataLayer } from './data-layer';

const TIKTOK_EVENT_MAP: Record<string, string> = {
  product_view: 'ViewContent',
  quote_request_submit: 'SubmitForm',
  whatsapp_click: 'Contact',
  financing_cta_click: 'ClickButton',
};

export function initTikTokPixel() {
  return dataLayer.subscribe((event: TrackingEvent) => {
    if (!window.ttq?.track) return;
    const ttEvent = TIKTOK_EVENT_MAP[event.name];
    if (ttEvent) {
      window.ttq.track(ttEvent, event.params);
    }
  });
}
