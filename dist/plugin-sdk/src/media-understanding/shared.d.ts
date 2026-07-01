export { assertOkOrThrowHttpError, readProviderJsonObjectResponse, readProviderJsonResponse, } from "../agents/provider-http-errors.js";
import type { ProviderRequestCapability, ProviderRequestTransport } from "../agents/provider-attribution.js";
import { type ModelProviderRequestTransportOverrides, type ResolvedProviderRequestConfig } from "../agents/provider-request-config.js";
import type { GuardedFetchMode, GuardedFetchResult } from "../infra/net/fetch-guard.js";
import type { LookupFn, PinnedDispatcherPolicy, SsrFPolicy } from "../infra/net/ssrf.js";
import { type ProviderOperationRetryStage, type TransientProviderRetryConfig } from "../provider-runtime/operation-retry.js";
import { fetchWithTimeout } from "../utils/fetch-timeout.js";
export { fetchWithTimeout };
export { normalizeBaseUrl } from "../agents/provider-request-config.js";
export { sanitizeConfiguredModelProviderRequest } from "../agents/provider-request-config.js";
/** Resolves the multipart upload filename, mapping AAC inputs to provider-friendly `.m4a`. */
export declare function resolveAudioTranscriptionUploadFileName(fileName?: string, mime?: string): string;
/** Builds provider-compatible multipart form data for audio transcription requests. */
export declare function buildAudioTranscriptionFormData(params: {
    buffer: Buffer;
    fileName?: string;
    mime?: string;
    fields?: Record<string, string | number | boolean | undefined>;
}): FormData;
/** Shared absolute deadline state for long-running provider operations and polling loops. */
export type ProviderOperationDeadline = {
    deadlineAtMs?: number;
    label: string;
    timeoutMs?: number;
};
/** Static or per-call timeout resolver used by provider HTTP helpers. */
export type ProviderOperationTimeoutMs = number | (() => number);
type GuardedProviderRequestParams = {
    pinDns?: boolean;
    allowPrivateNetwork?: boolean;
    ssrfPolicy?: SsrFPolicy;
    dispatcherPolicy?: PinnedDispatcherPolicy;
    auditContext?: string;
    /**
     * Override the guarded-fetch mode. Defaults to an auto-upgrade to
     * `TRUSTED_ENV_PROXY` when `HTTP_PROXY`/`HTTPS_PROXY` is configured in the
     * environment; pass `"strict"` to force pinned-DNS even inside a proxy.
     */
    mode?: GuardedFetchMode;
};
/** Creates a timer-safe absolute operation deadline from an optional total timeout. */
export declare function createProviderOperationDeadline(params: {
    timeoutMs?: number;
    label: string;
}): ProviderOperationDeadline;
/** Resolves a per-request timeout without exceeding the remaining operation deadline. */
export declare function resolveProviderOperationTimeoutMs(params: {
    deadline: ProviderOperationDeadline;
    defaultTimeoutMs: number;
}): number;
/** Returns a lazy timeout resolver for code paths that retry or poll multiple HTTP calls. */
export declare function createProviderOperationTimeoutResolver(params: {
    deadline: ProviderOperationDeadline;
    defaultTimeoutMs: number;
}): () => number;
/** Waits for the next poll interval while respecting the total provider operation deadline. */
export declare function waitProviderOperationPollInterval(params: {
    deadline: ProviderOperationDeadline;
    pollIntervalMs: number;
}): Promise<void>;
export declare function pollProviderOperationJson<TPayload>(params: {
    url: string;
    headers: Headers | (() => Headers);
    deadline: ProviderOperationDeadline;
    defaultTimeoutMs: number;
    fetchFn: typeof fetch;
    maxAttempts: number;
    pollIntervalMs: number;
    requestFailedMessage: string;
    timeoutMessage: string;
    isComplete: (payload: TPayload) => boolean;
    getFailureMessage?: (payload: TPayload) => string | undefined;
} & GuardedProviderRequestParams): Promise<TPayload>;
export declare function fetchProviderOperationResponse(params: {
    stage: ProviderOperationRetryStage;
    url: string;
    init?: RequestInit;
    timeoutMs?: ProviderOperationTimeoutMs;
    fetchFn: typeof fetch;
    provider?: string;
    requestFailedMessage?: string;
    retry?: TransientProviderRetryConfig;
}): Promise<Response>;
export declare function fetchProviderDownloadResponse(params: {
    url: string;
    init?: RequestInit;
    timeoutMs?: ProviderOperationTimeoutMs;
    fetchFn: typeof fetch;
    provider?: string;
    requestFailedMessage: string;
    retry?: TransientProviderRetryConfig;
}): Promise<Response>;
export declare function resolveProviderHttpRequestConfig(params: {
    baseUrl?: string;
    defaultBaseUrl: string;
    allowPrivateNetwork?: boolean;
    headers?: HeadersInit;
    defaultHeaders?: Record<string, string>;
    request?: ModelProviderRequestTransportOverrides;
    provider?: string;
    api?: string;
    capability?: ProviderRequestCapability;
    transport?: ProviderRequestTransport;
}): {
    baseUrl: string;
    allowPrivateNetwork: boolean;
    headers: Headers;
    dispatcherPolicy?: PinnedDispatcherPolicy;
    requestConfig: ResolvedProviderRequestConfig;
};
export declare function fetchWithTimeoutGuarded(url: string, init: RequestInit, timeoutMs: number | undefined, fetchFn: typeof fetch, options?: {
    ssrfPolicy?: SsrFPolicy;
    lookupFn?: LookupFn;
    pinDns?: boolean;
    dispatcherPolicy?: PinnedDispatcherPolicy;
    auditContext?: string;
    mode?: GuardedFetchMode;
}): Promise<GuardedFetchResult>;
type GuardedPostRequestRetryOptions = {
    /**
     * POST requests default to no retry because many provider endpoints create
     * billable jobs. Pass "read" only for read/analysis POST endpoints.
     */
    retryStage?: ProviderOperationRetryStage;
    retry?: TransientProviderRetryConfig;
};
type GuardedPostRequestParams<TBody> = GuardedProviderRequestParams & GuardedPostRequestRetryOptions & {
    url: string;
    headers: Headers;
    body: TBody;
    timeoutMs?: number;
    fetchFn: typeof fetch;
};
export declare function postTranscriptionRequest(params: GuardedPostRequestParams<BodyInit>): Promise<GuardedFetchResult>;
export declare function postJsonRequest(params: GuardedPostRequestParams<unknown>): Promise<GuardedFetchResult>;
export declare function postMultipartRequest(params: GuardedPostRequestParams<BodyInit>): Promise<GuardedFetchResult>;
export declare function requireTranscriptionText(value: string | undefined, missingMessage: string): string;
