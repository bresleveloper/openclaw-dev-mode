/**
 * Shared provider HTTP error normalization helpers.
 *
 * Transport adapters use this module to turn provider-specific response bodies,
 * request ids, and binary payload guardrails into stable OpenClaw error shapes.
 */
export { asFiniteNumber } from "../../packages/normalization-core/src/number-coercion.js";
export { asBoolean } from "../utils/boolean.js";
export { normalizeOptionalString as trimToUndefined } from "../../packages/normalization-core/src/string-coerce.js";
/** Returns a plain object view for provider JSON payloads when one exists. */
export declare function asObject(value: unknown): Record<string, unknown> | undefined;
/** Trims provider error details to a log- and prompt-safe preview length. */
export declare function truncateErrorDetail(detail: string, limit?: number): string;
/** Reads at most `limitBytes` from a response body without buffering provider-sized failures. */
export declare function readResponseTextLimited(response: Response, limitBytes?: number): Promise<string>;
/** Formats common provider JSON error payload shapes into one readable detail string. */
export declare function formatProviderErrorPayload(payload: unknown): string | undefined;
/** Returns only the normalized provider detail string for callers that do not need metadata. */
export declare function extractProviderErrorDetail(response: Response): Promise<string | undefined>;
/** Reads the provider request id header variants used across model and media APIs. */
export declare function extractProviderRequestId(response: Response): string | undefined;
/** Error type carrying normalized provider status, request id, code, type, and body metadata. */
export declare class ProviderHttpError extends Error {
    readonly status: number;
    readonly statusCode: number;
    readonly code?: string;
    readonly errorCode?: string;
    readonly errorType?: string;
    readonly errorBody?: string;
    readonly requestId?: string;
    constructor(message: string, params: {
        status: number;
        code?: string;
        type?: string;
        body?: string;
        requestId?: string;
    });
}
/** Builds the human-facing provider HTTP error message from normalized metadata. */
export declare function formatProviderHttpErrorMessage(params: {
    label: string;
    status: number;
    detail?: string;
    requestId?: string;
    statusPrefix?: string;
}): string;
/** Creates a normalized provider HTTP error from a failed response. */
export declare function createProviderHttpError(response: Response, label: string, options?: {
    statusPrefix?: string;
}): Promise<Error>;
/** Throws a normalized provider error when a fetch response is not OK. */
export declare function assertOkOrThrowProviderError(response: Response, label: string): Promise<void>;
/** Throws a normalized generic HTTP error when a fetch response is not OK. */
export declare function assertOkOrThrowHttpError(response: Response, label: string): Promise<void>;
/**
 * Parses a provider JSON response under a byte cap and wraps malformed JSON with the caller's label.
 *
 * The body is read through the same bounded reader as binary responses so a provider that streams an
 * unbounded JSON body cannot force the runtime to buffer the whole payload before parsing.
 */
export declare function readProviderJsonResponse<T>(response: Response, label: string, opts?: {
    maxBytes?: number;
}): Promise<T>;
/** Parses a provider JSON response that must be a top-level object. */
export declare function readProviderJsonObjectResponse(response: Response, label: string): Promise<Record<string, unknown>>;
/** Parses a provider JSON object response and returns an array field. */
export declare function readProviderJsonArrayFieldResponse(response: Response, label: string, field: string): Promise<unknown[]>;
/** Rejects text or JSON responses on provider endpoints that should return binary bytes. */
export declare function assertProviderBinaryResponseContent(response: Response, label: string, kind?: string): void;
/** Reads a bounded non-empty binary provider response after content-type validation. */
export declare function readProviderBinaryResponse(response: Response, label: string, kind?: string, opts?: {
    maxBytes?: number;
}): Promise<Uint8Array>;
