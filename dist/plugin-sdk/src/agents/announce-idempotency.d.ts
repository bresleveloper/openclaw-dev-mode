/**
 * Stable announce identifiers for child-run completion messages.
 * Versioned keys let future formats coexist with persisted v1 delivery records.
 */
type AnnounceIdFromChildRunParams = {
    childSessionKey: string;
    childRunId: string;
};
/** Build the persisted announce id for a child session/run pair. */
export declare function buildAnnounceIdFromChildRun(params: AnnounceIdFromChildRunParams): string;
/** Build the idempotency key used by announce delivery storage. */
export declare function buildAnnounceIdempotencyKey(announceId: string): string;
export {};
