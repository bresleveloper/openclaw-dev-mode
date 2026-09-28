import "../../runtime-api-B8EDHhvw.js";
import { q as OpenClawConfig } from "../../runtime-types-D_4MTyiD.js";
import "../../auth-rate-limit-CSTFxQlr.js";
import "ws";
import { IncomingMessage, ServerResponse } from "node:http";
//#region src/plugin-sdk/webhook-memory-guards.d.ts
/** In-memory fixed-window limiter used by webhook ingress handlers. */
type FixedWindowRateLimiter = {
  /** Return true once the key exceeds its allowed request count in the current window. */
  isRateLimited: (key: string, nowMs?: number) => boolean;
  /** Number of tracked keys currently retained in memory. */
  size: () => number;
  /** Drop all tracked keys and reset pruning state. */
  clear: () => void;
};
/** Default webhook ingress rate-limit settings for plugin monitors. */
export declare const WEBHOOK_RATE_LIMIT_DEFAULTS: Readonly<{
  windowMs: 60000;
  maxRequests: 120;
  maxTrackedKeys: 4096;
}>;
/** Create a simple fixed-window rate limiter for in-memory webhook protection. */
export declare function createFixedWindowRateLimiter(options: {
  /** Duration of one fixed window in milliseconds. */
  windowMs: number;
  /** Maximum accepted requests per key during one window. */
  maxRequests: number;
  /** Maximum number of keys retained before oldest entries are pruned. */
  maxTrackedKeys: number;
  /** Optional interval for expired-window pruning. Defaults to `windowMs`. */
  pruneIntervalMs?: number;
}): FixedWindowRateLimiter;
//#endregion
//#region src/plugin-sdk/webhook-request-guards.d.ts
/** Body-read profile for webhook payload limits before or after authentication. */
type WebhookBodyReadProfile = "pre-auth" | "post-auth";
/** Default in-flight concurrency limits for webhook request pipelines. */
export declare const WEBHOOK_IN_FLIGHT_DEFAULTS: Readonly<{
  maxInFlightPerKey: 8;
  maxTrackedKeys: 4096;
}>;
/** Per-key in-flight limiter used to bound concurrent webhook handlers. */
type WebhookInFlightLimiter = {
  /** Acquire one in-flight slot for a key, returning false when the key is at capacity. */
  tryAcquire: (key: string) => boolean;
  /** Release one slot for a key after the handler completes. */
  release: (key: string) => void;
  /** Number of keys with retained in-flight state. */
  size: () => number;
  /** Drop all retained in-flight state. */
  clear: () => void;
};
/** Create an in-memory limiter that caps concurrent webhook handlers per key. */
export declare function createWebhookInFlightLimiter(options?: {
  /** Maximum concurrent handlers allowed for one key. */
  maxInFlightPerKey?: number;
  /** Maximum number of keys retained before oldest entries are pruned. */
  maxTrackedKeys?: number;
}): WebhookInFlightLimiter;
/** Read and parse a JSON webhook body, rejecting malformed or oversized payloads consistently. */
export declare function readJsonWebhookBodyOrReject(params: {
  /** Incoming request body stream to read and parse as JSON. */
  req: IncomingMessage;
  /** Response used for JSON parse, body size, timeout, or close failures. */
  res: ServerResponse;
  /** Optional maximum body size override in bytes. */
  maxBytes?: number;
  /** Optional body read timeout override in milliseconds. */
  timeoutMs?: number;
  /** Default limit profile to use when explicit limits are omitted. */
  profile?: WebhookBodyReadProfile;
  /** Treat an empty body as `{}` instead of rejecting it as invalid JSON. */
  emptyObjectOnEmpty?: boolean;
  /** Response body for malformed JSON. */
  invalidJsonMessage?: string;
  /** Response status for malformed JSON. */
  invalidJsonStatusCode?: number;
}): Promise<{
  ok: true;
  value: unknown;
} | {
  ok: false;
}>;
//#endregion
//#region src/plugin-sdk/webhook-targets.d.ts
/** Normalize a webhook path to a leading slash without a trailing slash. */
export declare function normalizeWebhookPath(raw: string): string;
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
//#region src/plugin-sdk/webhook-ingress.d.ts
export declare function resolveRequestClientIp(req?: IncomingMessage, trustedProxies?: string[], allowRealIpFallback?: boolean): string | undefined;
//#endregion
export type { OpenClawConfig, WebhookInFlightLimiter };