import crypto from 'crypto';

/**
 * Meta Conversions API (server-side events).
 *
 * Two kinds of events are sent:
 *  - Website events (action_source "website") when a lead is captured, deduplicated
 *    against the browser Pixel through a shared event_id.
 *  - CRM events (action_source "system_generated", event_source "crm") whenever a lead
 *    moves to a new stage in the admin panel, so Meta can optimise for leads that convert.
 *
 * Requires META_CAPI_ACCESS_TOKEN. When it is missing every call is a silent no-op.
 */

const GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || 'v21.0';
const PIXEL_ID = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '1621321549388272';
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;
const LEAD_EVENT_SOURCE = process.env.META_LEAD_EVENT_SOURCE || 'BrightPath CRM';

// Placeholder written by the contact route when no email is supplied — never send it to Meta.
const PLACEHOLDER_EMAILS = ['not-provided@example.com'];

/** CRM status -> event name reported to Meta. Statuses not listed here are not reported. */
export const LEAD_STAGE_EVENTS: Record<string, string> = {
    pending: 'Lead',
    contacted: 'Contacted',
    resolved: 'Converted'
};

export interface MetaLeadLike {
    email?: string;
    phoneNumber?: string;
    whatsappNumber?: string;
    fullName?: string;
    country?: string;
    metaLeadId?: string;
    fbp?: string;
    fbc?: string;
}

const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex');

export const normalizeEmail = (email?: string) => {
    const value = (email || '').trim().toLowerCase();
    if (!value.includes('@') || PLACEHOLDER_EMAILS.includes(value)) return null;
    return value;
};

/** Meta expects digits only, including the country code, without leading zeros. */
export const normalizePhone = (phone?: string) => {
    const digits = (phone || '').replace(/\D/g, '').replace(/^0+/, '');
    return digits.length >= 7 ? digits : null;
};

const buildUserData = (lead: MetaLeadLike) => {
    const userData: Record<string, any> = {};

    const email = normalizeEmail(lead.email);
    if (email) userData.em = [sha256(email)];

    const phones = [...new Set([lead.phoneNumber, lead.whatsappNumber].map(normalizePhone).filter(Boolean) as string[])];
    if (phones.length) userData.ph = phones.map(sha256);

    const [firstName, ...rest] = (lead.fullName || '').trim().toLowerCase().split(/\s+/);
    if (firstName) userData.fn = [sha256(firstName)];
    if (rest.length) userData.ln = [sha256(rest.join(' '))];

    if (lead.metaLeadId && /^\d+$/.test(lead.metaLeadId)) {
        const asNumber = Number(lead.metaLeadId);
        userData.lead_id = Number.isSafeInteger(asNumber) ? asNumber : lead.metaLeadId;
    }

    if (lead.fbp) userData.fbp = lead.fbp;
    if (lead.fbc) userData.fbc = lead.fbc;

    return userData;
};

const postEvents = async (events: Record<string, any>[]) => {
    if (!ACCESS_TOKEN || !PIXEL_ID) return;

    const body: Record<string, any> = { data: events };
    if (TEST_EVENT_CODE) body.test_event_code = TEST_EVENT_CODE;

    try {
        const res = await fetch(
            `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(8000)
            }
        );
        if (!res.ok) {
            console.error('Meta CAPI rejected event:', res.status, await res.text());
        }
    } catch (err: any) {
        console.error('Meta CAPI request failed:', err.message);
    }
};

/** Reads the browser context (IP, user agent, _fbp/_fbc cookies, page URL) from a request. */
export const getRequestContext = (req: Request) => {
    const cookies = Object.fromEntries(
        (req.headers.get('cookie') || '')
            .split(';')
            .map(c => c.trim().split('='))
            .filter(([k]) => k)
            .map(([k, ...v]) => [k, decodeURIComponent(v.join('='))])
    );

    return {
        clientIp: (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || undefined,
        userAgent: req.headers.get('user-agent') || undefined,
        sourceUrl: req.headers.get('referer') || undefined,
        fbp: cookies._fbp as string | undefined,
        fbc: cookies._fbc as string | undefined
    };
};

/**
 * Website "Lead" event sent at capture time. Pass the same eventId that the browser
 * Pixel used so Meta counts the conversion once.
 */
export const sendWebsiteLeadEvent = async (
    lead: MetaLeadLike,
    context: ReturnType<typeof getRequestContext>,
    options: { eventId?: string; eventName?: string; customData?: Record<string, any> } = {}
) => {
    const userData = buildUserData({ ...lead, fbp: lead.fbp || context.fbp, fbc: lead.fbc || context.fbc });
    if (context.clientIp) userData.client_ip_address = context.clientIp;
    if (context.userAgent) userData.client_user_agent = context.userAgent;

    await postEvents([{
        event_name: options.eventName || 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        ...(options.eventId && { event_id: options.eventId }),
        ...(context.sourceUrl && { event_source_url: context.sourceUrl }),
        user_data: userData,
        ...(options.customData && { custom_data: options.customData })
    }]);
};

/**
 * CRM stage event (conversion leads integration), e.g. "Contacted" or "Converted".
 * Returns false when the status has no mapped event.
 */
export const sendCrmStageEvent = async (lead: MetaLeadLike, status: string) => {
    const eventName = LEAD_STAGE_EVENTS[status];
    if (!eventName) return false;

    await postEvents([{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'system_generated',
        custom_data: {
            event_source: 'crm',
            lead_event_source: LEAD_EVENT_SOURCE
        },
        user_data: buildUserData(lead)
    }]);
    return true;
};
