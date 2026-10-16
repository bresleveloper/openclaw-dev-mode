import { F as GatewayAuthRateLimitConfig } from "../types.openclaw-DWWUw8hA.js";
import { Ji as PluginRegistry, hs as RateLimitConfig, ms as AuthRateLimiter, qi as PluginHttpRouteRegistration } from "../agent-harness-runtime-DZjstJNb.js";
import { C as DEFAULT_WEBHOOK_MAX_BODY_BYTES, D as readRequestBodyWithLimit, O as requestBodyErrorToText, S as createWebhookAnomalyTracker, T as isRequestBodyLimitError, _ as WEBHOOK_ANOMALY_STATUS_CODES, a as applyBasicWebhookRequestGuards, b as createBoundedCounter, c as isJsonContentType, g as WEBHOOK_ANOMALY_COUNTER_DEFAULTS, h as FixedWindowRateLimiter, i as WebhookInFlightLimiter, l as readJsonWebhookBodyOrReject, m as BoundedCounter, n as WEBHOOK_IN_FLIGHT_DEFAULTS, o as beginWebhookRequestPipelineOrReject, r as WebhookBodyReadProfile, s as createWebhookInFlightLimiter, t as WEBHOOK_BODY_READ_DEFAULTS, u as readWebhookBodyOrReject, v as WEBHOOK_RATE_LIMIT_DEFAULTS, x as createFixedWindowRateLimiter, y as WebhookAnomalyTracker } from "../webhook-request-guards-B3FpDTVl.js";
import WebSocket$1 from "ws";
import { IncomingMessage, ServerResponse } from "node:http";
//#region src/plugins/http-legacy-listener.d.ts
type LegacyEndpoint = Readonly<{
  port: number;
  host?: string;
}>;
/** Configured endpoint accepting this request, or undefined on the ordinary Gateway listener. */
export declare function getWebhookLegacyListener(req: IncomingMessage): LegacyEndpoint | undefined;
//#endregion
//#region src/plugins/http-registry.d.ts
type LegacyListener = NonNullable<PluginHttpRouteRegistration["legacyListeners"]>[number];
export declare function registerPluginHttpRoute(params: {
  path?: string | null;
  fallbackPath?: string | null;
  handler: PluginHttpRouteRegistration["handler"];
  auth: PluginHttpRouteRegistration["auth"];
  match?: PluginHttpRouteRegistration["match"];
  gatewayRuntimeScopeSurface?: PluginHttpRouteRegistration["gatewayRuntimeScopeSurface"];
  /** Replace an existing canonical route owned by the same plugin and compatible route source. */
  replaceExisting?: boolean;
  /** Reuse an existing canonical route only when its nonempty plugin and source owners match. */
  reuseExistingSameOwner?: boolean;
  /** Throw when the route cannot be registered instead of returning a no-op cleanup. */
  throwOnFailure?: boolean;
  /** Compatibility endpoint forwarding into this plugin-authenticated route. */
  legacyListener?: LegacyListener;
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
export declare function withResolvedWebhookRequestPipeline<T>(params: Omit<Parameters<typeof beginWebhookRequestPipelineOrReject>[0], "inFlightKey"> & {
  /** Caller-owned target registry keyed by normalized webhook path. */
  targetsByPath: Map<string, T[]>;
  /** Explicit or derived key for concurrent request limiting. */
  inFlightKey?: string | ((args: {
    req: IncomingMessage;
    path: string;
    targets: T[];
  }) => string);
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
type WebhookAuthResponseOptions = {
  /** HTTP response used to send unauthorized or ambiguous failures. */
  res: ServerResponse;
  /** Status code for no matching target. Defaults to 401. */
  unauthorizedStatusCode?: number;
  /** Response body for no matching target. */
  unauthorizedMessage?: string;
  /** Status code for multiple matching targets. Defaults to 401. */
  ambiguousStatusCode?: number;
  /** Response body for multiple matching targets. */
  ambiguousMessage?: string;
};
type WebhookTargetAuthOptions<T, MatchResult> = WebhookAuthResponseOptions & {
  /** Candidate targets for the already-resolved webhook path. */
  targets: readonly T[];
  /** Auth or routing predicate; exactly one target must match. */
  isMatch: (target: T) => MatchResult;
};
/** Resolve an authorized target and send the standard unauthorized or ambiguous response on failure. */
export declare function resolveWebhookTargetWithAuthOrReject<T>(params: WebhookTargetAuthOptions<T, boolean | Promise<boolean>>): Promise<T | null>;
/** Synchronous variant of webhook auth resolution for cheap in-memory match checks. */
export declare function resolveWebhookTargetWithAuthOrRejectSync<T>(params: WebhookTargetAuthOptions<T, boolean>): T | null;
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
export declare function createAuthRateLimiter(config?: RateLimitConfig): AuthRateLimiter & {
  updateConfig: (config?: GatewayAuthRateLimitConfig) => void;
};
//#endregion
export { type AuthRateLimiter, type BoundedCounter, DEFAULT_WEBHOOK_MAX_BODY_BYTES, type FixedWindowRateLimiter, type RateLimitConfig, type RegisterWebhookPluginRouteOptions, type RegisterWebhookTargetOptions, type RegisteredWebhookTarget, WEBHOOK_ANOMALY_COUNTER_DEFAULTS, WEBHOOK_ANOMALY_STATUS_CODES, WEBHOOK_BODY_READ_DEFAULTS, WEBHOOK_IN_FLIGHT_DEFAULTS, WEBHOOK_RATE_LIMIT_DEFAULTS, type WebhookAnomalyTracker, type WebhookBodyReadProfile, type WebhookInFlightLimiter, type WebhookTargetMatchResult, applyBasicWebhookRequestGuards, beginWebhookRequestPipelineOrReject, createBoundedCounter, createFixedWindowRateLimiter, createWebhookAnomalyTracker, createWebhookInFlightLimiter, isJsonContentType, isRequestBodyLimitError, readJsonWebhookBodyOrReject, readRequestBodyWithLimit, readWebhookBodyOrReject, requestBodyErrorToText };