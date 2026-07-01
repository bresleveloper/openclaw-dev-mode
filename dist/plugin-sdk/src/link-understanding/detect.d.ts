/**
 * Extracts unique, SSRF-filtered bare HTTP(S) links from inbound text.
 * Markdown links are ignored so display-only citations do not trigger fetches.
 */
export declare function extractLinksFromMessage(message: string, opts?: {
    maxLinks?: number;
}): string[];
