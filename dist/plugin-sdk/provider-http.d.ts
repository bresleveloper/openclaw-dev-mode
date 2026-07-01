import { n as PinnedDispatcherPolicy, o as SsrFPolicy, t as LookupFn } from "./ssrf-skjEI_i5.js";
import { S as resolveProviderRequestPolicy, _ as ProviderRequestPolicyInput, a as ProviderRequestTransportOverrides, b as resolveProviderEndpoint, c as resolveProviderRequestHeaders, d as ProviderEndpointClass, f as ProviderEndpointResolution, g as ProviderRequestCompatibilityFamily, h as ProviderRequestCapability, i as ProviderRequestTlsOverride, l as sanitizeConfiguredModelProviderRequest, m as ProviderRequestCapabilitiesInput, n as ProviderRequestAuthOverride, o as ResolvedProviderRequestConfig, p as ProviderRequestCapabilities, r as ProviderRequestProxyOverride, s as normalizeBaseUrl, t as ModelProviderRequestTransportOverrides, u as ProviderAttributionPolicy, v as ProviderRequestPolicyResolution, x as resolveProviderRequestCapabilities, y as ProviderRequestTransport } from "./provider-request-config-gRarTgZO.js";
import { i as GuardedFetchResult, n as GuardedFetchMode } from "./fetch-guard-BKvfwdRa.js";
import { r as fetchWithTimeout } from "./fetch-timeout-D2yvPshT.js";
import { a as executeProviderOperationWithRetry, i as TransientProviderRetryParams, n as TransientProviderRetryConfig, o as providerOperationRetryConfig, r as TransientProviderRetryOptions, t as ProviderOperationRetryStage } from "./operation-retry-x92MYk0c.js";
import { a as createProviderHttpError, c as formatProviderErrorPayload, d as readProviderJsonArrayFieldResponse, f as readProviderJsonObjectResponse, h as truncateErrorDetail, i as assertProviderBinaryResponseContent, l as formatProviderHttpErrorMessage, m as readResponseTextLimited, n as assertOkOrThrowHttpError, o as extractProviderErrorDetail, p as readProviderJsonResponse, r as assertOkOrThrowProviderError, s as extractProviderRequestId, u as readProviderBinaryResponse } from "./provider-http-errors-pGBIyBFy.js";

//#region src/media-understanding/shared.d.ts
/** Resolves the multipart upload filename, mapping AAC inputs to provider-friendly `.m4a`. */
declare function resolveAudioTranscriptionUploadFileName(fileName?: string, mime?: string): string;
/** Builds provider-compatible multipart form data for audio transcription requests. */
declare function buildAudioTranscriptionFormData(params: {
  buffer: Buffer;
  fileName?: string;
  mime?: string;
  fields?: Record<string, string | number | boolean | undefined>;
}): FormData;
/** Shared absolute deadline state for long-running provider operations and polling loops. */
type ProviderOperationDeadline = {
  deadlineAtMs?: number;
  label: string;
  timeoutMs?: number;
};
/** Static or per-call timeout resolver used by provider HTTP helpers. */
type ProviderOperationTimeoutMs = number | (() => number);
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
declare function createProviderOperationDeadline(params: {
  timeoutMs?: number;
  label: string;
}): ProviderOperationDeadline;
/** Resolves a per-request timeout without exceeding the remaining operation deadline. */
declare function resolveProviderOperationTimeoutMs(params: {
  deadline: ProviderOperationDeadline;
  defaultTimeoutMs: number;
}): number;
/** Returns a lazy timeout resolver for code paths that retry or poll multiple HTTP calls. */
declare function createProviderOperationTimeoutResolver(params: {
  deadline: ProviderOperationDeadline;
  defaultTimeoutMs: number;
}): () => number;
/** Waits for the next poll interval while respecting the total provider operation deadline. */
declare function waitProviderOperationPollInterval(params: {
  deadline: ProviderOperationDeadline;
  pollIntervalMs: number;
}): Promise<void>;
declare function pollProviderOperationJson<TPayload>(params: {
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
declare function fetchProviderOperationResponse(params: {
  stage: ProviderOperationRetryStage;
  url: string;
  init?: RequestInit;
  timeoutMs?: ProviderOperationTimeoutMs;
  fetchFn: typeof fetch;
  provider?: string;
  requestFailedMessage?: string;
  retry?: TransientProviderRetryConfig;
}): Promise<Response>;
declare function fetchProviderDownloadResponse(params: {
  url: string;
  init?: RequestInit;
  timeoutMs?: ProviderOperationTimeoutMs;
  fetchFn: typeof fetch;
  provider?: string;
  requestFailedMessage: string;
  retry?: TransientProviderRetryConfig;
}): Promise<Response>;
declare function resolveProviderHttpRequestConfig(params: {
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
declare function fetchWithTimeoutGuarded(url: string, init: RequestInit, timeoutMs: number | undefined, fetchFn: typeof fetch, options?: {
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
declare function postTranscriptionRequest(params: GuardedPostRequestParams<BodyInit>): Promise<GuardedFetchResult>;
declare function postJsonRequest(params: GuardedPostRequestParams<unknown>): Promise<GuardedFetchResult>;
declare function postMultipartRequest(params: GuardedPostRequestParams<BodyInit>): Promise<GuardedFetchResult>;
declare function requireTranscriptionText(value: string | undefined, missingMessage: string): string;
//#endregion
export { type ProviderAttributionPolicy, type ProviderEndpointClass, type ProviderEndpointResolution, type ProviderOperationDeadline, type ProviderOperationRetryStage, type ProviderOperationTimeoutMs, type ProviderRequestAuthOverride, type ProviderRequestCapabilities, type ProviderRequestCapabilitiesInput, type ProviderRequestCapability, type ProviderRequestCompatibilityFamily, type ProviderRequestPolicyInput, type ProviderRequestPolicyResolution, type ProviderRequestProxyOverride, type ProviderRequestTlsOverride, type ProviderRequestTransport, type ProviderRequestTransportOverrides, type TransientProviderRetryConfig, type TransientProviderRetryOptions, type TransientProviderRetryParams, assertOkOrThrowHttpError, assertOkOrThrowProviderError, assertProviderBinaryResponseContent, buildAudioTranscriptionFormData, createProviderHttpError, createProviderOperationDeadline, createProviderOperationTimeoutResolver, executeProviderOperationWithRetry, extractProviderErrorDetail, extractProviderRequestId, fetchProviderDownloadResponse, fetchProviderOperationResponse, fetchWithTimeout, fetchWithTimeoutGuarded, formatProviderErrorPayload, formatProviderHttpErrorMessage, normalizeBaseUrl, pollProviderOperationJson, postJsonRequest, postMultipartRequest, postTranscriptionRequest, providerOperationRetryConfig, readProviderBinaryResponse, readProviderJsonArrayFieldResponse, readProviderJsonObjectResponse, readProviderJsonResponse, readResponseTextLimited, requireTranscriptionText, resolveAudioTranscriptionUploadFileName, resolveProviderEndpoint, resolveProviderHttpRequestConfig, resolveProviderOperationTimeoutMs, resolveProviderRequestCapabilities, resolveProviderRequestHeaders, resolveProviderRequestPolicy, sanitizeConfiguredModelProviderRequest, truncateErrorDetail, waitProviderOperationPollInterval };