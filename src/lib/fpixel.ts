export const FB_PIXEL_ID =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '1621321549388272';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
  }
}

/**
 * Triggers a PageView event in Meta Pixel.
 */
export const pageview = () => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
};

/**
 * Triggers standard or custom Meta Pixel events (e.g., 'Lead', 'Contact', 'CompleteRegistration').
 * @param name Event name recognized by Meta Pixel or custom event name
 * @param options Additional metadata for the event
 * @param eventId Shared with the server-side Conversions API event so Meta deduplicates them
 */
export const event = (name: string, options: Record<string, any> = {}, eventId?: string) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    if (eventId) window.fbq('track', name, options, { eventID: eventId });
    else window.fbq('track', name, options);
  }
};

/**
 * Generates an event ID for Pixel / Conversions API deduplication.
 */
export const newEventId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
