import { a as resolveRequestClientIp } from "./net-F7HGAsK5.js";
import { t as rawDataToString } from "./ws-DPQUGEy8.js";
import { d as isRequestBodyLimitError, m as requestBodyErrorToText, n as DEFAULT_WEBHOOK_MAX_BODY_BYTES, p as readRequestBodyWithLimit } from "./http-body-CbF0Hltn.js";
import { t as normalizePluginHttpPath } from "./http-path-BQYXN9ah.js";
import { n as registerPluginHttpRoute } from "./http-registry-rjRz3-ry.js";
import { _ as createBoundedCounter, a as applyBasicWebhookRequestGuards, c as isJsonContentType, d as BoundedCounter, f as FixedWindowRateLimiter, g as WebhookAnomalyTracker, h as WEBHOOK_RATE_LIMIT_DEFAULTS, i as WebhookInFlightLimiter, l as readJsonWebhookBodyOrReject, m as WEBHOOK_ANOMALY_STATUS_CODES, n as WEBHOOK_IN_FLIGHT_DEFAULTS, o as beginWebhookRequestPipelineOrReject, p as WEBHOOK_ANOMALY_COUNTER_DEFAULTS, r as WebhookBodyReadProfile, s as createWebhookInFlightLimiter, t as WEBHOOK_BODY_READ_DEFAULTS, u as readWebhookBodyOrReject, v as createFixedWindowRateLimiter, y as createWebhookAnomalyTracker } from "./webhook-request-guards-DAKACTVp.js";
import { RegisterWebhookPluginRouteOptions, RegisterWebhookTargetOptions, RegisteredWebhookTarget, WebhookTargetMatchResult, registerWebhookTarget, registerWebhookTargetWithPluginRoute, resolveSingleWebhookTarget, resolveSingleWebhookTargetAsync, resolveWebhookTargetWithAuthOrReject, resolveWebhookTargetWithAuthOrRejectSync, resolveWebhookTargets, withResolvedWebhookRequestPipeline } from "./webhook-targets.js";
import { normalizeWebhookPath, resolveWebhookPath } from "./webhook-path.js";

//#region src/gateway/auth-rate-limit.d.ts
/**
 * In-memory sliding-window rate limiter for gateway authentication attempts.
 *
 * Tracks failed auth attempts by {scope, clientIp}. A scope lets callers keep
 * independent counters for different credential classes (for example, shared
 * gateway token/password vs device-token auth) while still sharing one
 * limiter instance.
 *
 * Design decisions:
 * - Pure in-memory Map – no external dependencies; suitable for a single
 *   gateway process.  The Map is periodically pruned to avoid unbounded
 *   growth.
 * - Loopback addresses (127.0.0.1 / ::1) are exempt by default so that local
 *   CLI sessions are never locked out.
 * - The module is side-effect-free: callers create an instance via
 *   {@link createAuthRateLimiter} and pass it where needed.
 */
interface RateLimitConfig {
  /** Maximum failed attempts before blocking.  @default 10 */
  maxAttempts?: number;
  /** Sliding window duration in milliseconds.     @default 60_000 (1 min) */
  windowMs?: number;
  /** Lockout duration in milliseconds after the limit is exceeded.  @default 300_000 (5 min) */
  lockoutMs?: number;
  /** Exempt loopback (localhost) addresses from rate limiting.  @default true */
  exemptLoopback?: boolean;
  /** Background prune interval in milliseconds; set <= 0 to disable auto-prune.  @default 60_000 */
  pruneIntervalMs?: number;
}
interface RateLimitCheckResult {
  /** Whether the request is allowed to proceed. */
  allowed: boolean;
  /** Number of remaining attempts before the limit is reached. */
  remaining: number;
  /** Milliseconds until the lockout expires (0 when not locked). */
  retryAfterMs: number;
}
interface AuthRateLimiter {
  /** Check whether `ip` is currently allowed to attempt authentication. */
  check(ip: string | undefined, scope?: string): RateLimitCheckResult;
  /** Record a failed authentication attempt for `ip`. */
  recordFailure(ip: string | undefined, scope?: string): void;
  /** Reset the rate-limit state for `ip` (e.g. after a successful login). */
  reset(ip: string | undefined, scope?: string): void;
  /** Return the current number of tracked IPs (useful for diagnostics). */
  size(): number;
  /** Remove expired entries and release memory. */
  prune(): void;
  /** Dispose the limiter and cancel periodic cleanup timers. */
  dispose(): void;
}
declare function createAuthRateLimiter(config?: RateLimitConfig): AuthRateLimiter;
//#endregion
export { type AuthRateLimiter, type BoundedCounter, DEFAULT_WEBHOOK_MAX_BODY_BYTES, type FixedWindowRateLimiter, type RateLimitConfig, type RegisterWebhookPluginRouteOptions, type RegisterWebhookTargetOptions, type RegisteredWebhookTarget, WEBHOOK_ANOMALY_COUNTER_DEFAULTS, WEBHOOK_ANOMALY_STATUS_CODES, WEBHOOK_BODY_READ_DEFAULTS, WEBHOOK_IN_FLIGHT_DEFAULTS, WEBHOOK_RATE_LIMIT_DEFAULTS, type WebhookAnomalyTracker, type WebhookBodyReadProfile, type WebhookInFlightLimiter, type WebhookTargetMatchResult, applyBasicWebhookRequestGuards, beginWebhookRequestPipelineOrReject, createAuthRateLimiter, createBoundedCounter, createFixedWindowRateLimiter, createWebhookAnomalyTracker, createWebhookInFlightLimiter, isJsonContentType, isRequestBodyLimitError, normalizePluginHttpPath, normalizeWebhookPath, rawDataToString, readJsonWebhookBodyOrReject, readRequestBodyWithLimit, readWebhookBodyOrReject, registerPluginHttpRoute, registerWebhookTarget, registerWebhookTargetWithPluginRoute, requestBodyErrorToText, resolveRequestClientIp, resolveSingleWebhookTarget, resolveSingleWebhookTargetAsync, resolveWebhookPath, resolveWebhookTargetWithAuthOrReject, resolveWebhookTargetWithAuthOrRejectSync, resolveWebhookTargets, withResolvedWebhookRequestPipeline };