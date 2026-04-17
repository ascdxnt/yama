export type TrackingEvent =
  | { name: 'product_view'; params: { product_id: string; category: string; price: number; currency: string } }
  | { name: 'product_gallery_interact'; params: { product_id: string; image_index: number } }
  | { name: 'whatsapp_click'; params: { product_id?: string; page: string; position: 'hero' | 'sticky' | 'fab' } }
  | { name: 'quote_request_start'; params: { product_id?: string } }
  | { name: 'quote_request_submit'; params: { product_id?: string; source: string } }
  | { name: 'financing_calculator_interact'; params: { product_id: string; down_payment: number; term: number; monthly_result: number } }
  | { name: 'financing_cta_click'; params: { product_id: string; monthly_result: number } }
  | { name: 'service_booking_start'; params: Record<string, never> }
  | { name: 'service_booking_step'; params: { step_number: number; step_name: string } }
  | { name: 'service_booking_submit'; params: { service_type: string; location: string } }
  | { name: 'dealership_directions'; params: { location_id: string } }
  | { name: 'dealership_call'; params: { location_id: string } }
  | { name: 'category_view'; params: { category_name: string; product_count: number } }
  | { name: 'cta_cotizar_nav'; params: { page: string } };
