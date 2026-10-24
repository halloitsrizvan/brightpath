export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Triggers a pageview event in Google Analytics 4.
 */
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function' && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

/**
 * Triggers a custom event in Google Analytics 4 without passing any PII (Personally Identifiable Information).
 * @param action Standard or custom GA4 event name (e.g., 'generate_lead', 'contact_whatsapp')
 * @param params Event parameters
 */
export const event = (action: string, params: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, params);
  }
};
