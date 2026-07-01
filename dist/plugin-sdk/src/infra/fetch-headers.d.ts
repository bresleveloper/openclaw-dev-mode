/** Normalizes HeadersInit records so fetch receives only string-keyed header properties. */
export declare function normalizeHeadersInitForFetch(headers: HeadersInit | undefined): HeadersInit | undefined;
/** Normalizes request init headers without cloning the init object when no change is needed. */
export declare function normalizeRequestInitHeadersForFetch<T extends {
    headers?: HeadersInit;
}>(init: T | undefined): T | undefined;
