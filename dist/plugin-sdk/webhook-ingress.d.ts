import { Ma as PluginRegistry, ja as PluginHttpRouteRegistration } from "../agent-harness-runtime-CWL0fcg5.js";
import { d as isRequestBodyLimitError, m as requestBodyErrorToText, n as DEFAULT_WEBHOOK_MAX_BODY_BYTES, p as readRequestBodyWithLimit } from "../http-body-BodHsDOM.js";
import { n as RateLimitConfig, r as createAuthRateLimiter, t as AuthRateLimiter } from "../auth-rate-limit-Hjf3XsCY.js";
import { C as createWebhookAnomalyTracker, S as createFixedWindowRateLimiter, _ as WEBHOOK_ANOMALY_COUNTER_DEFAULTS, a as applyBasicWebhookRequestGuards, b as WebhookAnomalyTracker, c as isJsonContentType, g as FixedWindowRateLimiter, h as BoundedCounter, i as WebhookInFlightLimiter, l as readJsonWebhookBodyOrReject, n as WEBHOOK_IN_FLIGHT_DEFAULTS, o as beginWebhookRequestPipelineOrReject, r as WebhookBodyReadProfile, s as createWebhookInFlightLimiter, t as WEBHOOK_BODY_READ_DEFAULTS, u as readWebhookBodyOrReject, v as WEBHOOK_ANOMALY_STATUS_CODES, x as createBoundedCounter, y as WEBHOOK_RATE_LIMIT_DEFAULTS } from "../webhook-request-guards-af3pv1f8.js";
import WebSocket$1 from "ws";
import { IncomingMessage, ServerResponse } from "node:http";
//#region src/plugins/http-registry.d.ts
type PluginHttpRouteHandler = (req: IncomingMessage, res: ServerResponse) => Promise<boolean | void> | boolean | void;
export declare function registerPluginHttpRoute(params: {
  path?: string | null;
  fallbackPath?: string | null;
  handler: PluginHttpRouteHandler;
  auth: PluginHttpRouteRegistration["auth"];
  match?: PluginHttpRouteRegistration["match"];
  gatewayRuntimeScopeSurface?: PluginHttpRouteRegistration["gatewayRuntimeScopeSurface"];
  /** Replace an existing canonical route owned by the same plugin and compatible route source. */
  replaceExisting?: boolean;
  /** Reuse an existing canonical route only when its nonempty plugin and source owners match. */
  reuseExistingSameOwner?: boolean;
  /** Throw when the route cannot be registered instead of returning a no-op cleanup. */
  throwOnFailure?: boolean;
  pluginId?: string;
  /** Stable same-plugin sub-owner for replacement; omit consistently for legacy behavior. */
  source?: string;
  accountId?: string;
  log?: (message: string) => void;
  registry?: PluginRegistry;
}): () => void;
//#endregion
//#region src/plugin-sdk/webhook-targets.d.ts
/** Registration handle returned for one live webhook target. */
type RegisteredWebhookTarget<T> = {
  /** Normalized target stored in the caller-owned path registry. */
  target: T;
  /** Idempotently remove this target and run path teardown when it was the last target. */
  unregister: () => void;
};
/** Lifecycle hooks for path-level webhook target registration. */
type RegisterWebhookTargetOptions<T extends {
  path: string;
}> = {
  /** Called before the first target for a normalized path is stored; may return path teardown. */
  onFirstPathTarget?: (params: {
    path: string;
    target: T;
  }) => void | (() => void);
  /** Called after the last target for a normalized path has been removed. */
  onLastPathTargetRemoved?: (params: {
    path: string;
  }) => void;
};
type RegisterPluginHttpRouteParams = Parameters<typeof registerPluginHttpRoute>[0];
/** Normalize a webhook path to a leading slash without a trailing slash. */
export declare function normalizeWebhookPath(raw: string): string;
/** Canonicalize a webhook path for Gateway route identity and registry keys. */
export declare function canonicalizeWebhookRouteKey(raw: string): string;
/** Resolve a webhook path from explicit config, URL pathname, or a caller default. */
export declare function resolveWebhookPath(params: {
  webhookPath?: string;
  webhookUrl?: string;
  defaultPath?: string | null;
}): string | null;
/** Plugin HTTP route options supplied when webhook paths are registered lazily. */
type RegisterWebhookPluginRouteOptions = Omit<RegisterPluginHttpRouteParams, "path" | "fallbackPath">;
/** Register a webhook target and lazily install the matching plugin HTTP route on first use. */
export declare function registerWebhookTargetWithPluginRoute<T extends {
  path: string;
}>(params: {
  /** Caller-owned normalized path registry shared by all targets for this plugin/runtime. */
  targetsByPath: Map<string, T[]>;
  /** Target to normalize, store, and later return from the registration handle. */
  target: T;
  /** Plugin HTTP route configuration used when the first target for a path is registered. */
  route: RegisterWebhookPluginRouteOptions;
  /** Optional last-target hook forwarded to `registerWebhookTarget`. */
  onLastPathTargetRemoved?: RegisterWebhookTargetOptions<T>["onLastPathTargetRemoved"];
}): RegisteredWebhookTarget<T>;
/** Add a normalized target to a path bucket and clean up route state when the last target leaves. */
export declare function registerWebhookTarget<T extends {
  path: string;
}>(targetsByPath: Map<string, T[]>, target: T, opts?: RegisterWebhookTargetOptions<T>): RegisteredWebhookTarget<T>;
/** Resolve all registered webhook targets for the incoming request path. */
export declare function resolveWebhookTargets<T>(req: IncomingMessage, targetsByPath: Map<string, T[]>): {
  path: string;
  targets: T[];
} | null;
/** Run common webhook guards, then dispatch only when the request path resolves to live targets. */
export declare function withResolvedWebhookRequestPipeline<T>(params: {
  /** Incoming HTTP request whose pathname selects the target bucket. */
  req: IncomingMessage;
  /** HTTP response used by guard failures before handler dispatch. */
  res: ServerResponse;
  /** Caller-owned target registry keyed by normalized webhook path. */
  targetsByPath: Map<string, T[]>;
  /** Allowed methods for the common request guard. */
  allowMethods?: readonly string[];
  /** Optional per-key fixed-window limiter shared across requests. */
  rateLimiter?: FixedWindowRateLimiter;
  /** Explicit rate-limit key; defaults are owned by the request guard. */
  rateLimitKey?: string;
  /** Clock override for deterministic limiter tests. */
  nowMs?: number;
  /** Require JSON content type before dispatching to the webhook handler. */
  requireJsonContentType?: boolean;
  /** Optional in-flight limiter to cap concurrent handling for a key. */
  inFlightLimiter?: WebhookInFlightLimiter;
  /** Explicit or derived key for concurrent request limiting. */
  inFlightKey?: string | ((args: {
    req: IncomingMessage;
    path: string;
    targets: T[];
  }) => string);
  /** Status code returned when the in-flight guard rejects. */
  inFlightLimitStatusCode?: number;
  /** Response body returned when the in-flight guard rejects. */
  inFlightLimitMessage?: string;
  /** Handler invoked only after target resolution and common guards succeed. */
  handle: (args: {
    path: string;
    targets: T[];
  }) => Promise<boolean | void> | boolean | void;
}): Promise<boolean>;
/** Result of matching a request against zero, one, or multiple webhook targets. */
type WebhookTargetMatchResult<T> = {
  kind: "none";
} | {
  kind: "single";
  target: T;
} | {
  kind: "ambiguous";
};
/** Match exactly one synchronous target or report whether resolution was empty or ambiguous. */
export declare function resolveSingleWebhookTarget<T>(targets: readonly T[], isMatch: (target: T) => boolean): WebhookTargetMatchResult<T>;
/** Async variant of single-target resolution for auth checks that need I/O. */
export declare function resolveSingleWebhookTargetAsync<T>(targets: readonly T[], isMatch: (target: T) => Promise<boolean>): Promise<WebhookTargetMatchResult<T>>;
/** Resolve an authorized target and send the standard unauthorized or ambiguous response on failure. */
export declare function resolveWebhookTargetWithAuthOrReject<T>(params: {
  /** Candidate targets for the already-resolved webhook path. */
  targets: readonly T[];
  /** HTTP response used to send unauthorized or ambiguous failures. */
  res: ServerResponse;
  /** Auth or routing predicate; exactly one target must match. */
  isMatch: (target: T) => boolean | Promise<boolean>;
  /** Status code for no matching target. Defaults to 401. */
  unauthorizedStatusCode?: number;
  /** Response body for no matching target. */
  unauthorizedMessage?: string;
  /** Status code for multiple matching targets. Defaults to 401. */
  ambiguousStatusCode?: number;
  /** Response body for multiple matching targets. */
  ambiguousMessage?: string;
}): Promise<T | null>;
/** Synchronous variant of webhook auth resolution for cheap in-memory match checks. */
export declare function resolveWebhookTargetWithAuthOrRejectSync<T>(params: {
  /** Candidate targets for the already-resolved webhook path. */
  targets: readonly T[];
  /** HTTP response used to send unauthorized or ambiguous failures. */
  res: ServerResponse;
  /** Synchronous auth or routing predicate; exactly one target must match. */
  isMatch: (target: T) => boolean;
  /** Status code for no matching target. Defaults to 401. */
  unauthorizedStatusCode?: number;
  /** Response body for no matching target. */
  unauthorizedMessage?: string;
  /** Status code for multiple matching targets. Defaults to 401. */
  ambiguousStatusCode?: number;
  /** Response body for multiple matching targets. */
  ambiguousMessage?: string;
}): T | null;
//#endregion
//#region src/infra/ws.d.ts
export declare function rawDataToString(data: WebSocket$1.RawData, encoding?: BufferEncoding): string;
//#endregion
//#region src/plugins/http-path.d.ts
/** Normalizes plugin HTTP paths to leading-slash form with optional fallback. */
export declare function normalizePluginHttpPath(path?: string | null, fallback?: string | null): string | null;
//#endregion
//#region src/plugin-sdk/webhook-ingress.d.ts
export declare function resolveRequestClientIp(req?: IncomingMessage, trustedProxies?: string[], allowRealIpFallback?: boolean): string | undefined;
//#endregion
export { type AuthRateLimiter, type BoundedCounter, DEFAULT_WEBHOOK_MAX_BODY_BYTES, type FixedWindowRateLimiter, type RateLimitConfig, type RegisterWebhookPluginRouteOptions, type RegisterWebhookTargetOptions, type RegisteredWebhookTarget, WEBHOOK_ANOMALY_COUNTER_DEFAULTS, WEBHOOK_ANOMALY_STATUS_CODES, WEBHOOK_BODY_READ_DEFAULTS, WEBHOOK_IN_FLIGHT_DEFAULTS, WEBHOOK_RATE_LIMIT_DEFAULTS, type WebhookAnomalyTracker, type WebhookBodyReadProfile, type WebhookInFlightLimiter, type WebhookTargetMatchResult, applyBasicWebhookRequestGuards, beginWebhookRequestPipelineOrReject, createAuthRateLimiter, createBoundedCounter, createFixedWindowRateLimiter, createWebhookAnomalyTracker, createWebhookInFlightLimiter, isJsonContentType, isRequestBodyLimitError, readJsonWebhookBodyOrReject, readRequestBodyWithLimit, readWebhookBodyOrReject, requestBodyErrorToText };