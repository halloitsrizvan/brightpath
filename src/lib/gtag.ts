export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Disallowed PII field patterns to strictly prevent sending sensitive user data to GA4
const SENSITIVE_KEYS = new Set([
  'name',
  'fullname',
  'full_name',
  'studentname',
  'parentname',
  'email',
  'phone',
  'phonenumber',
  'phone_number',
  'whatsapp',
  'whatsappnumber',
  'whatsapp_number',
  'contact',
  'password',
  'studentid',
  'student_id',
  'health',
  'medical',
  'address',
]);

/**
 * Filter out any Personally Identifiable Information (PII) before dispatching to GA4.
 */
function sanitizeParams(params: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  for (const [key, val] of Object.entries(params)) {
    const lowerKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (SENSITIVE_KEYS.has(lowerKey)) {
      continue; // Drop PII
    }
    // Only pass primitive or non-sensitive metadata
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

/**
 * Dispatches a custom GA4 event.
 */
export const event = (action: string, params: Record<string, any> = {}) => {
  if (typeof window === 'undefined') return;

  const safeParams = sanitizeParams(params);

  if (typeof window.gtag === 'function') {
    window.gtag('event', action, safeParams);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(['event', action, safeParams]);
  }
};

/**
 * Tracks WhatsApp link/button clicks without PII.
 * Recommended GA4 event name: 'whatsapp_click'
 */
export const trackWhatsAppClick = (linkLocation: string, extraParams: Record<string, any> = {}) => {
  event('whatsapp_click', {
    event_category: 'Contact',
    link_location: linkLocation,
    ...extraParams,
  });
};

/**
 * Tracks successful enquiry form submissions / lead generation without PII.
 * Standard GA4 event name: 'generate_lead'
 */
export const trackLead = (source: string, extraParams: Record<string, any> = {}) => {
  event('generate_lead', {
    event_category: 'Lead',
    source: source,
    ...extraParams,
  });
};

/**
 * Triggers a manual pageview in GA4 if needed.
 */
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function' && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};
